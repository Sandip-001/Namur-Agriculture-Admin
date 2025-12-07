import React, { useContext, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
  Marker,
  Tooltip,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MyContext } from "../../../App";
import axiosInstance from "../../../utils/axiosInstance";

const mapStyle = {
  width: "100%",
  height: "100vh",
};

function getRandomColor() {
  const colors = [
    "#1abc9c",
    "#3498db",
    "#9b59b6",
    "#f39c12",
    "#e74c3c",
    "#2ecc71",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Component to add SVG patterns to the map
function SVGPatternDefs({ landMapData }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !landMapData.length) return;

    // Get the SVG overlay pane
    const svgElement = map.getPanes().overlayPane.querySelector('svg');
    if (!svgElement) return;

    // Create or get defs element
    let defs = svgElement.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svgElement.insertBefore(defs, svgElement.firstChild);
    }

    // Create patterns for each land
    landMapData.forEach((land) => {
      if (land.food_products && land.food_products.length > 0) {
        const patternId = `pattern-${land.land_id}`;
        
        // Remove existing pattern if any
        const existingPattern = defs.querySelector(`#${patternId}`);
        if (existingPattern) {
          existingPattern.remove();
        }

        // Create pattern element
        const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        pattern.setAttribute('id', patternId);
        pattern.setAttribute('patternUnits', 'userSpaceOnUse');
        
        // Adjust pattern size based on number of products
        const products = land.food_products;
        const numProducts = products.length;
        
        if (numProducts === 1) {
          // Single product - smaller tiles
          pattern.setAttribute('width', '40');
          pattern.setAttribute('height', '40');
          
          const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
          image.setAttribute('href', products[0].product_image);
          image.setAttribute('width', '35');
          image.setAttribute('height', '35');
          image.setAttribute('x', '2.5');
          image.setAttribute('y', '2.5');
          image.setAttribute('opacity', '0.7');
          pattern.appendChild(image);
        } else if (numProducts === 2) {
          // Two products - side by side
          pattern.setAttribute('width', '80');
          pattern.setAttribute('height', '40');
          
          products.forEach((product, idx) => {
            const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            image.setAttribute('href', product.product_image);
            image.setAttribute('width', '35');
            image.setAttribute('height', '35');
            image.setAttribute('x', idx * 40 + 2.5);
            image.setAttribute('y', '2.5');
            image.setAttribute('opacity', '0.7');
            pattern.appendChild(image);
          });
        } else {
          // Multiple products - grid layout
          const cols = Math.ceil(Math.sqrt(numProducts));
          const tileSize = 40;
          pattern.setAttribute('width', cols * tileSize);
          pattern.setAttribute('height', cols * tileSize);
          
          products.forEach((product, idx) => {
            const row = Math.floor(idx / cols);
            const col = idx % cols;
            
            const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            image.setAttribute('href', product.product_image);
            image.setAttribute('width', '35');
            image.setAttribute('height', '35');
            image.setAttribute('x', col * tileSize + 2.5);
            image.setAttribute('y', row * tileSize + 2.5);
            image.setAttribute('opacity', '0.7');
            pattern.appendChild(image);
          });
        }
        
        defs.appendChild(pattern);
      }
    });
  }, [map, landMapData]);

  return null;
}

// Center of polygon
const getCenter = (coords) => {
  let latSum = 0, lngSum = 0;
  coords.forEach(([lat, lng]) => {
    latSum += lat;
    lngSum += lng;
  });
  return [latSum / coords.length, lngSum / coords.length];
};

