import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../../App";
import ResponsivePagination from "../../../components/Pagination";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import axiosInstance from "../../../utils/axiosInstance";
import karnatakaData from "../../../data/karnataka_districts_taluks_villages.json";

const LandMapList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [mapData, setMapData] = useState([]);
  const [district, setDistrict] = useState("");
  const [taluk, setTaluk] = useState("");
  const [village, setVillage] = useState("");

  const districtOptions = Object.keys(karnatakaData).map((d) => ({
    label: d,
    value: d,
  }));

  const talukOptions = district
    ? Object.keys(karnatakaData[district] || {}).map((t) => ({
        label: t,
        value: t,
      }))
    : [];

  const villageOptions =
    district && taluk
      ? (karnatakaData[district]?.[taluk] || []).map((v) => ({
          label: v,
          value: v,
        }))
      : [];

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    fetchMapData();
  }, []);

  // 🚀 Fetch Map Details API
  const fetchMapData = async () => {
    try {
      setProgress(20);
      const res = await axiosInstance.get(`/api/land-maps`);
      setMapData(res.data);
      setProgress(100);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAlertBox({
        open: true,
        msg: "Failed to fetch data",
        error: true,
      });
      setProgress(100);
    }
  };

  // 🔥 FILTER FUNCTION (case insensitive)
  const filteredData = mapData.filter((item) => {
    const d = item.district?.toLowerCase();
    const t = item.taluk?.toLowerCase();
    const v = item.village?.toLowerCase();

    const fd = district.toLowerCase();
    const ft = taluk.toLowerCase();
    const fv = village.toLowerCase();

    if (district && !taluk && !village) return d === fd;

    if (district && taluk && !village) return d === fd && t === ft;

    if (district && taluk && village) return d === fd && t === ft && v === fv;

    return true;
  });

  // 🚀 PAGINATION LOGIC
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMapData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // 🚀 Delete Map Data API
  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/api/land-maps/${id}`);
        // 🚀 Update UI instantly
        setMapData((prev) => prev.filter((item) => item.id !== id));

        Swal.fire("Deleted!", "Land Map Data has been deleted.", "success");
      } catch (error) {
        console.log(error);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Map Data</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/upload-land-map-data"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">
                Upload Map Data
              </Button>
            </Link>
          </div>
        </div>

        <Grid
          container
          spacing={2}
          columns={{ xs: 3, sm: 3, md: 3, lg: 3 }}
          className="mt-4"
        >
          <Grid item size={1}>
            <FormControl fullWidth>
              <InputLabel>District</InputLabel>
              <Select
                value={district}
                label="District"
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setTaluk(""); // reset dependent fields
                  setVillage("");
                }}
                required
              >
                {districtOptions.map((district) => (
                  <MenuItem key={district.value} value={district.value}>
                    {district.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item size={1}>
            <FormControl fullWidth disabled={!district}>
              <InputLabel>Taluk</InputLabel>
              <Select
                value={taluk}
                label="Taluk"
                onChange={(e) => {
                  setTaluk(e.target.value);
                  setVillage("");
                }}
                required
              >
                {talukOptions.map((taluk) => (
                  <MenuItem key={taluk.value} value={taluk.value}>
                    {taluk.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item size={1}>
            <FormControl fullWidth disabled={!taluk}>
              <InputLabel>Village</InputLabel>
              <Select
                value={village}
                label="Village"
                onChange={(e) => setVillage(e.target.value)}
                required
              >
                {villageOptions.map((village) => (
                  <MenuItem key={village.value} value={village.value}>
                    {village.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {(district || taluk || village) && (
          <Button
            variant="contained"
            color="warning"
            className="m-auto d-block mt-3"
            onClick={() => {
              setDistrict("");
              setTaluk("");
              setVillage("");
              setCurrentPage(1);
            }}
          >
            Clear Filter
          </Button>
        )}

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>No</th>
                  <th>District</th>
                  <th>Taluk</th>
                  <th>Village</th>
                  <th>Survey No</th>
                  <th>Hissa No</th>
                  <th>Acres</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {paginatedMapData.length > 0 ? (
                  paginatedMapData.map((item, index) => (
                    <tr key={index}>
                      <td>{startIndex + index + 1}</td>
                      <td>{item.district}</td>
                      <td>{item.taluk}</td>
                      <td>{item.village}</td>
                      <td>{item.survey_no}</td>
                      <td>{item.hissa_no}</td>
                      <td>{item.area_acres}</td>
                      <td>
                        <div className="d-flex gap-2 align-item-center justify-content-center">
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteClick(item.id)}
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="15" className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <ResponsivePagination
          page={currentPage}
          count={totalPages}
          onChange={(event, value) => setCurrentPage(value)}
        />
      </div>
    </>
  );
};

export default LandMapList;
