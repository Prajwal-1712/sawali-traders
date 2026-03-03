// models/Customer.js
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: String,
    customerType: { type: String, enum: ["Normal", "Dairy"], default: "Normal" },
    dairyOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "DairyOwner", default: null },
    balance: { type: Number, default: 0 }, // pending amount
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
