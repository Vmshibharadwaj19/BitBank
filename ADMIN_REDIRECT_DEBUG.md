# Admin Redirect Debug Guide

## Issue
Admins are being redirected to customer dashboard instead of admin dashboard.

## Changes Made

### 1. Case-Insensitive Role Comparison
- Updated `AuthContext.js` to use `user?.role?.toUpperCase() === 'ADMIN'` for case-insensitive comparison
- Updated `Login.js` to use case-insensitive role check

### 2. Debug Logging Added
- Added console logs in:
  - `App.js` - Logs user, role, and isAdmin status
  - `ProtectedRoute.js` - Logs authentication and role checks
  - `Login.js` - Logs role during login

### 3. Route Protection
- `/admin/dashboard` requires `requiredRole="ADMIN"`
- All customer routes (`/dashboard`, `/accounts`, `/transactions`, `/statements`) redirect admins to `/admin/dashboard`

## How to Debug

1. **Check Browser Console**
   - After login, check console for:
     - "Login - User role: ..."
     - "AppRoutes - User role: ..."
     - "ProtectedRoute - User role: ..."

2. **Verify Role in Database**
   - Check the `customers` table
   - Ensure the role column is set to `'ADMIN'` (uppercase) for admin users
   - Default is `'USER'`

3. **Check localStorage**
   - Open browser DevTools > Application > Local Storage
   - Check the `user` key
   - Verify it contains: `{"role": "ADMIN", ...}`

4. **Test Admin Login**
   - Login with an admin account
   - Check console logs
   - Should redirect to `/admin/dashboard`

## Common Issues

1. **Role not set correctly in database**
   - Solution: Update the customer's role to 'ADMIN' in the database

2. **Role is lowercase 'admin'**
   - Solution: The code now handles this with `.toUpperCase()`

3. **User object missing role property**
   - Solution: Check backend response includes role field

4. **Timing issue with state update**
   - Solution: The redirect happens after login() sets the user state

## Files Modified

- `frontend/src/context/AuthContext.js` - Case-insensitive role check
- `frontend/src/components/Login.js` - Case-insensitive role check + debug logs
- `frontend/src/App.js` - Debug logging
- `frontend/src/components/ProtectedRoute.js` - Debug logging
