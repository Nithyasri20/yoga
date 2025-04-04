import './About.css';

function About() {
  return (
    <div className="about">
      <div className="about-hero">
        <h1>About YogaFlow</h1>
        <p>Our journey, mission, and values</p>
      </div>
      
      <div className="about-content">
        <div className="about-section">
          <h2>Our Story</h2>
          <p>
            YogaFlow was founded in 2020 with a simple mission: to make yoga accessible to everyone, 
            regardless of age, fitness level, or background. What started as a small studio with a 
            handful of dedicated practitioners has grown into a thriving community of yoga enthusiasts.
          </p>
          <p>
            Our founder, Maya Patel, a certified yoga instructor with over 15 years of experience, 
            envisioned a space where people could connect with themselves and others through the 
            practice of yoga. Today, YogaFlow continues to uphold this vision by providing a 
            welcoming environment for all who wish to embark on their yoga journey.
          </p>
        </div>
        
        <div className="about-section">
          <h2>Our Philosophy</h2>
          <p>
            At YogaFlow, we believe that yoga is more than just physical exercise—it's a way of life. 
            Our approach combines traditional yoga practices with modern wellness techniques to provide 
            a holistic experience that nurtures the mind, body, and spirit.
          </p>
          <p>
            We emphasize mindfulness, proper alignment, and personalized instruction to ensure that 
            each practitioner gets the most out of their yoga practice. Our classes are designed to 
            challenge and inspire, while also providing a safe space for self-discovery and growth.
          </p>
        </div>
        
        <div className="about-section">
          <h2>Our Team</h2>
          <div className="team-container">
            <div className="team-member">
              <div className="team-img-placeholder"></div>
              <h3>Maya Patel</h3>
              <p>Founder & Lead Instructor</p>
            </div>
            
            <div className="team-member">
              <div className="team-img-placeholder"></div>
              <h3>David Rodriguez</h3>
              <p>Senior Yoga Instructor</p>
            </div>
            
            <div className="team-member">
              <div className="team-img-placeholder"></div>
              <h3>Aisha Johnson</h3>
              <p>Meditation Specialist</p>
            </div>
            
            <div className="team-member">
              <div className="team-img-placeholder"></div>
              <h3>Raj Sharma</h3>
              <p>Yoga Therapist</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;