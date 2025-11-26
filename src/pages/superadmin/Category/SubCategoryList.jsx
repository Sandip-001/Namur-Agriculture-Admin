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
import axios from "../../../utils/axiosInstance";

const SubCategoryList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1; // you can update this later based on API pagination

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [editedSubCatName, setEditedSubCatName] = useState("");
  const [editedCategory, setEditedCategory] = useState("");

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setProgress(30);
      const [catRes, subCatRes] = await Promise.all([
        axios.get("/api/categories"),
        axios.get("/api/subcategories"),
      ]);

      setCategories(catRes.data);
      setSubCategories(subCatRes.data);
      setFilteredSubCategories(subCatRes.data);

      setProgress(100);
    } catch (err) {
      console.error("Error fetching data:", err);
      setAlertBox({
        open: true,
        msg: "Failed to load data",
        error: true,
      });
    }
  };

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredSubCategories(subCategories);
    } else {
      setFilteredSubCategories(
        subCategories.filter(
          (item) => item.category_id === parseInt(selectedCategory)
        )
      );
    }
  }, [selectedCategory, subCategories]);

  const handleEditClick = (item) => {
    setSelectedSubCategory(item);
    setEditedSubCatName(item.name);
    setEditedCategory(item.category_id);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedSubCategory(null);
    setEditedSubCatName("");
    setEditedCategory("");
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`/api/subcategories/${selectedSubCategory.id}`, {
        name: editedSubCatName,
        category_id: editedCategory,
      });

      setAlertBox({
        open: true,
        msg: "Sub-Category details updated successfully!",
        error: false,
      });

      fetchData();
      handleModalClose();
    } catch (error) {
      console.error("Update error:", error);
      setAlertBox({
        open: true,
        msg: "Failed to update Sub-Category",
        error: true,
      });
    }
  };

  const handleDeleteClick = async (subCatId) => {
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
        await axios.delete(`/api/subcategories/${subCatId}`);
        Swal.fire("Deleted!", "Sub-Category has been deleted.", "success");
        fetchData();
      } catch (error) {
        console.error("Delete error:", error);
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
          <FormControl size="small" sx={{ width: "100%" }}>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Filter by Category"
            >
              <MenuItem value="All">All</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
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
                    <tr key={item.id} className="tableRow"  onClick={() => handleEditClick(item)}>
                      <td># {index + 1}</td>
                      <td>{item.name}</td>
                      <td>
                        {
                          categories.find((cat) => cat.id === item.category_id)
                            ?.name
                        }
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
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
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
