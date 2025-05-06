import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [classes, setClasses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
    
    if (!adminInfo) {
      navigate('/admin-login');
      return;
    }
    
    fetchData(adminInfo.token);
  }, [navigate]);

  const fetchData = async (token) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Fetch data based on active tab
      if (activeTab === 'dashboard' || activeTab === 'analytics') {
        const { data } = await axios.get('/api/admin/analytics', config);
        setAnalytics(data);
      }
      
      if (activeTab === 'users' || activeTab === 'dashboard') {
        const { data } = await axios.get('/api/admin/users', config);
        setUsers(data);
      }
      
      if (activeTab === 'trainers' || activeTab === 'dashboard') {
        const { data } = await axios.get('/api/admin/trainers', config);
        setTrainers(data);
      }
      
      if (activeTab === 'bookings' || activeTab === 'dashboard') {
        const { data } = await axios.get('/api/admin/bookings', config);
        setBookings(data);
      }
      
      if (activeTab === 'classes') {
        const { data } = await axios.get('/api/admin/classes', config);
        setClasses(data);
      }
      
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch data');
      setLoading(false);
    }
  };

  const handleApproveTrainer = async (trainerId, approved) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      
      const config = {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      };
      
      await axios.put(`/api/admin/trainers/${trainerId}/approve`, { approved }, config);
      
      // Update trainers list
      setTrainers(trainers.map(trainer => 
        trainer._id === trainerId ? { ...trainer, approved } : trainer
      ));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update trainer status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    navigate('/admin-login');
  };

  // Dashboard Overview
  const renderDashboard = () => (
    <div className="dashboard-overview">
      <h2>Dashboard Overview</h2>
      
      {analytics && (
        <div className="stats-container">
          <div className="stat-card">
            <h3>Users</h3>
            <p className="stat-number">{analytics.counts.users}</p>
          </div>
          <div className="stat-card">
            <h3>Trainers</h3>
            <p className="stat-number">{analytics.counts.trainers}</p>
            <p>Approved: {analytics.counts.approvedTrainers}</p>
            <p>Pending: {analytics.counts.pendingTrainers}</p>
          </div>
          <div className="stat-card">
            <h3>Classes</h3>
            <p className="stat-number">{analytics.counts.classes}</p>
            <p>Online: {analytics.classDistribution.online}</p>
            <p>In-Person: {analytics.classDistribution.inPerson}</p>
          </div>
          <div className="stat-card">
            <h3>Bookings</h3>
            <p className="stat-number">{analytics.counts.bookings}</p>
          </div>
          <div className="stat-card">
            <h3>Revenue</h3>
            <p className="stat-number">${analytics.revenue.total}</p>
          </div>
        </div>
      )}
      
      <div className="recent-activity">
        <div className="recent-section">
          <h3>Recent Users</h3>
          <ul className="recent-list">
            {analytics && analytics.recent.users.map(user => (
              <li key={user._id}>
                <strong>{user.name}</strong> - {user.email}
                <span className="recent-date">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="recent-section">
          <h3>Recent Bookings</h3>
          <ul className="recent-list">
            {analytics && analytics.recent.bookings.map(booking => (
              <li key={booking._id}>
                <strong>{booking.user?.name}</strong> booked {booking.class?.title} with {booking.trainer?.name}
                <span className="recent-date">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  // Users Management
  const renderUsers = () => (
    <div className="users-management">
      <h2>Users Management</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Experience</th>
              <th>Joined On</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.age}</td>
                <td>{user.gender}</td>
                <td>{user.experience}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Trainers Management
  const renderTrainers = () => (
    <div className="trainers-management">
      <h2>Trainers Management</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Specialization</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map(trainer => (
              <tr key={trainer._id}>
                <td>{trainer.name}</td>
                <td>{trainer.email}</td>
                <td>{trainer.specialization}</td>
                <td>{trainer.experience} years</td>
                <td>
                  <span className={`status-badge ${trainer.approved ? 'approved' : 'pending'}`}>
                    {trainer.approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td>
                  {!trainer.approved ? (
                    <button 
                      className="action-btn approve-btn"
                      onClick={() => handleApproveTrainer(trainer._id, true)}
                    >
                      Approve
                    </button>
                  ) : (
                    <button 
                      className="action-btn reject-btn"
                      onClick={() => handleApproveTrainer(trainer._id, false)}
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Bookings Management
  const renderBookings = () => (
    <div className="bookings-management">
      <h2>Bookings Management</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Class</th>
              <th>Trainer</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Booked On</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td>{booking.user?.name}</td>
                <td>{booking.class?.title}</td>
                <td>{booking.trainer?.name}</td>
                <td>
                  {booking.class?.date && new Date(booking.class.date).toLocaleDateString()} at {booking.class?.time}
                </td>
                <td>
                  <span className={`status-badge ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </td>
                <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Classes Management
  const renderClasses = () => (
    <div className="classes-management">
      <h2>Classes Management</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Trainer</th>
              <th>Date & Time</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {classes.map(cls => (
              <tr key={cls._id}>
                <td>{cls.title}</td>
                <td>{cls.trainer?.name}</td>
                <td>{new Date(cls.date).toLocaleDateString()} at {cls.time}</td>
                <td>{cls.sessionType}</td>
                <td>{cls.capacity}</td>
                <td>{cls.availability}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Analytics
  const renderAnalytics = () => (
    <div className="analytics">
      <h2>Analytics & Reports</h2>
      
      {analytics && (
        <>
          <div className="analytics-section">
            <h3>Monthly Revenue</h3>
            <div className="chart-container">
              <div className="bar-chart">
                {analytics.revenue.monthly.map((month, index) => (
                  <div className="bar-container" key={index}>
                    <div 
                      className="bar" 
                      style={{ 
                        height: `${Math.max(5, (month.bookings / Math.max(...analytics.revenue.monthly.map(m => m.bookings)) * 100))}%` 
                      }}
                    >
                      <span className="bar-value">${month.revenue}</span>
                    </div>
                </div>
               ))}
             </div>
           </div>
        </div>
        </>
      )}
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="dashboard-content">
        <div className="sidebar">
          <button onClick={() => setActiveTab('users')}>Users</button>
          <button onClick={() => setActiveTab('trainers')}>Trainers</button>
          <button onClick={() => setActiveTab('bookings')}>Bookings</button>
          <button onClick={() => setActiveTab('classes')}>Classes</button>
          <button onClick={() => setActiveTab('analytics')}>Analytics</button>
        </div>
        <div className="main-content">
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'trainers' && renderTrainers()}
          {activeTab === 'bookings' && renderBookings()}
          {activeTab === 'classes' && renderClasses()}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>
      </div>
    </div>
  );
}