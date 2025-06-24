import React, { useContext, useEffect, useState } from "react";
import DashboardBox from "./components/DashboardBox";
import { MdDelete, MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import { HiDotsVertical } from "react-icons/hi";
import { MyContext } from "../../../App";
import onion from "../../../assets/onion.png";
import goat from "../../../assets/goat.png";
import cow from "../../../assets/cow.png";
import { Chart } from "react-google-charts";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import { IoIosTimer, IoMdCart } from "react-icons/io";
import { FaPencilAlt, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export const data = [
  ["Year", "Sales", "Expenses"],
  ["2013", 1000, 400],
  ["2014", 1170, 460],
  ["2015", 660, 1120],
  ["2016", 1030, 540],
];

export const options = {
  backgroundColor: "transparent",
  chartArea: { width: "100%", height: "100%" },
};

const Dashboard = () => {
  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setProgress(20);
    setProgress(100);
  }, [setProgress]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const ITEM_HEIGHT = 48;

  const products = [
    { image: cow, name: "Cows", subCategory: "Animals", category: "Animal" },
    {
      image: onion,
      name: "Onions",
      subCategory: "Vegetables",
      category: "Food",
    },
    { image: goat, name: "Goats", subCategory: "Animals", category: "Animal" },
    { image: cow, name: "Cows", subCategory: "Animals", category: "Animal" },
    {
      image: onion,
      name: "Onions",
      subCategory: "Vegetables",
      category: "Food",
    },
  ];

  const getDummyOrders = () => {
    return [
      {
        orderCode: "KWz6sXvwnKmlXLFvVoq",
        image: goat,
        name: "Fresh Garlic",
        subCategory: "Garlic",
        buyerName: "Sandip Chowdhury",
        buyerAddress: "kandi murshidabd pin-742137",
        buyerNumber: "9876543210",
        price: 1200,
        quantity: 4,
        total: 4800,
        orderDate: "23/06/2025 12:23pm",
        sellerName: "Babu Roy",
        sellerNumber: "8617019875",
        sellerAddress: "Berhmapore murshidabad pin-789234",
        status: "Confirmed",
      },
      {
        orderCode: "VGb31XvwnKmlXLFvVrd",
        image: onion,
        name: "New Born Onions",
        subCategory: "Onion",
        buyerName: "Ankit Ghosh",
        buyerAddress: "kandi murshidabd pin-742137",
        buyerNumber: "9876543213",
        price: 60,
        quantity: 10,
        total: 600,
        orderDate: "22/06/2025 06:20pm",
        sellerName: "Babu Roy",
        sellerNumber: "8617019875",
        sellerAddress: "Berhmapore murshidabad pin-789234",
        status: "cancelled",
      },
      {
        orderCode: "KWz6sXvwnKmlXLFvVoq",
        image: goat,
        name: "Fresh Garlic",
        subCategory: "Garlic",
        buyerName: "Sandip Chowdhury",
        buyerAddress: "kandi murshidabd pin-742137",
        buyerNumber: "9876543210",
        price: 1200,
        quantity: 4,
        total: 4800,
        orderDate: "23/06/2025 12:23pm",
        sellerName: "Babu Roy",
        sellerNumber: "8617019875",
        sellerAddress: "Berhmapore murshidabad pin-789234",
        status: "confirmed",
      },
      {
        orderCode: "VGb31XvwnKmlXLFvVrd",
        image: onion,
        name: "New Born Onions",
        subCategory: "Onion",
        buyerName: "Ankit Ghosh",
        buyerAddress: "kandi murshidabd pin-742137",
        buyerNumber: "9876543213",
        price: 60,
        quantity: 10,
        total: 600,
        orderDate: "22/06/2025 06:20pm",
        sellerName: "Babu Roy",
        sellerNumber: "8617019875",
        sellerAddress: "Berhmapore murshidabad pin-789234",
        status: "cancelled",
      },
    ];
  };

  const dummyData = getDummyOrders();

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="dashboardBoxWrapper d-flex">
            <DashboardBox
              color={["#1da256", "#48d483"]}
              icon={<FaUserCircle />}
              grow={true}
              name={"Users"}
              length={20}
            />
            <DashboardBox
              color={["#c012e2", "#eb64fe"]}
              icon={<IoMdCart />}
              grow={false}
              name={"Products"}
              length={22}
            />
            <DashboardBox
              color={["#2c78e5", "#60aff5"]}
              icon={<MdShoppingBag />}
              grow={true}
              name={"Orders"}
              length={24}
            />
            <DashboardBox
              color={["#e1950e", "#f3cd29"]}
              icon={<GiStarsStack />}
              grow={false}
              name={"Sellers"}
              length={34}
            />
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-8 col-12 mb-4">
          <div className="p-3 shadow rounded-4 bg-white">
            <div className="box graphBox">
              <div className="d-flex align-items-center w-100 bottomEle">
                <h6 className="text-white mb-0 mt-0">Total Sales</h6>
                <div className="ms-auto">
                  <Button
                    className="ms-auto toggleIcon"
                    onClick={(e) => handleClick(e)}
                  >
                    <HiDotsVertical />
                  </Button>
                </div>

                <Menu
                  className="boxDropdown"
                  MenuListProps={{
                    "aria-labelledby": "long-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    paper: {
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: "20ch",
                      },
                    },
                  }}
                >
                  <MenuItem onClick={handleClose}>
                    <IoIosTimer /> Last Day
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <IoIosTimer /> Last Week
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <IoIosTimer /> Last Month
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <IoIosTimer /> Last Year
                  </MenuItem>
                </Menu>
              </div>

              <h3 className="text-white fw-bold">$3,787,681.00</h3>
              <p>$3,578.90 in last month</p>

              <Chart
                chartType="PieChart"
                width="100%"
                height="170px"
                data={data}
                options={options}
              />
            </div>
          </div>
        </div>

        <div className="col-md-4 col-12 mb-4">
          <div className="p-3 shadow rounded-4 bg-white">
            <h6 className="fw-semibold mb-3">Products</h6>
            <ul className="list-unstyled m-0">
              {products.map((product, idx) => (
                <li
                  key={idx}
                  className="d-flex align-items-center justify-content-between py-2 border-bottom"
                >
                  <div className="d-flex align-items-center gap-2">
                    <Avatar src={product.image} alt={product.name} />
                    <div>
                      <div className="fw-semibold">{product.name}</div>
                      <div className="text-muted small">
                        {product.subCategory}
                      </div>
                    </div>
                  </div>
                  <div className="text-muted small">{product.category}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="card shadow border-0 p-3 mt-3">
        <h3 className="hd mb-3">Order Details </h3>

        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle text-nowrap">
            <thead
              className="text-white text-uppercase text-center"
              style={{ backgroundColor: "green" }}
            >
              <tr>
                <th>No</th>
                <th>Product Name</th>
                <th>Image</th>
                <th>Subcategory</th>
                <th>Buyer Name</th>
                <th>Buyer Contact</th>
                <th>Buyer Address</th>
                <th>Seller Name</th>
                <th>Seller Contact</th>
                <th>Seller Address</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Order Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {dummyData.length > 0 ? (
                dummyData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>
                      <img
                        src={item.image}
                        alt={item.name}
                        width={50}
                        height={50}
                        style={{ objectFit: "cover" }}
                      />
                    </td>
                    <td>{item.subCategory}</td>
                    <td>{item.buyerName}</td>
                    <td>{item.buyerNumber}</td>
                    <td>{item.buyerAddress}</td>
                    <td>{item.sellerName}</td>
                    <td>{item.sellerNumber}</td>
                    <td>{item.sellerAddress}</td>
                    <td>₹{item.price}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.total}</td>
                    <td>{item.orderDate}</td>
                    <td>
                      <span
                        className={`badge ${
                          item.status.toLowerCase() === "cancelled"
                            ? "bg-danger"
                            : "bg-success"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="15" className="text-center">
                    No Orders Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
