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
import { format } from "date-fns";
import axiosInstance from "../../../utils/axiosInstance"; // 👈 import axios instance

const NewsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const user = JSON.parse(localStorage.getItem("Namur_user"));
  const [newsList, setNewsList] = useState([]);

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedLink, setEditedLink] = useState("");
  const [editedImage, setEditedImage] = useState(null);

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    fetchNews();
  }, []);

  // 🚀 Fetch News API
  const fetchNews = async () => {
    try {
      setProgress(20);
      const res = await axiosInstance.get(`/api/news`);
      setNewsList(res.data);
      setProgress(100);
    } catch (error) {
      console.error("Error fetching news:", error);
      setAlertBox({
        open: true,
        msg: "Failed to fetch news",
        error: true,
      });
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = newsList.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(newsList.length / itemsPerPage);

  const handleEditClick = (news) => {
    setSelectedNews(news);
    setEditedTitle(news.title);
    setEditedLink(news.url);
    setEditedImage(news.image_url);
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
    setSelectedNews(null);
    setEditedTitle("");
    setEditedLink("");
    setEditedImage(null);
  };

  // 🚀 Update News API
  const handleSaveChanges = async () => {
    if (!selectedNews) return;

    const formData = new FormData();
    formData.append("title", editedTitle);
    formData.append("url", editedLink);
    formData.append("actorName", user.name);
    formData.append("actorRole", user.role);
    if (editedImage instanceof File) {
      formData.append("image", editedImage);
    }

    try {
      await axiosInstance.put(`/api/news/${selectedNews.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAlertBox({
        open: true,
        msg: "News updated successfully!",
        error: false,
      });
      fetchNews(); // refresh list
      handleModalClose();
    } catch (error) {
      console.error("Error updating news:", error);
      setAlertBox({
        open: true,
        msg: "Failed to update news",
        error: true,
      });
    }
  };

  // 🚀 Delete News API
  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this news?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/api/news/${id}`, {
          data: {
            actorName: user.name,
            actorRole: user.role,
          },
        });
        // 🚀 Update UI instantly
        setNewsList((prev) => prev.filter((item) => item.id !== id));

        Swal.fire("Deleted!", "News has been deleted.", "success");

        // (optional) re-fetch after small delay
        // setTimeout(fetchNews, 200);
      } catch (error) {
        console.log(error);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">News List</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/add-news"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">Add News</Button>
            </Link>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>ID</th>
                  <th>IMAGE</th>
                  <th>TITLE</th>
                  <th>TIME</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {paginatedNews.length > 0 ? (
                  paginatedNews.map((item, index) => (
                    <tr key={item.id} className="tableRow">
                      <td># {startIndex + index + 1}</td>

                      <td>
                        {item.image_url && (
                          <a
                            href={item.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={item.image_url}
                              alt={item.title}
                              width={70}
                              height={70}
                              style={{
                                objectFit: "cover",
                                borderRadius: "6px",
                              }}
                            />
                          </a>
                        )}
                      </td>

                      <td
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEditClick(item)}
                      >
                        {item.title}
                      </td>

                      <td>
                        {item.created_at
                          ? format(
                              new Date(item.created_at),
                              "do MMM yyyy, hh:mm a"
                            )
                          : "-"}
                      </td>

                      <td>
                        <div className="d-flex gap-2 align-item-center justify-content-center">
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteClick(item.id)}
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
          Edit News
          <IconButton onClick={handleModalClose}>
            <IoCloseSharp />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />

          <TextField
            label="Url"
            fullWidth
            margin="normal"
            value={editedLink}
            onChange={(e) => setEditedLink(e.target.value)}
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

export default NewsList;
