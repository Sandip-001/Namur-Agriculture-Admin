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
  Link,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

const dummyNewsLogs = [
  {
    title: "Farmers Protest Against New Policies",
    url: "https://newsportal.com/farmers-protest",
    deletedBy: "Admin",
    deletedAt: "2025-07-01 11:10 AM",
  },
  {
    title: "Rainfall Predictions for July 2025",
    url: "https://newsportal.com/july-rainfall-forecast",
    deletedBy: "Megha Sharma",
    deletedAt: "2025-07-01 10:00 AM",
  },
  {
    title: "Government Launches New Irrigation Scheme",
    url: "https://newsportal.com/irrigation-scheme",
    deletedBy: "Admin",
    deletedAt: "2025-06-30 08:45 PM",
  },
];

export default function NewsLogs() {
  
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = dummyNewsLogs.filter(
    (log) =>
      log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.url.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="right-content w-100">
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Box>
            </Box>

            <Box sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>News Title</TableCell>
                    <TableCell>URL</TableCell>
                    <TableCell>Deleted At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs.map((log, index) => (
                    <TableRow key={index}>
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
                      <TableCell>{log.deletedAt}</TableCell>
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
