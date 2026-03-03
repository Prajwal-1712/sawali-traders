import express from "express";
import DairyOwner from "../models/DairyOwner.js";
import Customer from "../models/Customer.js";
import Sale from "../models/Sale.js";

const router = express.Router();

// CREATE dairy owner  -> POST /api/dairy-owners
router.post("/", async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const owner = await DairyOwner.create({ name, phone });
    res.status(201).json(owner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all dairy owners -> GET /api/dairy-owners
router.get("/", async (req, res) => {
  try {
    const owners = await DairyOwner.find().sort({ name: 1 });
    res.json(owners);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/dairy-owners/:id/customers  -> dashboard data
router.get("/:id/customers", async (req, res) => {
  try {
    const owner = await DairyOwner.findById(req.params.id);
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    const customers = await Customer.find({
      dairyOwnerId: req.params.id,
      balance: { $gt: 0 },
    })
      .sort({ balance: -1 })
      .select("name phone balance");

    res.json({ owner, customers });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/dairy-owners/:id/pay-bulk  -> bulk payment
router.post("/:id/pay-bulk", async (req, res) => {
  try {
    const { customerIds, amount, method, note } = req.body;

    if (!Array.isArray(customerIds) || customerIds.length === 0) {
      return res.status(400).json({ error: "No customers selected" });
    }
    const payAmount = Number(amount || 0);
    if (payAmount <= 0) {
      return res.status(400).json({ error: "Amount must be > 0" });
    }

    const share = payAmount / customerIds.length;

    const customers = await Customer.find({ _id: { $in: customerIds } });
    for (const c of customers) {
      const deduction = Math.min(share, c.balance || 0);
      c.balance = (c.balance || 0) - deduction;
      await c.save();
      // optionally create Payment records / send SMS here
    }

    res.json({ success: true, method, note });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/dairy-owners/:ownerId/dashboard
router.get("/:ownerId/dashboard", async (req, res) => {
  try {
    const ownerId = req.params.ownerId;

    const sales = await Sale.find({ dairyOwnerId: ownerId })
      .populate("customerId", "name")
      .populate("items.productId", "name");

    res.json(sales);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// GET /api/dairy-owners/:id/sales
router.get("/:id/sales", async (req, res) => {
  try {
    const ownerId = req.params.id;
    const { from, to } = req.query;

    const customers = await Customer.find({ dairyOwnerId: ownerId })
      .select("_id");

    const customerIds = customers.map(c => c._id);

    const query = {
      customerId: { $in: customerIds }
    };

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const sales = await Sale.find(query)
      .populate("customerId", "name")
      .populate("items.productId", "name")
      .sort({ createdAt: -1 });

    res.json(sales);
  } catch (err) {
    console.error("Owner sales error:", err);
    res.status(400).json({ error: err.message });
  }
});


export default router;
