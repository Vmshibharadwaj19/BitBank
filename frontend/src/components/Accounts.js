import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { accountAPI } from '../services/apiService';
import LoadingSpinner from './common/LoadingSpinner';
import EnterpriseCard from './common/EnterpriseCard';
import '../styles/enterprise-design-system.css';
import './Accounts.css';

const Accounts = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect admins to admin dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) {
      fetchAccounts();
    }
  }, [user, isAdmin]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountAPI.getAll();
      const allAccounts = response.data;
      const userAccounts = allAccounts.filter(acc => acc.customer?.id === user?.id);
      setAccounts(userAccounts);
    } catch (err) {
      setError('Failed to load accounts. Please try again.');
      console.error('Accounts error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if admin (will redirect)
  if (isAdmin) {
    return <LoadingSpinner size="lg" text="Redirecting..." fullScreen />;
  }

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading accounts..." />;
  }

  if (error) {
    return (
      <div className="enterprise-error-state">
        <div className="error-icon">⚠️</div>
        <h3>{error}</h3>
        <button className="btn btn-primary" onClick={fetchAccounts}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="accounts-page enterprise-page">
      <div className="page-header">
        <h1>Account Management</h1>
        <p className="page-subtitle">
          View and manage your bank accounts
        </p>
      </div>

      {accounts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏦</div>
          <h3 className="empty-state-title">No Accounts Found</h3>
          <p className="empty-state-description">
            You don't have any accounts yet. Contact your administrator to create an account.
          </p>
        </div>
      ) : (
        <div className="accounts-grid-enterprise">
          {accounts.map((account) => (
            <EnterpriseCard 
              key={account.id}
              className="account-card-enterprise-full"
              hover
            >
              <div className="account-card-content">
                <div className="account-header-enterprise-full">
                  <div className="account-icon-large">
                    <span>💳</span>
                  </div>
                  <div className="account-info-main">
                    <h3>Account #{account.accountNumber}</h3>
                    <span className="account-type-tag">{account.type || 'SAVINGS'}</span>
                  </div>
                </div>
                
                <div className="account-stats-enterprise">
                  <div className="stat-item-enterprise">
                    <span className="stat-label-enterprise">Current Balance</span>
                    <span className="stat-value-enterprise balance-highlight">
                      ₹{account.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                    </span>
                  </div>
                  
                  <div className="account-meta-grid">
                    <div className="meta-item-enterprise">
                      <span className="meta-label">Sort Code</span>
                      <span className="meta-value">{account.sortCode || 'N/A'}</span>
                    </div>
                    <div className="meta-item-enterprise">
                      <span className="meta-label">Interest Rate</span>
                      <span className="meta-value">{(account.interestRate ? (account.interestRate * 100).toFixed(2) : '0.00')}%</span>
                    </div>
                  </div>

                  {account.customer && (
                    <div className="account-customer-info">
                      <span className="customer-label">Account Holder</span>
                      <span className="customer-name">{account.customer.fullName}</span>
                    </div>
                  )}
                </div>
              </div>
            </EnterpriseCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default Accounts;
