// import axios from "axios";

// export const getSalesSummary = async (from = "", to = "") => {
//   const res = await axios.get("/api/sales/summary", {
//     params: { from, to },
//   });
//   return res.data;
// };

// export const getStockInSummary = async (from = "", to = "") => {
//   const res = await axios.get("/api/stock-in/summary", {
//     params: { from, to },
//   });
//   return res.data;
// };
import axios from "axios";

const API_BASE_URL = "https://sawali-traders.onrender.com";

export const getSalesSummary = async (from = "", to = "") => {
  const res = await axios.get(
    `${API_BASE_URL}/api/sales/summary`,
    {
      params: { from, to },
    }
  );
  return res.data;
};

export const getStockInSummary = async (from = "", to = "") => {
  const res = await axios.get(
    `${API_BASE_URL}/api/stock-in/summary`,
    {
      params: { from, to },
    }
  );
  return res.data;
};