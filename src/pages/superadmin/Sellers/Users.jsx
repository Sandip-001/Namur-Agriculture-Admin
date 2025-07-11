import { useContext, useEffect, useState } from "react";
import {
  Button,
  Avatar,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SearchIcon from "@mui/icons-material/Search";
import man1 from "../../../assets/man1.png";
import man2 from "../../../assets/man2.png";
import { MyContext } from "../../../App";
import ResponsivePagination from "../../../components/Pagination";
import { Modal, Box, IconButton, Tooltip } from "@mui/material";
import RoomIcon from "@mui/icons-material/Room"; // Google Map icon

const Users = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = 10; // or calculate based on data length

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setProgress(20);
    setProgress(100);
  }, []); // Fetch products when page or category changes

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const [openMapModal, setOpenMapModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleOpenMap = (lat, lng) => {
    setSelectedLocation({ lat, lng });
    setOpenMapModal(true);
  };

  const handleCloseMap = () => {
    setOpenMapModal(false);
    setSelectedLocation(null);
  };

  const getDummyUsers = () => {
    return [
      {
        no: 1,
        image: man1,
        name: "Sandip Chowdhury",
        contactNumber: "9876543210",
        email: "chowdhurysandip2016@gmail.com",
        district: "Bengaluru Urban",
        taluk: "Bangalore South",
        latitude: 12.9716,
        longitude: 77.5946,
      },
      {
        no: 2,
        image: man2,
        name: "Anjali Sharma",
        contactNumber: "9123456789",
        email: "anjali@brightfuture.com",
        district: "Mysuru",
        taluk: "Mysore",
        latitude: 12.2958,
        longitude: 76.6394,
      },
      {
        no: 3,
        image: man1,
        name: "Sandip Chowdhury",
        contactNumber: "9876543210",
        email: "chowdhurysandip2016@gmail.com",
        district: "Dakshina Kannada",
        taluk: "Mangalore",
        latitude: 12.9141,
        longitude: 74.8560,
      },
      {
        no: 4,
        image: man2,
        name: "Anjali Sharma",
        contactNumber: "9123456789",
        email: "anjali@brightfuture.com",
        district: "Belagavi",
        taluk: "Belgaum",
        latitude: 23.949530,
        longitude: 88.031780,
      },
    ];
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(getDummyUsers());

  useEffect(() => {
    const results = getDummyUsers().filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.contactNumber.includes(searchQuery) ||
        user.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.taluk.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchQuery]);

  return (
    <>
      <div className="right-content w-100">
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">All Users</h5>

          <TextField
            variant="outlined"
            placeholder="Search user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", sm: "300px" },
              backgroundColor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ccc",
                },
                "&:hover fieldset": {
                  borderColor: "#f0883d",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#f0883d",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#f0883d" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>NO</th>
                  <th>NAME</th>
                  <th>CONTACT NUMBER</th>
                  <th>ADDRESS</th>
                  <th>SELLING PRODUCTS</th>
                  <th>LOCATION</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((item, index) => (
                    <tr
                      key={index}
                      className="tableRow"
                      onClick={() => navigate(`/user-profile/${item.no}`)}
                    >
                      <td># {item.no}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Avatar src={item.image} alt={item.name} />
                          <div>
                            <div className="fw-semibold">{item.name}</div>
                          </div>
                        </div>
                      </td>
                      <td>{item.contactNumber}</td>
                      <td>
                        <div>
                          <div className="text-muted">{item.district}</div>
                          <div className="fw-semibold">{item.taluk}</div>
                        </div>
                      </td>

                      <td>
                        <Button
                          component={Link}
                          to={`/user-products/${item.no}`}
                          variant="outlined"
                          sx={{
                            color: "#f0883d",
                            borderColor: "#f0883d",
                            borderRadius: 3,
                            minWidth: 40,
                            padding: "6px",
                            ":hover": {
                              backgroundColor: "#fef3eb",
                              borderColor: "#f0883d",
                            },
                          }}
                          onClick={(e) => e.stopPropagation()} // Prevent row click on icon
                        >
                          <StorefrontIcon />
                        </Button>
                      </td>
                      <td>
                        <Tooltip title="View on Map">
                          <IconButton
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation(); // prevents parent click
                              handleOpenMap(item.latitude, item.longitude);
                            }}
                          >
                            <RoomIcon />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <ResponsivePagination
          page={currentPage}
          count={totalPages}
          onChange={(event, value) => setCurrentPage(value)}
        />
      </div>

      <Modal open={openMapModal} onClose={handleCloseMap}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "500px",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 2,
          }}
        >
          {selectedLocation && (
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0, borderRadius: 8 }}
              src={`https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}&hl=es;z=14&output=embed`}
              allowFullScreen
              loading="lazy"
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default Users;
