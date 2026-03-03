import axios from "axios";

const API = "http://localhost:5000/api/stock-in";

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
