// backend/services/smsService.js

// TODO: यहाँ MSG91 / TextLocal / Twilio की real API लगाना है.
// अभी फिलहाल सिर्फ console में log कर रहा है.
export const sendSms = async (phone, message) => {
  if (!phone || !message) return;

  console.log("======================================");
  console.log("SMS TO:", phone);
  console.log(message);
  console.log("======================================");
};
