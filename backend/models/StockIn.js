import mongoose from "mongoose";

const stockInSchema = new mongoose.Schema(
  {
    distributorId: { type: mongoose.Schema.Types.ObjectId, ref: "Distributor", required: true,},

    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true }, // denormalised for easy report
    rate: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("StockIn", stockInSchema);
