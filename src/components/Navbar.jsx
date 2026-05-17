
import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import logo from '../assets/clinic6-construction-logo.jpg'

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar__container">
        <div className="navbar__brand">
          <img src={logo} alt="Clinic6 construction logo" className="navbar__logo" />
          <div className="navbar__titles">
            <span className="navbar__name">SDA Clinic6</span>
            <span className="navbar__subtitle">Church Construction Project</span>
          </div>
          <div className="mode-change">
          <button className='night-mode'>Night mode</button>
          <button className='day-mode'>Day mode</button>
          </div>
        </div>

        <nav className="navbar__nav">
          <Link to="/" className="navbar__link">Home</Link>
          <a href="#about" className="navbar__link">About</a>
          <a href="#progress" className="navbar__link">Progress</a>
          <a href="#team" className="navbar__link">Team</a>
          <a href="#contact" className="navbar__link">Contact</a>
        </nav>

        <div className="navbar__actions">
          <Link to="/donate" className="navbar__donate">Donate</Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar
