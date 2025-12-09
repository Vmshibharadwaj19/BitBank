import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/enterprise-design-system.css';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const services = [
    {
      icon: '💳',
      title: 'Personal Banking',
      description: 'Comprehensive banking solutions for individuals with competitive rates and flexible options.',
      features: ['Savings Accounts', 'Checking Accounts', 'Credit Cards', 'Personal Loans']
    },
    {
      icon: '🏢',
      title: 'Business Banking',
      description: 'Tailored financial services for businesses of all sizes to help you grow.',
      features: ['Business Accounts', 'Merchant Services', 'Business Loans', 'Cash Management']
    },
    {
      icon: '📈',
      title: 'Investment Services',
      description: 'Expert investment guidance and wealth management solutions for your financial future.',
      features: ['Portfolio Management', 'Retirement Planning', 'Mutual Funds', 'Stocks & Bonds']
    },
    {
      icon: '🏠',
      title: 'Mortgage & Loans',
      description: 'Competitive rates and flexible terms for home loans and personal financing.',
      features: ['Home Loans', 'Auto Loans', 'Personal Loans', 'Refinancing']
    },
    {
      icon: '🌐',
      title: 'Digital Banking',
      description: 'Bank anytime, anywhere with our secure and intuitive digital platform.',
      features: ['Mobile Banking', 'Online Banking', 'Bill Pay', 'Money Transfer']
    },
    {
      icon: '🛡️',
      title: 'Insurance & Protection',
      description: 'Comprehensive insurance solutions to protect what matters most to you.',
      features: ['Life Insurance', 'Health Insurance', 'Property Insurance', 'Auto Insurance']
    }
  ];

  const features = [
    {
      icon: '🔒',
      title: 'Bank-Level Security',
      description: 'Your data is protected with industry-leading encryption and security measures.'
    },
    {
      icon: '⚡',
      title: '24/7 Access',
      description: 'Manage your finances anytime, anywhere with our digital banking platform.'
    },
    {
      icon: '💎',
      title: 'Premium Service',
      description: 'Dedicated support team ready to assist you with all your banking needs.'
    },
    {
      icon: '📊',
      title: 'Financial Insights',
      description: 'Get personalized insights and recommendations to optimize your finances.'
    }
  ];

  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <nav className={`home-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="nav-brand-home">
            <span className="bank-icon-nav">🏦</span>
            <span className="bank-name-nav">BitBank</span>
          </div>
          <div className="nav-links-home">
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary nav-login-btn">
                Go to Dashboard
              </Link>
            ) : (
              <button onClick={handleLoginClick} className="btn btn-primary nav-login-btn">
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="gradient-text">BitBank</span>
            </h1>
            <p className="hero-subtitle">
              Your trusted partner for financial excellence. Experience banking reimagined with 
              cutting-edge technology and personalized service.
            </p>
            <div className="hero-actions">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <button onClick={handleLoginClick} className="btn btn-primary btn-large">
                    Sign In to Your Account
                  </button>
                  <a href="#services" className="btn btn-outline btn-large">
                    Explore Services
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose BitBank?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header-center">
            <h2 className="section-title">Our Banking Services</h2>
            <p className="section-subtitle">
              Comprehensive financial solutions designed to meet all your banking needs
            </p>
          </div>
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">2M+</div>
              <div className="stat-label">Active Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">$500B+</div>
              <div className="stat-label">Assets Under Management</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">Years of Excellence</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-subtitle">
              Join millions of satisfied customers who trust BitBank for their financial needs.
            </p>
            {!isAuthenticated && (
              <button onClick={handleLoginClick} className="btn btn-primary btn-large">
                Sign In Now
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="bank-icon-nav">🏦</span>
              <span className="bank-name-nav">BitBank</span>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Services</h4>
                <a href="#services">Personal Banking</a>
                <a href="#services">Business Banking</a>
                <a href="#services">Investment Services</a>
                <a href="#services">Loans & Mortgages</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#about">About Us</a>
                <a href="#contact">Contact</a>
                <a href="#careers">Careers</a>
                <a href="#news">News & Updates</a>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <a href="#help">Help Center</a>
                <a href="#security">Security</a>
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 BitBank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

