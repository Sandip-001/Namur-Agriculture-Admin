// FpoModal.jsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Chip,
  Button,
  Avatar,
  IconButton,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import karnatakaData from "../data/karnataka_districts_taluks_villages.json";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "90vh",
  overflowY: "auto",
};

const FpoModal = ({ open, handleClose, fpoData }) => {
  // Separate state for each field
  const [fpoName, setFpoName] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [district, setDistrict] = useState("");
  const [taluk, setTaluk] = useState("");
  const [village, setVillage] = useState("");
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState([]);
  const [logo, setLogo] = useState(""); // base64 or image URL
  const [newProduct, setNewProduct] = useState("");

  const districtOptions = Object.keys(karnatakaData).map((d) => ({
    label: d,
    value: d,
  }));

  const talukOptions = district
    ? Object.keys(karnatakaData[district] || {}).map((t) => ({
        label: t,
        value: t,
      }))
    : [];

  const villageOptions =
    district && taluk
      ? (karnatakaData[district]?.[taluk] || []).map((v) => ({
          label: v,
          value: v,
        }))
      : [];

  useEffect(() => {
    if (fpoData) {
      setFpoName(fpoData.fpoName || "");
      setGstNo(fpoData.gstNo || "");
      setDistrict(fpoData.district || "");
      setTaluk(fpoData.taluk || "");
      setVillage(fpoData.village || "");
      setDescription(fpoData.description || "");
      setProducts(fpoData.products || []);
      setLogo(fpoData.image || "");
    }
  }, [fpoData]);

  // Handle image file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result); // Base64 image
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = () => {
    const trimmed = newProduct.trim();
    if (trimmed && !products.includes(trimmed)) {
      setProducts([...products, trimmed]);
      setNewProduct("");
    }
  };

  const handleRemoveProduct = (product) => {
    setProducts(products.filter((p) => p !== product));
  };

  const handleSubmit = () => {
    const updatedFpo = {
      ...fpoData,
      fpoName,
      gstNo,
      address,
      description,
      products,
      image: logo,
    };
    console.log(updatedFpo);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight="bold">
            Edit FPO Details
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box mt={3} display="flex" justifyContent="center">
          <label style={{ cursor: "pointer" }}>
            <Avatar
              src={logo}
              alt="FPO Logo"
              sx={{ width: 80, height: 80, margin: "auto" }}
            />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
            <Typography
              variant="caption"
              display="block"
              align="center"
              mt={1}
              color="primary"
            >
              Change Logo
            </Typography>
          </label>
        </Box>

        <Box mt={2}>
          <TextField
            fullWidth
            label="FPO Name"
            value={fpoName}
            onChange={(e) => setFpoName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="GST Number"
            value={gstNo}
            onChange={(e) => setGstNo(e.target.value)}
            margin="normal"
          />
          <FormControl fullWidth className="mt-3">
            <InputLabel>District</InputLabel>
            <Select
              value={district}
              label="District"
              onChange={(e) => {
                setDistrict(e.target.value);
                setTaluk(""); // reset dependent fields
                setVillage("");
              }}
              required
            >
              {districtOptions.map((district) => (
                <MenuItem key={district.value} value={district.value}>
                  {district.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth className="mt-3" disabled={!district}>
            <InputLabel>Taluk</InputLabel>
            <Select
              value={taluk}
              label="Taluk"
              onChange={(e) => {
                setTaluk(e.target.value);
                setVillage("");
              }}
              required
            >
              {talukOptions.map((taluk) => (
                <MenuItem key={taluk.value} value={taluk.value}>
                  {taluk.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth className="mt-3" disabled={!taluk}>
            <InputLabel>Village</InputLabel>
            <Select
              value={village}
              label="Village"
              onChange={(e) => setVillage(e.target.value)}
              required
            >
              {villageOptions.map((village) => (
                <MenuItem key={village.value} value={village.value}>
                  {village.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Description"
            value={description}
            multiline
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />

          {/* Products Input */}
          <Stack direction="row" gap={1} mt={2}>
            <TextField
              fullWidth
              label="Add Product"
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddProduct()}
            />
            <Button variant="contained" onClick={handleAddProduct}>
              Add
            </Button>
          </Stack>

          <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
            {products.map((product, idx) => (
              <Chip
                key={idx}
                label={product}
                onDelete={() => handleRemoveProduct(product)}
                color="primary"
              />
            ))}
          </Box>

          <Box mt={4} textAlign="center">
            <Button variant="contained" size="large" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default FpoModal;
