import React, { useContext, useEffect, useState } from "react";
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
} from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";
import axios from "../../../utils/axiosInstance"; // use your axios instance

const CategoryList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedImage, setEditedImage] = useState(null);

  // fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/categories");
      setCategories(res.data || []);
    } catch (error) {
      console.error("Error fetching categories", error);
      setAlertBox({
        open: true,
        msg: "Failed to fetch categories",
        error: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    setProgress(20);
    fetchCategories();
    setProgress(100);
  }, []);

  const handleEditClick = (cat) => {
    setSelectedCategory(cat);
    setEditedName(cat.name);
    setEditedImage(cat.image_url);
    setEditModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setEditedImage(file);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedCategory(null);
    setEditedName("");
    setEditedImage(null);
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editedName);

      if (editedImage && typeof editedImage !== "string") {
        // only append if it's a new file, not an existing URL
        formData.append("image", editedImage);
      }

      await axios.put(`/api/categories/${selectedCategory.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAlertBox({
        open: true,
        msg: "Category updated successfully!",
        error: false,
      });

      fetchCategories();
      handleModalClose();
    } catch (error) {
      console.error("Update error:", error);
      setAlertBox({
        open: true,
        msg: "Failed to update category",
        error: true,
      });
    }
  };

  const handleDeleteClick = async (catId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/categories/${catId}`);
        Swal.fire("Deleted!", "Category has been deleted.", "success");
        fetchCategories();
      } catch (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Category List</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/add-category"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">Add Category</Button>
            </Link>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>NO</th>
                  <th>IMAGE</th>
                  <th>CATEGORY NAME</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {loading ? (
                  <tr>
                    <td colSpan="10">Loading...</td>
                  </tr>
                ) : categories.length > 0 ? (
                  categories.map((item, index) => (
                    <tr
                      key={item.id}
                      className="tableRow"
                      onClick={() => handleEditClick(item)}
                    >
                      <td># {index + 1}</td>
                      <td>
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            width={50}
                            height={50}
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <span className="text-muted">No Image Provided</span>
                        )}
                      </td>
                      <td>{item.name}</td>
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

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={handleModalClose} fullWidth>
        <DialogTitle className="d-flex justify-content-between align-items-center">
          Edit Category
          <IconButton onClick={handleModalClose}>
            <IoCloseSharp />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            label="Category Name"
            fullWidth
            margin="normal"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />

          <div className="mt-3">
            <label>Update Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control mt-2"
            />

            {editedImage && (
              <img
                src={
                  typeof editedImage === "string"
                    ? editedImage
                    : URL.createObjectURL(editedImage)
                }
                alt="Preview"
                className="mt-3 rounded"
                style={{ maxWidth: "50%", maxHeight: 200 }}
              />
            )}
          </div>
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

export default CategoryList;
