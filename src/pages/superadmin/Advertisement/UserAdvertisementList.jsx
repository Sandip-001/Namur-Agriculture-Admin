import React, { useContext, useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { MyContext } from "../../../App";
import SearchIcon from "@mui/icons-material/Search";
import ResponsivePagination from "../../../components/Pagination";
import { InputAdornment, TextField } from "@mui/material";

const UserAdvertisementList = () => {
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
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getDummyAdvertisements = () => {
    return [
      {
        no: 1,
        product: "Onion",
        productName: "Fresh Red Onion",
        unit: "kg",
        quantity: 100,
        price: 20,
        description:
          "Farm-fresh red onions directly from our organic farm. Ideal for cooking and storing.",
        image:
          "https://acsinternationalexim.com/wp-content/uploads/2023/11/l-intro-1644158494.jpg",
        postType: "postnow",
        scheduledAt: "Now",
        name: "Sandip Chowdhury",
        contactNumber: "9876543210",
        district: "Bengaluru Urban",
      },
      {
        no: 2,
        product: "Milk",
        productName: "Organic Cow Milk",
        unit: "litre",
        quantity: 50,
        price: 45,
        description:
          "Pure cow milk from grass-fed cows. No additives, fresh and healthy.",
        image: "https://static.toiimg.com/photo/113458714.cms",
        postType: "postnow",
        scheduledAt: "Now",
        name: "Anjali Sharma",
        contactNumber: "9123456789",
        district: "Mysuru",
      },
      {
        no: 3,
        product: "Tomato",
        productName: "Desi Tomatoes",
        unit: "kg",
        quantity: 70,
        price: 25,
        description:
          "Home-grown desi tomatoes. Perfect for salads and cooking, pesticide-free.",
        image:
          "https://img.etimg.com/thumb/width-1200,height-900,imgsize-56196,resizemode-75,msid-95423774/magazines/panache/5-reasons-why-tomatoes-should-be-your-favourite-fruit-this-year.jpg",
        postType: "postnow",
        scheduledAt: "Now",
        name: "Sandip Chowdhury",
        contactNumber: "9876543210",
        district: "Bengaluru Urban",
      },
      {
        no: 4,
        product: "Eggs",
        productName: "Country Chicken Eggs",
        unit: "pieces",
        quantity: 200,
        price: 7,
        description:
          "Farm-fresh country chicken eggs. Rich in nutrition and chemical-free.",
        image:
          "https://media.post.rvohealth.io/wp-content/uploads/2020/12/duck-chicken-egg-eggs-732x549-thumbnail-732x549.jpg",
        postType: "postnow",
        scheduledAt: "Now",
        name: "Anjali Sharma",
        contactNumber: "9123456789",
        district: "Mysuru",
      },
    ];
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(getDummyAdvertisements());

  useEffect(() => {
    const results = getDummyAdvertisements().filter(
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
          <h5 className="mb-0">User Advertisement List</h5>

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
                  <th>IMAGE</th>
                  <th>PRODUCT NAME</th>
                  <th>QUANTITY</th>
                  <th>PRICE</th>
                  <th>DESCRIPTION</th>
                  <th>CUSTOMER NAME</th>
                  <th>PHONE NUMBER</th>
                  <th>DISTRICT</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((item, index) => (
                    <tr key={index}>
                      <td># {item.no}</td>

                      <td>
                        <a
                          href={item.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open full image"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            width={100}
                            height={100}
                            style={{
                              objectFit: "cover",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                          />
                        </a>
                      </td>

                      <td>{item.productName}</td>

                      <td>
                        {item.quantity} {item.unit}
                      </td>

                      <td>{item.price}</td>

                      <td>
                        {item.description.split(" ").slice(0, 8).join(" ") +
                          (item.description.split(" ").length > 8 ? "..." : "")}
                      </td>

                      <td>
                        <div className="fw-semibold">{item.name}</div>
                      </td>
                      <td>{item.contactNumber}</td>
                      <td>{item.district}</td>
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

export default UserAdvertisementList;
