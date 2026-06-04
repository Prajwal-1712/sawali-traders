import express from "express";
import DistributorPayment from "../models/DistributorPayment.js";
import Distributor from "../models/Distributor.js";

const router = express.Router();

/* =====================================
   POST - Add Distributor Payment
   ===================================== */

router.post("/", async (req, res) => {
  try {
    const {
      distributorId,
      amount,
      paymentMethod,
      note,
    } = req.body;

    if (!distributorId) {
      return res.status(400).json({
        message: "Distributor is required",
      });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Valid amount is required",
      });
    }
    if (isNaN(amount)) {
  return res.status(400).json({
    message: "Amount must be a number",
  });
}

    const distributor =
      await Distributor.findById(distributorId);

    if (!distributor) {
      return res.status(404).json({
        message: "Distributor not found",
      });
    }

    // Create payment entry
    const payment =
      await DistributorPayment.create({
        distributorId,
        amount: Number(amount),
        paymentMethod:
          paymentMethod || "Cash",
        note,
      });

    // Update distributor
    distributor.totalPaid =
      (distributor.totalPaid || 0) +
      Number(amount);

    distributor.currentBalance =
      (distributor.currentBalance || 0) -
      Number(amount);

    await distributor.save();

    res.status(201).json({
      success: true,
      message: "Paid succesfully",
      payment,
      distributor,
    });
  } catch (error) {
  console.error("Distributor Payment Error:", error);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
});

/* =====================================
   GET - Payment History By Distributor
   ===================================== */

router.get("/:distributorId", async (req, res) => {
  try {
    const payments =
      await DistributorPayment.find({
        distributorId:
          req.params.distributorId,
      })
        .sort({ date: -1 });

    res.status(200).json(payments);
  } 
  catch (error) {
  console.error("Get Payment Error:", error);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
});

/* =====================================
   DELETE Payment
   ===================================== */

router.delete("/:paymentId", async (req, res) => {
  try {
    const payment =
      await DistributorPayment.findById(
        req.params.paymentId
      );

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    const distributor =
      await Distributor.findById(
        payment.distributorId
      );

    if (distributor) {
      distributor.totalPaid -= payment.amount;
      distributor.currentBalance += payment.amount;

      await distributor.save();
    }

    await DistributorPayment.findByIdAndDelete(
      req.params.paymentId
    );

    res.json({
      success: true,
      message: "Payment deleted successfully",
    });
  }catch (error) {
  console.error("Delete Payment Error:", error);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
});

/* =====================================
   PUT - Edit Payment
   ===================================== */

router.put("/:paymentId", async (req, res) => {
  try {
    const {
      amount,
      paymentMethod,
      note,
    } = req.body;

    if (!amount || Number(amount) <= 0) {
  return res.status(400).json({
    message: "Valid amount is required",
  });
}
    const payment =
      await DistributorPayment.findById(
        req.params.paymentId
      );

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    const distributor =
      await Distributor.findById(
        payment.distributorId
      );

    if (distributor) {
      // remove old amount
      distributor.totalPaid -= payment.amount;
      distributor.currentBalance += payment.amount;

      // add new amount
      distributor.totalPaid += Number(amount);
      distributor.currentBalance -= Number(amount);

      await distributor.save();
    }

    payment.amount = Number(amount);
    payment.paymentMethod = paymentMethod;
    payment.note = note;

    await payment.save();

    res.json({
      success: true,
      message: "Payment updated successfully",
      payment,
    });
  } catch (error) {
  console.error("Update Payment Error:", error);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
});

export default router;