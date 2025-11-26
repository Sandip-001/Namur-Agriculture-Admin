import React, { useContext, useEffect, useState } from "react";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import { Button, CircularProgress } from "@mui/material";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { MyContext } from "../../../App";
import axiosInstance from "../../../utils/axiosInstance"; // ✅ import axios instance
import { useNavigate } from "react-router-dom";
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

const AddNews = () => {
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const { setIsHideSidebarAndHeader, setAlertBox } = context;

  const user = JSON.parse(localStorage.getItem("Namur_user"));

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newsImage, setNewsImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get first file only
    if (file) {
      setNewsImage(file); // Store the selected image
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
    setNewsImage(null);
  };

  const validateUrl = (url) => {
    try {
      new URL(url); // Will throw if invalid
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setLink(value);

    if (!validateUrl(value)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !link) {
      setAlertBox({
        msg: "Title and URL are required",
        open: true,
        error: true,
      });
      return;
    }
    if (!newsImage) {
      setAlertBox({
        msg: "Please upload a news image",
        open: true,
        error: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("url", link);
      formData.append("actorName", user.name);
      formData.append("actorRole", user.role);
      if (newsImage) {
        formData.append("image", newsImage);
      }

      const response = await axiosInstance.post("/api/news", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAlertBox({
        msg: "News created successfully",
        open: true,
        error: false,
      });

      // reset form
      setTitle("");
      setLink("");
      setNewsImage(null);
      navigate("/news-list");
      console.log("Created news:", response.data);
    } catch (err) {
      console.error("Error creating news:", err);
      setAlertBox({
        msg: err.response?.data?.message || "Something went wrong",
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
          <h5 className="mb-0">Create News</h5>
          <Breadcrumbs aria-label="breadcrumb" className="ms-auto breadcrumbs_">
            <StyledBreadcrumb
              component="a"
              href="#"
              label="News"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyledBreadcrumb label="Add News" component="a" href="#" />
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
                      <h6>Title</h6>
                      <input
                        type="text"
                        value={title}
                        placeholder="Enter News Title"
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <h6>URL</h6>
                      <input
                        type="text"
                        value={link}
                        placeholder="Enter Url"
                        onChange={handleChange}
                        required
                      />
                      {error && <small className="text-danger">{error}</small>}
                    </div>
                  </div>

                  <div className="imageUploadSec">
                    <h5 className="mb-4 fw-bold text-primary">
                      Upload News Image
                    </h5>

                    <div className="imgUploadBox d-flex flex-wrap gap-3">
                      {newsImage ? (
                        <div className="uploadBox position-relative">
                          <img
                            src={URL.createObjectURL(newsImage)}
                            alt="News"
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
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
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

export default AddNews;
