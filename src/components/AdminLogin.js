import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if admin is already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin'); // Redirect to dashboard if already logged in
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/admin/login', { email, password });
      localStorage.setItem('adminToken', response.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="container mt-2">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="shadow-lg p-4 register-card animate__animated animate__fadeInLeft">
              <h2 className="text-center mb-4 admin-text">ADMIN LOGIN</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="admin-text">
                    Email <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{color:"white"}}

                    required
                  />
                </div>
                <div className="mb-3 password-field">
                  <label className="admin-text">
                    Password <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{color:"white"}}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary toggle-password-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100 admin-text" disabled={loading}>
                  {loading ? 'Logging in...' : 'LOGIN'}
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-6 d-none d-md-block">
            <div className="animate__animated animate__fadeInRight animationimage">
              <img
                style={{ height: '300px' }}
                src="./images/adminanimation.gif"
                alt="Login Illustration"
                className=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
