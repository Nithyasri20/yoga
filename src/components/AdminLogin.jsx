import { useState } from 'react';
import './Login.css';

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Admin Login submitted:', formData);
    // Add login logic here
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h1>Admin Login</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>
        
        <p className="form-note">
          * For admin access only. Contact system administrator if you need access.
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;