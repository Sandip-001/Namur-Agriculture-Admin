import React, { useContext, useEffect, useState } from "react";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  ListItemText,
  OutlinedInput,
  Switch,
} from "@mui/material";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { MyContext } from "../../../App";
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import karnatakaData from "../../../data/karnataka_districts_taluks_villages.json";

const subCategories = ["Fruits", "Vegetables", "Dairy"];
const productsMap = {
  Fruits: ["Apple", "Banana", "Mango"],
  Vegetables: ["Potato", "Tomato", "Spinach"],
  Dairy: ["Milk", "Cheese", "Yogurt"],
};

const units = ["Kg", "Gram", "Piece"];

const AddAdvertisement = () => {
  const context = useContext(MyContext);
  const { setIsHideSidebarAndHeader, setAlertBox, districts } = context;

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  const today = new Date();

  const [subCategory, setSubCategory] = useState("");
  const [product, setProduct] = useState("");
  const [productName, setProductName] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [postType, setPostType] = useState("now");
  const [scheduledDate, setScheduledDate] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [forSale, setForSale] = useState(true); // true = For Sale, false = For Rent
  const [isLoading, setIsLoading] = useState(false);
  const [advertisementImage, setAdvertisementImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get first file only
    if (file) {
      setAdvertisementImage(file); // Store the selected image
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
    setAdvertisementImage(null);
  };

  const districtOptions = Object.keys(karnatakaData).map((d) => ({
    label: d,
    value: d,
  }));

  const handledistChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedDistricts(typeof value === "string" ? value.split(",") : value);
  };

  const handleSubmit = () => {
    // Set scheduled time to 12:00 AM automatically
    const mergedScheduledDateTime =
      postType === "schedule"
        ? dayjs(scheduledDate).hour(0).minute(0).second(0)
        : null;

    const adData = {
      subCategory,
      product,
      productName,
      unit,
      quantity,
      price,
      description,
      selectedDistricts,
      postType,
      scheduledAt:
        postType === "schedule"
          ? mergedScheduledDateTime.format("YYYY-MM-DD HH:mm")
          : "Now",
      expiryDate:
        postType === "schedule" && expiryDate
          ? dayjs(expiryDate).format("YYYY-MM-DD")
          : null,
      adType: forSale ? "sale" : "rent",
    };

    console.log("Ad Posted:", adData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="right-content w-100">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" mb={3} fontWeight={600} gutterBottom>
            Create Advertisement
          </Typography>

          <Grid container spacing={3} columns={{ xs: 1, sm: 2 }}>
            <Grid item size={1}>
              <FormControl fullWidth>
                <InputLabel>Sub Category</InputLabel>
                <Select
                  value={subCategory}
                  label="Sub Category"
                  onChange={(e) => {
                    setSubCategory(e.target.value);
                    setProduct("");
                  }}
                >
                  {subCategories.map((sub, idx) => (
                    <MenuItem key={idx} value={sub}>
                      {sub}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={1}>
              <FormControl fullWidth disabled={!subCategory}>
                <InputLabel>Product</InputLabel>
                <Select
                  value={product}
                  label="Product"
                  onChange={(e) => setProduct(e.target.value)}
                >
                  {(productsMap[subCategory] || []).map((prod, idx) => (
                    <MenuItem key={idx} value={prod}>
                      {prod}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={1}>
              <TextField
                label="Title"
                fullWidth
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Grid>

            <Grid item size={1}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={unit}
                  label="Unit"
                  onChange={(e) => setUnit(e.target.value)}
                >
                  {units.map((u, idx) => (
                    <MenuItem key={idx} value={u}>
                      {u}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={1}>
              <TextField
                type="number"
                label="Quantity"
                fullWidth
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 || e.target.value === "") {
                    setQuantity(e.target.value);
                  }
                }}
              />
            </Grid>

            <Grid item size={1}>
              <TextField
                type="number"
                label="Price"
                fullWidth
                value={price}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 || e.target.value === "") {
                    setPrice(e.target.value);
                  }
                }}
              />
            </Grid>

            <Grid item size={2}>
              <TextField
                label="Description"
                multiline
                rows={5}
                fullWidth
                margin="normal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            <Grid item size={1}>
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
                      <Checkbox
                        checked={selectedDistricts.includes(dist.value)}
                      />
                      <ListItemText primary={dist.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={forSale}
                    onChange={() => setForSale((prev) => !prev)}
                    color="primary"
                  />
                }
                label={forSale ? "Ad Type: For Sale" : "Ad Type: For Rent"}
              />
            </Grid>

            <Grid item size={2}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Choose Posting Type
              </Typography>
              <ToggleButtonGroup
                value={postType}
                exclusive
                onChange={(e, val) => val && setPostType(val)}
                color="primary"
              >
                <ToggleButton value="now">Post Now</ToggleButton>
                <ToggleButton value="schedule">Schedule Post</ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            {postType === "schedule" && (
              <>
                <Grid item size={1}>
                  <DatePicker
                    label="Scheduled Date"
                    minDate={today}
                    value={scheduledDate}
                    onChange={setScheduledDate}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item size={1}>
                  <DatePicker
                    label="Expiry Date"
                    minDate={scheduledDate || today}
                    value={expiryDate}
                    onChange={setExpiryDate}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </>
            )}

            <div className="imageUploadSec">
              <div className="imgUploadBox d-flex flex-wrap gap-3">
                {advertisementImage ? (
                  <div className="uploadBox position-relative">
                    <img
                      src={URL.createObjectURL(advertisementImage)}
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
            <Button
              type="submit"
              onClick={handleSubmit}
              className="btn-blue btn-lg w-100 d-flex justify-content-center align-items-center gap-2 mt-2"
            >
              <FaCloudUploadAlt />
              {isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : postType === "now" ? (
                "Post Now"
              ) : (
                "Schedule Post"
              )}
            </Button>
          </Grid>
        </Paper>
      </div>
    </LocalizationProvider>
  );
};

export default AddAdvertisement;
