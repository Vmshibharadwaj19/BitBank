# BitBank — Banking Management System 💳🏦

[![Java version](https://img.shields.io/badge/Java-17+-blue)](https://www.oracle.com/java/)  
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)](https://spring.io/projects/spring-boot)  
[![React](https://img.shields.io/badge/React-18+-cyan)](https://reactjs.org/)  
[![MySQL](https://img.shields.io/badge/MySQL-8+-blue)](https://www.mysql.com/)  

**BitBank** is a full-stack banking management system built with a Spring Boot backend and React frontend. It supports customer and admin roles, secure authentication, real-time transactions, PDF statement generation, and a polished enterprise-style UI.  

---

## 📚 Documentation & Guides  

| Document | Description |
|---------|-------------|
| [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) | Full detailed project documentation |
| [API_REFERENCE.md](./API_REFERENCE.md) | Complete API reference — endpoints, request/response formats, error codes |
| [FEATURES_SUMMARY.md](./FEATURES_SUMMARY.md) | Summary of all system and UI features |
| [QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md) | Quick start instructions — setup & run backend + frontend |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Common issues & debugging tips |
| [AUTHENTICATION_FIXES.md](./AUTHENTICATION_FIXES.md) | Notes & fixes related to authentication module |
| [CUSTOMER_SERVICE_FIXES.md](./CUSTOMER_SERVICE_FIXES.md) | Fixes and updates in customer service logic |
| [TRANSACTION_FIXES_SUMMARY.md](./TRANSACTION_FIXES_SUMMARY.md) | Transaction logic fixes & improvements |
| [VALIDATION_AND_FIXES_SUMMARY.md](./VALIDATION_AND_FIXES_SUMMARY.md) | Input validation and bug fixes summary |
| [ENTERPRISE_UI_IMPLEMENTATION.md](./ENTERPRISE_UI_IMPLEMENTATION.md) | Implementation details of enterprise-style UI components |
| [ENTERPRISE_UI_SUMMARY.md](./ENTERPRISE_UI_SUMMARY.md) | Summary of UI/UX design decisions and features |
| [FRONTEND_FIXES_SUMMARY.md](./FRONTEND_FIXES_SUMMARY.md) | Frontend fixes and improvements archive |
| [PROFILE_UPDATE_FEATURE_SUMMARY.md](./PROFILE_UPDATE_FEATURE_SUMMARY.md) | Details about profile-update workflow and logic |
| [ADMIN_ROLE_FIX.md](./ADMIN_ROLE_FIX.md) | Notes on admin-role fixes and access control |
| [ADMIN_REDIRECT_DEBUG.md](./ADMIN_REDIRECT_DEBUG.md) | Debug and redirect logic for admin/user roles |
| [START_APPLICATION.md](./START_APPLICATION.md) | Step-by-step instructions to start the application |
| [FINAL_FIXES_SUMMARY.md](./FINAL_FIXES_SUMMARY.md) | Final adjustments and cleanup summary |

---

## 🚀 Quick Start (Backend + Frontend)

```bash
# Backend setup
cd <project-root>
CREATE DATABASE bitbank;
# Update application.properties with your DB credentials
mvn clean install
mvn spring-boot:run
# Backend runs at http://localhost:8080

# Frontend setup
cd frontend
npm install
npm start
# Frontend runs at http://localhost:3000
For full setup instructions, refer to the QUICK_START_GUIDE.md.

🛠 Tech Stack
Backend: Spring Boot 3.x, Java 17+, MySQL, Spring Data JPA, OpenPDF, Maven

Frontend: React 18+, React Router DOM v6, Axios, CSS Modules

Database: MySQL 8.x

Security: Session-based authentication, OTP login, Role-based access

🎯 Key Features
OTP-based login and secure session management

Role-based access control: Customer and Admin

Account management (Savings, Current, Fixed Deposit) with balance tracking & interest rate configuration

Full CRUD for customers and accounts (with business logic and validations)

Deposit / Withdraw / Transfer transactions with validation and atomic updates

Transaction history with pagination

PDF statement generation for accounts

Profile-update workflow: customer requests → admin approval → update

Admin dashboard: view all customers, accounts, transactions, pending profile requests

Enterprise-style UI: polished design, responsiveness, reusable components, error handling, notifications, loading states

See FEATURES_SUMMARY.md for the full list.

📂 Project Structure
bash
Copy code
BitBank/
├── backend/             # Spring Boot application
│   ├── src/main/java/   # Controllers, Services, Repositories, Entities, DTOs
│   ├── resources/       # application.properties, assets
│   └── pom.xml          # Maven configuration
└── frontend/            # React application
    ├── src/
    │   ├── components/  # UI components
    │   ├── context/     # Authentication context
    │   ├── services/    # API call abstractions (Axios)
    │   └── styles/      # CSS Modules
    └── package.json     # npm configuration
📄 License
This project is for educational and demonstration purposes only. See LICENSE for more details (if applicable).

🧰 Contributing & Feedback
Feedback, bug reports, and pull requests are welcome.
Before contributing, please check the open issues and make sure to follow the existing code style and documentation format.

👤 Author
Vmshibharadwaj19 — Full-Stack Developer

