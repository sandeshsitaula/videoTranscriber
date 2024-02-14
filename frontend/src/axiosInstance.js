// axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://meet.fractalnetworks.co:8000/api",
   withCredentials: true, // Include credentials (cookies) in the request
  // Make sure this is correct
  // other Axios configuration options
});

export default instance;
