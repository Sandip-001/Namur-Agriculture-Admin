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
      },
      {
        no: 2,
        image: man2,
        name: "Anjali Sharma",
        contactNumber: "9123456789",
        email: "anjali@brightfuture.com",
        district: "Mysuru",
        taluk: "Mysore",
      },
      {
        no: 3,
        image: man1,
        name: "Sandip Chowdhury",
        contactNumber: "9876543210",
        email: "chowdhurysandip2016@gmail.com",
        district: "Dakshina Kannada",
        taluk: "Mangalore",
      },
      {
        no: 4,
        image: man2,
        name: "Anjali Sharma",
        contactNumber: "9123456789",
        email: "anjali@brightfuture.com",
        district: "Belagavi",
        taluk: "Belgaum",
      },
    ];
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(getDummyUsers());

  useEffect(() => {
    const results = getDummyUsers().filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.contactNumber.includes(searchQuery)
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
                          <div className="fw-semibold">{item.taluk}</div>
                          <div className="text-muted">{item.district}</div>
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
    </>
  );
};

export default Users;