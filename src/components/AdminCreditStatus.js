import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Spinner, Toast } from "react-bootstrap";
import Sidebar from "../../src/components/Sidebar"; // Import Sidebar

import "./AdminCreditStatus.css";

const CreditDetailsTable = () => {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [approvedDays, setApprovedDays] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await axios.get(
          "https://backendcheck-hlpb.onrender.com/admin/creditfetch",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        setCredits(response.data.credits);
      } catch (error) {
        console.error("Error fetching credits:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, []);

  const handleApprove = (credit) => {
    setSelectedCredit(credit);
    setShowModal(true);
  };

  const handleReject = async (credit) => {
    try {
      const payload = { status: "rejected" };

      await axios.put(
        `https://backendcheck-hlpb.onrender.com/admin/credit/${credit._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      // Update the credits list after rejection
      const updatedCredits = await axios.get(
        "https://backendcheck-hlpb.onrender.com/admin/creditfetch",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      setCredits(updatedCredits.data.credits);
      setToastMessage("Credit rejected successfully!");
    } catch (error) {
      console.error(
        "Error rejecting credit:",
        error.response?.data || error.message
      );
      setToastMessage("Failed to reject credit. Please try again.");
    } finally {
      setShowToast(true);
    }
  };

  const handleModalSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = { status: "approved", approvedDays };

      await axios.put(
        `https://backendcheck-hlpb.onrender.com/admin/credit/${selectedCredit._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      // Refetch credits list
      const updatedCredits = await axios.get(
        "https://backendcheck-hlpb.onrender.com/admin/creditfetch",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      setCredits(updatedCredits.data.credits);
      setToastMessage("Credit approved successfully!");
      setShowModal(false);
    } catch (error) {
      console.error(
        "Error approving credit:",
        error.response?.data || error.message
      );
      setToastMessage("Failed to approve credit. Please try again.");
    } finally {
      setShowToast(true);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  // Helper function for dynamic status styles
  

  return (
    <div className="d-flex credit-dashboard-bg">
      <Sidebar />

      <div className="container mt-5">
        <h2 style={{ color: "white" }}>Pending Credit Approvals</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Status</th>
              <th>Approved Days</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {credits.length > 0 ? (
              credits.map((credit) => (
                <tr key={credit._id}>
                  <td>{credit.userId?.name || "N/A"}</td>
                  <td>{credit.userId?.email || "N/A"}</td>
                  <td>
                    <span
                      className={`badge ${
                        credit.status === "approved"
                          ? "bg-success"
                          : credit.status === "rejected"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {credit.status.charAt(0).toUpperCase() +
                        credit.status.slice(1)}
                    </span>
                  </td>

                  <td>{credit.approvedDays || "0"}</td>
                  <td>
                    <Button
                      variant="success"
                      onClick={() => handleApprove(credit)}
                      disabled={
                        credit.status === "approved" ||
                        credit.status === "rejected"
                      }
                    >
                      Approve
                    </Button>{" "}
                    <Button
                      variant="danger"
                      onClick={() => handleReject(credit)}
                      disabled={
                        credit.status === "approved" ||
                        credit.status === "rejected"
                      }
                    >
                      Reject
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No pending credit records found.</td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Modal for approving credit */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Approve Days</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Enter Approved Days</Form.Label>
              <Form.Control
                type="number"
                value={approvedDays}
                onChange={(e) => setApprovedDays(Number(e.target.value))}
                min="1"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleModalSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Approve"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Toast for feedback */}
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg={toastMessage.includes("successfully") ? "success" : "danger"}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
          }}
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </div>
    </div>
  );
};

export default CreditDetailsTable;
