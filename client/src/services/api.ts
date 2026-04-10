import axios from 'axios';

/**
 * Cấu hình Axios Client cho toàn bộ dự án. 
 * baseURL: Link tới API của Backend.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Sử dụng interceptor để tự động chèn JWT Token vào Header của yêu cầu nếu có.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
