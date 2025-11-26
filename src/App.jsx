import React from "react";
import "./App.css";
import "./responsive.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/superadmin/Dashboard/Dashboard";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import AddCategory from "./pages/superadmin/Category/AddCategory";
import CategoryList from "./pages/superadmin/Category/CategoryList";
import AddSubCategory from "./pages/superadmin/Category/AddSubCategory";
import SubCategoryList from "./pages/superadmin/Category/SubCategoryList";
import AddProduct from "./pages/superadmin/Products/AddProduct";
import ProductList from "./pages/superadmin/Products/ProductList";
import OrderList from "./pages/superadmin/Orders/OrderList";
import SellerProfile from "./pages/superadmin/Sellers/SellerDetails";
import SellerProductList from "./pages/superadmin/Sellers/SellerProductList";
import Users from "./pages/superadmin/Sellers/Users";
import AddNews from "./pages/superadmin/News/AddNews";
import NewsList from "./pages/superadmin/News/NewsList";
import AddAdvertisement from "./pages/superadmin/Advertisement/AddAdvertisement";
import AdvertisementList from "./pages/superadmin/Advertisement/AdvertisementList";
import AddSubAdmin from "./pages/superadmin/subadmins/AddSubAdmin";
import SubAdminList from "./pages/superadmin/subadmins/SubAdminList";
import CreateNotification from "./pages/superadmin/Notification/CreateNotification";
import UserAdvertisementList from "./pages/superadmin/Advertisement/UserAdvertisementList";
import History from "./pages/superadmin/History/History";
import DistrictActivity from "./pages/superadmin/subadmins/DistrictActivity";
import AddFpo from "./pages/superadmin/FPO/AddFpo";
import FpoList from "./pages/superadmin/FPO/FpoList";
import FpoAdvertisementList from "./pages/superadmin/Advertisement/FpoAdsList";
import AddForFpo from "./pages/superadmin/Advertisement/AddForFpo";
import AddCropCalendar from "./pages/superadmin/CropCalender/AddCropCalendar";
import CropCalendarList from "./pages/superadmin/CropCalender/CropCalendarList";

const MyContext = createContext();

