import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileAPI, customerAPI } from '../services/apiService';
import LoadingSpinner from './common/LoadingSpinner';
import '../styles/enterprise-design-system.css';
import './Profile.css';

const Profile = () => {
  const { user, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [myRequests, setMyRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
      });
      // Only fetch requests for regular users (customers)
      if (!isAdmin) {
        fetchMyRequests();
      }
    }
  }, [user, isAdmin]);

  const fetchMyRequests = async () => {
    if (!user || isAdmin) return;
    try {
      setLoadingRequests(true);
      const response = await profileAPI.getMyRequests(user.id);
      setMyRequests(response.data || []);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user.id) {
      setError('User information not available. Please refresh the page.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');
    setWarning('');

    // Check if anything changed
    const hasChanges = 
      formData.fullName !== (user?.fullName || '') ||
      formData.email !== (user?.email || '') ||
      formData.phoneNumber !== (user?.phoneNumber || '') ||
      formData.address !== (user?.address || '');

    if (!hasChanges) {
      setWarning('No changes detected. Please modify at least one field.');
      setLoading(false);
      return;
    }

    try {
      if (isAdmin) {
        // Admin: Direct update (no approval needed)
        await customerAPI.update(user.id, {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        });

        setMessage('Profile updated successfully!');
        
        // Update user in context/localStorage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Refresh user data without full page reload
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        
        // Clear message after 5 seconds
        setTimeout(() => {
          setMessage('');
        }, 5000);
      } else {
        // Customer: Submit request for approval
        await profileAPI.requestUpdate(user.id, {
          requestedFullName: formData.fullName,
          requestedEmail: formData.email,
          requestedPhoneNumber: formData.phoneNumber,
          requestedAddress: formData.address,
        });

        setMessage('Profile update request submitted successfully! Waiting for admin approval.');
        fetchMyRequests();
        
        // Clear message after 5 seconds
        setTimeout(() => {
          setMessage('');
        }, 5000);
      }
    } catch (err) {
      let errorMsg = isAdmin 
        ? 'Failed to update profile' 
        : 'Failed to submit update request';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        } else if (err.response.data.error) {
          errorMsg = err.response.data.error;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge badge-warning">Pending</span>;
      case 'APPROVED':
        return <span className="badge badge-success">Approved</span>;
      case 'REJECTED':
        return <span className="badge badge-error">Rejected</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  if (!user) {
    return <LoadingSpinner size="lg" text="Loading profile..." fullScreen />;
  }

  return (
    <div className="profile-page enterprise-page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p className="page-subtitle">View and update your profile information</p>
      </div>

      <div className="profile-layout">
        <div className="profile-form-container">
          <div className="profile-form-card">
            <h2>Profile Information</h2>
            {!isAdmin && (
              <p className="profile-note">
                <strong>Note:</strong> Profile updates require admin approval. Your changes will be reviewed before being applied.
              </p>
            )}
            {isAdmin && (
              <p className="profile-note" style={{ background: 'var(--info-light)', borderColor: 'var(--info-color)' }}>
                <strong>Admin Mode:</strong> Your profile updates are applied immediately without approval.
              </p>
            )}

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="enterprise-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="enterprise-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="enterprise-input"
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="enterprise-input"
                  rows="4"
                />
              </div>

              {message && (
                <div className="alert alert-success">
                  <strong>Success!</strong> {message}
                </div>
              )}
              {error && (
                <div className="alert alert-error">
                  <strong>Error!</strong> {error}
                </div>
              )}
              {warning && (
                <div className="alert alert-warning">
                  <strong>Warning!</strong> {warning}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading 
                  ? (isAdmin ? 'Updating Profile...' : 'Submitting Request...') 
                  : (isAdmin ? 'Update Profile' : 'Request Profile Update')
                }
              </button>
            </form>
          </div>
        </div>

        {!isAdmin && (
          <div className="profile-requests-container">
            <div className="profile-requests-card">
              <h2>Update Request History</h2>
              {loadingRequests ? (
                <div className="loading-container">
                  <div className="spinner spinner-md"></div>
                  <p>Loading requests...</p>
                </div>
              ) : myRequests.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <h3 className="empty-state-title">No Update Requests</h3>
                  <p className="empty-state-description">
                    You haven't submitted any profile update requests yet.
                  </p>
                </div>
              ) : (
                <div className="requests-list">
                  {myRequests.map((request) => (
                    <div key={request.id} className="request-item">
                      <div className="request-header">
                        <div className="request-status">
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="request-date">
                          Requested: {formatDate(request.requestedAt)}
                        </div>
                      </div>
                      <div className="request-changes">
                        {request.requestedFullName && (
                          <div className="change-item">
                            <span className="change-label">Name:</span>
                            <span className="change-value">{request.requestedFullName}</span>
                          </div>
                        )}
                        {request.requestedEmail && (
                          <div className="change-item">
                            <span className="change-label">Email:</span>
                            <span className="change-value">{request.requestedEmail}</span>
                          </div>
                        )}
                        {request.requestedPhoneNumber && (
                          <div className="change-item">
                            <span className="change-label">Phone:</span>
                            <span className="change-value">{request.requestedPhoneNumber}</span>
                          </div>
                        )}
                        {request.requestedAddress && (
                          <div className="change-item">
                            <span className="change-label">Address:</span>
                            <span className="change-value">{request.requestedAddress}</span>
                          </div>
                        )}
                      </div>
                      {request.reviewedAt && (
                        <div className="request-review">
                          Reviewed: {formatDate(request.reviewedAt)}
                          {request.reviewedBy && ` by ${request.reviewedBy}`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

