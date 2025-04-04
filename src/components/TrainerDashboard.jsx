import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function TrainerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [classes, setClasses] = useState([]);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    specialization: '',
    experience: '',
    certifications: '',
    bio: ''
  });
  
  // Class creation state
  const [classData, setClassData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    sessionType: 'online',
    capacity: 10,
    zoomLink: ''
  });
  
  // Status update state
  const [zoomLink, setZoomLink] = useState('');
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState('');
  const [statusUpdateError, setStatusUpdateError] = useState('');
  
  // Class creation state
  const [classSuccess, setClassSuccess] = useState('');
  const [classError, setClassError] = useState('');
  
  useEffect(() => {
    // Check if trainer is logged in
    const trainerInfo = JSON.parse(localStorage.getItem('trainerInfo'));
    
    if (!trainerInfo) {
      navigate('/trainer-login');
      return;
    }
    
    setTrainer(trainerInfo);
    
    // Fetch trainer profile
    const fetchTrainerProfile = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${trainerInfo.token}`
          }
        };
        
        const { data } = await axios.get('http://localhost:5000/api/trainers/profile', config);
        
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          specialization: data.specialization || '',
          experience: data.experience || '',
          certifications: data.certifications || '',
          bio: data.bio || ''
        });
      } catch (error) {
        console.error('Error fetching trainer profile:', error);
      }
    };
    
    // Fetch trainer's bookings
    const fetchBookings = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${trainerInfo.token}`
          }
        };
        
        const { data } = await axios.get('http://localhost:5000/api/bookings/trainer', config);
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    
    // Fetch trainer's classes
    const fetchClasses = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${trainerInfo.token}`
          }
        };
        
        const { data } = await axios.get('http://localhost:5000/api/classes/trainer', config);
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrainerProfile();
    fetchBookings();
    fetchClasses();
  }, [navigate]);
  
  // Handle class form change
  const handleClassChange = (e) => {
    const { name, value } = e.target;
    setClassData({
      ...classData,
      [name]: value
    });
  };
  
  // Handle class creation
  const handleCreateClass = async (e) => {
    e.preventDefault();
    setClassSuccess('');
    setClassError('');
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${trainer.token}`
        }
      };
      
      const { data } = await axios.post(
        'http://localhost:5000/api/classes',
        classData,
        config
      );
      
      setClasses([...classes, data]);
      setClassSuccess('Class created successfully!');
      
      // Reset form
      setClassData({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        sessionType: 'online',
        capacity: 10,
        zoomLink: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setClassSuccess('');
      }, 3000);
    } catch (error) {
      setClassError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to create class'
      );
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setClassError('');
      }, 3000);
    }
  };
  
  // Handle booking status update
  const handleUpdateStatus = async (bookingId, status) => {
    setStatusUpdateSuccess('');
    setStatusUpdateError('');
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${trainer.token}`
        }
      };
      
      const requestBody = {
        status
      };
      
      // Add Zoom link if confirming an online class
      const booking = bookings.find(b => b._id === bookingId);
      if (status === 'Confirmed' && booking.classType === 'online') {
        if (!zoomLink) {
          setStatusUpdateError('Please provide a Zoom link for online classes');
          return;
        }
        requestBody.zoomLink = zoomLink;
      }
      
      const { data } = await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        requestBody,
        config
      );
      
      // Update bookings list
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? data : booking
      ));
      
      setStatusUpdateSuccess(`Booking ${status.toLowerCase()} successfully`);
      setZoomLink('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatusUpdateSuccess('');
      }, 3000);
    } catch (error) {
      setStatusUpdateError(
        error.response && error.response.data.message
          ? error.response.data.message
          : `Failed to ${status.toLowerCase()} booking`
      );
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setStatusUpdateError('');
      }, 3000);
    }
  };
  
  // Handle class deletion
  const handleDeleteClass = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${trainer.token}`
          }
        };
        
        await axios.delete(
          `http://localhost:5000/api/classes/${classId}`,
          config
        );
        
        // Update classes list
        setClasses(classes.filter(c => c._id !== classId));
        setClassSuccess('Class deleted successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setClassSuccess('');
        }, 3000);
      } catch (error) {
        setClassError(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Failed to delete class'
        );
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          setClassError('');
        }, 3000);
      }
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('trainerInfo');
    localStorage.removeItem('token');
    navigate('/trainer-login');
  };
  
  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }
  
  return (
    <div className="dashboard-container">
      <h1>Trainer Dashboard</h1>
      
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'profile' ? 'tab-btn active' : 'tab-btn'} 
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={activeTab === 'classes' ? 'tab-btn active' : 'tab-btn'} 
          onClick={() => setActiveTab('classes')}
        >
          Manage Classes
        </button>
        <button 
          className={activeTab === 'bookings' ? 'tab-btn active' : 'tab-btn'} 
          onClick={() => setActiveTab('bookings')}
        >
          Manage Bookings
        </button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Trainer Profile</h2>
            
            <div className="profile-details">
              <div className="profile-detail-item">
                <h4>Personal Information</h4>
                <p><strong>Name:</strong> {profileData.name}</p>
                <p><strong>Email:</strong> {profileData.email}</p>
              </div>
              
              <div className="profile-detail-item">
                <h4>Professional Details</h4>
                <p><strong>Specialization:</strong> {profileData.specialization}</p>
                <p><strong>Experience:</strong> {profileData.experience} years</p>
                <p><strong>Certifications:</strong> {profileData.certifications || 'None specified'}</p>
              </div>
              
              <div className="profile-detail-item">
                <h4>Bio</h4>
                <p>{profileData.bio || 'No bio provided'}</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'classes' && (
          <div className="classes-section">
            <h2>Manage Your Classes</h2>
            
            {classSuccess && (
              <div className="success-message">{classSuccess}</div>
            )}
            
            {classError && (
              <div className="error-message">{classError}</div>
            )}
            
            <div className="create-class-form">
              <h3>Create New Class</h3>
              <form onSubmit={handleCreateClass}>
                <div className="form-group">
                  <label htmlFor="title">Class Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={classData.title}
                    onChange={handleClassChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={classData.description}
                    onChange={handleClassChange}
                    rows="3"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={classData.date}
                    onChange={handleClassChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startTime">Start Time</label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={classData.startTime}
                      onChange={handleClassChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="endTime">End Time</label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={classData.endTime}
                      onChange={handleClassChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Session Type</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="sessionType"
                        value="online"
                        checked={classData.sessionType === 'online'}
                        onChange={handleClassChange}
                      />
                      Online (via Zoom)
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="sessionType"
                        value="in-person"
                        checked={classData.sessionType === 'in-person'}
                        onChange={handleClassChange}
                      />
                      In-Person
                    </label>
                  </div>
                </div>
                
                {classData.sessionType === 'online' && (
                  <div className="form-group">
                    <label htmlFor="zoomLink">Zoom Link</label>
                    <input
                      type="url"
                      id="zoomLink"
                      name="zoomLink"
                      value={classData.zoomLink}
                      onChange={handleClassChange}
                      placeholder="https://zoom.us/j/example"
                    />
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="capacity">Capacity</label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={classData.capacity}
                    onChange={handleClassChange}
                    min="1"
                    max="50"
                  />
                </div>
                
                <button type="submit" className="submit-btn">Create Class</button>
              </form>
            </div>
            
            <div className="classes-list">
              <h3>Your Classes</h3>
              
              {classes.length === 0 ? (
                <p>You haven't created any classes yet.</p>
              ) : (
                <div className="classes-grid">
                  {classes.map(classItem => (
                    <div key={classItem._id} className="class-card">
                      <div className="class-header">
                        <h4>{classItem.title}</h4>
                        <span className={`class-type ${classItem.sessionType}`}>
                          {classItem.sessionType === 'online' ? 'Online' : 'In-Person'}
                        </span>
                      </div>
                      
                      <div className="class-details">
                        <p><strong>Date:</strong> {new Date(classItem.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {classItem.startTime} - {classItem.endTime}</p>
                        <p><strong>Capacity:</strong> {classItem.capacity} students</p>
                        {classItem.description && (
                          <p><strong>Description:</strong> {classItem.description}</p>
                        )}
                        {classItem.sessionType === 'online' && classItem.zoomLink && (
                          <p><strong>Zoom:</strong> <a href={classItem.zoomLink} target="_blank" rel="noopener noreferrer">{classItem.zoomLink}</a></p>
                        )}
                      </div>
                      
                      <div className="class-actions">
                        <button 
                          className="delete-btn" 
                          onClick={() => handleDeleteClass(classItem._id)}
                        >
                          Delete Class
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <h2>Manage Bookings</h2>
            
            {statusUpdateSuccess && (
              <div className="success-message">{statusUpdateSuccess}</div>
            )}
            
            {statusUpdateError && (
              <div className="error-message">{statusUpdateError}</div>
            )}
            
            {bookings.length === 0 ? (
              <p>You don't have any bookings yet.</p>
            ) : (
              <div className="bookings-list">
                {bookings.map(booking => (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-header">
                      <h3>Booking from {booking.user.name}</h3>
                      <span className={`booking-status ${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="booking-details">
                      <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {booking.time}</p>
                      <p><strong>Type:</strong> {booking.classType === 'online' ? 'Online (Zoom)' : 'In-Person'}</p>
                      <p><strong>User Email:</strong> {booking.user.email}</p>
                      {booking.classType === 'online' && booking.status === 'Confirmed' && booking.zoomLink && (
                        <p><strong>Zoom Link:</strong> <a href={booking.zoomLink} target="_blank" rel="noopener noreferrer">{booking.zoomLink}</a></p>
                      )}
                    </div>
                    
                    {booking.status === 'Pending' && (
                      <div className="booking-actions">
                        {booking.classType === 'online' && (
                          <div className="form-group">
                            <label htmlFor={`zoomLink-${booking._id}`}>Zoom Link</label>
                            <input
                              type="url"
                              id={`zoomLink-${booking._id}`}
                              value={zoomLink}
                              onChange={(e) => setZoomLink(e.target.value)}
                              placeholder="https://zoom.us/j/example"
                              required
                            />
                          </div>
                        )}
                        
                        <div className="action-buttons">
                          <button 
                            className="confirm-btn" 
                            onClick={() => handleUpdateStatus(booking._id, 'Confirmed')}
                          >
                            Confirm
                          </button>
                          <button 
                            className="reject-btn" 
                            onClick={() => handleUpdateStatus(booking._id, 'Rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrainerDashboard;