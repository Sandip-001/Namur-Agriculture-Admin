import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import { MyContext } from "../App";
import instance from "../utils/axiosInstance"; // adjust path if needed
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";

const Login = () => {
  const dispatch = useDispatch();

  const { setIsHideSidebarAndHeader, setAlertBox } = useContext(MyContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginRole, setLoginRole] = useState("admin");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsHideSidebarAndHeader(true);
    window.scrollTo(0, 0);

    // If already logged in, prevent access to login page
    const user = JSON.parse(localStorage.getItem("Namur_user"));
    if (user) {
      navigate("/");
    }
  }, [navigate, setIsHideSidebarAndHeader]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await instance.post("/api/admins/login", {
        email,
        password,
        role: loginRole, // dynamic: admin or subadmin
      });

      if (res.data?.token) {
        // Save token
        Cookies.set("token", res.data.token, { expires: 7 });

        dispatch(
          loginSuccess({
            token: res.data.token,
            user: res.data.user,
          })
        );

        const { user } = res.data;

        // Show success alert
        setAlertBox({
          msg: res.data.message || "Login successful!",
          open: true,
          error: false,
        });

        // ---- Redirection Logic ----
        if (user.role === "admin") {
          // Admin → Dashboard
          navigate("/");
        } else if (user.role === "subadmin") {
          if (user.page_access?.includes("Dashboard")) {
            // Subadmin with Dashboard access → Dashboard
            navigate("/");
          } else if (user.page_access && user.page_access.length > 0) {
            // Subadmin without Dashboard → redirect to first allowed page
            const firstPage = user.page_access[0];

            // Map page name to actual route path
            const pageRouteMap = {
              Categories: "/category-list",
              Products: "/product-list",
              Orders: "/orders",
              Users: "/users",
              News: "/news-list",
              Advertisement: "/admin-advertisement-list",
              SubAdmins: "/subadmin-list",
              Notification: "/create-notification",
              History: "/logs",
              Districts: "/distActivity",
              FPO: "/FPO-list",
            };

            const redirectPath = pageRouteMap[firstPage] || "/unauthorized";
            navigate(redirectPath);
          } else {
            // No access defined → Unauthorized
            navigate("/unauthorized");
          }
        }
      }
    } catch (err) {
      setAlertBox({
        msg: err.response?.data?.message || "Invalid email or password",
        open: true,
        error: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-glass ">
        <div className="login-header">
          <img src={logo} alt="Logo" className="login-logo" />
          <h2>Login</h2>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="username@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-dark"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-dark"
              required
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              value={loginRole}
              onChange={(e) => setLoginRole(e.target.value)}
              className="w-100 p-2 border-black rounded"
              required
            >
              <option value="admin">Admin</option>
              <option value="subadmin">Subadmin</option>
            </select>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
