import React, { useContext, useEffect, useState } from "react";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";

import { Button, CircularProgress } from "@mui/material";
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

const AddCategory = () => {
  const context = useContext(MyContext);
  const { setIsHideSidebarAndHeader, setAlertBox } = context;

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  const [catName, setCatName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [catImage, setCatImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get first file only
    if (file) {
      setCatImage(file); // Store the selected image
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
    setCatImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //setIsLoading(true);
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Create Category</h5>
          <Breadcrumbs aria-label="breadcrumb" className="ms-auto breadcrumbs_">
            <StyledBreadcrumb
              component="a"
              href="#"
              label="Category & Sub-Category"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyledBreadcrumb label="Add Category" component="a" href="#" />
          </Breadcrumbs>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-12">
              <div className="card p-4">
                <h5 className="mb-4">Basic Information</h5>

                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <h6>Category Name</h6>
                      <input
                        type="text"
                        value={catName}
                        placeholder="Enter Category Name"
                        onChange={(e) => setCatName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="imageUploadSec">
                    <h5 className="mb-4 fw-bold text-primary">
                      Upload Category Image
                    </h5>

                    <div className="imgUploadBox d-flex flex-wrap gap-3">
                      {catImage ? (
                        <div className="uploadBox position-relative">
                          <img
                            src={URL.createObjectURL(catImage)}
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
                            <h6 className="mt-2">Upload Image</h6>
                          </div>
                        </label>
                      )}
                    </div>

                    <br />

                    <Button
                      type="submit"
                      className="btn-blue btn-lg w-100 d-flex justify-content-center align-items-center gap-2"
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

export default AddCategory;