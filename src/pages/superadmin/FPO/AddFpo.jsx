import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Button,
  Grid,
  Container,
  CircularProgress,
} from "@mui/material";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { MyContext } from "../../../App";
import karnatakaData from "../../../data/karnataka_districts_taluks_villages.json";

//breadcrumb code
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const AddFpo = () => {
  const { setAlertBox } = useContext(MyContext);

  const [name, setName] = useState("");
  const [gstNo, setGstno] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [taluk, setTaluk] = useState("");
  const [village, setVillage] = useState("");
  const [productInput, setProductInput] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [subAdminImage, setSubAdminImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get first file only
    if (file) {
      setSubAdminImage(file); // Store the selected image
      setAlertBox({
        msg: "Image uploaded successfully",
        open: true,
        error: false,
      });
    }
  };

  // Remove Image
  const removeImage = (e) => {
    e.preventDefault();
    setSubAdminImage(null);
  };

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

  const handleAddProduct = () => {
    if (
      productInput.trim() &&
      !selectedProducts.includes(productInput.trim())
    ) {
      setSelectedProducts([...selectedProducts, productInput.trim()]);
      setProductInput("");
    }
  };

  const handleRemoveProduct = (product) => {
    setSelectedProducts(selectedProducts.filter((p) => p !== product));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      name,
      gstNo,
      address,
      district,
      taluk,
      village,
      description,
      selectedProducts,
    });
  };

  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 flex-row p-4">
        <h5 className="mb-0">Create FPO</h5>
        <Breadcrumbs aria-label="breadcrumb" className="ms-auto breadcrumbs_">
          <StyledBreadcrumb
            component="a"
            href="#"
            label="Users"
            icon={<HomeIcon fontSize="small" />}
          />
          <StyledBreadcrumb label="Add FPO" component="a" href="#" />
        </Breadcrumbs>
      </div>

      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} align="center" gutterBottom>
            Basic Info
          </Typography>

          <Box component="form" onSubmit={handleSubmit} mt={2}>
            <Grid container spacing={2} columns={{ xs: 1, sm: 2 }}>
              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="FPO Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  type="text"
                  label="GST no"
                  variant="outlined"
                  value={gstNo}
                  onChange={(e) => setGstno(e.target.value)}
                  required
                />
              </Grid>

              <Grid item size={1}>
                <FormControl fullWidth>
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
              </Grid>

              <Grid item size={1}>
                <FormControl fullWidth disabled={!district}>
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
              </Grid>

              <Grid item size={1}>
                <FormControl fullWidth disabled={!taluk}>
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
              </Grid>

              <Grid item size={1}>
                <Box display="flex" gap={1}>
                  <TextField
                    fullWidth
                    label="Product name"
                    variant="outlined"
                    value={productInput}
                    onChange={(e) => setProductInput(e.target.value)}
                  />
                  <Button variant="contained" onClick={handleAddProduct}>
                    Add
                  </Button>
                </Box>
                <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                  {selectedProducts.map((product, index) => (
                    <Chip
                      key={index}
                      label={product}
                      onDelete={() => handleRemoveProduct(product)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item size={2}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  margin="normal"
                />
              </Grid>

              <Grid item size={1}>
                <div className="imageUploadSec">
                  <div className="imgUploadBox d-flex flex-wrap gap-3">
                    {subAdminImage ? (
                      <div className="uploadBox position-relative">
                        <img
                          src={URL.createObjectURL(subAdminImage)}
                          alt="Category"
                          className="w-100 h-100 object-fit-cover rounded"
                        />
                        <button
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
                          onClick={removeImage}
                        >
                          <IoCloseSharp />
                        </button>
                      </div>
                    ) : (
                      <label className="uploadBox cursor-pointer">
                        <input
                          type="file"
                          onChange={handleImageUpload}
                          accept="image/*"
                        />
                        <div className="info text-center">
                          <FaRegImages />
                          <h6 className="mt-2">Upload Logo</h6>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </Grid>

              <Grid item size={2}>
                <Button
                  type="submit"
                  className="btn-blue btn-lg w-40 gap-2 mt-2 d-flex"
                  style={{
                    margin: "auto",
                  }}
                >
                  <FaCloudUploadAlt />
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    "PUBLISH AND VIEW"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddFpo;
