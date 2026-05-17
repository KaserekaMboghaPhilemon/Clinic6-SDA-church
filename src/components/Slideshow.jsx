  import { useState, useEffect } from 'react'
import churchAffected from '../assets/church-affected1.jpeg'
import dreamChurch from '../assets/dream-church.png'
import dreamChurch1 from '../assets/dream-church1.png'
import donateTogether from '../assets/donate-together.png'
import '../styles/slideshow.css'

const Slideshow = () => {
  const images = [churchAffected, dreamChurch, dreamChurch1, donateTogether]
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [images.length]) 

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  return (
    <div className="slideshow-container">
      <div className="slideshow-wrapper">
        <img 
          src={images[currentIndex]} 
          alt="Slideshow" 
          className="slideshow-image"
        />
        
        <button className="slideshow-btn prev" onClick={handlePrevious}>
          ❮
        </button>
        <button className="slideshow-btn next" onClick={handleNext}>
          ❯
        </button>
      </div>

      {/* Dots indicator */}
      <div className="slideshow-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  )
}

export default Slideshow
