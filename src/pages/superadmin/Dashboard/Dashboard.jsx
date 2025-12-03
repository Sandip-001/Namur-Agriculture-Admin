import { useContext, useEffect, useState } from "react";
import DashboardBox from "./components/DashboardBox";
import { HiDotsVertical } from "react-icons/hi";
import { MyContext } from "../../../App";
import { Select } from "@mui/material";
import onion from "../../../assets/onion.png";
import goat from "../../../assets/goat.png";
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
import { IoIosTimer } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
import axiosInstance from "../../../utils/axiosInstance";
import { format } from "date-fns";
import ImageHoverSlider from "../../../components/ImageHoverSlider";

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

  const [view, setView] = useState("daily");
  const [userJoinData, setUserJoinData] = useState({
    daily: [],
    weekly: [],
    monthly: [],
  });
  const [districts, setDistricts] = useState([]);
  const [products, setProducts] = useState([]);
  const [ads, setAds] = useState([]);

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  const fetchDistrictActivity = async () => {
    try {
      setProgress(20);
      const res = await axiosInstance.get(`/api/user/admin/district-activity`);
      console.log("District Activity", res.data);
      const limitedDistActivity = res.data.slice(0, 6);
      setDistricts(limitedDistActivity);

      setProgress(100);
    } catch (error) {
      console.error("Error fetching ads:", error);
      setAlertBox({
        open: true,
        msg: "Failed to load district activities",
        error: true,
      });
      setProgress(100);
    }
  };

  const fetchProducts = async () => {
    try {
      setProgress(20);
      const res = await axiosInstance.get(`/api/products`);
      console.log("District Activity", res.data);

      // Only keep first 5 records
      const limitedProducts = res.data.slice(0, 5);
      setProducts(limitedProducts);
      setProgress(100);
    } catch (error) {
      console.error("Error fetching ads:", error);
      setAlertBox({
        open: true,
        msg: "Failed to load products",
        error: true,
      });
      setProgress(100);
    }
  };

  const fetchAds = async () => {
    try {
      setProgress(20);
      const res = await axiosInstance.get("/api/ads");

      const limitedAds = res.data.slice(0, 5);
      setAds(limitedAds);
      setProgress(100);
    } catch (error) {
      console.error("Error fetching ads:", error);
      setAlertBox({
        open: true,
        msg: "Failed to load advertisements",
        error: true,
      });
      setProgress(100);
    }
  };

  const fetchInsights = async () => {
    try {
      setProgress(20);
      const res = await axiosInstance.get("/api/user/admin/insights");
      setUserJoinData(res.data);
      setProgress(100)
    } catch (err) {
      console.error("Error fetching insights:", err);
    }
  };


  useEffect(() => {
    fetchDistrictActivity();
    fetchProducts();
    fetchInsights();
    fetchAds();
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const ITEM_HEIGHT = 48;

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
      comment:
        "Love the new UI! Much better than the previous version grater than previous one 👏",
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
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function (context) {
          const entry = userJoinData[view][context.dataIndex];

          if (view === "weekly") {
            return [
              `Users Joined: ${entry.count}`,
              entry.days // 👈 show week date range
            ];
          }

          return `Users Joined: ${context.raw}`;
        }
      }
    }
  }
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
            <h6 className="fw-semibold mb-3">
              Products <strong>(P1)</strong>
            </h6>
            <ul className="list-unstyled m-0">
              {products.map((product, idx) => (
                <li
                  key={idx}
                  className="d-flex align-items-center justify-content-between py-2 border-bottom"
                >
                  <div className="d-flex align-items-center gap-2">
                    <Avatar src={product.image_url} alt={product.name} />
                    <div>
                      <div className="fw-semibold">{product.name}</div>
                      <div className="text-muted small">
                        {product.subcategory_name}
                      </div>
                    </div>
                  </div>
                  <div className="text-muted small">
                    {product.category_name}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-6 col-12 mb-4">
          <div className="shadow border-0 p-3 h-100">
            <h3 className="mb-3">
              District Activity <strong>(P1)</strong>
            </h3>

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
                  </tr>
                </thead>
                <tbody className="text-center">
                  {districts.length > 0 ? (
                    districts.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.district_name}</td>
                        <td>{item.total_users}</td>
                        <td>{item.total_ads}</td>
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
              <h6 className="fw-bold mb-0">User Join Insights <strong>(P1)</strong></h6>

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
        <h3 className="hd mb-3">
          Recent Ads <strong>(P1)</strong>
        </h3>

        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle text-nowrap">
            <thead className="table-primary text-white text-uppercase text-center">
              <tr>
                <th>NO</th>
                <th>IMAGE</th>
                <th>ITEM </th>
                <th>PRICE</th>
                <th>STATUS</th>
                <th>CONTACT</th>
                <th>DISTRICTS</th>
                <th>TIME</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {ads.length > 0 ? (
                ads.map((item, index) => (
                  <tr key={item.id} className="tableRow">
                    <td># {index + 1}</td>
                    <td
                      className="d-flex align-items-center justify-content-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ImageHoverSlider images={item.images || []} />
                    </td>
                    <td>
                      <div className="fw-bold">{item.title}</div>
                      <small className="text-muted">{item.product_name}</small>
                    </td>
                    <td>
                      <div className="fw-bold">
                        ₹{item.price} / {item.unit}
                      </div>
                      <small className="text-muted">{item.quantity}</small>
                    </td>

                    <td>
                      <h6>
                        <span
                          className={`badge bg-${
                            item.ad_type?.toLowerCase() === "sell"
                              ? "success"
                              : "info"
                          }`}
                        >
                          {item.ad_type.toUpperCase()}
                        </span>
                      </h6>

                      <h6>
                        <span
                          className={`badge bg-${
                            item.post_type === "postnow"
                              ? "primary"
                              : "warning text-dark"
                          }`}
                        >
                          {item.post_type === "postnow"
                            ? "Post Now"
                            : "Scheduled"}
                        </span>
                      </h6>

                      {/* STATUS BADGE */}
                      <h6>
                        <span
                          className={`badge bg-${
                            item.status === "active"
                              ? "success"
                              : item.status === "pending"
                              ? "warning text-dark"
                              : "danger"
                          }`}
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </span>
                      </h6>

                      {/* <h6>
                                      <span
                                        className={`badge rounded-pill bg-${
                                          item.expiry_date ? "secondary" : "success"
                                        }`}
                                      >
                                        {item.expiry_date ? "Expired" : "Active"}
                                      </span>
                                    </h6> */}
                    </td>

                    <td>
                      <div className="fw-semibold">{item.creator_name}</div>

                      {/* Show role */}
                      <span className="text-muted">{item.created_by_role}</span>

                      {/* Show mobile number depending on role */}
                      {item.created_by_role === "user" && item.user_mobile && (
                        <div className="text-muted">{item.user_mobile}</div>
                      )}

                      {item.created_by_role === "subadmin" &&
                        item.subadmin_number && (
                          <div className="text-muted">
                            {item.subadmin_number}
                          </div>
                        )}
                    </td>

                    <td>
                      <div className="d-flex flex-wrap gap-1 justify-content-center">
                        {(item.districts || "[]").map((dist, idx) => (
                          <span
                            key={idx}
                            className="badge bg-light text-dark border"
                          >
                            {dist}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      {format(
                        new Date(item.created_at),
                        "do MMMM yyyy, hh:mm a"
                      )}
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
