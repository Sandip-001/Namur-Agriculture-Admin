import React, { useState } from "react";
import { Button } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { useNavigate } from "react-router-dom";

const DashboardBox = (props) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = () => {
    if (props.path) {
      navigate(props.path);
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="dashboardBox"
      style={{
        backgroundImage: `linear-gradient(to right, ${props.color[0]}, ${props.color[1]})`,
      }}
    >
      {props.grow === true ? (
        <span className="chart">
          <TrendingUpIcon />
        </span>
      ) : (
        <span className="chart">
          <TrendingDownIcon />
        </span>
      )}

      <div className="d-flex w-100">
        <div className="col1">
          <h4 className="text-white mb-0">{props.name}</h4>
          <span className="text-white">{props.length}</span>
        </div>

        <div className="ms-auto">
          {props.icon ? <span className="icon">{props.icon}</span> : ""}
        </div>
      </div>
    </Button>
  );
};

export default DashboardBox;
