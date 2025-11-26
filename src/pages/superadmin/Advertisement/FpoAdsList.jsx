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
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import SearchIcon from "@mui/icons-material/Search";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { IoCloseSharp } from "react-icons/io5";
import { format } from "date-fns";
import ImageHoverSlider from "../../../components/ImageHoverSlider";
import CommentsModal from "../../../components/CommentsModal";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AdsHeaderSection from "../../../components/AdsHeaderSection";

const FpoAdvertisementList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1; // or calculate based on data length

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader, districts } =
    useContext(MyContext);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAdvertisement, setSelectedAdvertisement] = useState(null);

  //create ads state
  const [showcreateAds, setShowcreateAds] = useState(true)

  // New fields
  const [viewMode, setViewMode] = useState("list");

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
  const [images, setImages] = useState([]);
  const [postType, setPostType] = useState("postnow"); // or 'schedule'
  const [scheduledDate, setscheduledDate] = useState("Now"); // default

  //Comment model state
  const [openCommentsModal, setOpenCommentsModal] = useState(false);
  const [comments, setComments] = useState([]);

  const handleOpenComments = (commentsData) => {
    setComments(commentsData);
    setOpenCommentsModal(true);
  };

  const handleDeleteComment = async (index) => {
    // Delete API call here
    console.log("Delete comment:", index);
    setComments((prev) => prev.filter((_, i) => i !== index));
  };

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
        images: [
          "https://acsinternationalexim.com/wp-content/uploads/2023/11/l-intro-1644158494.jpg",
          "https://m.media-amazon.com/images/I/51DJ-9xkuQL.jpg",
          "https://png.pngtree.com/thumb_back/fw800/background/20230901/pngtree-garlic-onions-carrots-and-onions-in-a-burlap-sack-image_13167752.jpg",
        ],
        forSale: "rent",
        postType: "postnow",
        scheduledDate: "Now",
        status: "Active",
        postedBy: "Green Harvest Farmers Group",
        contactNumber: "8637824327",
        districts: ["Mandya"],
        createdDate: "2025-06-25 10:15 AM",
        comments: [
          {
            userName: "RameshK",
            comment: "Onions were super fresh and delivered quickly!",
          },
          {
            userName: "KrishnFarm",
            comment: "Price is very reasonable. Will order again.",
          },
          {
            userName: "Sunita88",
            comment: "Packaging could be improved but quality is good.",
          },
        ],
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
        images: [
          "https://static.toiimg.com/photo/113458714.cms",
          "https://www.shutterstock.com/image-photo/dairy-products-bottles-milk-cottage-600nw-2483159649.jpg",
          "https://www.shutterstock.com/image-photo/milk-jug-pouring-into-glass-600nw-657561061.jpg",
        ],
        forSale: "sale",
        postType: "postnow",
        scheduledDate: "Now",
        status: "Active",
        postedBy: "AgriRise Collective",
        contactNumber: "9876543210",
        districts: ["Mandya"],
        createdDate: "2025-06-26 08:50 AM",
        comments: [
          {
            userName: "EcoFarms",
            comment: "Milk tastes very fresh, loved it!",
          },
          {
            userName: "AjayDeals",
            comment: "Good option for organic milk in Mandya.",
          },
          {
            userName: "Neha_R",
            comment: "Delivery was a bit late but quality compensated.",
          },
          {
            userName: "Vijay_Agro",
            comment: "Affordable and pure milk, recommend!",
          },
        ],
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
        images: [
          "https://img.etimg.com/thumb/width-1200,height-900,imgsize-56196,resizemode-75,msid-95423774/magazines/panache/5-reasons-why-tomatoes-should-be-your-favourite-fruit-this-year.jpg",
          "https://media.istockphoto.com/id/847335116/photo/tomatoes-on-the-vine.jpg?s=612x612&w=0&k=20&c=XspM2ySvUfqjnt7HL5qKyn0tyRb5qLsf1GAP6-3xQsw=",
        ],
        forSale: "sale",
        postType: "postnow",
        scheduledDate: "Now",
        status: "Active",
        postedBy: "ProsperAgro Farmers Society",
        contactNumber: "9123456789",
        districts: ["Mysuru"],
        createdDate: "2025-06-27 12:30 PM",
        comments: [
          {
            userName: "Sunita88",
            comment: "Loved the taste of these tomatoes.",
          },
          {
            userName: "FarmNetUser",
            comment: "Good size and freshness maintained during delivery.",
          },
          {
            userName: "RameshK",
            comment: "Great for salad and cooking, will order again.",
          },
        ],
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
        images: [
          "https://media.post.rvohealth.io/wp-content/uploads/2020/12/duck-chicken-egg-eggs-732x549-thumbnail-732x549.jpg",
          "https://cdn.britannica.com/94/151894-050-F72A5317/Brown-eggs.jpg",
          "https://i.abcnewsfe.com/a/1980729d-c7e4-4a16-af2a-f62aaeb79bd9/eggs-1-as-gmh-240327_1711555375191_hpMain_4_16x9.jpg?w=992",
        ],
        forSale: "rent",
        postType: "postnow",
        scheduledDate: "Now",
        status: "Active",
        postedBy: "NatureBloom Producers",
        contactNumber: "9876543210",
        districts: ["Bengaluru Rural"],
        createdDate: "2025-06-28 09:00 AM",
        comments: [
          {
            userName: "AjayDeals",
            comment: "These eggs taste just like home-raised chickens!",
          },
          {
            userName: "Neha_R",
            comment: "Very happy with the quality and packaging.",
          },
          {
            userName: "KrishnFarm",
            comment: "Good quantity for this price range.",
          },
          {
            userName: "FarmNetUser",
            comment: "Delivery was quick and eggs were fresh.",
          },
        ],
      },
    ];
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAds, setFilteredAds] = useState(getDummyAdvertisements());

  useEffect(() => {
    const results = getDummyAdvertisements().filter(
      (ad) =>
        ad.postedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.product.toLowerCase().includes(searchQuery.toLowerCase())
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
    setImages(ad.images || []);
    setForSale(ad.forSale === "sale"); // boolean: true = sale, false = rent
    setPostType(ad.postType || "postnow");
    setscheduledDate(ad.scheduledDate || "Now");
    setExpiryDate(ad.expiryDate || null);
    setEditModalOpen(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
    setImages([]);
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
      images.forEach((img, idx) => {
        if (typeof img !== "string") {
          formData.append("images", img); // new images
        }
      });

      formData.append(
        "existingImages",
        JSON.stringify(images.filter((i) => typeof i === "string"))
      ); // keep track of existing images

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
        <AdsHeaderSection
          filteredAds={filteredAds}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          title = {"FPO Advertisement List"}
          showCreateAdsButton = {showcreateAds}
          url={"/add-fpoadvertisement"}
        />

        {viewMode === "grid" ? (
          <div className="row g-2">
            {filteredAds.map((item, index) => (
              <div key={index} className="col-6 col-md-3 col-lg-2 mb-4">
                <div className="card h-100 shadow-sm">
                  <Slider
                    dots={false}
                    arrows={true}
                    autoplay={false}
                    autoplaySpeed={3000}
                    className="card-img-top"
                  >
                    {item.images.map((img, idx) => (
                      <div key={idx}>
                        <img
                          src={img}
                          alt={item.productName}
                          style={{
                            width: "100%",
                            height: "130px",
                            objectFit: "cover",
                            borderTopLeftRadius: "0.25rem",
                            borderTopRightRadius: "0.25rem",
                          }}
                        />
                      </div>
                    ))}
                  </Slider>
                  <div className="card-body d-flex flex-column p-2">
                    {/* Content Section */}
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-bold">{item.productName}</h6>
                      <small className="text-muted">{item.product}</small>

                      <div className="mt-1">
                        <span className="badge bg-secondary me-1">
                          {item.quantity} {item.unit}
                        </span>
                        <span className="badge bg-success me-1">
                          ₹{item.price}
                        </span>
                        <span
                          className={`badge bg-${
                            item.forSale === "sale" ? "success" : "info"
                          } me-1`}
                        >
                          {item.forSale.toUpperCase()}
                        </span>
                      </div>

                      <div className="mt-2">
                        <strong className="d-block small">
                          {item.postedBy}
                        </strong>
                        <small className="text-muted">
                          {item.contactNumber}
                        </small>
                      </div>

                      <div className="d-flex justify-content-between align-items-center gap-1 mt-2">
                        {item.districts.map((dist, idx) => (
                          <span
                            key={idx}
                            className="badge bg-light border text-dark"
                          >
                            {dist}
                          </span>
                        ))}

                        <span
                          style={{ fontSize: "0.7rem" }}
                          className="fw-bold"
                        >
                          {format(new Date(item.createdDate), "do MMMM yyyy")}
                        </span>
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
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={
                          () => handleOpenComments(item.comments) // You can pass the item.comments or item.no
                        }
                      >
                        💬
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
                    <th>ITEM </th>
                    <th>PRICE</th>
                    <th>FOR</th>
                    <th>CONTACT</th>
                    <th>DISTRICTS</th>
                    <th>TIME</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {filteredAds.length > 0 ? (
                    filteredAds.map((item, index) => (
                      <tr
                        key={index}
                        className="tableRow"
                        onClick={() => handleEditClick(item)}
                      >
                        <td># {item.no}</td>

                        <td
                          className="d-flex align-items-center justify-content-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ImageHoverSlider images={item.images} />
                        </td>

                        <td>
                          <div className="fw-bold">{item.productName}</div>
                          <small className="text-muted">{item.product}</small>
                        </td>

                        <td>
                          <div className="fw-bold">
                            ₹{item.price} / {item.unit}
                          </div>
                          <small className="text-muted">{item.quantity}</small>
                        </td>

                        <td>
                          <h6>
                            <span
                              className={`badge bg-${
                                item.forSale === "sale" ? "success" : "info"
                              }`}
                            >
                              {item.forSale.toUpperCase()}
                            </span>
                          </h6>
                        </td>

                        <td>
                          <div className="fw-semibold">{item.postedBy}</div>
                          <span className="text-muted">
                            {item.contactNumber}
                          </span>
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
                          {format(
                            new Date(item.createdDate),
                            "do MMMM yyyy, hh:mm a"
                          )}
                        </td>

                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            {/* Delete Button */}
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(item.no);
                              }}
                            >
                              <MdDelete />
                            </button>

                            {/* Comments Button */}
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenComments(item.comments); // You can pass the item.comments or item.no
                              }}
                            >
                              💬
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
      <CommentsModal
        open={openCommentsModal}
        handleClose={() => setOpenCommentsModal(false)}
        comments={comments}
        handleDeleteComment={handleDeleteComment}
      />
      ;{/* Edit Modal */}
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
            <label>Update Product Images:</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="form-control mt-2"
            />

            <div className="d-flex flex-wrap mt-3">
              {images.map((img, idx) => (
                <div key={idx} className="position-relative me-3 mb-3">
                  <img
                    src={
                      typeof img === "string" ? img : URL.createObjectURL(img)
                    }
                    alt="preview"
                    className="rounded"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      border: "1px solid #ddd",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                    style={{
                      //transform: "translate(50%, -50%)",
                      borderRadius: "10%",
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
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

export default FpoAdvertisementList;