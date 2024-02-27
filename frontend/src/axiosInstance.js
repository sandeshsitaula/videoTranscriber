// axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.test.fractalnetworks.co/api",
   withCredentials: true, // Include credentials (cookies) in the request
  // Make sure this is correct
  // other Axios configuration options
});

export default instance;
