// src/components/user/EditUserModal.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Grid
} from "@mui/material";
import karnatakaData from "../../data/karnataka_districts_taluks_villages.json";

export default function EditUserModal({ open, onClose, user, onSave }) {
  const [form, setForm] = useState({
    username: "", mobile: "", district: "", taluk: "", village: "", panchayat: "", profession: "", age: ""
  });

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        mobile: user.mobile || "",
        district: user.district || "",
        taluk: user.taluk || "",
        village: user.village || "",
        panchayat: user.panchayat || "",
        profession: user.profession || "",
        age: user.age || ""
      });
    }
  }, [user]);

  const districtOptions = Object.keys(karnatakaData || {}).map(d => ({ label: d, value: d }));
  const talukOptions = form.district ? Object.keys(karnatakaData[form.district] || {}) .map(t => ({label:t,value:t})) : [];
  const villageOptions = (form.district && form.taluk) ? (karnatakaData[form.district]?.[form.taluk] || []).map(v => ({label:v,value:v})) : [];

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Name" value={form.username}
              onChange={e => handleChange("username", e.target.value)} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Mobile" value={form.mobile}
              onChange={e => handleChange("mobile", e.target.value)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Profession" value={form.profession}
              onChange={e => handleChange("profession", e.target.value)} />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField select fullWidth label="District" value={form.district}
              onChange={e => handleChange("district", e.target.value)}>
              <MenuItem value="">None</MenuItem>
              {districtOptions.map(d => <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField select fullWidth label="Taluk" value={form.taluk}
              onChange={e => handleChange("taluk", e.target.value)}>
              <MenuItem value="">None</MenuItem>
              {talukOptions.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField select fullWidth label="Village" value={form.village}
              onChange={e => handleChange("village", e.target.value)}>
              <MenuItem value="">None</MenuItem>
              {villageOptions.map(v => <MenuItem key={v.value} value={v.value}>{v.label}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Panchayat" value={form.panchayat}
              onChange={e => handleChange("panchayat", e.target.value)} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField type="number" fullWidth label="Age" value={form.age}
              onChange={e => handleChange("age", e.target.value)} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
}