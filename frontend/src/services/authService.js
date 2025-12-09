import axiosInstance from '../config/axiosConfig';

export const authService = {
  // Request OTP
  requestOtp: async (email) => {
    try {
      const response = await axiosInstance.post('/api/auth/request-otp', null, {
        params: { email },
      });
      // Response is now JSON with { message, otp }
      return response.data;
    } catch (error) {
      // Handle different error formats
      if (error.response) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          throw errorData;
        } else if (errorData?.error) {
          throw errorData.error;
        }
        throw error.response.statusText || 'Failed to send OTP';
      } else if (error.request) {
        throw 'Network error: Unable to connect to server. Please check if backend is running.';
      } else {
        throw error.message || 'Failed to send OTP';
      }
    }
  },

  // Login with OTP
  loginWithOtp: async (email, otp) => {
    try {
      const response = await axiosInstance.post('/api/auth/login-otp', {
        email,
        otp,
      });
      // Response is now JSON with { message, customer, token }
      return response.data;
    } catch (error) {
      // Handle different error formats
      if (error.response) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          throw errorData;
        } else if (errorData?.error) {
          throw errorData.error;
        }
        throw error.response.statusText || 'Login failed';
      } else if (error.request) {
        throw 'Network error: Unable to connect to server. Please check if backend is running.';
      } else {
        throw error.message || 'Login failed';
      }
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Check if user has admin role
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'ADMIN';
  },
};
