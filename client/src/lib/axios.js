import axios from "axios";

// Theres no local host in production so we use this to make it dynamic
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

    console.log("Making request with role:", role);

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


export default api;
