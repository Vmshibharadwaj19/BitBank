import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="nav-brand">
            <h2>BitBank</h2>
          </div>
          <div className="nav-links">
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard">Admin Dashboard</Link>
                <Link to="/admin/customers">Manage Customers</Link>
                <Link to="/profile">My Profile</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/accounts">My Accounts</Link>
                <Link to="/transactions">Transactions</Link>
                <Link to="/statements">Statements</Link>
                <Link to="/profile">My Profile</Link>
              </>
            )}
          </div>
          <div className="nav-user">
            <span>Welcome, {user?.fullName || user?.email}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
