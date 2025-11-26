// EditAdvertisementModal.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
} from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";
import dayjs from "dayjs";
import axiosInstance from "../../../utils/axiosInstance";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import karnatakaData from "../../../data/karnataka_districts_taluks_villages.json";
import { FaRegImages } from "react-icons/fa";

const unitsList = ["Kg", "Gram", "Piece", "Ltr"];
export default function EditAdvertisementModal({
  open,
  handleClose,
  selectedAdvertisement,
  // controlled props (optional) - if you prefer pass them, else internal state used
  fetchAds,
  setAlertBox,
  subCategories = [], // array of objects { id, name, category_id, category_name }
  products = [], // map keyed by subcategory id OR subcategory name -> [{id, name, category_name, breeds: []}]
  user = null, // current logged in user object (optional) — used to set created_by_role & creator_id
  onSubCategoryChange,
  selectedSubCategory,
  setSelectedSubCategory,
}) {
  // Local state (form)
  const [title, setTitle] = useState("");
  const [availableProducts, setAvailableProducts] = useState([]); // products for selected subcat
  const [selectedProduct, setSelectedProduct] = useState(null); // selected product object
  const [productName, setProductName] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [postType, setPostType] = useState("postnow");
  const [scheduledDate, setScheduledDate] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [forSale, setForSale] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Images:
  const [adsImages, setAdsImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // objects { url, public_id }
  const [newFiles, setNewFiles] = useState([]);

  // breed & machinery fields
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
    condition: "",
  });

  // district options
  const districts = Object.keys(karnatakaData).map((d) => ({
    label: d,
    value: d,
  }));

  useEffect(() => {
    if (!selectedAdvertisement) return;

    // For product prefill
    const prodObj = products.find(
      (p) =>
        p.id === selectedAdvertisement.product_id ||
        p.name === selectedAdvertisement.product_name
    );

    setSelectedProduct(prodObj || null);
    setProductName(prodObj?.name || selectedAdvertisement.product_name || "");

    // Title, price, qty, description
    setTitle(selectedAdvertisement.title || "");
    setQuantity(selectedAdvertisement.quantity || "");
    setPrice(selectedAdvertisement.price || "");
    setDescription(selectedAdvertisement.description || "");
    setForSale(
      (selectedAdvertisement.ad_type || "").toLowerCase() === "sell" ||
        (selectedAdvertisement.ad_type || "").toLowerCase() === "sale"
    );

    // districts
    const districtsFromAd = Array.isArray(selectedAdvertisement.districts)
      ? selectedAdvertisement.districts
      : (() => {
          try {
            return JSON.parse(selectedAdvertisement.districts || "[]");
          } catch {
            return (selectedAdvertisement.districts || "")
              .split(",")
              .map((d) => d.trim())
              .filter(Boolean);
          }
        })();
    setSelectedDistricts(districtsFromAd);

    // images (existing)
    const imgs = selectedAdvertisement.images || [];

    setExistingImages(imgs);
    setAdsImages(imgs); // UI renders from this
    setNewFiles([]);

    // extra_fields
    const extra = selectedAdvertisement.extra_fields || {};
    // set machinery fields (some may be missing)
    setMachineryFields((prev) => ({
      ...prev,
      brand: extra.brand ?? prev.brand,
      model: extra.model ?? prev.model,
      manufacture_year: extra.manufacture_year ?? prev.manufacture_year,
      registration_no: extra.registration_no ?? prev.registration_no,
      prev_owners: extra.prev_owners ?? prev.prev_owners,
      driven_hours: extra.driven_hours ?? prev.driven_hours,
      kms_covered: extra.kms_covered ?? prev.kms_covered,
      insurance_running:
        extra.insurance_running ?? prev.insurance_running ?? "",
      fc_value: extra.fc_value ?? prev.fc_value ?? "",
      condition: extra.condition ?? prev.condition ?? "",
    }));

    setSelectedBreed(extra.breed ?? "");

    setUnit(selectedAdvertisement.unit ?? "");
    // set title if empty
    if (!selectedAdvertisement.title)
      setTitle(selectedAdvertisement.product_name);

    // post type / scheduled / expiry
    const isLocked =
      selectedAdvertisement.post_type === "schedule" &&
      selectedAdvertisement.status === "active";

    // Always keep original post type
    setPostType(selectedAdvertisement.post_type || "postnow");

    // If locked, do NOT modify dates (just hide them in UI later)
    if (isLocked) {
      setScheduledDate(
        selectedAdvertisement.scheduled_at
          ? dayjs(selectedAdvertisement.scheduled_at)
          : null
      );
      setExpiryDate(
        selectedAdvertisement.expiry_date
          ? dayjs(selectedAdvertisement.expiry_date)
          : null
      );
      return; // ✔ done
    }

    // Normal case (editable)
    setScheduledDate(
      selectedAdvertisement.scheduled_at
        ? dayjs(selectedAdvertisement.scheduled_at)
        : null
    );
    setExpiryDate(
      selectedAdvertisement.expiry_date
        ? dayjs(selectedAdvertisement.expiry_date)
        : null
    );
  }, [selectedAdvertisement, products]);

  // When selectedSubCategory changes, update availableProducts
  useEffect(() => {
    if (!selectedSubCategory) {
      setAvailableProducts([]);
      return;
    }

    // products coming from parent are already filtered for that subcategory
    setAvailableProducts(products);

    // If selected product is not present, reset
    if (!products.find((p) => p.id === selectedProduct?.id)) {
      setSelectedProduct(null);
      setProductName("");
    }
  }, [selectedSubCategory, products]);

  // Helper: whether product category requires breed/unit vs machinery
  const isFoodAnimalOrMarket = useMemo(() => {
    const cat = (selectedProduct?.category_name || "").toLowerCase();
    return ["food", "animal", "market"].includes(cat);
  }, [selectedProduct]);

  // Image handlers
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...files]); // KEY FIX
    setAdsImages((prev) => [...prev, ...files]); // for UI
  };

  const removeImage = (index, event) => {
    event.preventDefault();

    const img = adsImages[index];

    // If existing image → remove from existingImages (so backend will delete it)
    if (img.public_id) {
      setExistingImages((prev) =>
        prev.filter((i) => i.public_id !== img.public_id)
      );
    }

    // If new uploaded file → remove from newFiles
    if (!img.public_id) {
      setNewFiles((prev) => prev.filter((f) => f !== img));
    }

    // Remove from UI
    setAdsImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Districts handler (same as add page)
  const handleDistrictsChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedDistricts(typeof value === "string" ? value.split(",") : value);
  };

  const handleSubCatSelect = (e) => {
    const id = Number(e.target.value);
    const subcatObj = subCategories.find((s) => s.id === id);

    setSelectedSubCategory(subcatObj);
    onSubCategoryChange?.(subcatObj); // 🔥 trigger parent to reload products
  };

  useEffect(() => {
    if (!products.length || !selectedAdvertisement) return;

    // match existing advertisement product
    const match = products.find(
      (p) =>
        p.id === selectedAdvertisement.product_id ||
        p.name === selectedAdvertisement.product_name
    );

    if (match) {
      setSelectedProduct(match);
      setProductName(match.name);
    }
  }, [products]);

  const isLocked =
    selectedAdvertisement?.post_type === "schedule" && selectedAdvertisement?.status === "active";

  // Validation (similar to create flow)
  const validate = () => {
    // required
    if (!selectedSubCategory || !selectedProduct) {
      setAlertBox?.({
        open: true,
        error: true,
        msg: "Please choose subcategory and product",
      });
      return false;
    }
    if (!title || !quantity || !price) {
      setAlertBox?.({
        open: true,
        error: true,
        msg: "Please fill title, quantity and price",
      });
      return false;
    }

    if (isFoodAnimalOrMarket) {
      if (!unit) {
        setAlertBox?.({
          open: true,
          error: true,
          msg: "Unit is required for this product type",
        });
        return false;
      }
      if (!selectedBreed) {
        setAlertBox?.({
          open: true,
          error: true,
          msg: "Breed must be selected for this product type",
        });
        return false;
      }
    } else {
      // machinery: require machineryFields
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
        if (!machineryFields[f] && machineryFields[f] !== 0) {
          setAlertBox?.({
            open: true,
            error: true,
            msg: `Please fill ${f} for machinery`,
          });
          return false;
        }
      }
    }

    if (!isLocked && postType === "schedule") {
      // schedule must be from tomorrow onward
      if (!scheduledDate) {
        setAlertBox?.({
          open: true,
          error: true,
          msg: "Pick a scheduled date",
        });
        return false;
      }
      const s = new Date(dayjs(scheduledDate).format("YYYY-MM-DD"));
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      if (s < tomorrow) {
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
          msg: "Pick an expiry date",
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

  // Submit handler
  const handleSave = async () => {
    if (!validate()) return;
    if (!selectedAdvertisement) return;

    setIsSubmitting(true);
    try {
      const adId = selectedAdvertisement.id;

      const formData = new FormData();

      // core fields
      formData.append("title", title);
      formData.append(
        "category_id",
        selectedSubCategory?.category_id ?? selectedAdvertisement.category_id
      );
      formData.append(
        "subcategory_id",
        selectedSubCategory?.id ?? selectedAdvertisement.subcategory_id
      );
      formData.append(
        "product_id",
        selectedProduct?.id ?? selectedAdvertisement.product_id
      );
      formData.append(
        "product_name",
        productName || selectedAdvertisement.product_name
      );
      formData.append("unit", unit || "");
      formData.append("quantity", String(quantity));
      formData.append("price", String(price));
      formData.append("description", description || "");
      formData.append("ad_type", forSale ? "sell" : "rent");
      // ===== only send post_type & dates when editable =====
      if (!isLocked) {
        // send the user's choice
        formData.append(
          "post_type",
          postType === "schedule" ? "schedule" : "postnow"
        );

        if (postType === "schedule") {
          // user can modify dates, we validated them already
          formData.append(
            "scheduled_at",
            dayjs(scheduledDate).format("YYYY-MM-DD")
          );
          formData.append(
            "expiry_date",
            dayjs(expiryDate).format("YYYY-MM-DD")
          );
        }
      } 

      // districts as stringified array (backend expects TEXT[] in DB, controller will accept JSON string)
      formData.append("districts", JSON.stringify(selectedDistricts || []));

      // extra_fields: build object to match backend expectations
      const extra = { ...(selectedAdvertisement.extra_fields || {}) };

      if (isFoodAnimalOrMarket) {
        extra.breed = selectedBreed;
      } else {
        // machinery fields
        extra.brand = machineryFields.brand;
        extra.model = machineryFields.model;
        extra.manufacture_year = machineryFields.manufacture_year;
        extra.registration_no = machineryFields.registration_no;
        extra.prev_owners = machineryFields.prev_owners;
        extra.driven_hours = machineryFields.driven_hours;
        extra.kms_covered = machineryFields.kms_covered;
        extra.insurance_running = machineryFields.insurance_running;
        extra.fc_value = machineryFields.fc_value;
        extra.condition = machineryFields.condition;
      }

      formData.append("extra_fields", JSON.stringify(extra));

      // images: existingImages -> send array of public_id to keep (existingImages param)
      formData.append(
        "existingImages",
        JSON.stringify(existingImages.map((img) => img.public_id))
      );

      // new files
      newFiles.forEach((f) => {
        formData.append("images", f);
      });

      // actor info (optional)
      if (user) {
        formData.append("actor_name", user.name || user.username || "");
        formData.append("actor_role", user.role || "");
      }

      // call API
      await axiosInstance.put(`/api/ads/${adId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAlertBox?.({
        open: true,
        error: false,
        msg: "Advertisement updated successfully",
      });

      // refresh ads list
      if (typeof fetchAds === "function") await fetchAds(true);

      handleClose();
    } catch (err) {
      console.error("Edit save error:", err);
      setAlertBox?.({
        open: true,
        error: true,
        msg: err.response?.data?.message || "Failed to update advertisement",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render
  return (
    <Dialog open={!!open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="d-flex justify-content-between align-items-center">
        Edit Advertisement
        <IconButton onClick={handleClose}>
          <IoCloseSharp />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3} columns={{ xs: 1, sm: 2 }}>
          {/* Subcategory select */}
          <Grid item size={1}>
            <FormControl fullWidth>
              <InputLabel>Subcategory</InputLabel>
              <Select
                value={selectedSubCategory?.id || ""}
                label="Subcategory"
                onChange={handleSubCatSelect}
              >
                {subCategories.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Product select */}
          <Grid item size={1}>
            <FormControl fullWidth>
              <InputLabel>Product</InputLabel>
              <Select
                value={selectedProduct?.id || ""}
                label="Product"
                onChange={(e) => {
                  const pid = e.target.value;
                  const prod =
                    availableProducts.find((p) => p.id === pid) || null;
                  setSelectedProduct(prod);
                  setProductName(prod?.name || "");
                }}
              >
                {availableProducts.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Title */}
          <Grid item size={1}>
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>

          {/* Unit (show if food/animal/market) */}
          {isFoodAnimalOrMarket ? (
            <Grid item size={1}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={unit ?? ""}
                  label="Unit"
                  onChange={(e) => setUnit(e.target.value)}
                >
                  {unitsList.map((u) => (
                    <MenuItem key={u} value={u}>
                      {u}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ) : null}

          {/* Quantity */}
          <Grid item size={1}>
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Grid>

          {/* Price */}
          <Grid item size={1}>
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Grid>

          {/* Districts multi-select */}
          <Grid item size={1}>
            <FormControl fullWidth>
              <InputLabel>Select Districts</InputLabel>
              <Select
                multiple
                value={selectedDistricts}
                onChange={handleDistrictsChange}
                renderValue={(selected) => (selected || []).join(", ")}
                label="Select Districts"
              >
                {districts.map((d) => (
                  <MenuItem key={d.value} value={d.value}>
                    {d.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Description */}
          <Grid item size={2}>
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>

          {/* Breed (if product has breeds) */}
          {isFoodAnimalOrMarket && (
            <Grid item size={1}>
              <FormControl fullWidth>
                <InputLabel>Breed</InputLabel>
                <Select
                  value={selectedBreed || ""}
                  label="Breed"
                  onChange={(e) => setSelectedBreed(e.target.value)}
                >
                  {(selectedProduct?.breeds || []).map((b, i) => (
                    <MenuItem key={i} value={b}>
                      {b}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Machinery fields */}
          {!isFoodAnimalOrMarket && selectedProduct && (
            <>
              <Grid item size={1}>
                <TextField
                  label="Brand"
                  fullWidth
                  value={machineryFields.brand}
                  onChange={(e) =>
                    setMachineryFields((p) => ({ ...p, brand: e.target.value }))
                  }
                />
              </Grid>
              <Grid item size={1}>
                <TextField
                  label="Model"
                  fullWidth
                  value={machineryFields.model}
                  onChange={(e) =>
                    setMachineryFields((p) => ({ ...p, model: e.target.value }))
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
              <Grid item size={1}>
                <TextField
                  label="Condition"
                  fullWidth
                  value={machineryFields.condition}
                  onChange={(e) =>
                    setMachineryFields((p) => ({
                      ...p,
                      condition: e.target.value,
                    }))
                  }
                />
              </Grid>
            </>
          )}

          {/* Ad type / Post type */}
          <Grid item size={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={forSale}
                  onChange={() => setForSale((s) => !s)}
                />
              }
              label={forSale ? "For Sell" : "For Rent"}
            />
          </Grid>

          {!isLocked && (
            <Grid item size={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={postType === "schedule"}
                    onChange={(e) => {
                      const isScheduled = e.target.checked;
                      setPostType(isScheduled ? "schedule" : "postnow");
                      if (!isScheduled) {
                        setScheduledDate(null);
                        setExpiryDate(null);
                      }
                    }}
                  />
                }
                label={postType === "schedule" ? "Scheduled Post" : "Post Now"}
              />
            </Grid>
          )}

          {/* Dates */}
          {!isLocked && postType === "schedule" && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item size={1}>
                <DatePicker
                  label="Scheduled Date"
                  value={scheduledDate ? dayjs(scheduledDate) : null}
                  onChange={(d) => setScheduledDate(d)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item size={1}>
                <DatePicker
                  label="Expiry Date"
                  value={expiryDate ? dayjs(expiryDate) : null}
                  onChange={(d) => setExpiryDate(d)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </LocalizationProvider>
          )}

          {/* Images: existing + new */}
          <Grid item size={2}>
            <Typography variant="subtitle2">Existing Images</Typography>
            <div className="imageUploadSec">
              <div className="imgUploadBox d-flex flex-wrap gap-3">
                {adsImages.map((img, index) => (
                  <div key={index} className="uploadBox position-relative">
                    <img
                      src={img.url ? img.url : URL.createObjectURL(img)}
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
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
