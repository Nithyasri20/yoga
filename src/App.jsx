import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import UserLogin from './components/UserLogin'
import TrainerLogin from './components/TrainerLogin'
import AdminLogin from './components/AdminLogin'
import TrainerDashboard from './components/TrainerDashboard'
import UserDashboard from './components/UserDashboard'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/trainer-login" element={<TrainerLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App