import api from './axios';

export const createRequest = (requestData) => {
  return api.post('/api/requests', requestData);
};

export const getRequests = (params) => {
  return api.get('/api/requests', { params });
};

export const getRequestById = (id) => {
  return api.get(`/api/requests/${id}`);
};

export const acceptRequest = (id, lenderMessage) => {
  return api.put(`/api/requests/${id}/accept`, { lenderMessage });
};

export const updateRequestStatus = (id, status) => {
  return api.put(`/api/requests/${id}/status`, { status });
};
