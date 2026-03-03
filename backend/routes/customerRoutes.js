// routes/customerRoutes.js
import express from "express";
import Customer from "../models/Customer.js";
import Sale from "../models/Sale.js";

const router = express.Router();

// create OR find existing by name+phone (for your “existing customer” case)
router.post("/", async (req, res) => {
  try {
    const { name, phone, customerType, dairyOwnerId } = req.body;

    let customer = await Customer.findOne({ name, phone });
    if (!customer) {
      customer = await Customer.create({
        name,
        phone,
        customerType,
        dairyOwnerId: customerType === "Dairy" ? dairyOwnerId || null : null,
      });
    }

    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// GET /api/customers/summary-pending
router.get("/summary-pending", async (req, res) => {
  try {
    const customers = await Customer.find({ balance: { $gt: 0 } });
    const totalPending = customers.reduce((sum, c) => sum + (c.balance || 0), 0);
    const count = customers.length;
    res.json({ totalPending, customerCount: count });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// GET /api/customers  → all customers for list page
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ name: 1 });
    res.json(customers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/customers/:id/pay
router.post("/:id/pay", async (req, res) => {
  try {
    const { amount, method } = req.body;
    const payAmount = Number(amount || 0);
    if (payAmount <= 0) {
      return res.status(400).json({ error: "Amount must be > 0" });
    }

    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    const currentBalance = customer.balance || 0;
    const newBalance = Math.max(0, currentBalance - payAmount);
    customer.balance = newBalance;
    await customer.save();

    // Optionally: split payAmount across latest pending sales
    const pendingSales = await Sale.find({
      customerId: customer._id,
      balance: { $gt: 0 },
    }).sort({ createdAt: -1 });

    let remaining = payAmount;
    for (const s of pendingSales) {
      if (remaining <= 0) break;
      const deduct = Math.min(remaining, s.balance);
      s.paidAmount += deduct;
      s.balance -= deduct;
      s.status = s.balance > 0 ? "PENDING" : "COMPLETE";
      await s.save();
      remaining -= deduct;
    }

    res.json({ success: true, newBalance });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/customers/:customerId → single customer
router.get("/:customerId", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// GET /api/customers/pending  → all customers with pending balance
router.get("/pending", async (req, res) => {
  try {
    const search = req.query.search || "";
    const query = {
      balance: { $gt: 0 },
    };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const customers = await Customer.find(query)
      .sort({ balance: -1 })
      .select("name phone balance customerType dairyOwnerName");
    res.json(customers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
