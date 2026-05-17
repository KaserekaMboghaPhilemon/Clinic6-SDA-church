
import React, { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Donation from './pages/Donation'
import distroyedChurch from './assets/church-affected1.jpeg'
import dreamChurch from './assets/dream-church.png'
import dreamChurch1 from './assets/dream-church1.png'
import dreamChurchVideo from './assets/Clinic6 dream church.mp4'
import ClickCounter from './components/ClickCounter'
const HelloComponent = () => {
  return (
    <div className='donate-newChurch'>
      <img src={distroyedChurch} className='churchImge' alt="church destroyed" />
      <img src={dreamChurch} className='churchImge' alt="dream church" />
      <video src={dreamChurchVideo} className='churchImge' autoPlay muted loop></video>
    </div>
  )
}

const HomePage = ({ currentImageIndex, setCurrentImageIndex, scenes }) => {
  return (
    <>
      {/* Hero Section with Image Carousel */}
      <div className="hero-section">
        <div className="carousel-container">
          <img 
            src={scenes[currentImageIndex].image} 
            alt={scenes[currentImageIndex].title} 
            className="carousel-image"
          />
          <div className="carousel-overlay">
            <div className="hero-content" key={currentImageIndex}>
              <h1>{scenes[currentImageIndex].title}</h1>
              <p>{scenes[currentImageIndex].description}</p>
              <a href="/donate" className="cta-button">Donate Now</a>
            </div>
          </div>
          <div className="carousel-indicators">
            {scenes.map((_, index) => (
              <div
                key={index}
                className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
      
      <main style={{padding:'24px',maxWidth:1100,margin:'0 auto'}}>
        <div className="donation-hand">
        <p>Welcome to the SDA Clinic6 church construction project site.</p>
        </div>
        <p>dear Gd's people it is <span className='time-zone'>{new Date().toString()}</span></p>
        <p>Lets do God's work when we still have <a href="https://www.ellenwhite.info/books/ellen-g-white-book-christs-object-lessons-col-25.htm?utm_source=chatgpt.com" className='toothtip-link'
   data-tooltip="Now is the time to give for God's work; every gift consecrated to His cause is a treasure laid up in heaven. — Ellen G. White, Christ's Object Lessons, p. 326" 
   target="_blank"><span className='good-time' id='time-work'>good life</span> <span className='but'>but a</span> <span className='bad-time' id='time-bad'>difficult life or bad times</span>
</a> coming when you not be able again! you only have today <span className='time-zone'>{new Date().toString()}</span> to donate to the construction project for God's house of worship!</p>

      <div className="donate-now">
        <div className="wornout-church"></div>
        <div className="togethernernes">
        </div>
        <div className="dream-church"></div>
      </div>
      </main>
    </>
  )
}

const App = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const scenes = [
    {
      image: distroyedChurch,
      title: "Welcome to SDA Church Clinic 6 (Six) Construction Website",
      description: "Join us in building a magnificent house of worship for God's kingdom"
    },
    {
      image: dreamChurch,
      title: "Our Dream Vision",
      description: "Together we will build a beautiful, modern house of worship for the SDA Clinic6 community"
    },
    {
      image: dreamChurch1,
      title: "Let's Build Together",
      description: "Join us and be part of this blessed construction project - every donation matters!"
    }
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % scenes.length)
    }, 5000) // Change image every 5 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <Router>
      <div className="App-container">
        <video autoPlay muted loop className="background-video">
          <source src="/your-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="App" style={{maxWidth:1200,margin:'0 auto'}}>
          <Navbar />
          
          <Routes>
            <Route 
              path="/" 
              element={<HomePage currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex} scenes={scenes} />} 
            />
            <Route path="/donate" element={<Donation />} />
          </Routes>
          <ClickCounter />
        </div>
      </div>
    </Router>
  )
}
export default App
