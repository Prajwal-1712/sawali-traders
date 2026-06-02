import axios from "axios";

const API = "https://sawali-traders.onrender.com/api/stock-in";

export const getStockInEntries = async (from = "", to = "") => {
  const res = await axios.get(API, {
    params: { from, to },
  });
  return res.data;
};

export const createStockInEntry = async (payload) => {
  const res = await axios.post(API, payload);
  return res.data;
};


// Update a stock-in entry
export const updateStockInEntry = async (id, data) => {
  const response = await axiosInstance.put(`/stock-in/${id}`, data);
  return response.data;
};

// Delete a stock-in entry
export const deleteStockInEntry = async (id) => {
  const response = await axiosInstance.delete(`/stock-in/${id}`);
  return response.data;
};