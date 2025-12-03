import { useState } from "react";
import { useSelector } from "react-redux";
import { MyContext } from "../../../App";
import { useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import CommentsModal from "../../../components/CommentsModal";
import EditAdvertisementModal from "../Advertisement/EditAdvertisementModal";
import Swal from "sweetalert2";
import { Typography, Chip, IconButton, Box, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HandshakeIcon from "@mui/icons-material/Handshake";

function SellerProductCard({
  id,
  title,
  product_name,
  category_name,
  subcategory_name,
  quantity,
  unit,
  price,
  ad_type,
  description,
  images,
  districts,
  expiry_date,
  status,
  ad_uid,
  extra_fields,
  created_at,
  edit,
  onDelete,
  comments,
  ad,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className="card border-0 h-100"
      style={{
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        background: "white",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)";
      }}
    >
      {/* Image Section with Slider */}
      <div
        style={{ position: "relative", height: "280px", overflow: "hidden" }}
      >
        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100px",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
            zIndex: 2,
          }}
        ></div>

        {/* Status Badge */}
        <Chip
          label={status === "active" ? "Active" : "Inactive"}
          size="small"
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 3,
            bgcolor: status === "active" ? "#10B981" : "#EF4444",
            color: "white",
            fontWeight: 700,
            fontSize: "0.75rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        />

        {/* Ad Type Badge */}
        <Chip
          icon={
            ad_type?.toLowerCase() === "sell" ? (
              <ShoppingCartIcon />
            ) : (
              <HandshakeIcon />
            )
          }
          label={ad_type?.toUpperCase()}
          size="small"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 3,
            bgcolor: ad_type?.toLowerCase() === "sell" ? "#3B82F6" : "#8B5CF6",
            color: "white",
            fontWeight: 700,
            fontSize: "0.75rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            "& .MuiChip-icon": { color: "white", fontSize: "1rem" },
          }}
        />

        {/* Image Display */}
        <img
          src={
            images?.length > 0
              ? images[currentImageIndex].url
              : "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=500&h=300&fit=crop"
          }
          alt={product_name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Navigation Arrows - Only show if multiple images */}
        {images?.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevImage}
              sx={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 3,
                bgcolor: "rgba(255,255,255,0.95)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                "&:hover": {
                  bgcolor: "white",
                  transform: "translateY(-50%) scale(1.1)",
                },
                transition: "all 0.3s",
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <IconButton
              onClick={handleNextImage}
              sx={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 3,
                bgcolor: "rgba(255,255,255,0.95)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                "&:hover": {
                  bgcolor: "white",
                  transform: "translateY(-50%) scale(1.1)",
                },
                transition: "all 0.3s",
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
            </IconButton>

            {/* Image Counter */}
            <Box
              sx={{
                position: "absolute",
                bottom: 12,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 3,
                bgcolor: "rgba(0,0,0,0.7)",
                color: "white",
                px: 2,
                py: 0.5,
                borderRadius: 3,
                fontSize: "0.75rem",
                fontWeight: 600,
                backdropFilter: "blur(8px)",
              }}
            >
              {currentImageIndex + 1} / {images.length}
            </Box>
          </>
        )}
      </div>

      {/* Content Section */}
      <div className="card-body p-4">
        {/* Title & Ad UID */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#1F2937",
              fontSize: "1.1rem",
              lineHeight: 1.3,
              mb: 0.5,
            }}
          >
            {title}
          </Typography>
          <Chip
            label={ad_uid}
            size="small"
            sx={{
              bgcolor: "#F3F4F6",
              color: "#6B7280",
              fontWeight: 600,
              fontSize: "0.65rem",
              height: 24,
            }}
          />
        </div>

        {/* Product Name */}
        <Typography
          variant="body2"
          sx={{
            color: "#6B7280",
            fontWeight: 600,
            mb: 2,
          }}
        >
          {product_name}
        </Typography>

        {/* Category & Subcategory */}
        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          <Chip
            icon={<CategoryIcon />}
            label={category_name}
            size="small"
            sx={{
              bgcolor: "#EFF6FF",
              color: "#1E40AF",
              fontWeight: 600,
              border: "1px solid #DBEAFE",
              "& .MuiChip-icon": { color: "#3B82F6", fontSize: "1rem" },
            }}
          />
          {subcategory_name && (
            <Chip
              label={subcategory_name}
              size="small"
              sx={{
                bgcolor: "#F0FDF4",
                color: "#15803D",
                fontWeight: 600,
                border: "1px solid #BBF7D0",
              }}
            />
          )}
        </Box>

        {/* Quantity & Price */}
        <div className="row g-2 mb-3">
          <div className="col-6">
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "#F9FAFB",
                border: "2px solid #E5E7EB",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <InventoryIcon sx={{ fontSize: 16, color: "#6B7280" }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: "#6B7280",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    fontSize: "0.65rem",
                  }}
                >
                  Quantity
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#1F2937", fontSize: "1rem" }}
              >
                {quantity} {unit}
              </Typography>
            </Box>
          </div>
          <div className="col-6">
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: "linear-gradient(135deg, #10B981, #059669)",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <CurrencyRupeeIcon
                  sx={{ fontSize: 16, color: "rgba(255,255,255,0.9)" }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    fontSize: "0.65rem",
                  }}
                >
                  Price
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "white", fontSize: "1rem" }}
              >
                ₹{parseFloat(price).toLocaleString("en-IN")}
              </Typography>
            </Box>
          </div>
        </div>

        {/* Districts */}
        {districts && districts.length > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <LocationOnIcon sx={{ fontSize: 18, color: "#EF4444" }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "#374151" }}
            >
              {districts.join(", ")}
            </Typography>
          </Box>
        )}

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: "#6B7280",
            lineHeight: 1.6,
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </Typography>

        {/* Extra Fields */}
        {extra_fields && Object.keys(extra_fields).length > 0 && (
          <Box
            sx={{
              bgcolor: "#F0FDF4",
              border: "1px solid #BBF7D0",
              borderRadius: 2,
              p: 1.5,
              mb: 2,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: "#15803D",
                textTransform: "uppercase",
                display: "block",
                mb: 0.5,
              }}
            >
              Additional Details
            </Typography>
            {Object.entries(extra_fields).map(([key, value]) => (
              <Typography
                key={key}
                variant="caption"
                sx={{ display: "block", color: "#166534" }}
              >
                <strong>{key.replace(/_/g, " ")}:</strong> {value}
              </Typography>
            ))}
          </Box>
        )}

        {/* Expiry Date */}
        {expiry_date && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <CalendarTodayIcon sx={{ fontSize: 16, color: "#F59E0B" }} />
            <Typography
              variant="caption"
              sx={{ color: "#6B7280", fontWeight: 600 }}
            >
              Expires: {formatDate(expiry_date)}
            </Typography>
          </Box>
        )}

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            borderTop: "2px solid #F3F4F6",
            pt: 2,
          }}
        >
          <Tooltip title="Edit Advertisement" arrow>
            <IconButton
              onClick={() => edit(ad)}
              sx={{
                flex: 1,
                bgcolor: "#EFF6FF",
                color: "#3B82F6",
                borderRadius: 2,
                border: "2px solid #DBEAFE",
                "&:hover": {
                  bgcolor: "#3B82F6",
                  color: "white",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
                },
                transition: "all 0.3s",
              }}
            >
              <EditIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Advertisement" arrow>
            <IconButton
              onClick={() => onDelete(id)}
              sx={{
                flex: 1,
                bgcolor: "#FEE2E2",
                color: "#EF4444",
                borderRadius: 2,
                border: "2px solid #FECACA",
                "&:hover": {
                  bgcolor: "#EF4444",
                  color: "white",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(239, 68, 68, 0.3)",
                },
                transition: "all 0.3s",
              }}
            >
              <DeleteIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="View Comments" arrow>
            <IconButton
              onClick={() => comments(ad.comments)}
              sx={{
                flex: 1,
                bgcolor: "#F0FDF4",
                color: "#10B981",
                borderRadius: 2,
                border: "2px solid #BBF7D0",
                "&:hover": {
                  bgcolor: "#10B981",
                  color: "white",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
                },
                transition: "all 0.3s",
              }}
            >
              <CommentIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </div>
    </div>
  );
}

