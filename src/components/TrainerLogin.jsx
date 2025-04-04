import { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TrainerLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    experience: '',
    certifications: '',
    bio: ''
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
        const { data } = await axios.post('http://localhost:5000/api/trainers/login', {
          email: formData.email,
          password: formData.password
        });
        
        // Save trainer info and token to localStorage
        localStorage.setItem('trainerInfo', JSON.stringify(data));
        localStorage.setItem('token', data.token);
        
        // Redirect to trainer dashboard or home page
        navigate('/trainer-dashboard');
      } else {
        // Signup
        const { data } = await axios.post('http://localhost:5000/api/trainers', formData);
        
        // Save trainer info and token to localStorage
        localStorage.setItem('trainerInfo', JSON.stringify(data));
        localStorage.setItem('token', data.token);
        
        // Redirect to trainer dashboard or home page
        navigate('/trainer-dashboard');
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
        <h1>{isLogin ? 'Trainer Login' : 'Trainer Signup'}</h1>
        
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
                <label htmlFor="specialization">Specialization</label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="experience">Years of Experience</label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required={!isLogin}
                  min="1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="certifications">Certifications</label>
                <textarea
                  id="certifications"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  rows="2"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Tell us about yourself and your teaching style"
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

export default TrainerLogin;