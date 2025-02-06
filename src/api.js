import axios from "axios";

const API = axios.create({
  baseURL: "https://backendfinance-ofpv.onrender.com", // Replace with your backend URL
});

// Interceptor to attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("adminToken");
  console.log("adminToken:", token);
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// export const login = (data) => API.post("/admin/login", data);
export const getUsers = () => API.get("/admin/users");
export const manageUser = (data) => API.put("/admin/manageuser", data);
export const getCredits = () => API.get("/admin/credits");
export const updateCreditStatus = (userId, data) =>
  API.put(`/admin/credits/${userId}`, data);
export const getOrders = () => API.get("/admin/orders");
export const getVendors = () => API.get("/admin/vendors");
export const addVendor = (data) => API.post("/admin/vendors", data);
export const deleteVendor = (vendorId) => API.delete(`/admin/vendors/${vendorId}`);
