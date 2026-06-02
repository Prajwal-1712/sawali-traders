// src/api/customerApi.js
import axios from "axios";

const API_BASE_URL = "https://sawali-traders.onrender.com"; // ⬅️ नक्की घाला

export const createOrGetCustomer = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/api/customers`, payload);
  return res.data;
};


export const getAllCustomers = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/customers`);
  return res.data;
};


// export const getCustomerSales = async (customerId) => {
//   const res = await axios.get(`/api/sales/customer/${customerId}`);
//   return res.data;
// };
// export const getCustomerSales = async (customerId) => {
//   const res = await axios.get(`/api/sales/customer/${customerId}`);
//   return Array.isArray(res.data) ? res.data : [];
// };

export const getCustomerSales = async (customerId) => {
  const res = await axios.get(
    `${API_BASE_URL}/api/sales/customer/${customerId}`
  );
  return Array.isArray(res.data) ? res.data : [];
};


export const payCustomer = async (customerId, payload) => {
  const res = await axios.post(
    `${API_BASE_URL}/api/customers/${customerId}/pay`,
    payload
  );
  return res.data;
};


// export const getCustomerById = async (customerId) => {
//   const res = await axios.get(`/api/customers/${customerId}`);
//   return res.data;
// };

export const getCustomerById = async (customerId) => {
  const res = await axios.get(
    `${API_BASE_URL}/api/customers/${customerId}`
  );
  return res.data;
};

export const getPendingCustomers = async (search = "") => {
  const res = await axios.get(
    `${API_BASE_URL}/api/customers/pending`,
    { params: { search } }
  );
  return res.data;
};
