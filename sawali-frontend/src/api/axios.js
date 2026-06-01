import axios from "axios";

const api = axios.create({
  baseURL: "http://sawali-traders.onrender.com",
});

export default api;
