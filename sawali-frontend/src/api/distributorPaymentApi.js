import api from "./axios";

// Add Payment
export const addDistributorPayment = async (data) => {
  const res = await api.post(
    "/api/distributor-payments",
    data
  );

  return res.data;
};

// Get Payment History
export const getDistributorPayments = async (
  distributorId
) => {
  const res = await api.get(
    `/api/distributor-payments/${distributorId}`
  );

  return res.data;
};

// Delete Payment
export const deleteDistributorPayment = async (
  paymentId
) => {
  const res = await api.delete(
    `/api/distributor-payments/${paymentId}`
  );

  return res.data;
};

// Update Payment
export const updateDistributorPayment = async (
  paymentId,
  data
) => {
  const res = await api.put(
    `/api/distributor-payments/${paymentId}`,
    data
  );

  return res.data;
};