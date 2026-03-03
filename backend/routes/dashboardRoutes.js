import express from "express";
import Customer from "../models/Customer.js";
import Distributor from "../models/Distributor.js"; // ⬅️ आता model आहे
import Sale from "../models/Sale.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // 1️⃣ Customer Outstanding
    const customers = await Customer.find({});
    const totalCustomerOutstanding = customers.reduce(
      (sum, c) => sum + (c.currentBalance || 0),
      0
    );

    // 2️⃣ Distributor Outstanding
    const distributors = await Distributor.find({});
    const totalDistributorOutstanding = distributors.reduce(
      (sum, d) => sum + (d.currentBalance || 0),
      0
    );

    // 3️⃣ Today's Sales
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaySalesDocs = await Sale.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const todaySales = todaySalesDocs.reduce(
      (sum, s) => sum + (s.grandTotal || 0),
      0
    );

    res.json({
      todaySales,
      totalCustomerOutstanding,
      totalDistributorOutstanding,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
