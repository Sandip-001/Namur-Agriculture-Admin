// AddAdvertisement.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import dayjs from "dayjs";
import karnatakaData from "../../../data/karnataka_districts_taluks_villages.json";
import axiosInstance from "../../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { MyContext } from "../../../App";

const units = ["Kg", "Gram", "Piece", "Ltr"];

const AddAdvertisement = () => {
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const { setIsHideSidebarAndHeader, setAlertBox } = context;
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  const today = new Date();
  // tomorrow helper (no time)
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // state
  const [title, setTitle] = useState("");
  const [subCategories, setSubCategories] = useState([]); // array of objects {id, name, category_id, category_name}
  const [selectedSubCategory, setSelectedSubCategory] = useState(null); // object
  const [products, setProducts] = useState([]); // products for chosen subcategory (array of objects)
  const [product, setProduct] = useState(null); // selected product object
  const [productName, setProductName] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [postType, setPostType] = useState("postnow"); // use 'postnow' to match backend
  const [scheduledDate, setScheduledDate] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [forSale, setForSale] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [adsImages, setAdsImages] = useState([]);

  // specific UI fields
  const [selectedBreed, setSelectedBreed] = useState("");
  const [machineryFields, setMachineryFields] = useState({
    brand: "",
    model: "",
    manufacture_year: "",
    registration_no: "",
    prev_owners: "",
    driven_hours: "",
    kms_covered: "",
    insurance_running: "",
    fc_value: "",
  });

  // district options
  const districtOptions =
    user?.role === "subadmin"
      ? (user?.districts || []).map((d) => ({ label: d, value: d }))
      : Object.keys(karnatakaData).map((d) => ({
          label: d,
          value: d,
        }));


  // fetch subcategories (as objects)
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await axiosInstance.get("/api/subcategories");
        // expect array of { id, name, category_id, category_name }
        setSubCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
        setAlertBox?.({ error: true, msg: "Failed to load subcategories" });
      }
    };
    fetchSubCategories();
  }, []);

  // when selectedSubCategory changes, fetch products for that subcategory by id
  useEffect(() => {
    if (!selectedSubCategory) {
      setProducts([]);
      setProduct(null);
      setProductName("");
      return;
    }

    const fetchProductsForSubcat = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/products/subcategory/${selectedSubCategory.id}`
        );
        // expect products with: id, name, image_url, category_id, category_name, subcategory_id, subcategory_name, breeds
        setProducts(res.data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setAlertBox?.({ error: true, msg: "Failed to load products" });
      }
    };

    fetchProductsForSubcat();
  }, [selectedSubCategory]);

  

  // handle product select
  const handleProductSelect = (prodId) => {
    const sel = products.find((p) => p.id === prodId);
    setProduct(sel || null);
    setProductName(sel?.name || "");
    // reset category-dependent fields
    setUnit("");
    setSelectedBreed("");
    setMachineryFields({
      brand: "",
      model: "",
      manufacture_year: "",
      registration_no: "",
      prev_owners: "",
      driven_hours: "",
      kms_covered: "",
      insurance_running: "",
      fc_value: "",
    });
  };

  const handledistChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedDistricts(typeof value === "string" ? value.split(",") : value);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setAdsImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index, event) => {
    event.preventDefault();
    setAdsImages((prev) => prev.filter((_, i) => i !== index));
  };

  // helper to check product type
  const isFoodAnimalOrMarket = (prod) => {
    if (!prod) return false;
    const cat = (prod.category_name || "").toLowerCase();
    return ["food", "animal", "market"].includes(cat);
  };

  // Validate before submit
  const validate = () => {
    if (!productName || !selectedSubCategory || !product) {
      setAlertBox?.({
        open: true,
        error: true,
        msg: "Choose subcategory & product",
      });
      return false;
    }
    if (!title) {
      setAlertBox?.({ open: true, error: true, msg: "Title is required" });
      return false;
    }
    if (!quantity || !price) {
      setAlertBox?.({
        open: true,
        error: true,
        msg: "Quantity and price are required",
      });
      return false;
    }

    if (isFoodAnimalOrMarket(product)) {
      if (!unit) {
        setAlertBox?.({
          open: true,
          error: true,
          msg: "Unit is required for this product category",
        });
        return false;
      }
      if (!selectedBreed) {
        setAlertBox?.({
          open: true,
          error: true,
          msg: "Breed is required for this product category",
        });
        return false;
      }
    } else {
      // machinery validation: ensure machinery fields present
      const required = [
        "brand",
        "model",
        "manufacture_year",
        "registration_no",
        "prev_owners",
        "driven_hours",
        "kms_covered",
        "insurance_running",
        "fc_value",
      ];
      for (const f of required) {
        if (!machineryFields[f]) {
          setAlertBox?.({
            open: true,
            error: true,
            msg: `Please fill ${f} for machinery`,
          });
          return false;
        }
      }
    }

    // schedule validations
    if (postType === "schedule") {
      if (!scheduledDate) {
        setAlertBox?.({
          error: true,
          open: true,
          msg: "Please pick a scheduled date",
        });
        return false;
      }
      // scheduledDate must be >= tomorrow
      const s = new Date(dayjs(scheduledDate).format("YYYY-MM-DD"));
      const min = new Date(tomorrow);
      min.setHours(0, 0, 0, 0);
      if (s < min) {
        setAlertBox?.({
          open: true,
          error: true,
          msg: "Scheduled date must be from tomorrow",
        });
        return false;
      }
      if (!expiryDate) {
        setAlertBox?.({
          open: true,
          error: true,
          msg: "Please pick an expiry date",
        });
        return false;
      }
      const e = new Date(dayjs(expiryDate).format("YYYY-MM-DD"));
      if (e <= s) {
        setAlertBox?.({
          open: true,
          error: true,
          msg: "Expiry date must be after scheduled date",
        });
        return false;
      }
    }

    return true;
  };

  // submit
  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();

      // required ids
      formData.append(
        "category_id",
        product.category_id || selectedSubCategory.category_id
      );
      formData.append("subcategory_id", selectedSubCategory.id);
      formData.append("product_id", product.id);
      formData.append("product_name", product.name || productName);

      formData.append("title", title);
      formData.append("quantity", quantity);
      formData.append("price", price);
      formData.append("description", description || "");
      formData.append("districts", JSON.stringify(selectedDistricts));
      formData.append("ad_type", forSale ? "sell" : "rent");

      // post_type: use 'postnow' or 'schedule' to match backend
      formData.append("post_type", postType);

      // created_by_role & creator_id: use user.role if present (admin/subadmin/user) else default 'admin'
      formData.append("created_by_role", user?.role || "admin");
      formData.append("creator_id", user?.id);
      formData.append("actor_name", user?.name);

      if (postType === "postnow") {
        // do not send scheduled_at
        // expiry_date: if picked by admin, use it; otherwise compute IST midnight + 15 days
        if (expiryDate) {
          formData.append(
            "expiry_date",
            dayjs(expiryDate).format("YYYY-MM-DD")
          );
        } else {
          // compute IST midnight +15
          const nowIST = new Date(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
          );
          nowIST.setHours(0, 0, 0, 0);
          nowIST.setDate(nowIST.getDate() + 15);
          formData.append("expiry_date", dayjs(nowIST).format("YYYY-MM-DD"));
        }
      } else {
        // schedule
        formData.append(
          "scheduled_at",
          dayjs(scheduledDate).format("YYYY-MM-DD")
        );
        formData.append("expiry_date", dayjs(expiryDate).format("YYYY-MM-DD"));
      }

      // extra_fields
      let extra = {};
      if (isFoodAnimalOrMarket(product)) {
        extra = { breed: selectedBreed };
        formData.append("unit", unit);
      } else {
        extra = { ...machineryFields };
      }
      formData.append("extra_fields", JSON.stringify(extra));

      // images
      adsImages.forEach((f) => formData.append("images", f));

      const res = await axiosInstance.post("/api/ads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("ads data are", formData);

      setAlertBox({
        msg: res.data.message || "Ads created successfully",
        open: true,
        error: false,
      });
      // reset
      setTitle("");
      setSelectedSubCategory(null);
      setProducts([]);
      setProduct(null);
      setProductName("");
      setUnit("");
      setQuantity("");
      setPrice("");
      setDescription("");
      setSelectedDistricts([]);
      setAdsImages([]);
      setPostType("postnow");
      setScheduledDate(null);
      setExpiryDate(null);
      setSelectedBreed("");
      setMachineryFields({
        brand: "",
        model: "",
        manufacture_year: "",
        registration_no: "",
        prev_owners: "",
        driven_hours: "",
        kms_covered: "",
        insurance_running: "",
        fc_value: "",
      });

      navigate("/admin-advertisement-list");
    } catch (err) {
      console.error("Post ad error:", err);
      setAlertBox?.({
        open: true,
        error: true,
        msg: err.response?.data?.message || "Failed to post ad",
      });
    } finally {
      setIsLoading(false);
    }
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
              <TextField
                label="Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>

            <Grid item size={1}>
              <FormControl fullWidth>
                <InputLabel>Sub Category</InputLabel>
                <Select
                  value={selectedSubCategory ? selectedSubCategory.id : ""}
                  onChange={(e) => {
                    const id = e.target.value;
                    const sub = subCategories.find((s) => s.id === id);
                    setSelectedSubCategory(sub || null);
                  }}
                  label="Sub Category"
                >
                  {subCategories.map((sub) => (
                    <MenuItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={1}>
              <FormControl fullWidth disabled={!selectedSubCategory}>
                <InputLabel>Product</InputLabel>
                <Select
                  value={product ? product.id : ""}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  label="Product"
                >
                  {(products || []).map((prod) => (
                    <MenuItem key={prod.id} value={prod.id}>
                      {prod.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={1}>
              <TextField
                type="number"
                label="Price"
                fullWidth
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Grid>

            {/* Unit (only for Food/Animal/Market) */}
            {isFoodAnimalOrMarket(product) && (
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
            )}

            <Grid item size={1}>
              <TextField
                type="number"
                label="Quantity"
                fullWidth
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
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
                    onChange={() => setForSale((p) => !p)}
                    color="primary"
                  />
                }
                label={forSale ? "Ad Type: For Sell" : "Ad Type: For Rent"}
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
                <ToggleButton value="postnow">Post Now</ToggleButton>
                <ToggleButton value="schedule">Schedule Post</ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            {/* schedule inputs */}
            {postType === "schedule" && (
              <>
                <Grid item size={1}>
                  <DatePicker
                    label="Scheduled Date"
                    minDate={tomorrow}
                    value={scheduledDate}
                    onChange={setScheduledDate}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item size={1}>
                  <DatePicker
                    label="Expiry Date"
                    minDate={scheduledDate || tomorrow}
                    value={expiryDate}
                    onChange={setExpiryDate}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </>
            )}

            {/* Breed dropdown for food/animal/market */}
            {isFoodAnimalOrMarket(product) && (
              <Grid item size={1}>
                <FormControl fullWidth>
                  <InputLabel>Breed</InputLabel>
                  <Select
                    value={selectedBreed}
                    onChange={(e) => setSelectedBreed(e.target.value)}
                    label="Breed"
                  >
                    {(product?.breeds || []).map((b, i) => (
                      <MenuItem key={i} value={b}>
                        {b}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Machinery fields when product is machinery */}
            {!isFoodAnimalOrMarket(product) && product && (
              <>
                <Grid item size={1}>
                  <TextField
                    label="Brand"
                    fullWidth
                    value={machineryFields.brand}
                    onChange={(e) =>
                      setMachineryFields((p) => ({
                        ...p,
                        brand: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item size={1}>
                  <TextField
                    label="Model"
                    fullWidth
                    value={machineryFields.model}
                    onChange={(e) =>
                      setMachineryFields((p) => ({
                        ...p,
                        model: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item size={1}>
                  <TextField
                    label="Manufacture Year"
                    type="number"
                    fullWidth
                    value={machineryFields.manufacture_year}
                    onChange={(e) =>
                      setMachineryFields((p) => ({
                        ...p,
                        manufacture_year: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item size={1}>
                  <TextField
                    label="Registration No"
                    fullWidth
                    value={machineryFields.registration_no}
                    onChange={(e) =>
                      setMachineryFields((p) => ({
                        ...p,
                        registration_no: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item size={1}>
                  <TextField
                    label="Prev Owners"
                    type="number"
                    fullWidth
                    value={machineryFields.prev_owners}
                    onChange={(e) =>
                      setMachineryFields((p) => ({
                        ...p,
                        prev_owners: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item size={1}>
                  <TextField
                    label="Driven Hours"
                    type="number"
                    fullWidth
                    value={machineryFields.driven_hours}
                    onChange={(e) =>
                      setMachineryFields((p) => ({
                        ...p,
                        driven_hours: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item size={1}>
                  <TextField
                    label="Kms Covered"
                    type="number"
                    fullWidth
                    value={machineryFields.kms_covered}
                    onChange={(e) =>
                      setMachineryFields((p) => ({
                        ...p,
                        kms_covered: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item size={1}>
                  <TextField
                    label="Insurance Running (yes/no)"
                    fullWidth
                    value={machineryFields.insurance_running}
                    onChange={(e) =>
                      setMachineryFields((p) => ({
                        ...p,
                        insurance_running: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item size={1}>
                  <TextField
                    label="FC Value (yes/no)"
                    fullWidth
                    value={machineryFields.fc_value}
                    onChange={(e) =>
                      setMachineryFields((p) => ({
                        ...p,
                        fc_value: e.target.value,
                      }))
                    }
                  />
                </Grid>
              </>
            )}

            <div className="imageUploadSec">
              <div className="imgUploadBox d-flex flex-wrap gap-3">
                {adsImages.map((img, index) => (
                  <div key={index} className="uploadBox position-relative">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Ad ${index}`}
                      className="w-100 h-100 object-fit-cover rounded"
                    />
                    <button
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
                      onClick={(event) => removeImage(index, event)}
                    >
                      <IoCloseSharp />
                    </button>
                  </div>
                ))}

                <label className="uploadBox cursor-pointer">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                  />
                  <div className="info text-center">
                    <FaRegImages />
                    <h6 className="mt-2">Upload Images</h6>
                  </div>
                </label>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSubmit}
              className="btn-blue btn-lg w-100 d-flex justify-content-center align-items-center gap-2 mt-2"
            >
              <FaCloudUploadAlt />
              {isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : postType === "postnow" ? (
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
