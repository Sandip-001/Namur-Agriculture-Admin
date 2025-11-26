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
import { MyContext } from "../../../App";
import ResponsivePagination from "../../../components/Pagination";
import { Modal, Box, IconButton, Tooltip } from "@mui/material";
import RoomIcon from "@mui/icons-material/Room"; // Google Map icon
import axiosInstance from "../../../utils/axiosInstance"; // ✅ use your axiosInstance

const Users = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    fetchUsers();
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMapModal, setOpenMapModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const fetchUsers = async () => {
    try {
      setProgress(20);
      const res = await axiosInstance.get("/api/user/admin/all");
      //console.log("Users data are", res.data);
      setUsers(res.data || []);
      setLoading(false);
      setProgress(100);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      setLoading(false);
      setAlertBox({
        open: true,
        msg: "Failed to fetch users",
        error: true,
      });
    }
  };

  const handleOpenMap = (lat, lng) => {
    setSelectedLocation({ lat, lng });
    setOpenMapModal(true);
  };

  const handleCloseMap = () => {
    setOpenMapModal(false);
    setSelectedLocation(null);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    const results = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.mobile.includes(searchQuery) ||
        user.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.taluk.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchQuery, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => {
    setCurrentPage(1);
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
                  <th>LAND</th>
                  <th>ADDRESS</th>
                  <th>SELLING PRODUCTS</th>
                  <th>LOCATION</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {loading ? (
                  <tr>
                    <td colSpan="6">Loading...</td>
                  </tr>
                ) : currentUsers.length > 0 ? (
                  currentUsers.map((item, index) => (
                    <tr
                      key={index}
                      className="tableRow"
                      onClick={() => navigate(`/user-profile/${item.id}`)}
                    >
                      <td># {indexOfFirstUser + index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Avatar
                            src={item.profile_image_url}
                            alt={item.name}
                          />
                          <div className="d-flex flex-column justify-content-start align-items-start">
                            <div className="fw-semibold">{item.username}</div>
                            <div className="text-muted">{item.mobile}</div>
                          </div>
                        </div>
                      </td>

                      <td>{item.land_count}</td>

                      <td>
                        <div>
                          <div className="text-muted">{item.district}</div>
                          <div className="fw-semibold">{item.taluk}</div>
                        </div>
                      </td>

                      <td>
                        <Button
                          component={Link}
                          to={`/user-products/${item.id}`}
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
            width: "40%",
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

//now in user profile page http://localhost:5173/user-profile/3 which I already created now I want to modify it as per the api response where first particular user details will be shown with a edit button means when I click on edit a modal will be open and I can change user data and click on save button and user data will be change then user land details will be showing like land name, district, taluk, village , panchayat, survey no, hissa no, farm size and one user have mutiple lands so fetch it as per user id and from a dropdown where land name will be shown if I change the name the details will be changed then below that land on the particular land and for that user id food category land product details will be sown like product name, iamge and acres and if I want I can remove it or I can edit the details kike as per update api , same after food category machine category will be shown where machine related products name , image , resgistration no, chasis no, rs copy no which details coming from api that details dataa will be showing and admin can edit it and delete it same after machine category animal category products will be showing with iamge , name and quantity and admin can edit it and delete and if I change land anme from the dropdown the land products all details should be changed and create a modal component for edit land product details supoose I click on food category particular product edit button then only poducts whose category name is food that details will be showing in dropdown and I can change the data , same for machinery and animal and last for block user call block and unblock api do this section msot attractive, eyecatchy and resposnive and fully functional with modern Ui methodoly this is particular user details api 

export default Users;
