import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authService.requestOtp(email);
      // Response is now JSON: { message, otp }
      const otpValue = response.otp || response.otpCode;
      const messageText = response.message || 'OTP sent successfully';
      
      if (otpValue) {
        // Show OTP in message since SMTP is not configured
        setMessage(`${messageText}\n\nYour OTP is: ${otpValue}`);
      } else {
        setMessage(messageText);
      }
      setStep('otp');
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : 'Failed to send OTP. Please check your connection.';
      setError(errorMessage);
      console.error('OTP request error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const loginResponse = await authService.loginWithOtp(email, otp);
      
      // Response is now JSON: { message, customer, token }
      const customer = loginResponse.customer;
      
      if (customer) {
        login(customer, loginResponse.token || 'dummy-token');
        // Redirect based on role (case-insensitive check)
        const userRole = customer.role?.toUpperCase();
        console.log('Login - User role:', userRole, 'Customer object:', customer);
        
        // Use setTimeout to ensure state is updated before navigation
        setTimeout(() => {
          if (userRole === 'ADMIN') {
            console.log('Login - Redirecting admin to /admin/dashboard');
            navigate('/admin/dashboard', { replace: true });
          } else {
            console.log('Login - Redirecting user to /dashboard');
            navigate('/dashboard', { replace: true });
          }
        }, 100);
      } else {
        setError('Login successful but user data not received');
      }
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : 'Invalid or expired OTP';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enterprise-login-container">
      <div className="login-background-overlay"></div>
      <div className="login-content-wrapper">
        <div className="login-brand-section">
          <div className="bank-icon-wrapper">
            <span className="bank-icon">🏦</span>
          </div>
          <h1 className="bank-name">BitBank</h1>
          <p className="bank-tagline">Secure Banking. Trusted Service.</p>
        </div>
        
        <div className="login-card-enterprise">
          <div className="login-card-header">
            <h2>Sign In</h2>
            <p className="login-subtitle">Access your account securely</p>
          </div>
          
          {step === 'email' ? (
            <form onSubmit={handleRequestOtp} className="login-form-enterprise">
              <div className="form-group-enterprise">
                <label className="enterprise-label">Email Address</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                    className="enterprise-input login-input"
                  />
                </div>
              </div>
              
              {error && (
                <div className="alert alert-error login-alert">
                  <strong>Error</strong> {error}
                </div>
              )}
              
              {message && (
                <div className="alert alert-success login-alert">
                  <strong>Success</strong> {message}
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary login-button-enterprise"
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Sending OTP...
                  </>
                ) : (
                  'Request OTP'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="login-form-enterprise">
              <div className="form-group-enterprise">
                <label className="enterprise-label">Enter OTP</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    className="enterprise-input login-input otp-input"
                  />
                </div>
              </div>
              
              {error && (
                <div className="alert alert-error login-alert">
                  <strong>Error</strong> {error}
                </div>
              )}
              
              {message && (
                <div className="alert alert-info login-alert" style={{ whiteSpace: 'pre-line' }}>
                  <strong>Information</strong> {message}
                </div>
              )}
              
              <div className="login-actions">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary login-button-enterprise"
                >
                  {loading ? (
                    <>
                      <span className="spinner-small"></span>
                      Logging in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setOtp('');
                    setError('');
                    setMessage('');
                  }}
                  className="btn btn-outline back-button-enterprise"
                >
                  Back to Email
                </button>
              </div>
            </form>
          )}
          
          <div className="login-footer">
            <p className="security-note">
              <span className="security-icon">🔒</span>
              Your information is protected with bank-level security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
