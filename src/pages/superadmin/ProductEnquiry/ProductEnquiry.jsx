import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../../App";
import axios from "../../../utils/axiosInstance";

import {
  TextField,
  Card,
  CardContent,
  Avatar,
  Typography,
} from "@mui/material";


const ProductEnquiry = () => {
  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } = useContext(MyContext);
  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState("");

  const fetchEnquiries = async () => {
    try {
      setProgress(20);
      const res = await axios.get("/api/enquiry");
      setEnquiries(res.data || []);
      setProgress(100);
    } catch (error) {
      setAlertBox({
        open: true,
        msg: "Failed to fetch enquiries",
        error: true,
      });
    }
  };

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    fetchEnquiries();
  }, []);

  const filteredData = enquiries.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.user_name?.toLowerCase().includes(q) ||
      item.user_email?.toLowerCase().includes(q) ||
      item.user_mobile?.includes(q) ||
      item.user_district?.toLowerCase().includes(q) ||
      item.category_name?.toLowerCase().includes(q) ||
      item.subcategory_name?.toLowerCase().includes(q) ||
      item.product_name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="right-content w-100">
      <Typography variant="h4" className="fw-bold mb-3">
        Product Enquiries
      </Typography>

      <TextField
        label="Search enquiries..."
        variant="outlined"
        size="small"
        fullWidth
        className="mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Card elevation={4}>
        <CardContent className="p-0">
          <div className="table-responsive">
            <table className="table align-middle table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>User</th>
                  <th>Location</th>
                  <th>Product</th>
                  <th>Enquiry Type</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Avatar
                            alt="Profile"
                            src={item.user_profile_image}
                            sx={{ width: 40, height: 40 }}
                          />
                          <div className="d-flex flex-column">
                            <span className="fw-bold">{item.user_name}</span>
                            <small className="text-muted">
                              {item.user_mobile}
                            </small>
                            <small>{item.user_profession}</small>
                          </div>
                        </div>
                      </td>

                      <td className="text-muted">
                        {item.user_village}, {item.user_taluk}, {item.user_district} <br />
                        <small>({item.user_panchayat})</small>
                      </td>

                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={item.product_image}
                            alt="product"
                            width="40"
                            height="40"
                            style={{ borderRadius: "6px", objectFit: "cover" }}
                          />
                          <div>
                            <span className="fw-semibold">{item.product_name}</span>
                            <br />
                            <small className="text-muted">
                              {item.category_name}/{item.subcategory_name}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td className="text-capitalize fw-bold">
                        {item.enquiry_type}
                      </td>

                      <td style={{ maxWidth: "200px" }}>
                        <small className="text-truncate d-block" style={{ width: "180px" }}>
                          {item.description || "No Description"}
                        </small>
                      </td>

                      <td className="text-muted">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center p-3" colSpan="6">
                      ❌ No enquiries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductEnquiry;