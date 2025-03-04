import axios from "axios";

const baseURL = import.meta.env.REACT_APP_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
});

export default axiosInstance;