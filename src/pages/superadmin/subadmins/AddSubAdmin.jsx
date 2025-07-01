import React, { useEffect, useState } from "react";
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
import { FaCloudUploadAlt } from "react-icons/fa";
import { data } from "react-router-dom";

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
  const [name, setName] = useState("");
  const [selectedPages, setSelectedPages] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    fetch("https://api.countrystatecity.in/v1/countries/IN/states/KA/cities", {
      headers: {
        "X-CSCAPI-KEY": "dHFLWG1XQ3J0OUtTMlRmVTlZUGptRHlUSUxmaHhtUlB0NFMxc1gzaA==",
      },
    })
      .then((res) => res.json())
      .then((data) => {
      //console.log("Raw API response:", data);
      const cityNames = data.map((city) => city.name);
      //console.log("Mapped city names:", cityNames);
      setDistricts(cityNames);
    })
      .catch((err) => console.error("Failed to fetch cities", err));
  }, []);

  const handlePageChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedPages(typeof value === "string" ? value.split(",") : value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, selectedPages, email, password, selectedDistrict });
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
            Basic Information
          </Typography>

          <Box component="form" onSubmit={handleSubmit} mt={2}>
            <Grid container spacing={2} columns={{ xs: 1, sm: 2 }}>
              <Grid item size={1}>
                {" "}
                <FormControl fullWidth>
                  <InputLabel>District</InputLabel>{" "}
                  <Select
                    value={selectedDistrict}
                    label="District"
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    required
                  >
                    {" "}
                    {districts.map((district) => (
                      <MenuItem key={district} value={district}>
                        {district}{" "}
                      </MenuItem>
                    ))}{" "}
                  </Select>{" "}
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
                  type="password"
                  label="Password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Grid>

              <Button
                type="submit"
                className="btn-blue btn-lg w-100 d-flex justify-content-center align-items-center gap-2 mt-2"
              >
                <FaCloudUploadAlt />
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  "PUBLISH AND VIEW"
                )}
              </Button>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSubAdmin;
