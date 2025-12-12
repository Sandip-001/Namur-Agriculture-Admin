import React, { useContext, useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
  Marker,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MyContext } from "../../../App";
import axiosInstance from "../../../utils/axiosInstance";

const mapStyle = {
  width: "100%",
  height: "100vh",
};

// stable color pick by id (so color doesn't change each render)
const COLORS = [
  "#1abc9c",
  "#3498db",
  "#9b59b6",
  "#f39c12",
  "#e74c3c",
  "#2ecc71",
  "#6b7280",
  "#10b981",
];
function colorForId(id) {
  if (!id && id !== 0) return COLORS[Math.floor(Math.random() * COLORS.length)];
  return COLORS[id % COLORS.length];
}

// Center of polygon
const getCenter = (coords) => {
  let latSum = 0,
    lngSum = 0;
  coords.forEach(([lat, lng]) => {
    latSum += lat;
    lngSum += lng;
  });
  return [latSum / coords.length, lngSum / coords.length];
};

// Component to add SVG patterns to the map for product image fills
function SVGPatternDefs({ landMapData }) {
  const map = useMap();
  const patternsCreated = useRef({}); // track created patterns

  useMapEvents({
    load: () => createPatterns(),
    zoomend: () => createPatterns(),
    moveend: () => createPatterns(),
  });

  const createPatterns = () => {
    if (!map || !landMapData?.length) return;

    // ensure an overlayPane svg exists
    setTimeout(() => {
      const overlayPane = map.getPanes()?.overlayPane;
      if (!overlayPane) return;
      const svgElement = overlayPane.querySelector("svg");
      if (!svgElement) return;

      let defs = svgElement.querySelector("defs");
      if (!defs) {
        defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        svgElement.insertBefore(defs, svgElement.firstChild);
      }

      landMapData.forEach((land) => {
        // for each matched user that has food_products create a pattern id unique by map_id + user_id
        (land.matched_lands || []).forEach((m) => {
          const products = m.food_products || [];
          if (!products.length) return;

          const patternId = `pattern-map-${land.map_id}-user-${m.user_id}`;
          if (patternsCreated.current[patternId]) return; // already created

          const pattern = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "pattern"
          );
          pattern.setAttribute("id", patternId);
          pattern.setAttribute("patternUnits", "userSpaceOnUse");
          pattern.setAttribute("patternContentUnits", "userSpaceOnUse");

          // layout logic: if single product smaller tile, if multiple grid
          const num = products.length;
          if (num === 1) {
            pattern.setAttribute("width", "48");
            pattern.setAttribute("height", "48");
            const img = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "image"
            );
            img.setAttributeNS(
              "http://www.w3.org/1999/xlink",
              "href",
              products[0].product_image
            );
            img.setAttribute("width", "44");
            img.setAttribute("height", "44");
            img.setAttribute("x", "2");
            img.setAttribute("y", "2");
            img.setAttribute("opacity", "0.85");
            img.setAttribute("preserveAspectRatio", "xMidYMid slice");
            pattern.appendChild(img);
          } else if (num === 2) {
            pattern.setAttribute("width", "100");
            pattern.setAttribute("height", "50");
            products.forEach((p, idx) => {
              const img = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "image"
              );
              img.setAttributeNS(
                "http://www.w3.org/1999/xlink",
                "href",
                p.product_image
              );
              img.setAttribute("width", "45");
              img.setAttribute("height", "45");
              img.setAttribute("x", idx * 50 + 2.5);
              img.setAttribute("y", "2.5");
              img.setAttribute("opacity", "0.85");
              img.setAttribute("preserveAspectRatio", "xMidYMid slice");
              pattern.appendChild(img);
            });
          } else {
            const cols = Math.ceil(Math.sqrt(num));
            const tile = 48;
            pattern.setAttribute("width", cols * tile);
            pattern.setAttribute("height", cols * tile);
            products.forEach((p, idx) => {
              const row = Math.floor(idx / cols);
              const col = idx % cols;
              const img = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "image"
              );
              img.setAttributeNS(
                "http://www.w3.org/1999/xlink",
                "href",
                p.product_image
              );
              img.setAttribute("width", "44");
              img.setAttribute("height", "44");
              img.setAttribute("x", col * tile + 2);
              img.setAttribute("y", row * tile + 2);
              img.setAttribute("opacity", "0.85");
              img.setAttribute("preserveAspectRatio", "xMidYMid slice");
              pattern.appendChild(img);
            });
          }

          defs.appendChild(pattern);
          patternsCreated.current[patternId] = true;
        });
      });
    }, 80);
  };

  useEffect(() => {
    if (map && landMapData?.length) createPatterns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, landMapData]);

  return null;
}

