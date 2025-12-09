# BitBank - Banking Management System
## Complete Project Documentation

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Features](#features)
5. [API Documentation](#api-documentation)
6. [Database Schema](#database-schema)
7. [Authentication & Authorization](#authentication--authorization)
8. [Frontend Components](#frontend-components)
9. [Deployment Guide](#deployment-guide)
10. [Testing](#testing)

---

## 🎯 Project Overview

**BitBank** is a comprehensive enterprise-level banking management system built with React.js frontend and Java Spring Boot backend. The system provides secure banking operations including account management, transactions (deposit, withdraw, transfer), statement generation, and administrative controls with role-based access.

### Key Highlights
- **Enterprise-level UI/UX** inspired by JP Morgan Chase & Co.
- **Role-based access control** (Admin and Customer roles)
- **OTP-based authentication** system
- **Real-time transaction processing**
- **PDF statement generation**
- **Profile management with admin approval workflow**
- **Responsive design** for all devices

---

## 🛠 Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: MySQL
- **ORM**: Spring Data JPA
- **Build Tool**: Maven
- **PDF Generation**: OpenPDF (iText)
- **Security**: Spring Security (Session-based)

### Frontend
- **Framework**: React.js 18+
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: CSS Modules + CSS Variables
- **Build Tool**: npm/Node.js

---

## 🏗 System Architecture

### Backend Architecture
```
Controller Layer (REST APIs)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
Database (MySQL)
```

### Frontend Architecture
```
React Components
    ↓
Context API (AuthContext)
    ↓
API Service Layer (Axios)
    ↓
Backend REST APIs
```

---

## ✨ Features

### 1. Authentication & Security
- **OTP-based Login**: Secure authentication without SMTP server
- **Role-based Access**: Admin and Customer roles with different permissions
- **Session Management**: Secure session handling
- **Account Locking**: Protection against brute force attacks
- **Case-insensitive Role Checks**: Robust role validation

### 2. Customer Features
- **Dashboard**: Overview of accounts, balances, and recent transactions
- **Account Management**: View all accounts with balances
- **Transactions**:
  - Deposit funds
  - Withdraw funds
  - Transfer between accounts
- **Statements**: 
  - View transaction history with pagination
  - Download PDF statements
- **Profile Management**: 
  - View profile details
  - Request profile updates (requires admin approval)
  - View update request history

### 3. Admin Features
- **Admin Dashboard**: System overview with statistics
- **Customer Management**: View all customers and accounts
- **Profile Update Approval**: Review and approve/reject customer profile update requests
- **Transaction Monitoring**: View all system transactions
- **System Statistics**: Total customers, accounts, and transactions

### 4. UI/UX Features
- **Enterprise-level Design**: Professional banking interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Real-time Validation**: Form validation with instant feedback
- **Loading States**: Professional loading spinners
- **Error Handling**: User-friendly error messages
- **Animations**: Smooth transitions and hover effects
- **Homepage**: Marketing website with services and features

---

## 📡 API Documentation

### Base URL
```
http://localhost:8080
```

### Authentication Endpoints

#### 1. Request OTP
```http
POST /api/auth/otp
Content-Type: application/json

Request Body:
{
  "email": "user@example.com"
}

Response:
{
  "otp": "123456",
  "message": "OTP sent successfully"
}
```

#### 2. Verify OTP and Login
```http
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "otp": "123456"
}

Response:
{
  "customer": {
    "id": 1,
    "fullName": "John Doe",
    "email": "user@example.com",
    "role": "USER"
  },
  "message": "Login successful"
}
```

---

### Customer Endpoints

#### 3. Get Customer by ID
```http
GET /api/customer/{id}
Authorization: Required

Response:
{
  "id": 1,
  "fullName": "John Doe",
  "email": "user@example.com",
  "phoneNumber": "+1234567890",
  "address": "123 Main St",
  "role": "USER"
}
```

#### 4. Update Customer
```http
PUT /api/customer/{id}
Content-Type: application/json
Authorization: Required

Request Body:
{
  "fullName": "John Doe Updated",
  "email": "newemail@example.com",
  "phoneNumber": "+1234567890",
  "address": "456 New St"
}

Response: Customer object
```

#### 5. Get All Customers (Admin Only)
```http
GET /api/customer/all
Authorization: Required (Admin)

Response: Array of Customer objects
```

---

### Account Endpoints

#### 6. Get All Accounts
```http
GET /api/account/all
Authorization: Required

Response: Array of Account objects
[
  {
    "id": 1,
    "accountNumber": "ICICI0001",
    "sortCode": "ICIC-09-10",
    "type": "SAVINGS",
    "balance": 5000.00,
    "interestRate": 0.04,
    "customer": { ... }
  }
]
```

#### 7. Get Account by ID
```http
GET /api/account/{id}
Authorization: Required

Response: Account object
```

#### 8. Update Account (Admin Only)
```http
PUT /api/account/{id}
Content-Type: application/json
Authorization: Required (Admin)

Request Body:
{
  "type": "CURRENT",
  "interestRate": 0.05
}

Response: Updated Account object
```

---

### Transaction Endpoints

#### 9. Deposit
```http
POST /api/transaction/deposit
Content-Type: application/json
Authorization: Required

Request Body:
{
  "accountNumber": "ICICI0001",
  "amount": 1000.00
}

Response: true (Boolean)
```

#### 10. Withdraw
```http
POST /api/transaction/withdraw
Content-Type: application/json
Authorization: Required

Request Body:
{
  "accountNumber": "ICICI0001",
  "amount": 500.00
}

Response: true (Boolean)
```

#### 11. Transfer
```http
POST /api/transaction/transfer
Content-Type: application/json
Authorization: Required

Request Body:
{
  "fromAccount": "ICICI0001",
  "toAccount": "ICICI0002",
  "amount": 250.00
}

Response (Success):
{
  "success": true,
  "message": "Transfer completed successfully"
}

Response (Error):
{
  "error": "Invalid recipient account number. Account \"ICICI0003\" does not exist.",
  "message": "Invalid recipient account number. Account \"ICICI0003\" does not exist."
}
```

#### 12. Get Transactions by Customer
```http
GET /api/transactions/customer/{customerId}?page=0&size=10
Authorization: Required

Response:
{
  "content": [ ... ],
  "totalPages": 5,
  "totalElements": 50,
  "currentPage": 0,
  "pageSize": 10,
  "hasNext": true,
  "hasPrevious": false
}
```

#### 13. Get All Transactions (Admin Only)
```http
GET /api/transactions?page=0&size=10
Authorization: Required (Admin)

Response: Same paginated response as above
```

---

### Statement Endpoints

#### 14. Download PDF Statement
```http
GET /api/statements/account/{accountId}
Authorization: Required

Response: PDF file (application/pdf)
Content-Disposition: attachment; filename=statement_{id}.pdf
```

#### 15. Get Account Transactions (Paginated)
```http
GET /api/statements/account/{accountId}/transactions?page=0&size=10
Authorization: Required

Response: Paginated TransactionPageResponse
```

---

### Profile Update Endpoints

#### 16. Request Profile Update (Customer Only)
```http
POST /api/profile/update-request
Content-Type: application/json
Authorization: Required (Customer)

Request Body:
{
  "requestedFullName": "John Doe Updated",
  "requestedEmail": "newemail@example.com",
  "requestedPhoneNumber": "+1234567890",
  "requestedAddress": "456 New St"
}

Response:
{
  "id": 1,
  "customer": { ... },
  "requestedFullName": "John Doe Updated",
  "status": "PENDING",
  "requestedAt": "2024-01-15T10:30:00"
}
```

#### 17. Get My Profile Update Requests
```http
GET /api/profile/update-requests/{customerId}
Authorization: Required

Response: Array of ProfileUpdateRequest objects
```

#### 18. Get Pending Profile Requests (Admin Only)
```http
GET /api/profile/admin/pending-requests
Authorization: Required (Admin)

Response: Array of ProfileUpdateRequestDTO objects
```

#### 19. Approve Profile Request (Admin Only)
```http
POST /api/profile/admin/approve/{requestId}
Authorization: Required (Admin)

Response:
{
  "id": 1,
  "status": "APPROVED",
  "reviewedAt": "2024-01-15T11:00:00",
  "reviewedBy": "admin@example.com"
}
```

#### 20. Reject Profile Request (Admin Only)
```http
POST /api/profile/admin/reject/{requestId}
Authorization: Required (Admin)

Response:
{
  "id": 1,
  "status": "REJECTED",
  "reviewedAt": "2024-01-15T11:00:00",
  "reviewedBy": "admin@example.com"
}
```

---

## 🗄 Database Schema

### Tables

#### 1. customers
```sql
- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- full_name (VARCHAR)
- email (VARCHAR, UNIQUE)
- password (VARCHAR)
- phone_number (VARCHAR)
- address (VARCHAR)
- role (VARCHAR, DEFAULT 'USER')
- otp_code (VARCHAR)
- otp_expiry (DATETIME)
- failed_login_attempts (INT, DEFAULT 0)
- locked (BOOLEAN, DEFAULT FALSE)
- locked_until (DATETIME)
- created_at (DATETIME)
- updated_at (DATETIME)
```

#### 2. accounts
```sql
- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- account_number (VARCHAR, UNIQUE)
- sort_code (VARCHAR)
- type (ENUM: SAVINGS, CURRENT, FIXED_DEPOSIT)
- balance (DOUBLE)
- interest_rate (DOUBLE)
- customer_id (BIGINT, FOREIGN KEY -> customers.id)
- created_at (DATETIME)
- updated_at (DATETIME)
```

#### 3. transactions
```sql
- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- type (ENUM: DEPOSIT, WITHDRAW, TRANSFER)
- amount (DOUBLE)
- description (VARCHAR)
- status (VARCHAR, DEFAULT 'SUCCESS')
- from_account_id (BIGINT, FOREIGN KEY -> accounts.id, NULLABLE)
- to_account_id (BIGINT, FOREIGN KEY -> accounts.id, NULLABLE)
- created_at (DATETIME)
- updated_at (DATETIME)
```

#### 4. profile_update_requests
```sql
- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- customer_id (BIGINT, FOREIGN KEY -> customers.id)
- requested_full_name (VARCHAR)
- requested_email (VARCHAR)
- requested_phone_number (VARCHAR)
- requested_address (VARCHAR)
- status (ENUM: PENDING, APPROVED, REJECTED)
- requested_at (DATETIME)
- reviewed_at (DATETIME, NULLABLE)
- reviewed_by (VARCHAR, NULLABLE)
- created_at (DATETIME)
- updated_at (DATETIME)
```

---

## 🔐 Authentication & Authorization

### Authentication Flow
1. User enters email
2. System generates OTP (6-digit code)
3. OTP is returned in response (no SMTP server)
4. User enters OTP
5. System validates OTP and creates session
6. User is redirected based on role:
   - **ADMIN** → `/admin/dashboard`
   - **USER** → `/dashboard`

### Authorization Rules
- **Customer Routes**: `/dashboard`, `/accounts`, `/transactions`, `/statements`, `/profile`
  - Accessible only to customers
  - Admins are automatically redirected to admin dashboard
  
- **Admin Routes**: `/admin/dashboard`
  - Accessible only to admins
  - Customers are redirected to customer dashboard

### Role-Based Features
- **Customers**:
  - Can only view their own accounts and transactions
  - Can perform transactions on their accounts
  - Must request profile updates (admin approval required)
  
- **Admins**:
  - Can view all customers, accounts, and transactions
  - Can update accounts directly
  - Can update their own profile directly (no approval needed)
  - Can approve/reject customer profile update requests

---

## 🎨 Frontend Components

### Core Components

#### 1. **Home.js**
- Landing page with marketing content
- Services showcase
- Navigation to login
- Enterprise-level design

#### 2. **Login.js**
- OTP-based authentication form
- Enterprise-level UI with bank background
- Role-based redirection
- Error handling

#### 3. **Dashboard.js** (Customer)
- Account overview cards
- Recent transactions table
- Total balance display
- Pagination for transactions

#### 4. **Accounts.js**
- List of all customer accounts
- Account details (number, type, balance)
- Card-based layout

#### 5. **Transactions.js**
- Transaction form (Deposit/Withdraw/Transfer)
- Tab-based interface
- Real-time validation
- Success/error messages

#### 6. **Statements.js**
- Account selection dropdown
- Transaction list with pagination
- PDF download functionality
- Date filtering

#### 7. **Profile.js**
- View profile information
- Edit profile (different flows for admin/customer)
- Profile update request history
- Admin approval workflow display

### Admin Components

#### 8. **AdminDashboard.js**
- System statistics
- Pending profile update requests
- Customer and account overview
- Quick action cards

### Common Components

#### 9. **LoadingSpinner.js**
- Reusable loading indicator
- Multiple sizes (sm, md, lg)
- Full-screen option

#### 10. **EnterpriseCard.js**
- Reusable card component
- Gradient options
- Icon support
- Hover effects

#### 11. **ProtectedRoute.js**
- Route protection based on authentication
- Role-based access control
- Automatic redirection

---

## 🚀 Deployment Guide

### Backend Deployment

1. **Prerequisites**
   ```bash
   - Java 17 or higher
   - Maven 3.6+
   - MySQL 8.0+
   ```

2. **Database Setup**
   ```sql
   CREATE DATABASE bitbank;
   ```

3. **Configuration**
   - Update `application.properties`:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/bitbank
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     ```

4. **Build & Run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

5. **Access**
   - Backend runs on: `http://localhost:8080`

### Frontend Deployment

1. **Prerequisites**
   ```bash
   - Node.js 16+
   - npm 8+
   ```

2. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Configuration**
   - Update API base URL in `apiService.js` if needed:
     ```javascript
     const API_BASE_URL = 'http://localhost:8080';
     ```

4. **Build & Run**
   ```bash
   npm start  # Development
   npm run build  # Production build
   ```

5. **Access**
   - Frontend runs on: `http://localhost:3000`

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] OTP generation works
- [ ] Login with valid OTP succeeds
- [ ] Login with invalid OTP fails
- [ ] Role-based redirection works

#### Customer Features
- [ ] Dashboard displays correct data
- [ ] Account list shows all customer accounts
- [ ] Deposit transaction works
- [ ] Withdraw transaction works (with balance check)
- [ ] Transfer transaction works (with validation)
- [ ] Statement download generates PDF
- [ ] Profile update request is created
- [ ] Transaction history shows all types

#### Admin Features
- [ ] Admin dashboard loads correctly
- [ ] All customers are visible
- [ ] Profile update requests are listed
- [ ] Approve/reject profile requests works
- [ ] Admin can update own profile directly

#### UI/UX
- [ ] Responsive design works on mobile
- [ ] Loading states display correctly
- [ ] Error messages are user-friendly
- [ ] Animations are smooth
- [ ] Forms validate correctly

---

## 📊 Key Functionalities

### 1. Transaction Processing
- **Deposit**: Adds amount to account balance, creates transaction record
- **Withdraw**: Deducts amount from account balance (with validation), creates transaction record
- **Transfer**: Moves amount between two accounts, creates transaction record for both accounts
- All transactions are **atomic** (using `@Transactional`)
- Balance validation before withdrawals and transfers

### 2. Statement Generation
- Generates PDF using OpenPDF library
- Includes account information
- Lists all transactions in table format
- Professional formatting with BitBank branding
- Downloadable as PDF file

### 3. Profile Update Workflow
- **Customer Flow**:
  1. Customer requests profile update
  2. Request is saved with status "PENDING"
  3. Admin reviews request
  4. Admin approves/rejects
  5. If approved, customer profile is updated
  
- **Admin Flow**:
  1. Admin updates profile directly
  2. Changes are applied immediately
  3. No approval required

### 4. Pagination
- All list endpoints support pagination
- Frontend implements pagination controls
- Page size configurable (default: 10 items per page)
- Shows total count and current page info

### 5. Error Handling
- Backend returns structured error responses
- Frontend displays user-friendly error messages
- Validation errors shown inline
- Network errors handled gracefully

---

## 🔧 Configuration

### Backend Configuration
- **Port**: 8080 (configurable in `application.properties`)
- **CORS**: Enabled for all origins (`@CrossOrigin("*")`)
- **Database**: MySQL (configurable connection)

### Frontend Configuration
- **Port**: 3000 (default React port)
- **API Base URL**: `http://localhost:8080`
- **Routing**: React Router DOM

---

## 📝 Notes

### Security Considerations
- OTP is currently returned in response (no SMTP server)
- In production, implement proper OTP delivery via SMS/Email
- Add JWT tokens for stateless authentication
- Implement rate limiting for API endpoints
- Add input sanitization and validation

### Future Enhancements
- Email/SMS integration for OTP
- JWT-based authentication
- Two-factor authentication
- Transaction scheduling
- Interest calculation automation
- Mobile app support
- Advanced reporting and analytics

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting guide
2. Review API documentation
3. Check console logs for errors
4. Verify database connectivity
5. Ensure all dependencies are installed

---

## 📄 License

This project is developed for educational/demonstration purposes.

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Project Name**: BitBank Banking Management System
