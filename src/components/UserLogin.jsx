import { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'male',
    experience: 'beginner',
    healthConditions: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login
        const { data } = await axios.post('http://localhost:5000/api/users/login', {
          email: formData.email,
          password: formData.password
        });
        
        // Save user info and token to localStorage
        localStorage.setItem('userInfo', JSON.stringify(data));
        localStorage.setItem('token', data.token);
        
        // Redirect to user dashboard after login
        navigate('/user-dashboard');
      } else {
        // Signup
        const { data } = await axios.post('http://localhost:5000/api/users', formData);
        
        // Save user info and token to localStorage
        localStorage.setItem('userInfo', JSON.stringify(data));
        localStorage.setItem('token', data.token);
        
        // Redirect to user dashboard after signup
        navigate('/user-dashboard');
      }
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h1>{isLogin ? 'User Login' : 'User Signup'}</h1>
        
        <div className="toggle-container">
          <button 
            className={isLogin ? 'toggle-btn active' : 'toggle-btn'} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={!isLogin ? 'toggle-btn active' : 'toggle-btn'} 
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}
          
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
          
          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required={!isLogin}
                  min="1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required={!isLogin}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="experience">Yoga Experience</label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required={!isLogin}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="healthConditions">Health Conditions (if any)</label>
                <textarea
                  id="healthConditions"
                  name="healthConditions"
                  value={formData.healthConditions}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </>
          )}
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {isLogin ? (loading ? 'Logging in...' : 'Login') : (loading ? 'Signing Up...' : 'Sign Up')}
          </button>
        </form>
        
        <p className="form-toggle-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={toggleForm} className="form-toggle-link">
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default UserLogin;