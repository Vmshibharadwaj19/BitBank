import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { accountAPI, transactionAPI } from '../services/apiService';
import LoadingSpinner from './common/LoadingSpinner';
import EnterpriseCard from './common/EnterpriseCard';
import '../styles/enterprise-design-system.css';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // Redirect admins to admin dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) {
      fetchData();
    }
  }, [user, isAdmin]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch accounts
      const accountsResponse = await accountAPI.getAll();
      const allAccounts = accountsResponse.data;
      const userAccounts = user?.role === 'ADMIN' 
        ? allAccounts 
        : allAccounts.filter(acc => acc.customer?.id === user?.id);
      setAccounts(userAccounts);

      // Fetch transactions with pagination
      if (user) {
        if (user.role === 'ADMIN') {
          const transactionsResponse = await transactionAPI.getAll(0, pageSize);
          const data = transactionsResponse.data;
          setTransactions(data.content || []);
          setTotalPages(data.totalPages || 0);
          setTotalElements(data.totalElements || 0);
        } else {
          const transactionsResponse = await transactionAPI.getByCustomer(user.id, 0, pageSize);
          const data = transactionsResponse.data;
          setTransactions(data.content || []);
          setTotalPages(data.totalPages || 0);
          setTotalElements(data.totalElements || 0);
        }
      }
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if admin (will redirect)
  if (isAdmin) {
    return <LoadingSpinner size="lg" text="Redirecting..." fullScreen />;
  }

  const handlePageChange = async (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      try {
        setLoading(true);
        if (user?.role === 'ADMIN') {
          const response = await transactionAPI.getAll(newPage, pageSize);
          const data = response.data;
          setTransactions(data.content || []);
          setCurrentPage(data.currentPage || 0);
        } else {
          const response = await transactionAPI.getByCustomer(user.id, newPage, pageSize);
          const data = response.data;
          setTransactions(data.content || []);
          setCurrentPage(data.currentPage || 0);
        }
      } catch (err) {
        console.error('Failed to load transactions:', err);
      } finally {
        setLoading(false);
      }
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

  const getAccountDisplay = (transaction) => {
    if (transaction.fromAccount && transaction.toAccount) {
      return `${transaction.fromAccount.accountNumber} → ${transaction.toAccount.accountNumber}`;
    } else if (transaction.fromAccount) {
      return `From: ${transaction.fromAccount.accountNumber}`;
    } else if (transaction.toAccount) {
      return `To: ${transaction.toAccount.accountNumber}`;
    }
    return 'N/A';
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  if (loading && transactions.length === 0) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." fullScreen />;
  }

  if (error) {
    return (
      <div className="enterprise-error-state">
        <div className="error-icon">⚠️</div>
        <h3>{error}</h3>
        <button className="btn btn-primary" onClick={fetchData}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard enterprise-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.fullName || user?.email}</h1>
          <p className="dashboard-subtitle">
            {user?.role === 'ADMIN' ? 'Administrative Dashboard' : 'Manage your accounts and transactions'}
          </p>
        </div>
        <div className="dashboard-header-actions">
          <span className="current-time">
            {new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      <div className="dashboard-stats-grid">
        <EnterpriseCard 
          title="Total Accounts"
          subtitle="Active accounts"
          icon="🏦"
          gradient="primary"
        >
          <div className="stat-value-large">{accounts.length}</div>
        </EnterpriseCard>
        
        <EnterpriseCard 
          title="Total Balance"
          subtitle="Available funds"
          icon="💰"
          gradient="success"
        >
          <div className="stat-value-large">₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </EnterpriseCard>
        
        <EnterpriseCard 
          title="Total Transactions"
          subtitle="All time"
          icon="📊"
          gradient="info"
        >
          <div className="stat-value-large">{totalElements}</div>
        </EnterpriseCard>

        {user?.role === 'ADMIN' && (
          <EnterpriseCard 
            title="System Status"
            subtitle="All systems operational"
            icon="✅"
            gradient="success"
          >
            <div className="stat-value-large">Active</div>
          </EnterpriseCard>
        )}
      </div>
      
      <div className="dashboard-content-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Your Accounts</h2>
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
                  className="account-card-enterprise"
                  hover
                >
                  <div className="account-header-enterprise">
                    <div className="account-icon-wrapper">
                      <span className="account-icon">💳</span>
                    </div>
                    <div className="account-info">
                      <h4>Account #{account.accountNumber}</h4>
                      <p className="account-type-badge">{account.type || 'SAVINGS'}</p>
                    </div>
                  </div>
                  <div className="account-details-enterprise">
                    <div className="account-balance-large">
                      ₹{account.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                    </div>
                    <div className="account-meta">
                      <span className="meta-item">Sort Code: {account.sortCode || 'N/A'}</span>
                    </div>
                  </div>
                </EnterpriseCard>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Recent Transactions</h2>
            {totalElements > 0 && (
              <span className="transaction-count">
                {totalElements} total transaction{totalElements !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {transactions.length === 0 ? (
            <div className="empty-state enterprise-empty-state-enhanced">
              <div className="empty-state-icon-large">📝</div>
              <h3 className="empty-state-title">No Transactions Yet</h3>
              <p className="empty-state-description">
                Your transaction history will appear here once you start making transactions.
                {accounts.length === 0 && ' First, you\'ll need an account to get started.'}
              </p>
              {accounts.length > 0 ? (
                <div className="empty-state-actions">
                  <Link to="/transactions" className="btn btn-primary">
                    Make Your First Transaction
                  </Link>
                  <p className="empty-state-hint">
                    Deposit, withdraw, or transfer funds to get started
                  </p>
                </div>
              ) : (
                <p className="empty-state-hint" style={{ marginTop: '1rem', color: 'var(--gray-500)' }}>
                  Contact your administrator to create an account
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="transactions-table-wrapper">
                <table className="enterprise-table transactions-table-enterprise">
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Account Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>
                          <div className="transaction-date">
                            {formatDate(transaction.createdAt)}
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-${transaction.type?.toLowerCase() === 'deposit' ? 'success' : transaction.type?.toLowerCase() === 'withdraw' ? 'error' : 'info'}`}>
                            {transaction.type || 'N/A'}
                          </span>
                        </td>
                        <td className="transaction-description">
                          {transaction.description || 'N/A'}
                        </td>
                        <td>
                          <span className={`amount-display ${transaction.type?.toLowerCase() === 'deposit' ? 'positive' : transaction.type?.toLowerCase() === 'withdraw' ? 'negative' : ''}`}>
                            {transaction.type?.toLowerCase() === 'deposit' ? '+' : transaction.type?.toLowerCase() === 'withdraw' ? '-' : ''}
                            ₹{transaction.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${transaction.status?.toLowerCase() === 'success' ? 'badge-success' : 'badge-error'}`}>
                            {transaction.status || 'N/A'}
                          </span>
                        </td>
                        <td className="account-details-cell">
                          {getAccountDisplay(transaction)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} transactions
                  </div>
                  <div className="pagination-controls">
                    <button
                      className="btn btn-outline"
                      onClick={() => handlePageChange(0)}
                      disabled={currentPage === 0}
                    >
                      First
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      Previous
                    </button>
                    <span className="pagination-page-info">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                      className="btn btn-outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1}
                    >
                      Next
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => handlePageChange(totalPages - 1)}
                      disabled={currentPage >= totalPages - 1}
                    >
                      Last
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
