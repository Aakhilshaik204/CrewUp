import api from './axios';

export const syncUser = (data) => api.post('/api/users/sync', data);
export const getMe = () => api.get('/api/users/me');
export const updateMe = (data) => api.put('/api/users/me', data);
export const getUserById = (id) => api.get(`/api/users/${id}`);
export const getUserActivities = (id, type) => api.get(`/api/users/${id}/activities?type=${type}`);
