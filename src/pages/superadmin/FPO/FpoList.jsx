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
import man1 from "../../../assets/man1.png";
import man2 from "../../../assets/man2.png";
import { MyContext } from "../../../App";
import ResponsivePagination from "../../../components/Pagination";
import { Modal, Box, IconButton, Tooltip } from "@mui/material";
import RoomIcon from "@mui/icons-material/Room"; // Google Map icon
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import FpoModal from "../../../components/FpoModal";

const FpoList = () => {
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

  const [openModal, setOpenModal] = useState(false);
  const [selectedFpo, setSelectedFpo] = useState(null);

  const handleEditClick = (item) => {
    setSelectedFpo(item);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedFpo(null);
  };

  const getDummyFPOS = () => {
    return [
      {
        no: 1,
        image: man1,
        fpoName: "Green Harvest FPO",
        address: "Near NH-44, Kanakapura Road, Bengaluru",
        gstNo: "29ABCDE1234F1Z5",
        products: ["Tomatoes", "Chillies", "Turmeric"],
        regFarmers: 2,
        description:
          "Green Harvest is a sustainable farming collective based in Bangalore, promoting organic vegetables and spices across Karnataka.",
      },
      {
        no: 2,
        image: man2,
        fpoName: "Kaveri Farmers Collective",
        address: "Srirangapatna, Mysuru District, Karnataka",
        gstNo: "29FGHIJ6789K2Z3",
        products: ["Sugarcane", "Paddy", "Bananas"],
        regFarmers: 12,
        description:
          "Kaveri Farmers Collective is committed to empowering local farmers by marketing paddy and banana grown in river-fed lands.",
      },
      {
        no: 3,
        image: man1,
        fpoName: "Coastal Agro Producers",
        address: "Panambur, Mangaluru, Dakshina Kannada",
        gstNo: "29KLMNO4567P3Z6",
        products: ["Coconut", "Cashew", "Arecanut"],
        regFarmers: 7,
        description:
          "Coastal Agro Producers is an FPO from Mangalore helping coastal farmers market high-quality nuts and spices.",
      },
      {
        no: 4,
        image: man2,
        fpoName: "Belagavi Agro United",
        address: "Tilakwadi, Belgaum, Karnataka",
        gstNo: "29PQRSU1234V4Z9",
        products: ["Maize", "Soybean", "Onions"],
        regFarmers: 24,
        description:
          "Belagavi Agro United is a large-scale producer group managing high-volume crops and connecting farmers to national buyers.",
      },
    ];
  };

  const dummyData = getDummyFPOS();

  return (
    <>
      <div className="right-content w-100">
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">All FPO</h5>

          <div className="ms-auto d-flex align-items-center">
            <Link to={"/add-FPO"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">Add New FPO</Button>
            </Link>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>NO</th>
                  <th>NAME</th>
                  <th>ADDRESS</th>
                  <th>PRODUCTS</th>
                  <th>REG FARMERS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {dummyData.length > 0 ? (
                  dummyData.map((item, index) => (
                    <tr key={index}>
                      <td># {item.no}</td>

                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Avatar src={item.image} alt={item.fpoName} />
                          <div className="text-start">
                            <div className="fw-semibold">{item.fpoName}</div>
                            <div className="text-muted small">{item.gstNo}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        {item.address.split(" ").slice(0, 5).join(" ") + "..."}
                      </td>

                      <td>
                        <div className="d-flex flex-wrap justify-content-center gap-1">
                          {item.products.map((product, idx) => (
                            <span
                              key={idx}
                              className="badge bg-info text-white px-2 py-1"
                              style={{
                                fontSize: "0.75rem",
                                borderRadius: "10px",
                              }}
                            >
                              {product}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td>
                        <span className="fw-semibold">{item.regFarmers}</span>
                      </td>

                      <td>
                        <div className="d-flex gap-2 align-items-center justify-content-center">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleEditClick(item)}
                          >
                            <FaPencilAlt />
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            // onClick={() => handleDeleteClick(item.no)}
                          >
                            <MdDelete />
                          </button>
                        </div>
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
      </div>

      <FpoModal
        open={openModal}
        handleClose={handleModalClose}
        fpoData={selectedFpo}
      />
    </>
  );
};

export default FpoList;
