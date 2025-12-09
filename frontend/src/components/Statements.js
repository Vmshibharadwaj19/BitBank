import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { accountAPI, statementAPI, transactionAPI } from '../services/apiService';
import LoadingSpinner from './common/LoadingSpinner';
import '../styles/enterprise-design-system.css';
import './Statements.css';

const Statements = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState('');
  const [warning, setWarning] = useState('');
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
      fetchAccounts();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin && selectedAccount) {
      fetchTransactions(selectedAccount, 0);
    } else if (!isAdmin && !selectedAccount) {
      setTransactions([]);
    }
  }, [selectedAccount, isAdmin]);

  const fetchAccounts = async () => {
    try {
      const response = await accountAPI.getAll();
      const allAccounts = response.data;
      const userAccounts = user?.role === 'ADMIN' 
        ? allAccounts 
        : allAccounts.filter(acc => acc.customer?.id === user?.id);
      setAccounts(userAccounts);
    } catch (err) {
      console.error('Failed to load accounts:', err);
      // Don't show error message - just log it
    }
  };

  const fetchTransactions = async (accountId, page) => {
    try {
      setTransactionsLoading(true);
      const response = await transactionAPI.getByAccount(accountId, page, pageSize);
      const data = response.data;
      setTransactions(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setCurrentPage(data.currentPage || 0);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setTransactions([]);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handleDownload = async () => {
    // Clear previous messages
    setDownloadError('');
    setDownloadSuccess('');
    setWarning('');

    if (!selectedAccount) {
      setWarning('Please select an account to download the statement.');
      return;
    }

    setLoading(true);

    try {
      const blob = await statementAPI.downloadStatement(selectedAccount);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `statement_${selectedAccount}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setDownloadSuccess('Your account statement has been downloaded successfully!');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setDownloadSuccess('');
      }, 5000);
    } catch (err) {
      setDownloadError('Failed to download statement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchTransactions(selectedAccount, newPage);
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

  // Don't render if admin (will redirect)
  if (isAdmin) {
    return <LoadingSpinner size="lg" text="Redirecting..." fullScreen />;
  }

  return (
    <div className="statements-page enterprise-page">
      <div className="page-header">
        <h1>Account Statements</h1>
        <p className="page-subtitle">Download PDF statements and view transaction history</p>
      </div>
      
      <div className="statements-layout">
        <div className="statement-card-container">
          <div className="statement-container">
            <div className="form-group">
              <label>Select Account</label>
              <select
                value={selectedAccount}
                onChange={(e) => {
                  setSelectedAccount(e.target.value);
                  setDownloadError('');
                  setDownloadSuccess('');
                  setWarning('');
                }}
                className="account-select enterprise-input"
              >
                <option value="">Choose an account</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    Account #{acc.accountNumber} - {acc.type || 'N/A'} - ₹{acc.balance?.toFixed(2) || '0.00'}
                  </option>
                ))}
              </select>
            </div>

            {downloadError && (
              <div className="alert alert-error">
                <strong>Error!</strong> {downloadError}
              </div>
            )}
            {downloadSuccess && (
              <div className="alert alert-success">
                <strong>Success!</strong> {downloadSuccess}
              </div>
            )}
            {warning && (
              <div className="alert alert-warning">
                <strong>Warning!</strong> {warning}
              </div>
            )}

            <button
              onClick={handleDownload}
              disabled={loading || !selectedAccount}
              className="download-btn btn btn-primary"
            >
              {loading ? 'Generating PDF...' : 'Download Statement (PDF)'}
            </button>

            <div className="info-box alert alert-info">
              <p>
                <strong>Note:</strong> The statement will be downloaded as a PDF file containing
                all transactions for the selected account.
              </p>
            </div>
          </div>
        </div>

        <div className="transactions-list-container">
          <div className="transactions-list-header">
            <h2>Transaction History</h2>
            {selectedAccount && (
              <span className="transaction-count">
                {totalElements} transaction{totalElements !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {!selectedAccount ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3 className="empty-state-title">Select an Account</h3>
              <p className="empty-state-description">
                Please select an account from the left to view its transaction history.
              </p>
            </div>
          ) : transactionsLoading ? (
            <div className="loading-container">
              <div className="spinner spinner-md"></div>
              <p>Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3 className="empty-state-title">No Transactions Found</h3>
              <p className="empty-state-description">
                This account has no transactions yet.
              </p>
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

export default Statements;
