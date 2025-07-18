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
import { data } from "react-router-dom";
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

const pages = [
  "Dashboard",
  "Category & Sub-Category",
  "Orders",
  "Products",
  "Users",
  "News",
  "Advertisements",
];

const AddSubAdmin = () => {
  const { setAlertBox } = useContext(MyContext);

  const [name, setName] = useState("");
  const [selectedPages, setSelectedPages] = useState([]);
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [qualification, setQualification] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
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

  const handlePageChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedPages(typeof value === "string" ? value.split(",") : value);
  };

  const handledistChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedDistricts(typeof value === "string" ? value.split(",") : value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      name,
      selectedPages,
      email,
      number,
      qualification,
      address,
      password,
      selectedDistricts,
    });
  };

  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 flex-row p-4">
        <h5 className="mb-0">Create SubAdmin</h5>
        <Breadcrumbs aria-label="breadcrumb" className="ms-auto breadcrumbs_">
          <StyledBreadcrumb
            component="a"
            href="#"
            label="SubAdmin"
            icon={<HomeIcon fontSize="small" />}
          />
          <StyledBreadcrumb label="Add SubAdmin" component="a" href="#" />
        </Breadcrumbs>
      </div>

      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} align="center" gutterBottom>
            Personal Info
          </Typography>

          <Box component="form" onSubmit={handleSubmit} mt={2}>
            <Grid container spacing={2} columns={{ xs: 1, sm: 2 }}>
              <Grid item size={1}>
                {" "}
                <FormControl fullWidth>
                  <InputLabel>Select District</InputLabel>
                  <Select
                    multiple
                    value={selectedDistricts}
                    onChange={handledistChange}
                    input={<OutlinedInput label="Select District" />}
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {districtOptions.map((dist) => (
                      <MenuItem key={dist.value} value={dist.value}>
                        <Checkbox checked={selectedDistricts.includes(dist.value)} />
                        <ListItemText primary={dist.label} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Subadmin Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>

              <Grid item size={1}>
                <FormControl fullWidth>
                  <InputLabel>Page Access</InputLabel>
                  <Select
                    multiple
                    value={selectedPages}
                    onChange={handlePageChange}
                    input={<OutlinedInput label="Page Access" />}
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {pages.map((page) => (
                      <MenuItem key={page} value={page}>
                        <Checkbox checked={selectedPages.includes(page)} />
                        <ListItemText primary={page} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  type="text"
                  label="Contact no"
                  variant="outlined"
                  value={number}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                    setNumber(numericValue.slice(0, 10)); // Limit to 10 digits
                  }}
                  required
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  type="text"
                  label="Qualification"
                  variant="outlined"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  required
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  type="text"
                  label="Address"
                  variant="outlined"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                          <h6 className="mt-2">Upload Image</h6>
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

export default AddSubAdmin;