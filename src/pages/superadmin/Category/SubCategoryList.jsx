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
  Box,
} from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";

const SubCategoryList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // or calculate based on data length

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [editedSubCatName, setEditedSubCatName] = useState("");
  const [editedCategory, setEditedCategory] = useState("");

  const dummyCategories = ["Animals", "Foods", "Nature"];

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setProgress(20);
    setProgress(100);
  }, []); // Fetch products when page or category changes

  const getDummySubCatData = () => {
    return [
      {
        no: 1,
        subCatName: "Birds",
        catName: "Animals",
      },
      {
        no: 2,
        subCatName: "Pets",
        catName: "Animals",
      },
      {
        no: 3,
        subCatName: "Vegetables",
        catName: "Foods",
      },
      {
        no: 4,
        subCatName: "Fruits",
        catName: "Foods",
      },
    ];
  };

  const allSubCategories = getDummySubCatData();

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredSubCategories(allSubCategories);
    } else {
      setFilteredSubCategories(
        allSubCategories.filter((item) => item.catName === selectedCategory)
      );
    }
  }, [selectedCategory]);

  const handleEditClick = (item) => {
    setSelectedSubCategory(item);
    setEditedSubCatName(item.subCatName);
    setEditedCategory(item.catName);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedSubCategory(null);
    setEditedSubCatName("");
    setEditedCategory("");
  };

  const handleSaveChanges = () => {
    // Replace with API call later
    setAlertBox({
      open: true,
      msg: "Sub-Category details updated successfully!",
      error: false,
    });
    setEditModalOpen(false);
  };

  const handleDeleteClick = async (courseId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Sub-Category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // await deleteCourse(courseId); // your delete API or logic
        Swal.fire("Deleted!", "Sub-Category has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Sub-Category List</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/add-subCategory"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">
                Add Sub-Category
              </Button>
            </Link>
          </div>
        </div>

        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <FormControl size="small" sx={{ width:"100%" }}>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Filter by Category"
            >
              <MenuItem value="All">All</MenuItem>
              {dummyCategories.map((cat, index) => (
                <MenuItem key={index} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>NO</th>
                  <th>Sub-Category NAME</th>
                  <th>Category</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredSubCategories.length > 0 ? (
                  filteredSubCategories.map((item, index) => (
                    <tr key={index}>
                      <td># {item.no}</td>
                      <td>{item.subCatName}</td>
                      <td>{item.catName}</td>
                      <td>
                        <div className="d-flex gap-2 align-item-center justify-content-center">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleEditClick(item)}
                          >
                            <FaPencilAlt />
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteClick(item.no)}
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
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

      {/* ✨ Edit Sub-Category Modal */}
      <Dialog open={editModalOpen} onClose={handleModalClose} fullWidth>
        <DialogTitle className="d-flex justify-content-between align-items-center">
          Edit Sub-Category
          <IconButton onClick={handleModalClose}>
            <IoCloseSharp />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            fullWidth
            label="Sub-Category Name"
            margin="normal"
            value={editedSubCatName}
            onChange={(e) => setEditedSubCatName(e.target.value)}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Select Category</InputLabel>
            <Select
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value)}
              label="Select Category"
            >
              {dummyCategories.map((cat, idx) => (
                <MenuItem key={idx} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

export default SubCategoryList;
