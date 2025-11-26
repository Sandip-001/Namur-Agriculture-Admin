import React, { useContext, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { MyContext } from "../../../App";
import ResponsivePagination from "../../../components/Pagination";
import karnatakaData from "../../../data/karnataka_districts_taluks_villages.json";
import axiosInstance from "../../../utils/axiosInstance"; // ✅ use your axiosInstance
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";

const SubAdminList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [subAdmins, setSubAdmins] = useState([]); // ✅ real data
  const [loading, setLoading] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSubAdmin, setSelectedSubAdmin] = useState(null);
  const [editedUserName, setEditedUserName] = useState("");
  const [editedPageAccess, setEditedPageAccess] = useState([]);
  const [editedEmail, setEditedEmail] = useState("");
  const [editedNumber, setEditedNumber] = useState("");
  const [editedQualification, setEditedQualification] = useState("");
  const [editedAddress, setEditedAddress] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState([]);

  const allAccessPages = [
    "Dashboard",
    "Categories",
    "Products",
    "Orders",
    "Users",
    "News",
    "Advertisement",
    "SubAdmins",
    "Notification",
    "History",
    "Districts",
    "FPO",
    "CropCalendar",
  ];

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    fetchSubAdmins();
  }, []);

  const fetchSubAdmins = async () => {
    try {
      setProgress(20);
      const res = await axiosInstance.get("/api/subadmins");
      setSubAdmins(res.data || []);
      setLoading(false);
      setProgress(100);
    } catch (err) {
      console.error("❌ Error fetching subadmins:", err);
      setLoading(false);
      setAlertBox({
        open: true,
        msg: "Failed to fetch subadmins",
        error: true,
      });
    }
  };

  const districtOptions = Object.keys(karnatakaData).map((d) => ({
    label: d,
    value: d,
  }));

  const handleEditClick = (item) => {
    setSelectedSubAdmin(item);
    setEditedUserName(item.name);

    // split by comma if string, else keep as array
    setEditedPageAccess(
      typeof item.page_access === "string"
        ? item.page_access.split(",").map((p) => p.trim())
        : item.page_access || []
    );

    setEditedEmail(item.email);
    setEditedNumber(item.number || ""); // API gives 'number', not 'phone'
    setEditedQualification(item.qualification || "");
    setEditedAddress(item.address || "");

    setSelectedDistricts(
      typeof item.districts === "string"
        ? item.districts.split(",").map((d) => d.trim())
        : item.districts || []
    );

    setEditedPassword(item.password || "");
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedSubAdmin(null);
    setEditedUserName("");
    setEditedPageAccess([]);
    setEditedEmail("");
    setEditedNumber("");
    setEditedQualification("");
    setEditedAddress("");
    setSelectedDistricts([]);
    setEditedPassword("");
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        name: editedUserName,
        email: editedEmail,
        phone: editedNumber,
        qualification: editedQualification,
        address: editedAddress,
        password: editedPassword,
        page_access: editedPageAccess,
        districts: selectedDistricts,
      };

      await axiosInstance.put(
        `/api/subadmins/${selectedSubAdmin.id}`,
        updatedData
      );

      setAlertBox({
        open: true,
        msg: "Sub-admin updated successfully!",
        error: false,
      });
      setEditModalOpen(false);
      fetchSubAdmins(); // refresh list
    } catch (err) {
      console.error("❌ Error updating subadmin:", err);
      setAlertBox({ open: true, msg: "Update failed", error: true });
    }
  };

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Sub-admin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/api/subadmins/${id}`);
        Swal.fire("Deleted!", "Sub-admin has been deleted.", "success");
        fetchSubAdmins();
      } catch (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">SubAdmin List</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/add-subadmin"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">Add SubAdmin</Button>
            </Link>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>DISTRICTS</th>
                  <th>ACCESS PAGES</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {loading ? (
                  <tr>
                    <td colSpan="6">Loading...</td>
                  </tr>
                ) : subAdmins.length > 0 ? (
                  subAdmins.map((item) => (
                    <tr
                      key={item.id}
                      className="tableRow"
                      onClick={() => handleEditClick(item)}
                    >
                      <td># {item.id}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {item.image_url && (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                          )}
                          <div>
                            <div className="fw-semibold">{item.name}</div>
                            <span className="text-muted">{item.number}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1 justify-content-center">
                          {item.districts?.split(",").map((dist, idx) => (
                            <span
                              key={idx}
                              className="badge bg-light text-dark border"
                            >
                              {dist.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-2 justify-content-center">
                          {item.page_access?.split(",").map((page, i) => (
                            <span
                              key={i}
                              className="badge rounded-pill text-bg-primary px-3 py-2"
                              style={{ fontSize: "0.8rem", fontWeight: "500" }}
                            >
                              {page.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2 align-item-center justify-content-center">
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(item.id);
                            }}
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <ResponsivePagination
          page={currentPage}
          count={totalPages}
          onChange={(event, value) => setCurrentPage(value)}
        />
      </div>

      {/* ✅ Edit Modal */}
      <Dialog open={editModalOpen} onClose={handleModalClose} fullWidth>
        <DialogTitle className="d-flex justify-content-between align-items-center">
          Edit Sub-Admin
          <IconButton onClick={handleModalClose}>
            <IoCloseSharp />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={editedUserName}
            onChange={(e) => setEditedUserName(e.target.value)}
          />

          <FormControl fullWidth className="mt-2">
            <InputLabel>Access Districts</InputLabel>
            <Select
              input={<OutlinedInput label="Access Districts" />}
              multiple
              value={selectedDistricts}
              onChange={(e) => setSelectedDistricts(e.target.value)}
              renderValue={(selected) => selected.join(", ")}
            >
              {districtOptions.map((dist) => (
                <MenuItem key={dist.value} value={dist.value}>
                  <Checkbox checked={selectedDistricts.includes(dist.value)} />
                  <ListItemText primary={dist.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth className="mt-3">
            <InputLabel>Access Pages</InputLabel>
            <Select
              input={<OutlinedInput label="Page Access" />}
              multiple
              value={editedPageAccess}
              onChange={(e) => setEditedPageAccess(e.target.value)}
              renderValue={(selected) => selected.join(", ")}
            >
              {allAccessPages.map((page) => (
                <MenuItem key={page} value={page}>
                  <Checkbox checked={editedPageAccess.indexOf(page) > -1} />
                  <ListItemText primary={page} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            type="email"
            label="Email"
            margin="normal"
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
          />

          <TextField
            fullWidth
            type="text"
            label="Contact no"
            margin="normal"
            value={editedNumber}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, "");
              setEditedNumber(numericValue.slice(0, 10));
            }}
          />

          <TextField
            fullWidth
            type="text"
            label="Qualification"
            margin="normal"
            value={editedQualification}
            onChange={(e) => setEditedQualification(e.target.value)}
          />

          <TextField
            fullWidth
            type="text"
            label="Address"
            margin="normal"
            value={editedAddress}
            onChange={(e) => setEditedAddress(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={editedPassword}
            onChange={(e) => setEditedPassword(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleModalClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSaveChanges}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubAdminList;
