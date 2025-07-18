import React, { useState } from "react";
import { TextField, InputAdornment, IconButton, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddIcon from "@mui/icons-material/Add";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const AdsHeaderSection = ({
  filteredAds,
  setSearchQuery,
  searchQuery,
  viewMode,
  setViewMode,
  title,
  showCreateAdsButton,
  url
}) => {

  const navigate = useNavigate();

  const handleDownloadExcel = () => {
    const exportData = filteredAds.map((ad, index) => ({
      SNo: index + 1,
      Product: ad.productName,
      Category: ad.product,
      Subcategory: ad.subcategory,
      Quantity: ad.quantity,
      Unit: ad.unit,
      Price: ad.price,
      ForSale: ad.forSale,
      PostedBy: ad.postedBy,
      Contact: ad.contactNumber,
      Districts: ad.districts.join(", "), // convert districts array to comma-separated string
      Images: ad.images ? ad.images.join(", ") : "", // convert images array to comma-separated string (if exists)
      Status: ad.status,
      Date: ad.createdDate,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Advertisements");
    XLSX.writeFile(workbook, "User_Advertisements.xlsx");
  };

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
      <h5 className="mb-0">{title}</h5>

      <div className="d-flex flex-wrap gap-2 align-items-center">
        {/* Search Input */}
        <Tooltip
          title="Search ads by product subcategory, name, title and user name "
          placement="top"
        >
          <TextField
            variant="outlined"
            placeholder="Search ads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", sm: "250px" },
              backgroundColor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ccc" },
                "&:hover fieldset": { borderColor: "#f0883d" },
                "&.Mui-focused fieldset": { borderColor: "#f0883d" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#f0883d" }} />
                </InputAdornment>
              ),
            }}
          />
        </Tooltip>

        {/* Grid/List Toggle Button */}
        <Tooltip
          title={viewMode === "list" ? "Grid View" : "List View"}
          placement="top"
        >
          <IconButton
            onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            sx={{
              backgroundColor: "#0d67ab",
              color: "#fff",
              "&:hover": { backgroundColor: "#095397" },
            }}
          >
            {viewMode === "list" ? <GridViewIcon /> : <ViewListIcon />}
          </IconButton>
        </Tooltip>

        {/* Download Excel Button */}
        <Tooltip title="Download Excel" placement="top">
          <IconButton
            //onClick={handleDownloadExcel}
            sx={{
              backgroundColor: "#f0883d",
              color: "#fff",
              "&:hover": { backgroundColor: "#e47a2b" },
            }}
          >
            <FileDownloadIcon />
          </IconButton>
        </Tooltip>

        {showCreateAdsButton === true && (
          <Tooltip title="Create Ads" placement="top">
            <IconButton
              onClick={() => navigate(url)}
              sx={{
                backgroundColor: "#05a415",
                color: "#fff",
                "&:hover": { backgroundColor: "#099216ff" },
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        )}
        
      </div>
    </div>
  );
};

export default AdsHeaderSection;