export default function LandMapPage() {
  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [landMapData, setLandMapData] = useState([]);
  const [selectedLand, setSelectedLand] = useState(null);

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    fetchLandMapData();
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
    <MapContainer center={[16.4307, 77.2655]} zoom={14} style={mapStyle}>
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <SVGPatternDefs landMapData={landMapData} />

      {landMapData.map((land) => {
        const center = getCenter(land.coordinates);
        const randomColor = getRandomColor();
        const hasProducts = land.food_products && land.food_products.length > 0;

        // Create marker icon with product images
        const productIconsHTML = land.food_products
          ?.slice(0, 3)
          .map(
            (p) =>
              `<img src="${p.product_image}" 
                style="width:32px;height:32px;border-radius:50%;border:2px solid white;margin-left:-6px;box-shadow:0 2px 8px rgba(0,0,0,0.3);" 
                alt="${p.product_name}" />`
          )
          .join("") || "";

        const multiProductIcon = L.divIcon({
          html: `<div style="display:flex;align-items:center;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${productIconsHTML}</div>`,
          className: "",
          iconSize: [100, 50],
          iconAnchor: [50, 25],
        });

        return (
          <React.Fragment key={land.land_id}>
            <Polygon
              positions={land.coordinates}
              pathOptions={{
                color: randomColor,
                weight: 3,
                fillOpacity: hasProducts ? 0.8 : 0.5,
                fillColor: hasProducts ? `url(#pattern-${land.land_id})` : randomColor,
              }}
              eventHandlers={{
                click: () => {
                  setSelectedLand(land);
                },
              }}
            >
              <Popup maxWidth={350} className="custom-popup">
                <div style={{ 
                  padding: '10px',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  {/* User Info */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '12px',
                    paddingBottom: '12px',
                    borderBottom: '2px solid #e5e7eb'
                  }}>
                    <img
                      src={land.profile_image_url}
                      alt={land.username}
                      style={{ 
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: '3px solid #3B82F6',
                        objectFit: 'cover'
                      }}
                    />
                    <div>
                      <h4 style={{ 
                        margin: '0 0 4px 0',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: '#1F2937'
                      }}>
                        {land.username}
                      </h4>
                      <p style={{ 
                        margin: 0,
                        fontSize: '0.9rem',
                        color: '#6B7280',
                        fontWeight: '600'
                      }}>
                        📞 {land.mobile}
                      </p>
                    </div>
                  </div>

                  {/* Land Details */}
                  <div style={{ 
                    marginBottom: '12px',
                    paddingBottom: '12px',
                    borderBottom: '2px solid #e5e7eb'
                  }}>
                    <h5 style={{ 
                      margin: '0 0 8px 0',
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: '#1F2937'
                    }}>
                      🏞️ {land.land_name}
                    </h5>
                    <div style={{ 
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '6px',
                      fontSize: '0.85rem',
                      color: '#4B5563'
                    }}>
                      <div><strong>📍 District:</strong> {land.district}</div>
                      <div><strong>🏘️ Village:</strong> {land.village}</div>
                      <div><strong>📋 Survey:</strong> {land.survey_no}/{land.hissa_no}</div>
                      <div><strong>📏 Size:</strong> {land.farm_size} Acres</div>
                    </div>
                  </div>

                  {/* Products */}
                  {land.food_products && land.food_products.length > 0 && (
                    <div>
                      <h5 style={{ 
                        margin: '0 0 10px 0',
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: '#1F2937'
                      }}>
                        🌱 Products ({land.food_products.length})
                      </h5>
                      <div style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        {land.food_products.map((product, idx) => (
                          <div 
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px',
                              backgroundColor: '#F9FAFB',
                              borderRadius: '8px',
                              border: '1px solid #E5E7EB'
                            }}
                          >
                            <img
                              src={product.product_image}
                              alt={product.product_name}
                              style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                                border: '2px solid white',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ 
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                color: '#1F2937',
                                marginBottom: '2px'
                              }}>
                                {product.product_name}
                              </div>
                              <div style={{ 
                                fontSize: '0.75rem',
                                color: '#6B7280'
                              }}>
                                {product.category_name} • {product.subcategory_name}
                              </div>
                            </div>
                            <div style={{
                              backgroundColor: '#10B981',
                              color: 'white',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              whiteSpace: 'nowrap'
                            }}>
                              {product.acres} Acres
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            </Polygon>

            {/* Marker with product icons */}
            {land.food_products && land.food_products.length > 0 && (
              <Marker position={center} icon={multiProductIcon}>
                <Tooltip 
                  permanent 
                  direction="top"
                  className="custom-tooltip"
                  style={{
                    backgroundColor: 'white',
                    border: '2px solid #3B82F6',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  {land.food_products.map((p) => p.product_name).join(", ")}
                </Tooltip>
              </Marker>
            )}
          </React.Fragment>
        );
      })}

      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          padding: 0;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        .custom-tooltip {
          background: white !important;
          border: 2px solid #3B82F6 !important;
          border-radius: 8px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
        }
        .custom-tooltip::before {
          border-top-color: #3B82F6 !important;
        }
      `}</style>
    </MapContainer>
  );
}