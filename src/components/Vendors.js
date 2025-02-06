import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../src/components/Sidebar"; // Import Sidebar
import "./Vendor.css"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [website, setWebsite] = useState("");
  const [questions, setQuestions] = useState([""]); // Store only questions
  const [vendorlogo, setVendorlogo] = useState(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchVendors = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/vendors");
      setVendors(data);
    } catch (err) {
      setError("Failed to fetch vendors");
      console.error(err);
    }
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("details", details);
      formData.append("website", website);
      formData.append("vendorlogo", vendorlogo);
      formData.append("questions", JSON.stringify(questions.map((q) => ({ question: q }))));
  
      const token = localStorage.getItem("adminToken");
  
      await axios.post("http://localhost:5000/admin/vendors", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      fetchVendors();
      toast.success("Vendor added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to add vendor!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      console.error(err);
    }
  };
  

  const handleDeleteVendor = async (vendorId) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await axios.delete(`http://localhost:5000/vendors/${vendorId}`);
      fetchVendors();
    } catch (err) {
      setError("Failed to delete vendor");
      console.error(err);
    }
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (

    <div className="d-flex credit-dashboard-bg">
        <Sidebar />
    <div className="container py-5">
      <h2 className="mb-4 vendor">Admin Vendor Dashboard</h2>
      {error && <p className="alert alert-danger">{error}</p>}

      <button
        className="btn btn-primary mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Add Vendor
      </button>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>vendorlogo</th>
            <th>Name</th>
            <th>Details</th>
            <th>Website</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor, index) => (
            <tr key={vendor._id}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={vendor.vendorlogo}
                  alt="Vendor"
                  width="50px"
                  className="rounded"
                />
              </td>
              <td>{vendor.name}</td>
              <td>{vendor.details}</td>
              <td>
                <a
                  href={vendor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {vendor.website}
                </a>
              </td>
              <td>
                <button
                  onClick={() => handleDeleteVendor(vendor._id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Vendor</h5>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="btn-close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddVendor}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Details</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => setDetails(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Website</label>
                    <input
                      type="url"
                      className="form-control"
                      onChange={(e) => setWebsite(e.target.value)}
                      required
                    />
                  </div>

                  <h6>Questions</h6>
                  {questions.map((q, index) => (
                    <div key={index} className="mb-2 d-flex align-items-center">
                      <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Question"
                        value={q}
                        onChange={(e) =>
                          handleQuestionChange(index, e.target.value)
                        }
                        required
                      />
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          className="btn btn-danger btn-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="btn btn-secondary btn-sm mb-3"
                  >
                    Add Question
                  </button>

                
                  <div className="mb-3">
                    <label className="form-label">vendorlogo</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setVendorlogo(e.target.files[0])}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Add Vendor
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    <ToastContainer />

    </div>
  );
};

export default Vendors;
