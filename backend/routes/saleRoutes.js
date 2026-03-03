// routes/saleRoutes.js
import express from "express";
import Sale from "../models/Sale.js";
import Customer from "../models/Customer.js";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const router = express.Router();

// helper to get next bill number
// const getNextBillNo = async () => {
//   const last = await Sale.findOne().sort({ billNumber: -1 });
//   return last ? last.billNumber + 1 : 1;  // 1,2,3... NaN नाही
// };

const getNextBillNo = async () => {
  const last = await Sale.findOne().sort({ billNumber: -1 }).lean();

  // जर एकही sale नसेल किंवा billNumber नंबर नसेल तर 0 घ्या
  const lastNo =
    last && typeof last.billNumber === "number" && !Number.isNaN(last.billNumber)
      ? last.billNumber
      : 0;

  return lastNo + 1;
};

// POST /api/sales  → new sale
router.post("/", async (req, res) => {
  try {
    const { customerId, items, paidAmount, paymentMode } = req.body;
    const customer = await Customer.findById(customerId);

    // basic validation
    if (!customerId) {
      return res.status(400).json({ error: "customerId is required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "At least one item is required" });
    }

    // grandTotal (NaN safe)
    const grandTotal = items.reduce((sum, i) => {
      const qty = Number(i.quantity) || 0;
      const rate = Number(i.rate) || 0;
      return sum + qty * rate;
    }, 0);

    const paid = Number(paidAmount) || 0;
    const balance = Math.max(0, grandTotal - paid);
    const status = balance > 0 ? "PENDING" : "COMPLETE";

    const billNumber = await getNextBillNo();
      console.log("DEBUG billNumber:", billNumber);

   // 🔥 stock check + reduce
for (const item of items) {
  const product = await Product.findById(item.productId);

  if (!product) {
    return res.status(400).json({ error: "Product not found" });
  }

  const qty = Number(item.quantity) || 0;

  if (product.currentStock < qty) {
    return res.status(400).json({
      error: `Not enough stock for ${product.name}`,
    });
  }

  product.currentStock -= qty;
  await product.save();
}

// now create sale
const sale = await Sale.create({
  customerId,
  dairyOwnerId: customer?.dairyOwnerId || null,
  items,
  grandTotal,
  paidAmount: paid,
  balance,
  paymentMode,
  status,
  billNumber,
});



    // update customer balance
    await Customer.findByIdAndUpdate(customerId, {
      $inc: { balance: balance },
    });

    res.status(201).json(sale);
  } catch (err) {
    console.error("Error in POST /api/sales:", err);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/sales/summary-today
router.get("/summary-today", async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const sales = await Sale.find({ createdAt: { $gte: start, $lte: end } });

    const totalSales = sales.reduce((sum, s) => sum + (s.grandTotal || 0), 0);
    const billCount = sales.length;

    res.json({ totalSales, billCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/sales/customer/:customerId → all bills for one customer
router.get("/customer/:customerId", async (req, res) => {
  try {
    const customerObjectId = new mongoose.Types.ObjectId(req.params.customerId);

const sales = await Sale.find({ customerId: customerObjectId }) 
  .sort({ createdAt: -1 });

    res.json(sales);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/sales/summary?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/summary", async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = {};

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const sales = await Sale.find(query);
    const totalSales = sales.reduce(
      (sum, s) => sum + (s.grandTotal || 0),
      0
    );
    res.json({ totalSales });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
