import React, { useContext, useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { MyContext } from "../../../App";
import ResponsivePagination from "../../../components/Pagination";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  useMediaQuery,
  useTheme,
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
  const totalPages = 10;

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } = useContext(MyContext);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSubAdmin, setSelectedSubAdmin] = useState(null);
  const [editedUserName, setEditedUserName] = useState("");
  const [editedPageAccess, setEditedPageAccess] = useState([]);
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPassword, setEditedPassword] = useState("");

  const allAccessPages = ["Dashboard", "Orders", "Products", "Users", "Reports", "Settings"];

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setProgress(20);
    setProgress(100);
  }, []);

  const getDummySubAdmins = () => {
    return [
      {
        no: 1,
        subAdminName: "Amit Sharma",
        accessPages: ["Dashboard", "Orders", "Products"],
        email: "amit.sharma@example.com",
        password: "Amit@1234",
      },
      {
        no: 2,
        subAdminName: "Priya Verma",
        accessPages: ["Users", "Reports"],
        email: "priya.verma@example.com",
        password: "Priya@4567",
      },
      {
        no: 3,
        subAdminName: "Ravi Mehta",
        accessPages: ["Dashboard", "Settings"],
        email: "ravi.mehta@example.com",
        password: "Ravi@7890",
      },
      {
        no: 4,
        subAdminName: "Sneha Kapoor",
        accessPages: ["Orders", "Reports", "Settings"],
        email: "sneha.kapoor@example.com",
        password: "Sneha@2345",
      },
    ];
  };

  const dummyData = getDummySubAdmins();

  const handleEditClick = (item) => {
    setSelectedSubAdmin(item);
    setEditedUserName(item.subAdminName);
    setEditedPageAccess(item.accessPages);
    setEditedEmail(item.email);
    setEditedPassword(item.password);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedSubAdmin(null);
    setEditedUserName("");
    setEditedPageAccess([]);
    setEditedEmail("");
    setEditedPassword("");
  };

  const handleSaveChanges = () => {
    setAlertBox({
      open: true,
      msg: "Sub-admin details updated successfully!",
      error: false,
    });
    setEditModalOpen(false);
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
        Swal.fire("Deleted!", "Sub-admin has been deleted.", "success");
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
                  <th>NO</th>
                  <th>NAME</th>
                  <th>EMAIL ID</th>
                  <th>ACCESS PAGES</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {dummyData.length > 0 ? (
                  dummyData.map((item, index) => (
                    <tr key={index}>
                      <td># {item.no}</td>
                      <td>{item.subAdminName}</td>
                      <td>{item.email}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-2 justify-content-center">
                          {item.accessPages.map((page, i) => (
                            <span
                              key={i}
                              className="badge rounded-pill text-bg-primary px-3 py-2"
                              style={{ fontSize: "0.8rem", fontWeight: "500" }}
                            >
                              {page}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2 align-item-center justify-content-center">
                          <button className="btn btn-sm btn-success" onClick={() => handleEditClick(item)}>
                            <FaPencilAlt />
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(item.no)}>
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">No data found</td>
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

          <FormControl fullWidth>
            <InputLabel >Access Pages</InputLabel>
            <Select
              input={<OutlinedInput label="Page Access" />}
              multiple
              value={editedPageAccess}
              onChange={(e) => setEditedPageAccess(e.target.value)}
              renderValue={(selected) => selected.join(', ')}
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
            label="Email"
            margin="normal"
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
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
          <Button onClick={handleModalClose} variant="outlined">Cancel</Button>
          <Button onClick={handleSaveChanges} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubAdminList;
