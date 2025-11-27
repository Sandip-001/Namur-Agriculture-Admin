import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import karnatakaData from "../../../data/karnataka_districts_taluks_villages.json";
import { useSelector } from "react-redux";
import axiosInstance from "../../../utils/axiosInstance";
import { MyContext } from "../../../App";
import { useContext } from "react";

const CreateNotification = () => {
  const context = useContext(MyContext);
  const { user } = useSelector((state) => state.auth);
  const { setAlertBox } = context;

  const [targetType, setTargetType] = useState("all");
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [selectFpo, setSelectFpo] = useState("");

  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [productsMap, setProductsMap] = useState({});
  const [product, setProduct] = useState("");

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/api/products");
        const products = res.data;
        const map = {};
        products.forEach((p) => {
          if (!map[p.subcategory_name]) map[p.subcategory_name] = [];
          map[p.subcategory_name].push({ id: p.id, name: p.name });
        });
        setProductsMap(map);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch Subcategories
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await axiosInstance.get("/api/subcategories");
        const data = res.data.map((sub) => ({
          id: sub.id,
          name: sub.name,
        }));
        setSubCategories(data);
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
      }
    };
    fetchSubCategories();
  }, []);

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

  const handleSubmit = async () => {
    try {
      if (!title.trim() || !message.trim()) {
        return alert("Please enter title and message");
      }

      let payload;

      if (targetType === "all") {
        payload = {
          title,
          description: message,
          created_by: user?.role || "admin",
          created_by_name: user?.name,
        };

        await axiosInstance.post("/api/notifications/send-all", payload);
      }

      if (targetType === "district") {
        if (!selectedDistricts.length || !product) {
          return alert("Please select districts and product");
        }

        payload = {
          title,
          description: message,
          districts: selectedDistricts,
          product_id: product.id,
          created_by: user?.role || "admin",
          creator_id: user?.id,
          created_by_name: user?.name,
        };

        await axiosInstance.post("/api/notifications/send-target", payload);
      }

      if (targetType === "fpo") {
        // ❌ Not changing anything here as you said
        alert("FPO notification flow will be added later");
        return;
      }

      setAlertBox({
        error: false,
        open: true,
        message: "Notification sent successfully!",
      });

      setTitle("");
      setMessage("");
      setSelectedDistricts([]);
      setSelectedSubCategory("");
      setProduct("");
    } catch (error) {
      console.log("Notification Error: ", error);
      setAlertBox({
        error: true,
        open: true,
        message: error.response?.data?.message || "Failed to send notification",
      });
    }
  };

  return (
    <div className="right-content w-100">
      <Box
        sx={{ p: 4, backgroundColor: "#f9f9f9", borderRadius: 3, boxShadow: 3 }}
      >
        <Typography variant="h4" fontWeight={600} textAlign="center">
          Create Notification
        </Typography>

        {/* Target Type */}
        <FormControl fullWidth margin="normal">
          <FormLabel>Send To</FormLabel>
          <RadioGroup
            row
            value={targetType}
            onChange={(e) => setTargetType(e.target.value)}
          >
            <FormControlLabel
              value="all"
              control={<Radio />}
              label="All Users"
            />
            <FormControlLabel
              value="district"
              control={<Radio />}
              label="District-wise"
            />
            <FormControlLabel value="fpo" control={<Radio />} label="FPO" />
          </RadioGroup>
        </FormControl>

        {/* District + Product Combo */}
        {targetType === "district" && (
          <>
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

            {/* Sub Category */}
            <FormControl fullWidth className="mt-3">
              <InputLabel>Sub Category</InputLabel>
              <Select
                value={selectedSubCategory?.id || ""}
                onChange={(e) => {
                  const selected = subCategories.find(
                    (s) => s.id === e.target.value
                  );
                  setSelectedSubCategory(selected);
                  setProduct("");
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

            {/* Product */}
            <FormControl
              fullWidth
              disabled={!selectedSubCategory}
              className="mt-3"
            >
              <InputLabel>Product</InputLabel>
              <Select
                value={product?.id || ""}
                onChange={(e) => {
                  const selectedProduct = (
                    productsMap[selectedSubCategory.name] || []
                  ).find((p) => p.id === e.target.value);
                  setProduct(selectedProduct);
                }}
                label="Product"
              >
                {(productsMap[selectedSubCategory.name] || []).map((prod) => (
                  <MenuItem key={prod.id} value={prod.id}>
                    {prod.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}

        {/* Notification Title */}
        <TextField
          fullWidth
          label="Notification Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          sx={{ marginTop: 3, backgroundColor: "#a9ffa9" }}
        />

        {/* Notification Message */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Notification Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          margin="normal"
          sx={{ backgroundColor: "#a9ffa9" }}
        />

        {/* Submit */}
        <Box mt={4} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
          >
            Send Now
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default CreateNotification;
