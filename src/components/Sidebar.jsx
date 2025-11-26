import { Button } from "@mui/material";
import React, { useContext, useState } from "react";
import { FaAngleRight, FaClipboardCheck, FaUsers } from "react-icons/fa6";
import { MdDashboard, MdManageAccounts } from "react-icons/md";
import { Link } from "react-router-dom";
import { MyContext } from "../App";
import { IoNotifications } from "react-icons/io5";
import { RiAdvertisementFill, RiHistoryFill } from "react-icons/ri";
import { useSelector } from "react-redux";

const pageAccessConfig = {
  Dashboard: [],
  Categories: ["AddCategory", "CategoryList", "AddSubCategory", "SubCategoryList"],
  Products: ["AddProduct", "ProductList"],
  Orders: ["OrderList"],
  Users: ["Users", "SellerProfile", "SellerProductList"],
  News: ["AddNews", "NewsList"],
  Advertisement: [
    "AddAdvertisement",
    "AddForFpo",
    "AdminAdvertisementList",
    "UserAdvertisementList",
    "FpoAdvertisementList",
  ],
  SubAdmins: ["AddSubAdmin", "SubAdminList"],
  Notification: ["CreateNotification"],
  History: ["History"],
  Districts: ["DistrictActivity"],
  FPO: ["AddFpo", "FpoList"],
  CropCalendar: ["UploadCropCalendar", "CropCalendarList"],
};

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(null);
  const { windowWidth, setIsOpenNav } = useContext(MyContext);

  const { user } = useSelector((state) => state.auth); // logged-in user

  const isOpenSubmenu = (index) => {
    setActiveTab(activeTab === index ? null : index);
  };

  const handleCloseSidebarOnMobile = () => {
    if (windowWidth < 992) setIsOpenNav(false);
  };

  // check page/subpage access
