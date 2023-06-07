import axios from "axios";

// const baseUrl = "https://s2a-academy.herokuapp.com";

const baseUrl = "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

export default axiosInstance;
