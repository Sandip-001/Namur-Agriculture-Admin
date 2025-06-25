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

const AdvertisementList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // or calculate based on data length

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAdvertisement, setSelectedAdvertisement] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedNumber, setEditedNumber] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
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

  const getDummyAdvertisements = () => {
    return [
      {
        no: 1,
        title: "High-Quality Organic Fertilizer for Sale",
        contact: "9876543210",
        description:
          "Boost your crop yield naturally with our certified organic fertilizers. Safe for all soil types.",
        image:
          "https://media.istockphoto.com/id/671712984/photo/farmer-hand-giving-chemical-fertilizer-to-young-tree.jpg?s=612x612&w=0&k=20&c=42be5akioApJsOaNNQLqGZSM-KWldlgI_pZcYdlafss=",
      },
      {
        no: 2,
        title: "Affordable Tractor Rental Service",
        contact: "9123456789",
        description:
          "Rent powerful tractors and farming equipment at low rates. Available across multiple districts.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc1blRopq3BJNCFW-Rd9qCmVWz5m9iVEgikg&s",
      },
      {
        no: 3,
        title: "Premium Dairy Cattle for Sale",
        contact: "9988776655",
        description:
          "Well-bred, high-yield dairy cows available with proper health records and vaccination.",
        image:
          "https://media.istockphoto.com/id/1319467946/photo/young-black-and-white-cow-heifer-in-a-meadow-looking-in-the-camera.jpg?s=612x612&w=0&k=20&c=Z1maGtrEMrbAEVw6ZTJwyvq2_rkolky9LJX34mSZ6Kg=",
      },
      {
        no: 4,
        title: "Natural Pest Control Solutions",
        contact: "9090909090",
        description:
          "Eco-friendly pest control products for sustainable farming. No harmful chemicals.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShqU65fEvVwXrNt3RNMkmeOALXBkX0kfOWnw&s",
      },
    ];
  };

  const dummyData = getDummyAdvertisements();

  const handleEditClick = (ad) => {
    setSelectedAdvertisement(ad);
    setEditedTitle(ad.title);
    setEditedNumber(ad.contact);
    setEditedDescription(ad.description);
    setEditedImage(ad.image);
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
    setSelectedAdvertisement(null);
    setEditedTitle("");
    setEditedNumber("");
    setEditedDescription("");
    setEditedImage(null);
  };

  const handleSaveChanges = () => {
    // You can send API call here
    setAlertBox({
      open: true,
      msg: "Advertisement updated successfully!",
      error: false,
    });
    setEditModalOpen(false);
  };

  const handleDeleteClick = async (catId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this advertisement?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // await deleteCourse(courseId); // your delete API or logic
        Swal.fire("Deleted!", "Advertisement has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Advertisement List</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/add-advertisement"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">
                Add Advertisement
              </Button>
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
                  <th>CONTACT NUMBER</th>
                  <th>DESCRIPTION</th>
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

                      <td>{item.contact}</td>

                      <td>
                        {item.description.split(" ").slice(0, 8).join(" ") +
                          (item.description.split(" ").length > 8 ? "..." : "")}
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
            label="Contact Number"
            fullWidth
            inputMode="numeric"
            maxLength="10"
            margin="normal"
            value={editedNumber}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              setEditedNumber(numericValue.slice(0, 10)); // Limit to 10 digits
            }}
          />

          <TextField
            label="Description"
            multiline
            rows={5}
            fullWidth
            margin="normal"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
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

export default AdvertisementList;
