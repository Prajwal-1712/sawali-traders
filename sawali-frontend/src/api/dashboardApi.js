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


export const getLast7Days = async () => {
  const res = await axios.get("/api/sales/last7days");
  return res.data;
};

export const getTopProducts = async () => {
  const res = await axios.get("/api/sales/top-products");
  return res.data;
};