import React, { useState, useEffect } from "react";
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
  RadioGroup,
  FormControlLabel,
  Card,
  CardContent,
  Link,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { NotificationsActive } from "@mui/icons-material";
import axiosInstance from "../../../utils/axiosInstance";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  DeleteOutline,
  EditOutlined,
  AddCircleOutline,
} from "@mui/icons-material";

const dummyNotificationLogs = [
  {
    previousId: "1",
    title: "Crop Advisory",
    message: "Please water your fields due to heatwave warning.",
    deletedBy: "admin",
    userName: "Admin Panel",
    createdAt: "2025-07-01 02:30 PM",
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
  const [newsLogs, setNewsLogs] = useState([]);
  const [adsLogs, setAdsLogs] = useState([]);

  // Fetch News deletion logs from API
  useEffect(() => {
    const fetchNewsLogs = async () => {
      try {
        const res = await axiosInstance.get("/api/newsLogRoutes");
        //console.log(res.data);
        setNewsLogs(res.data);
      } catch (err) {
        console.error("❌ Error fetching news logs:", err);
      }
    };
    fetchNewsLogs();
  }, []);

  // Fetch Ads logs from API
  useEffect(() => {
    const fetchAdsLogs = async () => {
      try {
        const res = await axiosInstance.get("/api/adLog");
        console.log(res.data);
        setAdsLogs(res.data);
      } catch (err) {
        console.error("❌ Error fetching ads logs:", err);
      }
    };
    fetchAdsLogs();
  }, []);

  const filteredNewsLogs = newsLogs.filter(
    (log) =>
      log.title.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
      log.url.toLowerCase().includes(newsSearchTerm.toLowerCase())
  );

  const convertToIST = (dateString) => {
    if (!dateString) return "—";

    return formatInTimeZone(dateString, "Asia/Kolkata", "dd MMMM, hh:mm a");
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "create":
        return <AddCircleOutline sx={{ color: "#4caf50" }} />; // Green
      case "update":
        return <EditOutlined sx={{ color: "#2196f3" }} />; // Blue
      case "delete":
        return <DeleteOutline sx={{ color: "#f44336" }} />; // Red
      default:
        return null;
    }
  };

  const getActionChip = (action) => {
    const settings = {
      create: { label: "Created", color: "success" },
      update: { label: "Updated", color: "primary" },
      delete: { label: "Deleted", color: "error" },
    };

    const s = settings[action] || { label: action, color: "default" };

    return <Chip label={s.label} color={s.color} size="small" />;
  };

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

        {/* Ads Section */}
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
                Advertisement Logs History
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
                  placeholder="Search by product or actor"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Box>
            </Box>

            {/* Filter By Search */}
            {adsLogs
              .filter((log) => {
                const productName = log?.payload?.product_name || "";
                const actorName = log?.actor_name || "";

                return (
                  productName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  actorName.toLowerCase().includes(searchTerm.toLowerCase())
                );
              })
              .map((log, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    borderLeft: `6px solid ${
                      log.action === "create"
                        ? "#4caf50"
                        : log.action === "update"
                        ? "#2196f3"
                        : "#f44336"
                    }`,
                  }}
                >
                  {/* Action Icon */}
                  {getActionIcon(log.action)}

                  <Box flex={1}>
                    {/* Title + Action */}
                    <Typography variant="subtitle1" fontWeight="bold">
                      {log.payload.product_name}
                    </Typography>

                    {/* Action, Actor, Role */}
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {getActionChip(log.action)} by{" "}
                      <strong>{log.actor_name}</strong> ({log.actor_role})
                    </Typography>

                    {/* Price / District */}
                    <Typography variant="body2">
                      ₹{log.payload.price} / {log.payload.unit || "—"} •{" "}
                      {log.payload.districts?.join(", ")}
                    </Typography>

                    {/* Category / Product ID */}
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      Product ID: {log.ad_id}
                    </Typography>
                  </Box>

                  {/* Time */}
                  <Box textAlign="right">
                    <Typography variant="caption" fontWeight="bold">
                      {convertToIST(log.created_at)}
                    </Typography>
                  </Box>
                </Paper>
              ))}
          </Paper>
        )}

        {/* Notifications Section */}
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

        {/* News Section */}
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
                    News Logs
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
                        <TableCell>Action</TableCell>
                        <TableCell>Action By</TableCell>
                        <TableCell>Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredNewsLogs.map((log, index) => (
                        <TableRow key={index}>
                          <TableCell>{log.news_id}</TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              {getActionIcon(log.action)}
                              {log.title}
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Link href={log.url} target="_blank" rel="noopener">
                              {log.url}
                            </Link>
                          </TableCell>
                          <TableCell>{getActionChip(log.action)}</TableCell>
                          <TableCell>
                            <Chip
                              label={
                                log.actor_role === "admin"
                                  ? `Done By Admin`
                                  : `Done By ${log.actor_name}`
                              }
                              color={
                                log.actor_role === "admin" ? "error" : "primary"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{convertToIST(log.created_at)}</TableCell>
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
