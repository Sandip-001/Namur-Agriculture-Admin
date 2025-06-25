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
} from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";

const NewsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // or calculate based on data length

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedLink, setEditedLink] = useState("");
  const [editedImage, setEditedImage] = useState(null);

  /*const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));*/

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setProgress(20);
    setProgress(100);
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getDummyNews = () => {
    return [
      {
        no: 1,
        title: "India Launches New Agricultural Policy 2025",
        url: "https://www.example.com/news/agriculture-policy-2025",
        image:
          "https://www.shutterstock.com/image-photo/farmer-happy-woman-tablet-greenhouse-260nw-2353782951.jpg",
      },
      {
        no: 2,
        title: "Organic Farming Gains Popularity Among Young Farmers",
        url: "https://www.example.com/news/organic-farming-trend",
        image:
          "https://bsmedia.business-standard.com/_media/bs/img/article/2024-07/17/full/1721190621-2022.jpg",
      },
      {
        no: 3,
        title: "New Cattle Breed Introduced in Southern States",
        url: "https://www.example.com/news/new-cattle-breed",
        image:
          "https://www.shutterstock.com/image-photo/blurred-image-farmers-use-tablets-600nw-2328625639.jpg",
      },
      {
        no: 4,
        title: "Vegetable Exports Hit Record High in 2025",
        url: "https://www.example.com/news/vegetable-export-growth",
        image:
          "https://t4.ftcdn.net/jpg/05/95/55/89/360_F_595558921_z1JnF4ieH75XlWoDPuh1Os97QkPnb4dx.jpg",
      },
    ];
  };

  const dummyData = getDummyNews();

  const handleEditClick = (news) => {
    setSelectedNews(news);
    setEditedTitle(news.title);
    setEditedLink(news.url);
    setEditedImage(news.image);
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

  const handleSaveChanges = () => {
    // You can send API call here
    setAlertBox({
      open: true,
      msg: "News updated successfully!",
      error: false,
    });
    setEditModalOpen(false);
  };

  const handleDeleteClick = async (catId) => {
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
        // await deleteCourse(courseId); // your delete API or logic
        Swal.fire("Deleted!", "News has been deleted.", "success");
      } catch (error) {
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
                  <th>NO</th>
                  <th>IMAGE</th>
                  <th>TITLE</th>
                  <th>URL</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {dummyData.length > 0 ? (
                  dummyData.map((item, index) => (
                    <tr key={index}>
                      <td># {item.no}</td>

                      <td>
                        <a
                          href={item.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open full image"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            width={100}
                            height={100}
                            style={{
                              objectFit: "cover",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                          />
                        </a>
                      </td>

                      <td>{item.title}</td>

                      <td>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#0d6efd",
                            textDecoration: "none",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.textDecoration = "underline")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.textDecoration = "none")
                          }
                        >
                          {item.url}
                        </a>
                      </td>

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

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleModalClose}
        fullWidth
        //fullScreen={fullScreen}
      >
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