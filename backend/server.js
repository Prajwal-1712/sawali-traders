import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// Correct import for named export ⬇⬇⬇
import { connectDB } from "./config/db.js";

import customerRoutes from "./routes/customerRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import distributorRoutes from "./routes/distributorRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import stockInRoutes from "./routes/stockInRoutes.js";
import dairyOwnerRoutes from "./routes/dairyOwnerRoutes.js";
import smsRoutes from "./routes/smsRoutes.js";
import authRoutes from "./routes/auth.js";


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("Backend running successfully!");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/distributors", distributorRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/products", productRoutes);     // ⬅️ NEW
app.use("/api/stock-in", stockInRoutes);     // ⬅️ NEW
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/dairy-owners", dairyOwnerRoutes); // 👈 IMPORTANT
app.use("/api/sms", smsRoutes);


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
