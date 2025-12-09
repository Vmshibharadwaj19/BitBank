import axiosInstance from '../config/axiosConfig';

// Customer API
export const customerAPI = {
  getAll: () => axiosInstance.get('/api/customers'),
  getById: (id) => axiosInstance.get(`/api/customers/${id}`),
  create: (data) => axiosInstance.post('/api/customers', data),
  update: (id, data) => axiosInstance.put(`/api/customers/${id}`, data),
  delete: (id) => axiosInstance.delete(`/api/customers/${id}`),
};

// Admin API
export const adminAPI = {
  getAllCustomers: () => axiosInstance.get('/api/admin/customers'),
  lockCustomer: (id) => axiosInstance.post(`/api/admin/customers/${id}/lock`),
  unlockCustomer: (id) => axiosInstance.post(`/api/admin/customers/${id}/unlock`),
  getPendingProfileRequests: () => axiosInstance.get('/api/profile/admin/pending-requests'),
  approveProfileRequest: (requestId, adminEmail) => 
    axiosInstance.post(`/api/profile/admin/approve/${requestId}`, null, {
      params: { adminEmail }
    }),
  rejectProfileRequest: (requestId, adminEmail) => 
    axiosInstance.post(`/api/profile/admin/reject/${requestId}`, null, {
      params: { adminEmail }
    }),
};

// Profile API
export const profileAPI = {
  requestUpdate: (customerId, data) => 
    axiosInstance.post('/api/profile/update-request', data, {
      params: { customerId }
    }),
  getMyRequests: (customerId) => 
    axiosInstance.get(`/api/profile/update-requests/${customerId}`),
};

// Account API
export const accountAPI = {
  getAll: () => axiosInstance.get('/api/accounts'),
  getById: (id) => axiosInstance.get(`/api/accounts/${id}`),
  update: (id, data) => axiosInstance.put(`/api/accounts/${id}`, data),
};

// Transaction API
export const transactionAPI = {
  deposit: (accountNumber, amount) =>
    axiosInstance.post('/api/transaction/deposit', { accountNumber, amount }),
  withdraw: (accountNumber, amount) =>
    axiosInstance.post('/api/transaction/withdraw', { accountNumber, amount }),
  transfer: (fromAccount, toAccount, amount) =>
    axiosInstance.post('/api/transaction/transfer', {
      fromAccount,
      toAccount,
      amount,
    }),
  getByCustomer: (customerId, page = 0, size = 10) => 
    axiosInstance.get(`/api/transactions/customer/${customerId}`, {
      params: { page, size }
    }),
  getAll: (page = 0, size = 10) => 
    axiosInstance.get('/api/transactions', {
      params: { page, size }
    }),
  getByAccount: (accountId, page = 0, size = 10) =>
    axiosInstance.get(`/api/statements/account/${accountId}/transactions`, {
      params: { page, size }
    }),
};

// Statement API
export const statementAPI = {
  downloadStatement: async (accountId) => {
    const response = await axiosInstance.get(`/api/statements/account/${accountId}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
