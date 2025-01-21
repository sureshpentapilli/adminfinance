import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../src/components/Sidebar"; // Import Sidebar

import "./Orders.css"


const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // Add admin token
          },
        });
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="d-flex order-dashboard-bg">
 <Sidebar />
    
    <div className="container mt-4">
      <h2 className="mb-4" style={{color:"white"}}>ORDERS</h2>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th scope="col">Order ID</th>
                <th scope="col">User Name</th>
                <th scope="col">User Email</th>
                <th scope="col">Vendor Details</th>
                <th scope="col">Users</th>
                <th scope="col">Years of Support</th>
                <th scope="col">existingVendor</th>

                <th scope="col">Buying Period</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.userId?.name || "N/A"}</td>
                    <td>{order.userId?.email || "N/A"}</td>
                    <td>{order.vendorId?.details || "N/A"}</td>
                    <td>{order.numberOfUsers}</td>
                    <td>{order.yearsOfSupport}</td>
                    <td>{order.existingVendor}</td>


                    <td>{order.buyingPeriod}</td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  );
};

export default OrdersTable;
