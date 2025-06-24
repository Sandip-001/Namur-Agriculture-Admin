import { useContext, useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Button, Avatar, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import StorefrontIcon from "@mui/icons-material/Storefront";
import man1 from "../../../assets/man1.png";
import man2 from "../../../assets/man2.png";
import { MyContext } from "../../../App";
import ResponsivePagination from "../../../components/Pagination";

const Users = () => {
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
      },
      {
        no: 2,
        image: man2,
        name: "Anjali Sharma",
        contactNumber: "9123456789",
        email: "anjali@brightfuture.com",
      },
      {
        no: 3,
        image: man1,
        name: "Sandip Chowdhury",
        contactNumber: "9876543210",
        email: "chowdhurysandip2016@gmail.com",
      },
      {
        no: 4,
        image: man2,
        name: "Anjali Sharma",
        contactNumber: "9123456789",
        email: "anjali@brightfuture.com",
      },
    ];
  };

  const dummyData = getDummyUsers();

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">All Users</h5>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>NO</th>
                  <th>NAME</th>
                  <th>CONTACT NUMBER</th>
                  <th>EMAIL ID</th>
                  <th>PROFILE DETAILS</th>
                  <th>SELLING PRODUCTS</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {dummyData.length > 0 ? (
                  dummyData.map((item, index) => (
                    <tr key={index}>
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
                      <td>{item.email}</td>
                      <td>
                        <Button
                          component={Link}
                          to={`/user-profile/${item.no}`}
                          variant="contained"
                          startIcon={<PersonIcon />}
                          sx={{
                            backgroundColor: "#0d67ab",
                            borderRadius: 3,
                            textTransform: "none",
                            fontWeight: 600,
                            ":hover": {
                              backgroundColor: "#094f82",
                            },
                          }}
                        >
                          View Profile
                        </Button>
                      </td>

                      <td>
                        <Button
                          component={Link}
                          to={`/user-products/${item.no}`}
                          variant="outlined"
                          startIcon={<StorefrontIcon />}
                          sx={{
                            color: "#f0883d",
                            borderColor: "#f0883d",
                            borderRadius: 3,
                            textTransform: "none",
                            fontWeight: 600,
                            ":hover": {
                              backgroundColor: "#fef3eb",
                              borderColor: "#f0883d",
                            },
                          }}
                        >
                          Selling Products
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
