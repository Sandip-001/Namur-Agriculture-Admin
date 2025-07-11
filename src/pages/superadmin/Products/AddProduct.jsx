import React, { useContext, useEffect, useState } from "react";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";

import { Button, CircularProgress, MenuItem, Select } from "@mui/material";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { MyContext } from "../../../App";

//breadcrumb code
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
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const AddProduct = () => {
  const context = useContext(MyContext);
  const { setIsHideSidebarAndHeader, setAlertBox } = context;

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  const subCategories = ["Animals", "Fruits", "Toys"];

  const [subCatName, setSubCatName] = useState("");
  const [productName, setProductName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [productImage, setProductImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get first file only
    if (file) {
      setProductImage(file); // Store the selected image
      setAlertBox({
        msg: "Image uploaded successfully",
        open: true,
        error: false,
      });
    }
  };

  // Remove Image
  const removeImage = (e) => {
    e.preventDefault();
    setProductImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //setIsLoading(true);
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
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <Select
                        value={subCatName}
                        onChange={(e) => setSubCatName(e.target.value)}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        className="w-100"
                        required
                      >
                        <MenuItem value="">
                          <em>Select Sub-Category</em> {/* placeholder */}
                        </MenuItem>
                        {subCategories.map((subCat, index) => (
                          <MenuItem key={index} value={subCat}>
                            {subCat}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <input
                        type="text"
                        value={productName}
                        placeholder="Enter Product Name"
                        onChange={(e) => setProductName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="imageUploadSec">
                    <h5 className="mb-4 fw-bold text-primary">
                      Upload Product Image
                    </h5>

                    <div className="imgUploadBox d-flex flex-wrap gap-3">
                      {productImage ? (
                        <div className="uploadBox position-relative">
                          <img
                            src={URL.createObjectURL(productImage)}
                            alt="Category"
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
                      type="submit"
                      className="btn-blue btn-lg w-40 gap-2 mt-2 d-flex"
                      style={{
                        margin: "auto",
                      }}
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
