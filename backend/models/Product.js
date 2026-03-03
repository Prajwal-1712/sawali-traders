import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // allows many nulls
    },
    unit: {
      type: String,
      default: "NOS", // pieces
    },
    hsnCode: {
      type: String,
      trim: true,
    },
    gstPercent: {
      type: Number,
      default: 0,
    },
    purchasePrice: {
      type: Number,
      default: 0,
    },
    salePrice: {
      type: Number,
      default: 0,
    },
    openingStock: {
  type: Number,
  default: 0,
},
currentStock: {
  type: Number,
  default: 0,
},

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
