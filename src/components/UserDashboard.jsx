import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    experience: '',
    healthConditions: '',
    goal: '',
    preferences: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [profileMode, setProfileMode] = useState('view'); // 'view' or 'edit'
  const [profileImageUrl, setProfileImageUrl] = useState('');
  
  // Booking state
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [classType, setClassType] = useState('online');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [userBookings, setUserBookings] = useState([]);
  const [cancelSuccess, setCancelSuccess] = useState('');
  const [cancelError, setCancelError] = useState('');
  
  // Available classes state
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classBookingSuccess, setClassBookingSuccess] = useState(false);
  const [classBookingError, setClassBookingError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    if (!userInfo) {
      navigate('/user-login');
      return;
    }
    
    setUser(userInfo);
    
    // Fetch user profile
    const fetchUserProfile = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        };
        
        const { data } = await axios.get('http://localhost:5000/api/users/profile', config);
        
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          age: data.age || '',
          gender: data.gender || '',
          experience: data.experience || '',
          healthConditions: data.healthConditions || '',
          goal: data.goal || '',
          preferences: data.preferences || ''
        });
        
        // Set profile image if available
        if (data.profilePicture) {
          setProfileImageUrl(`http://localhost:5000/${data.profilePicture}`);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setLoading(false);
      }
    };
    
    // Fetch trainers for booking
    const fetchTrainers = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/trainers');
        setTrainers(data);
      } catch (error) {
        console.error('Error fetching trainers:', error);
      }
    };
    
    // Fetch user's bookings
    const fetchUserBookings = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        };
        
        const { data } = await axios.get('http://localhost:5000/api/bookings/user', config);
        setUserBookings(data);
      } catch (error) {
        console.error('Error fetching user bookings:', error);
      }
    };
    
    // Fetch available classes
    const fetchAvailableClasses = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/classes/available');
        setAvailableClasses(data);
      } catch (error) {
        console.error('Error fetching available classes:', error);
      }
    };

    fetchUserProfile();
    fetchTrainers();
    fetchUserBookings();
    fetchAvailableClasses();
  }, [navigate]);
  
  // Handle profile picture change
  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  // Handle profile form change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);
    setUpdateError('');
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const { data } = await axios.put(
        'http://localhost:5000/api/users/profile',
        profileData,
        config
      );
      
      // If profile picture was updated
      if (profilePicture) {
        const formData = new FormData();
        formData.append('profilePicture', profilePicture);
        
        await axios.post(
          'http://localhost:5000/api/users/profile/picture',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${user.token}`
            }
          }
        );
      }
      
      // Update local storage with new user data
      localStorage.setItem('userInfo', JSON.stringify({
        ...user,
        name: data.name
      }));
      
      setUpdateSuccess(true);
    } catch (error) {
      setUpdateError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Update failed'
      );
    }
  };
  
  // Handle trainer selection
  const handleTrainerChange = async (e) => {
    const trainerId = e.target.value;
    setSelectedTrainer(trainerId);
    
    console.log('Selected trainer:', trainerId);
    
    if (trainerId && selectedDate) {
      try {
        console.log('Fetching available slots for trainer:', trainerId, 'and date:', selectedDate);
        const { data } = await axios.get(
          `http://localhost:5000/api/bookings/available?trainer=${trainerId}&date=${selectedDate}`
        );
        console.log('Available slots:', data);
        setAvailableSlots(data);
      } catch (error) {
        console.error('Error fetching available slots:', error);
      }
    }
  };
  
  // Handle date selection
  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    
    console.log('Selected date:', date);
    
    if (selectedTrainer && date) {
      try {
        console.log('Fetching available slots for trainer:', selectedTrainer, 'and date:', date);
        const { data } = await axios.get(
          `http://localhost:5000/api/bookings/available?trainer=${selectedTrainer}&date=${date}`
        );
        console.log('Available slots:', data);
        setAvailableSlots(data);
      } catch (error) {
        console.error('Error fetching available slots:', error);
      }
    }
  };
  
  // Handle booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingSuccess(false);
    setBookingError('');
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      
      await axios.post(
        'http://localhost:5000/api/bookings',
        {
          trainer: selectedTrainer,
          date: selectedDate,
          time: selectedTime,
          classType
        },
        config
      );
      
      setBookingSuccess(true);
      
      // Refresh user bookings
      const { data } = await axios.get('http://localhost:5000/api/bookings/user', config);
      setUserBookings(data);
      
      // Reset form
      setSelectedTrainer('');
      setSelectedDate('');
      setSelectedTime('');
      setClassType('online');
    } catch (error) {
      setBookingError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Booking failed'
      );
    }
  };
  
  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    setCancelSuccess('');
    setCancelError('');
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      await axios.delete(
        `http://localhost:5000/api/bookings/${bookingId}`,
        config
      );
      
      // Update bookings list by removing the cancelled booking
      setUserBookings(userBookings.filter(booking => booking._id !== bookingId));
      setCancelSuccess('Booking cancelled successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setCancelSuccess('');
      }, 3000);
    } catch (error) {
      setCancelError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to cancel booking'
      );
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setCancelError('');
      }, 3000);
    }
  };
  
  // Handle booking a class directly
  const handleBookClass = async (classId) => {
    setClassBookingSuccess(false);
    setClassBookingError('');
    
    try {
      const selectedClass = availableClasses.find(c => c._id === classId);
      
      if (!selectedClass) {
        setClassBookingError('Class not found');
        return;
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      
      await axios.post(
        'http://localhost:5000/api/bookings',
        {
          trainer: selectedClass.trainer._id,
          date: selectedClass.date.split('T')[0],
          time: selectedClass.startTime,
          classType: selectedClass.sessionType
        },
        config
      );
      
      setClassBookingSuccess(true);
      
      // Refresh user bookings
      const { data } = await axios.get('http://localhost:5000/api/bookings/user', config);
      setUserBookings(data);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setClassBookingSuccess(false);
      }, 3000);
    } catch (error) {
      setClassBookingError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Booking failed'
      );
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setClassBookingError('');
      }, 3000);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    navigate('/user-login');
  };
  
  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }
  
  return (
    <div className="dashboard-container">
      <h1>User Dashboard</h1>
      
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'profile' ? 'tab-btn active' : 'tab-btn'} 
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={activeTab === 'booking' ? 'tab-btn active' : 'tab-btn'} 
          onClick={() => setActiveTab('booking')}
        >
          Book a Class
        </button>
        <button 
          className={activeTab === 'classes' ? 'tab-btn active' : 'tab-btn'} 
          onClick={() => setActiveTab('classes')}
        >
          Available Classes
        </button>
        <button 
          className={activeTab === 'my-bookings' ? 'tab-btn active' : 'tab-btn'} 
          onClick={() => setActiveTab('my-bookings')}
        >
          My Bookings
        </button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Profile Information</h2>
            
            {updateSuccess && (
              <div className="success-message">Profile updated successfully!</div>
            )}
            
            {updateError && (
              <div className="error-message">{updateError}</div>
            )}
            
            <div className="profile-mode-toggle">
              <button 
                className={profileMode === 'view' ? 'mode-btn active' : 'mode-btn'} 
                onClick={() => setProfileMode('view')}
              >
                View Profile
              </button>
              <button 
                className={profileMode === 'edit' ? 'mode-btn active' : 'mode-btn'} 
                onClick={() => setProfileMode('edit')}
              >
                Edit Profile
              </button>
            </div>
            
            {profileMode === 'view' ? (
              <div className="profile-view">
                <div className="profile-header">
                  <div className="profile-picture-large">
                    {profileImageUrl ? (
                      <img src={profileImageUrl} alt="Profile" />
                    ) : previewUrl ? (
                      <img src={previewUrl} alt="Profile Preview" />
                    ) : (
                      <div className="profile-placeholder">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                  </div>
                  <div className="profile-name-email">
                    <h3>{profileData.name}</h3>
                    <p>{profileData.email}</p>
                  </div>
                </div>
                
                <div className="profile-details">
                  <div className="profile-detail-item">
                    <h4>Personal Information</h4>
                    <p><strong>Age:</strong> {profileData.age || 'Not specified'}</p>
                    <p><strong>Gender:</strong> {profileData.gender ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1) : 'Not specified'}</p>
                  </div>
                  
                  <div className="profile-detail-item">
                    <h4>Yoga Experience</h4>
                    <p><strong>Level:</strong> {profileData.experience ? profileData.experience.charAt(0).toUpperCase() + profileData.experience.slice(1) : 'Not specified'}</p>
                  </div>
                  
                  <div className="profile-detail-item">
                    <h4>Health Conditions</h4>
                    <p>{profileData.healthConditions || 'None specified'}</p>
                  </div>
                  
                  <div className="profile-detail-item">
                    <h4>Yoga Goals</h4>
                    <p>{profileData.goal || 'None specified'}</p>
                  </div>
                  
                  <div className="profile-detail-item">
                    <h4>Preferences</h4>
                    <p>{profileData.preferences || 'None specified'}</p>
                  </div>
                  
                  <button 
                    className="edit-profile-btn" 
                    onClick={() => setProfileMode('edit')}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileUpdate}>
                <div className="profile-picture-section">
                  <div className="profile-picture">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Profile Preview" />
                    ) : profileImageUrl ? (
                      <img src={profileImageUrl} alt="Profile" />
                    ) : (
                      <div className="profile-placeholder">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                  </div>
                  <div className="profile-picture-upload">
                    <label htmlFor="profile-picture">Upload Profile Picture</label>
                    <input 
                      type="file" 
                      id="profile-picture" 
                      accept="image/*"
                      onChange={handlePictureChange}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                    disabled
                  />
                  <small>Email cannot be changed</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={profileData.age}
                    onChange={handleProfileChange}
                    min="18"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={profileData.gender}
                    onChange={handleProfileChange}
                  >
                    <option value="">Select Gender</option>
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
                    value={profileData.experience}
                    onChange={handleProfileChange}
                  >
                    <option value="">Select Experience Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="healthConditions">Health Conditions</label>
                  <textarea
                    id="healthConditions"
                    name="healthConditions"
                    value={profileData.healthConditions}
                    onChange={handleProfileChange}
                    rows="3"
                    placeholder="List any health conditions or injuries"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="goal">Yoga Goals</label>
                  <textarea
                    id="goal"
                    name="goal"
                    value={profileData.goal}
                    onChange={handleProfileChange}
                    rows="3"
                    placeholder="What are your yoga goals?"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="preferences">Preferences</label>
                  <textarea
                    id="preferences"
                    name="preferences"
                    value={profileData.preferences}
                    onChange={handleProfileChange}
                    rows="3"
                    placeholder="Any preferences for your yoga practice?"
                  />
                </div>
                
                <button type="submit" className="submit-btn">Update Profile</button>
              </form>
            )}
          </div>
        )}
        
        {activeTab === 'booking' && (
          <div className="booking-section">
            <h2>Book a Yoga Class</h2>
            
            {bookingSuccess && (
              <div className="success-message">Class booked successfully!</div>
            )}
            
            {bookingError && (
              <div className="error-message">{bookingError}</div>
            )}
            
            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label htmlFor="trainer">Select Trainer</label>
                <select
                  id="trainer"
                  value={selectedTrainer}
                  onChange={handleTrainerChange}
                  required
                >
                  <option value="">Select a Trainer</option>
                  {trainers.map(trainer => (
                    <option key={trainer._id} value={trainer._id}>
                      {trainer.name} - {trainer.specialization}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="date">Select Date</label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="time">Select Time</label>
                <select
                  id="time"
                  value={selectedTime}
                  onChange={(e) => {
                    console.log('Selected time:', e.target.value);
                    setSelectedTime(e.target.value);
                  }}
                  required
                  disabled={!selectedTrainer || !selectedDate || availableSlots.length === 0}
                >
                  <option value="">Select a Time Slot</option>
                  {availableSlots && availableSlots.length > 0 ? (
                    availableSlots.map((slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No available slots</option>
                  )}
                </select>
                {(!selectedTrainer || !selectedDate) && (
                  <small>Please select a trainer and date first</small>
                )}
                {(selectedTrainer && selectedDate && availableSlots.length === 0) && (
                  <small>No available slots for this trainer on the selected date</small>
                )}
              </div>
              
              <div className="form-group">
                <label>Class Type</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="classType"
                      value="online"
                      checked={classType === 'online'}
                      onChange={() => setClassType('online')}
                    />
                    Online (via Zoom)
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="classType"
                      value="in-person"
                      checked={classType === 'in-person'}
                      onChange={() => setClassType('in-person')}
                    />
                    In-Person
                  </label>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="submit-btn"
                disabled={!selectedTrainer || !selectedDate || !selectedTime}
              >
                Book Class
              </button>
            </form>
          </div>
        )}
        
        {activeTab === 'classes' && (
          <div className="classes-section">
            <h2>Available Classes</h2>
            
            {classBookingSuccess && (
              <div className="success-message">Class booked successfully!</div>
            )}
            
            {classBookingError && (
              <div className="error-message">{classBookingError}</div>
            )}
            
            {availableClasses.length === 0 ? (
              <p>No classes available at the moment.</p>
            ) : (
              <div className="classes-list">
                {availableClasses.map(yogaClass => (
                  <div key={yogaClass._id} className="class-card">
                    <div className="class-header">
                      <h3>{yogaClass.title}</h3>
                      <span className={`class-type ${yogaClass.sessionType}`}>
                        {yogaClass.sessionType === 'online' ? 'Online (Zoom)' : 'In-Person'}
                      </span>
                    </div>
                    <div className="class-details">
                      <p><strong>Trainer:</strong> {yogaClass.trainer.name}</p>
                      <p><strong>Specialization:</strong> {yogaClass.trainer.specialization}</p>
                      <p><strong>Date:</strong> {new Date(yogaClass.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {yogaClass.startTime} - {yogaClass.endTime}</p>
                      <p><strong>Description:</strong> {yogaClass.description}</p>
                      <p><strong>Capacity:</strong> {yogaClass.capacity} spots</p>
                    </div>
                    <div className="class-actions">
                      <button 
                        className="book-btn" 
                        onClick={() => handleBookClass(yogaClass._id)}
                      >
                        Book This Class
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'my-bookings' && (
          <div className="bookings-section">
            <h2>My Bookings</h2>
            
            {cancelSuccess && (
              <div className="success-message">{cancelSuccess}</div>
            )}
            
            {cancelError && (
              <div className="error-message">{cancelError}</div>
            )}
            
            {userBookings.length === 0 ? (
              <p>You don't have any bookings yet.</p>
            ) : (
              <div className="bookings-list">
                {userBookings.map(booking => (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-header">
                      <h3>Class with {booking.trainer.name}</h3>
                      <span className={`booking-status ${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-details">
                      <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {booking.time}</p>
                      <p><strong>Type:</strong> {booking.classType === 'online' ? 'Online (Zoom)' : 'In-Person'}</p>
                      {booking.classType === 'online' && booking.status === 'Confirmed' && booking.zoomLink && (
                        <p>
                          <strong>Zoom Link:</strong> 
                          <a 
                            href={booking.zoomLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="zoom-link"
                          >
                            Join Zoom Meeting
                          </a>
                        </p>
                      )}
                    </div>
                    {booking.status !== 'Cancelled' && (
                      <div className="booking-actions">
                        <button 
                          className="cancel-btn" 
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel Booking
                        </button>
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

export default UserDashboard;