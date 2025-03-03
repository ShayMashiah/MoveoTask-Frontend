import axios from "axios";

// Create an axios instance
const axiosInstance = axios.create({
    baseURL: URL , 
    headers: {
      "Content-Type": "application/json",
    },
  });


export default axiosInstance;