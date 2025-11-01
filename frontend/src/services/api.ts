import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_UR || 'http://localhost:4000/api',
});

// Request interceptor to attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration/invalidation
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid, log out the user
            console.warn('Authentication token expired or invalid. Logging out.');
            // This would typically trigger a global logout action
            // For now, just clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Optionally, redirect to login page
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;