// src/components/land/EditLandModal.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, MenuItem
} from "@mui/material";
import karnatakaData from "../../data/karnataka_districts_taluks_villages.json";

export default function EditLandModal({ open, onClose, land, onSave }) {
  const [form, setForm] = useState({
    land_name: "", district: "", taluk: "", village: "", panchayat: "", survey_no: "", hissa_no: "", farm_size: ""
  });

  useEffect(() => {
    if (land) {
      setForm({
        land_name: land.land_name || "",
        district: land.district || "",
        taluk: land.taluk || "",
        village: land.village || "",
        panchayat: land.panchayat || "",
        survey_no: land.survey_no || "",
        hissa_no: land.hissa_no || "",
        farm_size: land.farm_size || ""
      });
    }
  }, [land]);

  const districtOptions = Object.keys(karnatakaData || {}).map(d => ({label:d,value:d}));
  const talukOptions = form.district ? Object.keys(karnatakaData[form.district] || {}).map(t => ({label:t,value:t})) : [];
  const villageOptions = (form.district && form.taluk) ? (karnatakaData[form.district]?.[form.taluk] || []).map(v=>({label:v,value:v})) : [];

  const handleChange = (k, v) => setForm(prev => ({...prev, [k]: v}));

  const handleSubmit = () => onSave(form);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Land</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}><TextField fullWidth label="Land name" value={form.land_name} onChange={e=>handleChange("land_name", e.target.value)} /></Grid>

          <Grid item xs={12} md={4}>
            <TextField select fullWidth label="District" value={form.district} onChange={e=>handleChange("district", e.target.value)}>
              <MenuItem value="">None</MenuItem>
              {districtOptions.map(d => <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField select fullWidth label="Taluk" value={form.taluk} onChange={e=>handleChange("taluk", e.target.value)}>
              <MenuItem value="">None</MenuItem>
              {talukOptions.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField select fullWidth label="Village" value={form.village} onChange={e=>handleChange("village", e.target.value)}>
              <MenuItem value="">None</MenuItem>
              {villageOptions.map(v => <MenuItem key={v.value} value={v.value}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}><TextField fullWidth label="Panchayat" value={form.panchayat} onChange={e=>handleChange("panchayat", e.target.value)} /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="Survey No" value={form.survey_no} onChange={e=>handleChange("survey_no", e.target.value)} /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="Hissa No" value={form.hissa_no} onChange={e=>handleChange("hissa_no", e.target.value)} /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="Farm size (acres)" value={form.farm_size} onChange={e=>handleChange("farm_size", e.target.value)} /></Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
