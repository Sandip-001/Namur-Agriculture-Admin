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
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Box,
  CircularProgress,
} from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";
import axiosInstance from "../../../utils/axiosInstance";

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editedSubCategory, setEditedSubCategory] = useState("");
  const [editedCategoryId, setEditedCategoryId] = useState("");
  const [breedInput, setBreedInput] = useState(""); // Single input
  const [editedBreeds, setEditedBreeds] = useState([]);
  const [showBreedInput, setShowBreedInput] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedImage, setEditedImage] = useState(null);

  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addBreed = () => {
    if (!breedInput.trim()) return;

    setEditedBreeds((prev) => [...prev, breedInput.trim()]);
    setBreedInput(""); // reset input
  };

  const removeBreed = (index) => {
    setEditedBreeds((prev) => prev.filter((_, i) => i !== index));
  };

  const checkIfCategoryNeedsBreeds = (categoryName) => {
    if (categoryName === "food" || categoryName === "animal") {
      setShowBreedInput(true);
    } else {
      setShowBreedInput(false);
      setEditedBreeds([]); // reset when category is not food/animal
    }
  };

  // 📌 Fetch products + subcategories from API
  const fetchProducts = async () => {
    try {
      setProgress(20);
      const [prodRes, subCatRes] = await Promise.all([
        axiosInstance.get("/api/products"),
        axiosInstance.get("/api/subcategories"),
      ]);
      setProducts(prodRes.data || []);
      setSubCategories(subCatRes.data || []);
      setProgress(100);
    } catch (err) {
      console.error("Error fetching products:", err);
      setAlertBox({
        open: true,
        msg: "Failed to load products",
        error: true,
      });
    }
  };

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  // 📌 Filter products
  useEffect(() => {
    if (selectedSubCategory === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) => p.subcategory_name === selectedSubCategory)
      );
    }
  }, [selectedSubCategory, products]);

  // Only apply pagination when no filter is active
  const isFiltered = selectedSubCategory !== "All";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = !isFiltered
    ? filteredProducts.slice(startIndex, startIndex + itemsPerPage)
    : filteredProducts;

  // totalPages = only for non-filter mode
  const totalPages = !isFiltered
    ? Math.ceil(filteredProducts.length / itemsPerPage)
    : 1;

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditedSubCategory(product.subcategory_id);
    setEditedCategoryId(product.category_id);
    setEditedBreeds(product.breeds || []);
    setEditedName(product.name);
    setEditedImage(product.image_url);
    setEditModalOpen(true);

    checkIfCategoryNeedsBreeds(product.category_name?.toLowerCase());
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setEditedImage(file);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
    setEditedSubCategory("");
    setEditedBreeds([]);
    setEditedName("");
    setEditedImage(null);
  };

  const handleSubCategoryChange = async (subCatId) => {
    setEditedSubCategory(subCatId);

    // find subcategory object
    const subCat = subCategories.find((s) => s.id === subCatId);
    if (!subCat) return;

    // update category ID
    setEditedCategoryId(subCat.category_id);

    // check if category needs breed input
    const categoryName = subCat.category_name?.toLowerCase();
    checkIfCategoryNeedsBreeds(categoryName);
  };

  // 📌 Save changes (PUT request)
  const handleSaveChanges = async () => {
    if (!selectedProduct) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", editedName);
      formData.append("subcategory_id", editedSubCategory);
      formData.append("category_id", editedCategoryId);
      formData.append("breeds", JSON.stringify(editedBreeds));
      if (editedImage && typeof editedImage !== "string") {
        formData.append("image", editedImage);
      }

      await axiosInstance.put(`/api/products/${selectedProduct.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsLoading(false);
      setAlertBox({
        open: true,
        msg: "Product updated successfully!",
        error: false,
      });
      handleModalClose();
      await fetchProducts();
    } catch (err) {
      console.error("Error updating product:", err);
      setIsLoading(false);
      setAlertBox({
        open: true,
        msg: "Failed to update product",
        error: true,
      });
    }
  };

  // 📌 Delete product
  const handleDeleteClick = async (id) => {
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
        await axiosInstance.delete(`/api/products/${id}`);
        Swal.fire("Deleted!", "Product has been deleted.", "success");
        await fetchProducts();
      } catch {
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

        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <FormControl size="small" sx={{ width: "100%" }}>
            <InputLabel>Filter by Sub-Category</InputLabel>
            <Select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              label="Filter by Sub-Category"
            >
              <MenuItem value="All">All</MenuItem>
              {subCategories.map((subCat) => (
                <MenuItem key={subCat.id} value={subCat.name}>
                  {subCat.name}
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
                  <th>ID</th>
                  <th>PRODUCT IMAGE</th>
                  <th>NAME</th>
                  <th>CATEGORY</th>
                  <th>SUB-CATEGORY</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((item, index) => (
                    <tr
                      key={item.id}
                      className="tableRow"
                      onClick={() => handleEditClick(item)}
                    >
                      <td>{startIndex + index + 1}</td>
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
                          "No image"
                        )}
                      </td>
                      <td>{item.name}</td>
                      <td>{item.category_name}</td>
                      <td>{item.subcategory_name}</td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={(e) => {
                              e.stopPropagation(); // 🔥 Stops row click event
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
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedSubCategory === "All" && (
          <ResponsivePagination
            page={currentPage}
            count={totalPages}
            onChange={(e, value) => setCurrentPage(value)}
          />
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={handleModalClose} fullWidth>
        <DialogTitle className="d-flex justify-content-between align-items-center">
          Edit Product
          <IconButton onClick={handleModalClose}>
            <IoCloseSharp />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Sub-Category</InputLabel>
            <Select
              value={editedSubCategory}
              onChange={(e) => handleSubCategoryChange(e.target.value)}
              label="Select Sub-category"
            >
              {subCategories.map((subCat) => (
                <MenuItem key={subCat.id} value={subCat.id}>
                  {subCat.name}
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

          {showBreedInput && (
            <div className="mt-3">
              <label className="fw-bold">Breeds</label>

              {/* Input + Add Button */}
              <div className="d-flex gap-2 mt-2">
                <TextField
                  label="Enter breed name"
                  fullWidth
                  value={breedInput}
                  onChange={(e) => setBreedInput(e.target.value)}
                />
                <Button variant="contained" onClick={addBreed}>
                  Add
                </Button>
              </div>

              {/* Display List of Breeds */}
              <div className="mt-3 d-flex flex-wrap gap-2">
                {editedBreeds.map((breed, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center px-3 py-1 rounded-pill bg-light border"
                  >
                    <span>{breed}</span>
                    <IconButton size="small" onClick={() => removeBreed(index)}>
                      <IoCloseSharp />
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductList;
