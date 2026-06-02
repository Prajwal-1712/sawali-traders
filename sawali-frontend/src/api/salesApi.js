// src/api/salesApi.js
import axios from "axios";
const API_BASE_URL = "https://sawali-traders.onrender.com"; // your Node server

export const createSale = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/api/sales`, payload);
  return res.data;
};
