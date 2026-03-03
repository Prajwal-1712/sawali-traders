// src/api/dashboardApi.js
import axios from "axios";

export const getTodaySummary = async () => {
  const res = await axios.get("/api/sales/summary-today");
  return res.data;
};

export const getPendingSummary = async () => {
  const res = await axios.get("/api/customers/summary-pending");
  return res.data;
};

export const getRecentSales = async () => {
  const res = await axios.get("/api/sales/recent");
  return res.data;
};
