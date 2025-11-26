import React, { useContext, useEffect, useState } from "react";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import { Button, CircularProgress, MenuItem, Select } from "@mui/material";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";
import { MyContext } from "../../../App";
import axiosInstance from "../../../utils/axiosInstance"; // 🔹 axios instance
import { useNavigate } from "react-router-dom";
//breadcrumb
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": { backgroundColor: emphasize(backgroundColor, 0.06) },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const AddProduct = () => {
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const { setIsHideSidebarAndHeader, setAlertBox } = context;

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subCatName, setSubCatName] = useState("");
  const [productName, setProductName] = useState("");
  const [breeds, setBreeds] = useState([]);
  const [breedInput, setBreedInput] = useState("");
  const [isBreedRequired, setIsBreedRequired] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [productImage, setProductImage] = useState(null);

  // 🔹 fetch categories & subcategories
  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        const [catRes, subCatRes] = await Promise.all([
          axiosInstance.get("/api/categories"),
          axiosInstance.get("/api/subcategories"),
        ]);

        setCategories(catRes.data || []);
        setSubCategories(subCatRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setAlertBox({
          open: true,
          msg: "Failed to load categories or subcategories",
          error: true,
        });
      }
    };

    fetchData();
  }, []);

  // image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      setAlertBox({
        msg: "Image uploaded successfully",
        open: true,
        error: false,
      });
    }
  };

  const removeImage = (e) => {
    e.preventDefault();
    setProductImage(null);
  };

  const addBreed = () => {
    if (!breedInput.trim()) return;

    setBreeds([...breeds, breedInput.trim()]);
    setBreedInput("");
  };

  const removeBreed = (index) => {
    setBreeds(breeds.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !subCatName) {
      setAlertBox({ msg: "All fields are required", open: true, error: true });
      return;
    }

    // VALIDATION FOR FOOD / ANIMAL
    if (isBreedRequired && breeds.length === 0) {
      setAlertBox({
        msg: "Breeds are required for Food or Animal category",
        open: true,
        error: true,
      });
      return;
    }

    try {
      setIsLoading(true);

      const selectedSubCat = subCategories.find(
        (s) => String(s.id) === String(subCatName)
      );

      const formData = new FormData();
      formData.append("name", productName);
      formData.append("subcategory_id", subCatName);
      formData.append("category_id", selectedSubCat?.category_id || "");

      // ⭐ ADD BREEDS
      formData.append("breeds", JSON.stringify(breeds));

      if (productImage) {
        formData.append("image", productImage);
      }

      const res = await axiosInstance.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAlertBox({
        msg: res.data.message || "Product created successfully",
        open: true,
        error: false,
      });

      // reset
      setProductName("");
      setSubCatName("");
      setBreeds([]);
      setProductImage(null);
      navigate("/product-list");
    } catch (error) {
      setAlertBox({
        msg: error.response?.data?.message || "Something went wrong",
        open: true,
        error: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Create Product</h5>
          <Breadcrumbs aria-label="breadcrumb" className="ms-auto breadcrumbs_">
            <StyledBreadcrumb
              component="a"
              href="#"
              label="Product"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyledBreadcrumb label="Add Product" component="a" href="#" />
          </Breadcrumbs>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-12">
              <div className="card p-4">
                <div className="row">
                  {/* SubCategory Select */}
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <Select
                        value={subCatName}
                        onChange={(e) => {
                          setSubCatName(e.target.value);

                          const selectedSubCat = subCategories.find(
                            (s) => String(s.id) === String(e.target.value)
                          );

                          const selectedCategory = categories.find(
                            (c) => c.id === selectedSubCat?.category_id
                          );

                          const catName = selectedCategory?.name?.toLowerCase();

                          // SHOW BREEDS ONLY IF CATEGORY IS FOOD OR ANIMAL
                          if (catName === "food" || catName === "animal") {
                            setIsBreedRequired(true);
                          } else {
                            setIsBreedRequired(false);
                            setBreeds([]); // Reset breeds if not required
                          }
                        }}
                        displayEmpty
                        className="w-100"
                        required
                      >
                        <MenuItem value="">
                          <em>Select Sub-Category</em>
                        </MenuItem>
                        {subCategories.map((subCat) => (
                          <MenuItem key={subCat.id} value={subCat.id}>
                            {subCat.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </div>

                  {/* Product Name */}
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <input
                        type="text"
                        value={productName}
                        placeholder="Enter Product Name"
                        onChange={(e) => setProductName(e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  {isBreedRequired && (
                    <div className="col-md-12 mb-3">
                      <div className="form-group">
                        <div className="d-flex gap-2">
                          <input
                            type="text"
                            value={breedInput}
                            placeholder="Enter breed name"
                            onChange={(e) => setBreedInput(e.target.value)}
                            className="form-control"
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={addBreed}
                          >
                            Add
                          </Button>
                        </div>
                      </div>

                      {/* Show Added Breeds */}
                      <div className="mt-3 d-flex flex-wrap gap-2">
                        {breeds.map((breed, index) => (
                          <div key={index} className="badge bg-info p-2">
                            {breed}
                            <button
                              type="button"
                              className="btn btn-sm btn-danger ms-2"
                              onClick={() => removeBreed(index)}
                            >
                              <TiDelete />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Image Upload */}
                  <div className="imageUploadSec">
                    <h5 className="mb-4 fw-bold text-primary">
                      Upload Product Image
                    </h5>

                    <div className="imgUploadBox d-flex flex-wrap gap-3">
                      {productImage ? (
                        <div className="uploadBox position-relative">
                          <img
                            src={URL.createObjectURL(productImage)}
                            alt="Product"
                            className="w-100 h-100 object-fit-cover rounded"
                          />
                          <button
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
                            onClick={removeImage}
                          >
                            <IoCloseSharp />
                          </button>
                        </div>
                      ) : (
                        <label className="uploadBox cursor-pointer">
                          <input
                            type="file"
                            onChange={handleImageUpload}
                            accept="image/*"
                          />
                          <div className="info text-center">
                            <FaRegImages />
                          </div>
                        </label>
                      )}
                    </div>

                    <br />

                    <Button
                      type="button"
                      onClick={handleSubmit}
                      className="btn-blue btn-lg w-40 gap-2 mt-2 d-flex"
                      style={{ margin: "auto" }}
                      disabled={isLoading}
                    >
                      <FaCloudUploadAlt />
                      {isLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : (
                        "PUBLISH AND VIEW"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
