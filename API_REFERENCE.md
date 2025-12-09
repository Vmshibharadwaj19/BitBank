# BitBank API Reference Guide

## Quick API Endpoint Reference

### Authentication APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/api/auth/otp` | Request OTP for login | No |
| POST | `/api/auth/login` | Verify OTP and login | No |

### Customer APIs

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|--------------|------|
| GET | `/api/customer/{id}` | Get customer by ID | Yes | Any |
| PUT | `/api/customer/{id}` | Update customer | Yes | Admin (direct) / Customer (via request) |
| GET | `/api/customer/all` | Get all customers | Yes | Admin |

### Account APIs

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|--------------|------|
| GET | `/api/account/all` | Get all accounts | Yes | Any |
| GET | `/api/account/{id}` | Get account by ID | Yes | Any |
| PUT | `/api/account/{id}` | Update account | Yes | Admin |

### Transaction APIs

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|--------------|------|
| POST | `/api/transaction/deposit` | Deposit money | Yes | Customer |
| POST | `/api/transaction/withdraw` | Withdraw money | Yes | Customer |
| POST | `/api/transaction/transfer` | Transfer money | Yes | Customer |
| GET | `/api/transactions/customer/{customerId}` | Get customer transactions | Yes | Customer/Admin |
| GET | `/api/transactions` | Get all transactions | Yes | Admin |

### Statement APIs

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|--------------|------|
| GET | `/api/statements/account/{id}` | Download PDF statement | Yes | Customer |
| GET | `/api/statements/account/{id}/transactions` | Get account transactions | Yes | Customer |

### Profile Update APIs

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|--------------|------|
| POST | `/api/profile/update-request` | Request profile update | Yes | Customer |
| GET | `/api/profile/update-requests/{customerId}` | Get my requests | Yes | Customer |
| GET | `/api/profile/admin/pending-requests` | Get pending requests | Yes | Admin |
| POST | `/api/profile/admin/approve/{requestId}` | Approve request | Yes | Admin |
| POST | `/api/profile/admin/reject/{requestId}` | Reject request | Yes | Admin |

---

## Request/Response Examples

### Deposit Transaction
```http
POST /api/transaction/deposit
Content-Type: application/json

{
  "accountNumber": "ICICI0001",
  "amount": 1000.00
}

Response: true
```

### Transfer Transaction
```http
POST /api/transaction/transfer
Content-Type: application/json

{
  "fromAccount": "ICICI0001",
  "toAccount": "ICICI0002",
  "amount": 500.00
}

Success Response:
{
  "success": true,
  "message": "Transfer completed successfully"
}

Error Response:
{
  "error": "Invalid recipient account number. Account \"ICICI0003\" does not exist.",
  "message": "Invalid recipient account number. Account \"ICICI0003\" does not exist."
}
```

### Get Paginated Transactions
```http
GET /api/transactions/customer/1?page=0&size=10

Response:
{
  "content": [
    {
      "id": 1,
      "type": "DEPOSIT",
      "amount": 1000.00,
      "description": "Deposit into ICICI0001",
      "status": "SUCCESS",
      "createdAt": "2024-01-15T10:30:00"
    }
  ],
  "totalPages": 5,
  "totalElements": 50,
  "currentPage": 0,
  "pageSize": 10,
  "hasNext": true,
  "hasPrevious": false
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request (validation error, invalid data) |
| 401 | Unauthorized (authentication required) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found (resource doesn't exist) |
| 500 | Internal Server Error |

---

## Common Error Responses

### Invalid Account Number
```json
{
  "error": "Invalid recipient account number. Account \"ICICI0003\" does not exist.",
  "message": "Invalid recipient account number. Account \"ICICI0003\" does not exist."
}
```

### Insufficient Balance
```json
{
  "error": "Insufficient balance. Your account balance is ₹500.00.",
  "message": "Insufficient balance. Your account balance is ₹500.00."
}
```

### Validation Error
```json
{
  "error": "Transfer amount must be greater than 0.",
  "message": "Transfer amount must be greater than 0."
}
```

---

## Pagination Parameters

All list endpoints support pagination:

- `page` (default: 0) - Page number (0-indexed)
- `size` (default: 10) - Number of items per page

Example: `/api/transactions?page=2&size=20`

---

## Data Models

### Account
```json
{
  "id": 1,
  "accountNumber": "ICICI0001",
  "sortCode": "ICIC-09-10",
  "type": "SAVINGS",
  "balance": 5000.00,
  "interestRate": 0.04,
  "customer": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

### Transaction
```json
{
  "id": 1,
  "type": "TRANSFER",
  "amount": 250.00,
  "description": "Transfer from ICICI0001 to ICICI0002",
  "status": "SUCCESS",
  "fromAccount": {
    "id": 1,
    "accountNumber": "ICICI0001"
  },
  "toAccount": {
    "id": 2,
    "accountNumber": "ICICI0002"
  },
  "createdAt": "2024-01-15T10:30:00"
}
```

### Profile Update Request
```json
{
  "id": 1,
  "customer": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com"
  },
  "requestedFullName": "John Doe Updated",
  "requestedEmail": "newemail@example.com",
  "status": "PENDING",
  "requestedAt": "2024-01-15T10:30:00"
}
```

---

## Notes

- All endpoints require authentication except OTP request
- Admin endpoints require ADMIN role
- Account numbers are case-sensitive and should be trimmed
- Amounts must be positive numbers
- Dates are in ISO 8601 format (YYYY-MM-DDTHH:mm:ss)