const SellerProductList = () => {
  const { id } = useParams();
  const location = useLocation();

  const userName = location.state?.userName || "User";

  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user } = useSelector((s) => s.auth);

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAdvertisement, setSelectedAdvertisement] = useState(null);

  const [viewMode, setViewMode] = useState("list");
  const [title, setTitle] = useState("");

  const [openCommentsModal, setOpenCommentsModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [showcreateAds, setShowcreateAds] = useState(true);

  const [ads, setAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAds, setFilteredAds] = useState([]);
  const [productsMap, setProductsMap] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const handleOpenComments = (commentsData) => {
    setComments(commentsData);
    setOpenCommentsModal(true);
  };

  const handleDeleteComment = async (index) => {
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

  const fetchAds = async () => {
    try {
      setProgress(20);
      const res = await axiosInstance.get(
        `/api/ads/filter?userType=user&userId=${id}`
      );
      console.log("User ads data are", res.data);
      setAds(res.data);

      setProgress(100);
    } catch (error) {
      console.error("Error fetching ads:", error);
      setAlertBox({
        open: true,
        msg: "Failed to load advertisements",
        error: true,
      });
      setProgress(100);
    }
  };

  useEffect(() => {
    fetchAds();
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!selectedSubCategory?.id) {
      setProductsMap([]);
      return;
    }

    const fetchProductsForSubcat = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/products/subcategory/${selectedSubCategory.id}`
        );
        // store array of products for that one subcategory
        setProductsMap(res.data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setAlertBox?.({ error: true, msg: "Failed to load products" });
      }
    };

    fetchProductsForSubcat();
  }, [selectedSubCategory]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await axiosInstance.get("/api/subcategories");
        setSubCategories(res.data || []); // keep objects AS-IS
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
        setAlertBox({ error: true, msg: "Failed to load subcategories" });
      }
    };
    fetchSubCategories();
  }, []);

  // fetch categories (as objects)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/api/categories");
        // expect array of { id, name, category_id, category_name }
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setAlertBox?.({ error: true, msg: "Failed to load categories" });
      }
    };
    fetchCategories();
  }, []);

  const handleSubCategoryChange = async (subcat) => {
    setSelectedSubCategory(subcat);

    try {
      const res = await axiosInstance.get(
        `/api/products/subcategory/${subcat.id}`
      );
      setProductsMap(res.data || []);
    } catch (err) {
      console.error("Failed loading products", err);
    }
  };

  const handleEditClick = (ad) => {
    setSelectedAdvertisement(ad);
    setEditModalOpen(true);

    // Auto select category & subcategory
    const subcat = subCategories.find((s) => s.id === ad.subcategory_id);
    const cat = categories.find((c) => c.id === subcat?.category_id);

    setSelectedCategory(cat || null);
    setSelectedSubCategory(subcat || null);
  };

  const handleDeleteClick = async (adId) => {
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
        await axiosInstance.delete(`/api/ads/${adId}`, {
          data: {
            actor_name: user?.name,
            actor_role: user.role,
          },
        });
        Swal.fire("Deleted!", "Advertisement has been deleted.", "success");
        fetchAds(true);
      } catch (error) {
        console.error("❌ Error deleting ad:", error);
        Swal.fire(
          "Error!",
          "Something went wrong while deleting the advertisement.",
          "error"
        );
      }
    }
  };

  return (
    <>
      <div className="right-content w-100">
        <div
          style={{
            minHeight: "100vh",
            background:
              "linear-gradient(135deg, #F9FAFB 0%, #EFF6FF 50%, #F3E8FF 100%)",
            padding: "2rem",
          }}
        >
          <div className="container" style={{ maxWidth: "1400px" }}>
            {/* Header */}
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  background:
                    "linear-gradient(135deg, #3B82F6, #8B5CF6, #EC4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                {userName}'s Advertisements
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#6B7280", fontWeight: 500 }}
              >
                Browse all active listings from this seller
              </Typography>
            </Box>

            {/* Cards Grid */}
            <div className="row g-4">
              {ads.map((ad) => (
                <div key={ad.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                  <SellerProductCard
                    {...ad}
                    ad={ad}
                    edit={handleEditClick}
                    onDelete={handleDeleteClick}
                    comments={handleOpenComments}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CommentsModal
        open={openCommentsModal}
        handleClose={() => setOpenCommentsModal(false)}
        comments={comments}
        handleDeleteComment={handleDeleteComment}
      />

      {/* Edit Modal Component */}
      {editModalOpen && (
        <EditAdvertisementModal
          open={editModalOpen}
          handleClose={() => setEditModalOpen(false)}
          selectedAdvertisement={selectedAdvertisement}
          fetchAds={fetchAds}
          setAlertBox={setAlertBox}
          subCategories={subCategories}
          products={productsMap}
          onSubCategoryChange={handleSubCategoryChange}
          selectedSubCategory={selectedSubCategory}
          setSelectedSubCategory={setSelectedSubCategory}
          user={user}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}
    </>
  );
};

export default SellerProductList;
