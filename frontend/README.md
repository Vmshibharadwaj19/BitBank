# AlllMyKnowl Frontend - React Banking Application

A React.js frontend application with role-based access control integrated with Spring Boot backend.

## Features

- **OTP-based Authentication**: Secure login using OTP verification
- **Role-based Access Control**: Separate dashboards for Admin and Customer roles
- **Account Management**: View and manage bank accounts
- **Transaction Operations**: Deposit, Withdraw, and Transfer funds
- **Statement Downloads**: Download account statements as PDF
- **Admin Panel**: Manage customers, lock/unlock accounts

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will run on `http://localhost:3000`

## Configuration

Update the API base URL in `src/config/axiosConfig.js` if your backend runs on a different port:

```javascript
const API_BASE_URL = 'http://localhost:8080'; // Change if needed
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.js
│   │   │   └── ManageCustomers.js
│   │   ├── Accounts.js
│   │   ├── Dashboard.js
│   │   ├── Layout.js
│   │   ├── Login.js
│   │   ├── Statements.js
│   │   └── Transactions.js
│   ├── config/
│   │   └── axiosConfig.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── services/
│   │   ├── apiService.js
│   │   └── authService.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## API Integration

All API calls are made through Axios with:
- Automatic token injection (if implemented in backend)
- Error handling and interceptors
- Base URL configuration

## Roles

- **ADMIN**: Full access to all features including customer management
- **USER/CUSTOMER**: Access to own accounts, transactions, and statements

## Routes

- `/login` - Login page
- `/dashboard` - Customer dashboard
- `/accounts` - View accounts
- `/transactions` - Perform transactions
- `/statements` - Download statements
- `/admin/dashboard` - Admin dashboard
- `/admin/customers` - Manage customers (Admin only)

## Notes

- The backend currently returns a stub token. Update authentication flow when JWT is implemented.
- Ensure CORS is enabled on the backend (already configured with `@CrossOrigin("*")`).
- The application assumes the backend runs on `http://localhost:8080`.
