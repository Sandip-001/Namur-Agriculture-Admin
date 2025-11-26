import { useContext, useEffect, useMemo, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { MyContext } from "../../../App";
import ResponsivePagination from "../../../components/Pagination";
import dayjs from "dayjs";
import { format } from "date-fns";
import ImageHoverSlider from "../../../components/ImageHoverSlider";
import CommentsModal from "../../../components/CommentsModal";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AdsHeaderSection from "../../../components/AdsHeaderSection";
import axiosInstance from "../../../utils/axiosInstance";
import EditAdvertisementModal from "./EditAdvertisementModal"; // New Component
import { useSelector } from "react-redux";

const AdvertisementList = () => {
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

  const fetchAds = async (stayOnSamePage = true) => {
    try {
      setProgress(20);
      const res = await axiosInstance.get("/api/ads");

      // ✅ Filter ads only if created_by_role is admin or subadmin
      const filteredData = (res.data || []).filter(
        (ad) =>
          ad.created_by_role === "admin" || ad.created_by_role === "subadmin"
      );

      setAds(filteredData);

      if (!searchQuery.trim()) {
        setFilteredAds(filteredData);
      }

      if (!stayOnSamePage) setCurrentPage(1);

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
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAds = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAds.slice(start, start + pageSize);
  }, [filteredAds, currentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredAds.length / pageSize));
  }, [filteredAds]);

  useEffect(() => {
    fetchAds();
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAds(ads);
    } else {
      const results = ads.filter(
        (ad) =>
          ad.creator_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ad.user_mobile?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ad.subadmin_number
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          ad.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAds(results);
    }

    setCurrentPage(1); // 🔥 Force page 1 when searching
  }, [searchQuery, ads]);

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

    // 🔥 FIX: Set parent’s selected subcategory so products load
    setSelectedSubCategory({
      id: ad.subcategory_id,
    });
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
        <AdsHeaderSection
          filteredAds={filteredAds}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          title={"Admin Advertisement List"}
          showCreateAdsButton={showcreateAds}
          url={"/add-advertisement"}
        />

        {viewMode === "grid" ? (
          <div className="row g-2">
            {paginatedAds.map((item, index) => (
              <div key={index} className="col-6 col-md-3 col-lg-2 mb-4">
                <div className="card h-100 shadow-sm">
                  {item.images.length > 1 ? (
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
                            src={img.url}
                            alt={item.product_name}
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
                  ) : (
                    <img
                      src={item.images[0]?.url}
                      alt={item.product_name}
                      style={{
                        width: "100%",
                        height: "130px",
                        objectFit: "cover",
                        borderTopLeftRadius: "0.25rem",
                        borderTopRightRadius: "0.25rem",
                      }}
                    />
                  )}

                  <div className="card-body d-flex flex-column p-2">
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-bold">{item.product_name}</h6>
                      <small className="text-muted">{item.title}</small>

                      <div className="mt-1">
                        <span className="badge bg-secondary me-1">
                          {item.quantity} {item.unit}
                        </span>
                        <span className="badge bg-success me-1">
                          ₹{item.price}
                        </span>
                        <span
                          className={`badge bg-${
                            item.ad_type === "sell" ? "success" : "info"
                          } me-1`}
                        >
                          {item.ad_type.toUpperCase()}
                        </span>
                      </div>

                      <div className="mt-2">
                        <span
                          className={`badge me-1 bg-${
                            item.post_type === "postnow"
                              ? "primary"
                              : "warning text-dark"
                          }`}
                        >
                          {item.post_type === "postnow"
                            ? "Post Now"
                            : "Scheduled"}
                        </span>

                        <span
                          className={`badge bg-${
                            item.status === "active" ? "success" : "secondary"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="mt-2">
                        <strong className="d-block small">
                          {item.creator_name}
                        </strong>
                        {/* Show role */}
                        <span className="text-muted">
                          {item.created_by_role}
                        </span>
                        {/* Show mobile number depending on role */}
                        {item.created_by_role === "user" &&
                          item.user_mobile && (
                            <div className="text-muted">{item.user_mobile}</div>
                          )}

                        {item.created_by_role === "subadmin" &&
                          item.subadmin_number && (
                            <div className="text-muted">
                              {item.subadmin_number}
                            </div>
                          )}
                      </div>

                      <div className="d-flex justify-content-between align-items-center gap-1 mt-2">
                        <span className="badge bg-light border text-dark d-flex align-items-center gap-1">
                          {item.districts.map((dist, idx) => (
                            <span
                              key={idx}
                              className="badge bg-light text-dark border"
                            >
                              {dist}
                            </span>
                          ))}
                        </span>

                        <span
                          style={{ fontSize: "0.7rem" }}
                          className="fw-bold"
                        >
                          {format(
                            new Date(item.created_at),
                            "do MMMM yyyy, hh:mm a"
                          )}
                        </span>
                      </div>
                    </div>

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
                        onClick={() => handleOpenComments(item.comments)}
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
                    <th>STATUS</th>
                    <th>CONTACT</th>
                    <th>DISTRICTS</th>
                    <th>TIME</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {paginatedAds.length > 0 ? (
                    paginatedAds.map((item, index) => (
                      <tr
                        key={item.id}
                        className="tableRow"
                        onClick={() => handleEditClick(item)}
                      >
                        <td># {startIndex + index + 1}</td>
                        <td
                          className="d-flex align-items-center justify-content-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ImageHoverSlider images={item.images || []} />
                        </td>
                        <td>
                          <div className="fw-bold">{item.title}</div>
                          <small className="text-muted">
                            {item.product_name}
                          </small>
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
                                item.ad_type === "sell" ? "success" : "info"
                              }`}
                            >
                              {item.ad_type.toUpperCase()}
                            </span>
                          </h6>

                          <h6>
                            <span
                              className={`badge bg-${
                                item.post_type === "postnow"
                                  ? "primary"
                                  : "warning text-dark"
                              }`}
                            >
                              {item.post_type === "postnow"
                                ? "Post Now"
                                : "Scheduled"}
                            </span>
                          </h6>

                          {/* STATUS BADGE */}
                          <h6>
                            <span
                              className={`badge bg-${
                                item.status === "active"
                                  ? "success"
                                  : item.status === "pending"
                                  ? "warning text-dark"
                                  : "danger"
                              }`}
                            >
                              {item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)}
                            </span>
                          </h6>

                          {/* <h6>
                            <span
                              className={`badge rounded-pill bg-${
                                item.expiry_date ? "secondary" : "success"
                              }`}
                            >
                              {item.expiry_date ? "Expired" : "Active"}
                            </span>
                          </h6> */}
                        </td>

                        <td>
                          <div className="fw-semibold">{item.creator_name}</div>

                          {/* Show role */}
                          <span className="text-muted">
                            {item.created_by_role}
                          </span>

                          {/* Show mobile number depending on role */}
                          {item.created_by_role === "user" &&
                            item.user_mobile && (
                              <div className="text-muted">
                                {item.user_mobile}
                              </div>
                            )}

                          {item.created_by_role === "subadmin" &&
                            item.subadmin_number && (
                              <div className="text-muted">
                                {item.subadmin_number}
                              </div>
                            )}
                        </td>

                        <td>
                          <div className="d-flex flex-wrap gap-1 justify-content-center">
                            {(item.districts || "[]").map((dist, idx) => (
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
                            new Date(item.created_at),
                            "do MMMM yyyy, hh:mm a"
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(item.id);
                              }}
                            >
                              <MdDelete />
                            </button>

                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenComments(item.comments || []);
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

        {searchQuery.trim() === "" && totalPages > 1 && (
          <ResponsivePagination
            page={currentPage}
            count={totalPages}
            onChange={(event, value) => setCurrentPage(value)}
          />
        )}
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
        />
      )}
    </>
  );
};

export default AdvertisementList;
