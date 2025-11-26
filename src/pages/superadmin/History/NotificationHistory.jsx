import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";
import { Search, NotificationsActive } from "@mui/icons-material";

const dummyNotificationLogs = [
  {
    title: "Crop Advisory",
    message: "Please water your fields due to heatwave warning.",
    createdAt: "2025-07-01 11:00 AM",
  },
  {
    title: "New Machinery Offer",
    message: "Tractor 40% off for this monsoon. Limited time!",
    createdAt: "2025-07-01 10:15 AM",
  },
  {
    title: "Service Downtime Notice",
    message: "Our servers will be down for maintenance on July 3rd.",
    createdAt: "2025-06-30 05:45 PM",
  },
];

export default function NotificationLogs() {
  return (
    <div className="right-content w-100">
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
                    <TableCell>Title</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dummyNotificationLogs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <NotificationsActive color="primary" />
                          {log.title}
                        </Box>
                      </TableCell>
                      <TableCell>{log.message}</TableCell>
                      <TableCell>
                        <Chip label={log.createdAt} color="info" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}
