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
  Radio,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Card,
  CardContent,
  Link,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { DeleteOutline } from "@mui/icons-material";
import { NotificationsActive } from "@mui/icons-material";

import { format } from "date-fns";

const dummyLogs = [
  {
    previousId: "11",
    product: "Onion",
    unit: "kg",
    price: 20,
    deletedBy: "admin",
    userName: "Admin Panel",
    deletedAt: "2025-06-28 10:23 AM",
  },
  {
    previousId: "22",
    product: "Milk",
    unit: "litre",
    price: 45,
    deletedBy: "user",
    userName: "Ravi Kumar",
    deletedAt: "2025-06-27 02:18 PM",
  },
  {
    previousId: "23",
    product: "Eggs",
    unit: "pieces",
    price: 7,
    deletedBy: "admin",
    userName: "Admin Panel",
    deletedAt: "2025-06-26 11:47 AM",
  },
  {
    previousId: "31",
    product: "Tomato",
    unit: "kg",
    price: 25,
    deletedBy: "user",
    userName: "Sita Devi",
    deletedAt: "2025-06-25 09:32 AM",
  },
];

const dummyNotificationLogs = [
  {
    previousId: "1",
    title: "Crop Advisory",
    message: "Please water your fields due to heatwave warning.",
    deletedBy: "admin",
    userName: "Admin Panel",
    createdAt: "2025-07-01 02:30 PM",
  },
  {
    previousId: "2",
    title: "New Machinery Offer",
    message: "Tractor 40% off for this monsoon. Limited time!",
    deletedBy: "subadmin",
    userName: "Ram Prasad",
    createdAt: "2025-07-01 01:45 PM",
  },
  {
    previousId: "5",
    title: "Service Downtime Notice",
    message: "Our servers will be down for maintenance on July 3rd.",
    deletedBy: "admin",
    userName: "Admin Panel",
    createdAt: "2025-06-30 06:20 PM",
  },
];

const dummyNewsLogs = [
  {
    previousId: "3",
    title: "Farmers Protest Against New Policies",
    url: "https://newsportal.com/farmers-protest",
    deletedBy: "admin",
    userName: "Admin Panel",
    deletedAt: "2025-07-01 11:10 AM",
  },
  {
    previousId: "7",
    title: "Rainfall Predictions for July 2025",
    url: "https://newsportal.com/july-rainfall-forecast",
    deletedBy: "subadmin",
    userName: "Megha Sharma",
    deletedAt: "2025-07-01 10:00 AM",
  },
  {
    previousId: "9",
    title: "Government Launches New Irrigation Scheme",
    url: "https://newsportal.com/irrigation-scheme",
    deletedBy: "admin",
    userName: "Admin Panel",
    deletedAt: "2025-06-30 08:45 PM",
  },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
}));

const History = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [newsSearchTerm, setNewsSearchTerm] = useState("");
  const [targetType, setTargetType] = useState("Notifications");

  const filteredLogs = dummyLogs.filter(
    (log) =>
      log.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNewsLogs = dummyNewsLogs.filter(
    (log) =>
      log.title.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
      log.url.toLowerCase().includes(newsSearchTerm.toLowerCase())
  );

  return (
    <div className="right-content w-100">
      <Box p={3} sx={{ backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
        <FormControl fullWidth margin="normal">
          <RadioGroup
            row
            value={targetType}
            onChange={(e) => setTargetType(e.target.value)}
          >
            <FormControlLabel
              value="Notifications"
              control={<Radio />}
              label="Notifications"
            />
            <FormControlLabel value="Ads" control={<Radio />} label="Ads" />
            <FormControlLabel value="News" control={<Radio />} label="News" />
          </RadioGroup>
        </FormControl>
        {targetType === "Ads" && (
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
                    <StyledTableCell>ID</StyledTableCell>
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
                        <TableCell>{log.previousId}</TableCell>
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
                        <TableCell>
                          {format(
                            new Date(log.deletedAt),
                            "do MMMM yyyy, hh:mm a"
                          )}
                        </TableCell>
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
        )}

        {targetType === "Notifications" && (
          <Box p={2}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Push Notification Logs
                </Typography>

                <Box sx={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell>Created By</TableCell>
                        <TableCell>Created At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dummyNotificationLogs.map((log, index) => (
                        <TableRow key={index}>
                          <TableCell>{log.previousId}</TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <NotificationsActive color="primary" />
                              {log.title}
                            </Box>
                          </TableCell>
                          <TableCell>{log.message}</TableCell>
                          <TableCell>
                            <Chip
                              label={
                                log.deletedBy === "admin"
                                  ? `Created by Admin`
                                  : `Created by ${log.userName}`
                              }
                              color={
                                log.deletedBy === "admin" ? "error" : "primary"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {format(
                              new Date(log.createdAt),
                              "do MMMM yyyy, hh:mm a"
                            )}
                          </TableCell>
                          
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {targetType === "News" && (
          <Box p={2}>
            <Card elevation={3}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  mb={3}
                >
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    News Deletion Logs
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
                      placeholder="Search by title or url"
                      value={newsSearchTerm}
                      onChange={(e) => setNewsSearchTerm(e.target.value)}
                    />
                  </Box>
                </Box>

                <Box sx={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>News Title</TableCell>
                        <TableCell>URL</TableCell>
                        <TableCell>Deleted By</TableCell>
                        <TableCell>Deleted At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredNewsLogs.map((log, index) => (
                        <TableRow key={index}>
                          <TableCell>{log.previousId}</TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <DeleteOutline color="error" />
                              {log.title}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Link href={log.url} target="_blank" rel="noopener">
                              {log.url}
                            </Link>
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
                        <TableCell>
                          {format(
                            new Date(log.deletedAt),
                            "do MMMM yyyy, hh:mm a"
                          )}
                        </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default History;
