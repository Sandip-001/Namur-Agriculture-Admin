import React, { useContext, useEffect, useState } from "react";
import DashboardBox from "./components/DashboardBox";
import { MdDelete, MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import { HiDotsVertical } from "react-icons/hi";
import { MyContext } from "../../../App";
import { Select } from "@mui/material";
import onion from "../../../assets/onion.png";
import goat from "../../../assets/goat.png";
import cow from "../../../assets/cow.png";
import { Chart } from "react-google-charts";
import { Line } from "react-chartjs-2";
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
import { Link } from "react-router-dom";
import { RxCrossCircled } from "react-icons/rx";

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

const userJoinData = {
  daily: [
    { date: "2025-06-18", count: 5 },
    { date: "2025-06-19", count: 8 },
    { date: "2025-06-20", count: 3 },
    { date: "2025-06-21", count: 6 },
    { date: "2025-06-22", count: 7 },
    { date: "2025-06-23", count: 2 },
    { date: "2025-06-24", count: 9 },
  ],
  weekly: [
    { week: "Week 1", count: 40 },
    { week: "Week 2", count: 35 },
    { week: "Week 3", count: 48 },
    { week: "Week 4", count: 52 },
  ],
  monthly: [
    { month: "Jan", count: 120 },
    { month: "Feb", count: 140 },
    { month: "Mar", count: 160 },
    { month: "Apr", count: 180 },
    { month: "May", count: 200 },
    { month: "Jun", count: 170 },
  ],
};

const Dashboard = () => {
  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [view, setView] = useState("daily");

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

  const distActivity = [
    { district: "Bagalkot", users: 50, ads: 10, news: 5 },
    { district: "Bengaluru Urban", users: 30, ads: 10, news: 5 },
    { district: "Bengaluru Rural", users: 20, ads: 10, news: 7 },
    { district: "Belagavi", users: 30, ads: 10, news: 9 },
    { district: "Ballari", users: 18, ads: 32, news: 6 },
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

  const getDummyAdvertisements = () => {
    return [
      {
        no: 1,
        product: "Onion",
        subcategory: "Vegetables",
        productName: "Fresh Red Onion",
        unit: "kg",
        quantity: 100,
        price: 20,
        description:
          "Farm-fresh red onions directly from our organic farm. Ideal for cooking and storing.",
        image:
          "https://acsinternationalexim.com/wp-content/uploads/2023/11/l-intro-1644158494.jpg",
        forSale: "rent",
        postType: "postnow",
        scheduledDate: "Now",
        status: "Active",
        postedBy: "Sudhendu Mondal",
        contactNumber: "8637824327",
        districts: ["Mandya"],
      },
      {
        no: 2,
        product: "Milk",
        subcategory: "Dairy Products",
        productName: "Organic Cow Milk",
        unit: "litre",
        quantity: 50,
        price: 45,
        description:
          "Pure cow milk from grass-fed cows. No additives, fresh and healthy.",
        image: "https://static.toiimg.com/photo/113458714.cms",
        forSale: "sale",
        postType: "postnow",
        scheduledDate: "Now",
        status: "Active",
        postedBy: "Sandip Chowdhury",
        contactNumber: "9876543210",
        districts: ["Mandya"],
      },
      {
        no: 3,
        product: "Tomato",
        subcategory: "Fruits & Veggies",
        productName: "Desi Tomatoes",
        unit: "kg",
        quantity: 70,
        price: 25,
        description:
          "Home-grown desi tomatoes. Perfect for salads and cooking, pesticide-free.",
        image:
          "https://img.etimg.com/thumb/width-1200,height-900,imgsize-56196,resizemode-75,msid-95423774/magazines/panache/5-reasons-why-tomatoes-should-be-your-favourite-fruit-this-year.jpg",
        forSale: "sale",
        postType: "postnow",
        scheduledDate: "Now",
        status: "Active",
        postedBy: "Anjali Sharma",
        contactNumber: "9123456789",
        districts: ["Mysuru"],
      },
      {
        no: 4,
        product: "Eggs",
        subcategory: "Poultry",
        productName: "Country Chicken Eggs",
        unit: "pieces",
        quantity: 200,
        price: 7,
        description:
          "Farm-fresh country chicken eggs. Rich in nutrition and chemical-free.",
        image:
          "https://media.post.rvohealth.io/wp-content/uploads/2020/12/duck-chicken-egg-eggs-732x549-thumbnail-732x549.jpg",
        forSale: "rent",
        postType: "postnow",
        scheduledDate: "Now",
        status: "Active",
        postedBy: "Sandip Chowdhury",
        contactNumber: "9876543210",
        districts: ["Bengaluru Rural"],
      },
    ];
  };

  const dummyAdsData = getDummyAdvertisements();

  const dummyData = getDummyOrders();

  const [comments, setComments] = useState([
    {
      name: "RameshK",
      comment:
        "This tractor is in excellent condition. I’ve already contacted the seller!",
    },
    {
      name: "Sunita88",
      comment:
        "The irrigation kit is a great deal. Highly recommend checking this out.",
    },
    {
      name: "KrishnFarm",
      comment:
        "The user interface is very smooth and easy to post ads. Good job team!",
    },
    {
      name: "Vijay_Agro",
      comment:
        "I sold my crop sprayer in just 2 days. This platform is amazing!",
    },
    {
      name: "EcoFarms",
      comment:
        "Can you add an option for bulk uploads? Managing individual products takes time.",
    },
    {
      name: "Neha_R",
      comment: "Love the new UI! Much better than the previous version grater than previous one 👏",
    },
    {
      name: "AjayDeals",
      comment: "Product visibility has improved a lot after using premium ads.",
    },
  ]);

  const removeComment = (index) => {
    setComments((prev) => prev.filter((_, i) => i !== index));
  };

  const chartData = {
    labels: userJoinData[view].map((entry) =>
      view === "daily"
        ? entry.date
        : view === "weekly"
        ? entry.week
        : entry.month
    ),
    datasets: [
      {
        label: "Users Joined",
        data: userJoinData[view].map((entry) => entry.count),
        fill: true,
        backgroundColor: "rgba(13,103,171,0.1)",
        borderColor: "#0d67ab",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // disables the box/legend
      },
    },
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <DashboardBox />
        </div>
      </div>

      <div className="row mt-2">
        {/* Application Logs */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4 text-primary">
                🕒 Application Logs
              </h5>
              <div className="timeline">
                <div className="timeline-item mb-4 d-flex align-items-start">
                  <span className="timeline-dot bg-danger me-3"></span>
                  <div>
                    <h6 className="fw-bold mb-1">
                      Admin approved an ad for "New Holland Tractor"
                    </h6>
                    <small className="text-muted">5 mins ago</small>
                  </div>
                </div>

                <div className="timeline-item mb-4 d-flex align-items-start">
                  <span className="timeline-dot bg-success me-3"></span>
                  <div>
                    <h6 className="fw-bold mb-1">
                      User "farmer.john" deleted his mobile listing
                    </h6>
                    <small className="text-muted">12 mins ago</small>
                  </div>
                </div>

                <div className="timeline-item mb-4 d-flex align-items-start">
                  <span className="timeline-dot bg-warning me-3"></span>
                  <div>
                    <h6 className="fw-bold mb-1">
                      New user "greenfield_88" registered
                    </h6>
                    <small className="text-muted">20 mins ago</small>
                  </div>
                </div>

                <div className="timeline-item mb-4 d-flex align-items-start">
                  <span className="timeline-dot bg-info me-3"></span>
                  <div>
                    <h6 className="fw-bold mb-1">
                      Admin created a news post: “Rain Forecast for Next Week”
                    </h6>
                    <small className="text-muted">35 mins ago</small>
                  </div>
                </div>

                <div className="timeline-item mb-4 d-flex align-items-start">
                  <span className="timeline-dot bg-primary me-3"></span>
                  <div>
                    <h6 className="fw-bold mb-1">
                      User "MeeraAgro" posted a new ad for "Organic Fertilizer
                      Combo Pack"
                    </h6>
                    <small className="text-muted">1 hour ago</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Comments */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title text-success fw-bold">
                💬 Recent Comments
              </h5>
              <ul className="list-unstyled mb-0">
                {comments.map((item, index) => (
                  <li
                    key={index}
                    className="d-flex justify-content-between align-items-start mb-2"
                  >
                    <div>
                      <strong>{item.name}:</strong> {item.comment}
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger ms-2"
                      onClick={() => removeComment(index)}
                      title="Remove comment"
                    >
                      <RxCrossCircled style={{ fontSize: "20px" }} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
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

      <div className="row mt-2">
        <div className="col-md-6 col-12 mb-4">
          <div className="shadow border-0 p-3 h-100">
            <h3 className="mb-3">District Activity</h3>

            <div className="table-responsive">
              <table className="table table-bordered table-striped align-middle text-nowrap">
                <thead
                  className="text-white text-uppercase text-center"
                  style={{ backgroundColor: "green" }}
                >
                  <tr>
                    <th>No</th>
                    <th>District</th>
                    <th>Users</th>
                    <th>Ads</th>
                    <th>News</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {distActivity.length > 0 ? (
                    distActivity.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.district}</td>
                        <td>{item.users}</td>
                        <td>{item.ads}</td>
                        <td>{item.news}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="15" className="text-center">
                        No Dist Activity Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12 mb-4">
          <div className="p-3 shadow rounded-4 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h6 className="fw-bold mb-0">User Join Insights</h6>

              <div>
                <Select
                  value={view}
                  size="small"
                  onChange={(e) => setView(e.target.value)}
                  displayEmpty
                  sx={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: "12px",
                    "& .MuiSelect-select": {
                      padding: "6px 16px",
                    },
                    "& fieldset": {
                      border: "none",
                    },
                  }}
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </div>
            </div>

            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="card shadow border-0 p-3 mt-3">
        <h3 className="hd mb-3">Recent Order Details </h3>

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

      <div className="card shadow border-0 p-3 mt-4">
        <h3 className="hd mb-3">Recent Ads</h3>

        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle text-nowrap">
            <thead className="table-primary text-white text-uppercase text-center">
              <tr>
                <th>NO</th>
                <th>IMAGE</th>
                <th>PRODUCT NAME</th>
                <th>QUANTITY</th>
                <th>PRICE</th>
                <th>FOR</th>
                <th>STATUS</th>
                <th>ADD BY</th>
                <th>MOBILE NUMBER</th>
                <th>DISTRICTS</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {dummyAdsData.length > 0 ? (
                dummyAdsData.map((item, index) => (
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
                          alt={item.productName}
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

                    <td>
                      <div className="fw-bold">{item.productName}</div>
                      <small className="text-muted">{item.subcategory}</small>
                    </td>

                    <td>
                      {item.quantity} {item.unit}
                    </td>

                    <td>₹ {item.price}</td>

                    <td>
                      <span
                        className={`badge bg-${
                          item.forSale === "sale" ? "success" : "info"
                        }`}
                      >
                        {item.forSale.toUpperCase()}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge rounded-pill bg-${
                          item.status === "Active" ? "success" : "secondary"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <span className="fw-semibold">{item.postedBy}</span>
                    </td>

                    <td>{item.contactNumber}</td>

                    <td>
                      <div className="d-flex flex-wrap gap-1 justify-content-center">
                        {item.districts.map((dist, idx) => (
                          <span
                            key={idx}
                            className="badge bg-light text-dark border"
                          >
                            {dist}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center text-muted">
                    No advertisements found.
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
