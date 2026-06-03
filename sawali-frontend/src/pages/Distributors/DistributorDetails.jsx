import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import {
  getDistributorPayments,
  addDistributorPayment,
} from "../../api/distributorPaymentApi";

import {
  getDistributorStockHistory,
} from "../../api/stockInApi";

const DistributorDetails = () => {
  const { id } = useParams();

  const [distributor, setDistributor] = useState(null);
  const [payments, setPayments] = useState([]);
  const [stockHistory, setStockHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPaymentForm, setShowPaymentForm] = useState(false);

const [paymentData, setPaymentData] = useState({
  amount: "",
  paymentMethod: "Cash",
  note: "",
});

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const distributorRes = await api.get(
        `/api/distributors/${id}`
      );

     const paymentRes =
  await getDistributorPayments(id);

const stockRes =
  await getDistributorStockHistory(id);

setDistributor(distributorRes.data);
setPayments(paymentRes || []);
setStockHistory(stockRes || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading...
      </div>
    );
  }

  if (!distributor) {
    return (
      <div className="p-6 text-red-400">
        Distributor not found
      </div>
    );
  }


  const handleAddPayment = async () => {

  if (!paymentData.amount) {
    alert("Enter Amount");
    return;
  }

  try {
    await addDistributorPayment({
      distributorId: id,
      amount: Number(paymentData.amount),
      paymentMethod: paymentData.paymentMethod,
      note: paymentData.note,
    });

    setPaymentData({
      amount: "",
      paymentMethod: "Cash",
      note: "",
    });

    setShowPaymentForm(false);

    await fetchData(); 

    alert("Paid succesfully");

  } catch (err) {
    console.error(err);
    alert("Failed To Add Payment");
  }
};

const pendingAmount =
  Number(distributor?.totalPurchase || 0) -
  Number(distributor?.totalPaid || 0);


  return (
    <div className="min-h-screen bg-[#0f1117] text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {distributor.name}
          </h1>

          <p className="text-gray-400 mt-2">
            {distributor.phone || "No Phone"}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">

          <div className="bg-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">
              Total Purchase
            </p>

            <h2 className="text-2xl font-bold text-blue-400">
              ₹
              {Number(
                distributor.totalPurchase || 0
              ).toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="bg-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">
              Total Paid
            </p>

            <h2 className="text-2xl font-bold text-green-400">
              ₹
              {Number(
                distributor.totalPaid || 0
              ).toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="bg-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">
              Returned Amount
            </p>

            <h2 className="text-2xl font-bold text-yellow-400">
              ₹
              {Number(
                distributor.returnedAmount || 0
              ).toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="bg-gray-800 rounded-xl p-5">
  <p className="text-gray-400 text-sm">
    Pending Amount
  </p>

  <h2 className="text-2xl font-bold text-red-400">
    ₹{pendingAmount.toLocaleString("en-IN")}
  </h2>
</div>

        </div>

        {/* Distributor Info */}
        <div className="bg-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Distributor Information
          </h2>

          <div className="space-y-2">
            <p>
              <strong>Phone:</strong>{" "}
              {distributor.phone || "-"}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {distributor.address || "-"}
            </p>

            <p>
              <strong>GST:</strong>{" "}
              {distributor.gstNumber || "-"}
            </p>
          </div>
        </div>

        {/* Add Payment Button */}
        <div className="mb-6">
          <button
  onClick={() => setShowPaymentForm(true)}
  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium"
>
  Pay Now
</button>
{showPaymentForm && (
  <div className="bg-gray-800 rounded-xl p-5 mb-6">

    <h3 className="font-semibold mb-4">
      Add Payment
    </h3>

    <input
      type="number"
      placeholder="Amount"
      value={paymentData.amount}
      onChange={(e) =>
        setPaymentData({
          ...paymentData,
          amount: e.target.value,
        })
      }
      className="w-full p-3 rounded bg-gray-700 mb-3"
    />

    <select
      value={paymentData.paymentMethod}
      onChange={(e) =>
        setPaymentData({
          ...paymentData,
          paymentMethod: e.target.value,
        })
      }
      className="w-full p-3 rounded bg-gray-700 mb-3"
    >
      <option value="Cash">Cash</option>
      <option value="UPI">UPI</option>
      <option value="Bank">Bank</option>
      <option value="Cheque">Cheque</option>
    </select>

    <input
      type="text"
      placeholder="Note"
      value={paymentData.note}
      onChange={(e) =>
        setPaymentData({
          ...paymentData,
          note: e.target.value,
        })
      }
      className="w-full p-3 rounded bg-gray-700 mb-3"
    />

    <div className="flex gap-3">
      <button
        onClick={handleAddPayment}
        className="bg-green-600 px-4 py-2 rounded"
      >
        Save Payment
      </button>

      <button
        onClick={() => setShowPaymentForm(false)}
        className="bg-red-600 px-4 py-2 rounded"
      >
        Cancel
      </button>
    </div>

  </div>
)}
        </div>

        <div className="bg-gray-800 rounded-xl p-5 mb-6">

  <h2 className="text-lg font-semibold mb-4">
    Stock History
  </h2>

  {stockHistory.length === 0 ? (
    <p className="text-gray-400">
      No stock entries found
    </p>
  ) : (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="text-left py-3">Date</th>
          <th className="text-left py-3">Product</th>
          <th className="text-left py-3">Qty</th>
          <th className="text-left py-3">Rate</th>
          <th className="text-left py-3">Total</th>
        </tr>
      </thead>

      <tbody>
        {stockHistory.map((s) => (
          <tr
            key={s._id}
            className="border-b border-gray-700"
          >
            <td>
              {new Date(
                s.date
              ).toLocaleDateString()}
            </td>

            <td>{s.productName}</td>

            <td>{s.quantity}</td>

            <td>₹{s.rate}</td>

            <td className="text-blue-400">
              ₹{s.total}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}

</div>

        {/* Payment History */}
        <div className="bg-gray-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">
            Payment History
          </h2>

          {payments.length === 0 ? (
            <p className="text-gray-400">
              No payments found
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3">
                    Date
                  </th>
                  <th className="text-left py-3">
                    Method
                  </th>
                  <th className="text-left py-3">
                    Amount
                  </th>
                  <th className="text-left py-3">
                    Note
                  </th>
                </tr>
              </thead>

              <tbody>
                {payments.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-gray-700"
                  >
                    <td className="py-3">
                      {new Date(
                        p.date
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {p.paymentMethod}
                    </td>

                    <td className="text-green-400">
                      ₹{p.amount}
                    </td>

                    <td>
                      {p.note || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

export default DistributorDetails;