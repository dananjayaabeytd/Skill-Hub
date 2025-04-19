import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${apiUrl}/api`,
  withCredentials: true, // Important for handling cookies and CSRF tokens
  headers: {
    'Content-Type': 'application/json',
  },
});

// CSRF Token Retrieval and Interceptor
api.interceptors.request.use(
  async (config) => {
    // Ensure JWT token is included
    const token = localStorage.getItem('JWT_TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // CSRF Token Handling
    try {
      // If no CSRF token exists, fetch a new one
      let csrfToken = localStorage.getItem('CSRF_TOKEN');
      
      if (!csrfToken) {
        const csrfResponse = await axios.get(`${apiUrl}/api/csrf-token`, {
          withCredentials: true,
        });
        
        csrfToken = csrfResponse.data.token;
        localStorage.setItem('CSRF_TOKEN', csrfToken);
      }

      // Always set the CSRF token in the headers
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
      }
    } catch (error) {
      console.error('Failed to fetch or set CSRF token', error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 403 CSRF or Authentication errors
    if ((error.response?.status === 403 || error.response?.status === 401) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh CSRF token
        const csrfResponse = await axios.get(`${apiUrl}/api/csrf-token`, {
          withCredentials: true,
        });
        
        const newCsrfToken = csrfResponse.data.token;
        localStorage.setItem('CSRF_TOKEN', newCsrfToken);

        // Retry the original request with new CSRF token
        originalRequest.headers['X-XSRF-TOKEN'] = newCsrfToken;
        return api(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, redirect to login
        console.error('Token refresh failed', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;