import axios from "axios";

const API_BASE_URL = "https://sawali-traders.onrender.com";

export const getAllDairyOwners = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/dairy-owners`);
  return res.data;
};

export const getDairyOwnerCustomers = async (ownerId) => {
  const res = await axios.get(
    `${API_BASE_URL}/api/dairy-owners/${ownerId}/customers`
  );
  return res.data;
};

export const payBulkForDairyOwner = async (ownerId, payload) => {
  const res = await axios.post(
    `${API_BASE_URL}/api/dairy-owners/${ownerId}/pay-bulk`,
    payload
  );
  return res.data;
};

// export const getDairyOwnerSales = async (ownerId, from, to) => {
//   const params = new URLSearchParams();

//   if (from) params.append("from", from);
//   if (to) params.append("to", to);

//   const res = await axios.get(
//     `/api/dairy-owners/${ownerId}/sales?${params}`
//   );

//   return res.data;
// };

export const getDairyOwnerSales = async (ownerId, from, to) => {
  const params = new URLSearchParams();

  if (from) params.append("from", from);
  if (to) params.append("to", to);

  const res = await axios.get(
    `${API_BASE_URL}/api/dairy-owners/${ownerId}/sales?${params}`
  );

  return res.data;
};

export const createDairyOwner = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/api/dairy-owners`, payload);
  return res.data;
};
