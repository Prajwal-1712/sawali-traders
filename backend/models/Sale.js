// models/Sale.js
import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    dairyOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "DairyOwner", default: null,},

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        rate: { type: Number, required: true },
      },
    ],
    grandTotal: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    balance: { type: Number, required: true },
    paymentMode: { type: String, enum: ["CASH", "ONLINE", "CREDIT"], default: "CASH" },
    status: { type: String, enum: ["COMPLETE", "PENDING"], default: "COMPLETE" },
    billNumber: { type: Number, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
