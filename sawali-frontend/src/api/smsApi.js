import axios from "axios";

export const sendSms = async ({ phone, message }) => {
  const res = await axios.post("/api/sms/send", { phone, message });
  return res.data;
};
