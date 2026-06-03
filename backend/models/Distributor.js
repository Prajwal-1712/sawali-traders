import mongoose from "mongoose";

const distributorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    gstNumber: {
      type: String,
      trim: true,
    },
    openingBalance: {
      type: Number,
      default: 0,
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    totalPurchase: {
  type: Number,
  default: 0,
},
totalPaid: {
  type: Number,
  default: 0,
},
returnedAmount: {
  type: Number,
  default: 0,
},
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const Distributor = mongoose.model("Distributor", distributorSchema);

export default Distributor;
