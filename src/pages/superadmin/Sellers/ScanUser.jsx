import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance"; // adjust
import { Box, Typography, CircularProgress, Card, CardContent } from "@mui/material";
import { useContext } from "react";
import { MyContext } from "../../../App";

const ScanUser = () => {
  const { setIsHideSidebarAndHeader, setAlertBox } = useContext(MyContext);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      setIsHideSidebarAndHeader(true);
      window.scrollTo(0, 0);
    }, [setIsHideSidebarAndHeader]);

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
    <Box textAlign="center" mt={4}>
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