export default function LandMapPage() {
  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [landMapData, setLandMapData] = useState([]);
  const [mapReady, setMapReady] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(14);

  function ZoomWatcher({ setZoomLevel }) {
    const map = useMapEvents({
      zoomend: () => {
        setZoomLevel(map.getZoom());
      },
    });
    return null;
  }

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    fetchLandMapData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLandMapData = async () => {
    try {
      setProgress(20);
      const res = await axiosInstance.get("/api/land-maps/match-land");
      setLandMapData(res.data?.data || []);
      setProgress(100);
    } catch (err) {
      console.error("Error fetching data:", err);
      setAlertBox({
        open: true,
        msg: "Failed to fetch data",
        error: true,
      });
      setProgress(100);
    }
  };

  return (
    <MapContainer
      center={[16.4307, 77.2655]}
      zoom={14}
      style={mapStyle}
      whenReady={() => setMapReady(true)}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <ZoomWatcher setZoomLevel={setZoomLevel} />

      {mapReady && <SVGPatternDefs landMapData={landMapData} />}

      {landMapData.map((land) => {
        const center = getCenter(land.coordinates);
        const fillColor = colorForId(land.map_id);
        // determine if any matched user has food_products
        const matched = land.matched_lands || [];
        const usersWithProducts = matched.filter(
          (m) => m.food_products && m.food_products.length > 0
        );
        const hasProducts = usersWithProducts.length > 0;

        // create marker icon for product icons (show first user's products)
        let multiProductIcon = null;
        if (hasProducts) {
          const productsForMarker = usersWithProducts[0].food_products.slice(
            0,
            3
          );
          const productIconsHTML =
            productsForMarker
              .map(
                (p) =>
                  `<img src="${p.product_image}" 
                  style="width:32px;height:32px;border-radius:50%;border:2px solid white;margin-left:-6px;box-shadow:0 2px 8px rgba(0,0,0,0.3);" 
                  alt="${p.product_name}" crossorigin="anonymous" />`
              )
              .join("") || "";
          multiProductIcon = L.divIcon({
            html: `<div style="display:flex;align-items:center;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${productIconsHTML}</div>`,
            className: "",
            iconSize: [100, 50],
            iconAnchor: [50, 25],
          });
        }

        return (
          <React.Fragment key={land.map_id}>
            <Polygon
              positions={land.coordinates}
              pathOptions={{
                color: fillColor,
                weight: 2,
                fillOpacity: 0.85,
                fill: true,
                fillColor: fillColor,
              }}
              ref={(ref) => {
                if (ref && hasProducts) {
                  // if there are multiple users with products, prefer the first user's pattern for fill
                  const firstUser = usersWithProducts[0];
                  const patternId = `pattern-map-${land.map_id}-user-${firstUser.user_id}`;
                  const element = ref._path;
                  if (element) {
                    element.style.fill = `url(#${patternId})`;
                    element.style.fillOpacity = "0.95";
                  }
                } else {
                  // ensure plain color fill when no product
                  const element = ref && ref._path;
                  if (element) {
                    element.style.fill = fillColor;
                    element.style.fillOpacity = "0.7";
                  }
                }
              }}
            >
              <Popup
                maxWidth={420}
                className="custom-popup"
                closeButton={true}
                autoClose={false}
              >
                <div
                  style={{
                    padding: "10px",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  {/* If there are matched users, list each user and their details */}
                  {matched.length > 0 ? (
                    matched.map((m, idx) => (
                      <div
                        key={m.user_id || idx}
                        style={{
                          marginBottom: "14px",
                          paddingBottom: "12px",
                          borderBottom:
                            idx !== matched.length - 1
                              ? "1px dashed #e5e7eb"
                              : "none",
                        }}
                      >
                        {/* User header */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "10px",
                          }}
                        >
                          <img
                            src={m.profile_image_url}
                            alt={m.username}
                            crossOrigin="anonymous"
                            style={{
                              width: "56px",
                              height: "56px",
                              borderRadius: "50%",
                              border: "3px solid #3B82F6",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <h4
                              style={{
                                margin: 0,
                                fontSize: "1rem",
                                fontWeight: 700,
                                color: "#1F2937",
                              }}
                            >
                              {m.username}
                            </h4>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "0.9rem",
                                color: "#6B7280",
                                fontWeight: 600,
                              }}
                            >
                              📞 {m.mobile}
                            </p>
                          </div>
                        </div>

                        {/* Land details for this matched user */}
                        <div style={{ marginBottom: "8px" }}>
                          <h5
                            style={{
                              margin: "0 0 8px 0",
                              fontSize: "0.95rem",
                              fontWeight: 700,
                              color: "#1F2937",
                            }}
                          >
                            🏞️{" "}
                            {m.land_name ||
                              `Land ${land.survey_no}/${land.hissa_no}`}
                          </h5>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "6px",
                              fontSize: "0.85rem",
                              color: "#4B5563",
                            }}
                          >
                            <div>
                              <strong>📍 District:</strong> {land.district}
                            </div>
                            <div>
                              <strong>🏘️ Village:</strong> {land.village}
                            </div>
                            <div>
                              <strong>📋 Survey:</strong> {land.survey_no}/
                              {land.hissa_no}
                            </div>
                            <div>
                              <strong>📏 Size:</strong>{" "}
                              {m.farm_size || land.area_acres} Acres
                            </div>
                          </div>
                        </div>

                        {/* Products for this user (if any) */}
                        {m.food_products && m.food_products.length > 0 ? (
                          <div>
                            <h5
                              style={{
                                margin: "0 0 10px 0",
                                fontSize: "1rem",
                                fontWeight: 700,
                                color: "#1F2937",
                              }}
                            >
                              🌱 Products ({m.food_products.length})
                            </h5>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                              }}
                            >
                              {m.food_products.map((product, pidx) => (
                                <div
                                  key={pidx}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "8px",
                                    backgroundColor: "#F9FAFB",
                                    borderRadius: "8px",
                                    border: "1px solid #E5E7EB",
                                  }}
                                >
                                  <img
                                    src={product.product_image}
                                    alt={product.product_name}
                                    crossOrigin="anonymous"
                                    style={{
                                      width: "45px",
                                      height: "45px",
                                      borderRadius: "8px",
                                      objectFit: "cover",
                                      border: "2px solid white",
                                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                    }}
                                  />
                                  <div style={{ flex: 1 }}>
                                    <div
                                      style={{
                                        fontWeight: 700,
                                        fontSize: "0.9rem",
                                        color: "#1F2937",
                                        marginBottom: "2px",
                                      }}
                                    >
                                      {product.product_name}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "0.75rem",
                                        color: "#6B7280",
                                      }}
                                    >
                                      {product.category_name} •{" "}
                                      {product.subcategory_name}
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      backgroundColor: "#10B981",
                                      color: "white",
                                      padding: "4px 10px",
                                      borderRadius: "12px",
                                      fontSize: "0.8rem",
                                      fontWeight: 700,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {product.acres} Acres
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          // No products for this matched user; explicitly mention none
                          <div
                            style={{
                              padding: "8px 0",
                              color: "#6B7280",
                              fontSize: "0.9rem",
                            }}
                          >
                            This user has no food products listed for this land.
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    // No matched users at all: show land-only info
                    <div>
                      <h4
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: "#1F2937",
                        }}
                      >
                        Land details
                      </h4>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "6px",
                          fontSize: "0.9rem",
                          color: "#4B5563",
                        }}
                      >
                        <div>
                          <strong>📍 District:</strong> {land.district}
                        </div>
                        <div>
                          <strong>🏘️ Village:</strong> {land.village}
                        </div>
                        <div>
                          <strong>📋 Survey:</strong> {land.survey_no}/
                          {land.hissa_no}
                        </div>
                        <div>
                          <strong>📏 Size:</strong> {land.area_acres} Acres
                        </div>
                      </div>
                      <div style={{ marginTop: "10px", color: "#6B7280" }}>
                        No matched user found for this land.
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            </Polygon>

            {/* Permanent tooltip over polygon center showing survey/hissa */}
            {zoomLevel >= 16 && (
              <Marker position={center} opacity={0} interactive={false}>
                <Tooltip
                  permanent
                  direction="center"
                  className="custom-tooltip-survey"
                >
                  {land.survey_no}/{land.hissa_no}
                </Tooltip>
              </Marker>
            )}

            {/* Marker with product icons for lands that have products */}
            {hasProducts && multiProductIcon && zoomLevel >= 16 && (
              <Marker position={center} icon={multiProductIcon}>
                <Tooltip permanent direction="top" className="custom-tooltip">
                  {usersWithProducts[0].food_products
                    .map((p) => p.product_name)
                    .join(", ")}
                </Tooltip>
              </Marker>
            )}
          </React.Fragment>
        );
      })}

      <style>{`
        .leaflet-container {
          background: #f0f0f0;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          padding: 0;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          width: auto !important;
          min-width: 300px;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        .custom-popup .leaflet-popup-close-button {
          color: #1F2937 !important;
          font-size: 22px !important;
          padding: 6px !important;
          font-weight: bold !important;
        }
        .custom-tooltip {
          background: white !important;
          border: 2px solid #3B82F6 !important;
          border-radius: 8px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
          padding: 4px 8px !important;
          font-weight: 600 !important;
          font-size: 0.85rem !important;
        }
        .custom-tooltip::before {
          border-top-color: #3B82F6 !important;
        }
        .custom-tooltip-survey {
          background: rgba(255,255,255,0.95) !important;
          border: 1px solid rgba(0,0,0,0.08) !important;
          border-radius: 6px !important;
          padding: 6px 8px !important;
          font-weight: 700 !important;
          font-size: 0.9rem !important;
          color: #111827 !important;
        }
      `}</style>
    </MapContainer>
  );
}
