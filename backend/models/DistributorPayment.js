import mongoose from "mongoose";

const distributorPaymentSchema = new mongoose.Schema(
{
  distributorId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Distributor",
    required:true
  },

  amount:{
    type:Number,
    required:true
  },

  paymentMethod:{
    type:String,
    enum:["Cash","UPI","Bank","Cheque"],
    default:"Cash"
  },

  note:String,

  date:{
    type:Date,
    default:Date.now
  }
},
{timestamps:true}
);

export default mongoose.model(
 "DistributorPayment",
 distributorPaymentSchema
);