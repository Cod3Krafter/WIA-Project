import axios from "axios";

// Theres no localhost in production so we use this to make it dynamic
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// Add token and role to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (role) {
      config.headers["x-active-role"] = role;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses (like 429 errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.headers["retry-after"];

      // Save retry time in localStorage (optional if you want persistence)
      const retryUntil = Date.now() + (retryAfter ? retryAfter * 1000 : 30000);
      localStorage.setItem("retryUntil", retryUntil);

      // Redirect to "Too Many Requests" page
      window.location.href = "/too-many-requests";
      
      // OR if using React Router, you could use navigate("/too-many-requests")
    }

    return Promise.reject(error);
  }
);

export default api;
