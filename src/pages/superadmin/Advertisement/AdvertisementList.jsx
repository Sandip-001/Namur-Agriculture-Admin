import React, { useContext, useEffect, useState } from "react";
import { FaPencilAlt, FaSearch } from "react-icons/fa";
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

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader, districts } =
    useContext(MyContext);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAdvertisement, setSelectedAdvertisement] = useState(null);

  // New fields
  const [isGridView, setIsGridView] = useState(false);

  const [subcategory, setSubcategory] = useState("");
  const [product, setProduct] = useState("");
  const [productName, setProductName] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [expiryDate, setExpiryDate] = useState(null);
  const [forSale, setForSale] = useState(true); // true = For Sale, false = For Rent
  const [image, setImage] = useState(null);
  const [postType, setPostType] = useState("postnow"); // or 'schedule'
  const [scheduledDate, setscheduledDate] = useState("Now"); // default

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
        subcategory: "Vegetables",
        productName: "Fresh Red Onion",
        unit: "kg",
        quantity: 100,
        price: 20,
        description:
          "Farm-fresh red onions directly from our organic farm. Ideal for cooking and storing.",
        image:
          "https://acsinternationalexim.com/wp-content/uploads/2023/11/l-intro-1644158494.jpg",
        forSale: "rent",
        postType: "postnow",
        scheduledDate: "Now",
        status: "Active",
        postedBy: "Sira Admin",
        districts: ["Mysuru", "Bangalore Urban", "Mandya"],
      },
      {
        no: 2,
        product: "Milk",
        subcategory: "Dairy Products",
        productName: "Organic Cow Milk",
        unit: "litre",
        quantity: 50,
        price: 45,
        description:
          "Pure cow milk from grass-fed cows. No additives, fresh and healthy.",
        image: "https://static.toiimg.com/photo/113458714.cms",
        forSale: "sale",
        postType: "schedule",
        scheduledDate: "2025-07-03",
        expiryDate: "2025-07-10",
        status: "Pending",
        postedBy: "Superadmin",
        districts: ["Mandya", "Chikkaballapur"],
      },
      {
        no: 3,
        product: "Tomato",
        subcategory: "Fruits & Veggies",
        productName: "Desi Tomatoes",
        unit: "kg",
        quantity: 70,
        price: 25,
        description:
          "Home-grown desi tomatoes. Perfect for salads and cooking, pesticide-free.",
        image:
          "https://img.etimg.com/thumb/width-1200,height-900,imgsize-56196,resizemode-75,msid-95423774/magazines/panache/5-reasons-why-tomatoes-should-be-your-favourite-fruit-this-year.jpg",
        forSale: "sale",
        postType: "postnow",
        scheduledDate: "Now",
        status: "Active",
        postedBy: "Mysuru Admin",
        districts: ["Mysuru", "Tumakuru"],
      },
      {
        no: 4,
        product: "Eggs",
        subcategory: "Poultry",
        productName: "Country Chicken Eggs",
        unit: "pieces",
        quantity: 200,
        price: 7,
        description:
          "Farm-fresh country chicken eggs. Rich in nutrition and chemical-free.",
        image:
          "https://media.post.rvohealth.io/wp-content/uploads/2020/12/duck-chicken-egg-eggs-732x549-thumbnail-732x549.jpg",
        forSale: "rent",
        postType: "schedule",
        scheduledDate: "2025-07-02",
        expiryDate: "2025-07-12",
        status: "Pending",
        postedBy: "Superadmin",
        districts: ["Bengaluru Rural", "Kolar"],
      },
      {
        no: 3,
        product: "Tomato",
        subcategory: "Fruits & Veggies",
        productName: "Desi Tomatoes",
        unit: "kg",
        quantity: 70,
        price: 25,
        description:
          "Home-grown desi tomatoes. Perfect for salads and cooking, pesticide-free.",
        image:
          "https://img.etimg.com/thumb/width-1200,height-900,imgsize-56196,resizemode-75,msid-95423774/magazines/panache/5-reasons-why-tomatoes-should-be-your-favourite-fruit-this-year.jpg",
        forSale: "sale",
        postType: "postnow",
        scheduledDate: "Now",
        status: "Active",
        postedBy: "Mysuru Admin",
        districts: ["Mysuru", "Tumakuru"],
      },
      {
        no: 4,
        product: "Eggs",
        subcategory: "Poultry",
        productName: "Country Chicken Eggs",
        unit: "pieces",
        quantity: 200,
        price: 7,
        description:
          "Farm-fresh country chicken eggs. Rich in nutrition and chemical-free.",
        image:
          "https://media.post.rvohealth.io/wp-content/uploads/2020/12/duck-chicken-egg-eggs-732x549-thumbnail-732x549.jpg",
        forSale: "rent",
        postType: "schedule",
        scheduledDate: "2025-07-02",
        expiryDate: "2025-07-12",
        status: "Pending",
        postedBy: "Superadmin",
        districts: ["Bangalore Rural", "Kolar"],
      },
    ];
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAds, setFilteredAds] = useState(getDummyAdvertisements());

  useEffect(() => {
    const results = getDummyAdvertisements().filter(
      (ad) =>
        ad.postedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAds(results);
  }, [searchQuery]);

  const handleEditClick = (ad) => {
    setSelectedAdvertisement(ad);
    setProduct(ad.product || "");
    setSubcategory(ad.subcategory || "");
    setProductName(ad.productName || "");
    setUnit(ad.unit || "");
    setQuantity(ad.quantity || "");
    setPrice(ad.price || "");
    setDescription(ad.description || "");
    setSelectedDistricts(ad.districts || []);
    setImage(ad.image || null);
    setForSale(ad.forSale === "sale"); // boolean: true = sale, false = rent
    setPostType(ad.postType || "postnow");
    setscheduledDate(ad.scheduledDate || "Now");
    setExpiryDate(ad.expiryDate || null);
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
    setSubcategory("");
    setProductName("");
    setUnit("");
    setQuantity("");
    setPrice("");
    setDescription("");
    setSelectedDistricts([]);
    setImage(null);
    setForSale(true);
    setPostType("postnow");
    setscheduledDate("Now");
    setExpiryDate(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedAdvertisement) return;

    const updatedData = {
      product,
      subcategory,
      productName,
      unit,
      quantity,
      price,
      description,
      postType,
      scheduledDate:
        postType === "schedule"
          ? dayjs(scheduledDate).format("YYYY-MM-DD")
          : "Now",
      expiryDate:
        postType === "schedule" && expiryDate
          ? dayjs(expiryDate).format("YYYY-MM-DD")
          : null,
      forSale: forSale ? "sale" : "rent",
      districts: JSON.stringify(selectedDistricts),
    };

    try {
      const formData = new FormData();
      for (const key in updatedData) {
        formData.append(key, updatedData[key]);
      }
      if (image && typeof image !== "string") {
        formData.append("image", image);
      }

      // TODO: Make your PUT/PATCH API call here using formData

      setAlertBox({
        open: true,
        msg: "Advertisement updated successfully!",
        error: false,
      });

      handleModalClose(); // close modal and reset
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

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          {/* Search Box */}
          <div className="position-relative w-100 w-md-50 animated-search-box">
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Search advertisements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="position-absolute top-50 translate-middle-y text-muted search-icon">
              <FaSearch />
            </span>
          </div>

          {/* Toggle Switch */}
          <div className="d-flex align-items-center justify-content-md-end w-100 w-md-50 toggle-section">
            <span className="fw-bold">List View</span>
            <div className="form-check form-switch mx-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="viewToggle"
                checked={isGridView}
                onChange={() => setIsGridView(!isGridView)}
              />
            </div>
            <span className="fw-bold">Grid View</span>
          </div>
        </div>

        {isGridView ? (
          <div className="row g-2">
            {filteredAds.map((item, index) => (
              <div key={index} className="col-6 col-md-3 col-lg-2 mb-4">
                <div className="card h-100 shadow-sm">
                  <img
                    src={item.image}
                    className="card-img-top"
                    alt={item.productName}
                    style={{ height: "130px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column p-2">
                    {/* Content Section */}
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-bold">{item.productName}</h6>
                      <small className="text-muted">{item.subcategory}</small>

                      <div className="mt-1">
                        <span className="badge bg-secondary me-1">
                          {item.quantity} {item.unit}
                        </span>
                        <span className="badge bg-success">₹{item.price}</span>
                      </div>

                      <div className="mt-2">
                        <span
                          className={`badge bg-${
                            item.forSale === "sale" ? "success" : "info"
                          } me-1`}
                        >
                          {item.forSale.toUpperCase()}
                        </span>
                        <span
                          className={`badge bg-${
                            item.postType === "postnow"
                              ? "primary"
                              : "warning text-dark"
                          }`}
                        >
                          {item.postType === "postnow"
                            ? "Post Now"
                            : "Scheduled"}
                        </span>
                      </div>

                      <div className="mt-2">
                        <span
                          className={`badge rounded-pill bg-${
                            item.status === "Active" ? "success" : "secondary"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="mt-2">
                        <strong className="d-block small">
                          {item.postedBy}
                        </strong>
                        <small className="text-muted">
                          {item.scheduledDate !== "Now"
                            ? item.scheduledDate
                            : "Instant"}
                        </small>
                      </div>

                      <div className="d-flex flex-wrap gap-1 mt-2">
                        {item.districts.map((dist, idx) => (
                          <span
                            key={idx}
                            className="badge bg-light border text-dark"
                          >
                            {dist}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Fixed Bottom Buttons */}
                    <div className="d-flex gap-2 justify-content-center mb-3">
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleEditClick(item)}
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteClick(item.no)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
                    <th>FOR</th>
                    <th>POST TYPE</th>
                    <th>STATUS</th>
                    <th>START DATE</th>
                    <th>ADD BY</th>
                    <th>DISTRICTS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {filteredAds.length > 0 ? (
                    filteredAds.map((item, index) => (
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
                              alt={item.productName}
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

                        <td>
                          <div className="fw-bold">{item.productName}</div>
                          <small className="text-muted">
                            {item.subcategory}
                          </small>
                        </td>

                        <td>
                          {item.quantity} {item.unit}
                        </td>

                        <td>₹ {item.price}</td>

                        <td>
                          <span
                            className={`badge bg-${
                              item.forSale === "sale" ? "success" : "info"
                            }`}
                          >
                            {item.forSale.toUpperCase()}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`badge bg-${
                              item.postType === "postnow"
                                ? "primary"
                                : "warning text-dark"
                            }`}
                          >
                            {item.postType === "postnow"
                              ? "Post Now"
                              : "Scheduled"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`badge rounded-pill bg-${
                              item.status === "Active" ? "success" : "secondary"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td>
                          {item.scheduledDate !== "Now" ? (
                            <span className="text-dark">
                              {item.scheduledDate}
                            </span>
                          ) : (
                            <span className="text-muted">Instant</span>
                          )}
                        </td>

                        <td>
                          <span className="fw-semibold">{item.postedBy}</span>
                        </td>

                        <td>
                          <div className="d-flex flex-wrap gap-1 justify-content-center">
                            {item.districts.map((dist, idx) => (
                              <span
                                key={idx}
                                className="badge bg-light text-dark border"
                              >
                                {dist}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleEditClick(item)}
                            >
                              <FaPencilAlt />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
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
                      <td colSpan="12" className="text-center text-muted">
                        No advertisements found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
          {/* Subcategory Dropdown */}
          <TextField
            label="Subcategory"
            select
            fullWidth
            margin="normal"
            value={selectedAdvertisement?.subcategory || ""}
            onChange={(e) =>
              setSelectedAdvertisement((prev) => ({
                ...prev,
                subcategory: e.target.value,
              }))
            }
          >
            {[
              "Vegetables",
              "Dairy Products",
              "Fruits & Veggies",
              "Poultry",
            ].map((sub) => (
              <MenuItem key={sub} value={sub}>
                {sub}
              </MenuItem>
            ))}
          </TextField>

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
            label="Title"
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
            lavvvvvvbel="Price"
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

          {/* Districts Dropdown */}
          <TextField
            label="Districts"
            select
            fullWidth
            SelectProps={{ multiple: true }}
            margin="normal"
            value={selectedDistricts}
            onChange={(e) => setSelectedDistricts(e.target.value)}
          >
            {districts.map((district) => (
              <MenuItem key={district} value={district}>
                {district}
              </MenuItem>
            ))}
          </TextField>

          {/* For Sale / Rent Toggle */}
          <FormControlLabel
            control={
              <Switch checked={forSale} onChange={() => setForSale(!forSale)} />
            }
            label={forSale ? "For Sale" : "For Rent"}
          />

          {/* Post Type Toggle (hidden for Active ) */}
          {selectedAdvertisement?.status !== "Active" && (
            <FormControlLabel
              control={
                <Switch
                  checked={postType === "schedule"}
                  onChange={(e) => {
                    const isScheduled = e.target.checked;
                    setPostType(isScheduled ? "schedule" : "postnow");

                    if (!isScheduled) {
                      setscheduledDate("Now");
                      setExpiryDate(null); // CLEAR expiry date when switching to Post Now
                    }
                  }}
                />
              }
              label={postType === "schedule" ? "Scheduled Post" : "Post Now"}
            />
          )}

          {/* Date fields only if not Active */}
          {selectedAdvertisement?.status !== "Active" &&
            postType === "schedule" && (
              <>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Scheduled Date"
                    value={dayjs(scheduledDate)}
                    onChange={(date) => setscheduledDate(date)}
                    sx={{ mt: 2, width: "100%" }}
                  />

                  <DatePicker
                    label="Expiry Date"
                    value={dayjs(expiryDate)}
                    onChange={(date) => setExpiryDate(date)}
                    sx={{ mt: 2, width: "100%" }}
                  />
                </LocalizationProvider>
              </>
            )}

          {/* Image Upload */}
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
