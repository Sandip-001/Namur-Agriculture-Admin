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
  TextField,
  Button,
  IconButton,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { IoCloseSharp } from "react-icons/io5";

const AdvertisementList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // or calculate based on data length

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAdvertisement, setSelectedAdvertisement] = useState(null);

  // New fields
  const [product, setProduct] = useState("");
  const [productName, setProductName] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [postType, setPostType] = useState("postnow"); // or 'schedule'
  const [scheduledAt, setScheduledAt] = useState("Now"); // default

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
        product: "Onion",
        productName: "Fresh Red Onion",
        unit: "kg",
        quantity: 100,
        price: 20,
        description:
          "Farm-fresh red onions directly from our organic farm. Ideal for cooking and storing.",
        image:
          "https://acsinternationalexim.com/wp-content/uploads/2023/11/l-intro-1644158494.jpg",
        postType: "postnow",
        scheduledAt: "Now",
      },
      {
        no: 2,
        product: "Milk",
        productName: "Organic Cow Milk",
        unit: "litre",
        quantity: 50,
        price: 45,
        description:
          "Pure cow milk from grass-fed cows. No additives, fresh and healthy.",
        image: "https://static.toiimg.com/photo/113458714.cms",
        postType: "schedule",
        scheduledAt: "2025-07-03 10:00",
      },
      {
        no: 3,
        product: "Tomato",
        productName: "Desi Tomatoes",
        unit: "kg",
        quantity: 70,
        price: 25,
        description:
          "Home-grown desi tomatoes. Perfect for salads and cooking, pesticide-free.",
        image:
          "https://img.etimg.com/thumb/width-1200,height-900,imgsize-56196,resizemode-75,msid-95423774/magazines/panache/5-reasons-why-tomatoes-should-be-your-favourite-fruit-this-year.jpg",
        postType: "postnow",
        scheduledAt: "Now",
      },
      {
        no: 4,
        product: "Eggs",
        productName: "Country Chicken Eggs",
        unit: "pieces",
        quantity: 200,
        price: 7,
        description:
          "Farm-fresh country chicken eggs. Rich in nutrition and chemical-free.",
        image:
          "https://media.post.rvohealth.io/wp-content/uploads/2020/12/duck-chicken-egg-eggs-732x549-thumbnail-732x549.jpg",
        postType: "schedule",
        scheduledAt: "2025-07-02 08:30",
      },
    ];
  };

  const dummyData = getDummyAdvertisements();

  const handleEditClick = (ad) => {
    setSelectedAdvertisement(ad);
    setProduct(ad.product || "");
    setProductName(ad.productName || "");
    setUnit(ad.unit || "");
    setQuantity(ad.quantity || "");
    setPrice(ad.price || "");
    setDescription(ad.description || "");
    setImage(ad.image || null);
    setPostType(ad.postType || "postnow");
    setScheduledAt(ad.scheduledAt || "Now");
    setEditModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedAdvertisement(null);
    setProduct("");
    setProductName("");
    setUnit("");
    setQuantity("");
    setPrice("");
    setDescription("");
    setImage(null);
    setPostType("postnow");
    setScheduledAt("Now");
  };

  const handleSaveChanges = async () => {
    if (!selectedAdvertisement) return;

    const updatedData = {
      product,
      productName,
      unit,
      quantity,
      price,
      description,
      postType,
      scheduledAt:
        postType === "schedule"
          ? dayjs(scheduledAt).format("YYYY-MM-DD HH:mm")
          : "Now",
    };

    try {
      const formData = new FormData();
      for (const key in updatedData) {
        formData.append(key, updatedData[key]);
      }
      if (image && typeof image !== "string") {
        formData.append("image", image);
      } 

      //api integration here

      setAlertBox({
        open: true,
        msg: "Advertisement updated successfully!",
        error: false,
      });

      handleModalClose(); // close modal and reset states
    } catch (error) {
      console.error("Update error:", error);
      setAlertBox({
        open: true,
        msg: "Advertisement update failed!",
        error: true,
      });
    }
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
          <h5 className="mb-0">Admin Advertisement List</h5>
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
                  <th>PRODUCT NAME</th>
                  <th>QUANTITY</th>
                  <th>PRICE</th>
                  <th>DESCRIPTION</th>
                  <th>POST TYPE</th>
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

                      <td>{item.productName}</td>

                      <td>
                        {item.quantity} {item.unit}
                      </td>

                      <td>{item.price}</td>

                      <td>
                        {item.description.split(" ").slice(0, 8).join(" ") +
                          (item.description.split(" ").length > 8 ? "..." : "")}
                      </td>

                      <td>{item.postType}</td>

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
      <Dialog open={editModalOpen} onClose={handleModalClose} fullWidth>
        <DialogTitle className="d-flex justify-content-between align-items-center">
          Edit Advertisement
          <IconButton onClick={handleModalClose}>
            <IoCloseSharp />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {/* Product Dropdown */}
          <TextField
            label="Product"
            select
            fullWidth
            margin="normal"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          >
            {["Onion", "Milk", "Tomato", "Eggs"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Product Name"
            fullWidth
            margin="normal"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />

          <TextField
            label="Unit"
            select
            fullWidth
            margin="normal"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            {["kg", "gm", "litre", "pieces"].map((u) => (
              <MenuItem key={u} value={u}>
                {u}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Quantity"
            type="number"
            fullWidth
            margin="normal"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <TextField
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <FormControlLabel
            control={
              <Switch
                checked={postType === "schedule"}
                onChange={(e) => {
                  const type = e.target.checked ? "schedule" : "postnow";
                  setPostType(type);
                  setScheduledAt(type === "postnow" ? "Now" : scheduledAt);
                }}
              />
            }
            label={postType === "schedule" ? "Scheduled Post" : "Post Now"}
          />

          {postType === "schedule" && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Scheduled Date"
                value={dayjs(scheduledAt)}
                onChange={(date) => {
                  const updatedDate = dayjs(date)
                    .hour(dayjs(scheduledAt).hour())
                    .minute(dayjs(scheduledAt).minute());
                  setScheduledAt(updatedDate);
                }}
                sx={{ mt: 2, width: "100%" }}
              />
              <TimePicker
                label="Scheduled Time"
                value={dayjs(scheduledAt)}
                onChange={(time) => {
                  const updatedTime = dayjs(scheduledAt)
                    .hour(dayjs(time).hour())
                    .minute(dayjs(time).minute());
                  setScheduledAt(updatedTime);
                }}
                sx={{ mt: 2, width: "100%" }}
              />
            </LocalizationProvider>
          )}

          {/* Image upload */}
          <div className="mt-3">
            <label>Update Product Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control mt-2"
            />
            {image && (
              <img
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
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