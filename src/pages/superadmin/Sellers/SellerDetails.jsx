// src/pages/UserProfile.jsx
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance"; // adjust
import UserHeader from "../../../components/seller-details/UserHeader";
import LandSelector from "../../../components/seller-details/LandSelector";
import FoodProducts from "../../../components/seller-details/FoodProduct";
import MachineProducts from "../../../components/seller-details/MachineProduct";
import AnimalProducts from "../../../components/seller-details/AnimalProduct";
import EditUserModal from "../../../components/seller-details/EditUserModal";
import EditLandModal from "../../../components/seller-details/EditLandModal";
import EditLandProductModal from "../../../components/seller-details/EditLandProductModal";
import { MyContext } from "../../../App";
import {
  Avatar,
  Box,
  Typography
} from '@mui/material';
import TerrainIcon from '@mui/icons-material/Terrain';


export default function SellerProfile() {
  const { id } = useParams(); // numeric admin user id (e.g. /user-profile/3)
  const { setAlertBox } = useContext(MyContext);
  const [user, setUser] = useState(null);
  const [lands, setLands] = useState([]);
  const [selectedLandId, setSelectedLandId] = useState(null);
  const [landProducts, setLandProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // modals
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editLandOpen, setEditLandOpen] = useState(false);
  const [editLPItem, setEditLPItem] = useState(null);
  const [editLPModalOpen, setEditLPModalOpen] = useState(false);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, [id]);

  const fetchAll = async () => {
    await Promise.all([fetchUser(), fetchProducts()]);
    await fetchLands();
  };

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(`/api/user/admin/user/${id}`);
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLands = async () => {
    try {
      const res = await axiosInstance.get(`/api/land/user/${id}`); // adjust route if different
      const list = res.data || [];
      setLands(list);
      if (list.length && !selectedLandId) setSelectedLandId(list[0].id);
      // after selecting land, load land products
      if (selectedLandId) {
        await fetchLandProducts(selectedLandId);
      } else if (list[0]) {
        await fetchLandProducts(list[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/api/products");
      setAllProducts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLandProducts = async (landId) => {
    try {
      if (!user) return;
      const res = await axiosInstance.get(
        `/api/land-product/${user.id}/${landId}`
      );
      // your route is GET "/:user_id/:land_id" under landProduct controller — adapt this path
      setLandProducts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedLandId) fetchLandProducts(selectedLandId);
    // eslint-disable-next-line
  }, [selectedLandId, user]);

  // Block / Unblock user
  const toggleBlock = async () => {
    try {
      if (!user) return;
      if (user.is_blocked) {
        const res = await axiosInstance.post(
          `/api/user/admin/unblock/${user.id}`
        );
        //console.log(res)
        setAlertBox({
          msg: res?.data?.message || "User Profile is unblock",
          open: true,
          error: false,
        });
      } else {
        const res = await axiosInstance.post(
          `/api/user/admin/block/${user.id}`
        );
        setAlertBox({
          msg: res?.data?.message || "User Profile is blocked",
          open: true,
          error: false,
        });
      }
      await fetchUser();
    } catch (err) {
      console.error(err);
    }
  };

  // Save user edit
  const handleSaveUser = async (payload) => {
    try {
      const res = await axiosInstance.put(
        `/api/user/admin/update/${user.id}`,
        payload
      );
      setEditUserOpen(false);
      setAlertBox({
        msg: res?.data?.message || "User Profile updated succcessfully",
        open: true,
        error: false,
      });
      await fetchUser();
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  // Edit land
  const handleEditLand = (landId) => {
    const land = lands.find((l) => l.id === landId);
    setEditingLand(land);
    setEditLandOpen(true);
  };
  const [editingLand, setEditingLand] = useState(null);

  const handleSaveLand = async (form) => {
    try {
      const res = await axiosInstance.put(`/api/land/${editingLand.id}`, form);
      setEditLandOpen(false);
      setAlertBox({
        msg: res?.data?.message || "User Land Details Updated successfully",
        open: true,
        error: false,
      });
      await fetchLands();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message);
    }
  };

  // Edit land product
  const handleOpenEditLP = (item) => {
    setEditLPItem(item);
    setEditLPModalOpen(true);
  };

  const handleSaveLandProduct = async (payload) => {
    try {
      const res = await axiosInstance.put(
        `/api/land-product/update/${editLPItem.id}`,
        payload
      );
      setEditLPModalOpen(false);
      setAlertBox({
        msg:
          res?.data?.message ||
          "User Land Product Details updated successfully",
        open: true,
        error: false,
      });
      await fetchLandProducts(selectedLandId);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message);
    }
  };

  const handleDeleteLandProduct = async (lpId) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await axiosInstance.delete(
        `/api/land-product/delete/${lpId}`
      );
      setAlertBox({
        msg: res?.data?.message || "Land Product Deleted successfully",
        open: true,
        error: false,
      });
      await fetchLandProducts(selectedLandId);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // group products by category
  const foodList = landProducts.filter((p) => p.category === "Food");
  const machineList = landProducts.filter((p) => p.category === "Machinery");
  const animalList = landProducts.filter((p) => p.category === "Animal");

  if (!user) return <div>Loading...</div>;

  const selectedLand = lands.find((l) => l.id === selectedLandId);

  if (!selectedLand) {
    return (
      <div
        className="card mb-4 border-0"
        style={{
          background: "linear-gradient(135deg, #F9FAFB, #F3F4F6)",
          borderRadius: "24px",
          border: "3px dashed #D1D5DB",
        }}
      >
        <div className="card-body text-center py-5">
          <TerrainIcon sx={{ fontSize: 80, color: "#D1D5DB", mb: 2 }} />
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#6B7280", mb: 1 }}
          >
            No land selected
          </Typography>
          <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
            Please select a land from the dropdown to view details
          </Typography>
        </div>
      </div>
    );
  }

  const landFields = [
    {
      label: "Land Name",
      value: selectedLand.land_name,
      icon: "🏞️",
      color: "#3B82F6",
    },
    {
      label: "District",
      value: selectedLand.district,
      icon: "🏛️",
      color: "#8B5CF6",
    },
    { label: "Taluk", value: selectedLand.taluk, icon: "📍", color: "#EC4899" },
    {
      label: "Village",
      value: selectedLand.village,
      icon: "🏘️",
      color: "#F59E0B",
    },
    {
      label: "Survey No",
      value: selectedLand.survey_no,
      icon: "📋",
      color: "#14B8A6",
    },
    {
      label: "Hissa No",
      value: selectedLand.hissa_no,
      icon: "📄",
      color: "#06B6D4",
    },
    {
      label: "Farm Size",
      value: selectedLand.farm_size,
      icon: "📏",
      color: "#10B981",
    },
  ];

  return (
    <div className="right-content w-100">
      <>
        <UserHeader
          user={user}
          isBlocked={user.is_blocked}
          onToggleBlock={toggleBlock}
          onOpenEdit={() => setEditUserOpen(true)}
        />

        <Box mb={2}>
          <LandSelector
            lands={lands}
            selectedLandId={selectedLandId}
            onChange={setSelectedLandId}
            onEdit={(lid) => {
              setEditingLand(lands.find((x) => x.id === lid));
              setEditLandOpen(true);
            }}
            editAllowed={!user.is_blocked}
          />
        </Box>

        <Box mb={2}>
          <div
            className="card shadow-lg mb-4 border-0"
            style={{ borderRadius: "24px", overflow: "hidden" }}
          >
            <Box
              sx={{
                background: "linear-gradient(135deg, #10B981, #059669)",
                p: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TerrainIcon sx={{ fontSize: 32, color: "white" }} />
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, color: "white" }}
                >
                  Selected Land Details
                </Typography>
              </Box>
            </Box>

            <div className="card-body p-4">
              <div className="row g-3">
                {landFields.map((field, idx) => (
                  <div key={idx} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        background: "linear-gradient(135deg, #F9FAFB, #F3F4F6)",
                        border: "2px solid #E5E7EB",
                        transition: "all 0.3s",
                        cursor: "pointer",
                        height: "100%",
                        "&:hover": {
                          boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                          transform: "translateY(-4px)",
                          borderColor: field.color,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 50,
                            height: 50,
                            bgcolor: field.color,
                            fontSize: "1.5rem",
                            boxShadow: `0 4px 12px ${field.color}40`,
                          }}
                        >
                          {field.icon}
                        </Avatar>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            color: "#6B7280",
                            fontSize: "0.7rem",
                          }}
                        >
                          {field.label}
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "#1F2937" }}
                      >
                        {field.value || "N/A"}
                      </Typography>
                    </Box>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Box>

        {/* Food */}
        <FoodProducts
          list={foodList}
          onEdit={handleOpenEditLP}
          onDelete={handleDeleteLandProduct}
        />
        {/* Machinery */}
        <MachineProducts
          list={machineList}
          onEdit={handleOpenEditLP}
          onDelete={handleDeleteLandProduct}
        />
        {/* Animal */}
        <AnimalProducts
          list={animalList}
          onEdit={handleOpenEditLP}
          onDelete={handleDeleteLandProduct}
        />

        {/* Modals */}
        <EditUserModal
          open={editUserOpen}
          onClose={() => setEditUserOpen(false)}
          user={user}
          onSave={handleSaveUser}
        />
        <EditLandModal
          open={editLandOpen}
          onClose={() => setEditLandOpen(false)}
          land={editingLand}
          onSave={handleSaveLand}
        />
        <EditLandProductModal
          open={editLPModalOpen}
          onClose={() => setEditLPModalOpen(false)}
          item={editLPItem}
          allProducts={allProducts}
          onSave={handleSaveLandProduct}
        />
      </>
    </div>
  );
}
