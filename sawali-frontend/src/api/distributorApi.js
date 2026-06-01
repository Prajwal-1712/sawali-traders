import axios from "axios";

const API_BASE_URL = "http://sawali-traders.onrender.com/api";

export const getAllDistributors = async () => {
  const res = await axios.get(`${API_BASE_URL}/distributors`);
  return res.data;
};

export const createDistributor = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/distributors`, data);
  return res.data;
};

export const getDistributorById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/distributors/${id}`);
  return res.data;
};
