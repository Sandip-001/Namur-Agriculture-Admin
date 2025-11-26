// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Try to load from localStorage on refresh
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("Namur_user"));

const initialState = {
  token: token || null,
  user: user || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      // persist in localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("Namur_user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;

      // clear from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("Namur_user");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
