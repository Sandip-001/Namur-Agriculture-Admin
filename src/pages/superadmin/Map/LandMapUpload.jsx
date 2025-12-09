import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import { motion } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";

export default function LandMapUpload() {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setMessage({ type: "", text: "" });
    setUploaded(false);
  };

  const handleUploadAndSave = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/land-maps/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({
        type: "success",
        text: `Uploaded successfully. New entries saved: ${res.data.inserted}`,
      });

      setUploaded(true);
      setFile(null);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Upload failed or duplicate records found!",
      });
      setUploaded(false);
    }

    setLoading(false);
  };

  return (
    <div className="right-content w-100">
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" fontWeight={700} textAlign="center" mb={2}>
          📍 Upload Land Map Excel
        </Typography>

        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg, #E3F2FD 0%, #E0F7FA 100%)",
            boxShadow: 4,
            textAlign: "center",
          }}
        >
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{
              backgroundColor: "#0284C7",
              px: 3,
              py: 1.5,
              borderRadius: 3,
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            Select Excel File
            <input
              hidden
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
            />
          </Button>

          {file && (
            <Typography mt={2} fontSize={15} fontWeight={600} color="#0284C7">
              📄 {file.name}
            </Typography>
          )}
        </Card>

        {message.text && (
          <Alert sx={{ mt: 2 }} severity={message.type}>
            {message.text}
          </Alert>
        )}

        {loading && <CircularProgress sx={{ mt: 2,}} />}

        {file && !uploaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginTop: "20px", textAlign: "center" }}
          >
            <Button
              variant="contained"
              color="success"
              startIcon={<SaveIcon />}
              onClick={handleUploadAndSave}
              disabled={loading}
              sx={{
                px: 4,
                py: 1.3,
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: 3,
              }}
            >
              Upload & Save Data
            </Button>
          </motion.div>
        )}
      </Box>
    </div>
  );
} 