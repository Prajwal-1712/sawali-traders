// backend/routes/productRoutes.js
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const {
      name,
      sku,
      unit,
      hsnCode,
      gstPercent,
      purchasePrice,
      salePrice,
      openingStock,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Product name is required" });
    }

    const product = await Product.create({
  name,
  sku,
  unit,
  hsnCode,
  gstPercent,
  purchasePrice,
  salePrice,
  openingStock: openingStock ?? 0,
  currentStock: 0,
});


    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      sku,
      unit,
      hsnCode,
      gstPercent,
      purchasePrice,
      salePrice,
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        sku,
        unit,
        hsnCode,
        gstPercent,
        purchasePrice,
        salePrice,
      },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// POST /api/products/incoming
router.post("/incoming", async (req, res) => {
  try {
    const { productId, quantity, purchasePrice } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: "productId & quantity required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const qty = Number(quantity) || 0;

    // ✅ increase stock
    product.currentStock += qty;

    // optional: update last purchase price
    if (purchasePrice !== undefined) {
      product.purchasePrice = purchasePrice;
    }

    await product.save();

    res.json({
      message: "Stock added successfully",
      product,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
