// src/api/productApi.js
import axios from "axios";

const API_BASE_URL = "http://sawali-traders.onrender.com"; // adjust for your backend

export const getAllProducts = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/products`);
  return res.data;
};

export const createProduct = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/api/products`, payload);
  return res.data;
};

export const updateProduct = async (id, payload) => {
  const res = await axios.put(`${API_BASE_URL}/api/products/${id}`, payload);
  return res.data;
};
