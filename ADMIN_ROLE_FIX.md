# Admin Role and Dashboard Access Fix

## Issue
Admins are being redirected to customer dashboard instead of admin dashboard.

## Root Causes

1. **Default Role is "USER"**: In `Customer.java`, the default role is `"USER"`. Admin users must have their role explicitly set to `"ADMIN"` in the database.

2. **State Update Timing**: React state updates are asynchronous. When `login()` is called, the `isAdmin` value might not be immediately available.

3. **Route Protection**: The `/admin/dashboard` route requires `requiredRole="ADMIN"`, but if `isAdmin` is false, it redirects to `/dashboard`.

## Solutions Applied

### 1. Case-Insensitive Role Check
- Updated `AuthContext.js` to use `user?.role?.toUpperCase() === 'ADMIN'`
- This handles cases where role might be "admin", "Admin", or "ADMIN"

### 2. Delayed Navigation
- Added `setTimeout` in `Login.js` to ensure state is updated before navigation
- Gives React time to update the `isAdmin` value

### 3. Route-Level Protection
- Added explicit `isAdmin` check in `/admin/dashboard` route
- Double protection: ProtectedRoute + route-level check

### 4. Debug Logging
- Added console logs to track:
  - User role during login
  - isAdmin status in AppRoutes
  - Role checks in ProtectedRoute

## How to Verify Admin Access

### Step 1: Check Database
```sql
SELECT id, email, role FROM customers WHERE email = 'admin@example.com';
```
Ensure the role is `'ADMIN'` (case doesn't matter, but uppercase is recommended).

### Step 2: Update Admin Role (if needed)
```sql
UPDATE customers SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

### Step 3: Clear Browser Storage
- Open DevTools > Application > Local Storage
- Delete the `user` key
- Refresh the page

### Step 4: Login and Check Console
- Login with admin credentials
- Check browser console for:
  - "Login - User role: ADMIN"
  - "AppRoutes - isAdmin: true"
  - "ProtectedRoute - isAdmin: true"

### Step 5: Verify Redirect
- Should redirect to `/admin/dashboard`
- Should see "Admin Dashboard" in navigation
- Should NOT see customer routes (Dashboard, My Accounts, etc.)

## Files Modified

1. `frontend/src/context/AuthContext.js`
   - Case-insensitive role check: `user?.role?.toUpperCase() === 'ADMIN'`

2. `frontend/src/components/Login.js`
   - Added setTimeout for navigation
   - Case-insensitive role check
   - Debug logging

3. `frontend/src/App.js`
   - Added explicit isAdmin check in admin dashboard route
   - Debug logging

4. `frontend/src/components/ProtectedRoute.js`
   - Debug logging

## Testing Checklist

- [ ] Admin user exists in database with role = 'ADMIN'
- [ ] Login redirects to `/admin/dashboard`
- [ ] Admin dashboard loads correctly
- [ ] Navigation shows "Admin Dashboard" and "Manage Customers"
- [ ] Customer routes redirect admins to admin dashboard
- [ ] Console logs show correct role and isAdmin status

## Common Issues

1. **Role is "USER" in database**
   - Solution: Update role to "ADMIN" in database

2. **Role is null or undefined**
   - Solution: Check backend response includes role field

3. **Timing issue with state**
   - Solution: setTimeout in Login.js handles this

4. **Case sensitivity**
   - Solution: Code now uses `.toUpperCase()` for comparison

