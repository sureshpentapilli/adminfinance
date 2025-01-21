import React, { useEffect, useState } from "react";
import { getVendors, addVendor, deleteVendor } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../src/components/Sidebar"; // Import Sidebar


import "./Vendor.css"

const Vendors = () => {
  const [vendors, setVendors] = useState([]); // Vendors state
  const [products, setProducts] = useState([]); // Products state
  const [product, setProduct] = useState(""); // Individual product state
  const [name, setName] = useState(""); // Vendor name
  const [details, setDetails] = useState(""); // Vendor details
  const [error, setError] = useState(""); // Error state

  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchVendors = async () => {
    try {
      const { data } = await getVendors();
      setVendors(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch vendors");
      console.error("Error fetching vendors:", err.response || err.message);
    }
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      const vendorData = {
        name,
        details,
        products,
      };

      await addVendor(vendorData);
      setName("");
      setDetails("");
      setProducts([]);
      setProduct("");
      setIsModalOpen(false); // Close modal after submission
      fetchVendors();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add vendor");
      console.error("Error adding vendor:", err.response || err.message);
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this vendor?"
    );
    if (!isConfirmed) return;

    try {
      await deleteVendor(vendorId);
      fetchVendors();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete vendor");
      console.error("Error deleting vendor:", err.response || err.message);
    }
  };

  const handleAddProduct = () => {
    if (product && !products.includes(product)) {
      setProducts([...products, product]);
      setProduct("");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="d-flex vendor-dashboard-bg">
 <Sidebar />

   
    <div className="container p-5">
      <h2 style={{color:"white"}}>VENDORS</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Button to open modal */}
      <button
        className="btn btn-primary mb-4" style={{color:"white"}}
        onClick={() => setIsModalOpen(true)}
      >
        Add Vendor
      </button>

      {/* Vendor List Table */}
      <h4 className="mt-5" style={{color:"white"}}>Vendor List</h4>
      <table className="table table-bordered table-striped mt-3">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Vendor Name</th>
            <th>Vendor Details</th>
            {/* <th>Products</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.length > 0 ? (
            vendors.map((vendor, index) => (
              <tr key={vendor._id}>
                <td>{index + 1}</td>
                <td>{vendor.name}</td>
                <td>{vendor.details}</td>
                {/* <td>
                  <ul className="mb-0">
                    {vendor.products?.map((prod, idx) => (
                      <li key={idx}>{prod}</li>
                    ))}
                  </ul>
                </td> */}
                <td>
                  <button
                    onClick={() => handleDeleteVendor(vendor._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No vendors found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Vendor</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddVendor}>
                  <div className="form-group">
                    <label htmlFor="vendorName">Vendor Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="vendorName"
                      placeholder="Enter vendor name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="vendorDetails">Vendor Details</label>
                    <input
                      type="text"
                      className="form-control"
                      id="vendorDetails"
                      placeholder="Enter vendor details"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      required
                    />
                  </div>
                  {/* <div className="form-group mt-3">
                    <label htmlFor="product">Product</label>
                    <input
                      type="text"
                      className="form-control"
                      id="product"
                      placeholder="Enter product name"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary mt-2"
                      onClick={handleAddProduct}
                    >
                      Add Product
                    </button>
                  </div>
                  {products.length > 0 && (
                    <div className="mt-3">
                      <h5>Selected Products:</h5>
                      <ul>
                        {products.map((prod, index) => (
                          <li key={index}>{prod}</li>
                        ))}
                      </ul>
                    </div>
                  )} */}
                  <button type="submit" className="btn btn-primary mt-3">
                    Add Vendor
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Vendors;
