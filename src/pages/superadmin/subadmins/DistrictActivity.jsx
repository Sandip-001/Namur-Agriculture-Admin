import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../../App";
import ResponsivePagination from "../../../components/Pagination";
import axiosInstance from "../../../utils/axiosInstance";

const DistrictActivity = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1; // or calculate based on data length

  const [districts, setDistricts] = useState([]);

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const fetchDistrictActivity = async () => {
    try {
      setProgress(20);
      const res = await axiosInstance.get(
        `/api/user/admin/district-activity`
      );
      console.log("District Activity", res.data);
      setDistricts(res.data);

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

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    fetchDistrictActivity();
  }, []);


  const handlePageChange = (event, value) => {
    setPage(value);
  };


  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 flex-row p-4">
          <h5 className="mb-0">District Acivity</h5>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
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
    </>
  );
};

export default DistrictActivity;