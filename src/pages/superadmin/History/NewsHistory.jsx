import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import axios from "axios";

export default function NewsLogs() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔥 Fetch logs from API
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("/api/newsLogRoutes");
        setLogs(res.data);
      } catch (err) {
        console.error("❌ Error fetching news logs:", err);
      }
    };
    fetchLogs();
  }, []);

  // 🔎 Filter logs by title or url
  const filteredLogs = logs.filter((log) => {
    const title = log?.new_data?.title || "";
    const url = log?.new_data?.url || "";
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
                    <TableCell>Action</TableCell>
                    <TableCell>Logged At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <DeleteOutline color="error" />
                          {log?.new_data?.title || "N/A"}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={log?.new_data?.url || "#"}
                          target="_blank"
                          rel="noopener"
                        >
                          {log?.new_data?.url || "N/A"}
                        </Link>
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>
                        {new Date(log.created_at).toLocaleString()}
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
