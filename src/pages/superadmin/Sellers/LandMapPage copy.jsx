 import React, { useContext, useEffect } from "react";
  import {
    MapContainer,
    TileLayer,
    Polygon,
    Popup,
    Marker,
    Tooltip,
  } from "react-leaflet";
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import { MyContext } from "../../../App";
  import { useState } from "react";
  import axiosInstance from "../../../utils/axiosInstance"; // ✅ use your axiosInstance
  
  const mapStyle = {
    width: "100%",
    height: "100vh",
  };
  
  export default function LandMapPage() {
    const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
      useContext(MyContext);
  
    useEffect(() => {
      setIsHideSidebarAndHeader(false);
      window.scrollTo(0, 0);
      fetchLandMapData();
    }, [setIsHideSidebarAndHeader]);
  
    const [landMapData, setLandMapData] = useState([]);
  
    const fetchLandMapData = async () => {
      try {
        setProgress(20);
        const res = await axiosInstance.get("/api/land-maps/match-land");
        console.log("Land Map data are", res.data?.data);
        setLandMapData(res.data?.data || []);
        setProgress(100);
      } catch (err) {
        console.error("❌ Error fetching map data:", err);
        setAlertBox({
          open: true,
          msg: "Failed to fetch data",
          error: true,
        });
        setProgress(100);
      }
    };
  
    // Function to calculate center of the polygon
    const getCenter = (coords) => {
      let latSum = 0,
        lngSum = 0;
      coords.forEach(([lat, lng]) => {
        latSum += lat;
        lngSum += lng;
      });
      return [latSum / coords.length, lngSum / coords.length];
    };
  
    return (
      <MapContainer center={[16.4307, 77.2655]} zoom={17} style={mapStyle}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  
        {landMapData.map((land) => {
          const center = getCenter(land.coordinates);
  
          // Generate DivIcon for multiple product images
          const productIconsHTML = land.food_products
            .slice(0, 3) // Only show max 3 images
            .map((p) => {
              return `<img src="${p.product_image}" style="width:40px;height:40px;border-radius:50%;border:2px solid #fff;margin-left:-8px;" />`;
            })
            .join("");
  
          const multiProductIcon = L.divIcon({
            html: `<div style="display:flex;align-items:center;">${productIconsHTML}</div>`,
            className: "multi-product-marker",
            iconSize: [50, 50],
            iconAnchor: [25, 25],
          });
  
          return (
            <React.Fragment key={land.land_id}>
              <Polygon
                positions={land.coordinates}
                pathOptions={{
                  fillColor: "#2ecc71",
                  fillOpacity: 0.4,
                  color: "#0e6251",
                  weight: 2,
                }}
              >
                <Popup maxWidth={250}>
                  <div style={{ textAlign: "center" }}>
                    {/* User Info */}
                    <img
                      src={land.profile_image_url}
                      alt="user"
                      width="50"
                      style={{ borderRadius: "50%", marginBottom: "5px" }}
                    />
                    <h4 style={{ margin: "5px 0" }}>{land.username}</h4>
                    📞 {land.mobile} <br />
                    <hr />
                    {/* Land Details */}
                    <strong>🧭 {land.land_name}</strong>
                    <p style={{ margin: "5px 0" }}>
                      📌 {land.village}, {land.taluk}, {land.district} <br />
                      🏷 Survey: {land.survey_no}/{land.hissa_no} <br />
                      🌍 Size: {land.farm_size} Acre
                    </p>
                    <hr />
                    {/* Product List */}
                    <h5 style={{ marginBottom: "8px" }}>🌱 Cultivated Crops</h5>
                    {land.food_products.map((p, index) => (
                      <div key={index} style={{ marginBottom: "5px" }}>
                        <img
                          src={p.product_image}
                          alt={p.product_name}
                          width="35"
                          style={{
                            borderRadius: "8px",
                            marginRight: "8px",
                            verticalAlign: "middle",
                          }}
                        />
                        <strong>{p.product_name}</strong> — {p.acres} Acre
                      </div>
                    ))}
                  </div>
                </Popup>
              </Polygon>
  
              {/* Marker on top of land center */}
              <Marker position={center} icon={multiProductIcon}>
                <Tooltip direction="top" offset={[0, -25]} opacity={1} permanent>
                  {land.food_products.map((p) => p.product_name).join(", ")}
                </Tooltip>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    );
  }
  
