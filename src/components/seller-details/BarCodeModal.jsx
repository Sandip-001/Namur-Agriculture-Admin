import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Fade,
  Backdrop,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const BarcodeModal = ({ showBarcode, setShowBarcode, user }) => {
  return (
    <Modal
      open={showBarcode}
      onClose={() => setShowBarcode(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={showBarcode}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            borderRadius: 3,
            boxShadow: 24,
            textAlign: "center",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={() => setShowBarcode(false)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          {/* Barcode Image */}
          <img
            src={`https://namur-backend-f09v.onrender.com/api/user/barcode/${user.id}`}
            alt="User Barcode"
            style={{
             width: "200px",
              height: "200px",
            }}
          />

          {/* Username */}
          <Typography variant="h6" sx={{ mt: 1 }}>
            {user.username}
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
};

export default BarcodeModal;
