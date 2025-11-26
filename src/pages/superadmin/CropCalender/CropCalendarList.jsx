import React, { useContext, useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { MyContext } from "../../../App";
import ResponsivePagination from "../../../components/Pagination";
import { format } from "date-fns";
import axiosInstance from "../../../utils/axiosInstance";

//  Import the edit modal
import EditCropCalendarModal from "./EditCropCalendarModal";

const CropCalendarList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [calendars, setCalendars] = useState([]);
  const [filteredCalendars, setFilteredCalendars] = useState([]);

  // ✅ new filter states
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  // ✅ modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  const fetchCalendars = async () => {
    try {
      setProgress(20);
      const res = await axiosInstance.get("/api/crop-calendars");
      setCalendars(res.data || []);
      setFilteredCalendars(res.data || []);
      setProgress(100);
    } catch (error) {
      console.error("Error fetching crop calendars:", error);
      setAlertBox({
        open: true,
        msg: "Failed to load crop calendars",
        error: true,
      });
      setProgress(100);
    }
  };

  useEffect(() => {
    fetchCalendars();
  }, []);

  // ✅ Filtering logic
  useEffect(() => {
    let results = calendars;

    if (selectedSubCategory) {
      results = results.filter(
        (item) => item.sub_category_name === selectedSubCategory
      );
    }

    if (selectedProduct) {
      results = results.filter((item) => item.product_name === selectedProduct);
    }

    setFilteredCalendars(results);
  }, [selectedSubCategory, selectedProduct, calendars]);

  // ✅ unique dropdown values
  const subCategories = [
  ...new Set(calendars.map((c) => c.sub_category_name))
];

const products = [
  ...new Set(calendars.map((c) => c.product_name))
];


  // Delete
  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this crop calendar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/api/crop-calendars/${id}`);
        Swal.fire("Deleted!", "Crop Calendar has been deleted.", "success");
        fetchCalendars();
      } catch (error) {
        console.error("❌ Error deleting crop calendar:", error);
        Swal.fire("Error!", "Something went wrong while deleting.", "error");
      }
    }
  };

  // ✅ Open Edit Modal
  const handleEditClick = (calendar) => {
    setEditData(calendar);
    setShowEditModal(true);
  };

  return (
    <div className="right-content w-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">Crop Calendar List</h4>

        {/* ✅ Dropdown Filters */}
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
          >
            <option value="">All Sub Categories</option>
            {subCategories.map((sub, i) => (
              <option key={i} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">All Products</option>
            {products.map((prod, i) => (
              <option key={i} value={prod}>
                {prod}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card shadow border-0 p-3 mt-4">
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle text-nowrap">
            <thead className="table-primary text-white text-uppercase text-center">
              <tr>
                <th>No</th>
                <th>Sub Category</th>
                <th>Product</th>
                <th>Crop Details</th>
                <th>Cultivation Tips</th>
                <th>Pests & Diseases</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {filteredCalendars.length > 0 ? (
                filteredCalendars.map((item, index) => (
                  <tr
                    key={item.id}
                    onClick={() => handleEditClick(item)}
                    className="cursor-pointer"
                  >
                    <td># {index + 1}</td>
                    <td>{item.sub_category_name}</td>
                    <td>{item.product_name}</td>
                    <td>
                      <small>{item.crop_details?.slice(0, 40)}...</small>
                    </td>
                    <td>
                      {Array.isArray(item.cultivation_tips)
                        ? item.cultivation_tips.length
                        : 0}{" "}
                      tips
                    </td>
                    <td>
                      {Array.isArray(item.paste_and_diseases)
                        ? item.paste_and_diseases.length
                        : 0}{" "}
                      records
                    </td>
                    <td>
                      {item.created_at
                        ? format(new Date(item.created_at), "do MMM yyyy")
                        : "-"}
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent opening edit modal
                            handleDeleteClick(item.id);
                          }}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted">
                    No crop calendars found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/*<ResponsivePagination
        page={currentPage}
        count={totalPages}
        onChange={(event, value) => setCurrentPage(value)}
      />*/}

      {/* ✅ Edit Modal */}
      {showEditModal && editData && (
        <EditCropCalendarModal
          open={showEditModal}
          handleClose={() => setShowEditModal(false)}
          selectedCalendar={editData}
          fetchCalendars={fetchCalendars}
          setAlertBox={setAlertBox}
        />
      )}
    </div>
  );
};

export default CropCalendarList;
