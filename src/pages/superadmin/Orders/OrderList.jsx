import React, { useContext, useEffect, useState } from "react";
import onion from "../../../assets/onion.png";
import goat from "../../../assets/goat.png";
import { MyContext } from "../../../App";
import ResponsivePagination from "../../../components/Pagination";

const OrderList = () => {
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

  const getDummyOrders = () => {
    return [
      {
        orderCode: "KWz6sXvwnKmlXLFvVoq",
        image: goat,
        name: "Fresh Garlic",
        subCategory: "Garlic",
        buyerName: "Sandip Chowdhury",
        buyerAddress: "kandi murshidabd pin-742137",
        buyerNumber: "9876543210",
        price: 1200,
        quantity: 4,
        total: 4800,
        orderDate: "23/06/2025 12:23pm",
        sellerName: "Babu Roy",
        sellerNumber: "8617019875",
        sellerAddress: "Berhmapore murshidabad pin-789234",
        status: "Confirmed",
      },
      {
        orderCode: "VGb31XvwnKmlXLFvVrd",
        image: onion,
        name: "New Born Onions",
        subCategory: "Onion",
        buyerName: "Ankit Ghosh",
        buyerAddress: "kandi murshidabd pin-742137",
        buyerNumber: "9876543213",
        price: 60,
        quantity: 10,
        total: 600,
        orderDate: "22/06/2025 06:20pm",
        sellerName: "Babu Roy",
        sellerNumber: "8617019875",
        sellerAddress: "Berhmapore murshidabad pin-789234",
        status: "cancelled",
      },
      {
        orderCode: "KWz6sXvwnKmlXLFvVoq",
        image: goat,
        name: "Fresh Garlic",
        subCategory: "Garlic",
        buyerName: "Sandip Chowdhury",
        buyerAddress: "kandi murshidabd pin-742137",
        buyerNumber: "9876543210",
        price: 1200,
        quantity: 4,
        total: 4800,
        orderDate: "23/06/2025 12:23pm",
        sellerName: "Babu Roy",
        sellerNumber: "8617019875",
        sellerAddress: "Berhmapore murshidabad pin-789234",
        status: "confirmed",
      },
      {
        orderCode: "VGb31XvwnKmlXLFvVrd",
        image: onion,
        name: "New Born Onions",
        subCategory: "Onion",
        buyerName: "Ankit Ghosh",
        buyerAddress: "kandi murshidabd pin-742137",
        buyerNumber: "9876543213",
        price: 60,
        quantity: 10,
        total: 600,
        orderDate: "22/06/2025 06:20pm",
        sellerName: "Babu Roy",
        sellerNumber: "8617019875",
        sellerAddress: "Berhmapore murshidabad pin-789234",
        status: "cancelled",
      },
    ];
  };

  const dummyData = getDummyOrders();

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Orders</h5>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>No</th>
                  <th>Product Name</th>
                  <th>Image</th>
                  <th>Subcategory</th>
                  <th>Buyer Name</th>
                  <th>Buyer Contact</th>
                  <th>Buyer Address</th>
                  <th>Seller Name</th>
                  <th>Seller Contact</th>
                  <th>Seller Address</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Order Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {dummyData.length > 0 ? (
                  dummyData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>
                        <img
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          style={{ objectFit: "cover" }}
                        />
                      </td>
                      <td>{item.subCategory}</td>
                      <td>{item.buyerName}</td>
                      <td>{item.buyerNumber}</td>
                      <td>{item.buyerAddress}</td>
                      <td>{item.sellerName}</td>
                      <td>{item.sellerNumber}</td>
                      <td>{item.sellerAddress}</td>
                      <td>₹{item.price}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.total}</td>
                      <td>{item.orderDate}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.status.toLowerCase() === "cancelled"
                              ? "bg-danger"
                              : "bg-success"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="15" className="text-center">
                      No Orders Found
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

export default OrderList;