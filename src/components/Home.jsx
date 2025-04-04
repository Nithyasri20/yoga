import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero-container">
        <h1>Welcome to YogaFlow</h1>
        <p>Discover inner peace and wellness through yoga</p>
        <div className="hero-btns">
          <button className="btn primary-btn">Get Started</button>
          <button className="btn secondary-btn">Learn More</button>
        </div>
        <div className="scroll-down">
          <p>Scroll Down</p>
          <div className="scroll-down-icon"></div>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Our Features</h2>
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-img"></div>
            <div className="feature-content">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Expert Trainers</h3>
              <p>Learn from certified yoga instructors with years of experience in various yoga styles including Hatha, Vinyasa, and Ashtanga.</p>
              <a href="#" className="btn-learn-more">Learn More</a>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-img"></div>
            <div className="feature-content">
              <div className="feature-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3>Flexible Schedule</h3>
              <p>Choose from various class timings that fit your busy lifestyle with early morning, afternoon, and evening sessions available.</p>
              <a href="#" className="btn-learn-more">View Schedule</a>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-img"></div>
            <div className="feature-content">
              <div className="feature-icon">
                <i className="fas fa-dumbbell"></i>
              </div>
              <h3>All Levels</h3>
              <p>Classes for beginners, intermediate and advanced practitioners designed to help you progress at your own pace.</p>
              <a href="#" className="btn-learn-more">Explore Classes</a>
            </div>
          </div>
        </div>
        
        {/* Decorative shapes */}
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <div className="testimonials-section">
        <h2>What Our Members Say</h2>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <p>"YogaFlow has transformed my life. I feel more energetic and peaceful. The instructors are knowledgeable and supportive, making each session a joy to attend."</p>
            <div className="testimonial-author">
              <div className="author-img"></div>
              <div className="author-info">
                <h4>Sarah Johnson</h4>
                <span>Member since 2021</span>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <p>"The trainers are amazing and the community is so supportive! I've made great friends here and my flexibility has improved tremendously since joining."</p>
            <div className="testimonial-author">
              <div className="author-img"></div>
              <div className="author-info">
                <h4>Michael Chen</h4>
                <span>Member since 2022</span>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <p>"I've been practicing yoga for years, but YogaFlow takes it to another level. The studio atmosphere is calming and the variety of classes keeps me engaged."</p>
            <div className="testimonial-author">
              <div className="author-img"></div>
              <div className="author-info">
                <h4>Priya Sharma</h4>
                <span>Member since 2020</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;