const hasAccess = (page, subPage = null) => {
  if (!user) return false;
  if (user.role === "admin") return true;

  // Must have parent page access
  if (!user.page_access?.includes(page)) return false;

  // Parent page only
  if (!subPage) return true;

  // Parent + subPage
  const allowedSubPages = pageAccessConfig[page] || [];
  return allowedSubPages.includes(subPage);
};

  // style disabled links
  const linkStyle = (page, subPage = null) => ({
    pointerEvents: hasAccess(page, subPage) ? "auto" : "none",
    opacity: hasAccess(page, subPage) ? 1 : 0.5,
  });

  return (
    <div className="sidebar" style={{ background: "#05a415" }}>
      {/* {JSON.stringify(user)} */}
      <ul>
        {/* Dashboard */}
        <li>
          <Link to="/" onClick={handleCloseSidebarOnMobile} style={linkStyle("Dashboard")}>
            <Button
              className={`w-100 ${activeTab === 0 ? "active" : ""}`}
              onClick={() => setActiveTab(0)}
              disabled={!hasAccess("Dashboard")}
            >
              <span className="icon"><MdDashboard /></span>
              Dashboard
            </Button>
          </Link>
        </li>

        {/* Advertisement */}
       <li style={linkStyle("Advertisement")}>
  <Button
    className={`w-100 ${activeTab === 1 ? "active" : ""}`}
    onClick={() => isOpenSubmenu(1)}
    disabled={!hasAccess("Advertisement")}
  >
    <span className="icon"><RiAdvertisementFill /></span>
    Advertisement
    <span className="arrow"><FaAngleRight /></span>
  </Button>
  <div className={`submenuWrapper ${activeTab === 1 ? "colapse" : "colapsed"}`}>
    <ul className="submenu">
      <li>
        <Link to="/admin-advertisement-list" onClick={handleCloseSidebarOnMobile}
          style={linkStyle("Advertisement", "AdminAdvertisementList")}>
          Admin Ads
        </Link>
      </li>
      <li>
        <Link to="/user-advertisement-list" onClick={handleCloseSidebarOnMobile}
          style={linkStyle("Advertisement", "UserAdvertisementList")}>
          User Ads
        </Link>
      </li>
      <li>
        <Link to="/fpo-advertisement-list" onClick={handleCloseSidebarOnMobile}
          style={linkStyle("Advertisement", "FpoAdvertisementList")}>
          FPO Ads
        </Link>
      </li>
    </ul>
  </div>
</li>


        {/* Users */}
       <li style={linkStyle("Users")}>
  <Button
    className={`w-100 ${activeTab === 2 ? "active" : ""}`}
    onClick={() => isOpenSubmenu(2)}
    disabled={!hasAccess("Users")}
  >
    <span className="icon"><FaUsers /></span>
    Users
    <span className="arrow"><FaAngleRight /></span>
  </Button>
  <div className={`submenuWrapper ${activeTab === 2 ? "colapse" : "colapsed"}`}>
    <ul className="submenu">
      <li>
        <Link to="/users" onClick={handleCloseSidebarOnMobile}
          style={linkStyle("Users", "Users")}>
          All Users
        </Link>
      </li>
      <li>
        <Link to="/FPO-list" onClick={handleCloseSidebarOnMobile}
          style={linkStyle("FPO", "FpoList")}>
          FPO
        </Link>
      </li>
    </ul>
  </div>
</li>

        {/* Communication (News + Notification) */}
        <li>
          <Button
            className={`w-100 ${activeTab === 3 ? "active" : ""}`}
            onClick={() => isOpenSubmenu(3)}
            disabled={!hasAccess("News") && !hasAccess("Notification")}
          >
            <span className="icon"><IoNotifications /></span>
            Communication
            <span className="arrow"><FaAngleRight /></span>
          </Button>
          <div className={`submenuWrapper ${activeTab === 3 ? "colapse" : "colapsed"}`}>
            <ul className="submenu">
              <li>
                <Link to="/news-list" onClick={handleCloseSidebarOnMobile}
                  style={linkStyle("News", "NewsList")}>
                  News
                </Link>
              </li>
              <li>
                <Link to="/create-notification" onClick={handleCloseSidebarOnMobile}
                  style={linkStyle("Notification", "CreateNotification")}>
                  Notification
                </Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Management (Categories, Products, SubAdmins, Districts) */}
        <li>
          <Button
            className={`w-100 ${activeTab === 4 ? "active" : ""}`}
            onClick={() => isOpenSubmenu(4)}
            disabled={!hasAccess("Categories") && !hasAccess("Products")}
          >
            <span className="icon"><MdManageAccounts /></span>
            Management
            <span className="arrow"><FaAngleRight /></span>
          </Button>
          <div className={`submenuWrapper ${activeTab === 4 ? "colapse" : "colapsed"}`}>
            <ul className="submenu">
              <li>
                <Link to="/category-list" onClick={handleCloseSidebarOnMobile}
                  style={linkStyle("Categories", "CategoryList")}>
                  Category
                </Link>
              </li>
              <li>
                <Link to="/subCategory-list" onClick={handleCloseSidebarOnMobile}
                  style={linkStyle("Categories", "SubCategoryList")}>
                  Sub-Category
                </Link>
              </li>
              <li>
                <Link to="/product-list" onClick={handleCloseSidebarOnMobile}
                  style={linkStyle("Products", "ProductList")}>
                  Product
                </Link>
              </li>
              <li>
                <Link to="/subadmin-list" onClick={handleCloseSidebarOnMobile}
                  style={linkStyle("SubAdmins", "SubAdminList")}>
                  Subadmin
                </Link>
              </li>
              <li>
                <Link to="/distActivity" onClick={handleCloseSidebarOnMobile}
                  style={linkStyle("Districts", "DistrictActivity")}>
                  District Activity
                </Link>
              </li>
            </ul>
          </div>
        </li>

        {/* History */}
        <li>
          <Link to="/logs" onClick={handleCloseSidebarOnMobile} style={linkStyle("History", "History")}>
            <Button
              className={`w-100 ${activeTab === 5 ? "active" : ""}`}
              onClick={() => setActiveTab(5)}
              disabled={!hasAccess("History")}
            >
              <span className="icon"><RiHistoryFill /></span>
              History
            </Button>
          </Link>
        </li>

        {/* Orders */}
        <li>
          <div></div>
          <Link to="/orders" onClick={handleCloseSidebarOnMobile} style={linkStyle("Orders", "OrderList")}>
            <Button
              className={`w-100 ${activeTab === 6 ? "active" : ""}`}
              onClick={() => setActiveTab(6)}
              disabled={!hasAccess("Orders")}
            >
              <span className="icon"><FaClipboardCheck /></span>
              Orders
            </Button>
          </Link>
        </li>

 {/* Crop Calendar */}
<li style={linkStyle("CropCalendar")}>
  <Button
    className={`w-100 ${activeTab === 7 ? "active" : ""}`}
    onClick={() => isOpenSubmenu(7)}
    disabled={!hasAccess("CropCalendar")}
  >
    <span className="icon"><MdManageAccounts /></span>
    Crop Calendar
    <span className="arrow"><FaAngleRight /></span>
  </Button>
  <div className={`submenuWrapper ${activeTab === 7 ? "colapse" : "colapsed"}`}>
    <ul className="submenu">
      <li>
        <Link
          to="/upload-crop-calender"
          onClick={handleCloseSidebarOnMobile}
          style={linkStyle("CropCalendar", "UploadCropCalendar")}
        >
          Uploads
        </Link>
      </li>
      <li>
        <Link
          to="/crop-calender-list"
          onClick={handleCloseSidebarOnMobile}
          style={linkStyle("CropCalendar", "CropCalendarList")}
        >
          Organize
        </Link>
      </li>
    </ul>
  </div>
</li>
      </ul>
    </div>
  );
};

export default Sidebar;
