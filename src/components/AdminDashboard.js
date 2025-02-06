import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Spinner } from "react-bootstrap"; // Using Bootstrap components for enhanced UI
import { FaCheck, FaTimes, FaEye, FaSignOutAlt } from "react-icons/fa"; // Icons for actions
import Sidebar from "../../src/components/Sidebar"; // Import Sidebar
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]); // State for all users
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // State for alert message
  const [modalImage, setModalImage] = useState(null); // State to manage modal image
  const navigate = useNavigate(); // Using navigate for redirection

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      console.log(response.data,"register")
      setUsers(response.data); // Update users state
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/adminlogin"); // Redirect to login if no token found
    } else {
      fetchUsers();
    }
  }, [navigate]);

  // Handle status update
  const handleStatusUpdate = async (userId, status) => {
    const confirmMessage =
      status === "approved"
        ? "Are you sure you want to approve this user?"
        : "Are you sure you want to reject this user?";
    if (window.confirm(confirmMessage)) {
      try {
        setLoading(true);

        // Update the user status and fetch the updated list in response
        const response = await axios.put(
          "http://localhost:5000/admin/manageuser",
          { userId, status },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );

        // Update the users state with the full updated user list
        setUsers(response.data);
       

        // Set alert message based on status
        const message =
          status === "approved"
            ? "User approved successfully!"
            : "User rejected successfully!";
        setAlertMessage(message);

        // Clear the alert message after 3 seconds
        setTimeout(() => setAlertMessage(""), 3000);
      } catch (error) {
        console.error("Error updating status:", error);
        setError("Failed to update user status.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Open the modal with the clicked image
  const handleImageClick = (imageUrl) => {
    setModalImage(imageUrl);
  };

  // Close the modal
  const closeModal = () => {
    setModalImage(null);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Remove the token from localStorage
    navigate("/adminlogin"); // Redirect to login page after logout
  };

  return (
    <div className="d-flex admin-dashboard-bg">
      <Sidebar /> {/* Adding Sidebar */}
      {/* Main content area */}
      <div className="container mt-5 flex-grow-1">
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-danger" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
        <h2 className="text-center mb-4" style={{ color: "white" }}>
          Admin Dashboard
        </h2>
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Display alert message */}
        {alertMessage && <div className="alert alert-info">{alertMessage}</div>}

        <h3 style={{ color: "white" }}>All Users</h3>
        {loading && (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" variant="primary" />
          </div>
        )}

        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Organization</th>
              <th>Status</th>
              <th>Trade License</th>
              <th>Audited Financials</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.organizationName}</td>
                <td>
                  <span
                    className={`badge ${
                      user.registrationStatus === "approved"
                        ? "bg-success"
                        : user.registrationStatus === "rejected"
                        ? "bg-danger"
                        : "bg-secondary"
                    }`}
                  >
                    {user.registrationStatus}
                  </span>
                </td>
                <td>
                  <img
                    src={`http://localhost:5000${
                      user.tradeLicense
                    }?t=${new Date().getTime()}`}
                    alt="Trade License"
                    className="img-thumbnail"
                    style={{
                      cursor: "pointer",
                      maxWidth: "100px",
                      maxHeight: "100px",
                    }}
                    onClick={() =>
                      handleImageClick(
                        `http://localhost:5000${
                          user.tradeLicense
                        }?t=${new Date().getTime()}`
                      )
                    }
                  />
                </td>
                <td>
                  {user.auditedFinancials ? (
                    <img
                      src={`http://localhost:5000${user.auditedFinancials}`}
                      alt="Audited Financials"
                      className="img-thumbnail"
                      style={{
                        cursor: "pointer",
                        maxWidth: "100px",
                        maxHeight: "100px",
                      }}
                      onClick={() =>
                        handleImageClick(
                          `http://localhost:5000${user.auditedFinancials}`
                        )
                      } // Open the modal with the image
                    />
                  ) : (
                    <span>No audited financials image available</span> // Display text if no image is available
                  )}
                </td>

                <td>
                  {user.registrationStatus !== "approved" && (
                    <button
                      onClick={() => handleStatusUpdate(user._id, "approved")}
                      className="btn btn-success me-2"
                      disabled={loading}
                      title="Approve User"
                    >
                      <FaCheck />
                    </button>
                  )}
                  {user.registrationStatus !== "rejected" && (
                    <button
                      onClick={() => handleStatusUpdate(user._id, "rejected")}
                      className="btn btn-danger mr-2"
                      disabled={loading}
                      title="Reject User"
                    >
                      <FaTimes />
                    </button>
                  )}
                  {/* <button
                    onClick={() => handleImageClick(user.tradeLicense)}
                    className="btn btn-info mr-2"
                    title="View Trade License"
                  >
                    <FaEye />
                  </button> */}
                  {/* <button
                    onClick={() => handleImageClick(user.auditedFinancials)}
                    className="btn btn-info"
                    title="View Audited Financials"
                  >
                    <FaEye />
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal to display the large image */}
        <Modal
          show={modalImage !== null}
          onHide={closeModal}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Image Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={modalImage}
              alt="Large Preview"
              style={{
                width: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;
