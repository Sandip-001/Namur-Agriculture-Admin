import React, { useContext, useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import onion from "../../../assets/onion.png";
import goat from "../../../assets/goat.png";
import cow from "../../../assets/cow.png";
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
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // or calculate based on data length

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editedSubCategory, setEditedSubCategory] = useState("");
  const [editedName, setEditedName] = useState("");
  const [editedImage, setEditedImage] = useState(null);

  const dummySubCategories = ["Animals", "Vegetables",  "Fruits", "Toys"];

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setProgress(20);
    setProgress(100);
  }, []); // Fetch products when page or category changes

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getDummyProducts = () => {
    return [
      {
        no: 1,
        image: goat,
        name: "Goat",
        subCatName: "Animals",
      },
      {
        no: 2,
        image: onion,
        name: "Onion",
        subCatName: "Vegetables",
      },
      {
        no: 3,
        image: cow,
        name: "Cow",
        subCatName: "Animals",
      },
      {
        no: 4,
        image: goat,
        name: "Goat",
        subCatName: "Animals",
      },
      {
        no: 5,
        image: onion,
        name: "Onion",
        subCatName: "Vegetables",
      },
    ];
  };

  const dummyData = getDummyProducts();

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditedSubCategory(product.subCatName);
    setEditedName(product.name);
    setEditedImage(product.image);
    setEditModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedImage(file);
    }
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
    setEditedSubCategory("");
    setEditedName("");
    setEditedImage(null);
  };

  const handleSaveChanges = () => {
    // You can send API call here
    setAlertBox({
      open: true,
      msg: "Product updated successfully!",
      error: false,
    });
    setEditModalOpen(false);
  };

  const handleDeleteClick = async (courseId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // await deleteCourse(courseId); // your delete API or logic
        Swal.fire("Deleted!", "Product has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Products List</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/add-product"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">Add Product</Button>
            </Link>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>No</th>
                  <th>PRODUCT IMAGE</th>
                  <th>NAME</th>
                  <th>SUB-CATEGORY</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {dummyData.length > 0 ? (
                  dummyData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.no}</td>
                      <td>
                        <img
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          style={{ objectFit: "cover" }}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.subCatName}</td>
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

      <Dialog
        open={editModalOpen}
        onClose={handleModalClose}
        fullWidth
        //fullScreen={fullScreen}
      >
        <DialogTitle className="d-flex justify-content-between align-items-center">
          Edit Category
          <IconButton onClick={handleModalClose}>
            <IoCloseSharp />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Sub-Category</InputLabel>
            <Select
              value={editedSubCategory}
              onChange={(e) => setEditedSubCategory(e.target.value)}
              label="Select Category"
            >
              {dummySubCategories.map((subCat, idx) => (
                <MenuItem key={idx} value={subCat}>
                  {subCat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Product Name"
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

export default ProductList;
