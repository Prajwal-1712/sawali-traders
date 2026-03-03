import mongoose from "mongoose";

const dairyOwnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: String,
  },
  { timestamps: true }
);

export default mongoose.model("DairyOwner", dairyOwnerSchema);
