// src/api/salesApi.js
import axios from "axios";
const API_BASE_URL = "http://localhost:5000"; // your Node server

export const createSale = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/api/sales`, payload);
  return res.data;
};
