import express from "express";
import StockIn from "../models/StockIn.js";
import Product from "../models/Product.js";
import Distributor from "../models/Distributor.js";
const router = express.Router();

// POST /api/stock-in  → add stock entry and update product stock
router.post("/", async (req, res) => {
  try {
    // const { distributorName, productId, rate, quantity, date } = req.body;
    const { distributorId, productId, rate, quantity, date } = req.body;

     if (!distributorId) {
      return res.status(400).json({ error: "Distributor is required" });
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const qty = Number(quantity) || 0;
    const r = Number(rate) || 0;
    const total = qty * r;

    
    const entry = await StockIn.create({
      distributorId,
      productId,
      productName: product.name,
      rate: r,
      quantity: qty,
      total,
      date: date ? new Date(date) : new Date(),
    });

    const distributor = await Distributor.findById(distributorId);

if (distributor) {
  distributor.totalPurchase =
    (distributor.totalPurchase || 0) + total;

  distributor.currentBalance =
    (distributor.currentBalance || 0) + total;

  await distributor.save();
}
    // ✅ FIXED LINE
    product.currentStock = (product.currentStock || 0) + qty;

    await product.save();

    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// GET /api/stock-in?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/", async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = {};

    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const entries = await StockIn.find(query)
      .sort({ date: -1 })
      .populate("productId", "name")
.populate("distributorId", "name phone");

    res.json(entries);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// GET /api/stock-in/distributor/:id
router.get("/distributor/:id", async (req, res) => {
  try {
    const stockHistory = await StockIn.find({
      distributorId: req.params.id,
    }).sort({ date: -1 });

    res.json(stockHistory);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// GET /api/stock-in/summary?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/summary", async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = {};

    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const entries = await StockIn.find(query);
    const totalIncoming = entries.reduce(
      (sum, e) => sum + (e.total || 0),
      0
    );
    res.json({ totalIncoming });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
