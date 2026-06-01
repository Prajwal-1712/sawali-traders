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

      
    // 1. name check
if (!name) {
  return res.status(400).json({ error: "Product name is required" });
}

// 2. trim
const cleanName = name.trim();

// 3. duplicate check
const existing = await Product.findOne({
  name: { $regex: new RegExp(`^${cleanName}$`, "i") }
});

if (existing) {
  return res.status(400).json({
    error: "Product already exists",
  });
}

    const product = await Product.create({
  name: cleanName,
  sku,
  unit,
  hsnCode,
  gstPercent,
  purchasePrice,
  salePrice,
  openingStock: openingStock ?? 0,
  currentStock: openingStock ?? 0,
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
      currentStock, 
    } = req.body;

    if (!name) {
  return res.status(400).json({ error: "Product name required" });
}
const cleanName = name.trim();
const existing = await Product.findOne({
  name: cleanName,
});

// 👉 check manually
if (existing && existing._id.toString() !== req.params.id) {
  return res.status(400).json({
    error: "Product with same name already exists",
  });
}

   const product = await Product.findByIdAndUpdate(
  req.params.id,
  {
    name: cleanName,
    sku,
    unit,
    hsnCode,
    gstPercent,
    purchasePrice,
    salePrice,
    currentStock, 
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
