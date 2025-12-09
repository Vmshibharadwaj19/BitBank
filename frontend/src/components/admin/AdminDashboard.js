import React, { useState, useEffect } from 'react';
import { adminAPI, accountAPI } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import EnterpriseCard from '../common/EnterpriseCard';
import '../../styles/enterprise-design-system.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        await fetchData();
      } catch (err) {
        if (isMounted) {
          console.error('AdminDashboard - Error in useEffect:', err);
        }
      }
    };
    
    loadData();
    
    // Timeout fallback - if loading takes more than 15 seconds, show error
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.error('AdminDashboard - Loading timeout after 15 seconds');
        setError('Request timed out. Please check if the backend server is running on http://localhost:8080');
        setLoading(false);
      }
    }, 15000);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('AdminDashboard - Fetching data...');
      
      const [customersRes, accountsRes, requestsRes] = await Promise.all([
        adminAPI.getAllCustomers().catch(err => {
          console.error('AdminDashboard - Failed to fetch customers:', err);
          throw new Error('Failed to load customers: ' + (err.response?.data?.message || err.message));
        }),
        accountAPI.getAll().catch(err => {
          console.error('AdminDashboard - Failed to fetch accounts:', err);
          throw new Error('Failed to load accounts: ' + (err.response?.data?.message || err.message));
        }),
        adminAPI.getPendingProfileRequests().catch(err => {
          console.warn('AdminDashboard - Failed to fetch pending requests (non-critical):', err);
          return { data: [] }; // Non-critical, return empty array
        }),
      ]);
      
      console.log('AdminDashboard - Data fetched successfully:', {
        customers: customersRes.data?.length || 0,
        accounts: accountsRes.data?.length || 0,
        requests: requestsRes.data?.length || 0
      });
      
      setCustomers(customersRes.data || []);
      setAccounts(accountsRes.data || []);
      setPendingRequests(requestsRes.data || []);
    } catch (err) {
      console.error('AdminDashboard - Error fetching data:', err);
      const errorMessage = err.message || err.response?.data?.message || 'Failed to load data. Please check your connection and try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLockCustomer = async (id) => {
    try {
      await adminAPI.lockCustomer(id);
      fetchData();
    } catch (err) {
      alert('Failed to lock customer');
    }
  };

  const handleUnlockCustomer = async (id) => {
    try {
      await adminAPI.unlockCustomer(id);
      fetchData();
    } catch (err) {
      alert('Failed to unlock customer');
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await adminAPI.approveProfileRequest(requestId, user?.email || 'admin');
      fetchData();
    } catch (err) {
      alert('Failed to approve request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await adminAPI.rejectProfileRequest(requestId, user?.email || 'admin');
      fetchData();
    } catch (err) {
      alert('Failed to reject request');
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

  if (loading) {
    return (
      <div className="admin-dashboard enterprise-page">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <LoadingSpinner size="lg" text="Loading admin dashboard..." fullScreen />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="admin-dashboard enterprise-page">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p className="page-subtitle">Error loading data</p>
        </div>
        <div className="enterprise-error-state">
          <div className="error-icon">⚠️</div>
          <h3>{error}</h3>
          <p style={{ marginTop: '1rem', color: 'var(--gray-600)' }}>
            Please check:
            <ul style={{ textAlign: 'left', marginTop: '0.5rem' }}>
              <li>Backend server is running on http://localhost:8080</li>
              <li>API endpoints are accessible</li>
              <li>Browser console for detailed error messages</li>
            </ul>
          </p>
          <button className="btn btn-primary" onClick={fetchData} style={{ marginTop: '1.5rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard enterprise-page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p className="page-subtitle">Manage customers and monitor system activity</p>
      </div>
      
      <div className="dashboard-stats-grid">
        <EnterpriseCard 
          title="Total Customers"
          subtitle="All registered users"
          icon="👥"
          gradient="primary"
        >
          <div className="stat-value-large">{customers.length}</div>
        </EnterpriseCard>
        
        <EnterpriseCard 
          title="Total Accounts"
          subtitle="All bank accounts"
          icon="🏦"
          gradient="info"
        >
          <div className="stat-value-large">{accounts.length}</div>
        </EnterpriseCard>
        
        <EnterpriseCard 
          title="Locked Accounts"
          subtitle="Currently locked"
          icon="🔒"
          gradient="error"
        >
          <div className="stat-value-large">
            {customers.filter((c) => c.locked).length}
          </div>
        </EnterpriseCard>
        
        <EnterpriseCard 
          title="Pending Requests"
          subtitle="Profile updates"
          icon="⏳"
          gradient="warning"
        >
          <div className="stat-value-large">{pendingRequests.length}</div>
        </EnterpriseCard>
      </div>

      <div className="customers-section">
        <div className="section-header">
          <h2 className="section-title">All Customers</h2>
        </div>
        <div className="transactions-table-wrapper">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Failed Attempts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.fullName}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phoneNumber}</td>
                  <td>
                    <span className={`badge ${customer.locked ? 'badge-error' : 'badge-success'}`}>
                      {customer.locked ? 'Locked' : 'Active'}
                    </span>
                  </td>
                  <td>{customer.failedLoginAttempts || 0}</td>
                  <td>
                    {customer.locked ? (
                      <button
                        onClick={() => handleUnlockCustomer(customer.id)}
                        className="btn btn-success"
                      >
                        Unlock
                      </button>
                    ) : (
                      <button
                        onClick={() => handleLockCustomer(customer.id)}
                        className="btn btn-error"
                      >
                        Lock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pendingRequests.length > 0 && (
        <div className="pending-requests-section">
          <div className="section-header">
            <h2 className="section-title">Pending Profile Update Requests</h2>
          </div>
          <div className="transactions-table-wrapper">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Requested Changes</th>
                  <th>Requested Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <div>
                        <strong>{request.customerName}</strong>
                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: '0.25rem' }}>
                          {request.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="request-changes-list">
                        {request.requestedFullName && (
                          <div><strong>Name:</strong> {request.requestedFullName}</div>
                        )}
                        {request.requestedEmail && (
                          <div><strong>Email:</strong> {request.requestedEmail}</div>
                        )}
                        {request.requestedPhoneNumber && (
                          <div><strong>Phone:</strong> {request.requestedPhoneNumber}</div>
                        )}
                        {request.requestedAddress && (
                          <div><strong>Address:</strong> {request.requestedAddress}</div>
                        )}
                      </div>
                    </td>
                    <td>{formatDate(request.requestedAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          className="btn btn-success"
                          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="btn btn-error"
                          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
