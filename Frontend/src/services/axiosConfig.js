import axios from "axios";

// Create an axios instance
const axiosInstance = axios.create({
    baseURL: "http://localhost:5000", 
    headers: {
      "Content-Type": "application/json",
    },
  });


export default axiosInstance;