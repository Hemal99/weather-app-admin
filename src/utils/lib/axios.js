import axios from "axios";

// const baseUrl = "https://prompt-rating-e4d47952e7d8.herokuapp.com/";

const baseUrl = "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

export default axiosInstance;
