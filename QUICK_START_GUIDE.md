# BitBank - Quick Start Guide

## 🚀 Project Overview

**BitBank** is an enterprise-level banking management system with React.js frontend and Spring Boot backend, featuring role-based access, transaction processing, and profile management.

---

## ⚡ Quick Start

### Backend Setup
```bash
# 1. Navigate to project root
cd AlllMyKnowl

# 2. Create MySQL database
CREATE DATABASE bitbank;

# 3. Update application.properties with database credentials

# 4. Build and run
mvn clean install
mvn spring-boot:run
```

**Backend runs on**: `http://localhost:8080`

### Frontend Setup
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

**Frontend runs on**: `http://localhost:3000`

---

## 👥 User Roles

### Customer (USER)
- View accounts and balances
- Perform transactions (deposit, withdraw, transfer)
- View transaction history
- Download PDF statements
- Request profile updates (requires admin approval)

### Admin (ADMIN)
- All customer features
- View all customers, accounts, transactions
- Approve/reject profile update requests
- Update account details
- Direct profile updates (no approval needed)

---

## 🔑 Default Login

**Note**: OTP is returned in API response (no SMTP server configured)

1. Go to `/login`
2. Enter email
3. Click "Get OTP"
4. Copy OTP from response/console
5. Enter OTP and login

---

## 📡 Key API Endpoints

### Authentication
- `POST /api/auth/otp` - Get OTP
- `POST /api/auth/login` - Login with OTP

### Transactions
- `POST /api/transaction/deposit` - Deposit money
- `POST /api/transaction/withdraw` - Withdraw money
- `POST /api/transaction/transfer` - Transfer money
- `GET /api/transactions/customer/{id}` - Get transactions

### Accounts
- `GET /api/account/all` - Get all accounts
- `GET /api/statements/account/{id}` - Download PDF

### Profile
- `POST /api/profile/update-request` - Request update
- `GET /api/profile/admin/pending-requests` - Get pending (Admin)

---

## 🎯 Main Features

✅ **Authentication**: OTP-based login  
✅ **Transactions**: Deposit, Withdraw, Transfer  
✅ **Statements**: PDF generation and download  
✅ **Profile Management**: Update requests with admin approval  
✅ **Dashboard**: Overview for customers and admins  
✅ **Role-based Access**: Separate views for Admin/Customer  
✅ **Enterprise UI**: Professional banking interface  

---

## 📁 Project Structure

```
AlllMyKnowl/
├── src/main/java/com/emp/ems/
│   ├── Controller/          # REST API endpoints
│   ├── Service/             # Business logic interfaces
│   ├── ServiceImpl/         # Business logic implementation
│   ├── Repositories/        # Data access layer
│   ├── entities/            # Database entities
│   └── dto/                 # Data transfer objects
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/        # React Context (Auth)
│   │   ├── services/       # API service layer
│   │   └── styles/         # CSS files
│   └── package.json
└── pom.xml                  # Maven configuration
```

---

## 🗄 Database Tables

1. **customers** - User information and authentication
2. **accounts** - Bank accounts
3. **transactions** - Transaction records
4. **profile_update_requests** - Profile update workflow

---

## 🎨 Frontend Pages

| Route | Component | Access |
|-------|-----------|--------|
| `/` | Home | Public |
| `/login` | Login | Public |
| `/dashboard` | Dashboard | Customer |
| `/accounts` | Accounts | Customer |
| `/transactions` | Transactions | Customer |
| `/statements` | Statements | Customer |
| `/profile` | Profile | Customer |
| `/admin/dashboard` | Admin Dashboard | Admin |

---

## 🔄 Key Workflows

### Transaction Flow
1. Select account
2. Enter amount
3. Submit transaction
4. System validates
5. Balance updated
6. Transaction recorded
7. Success message shown

### Profile Update Flow (Customer)
1. Edit profile fields
2. Submit update request
3. Status: PENDING
4. Admin reviews
5. Admin approves/rejects
6. If approved, profile updated

### Profile Update Flow (Admin)
1. Edit profile fields
2. Submit directly
3. Profile updated immediately

---

## 🛠 Technology Stack

**Backend**
- Spring Boot 3.x
- Java 17+
- MySQL
- Maven
- OpenPDF (for PDF generation)

**Frontend**
- React.js 18+
- React Router DOM
- Axios
- CSS Modules

---

## 📊 Key Statistics

- **Total API Endpoints**: 20
- **Total Frontend Pages**: 7
- **Database Tables**: 4
- **Transaction Types**: 3 (Deposit, Withdraw, Transfer)
- **Account Types**: 3 (Savings, Current, Fixed Deposit)
- **User Roles**: 2 (Admin, Customer)

---

## ✅ Testing Checklist

### Authentication
- [ ] OTP generation works
- [ ] Login succeeds with valid OTP
- [ ] Role-based redirection works

### Transactions
- [ ] Deposit adds to balance
- [ ] Withdraw deducts from balance
- [ ] Transfer moves money between accounts
- [ ] Balance validation works

### Profile
- [ ] Customer can request updates
- [ ] Admin can approve/reject
- [ ] Admin can update directly

### UI
- [ ] Responsive on mobile
- [ ] Loading states work
- [ ] Error messages display
- [ ] Forms validate correctly

---

## 🐛 Common Issues

### Backend won't start
- Check MySQL is running
- Verify database credentials in `application.properties`
- Check port 8080 is available

### Frontend won't start
- Run `npm install` to install dependencies
- Check Node.js version (16+)
- Verify port 3000 is available

### API calls fail
- Verify backend is running on port 8080
- Check CORS settings
- Verify authentication token/session

### Database errors
- Ensure MySQL is running
- Check database exists
- Verify connection credentials

---

## 📚 Documentation Files

1. **PROJECT_DOCUMENTATION.md** - Complete detailed documentation
2. **API_REFERENCE.md** - Quick API endpoint reference
3. **FEATURES_SUMMARY.md** - All features listed
4. **QUICK_START_GUIDE.md** - This file

---

## 🎯 Next Steps

1. **Setup**: Follow Quick Start instructions
2. **Test**: Use the testing checklist
3. **Review**: Check all documentation files
4. **Customize**: Modify as needed for your requirements

---

## 📞 Support

For detailed information, refer to:
- `PROJECT_DOCUMENTATION.md` - Full documentation
- `API_REFERENCE.md` - API details
- `FEATURES_SUMMARY.md` - Feature list

---

**Project**: BitBank Banking Management System  
**Version**: 1.0  
**Status**: Production Ready
