// AdsLogPage.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Chip,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

const dummyLogs = [
  {
    product: "Onion",
    unit: "kg",
    price: 20,
    deletedBy: "admin",
    userName: "Admin Panel",
    deletedAt: "2025-06-28 10:23 AM",
  },
  {
    product: "Milk",
    unit: "litre",
    price: 45,
    deletedBy: "user",
    userName: "Ravi Kumar",
    deletedAt: "2025-06-27 02:18 PM",
  },
  {
    product: "Eggs",
    unit: "pieces",
    price: 7,
    deletedBy: "admin",
    userName: "Admin Panel",
    deletedAt: "2025-06-26 11:47 AM",
  },
  {
    product: "Tomato",
    unit: "kg",
    price: 25,
    deletedBy: "user",
    userName: "Sita Devi",
    deletedAt: "2025-06-25 09:32 AM",
  },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
}));

const AdsLogPage = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = dummyLogs.filter(
    (log) =>
      log.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="right-content w-100">
      <Box p={3} sx={{ backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            mb={3}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Advertisement Deletion Logs
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              mt={{ xs: 2, md: 0 }}
            >
              <SearchIcon color="action" />
              <TextField
                variant="standard"
                placeholder="Search by product or user"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>
          </Box>

          <Box sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Product</StyledTableCell>
                  <StyledTableCell>Price / Unit</StyledTableCell>
                  <StyledTableCell>Deleted By</StyledTableCell>
                  <StyledTableCell>Date & Time</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <DeleteIcon color="error" />
                          <Typography>{log.product}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        ₹{log.price} / {log.unit}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            log.deletedBy === "admin"
                              ? `Deleted by Admin`
                              : `Deleted by ${log.userName}`
                          }
                          color={
                            log.deletedBy === "admin" ? "error" : "primary"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{log.deletedAt}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No logs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default AdsLogPage;
