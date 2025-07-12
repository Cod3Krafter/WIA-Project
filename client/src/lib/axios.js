import axios from "axios";


// Theres no local host in production so we use this to make it dynamic
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/api"
const api = axios.create({
    baseURL:BASE_URL,
})

export default api