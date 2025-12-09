import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { accountAPI, transactionAPI } from '../services/apiService';
import LoadingSpinner from './common/LoadingSpinner';
import '../styles/enterprise-design-system.css';
import './Transactions.css';

const Transactions = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [transactionType, setTransactionType] = useState('deposit');
  const [formData, setFormData] = useState({
    accountNumber: '',
    amount: '',
    toAccount: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [toAccountError, setToAccountError] = useState('');

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
      const response = await accountAPI.getAll();
      const allAccounts = response.data;
      const userAccounts = user?.role === 'ADMIN' 
        ? allAccounts 
        : allAccounts.filter(acc => acc.customer?.id === user?.id);
      setAccounts(userAccounts);
    } catch (err) {
      console.error('Failed to load accounts:', err);
    }
  };


  const validateForm = () => {
    // Clear previous messages
    setError('');
    setWarning('');
    setMessage('');

    // Validate account selection
    if (!formData.accountNumber || formData.accountNumber.trim() === '') {
      setError('Please select an account to proceed.');
      return false;
    }

    // Validate amount
    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return false;
    }

    // Validate minimum amount
    if (amount < 0.01) {
      setError('Minimum transaction amount is ₹0.01.');
      return false;
    }

    // For transfer, validate toAccount
    if (transactionType === 'transfer') {
      if (!formData.toAccount || formData.toAccount.trim() === '') {
        setToAccountError('Please enter a recipient account number.');
        setError(''); // Clear general error to avoid duplicate
        return false;
      }

      // Check if transferring to same account
      if (formData.accountNumber === formData.toAccount) {
        setToAccountError('Cannot transfer to the same account.');
        setError(''); // Clear general error to avoid duplicate
        return false;
      }

      // Note: Account existence validation is handled by the backend
      // to ensure we check against ALL accounts in the database,
      // not just the current user's accounts
    }

    // For withdraw, check balance
    if (transactionType === 'withdraw') {
      const selectedAccount = accounts.find(acc => acc.accountNumber === formData.accountNumber);
      if (selectedAccount && amount > selectedAccount.balance) {
        setError(`Insufficient balance. Your account balance is ₹${selectedAccount.balance.toFixed(2)}.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError('');
    setWarning('');
    setMessage('');

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Trim account numbers to ensure no whitespace issues
      const accountNumber = formData.accountNumber.trim();
      const toAccount = transactionType === 'transfer' ? formData.toAccount.trim() : null;
      
      let response;
      if (transactionType === 'deposit') {
        response = await transactionAPI.deposit(
          accountNumber,
          parseFloat(formData.amount)
        );
      } else if (transactionType === 'withdraw') {
        response = await transactionAPI.withdraw(
          accountNumber,
          parseFloat(formData.amount)
        );
      } else if (transactionType === 'transfer') {
        response = await transactionAPI.transfer(
          accountNumber,
          toAccount,
          parseFloat(formData.amount)
        );
      }

      if (response.data) {
        setMessage(`${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)} of ₹${parseFloat(formData.amount).toFixed(2)} completed successfully!`);
        setFormData({ accountNumber: '', amount: '', toAccount: '' });
        fetchAccounts(); // Refresh accounts to show updated balance
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setMessage('');
        }, 5000);
      }
    } catch (err) {
      let errorMsg = 'Transaction failed';
      
      // Check for specific error messages from backend
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.error) {
          errorMsg = err.response.data.error;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      // For transfer failures, provide more specific error messages
      if (transactionType === 'transfer') {
        // Check if it's an invalid recipient account number error - show only in toAccountError
        if (err.response?.data?.error && err.response.data.error.includes('Invalid recipient account number')) {
          setToAccountError(err.response.data.error);
          setError(''); // Clear general error to avoid duplicate
          return; // Don't set general error for recipient account errors
        } else {
          // For all other transfer errors, show in general error and clear toAccountError
          if (err.response?.data?.error && err.response.data.error.includes('Invalid sender account number')) {
            errorMsg = err.response.data.error;
          } else if (!err.response?.data) {
            // If backend returns false (transaction failed), check common reasons
            errorMsg = 'Transfer failed. Please verify that the recipient account number is valid and you have sufficient balance.';
          } else {
            // Use the error message from backend
            errorMsg = err.response.data.error || err.response.data.message || errorMsg;
          }
          setToAccountError(''); // Clear toAccountError for non-recipient errors
        }
      } else {
        // For non-transfer errors, clear toAccountError
        setToAccountError('');
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  // Don't render if admin (will redirect)
  if (isAdmin) {
    return <LoadingSpinner size="lg" text="Redirecting..." fullScreen />;
  }

  return (
    <div className="transactions-page enterprise-page">
      <div className="page-header">
        <h1>Transactions</h1>
        <p className="page-subtitle">Perform deposit, withdraw, and transfer transactions</p>
      </div>
      
      <div className="transaction-tabs">
        <button
          className={transactionType === 'deposit' ? 'active' : ''}
          onClick={() => {
            setTransactionType('deposit');
            setFormData({ accountNumber: '', amount: '', toAccount: '' });
            setMessage('');
            setError('');
            setWarning('');
          }}
        >
          Deposit
        </button>
        <button
          className={transactionType === 'withdraw' ? 'active' : ''}
          onClick={() => {
            setTransactionType('withdraw');
            setFormData({ accountNumber: '', amount: '', toAccount: '' });
            setMessage('');
            setError('');
            setWarning('');
          }}
        >
          Withdraw
        </button>
        <button
          className={transactionType === 'transfer' ? 'active' : ''}
          onClick={() => {
            setTransactionType('transfer');
            setFormData({ accountNumber: '', amount: '', toAccount: '' });
            setMessage('');
            setError('');
            setWarning('');
            setToAccountError('');
          }}
        >
          Transfer
        </button>
      </div>

      <div className="transaction-form-container">
        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-group">
            <label>
              {transactionType === 'transfer' ? 'From Account' : 'Account Number'}
            </label>
            <select
              value={formData.accountNumber}
              onChange={(e) =>
                setFormData({ ...formData, accountNumber: e.target.value })
              }
              required
              className="enterprise-input"
            >
              <option value="">Select Account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.accountNumber}>
                  {acc.accountNumber} - ₹{acc.balance?.toFixed(2) || '0.00'}
                </option>
              ))}
            </select>
          </div>

          {transactionType === 'transfer' && (
            <div className="form-group">
              <label>To Account</label>
              <input
                type="text"
                value={formData.toAccount}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, toAccount: value });
                  
                  // Real-time validation
                  setToAccountError('');
                  setError(''); // Clear general error when typing
                  if (value.trim() !== '') {
                    // Check if transferring to same account
                    if (formData.accountNumber === value.trim()) {
                      setToAccountError('Cannot transfer to the same account.');
                    } else {
                      // Note: We can't check if account exists in real-time since
                      // non-admin users only see their own accounts. Backend will validate.
                      setToAccountError(''); // Clear error if valid format
                    }
                  }
                }}
                onBlur={() => {
                  // Validate on blur
                  if (formData.toAccount.trim() !== '') {
                    if (formData.accountNumber === formData.toAccount.trim()) {
                      setToAccountError('Cannot transfer to the same account.');
                    } else {
                      setToAccountError(''); // Backend will validate account existence
                    }
                  }
                }}
                required
                placeholder="Enter recipient account number"
                className={`enterprise-input ${toAccountError ? 'input-error' : ''}`}
              />
              {toAccountError && (
                <div className="alert alert-error" style={{ marginTop: '0.5rem', padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                  <strong>Error!</strong> {toAccountError}
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
              min="0.01"
              step="0.01"
              placeholder="Enter amount"
              className="enterprise-input"
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

          <button type="submit" disabled={loading} className="submit-btn btn btn-primary">
            {loading ? 'Processing...' : `Execute ${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Transactions;
