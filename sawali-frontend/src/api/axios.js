import axios from "axios";

const api = axios.create({
  baseURL: "https://sawali-traders.onrender.com",
});

export default api;
