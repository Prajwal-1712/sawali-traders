import express from "express";
import Distributor from "../models/Distributor.js";

const router = express.Router();

// 👉 POST /api/distributors  (Add new distributor)
router.post("/", async (req, res) => {
  try {
    const { name, phone, address, gstNumber, openingBalance } = req.body;

    if (!name || name.trim().length < 3) {
  return res.status(400).json({
    message: "Distributor name must be at least 3 characters",
  });
}

if (phone && !/^[0-9]{10}$/.test(phone)) {
  return res.status(400).json({
    message: "Invalid phone number",
  });
}

    const distributor = await Distributor.create({
      name,
      phone,
      address,
      gstNumber,
      openingBalance: openingBalance || 0,
      currentBalance: openingBalance || 0,
    });

    res.status(201).json(distributor);
  } catch (error) {
    console.error("Error creating distributor:", error);
    res.status(500).json({
  success: false,
  message: "Internal Server Error",
});
  }
});

// 👉 GET /api/distributors  (Get all distributors)
router.get("/", async (req, res) => {
  try {
    const distributors = await Distributor.find().sort({ createdAt: -1 });
    res.json(distributors);
  } catch (error) {
    console.error("Error fetching distributors:", error);
    res.status(500).json({
  success: false,
  message: "Internal Server Error",
});
  }
});

// 👉 GET /api/distributors/:id  (Get single distributor)
router.get("/:id", async (req, res) => {
  try {
    const distributor = await Distributor.findById(req.params.id);
    if (!distributor) {
      return res.status(404).json({ message: "Distributor not found" });
    }
    res.json(distributor);
  } catch (error) {
    console.error("Error fetching distributor:", error);
    res.status(500).json({
  success: false,
  message: "Internal Server Error",
});
  }
});

export default router;
