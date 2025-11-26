import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Optional: configure internal sub-pages if needed
// Full pageAccessConfig covering all routes
const pageAccessConfig = {
  Dashboard: [],

  Categories: [
    "AddCategory",
    "CategoryList",
    "AddSubCategory",
    "SubCategoryList",
  ],

  Products: [
    "AddProduct",
    "ProductList",
  ],

  Orders: [
    "OrderList",
  ],

  Users: [
    "Users",
    "SellerProfile",
    "SellerProductList",
  ],

  News: [
    "AddNews",
    "NewsList",
  ],

  Advertisement: [
    "AddAdvertisement",
    "AddForFpo",
    "AdminAdvertisementList",
    "UserAdvertisementList",
    "FpoAdvertisementList",
  ],

  SubAdmins: [
    "AddSubAdmin",
    "SubAdminList",
  ],

  Notification: [
    "CreateNotification",
  ],

  History: [
    "History",
  ],

  Districts: [
    "DistrictActivity",
  ],

  FPO: [
    "AddFpo",
    "FpoList",
  ],
   CropCalendar: ["UploadCropCalendar", "CropCalendarList"],
};


const PrivateRoute = ({ element, page, subPage }) => {
  const { user } = useSelector((state) => state.auth);

  // If not logged in → redirect to login
  if (!user) return <Navigate to="/login" />;

  // Admin → full access
  if (user.role === "admin") return element;

  // Subadmin → check page access
  if (user.role === "subadmin") {
    if (user.page_access?.includes(page)) {
      // If subPage not provided → allow whole section
      if (!subPage) return element;

      // If subPage provided → check allowed subPages
      const allowedSubPages = pageAccessConfig[page] || [];
      if (allowedSubPages.includes(subPage)) return element;
    }
  }

  // Unauthorized access
  return <Navigate to="/unauthorized" />;
};

export default PrivateRoute;
