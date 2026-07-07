import api from './axios';

export const getNotifications = () => api.get('/api/notifications');
export const markAllRead = () => api.put('/api/notifications/read');
export const markOneRead = (id) => api.put(`/api/notifications/${id}/read`);
