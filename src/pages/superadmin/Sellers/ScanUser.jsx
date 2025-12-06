import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance"; // adjust
import { Box, Typography, CircularProgress, Card, CardContent } from "@mui/material";

const ScanUser = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      axiosInstance
        .get(`/api/user/barcode/scan/${code}`)
        .then((res) => setUserDetails(res.data))
        .catch(() => alert("Invalid Barcode"))
        .finally(() => setLoading(false));
    }
  }, []);

  return (
    <Box textAlign="center" mt={4} className="right-content w-100">
      <Typography variant="h5">User Details</Typography>

      {loading && <CircularProgress sx={{ mt: 3 }} />}

      {userDetails && (
        <Card sx={{ mt: 3, p: 2 }}>
          <CardContent>
            <Typography variant="h6">Name: {userDetails.username}</Typography>
            <Typography variant="h6">Phone: {userDetails.mobile}</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ScanUser;
