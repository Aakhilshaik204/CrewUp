import api from './axios';

export const getActivities = (params) => api.get('/api/activities', { params });
export const getActivityById = (id) => api.get(`/api/activities/${id}`);
export const createActivity = (data) => api.post('/api/activities', data);
export const updateActivity = (id, data) => api.put(`/api/activities/${id}`, data);
export const cancelActivity = (id) => api.delete(`/api/activities/${id}`);

export const joinActivity = (id, data) => api.post(`/api/activities/${id}/join`, data);
export const leaveActivity = (id) => api.post(`/api/activities/${id}/leave`);
export const removeParticipant = (id, userId) => api.delete(`/api/activities/${id}/participants/${userId}`);

export const updateActivityStatus = (id, status) => api.put(`/api/activities/${id}/status`, { status });

export const getMessages = (id) => api.get(`/api/activities/${id}/messages`);
