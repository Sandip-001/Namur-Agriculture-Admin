import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../../App";
import ResponsivePagination from "../../../components/Pagination";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import axiosInstance from "../../../utils/axiosInstance";

const LandMapList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [mapData, setMapData] = useState([]);

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMapData = mapData.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(mapData.length / itemsPerPage);

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
              <Button className="btn-blue ms-3 ps-3 pe-3">Upload Map Data</Button>
            </Link>
          </div>
        </div>

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
