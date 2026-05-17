import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Donation.css'

const Donation = () => {
  const [donationAmount, setDonationAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [selectedAmount, setSelectedAmount] = useState(null)
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000]

  const paymentMethods = [
    {
      id: 'kcb',
      name: 'KCB Bank',
      description: 'Kenya Commercial Bank',
      icon: '🏦'
    },
    {
      id: 'equity',
      name: 'Equity Bank',
      description: 'Equity Bank Kenya',
      icon: '🏦'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'International payments',
      icon: '💳'
    },
    {
      id: 'mpesa',
      name: 'M-Pesa',
      description: 'Mobile money',
      icon: '📱'
    },
    {
      id: 'paybill',
      name: 'PayBill',
      description: 'Business number payments',
      icon: '📊'
    }
  ]

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount)
    setDonationAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (e) => {
    const amount = e.target.value
    setCustomAmount(amount)
    setDonationAmount(amount)
    setSelectedAmount(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setDonorInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const finalAmount = customAmount || donationAmount
    
    if (!finalAmount) {
      alert('Please select or enter a donation amount')
      return
    }

    if (!selectedPaymentMethod) {
      alert('Please select a payment method')
      return
    }

    console.log('Donation submitted:', {
      amount: finalAmount,
      paymentMethod: selectedPaymentMethod,
      donor: donorInfo
    })
    
    alert(`Thank you for your donation of $${finalAmount} via ${paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}! We will process your donation shortly.`)
    
    // Reset form
    setDonationAmount('')
    setCustomAmount('')
    setSelectedAmount(null)
    setSelectedPaymentMethod('')
    setDonorInfo({
      name: '',
      email: '',
      message: ''
    })
  }

  return (
    <div className="donation-page">
      <div className="donation-container">
        <Link to="/" className="back-link">← Back to Home</Link>
        
        <div className="donation-content">
          <div className="donation-hero">
            <h1>Support SDA Clinic6 Church Construction</h1>
            <p>Your generous donation will help us build a beautiful house of worship for our community.</p>
          </div>

          <div className="donation-main">
            <div className="donation-form-section">
              <form onSubmit={handleSubmit} className="donation-form">
                <div className="form-section">
                  <h2>Select Donation Amount</h2>
                  <div className="amount-buttons">
                    {predefinedAmounts.map(amount => (
                      <button
                        key={amount}
                        type="button"
                        className={`amount-btn ${selectedAmount === amount ? 'active' : ''}`}
                        onClick={() => handleAmountClick(amount)}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  
                  <div className="custom-amount">
                    <label htmlFor="custom-amount">Or enter custom amount:</label>
                    <div className="amount-input-wrapper">
                      <span className="currency">$</span>
                      <input
                        type="number"
                        id="custom-amount"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        min="1"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h2>Your Information</h2>
                  
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      value={donorInfo.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Your email"
                      value={donorInfo.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message (Optional)</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Share your message or prayer..."
                      value={donorInfo.message}
                      onChange={handleInputChange}
                      rows="4"
                    ></textarea>
                  </div>
                </div>

                <div className="form-section">
                  <h2>Select Payment Method</h2>
                  <div className="payment-methods">
                    {paymentMethods.map(method => (
                      <div
                        key={method.id}
                        className={`payment-method ${selectedPaymentMethod === method.id ? 'active' : ''}`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        <div className="payment-icon">{method.icon}</div>
                        <div className="payment-details">
                          <div className="payment-name">{method.name}</div>
                          <div className="payment-description">{method.description}</div>
                        </div>
                        <div className="payment-radio">
                          <div className={`radio-circle ${selectedPaymentMethod === method.id ? 'selected' : ''}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="submit-btn">
                  Donate Now - ${customAmount || donationAmount || '0'}
                </button>
              </form>
            </div>

            <div className="donation-info-section">
              <div className="info-card">
                <h3>Our Mission</h3>
                <p>We are building a modern, welcoming church that will serve as a spiritual home for our community and a beacon of faith.</p>
              </div>

              <div className="info-card">
                <h3>Project Progress</h3>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '45%' }}></div>
                </div>
                <p>45% Complete - Help us reach our goal!</p>
              </div>

              <div className="info-card">
                <h3>How Your Donation Helps</h3>
                <ul>
                  <li>$25 - Helps with building materials</li>
                  <li>$50 - Supports labor costs</li>
                  <li>$100 - Contributes to infrastructure</li>
                  <li>$500+ - Major project milestone contribution</li>
                </ul>
              </div>

              <div className="info-card donation-methods">
                <h3>Payment Methods</h3>
                <p>Currently accepting direct donations. For payment processing, please contact us.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Donation
