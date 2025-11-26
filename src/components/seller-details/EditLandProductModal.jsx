// src/components/products/EditLandProductModal.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Grid, FormControl, InputLabel, Select
} from "@mui/material";

export default function EditLandProductModal({
  open, onClose, item, allProducts, onSave
}) {
  // item: the existing land_product row
  const [form, setForm] = useState({});
  const [productOptions, setProductOptions] = useState([]);

  useEffect(() => {
    if (item) {
      setForm({ ...item });
      // default options = products with same category as existing item
      const opts = allProducts.filter(p => p.category_id === (item.category_id || p.category_id) || p.category_name === item.category);
      setProductOptions(opts);
    }
  }, [item, allProducts]);

  useEffect(() => {
    // when category switches because user selects another product
    const selectedProduct = allProducts.find(p => p.id === Number(form.product_id));
    if (selectedProduct) {
      // filter product dropdown options by new category
      setProductOptions(allProducts.filter(p => p.category_id === selectedProduct.category_id));
      // set category on form
      setForm(prev => ({ ...prev, category: selectedProduct.category_name }));
    }
  }, [form.product_id, allProducts]);

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = () => {
    // Build the payload according to category (backend expects certain fields)
    const payload = {};
    payload.product_id = form.product_id;
    payload.land_id = form.land_id;

    if (form.category === "Food") {
      if (!form.acres) return alert("acres required");
      payload.acres = form.acres;
      // null other fields
      payload.model_no = null;
      payload.registration_no = null;
      payload.chassi_no = null;
      payload.rc_copy_no = null;
      payload.quantity = null;
    } else if (form.category === "Machinery") {
      if (!form.model_no || !form.registration_no || !form.chassi_no || !form.rc_copy_no) {
        return alert("All machinery fields required");
      }
      payload.model_no = form.model_no;
      payload.registration_no = form.registration_no;
      payload.chassi_no = form.chassi_no;
      payload.rc_copy_no = form.rc_copy_no;
      payload.acres = null;
      payload.quantity = null;
    } else if (form.category === "Animal") {
      if (!form.quantity) return alert("quantity required");
      payload.quantity = form.quantity;
      payload.acres = null;
      payload.model_no = null;
      payload.registration_no = null;
      payload.chassi_no = null;
      payload.rc_copy_no = null;
    }

    onSave(payload);
  };

  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Land Product</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Product</InputLabel>
              <Select value={form.product_id || ""} onChange={(e) => handleChange("product_id", e.target.value)} label="Product">
                {productOptions.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          {form.category === "Food" && (
            <Grid item xs={12}>
              <TextField fullWidth label="Acres" value={form.acres || ""} onChange={e=>handleChange("acres", e.target.value)} />
            </Grid>
          )}

          {form.category === "Machinery" && (
            <>
              <Grid item xs={12}><TextField label="Model No" fullWidth value={form.model_no || ""} onChange={e=>handleChange("model_no", e.target.value)} /></Grid>
              <Grid item xs={12}><TextField label="Registration No" fullWidth value={form.registration_no || ""} onChange={e=>handleChange("registration_no", e.target.value)} /></Grid>
              <Grid item xs={12}><TextField label="Chassi No" fullWidth value={form.chassi_no || ""} onChange={e=>handleChange("chassi_no", e.target.value)} /></Grid>
              <Grid item xs={12}><TextField label="RC Copy No" fullWidth value={form.rc_copy_no || ""} onChange={e=>handleChange("rc_copy_no", e.target.value)} /></Grid>
            </>
          )}

          {form.category === "Animal" && (
            <Grid item xs={12}>
              <TextField fullWidth label="Quantity" value={form.quantity || ""} onChange={e=>handleChange("quantity", e.target.value)} />
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
