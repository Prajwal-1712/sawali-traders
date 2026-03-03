import express from "express";

const router = express.Router();

// POST /api/sms/send
// body: { phone, message }
router.post("/send", async (req, res) => {
  try {
    const { phone, message } = req.body;
    if (!phone || !message) {
      return res.status(400).json({ error: "phone and message required" });
    }

    // TODO: integrate real SMS provider here (Fast2SMS, Twilio, etc.)
    console.log("SMS to:", phone, "message:", message);

    // Simulate success
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
