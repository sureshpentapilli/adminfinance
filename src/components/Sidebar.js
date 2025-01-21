import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUser, FaClipboardList, FaStore } from "react-icons/fa"; // Importing icons
import { Collapse } from "react-bootstrap"; // For the toggle effect

const Sidebar = () => {
  const [open, setOpen] = useState(false); // State to toggle the sidebar
  const [bgColor, setBgColor] = useState("bg-dark"); // Default background color
  
  // Toggle sidebar open/close and change background color
  const handleSidebarToggle = () => {
    setOpen(!open);
    setBgColor(open ? "bg-dark" : "bg-primary"); // Change background color on toggle
  };

  return (
    <div className={`sidebar ${bgColor}`} style={{ width: "250px",  paddingTop: "20px" }}>
      <div className="sidebar-header text-white text-center">
        <h4>Admin Panel</h4>
        <button
          className="btn btn-light mt-2"
          onClick={handleSidebarToggle}
          aria-controls="sidebar-links"
          aria-expanded={open}
        >
          {open ? "Close Sidebar" : "Open Sidebar"}
        </button>
      </div>
      <Collapse in={open}>
        <ul className="sidebar-links list-unstyled mt-4">
          <li>
            <Link to="/admin/orders" className="text-white d-block py-2 px-3">
              <FaShoppingCart /> Orders
            </Link>
          </li>
          <li>
            <Link to="/admin/vendors" className="text-white d-block py-2 px-3">
              <FaStore /> Vendors
            </Link>
          </li>
          <li>
            <Link to="/admin" className="text-white d-block py-2 px-3">
              <FaUser /> Users
            </Link>
          </li>
          <li>
            <Link to="/admin/status" className="text-white d-block py-2 px-3">
              <FaClipboardList /> credit Status
            </Link>
          </li>
        </ul>
      </Collapse>
    </div>
  );
};

export default Sidebar;
