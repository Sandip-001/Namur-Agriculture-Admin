import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import { MyContext } from "../App";

const Login = () => {
  const { setIsHideSidebarAndHeader, setAlertBox } = useContext(MyContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setIsHideSidebarAndHeader(true);
    window.scrollTo(0, 0);

    // If already logged in, prevent access to login page
    const role = localStorage.getItem("role");
    if (role === "superadmin") {
      navigate("/");
    }
  }, [navigate, setIsHideSidebarAndHeader]);

  const handleLogin = (e) => {
    e.preventDefault();

    const dummy = {
      name: "Prithvi",
      email: "prithvi@gmail.com",
      password: "prithvi@1234",
      role: "superadmin",
    };

    if (email === dummy.email && password === dummy.password) {
      localStorage.setItem("user", JSON.stringify(dummy));
      localStorage.setItem("role", dummy.role);
      setAlertBox({
        msg: "Login successfull!",
        open:true,
        error:false,
      })
      navigate("/");
    } else {
      setAlertBox({
        msg: "Invalid email or password",
        open:true,
        error:true,
      })
    }
  };

  return (
    <div className="login-page">
      <div className="login-glass">
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
              required
            />
          </div>
          <button type="submit" className="login-button">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

