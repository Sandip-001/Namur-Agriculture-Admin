import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../../App";
import ResponsivePagination from "../../../components/Pagination";

const DistrictActivity = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1; // or calculate based on data length

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setProgress(20);
    setProgress(100);
  }, []); // Fetch products when page or category changes

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const distActivity = [
    { district: "Bagalkot", users: 50, ads: 10, news: 5 },
    { district: "Bengaluru Urban", users: 30, ads: 10, news: 5 },
    { district: "Bengaluru Rural", users: 20, ads: 10, news: 7 },
    { district: "Belagavi", users: 30, ads: 10, news: 9 },
    { district: "Ballari", users: 18, ads: 32, news: 6 },
  ];

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
                  <th>News</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {distActivity.length > 0 ? (
                  distActivity.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.district}</td>
                      <td>{item.users}</td>
                      <td>{item.ads}</td>
                      <td>{item.news}</td>
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