function App() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isHideSidebarAndHeader, setIsHideSidebarAndHeader] = useState(false);
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [districts, setDistricts] = useState([]);

  const [progress, setProgress] = useState(0);

  const [alertBox, setAlertBox] = useState({
    open: false,
    error: false,
    msg: "",
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertBox({
      open: false,
    });
  };

  useEffect(() => {
    fetch("https://api.countrystatecity.in/v1/countries/IN/states/KA/cities", {
      headers: {
        "X-CSCAPI-KEY":
          "dHFLWG1XQ3J0OUtTMlRmVTlZUGptRHlUSUxmaHhtUlB0NFMxc1gzaA==",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log("Raw API response:", data);
        const cityNames = data.map((city) => city.name);
        //console.log("Mapped city names:", cityNames);
        setDistricts(cityNames);
      })
      .catch((err) => console.error("Failed to fetch cities", err));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openNav = () => {
    setIsOpenNav(true);
  };

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isLogin,
    setIsLogin,
    isHideSidebarAndHeader,
    setIsHideSidebarAndHeader,
    windowWidth,
    setWindowWidth,
    isOpenNav,
    openNav,
    setIsOpenNav,
    setProgress,
    alertBox,
    setAlertBox,
    districts,
    setDistricts,
  };

  return (
    <Router>
      <MyContext.Provider value={values}>
        <LoadingBar
          color="#f11946"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
          className="topLoadingBar"
        />

        <Snackbar
          open={alertBox.open}
          autoHideDuration={4000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={alertBox.error === false ? "success" : "error"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {alertBox.msg}
          </Alert>
        </Snackbar>
        {isHideSidebarAndHeader !== true && <Header />}

        <div className="main d-flex">
          {isHideSidebarAndHeader !== true && (
            <>
              <div
                className={`sidebarOverlay d-none ${
                  isOpenNav === true && "show"
                }`}
                onClick={() => setIsOpenNav(false)}
              ></div>
              <div
                className={`sidebarWrapper ${
                  isToggleSidebar === true ? "toggle" : ""
                } ${isOpenNav === true ? "open" : ""}`}
              >
                <Sidebar />
              </div>
            </>
          )}

          <div
            className={`content ${isHideSidebarAndHeader === true && "full"} ${
              isToggleSidebar === true ? "toggle" : ""
            }`}
          >
            <Routes>
              <Route exact path="/login" element={<Login />} />

              {/* Dashboard */}
              <Route
                exact
                path="/"
                element={
                  <PrivateRoute element={<Dashboard />} page="Dashboard" />
                }
              />

              {/* Categories */}
              <Route
                exact
                path="/add-category"
                element={
                  <PrivateRoute element={<AddCategory />} page="Categories" />
                }
              />
              <Route
                exact
                path="/category-list"
                element={
                  <PrivateRoute element={<CategoryList />} page="Categories" />
                }
              />
              <Route
                exact
                path="/add-subCategory"
                element={
                  <PrivateRoute
                    element={<AddSubCategory />}
                    page="Categories"
                  />
                }
              />
              <Route
                exact
                path="/subCategory-list"
                element={
                  <PrivateRoute
                    element={<SubCategoryList />}
                    page="Categories"
                  />
                }
              />

              {/* Products */}
              <Route
                exact
                path="/add-product"
                element={
                  <PrivateRoute element={<AddProduct />} page="Products" />
                }
              />
              <Route
                exact
                path="/product-list"
                element={
                  <PrivateRoute element={<ProductList />} page="Products" />
                }
              />

              {/* Orders */}
              <Route
                exact
                path="/orders"
                element={<PrivateRoute element={<OrderList />} page="Orders" />}
              />

              {/* Users */}
              <Route
                exact
                path="/user-profile/:id"
                element={
                  <PrivateRoute element={<SellerProfile />} page="Users" />
                }
              />
              <Route
                exact
                path="/user-products/:id"
                element={
                  <PrivateRoute element={<SellerProductList />} page="Users" />
                }
              />
              <Route
                exact
                path="/users"
                element={<PrivateRoute element={<Users />} page="Users" />}
              />

              {/* News */}
              <Route
                exact
                path="/add-news"
                element={<PrivateRoute element={<AddNews />} page="News" />}
              />
              <Route
                exact
                path="/news-list"
                element={<PrivateRoute element={<NewsList />} page="News" />}
              />

              {/* Advertisement */}
              <Route
                exact
                path="/add-advertisement"
                element={
                  <PrivateRoute
                    element={<AddAdvertisement />}
                    page="Advertisement"
                  />
                }
              />
              <Route
                exact
                path="/add-fpoadvertisement"
                element={
                  <PrivateRoute element={<AddForFpo />} page="Advertisement" />
                }
              />
              <Route
                exact
                path="/admin-advertisement-list"
                element={
                  <PrivateRoute
                    element={<AdvertisementList />}
                    page="Advertisement"
                  />
                }
              />
              <Route
                exact
                path="/user-advertisement-list"
                element={
                  <PrivateRoute
                    element={<UserAdvertisementList />}
                    page="Advertisement"
                  />
                }
              />
              <Route
                exact
                path="/fpo-advertisement-list"
                element={
                  <PrivateRoute
                    element={<FpoAdvertisementList />}
                    page="Advertisement"
                  />
                }
              />

              {/* SubAdmins */}
              <Route
                exact
                path="/add-subadmin"
                element={
                  <PrivateRoute element={<AddSubAdmin />} page="SubAdmins" />
                }
              />
              <Route
                exact
                path="/subadmin-list"
                element={
                  <PrivateRoute element={<SubAdminList />} page="SubAdmins" />
                }
              />

              {/* Notifications */}
              <Route
                exact
                path="/create-notification"
                element={
                  <PrivateRoute
                    element={<CreateNotification />}
                    page="Notification"
                  />
                }
              />

              {/* History */}
              <Route
                exact
                path="/logs"
                element={<PrivateRoute element={<History />} page="History" />}
              />

              {/* District Activity */}
              <Route
                exact
                path="/distActivity"
                element={
                  <PrivateRoute
                    element={<DistrictActivity />}
                    page="Districts"
                  />
                }
              />

              {/* FPO */}
              <Route
                exact
                path="/add-FPO"
                element={<PrivateRoute element={<AddFpo />} page="FPO" />}
              />
              <Route
                exact
                path="/FPO-list"
                element={<PrivateRoute element={<FpoList />} page="FPO" />}
              />

              {/* Crop Calender */}
              <Route
                exact
                path="/upload-crop-calender"
                element={
                  <PrivateRoute
                    element={<AddCropCalendar />}
                    page="Categories"
                  />
                }
              />
              <Route
                exact
                path="/crop-calender-list"
                element={
                  <PrivateRoute
                    element={<CropCalendarList />}
                    page="Categories"
                  />
                }
              />
            </Routes>
          </div>
        </div>
      </MyContext.Provider>
    </Router>
  );
}

export default App;
export { MyContext };
