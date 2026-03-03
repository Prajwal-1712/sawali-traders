import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCustomerById,
  getCustomerSales,
  payCustomer,
} from "../../api/customerApi";
import { sendSms } from "../../api/smsApi";

const CustomerHistory = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payData, setPayData] = useState({
    amount: "",
    method: "CASH",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

useEffect(() => {
  const load = async () => {
    console.log("CustomerHistory ID:", customerId);
    setLoading(true);

    // load customer safely
    try {
      const c = await getCustomerById(customerId);
      console.log("Customer:", c);
      setCustomer(c);
    } catch (err) {
      console.error("Customer load failed:", err);
      setCustomer(null);
    }

    // load sales safely
    try {
      const s = await getCustomerSales(customerId);
      console.log("Sales:", s);
      setSales(Array.isArray(s) ? s : []);
    } catch (err) {
      console.error("Sales load failed:", err);
      setSales([]);
    }

    setLoading(false);
  };

  load();
}, [customerId]);

  // safe wrapper so reduce/map नेहमी array वरच चालतील
  const safeSales = Array.isArray(sales) ? sales : [];

  const totalBilled = safeSales.reduce(
    (sum, s) => sum + (s.grandTotal || 0),
    0
  );
  const totalPaid = safeSales.reduce(
    (sum, s) => sum + (s.paidAmount || 0),
    0
  );
  const totalBalance = safeSales.reduce(
    (sum, s) => sum + (s.balance || 0),
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePay = async () => {
    setError("");
    const amount = Number(payData.amount || 0);
    if (amount <= 0) {
      setError("Enter amount > 0");
      return;
    }

    try {
      setSaving(true);
      await payCustomer(customerId, {
        amount,
        method: payData.method,
      });
      alert("Payment saved ✅");

      // const [c, s] = await Promise.all([
      //   getCustomerById(customerId),
      //   getCustomerSales(customerId),
      // ]);
      const c = await getCustomerById(customerId);
console.log("Customer:", c);

const s = await getCustomerSales(customerId);
console.log("Sales:", s);

setCustomer(c);
setSales(Array.isArray(s) ? s : []);

      setCustomer(c);
      setSales(Array.isArray(s) ? s : []);
      setPayData({ amount: "", method: "CASH" });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error saving payment");
    } finally {
      setSaving(false);
    }
  };

  const handleSendSummarySms = async () => {
    if (!customer.phone) {
      alert("No phone number for this customer");
      return;
    }

    const msg = `Sawali Traders: Your pending amount is ₹${totalBalance.toFixed(
      2
    )}. Total billed: ₹${totalBilled.toFixed(
      2
    )}, paid: ₹${totalPaid.toFixed(2)}.`;

    try {
      await sendSms({ phone: customer.phone, message: msg });
      alert("SMS sent ✅");
    } catch (err) {
      console.error(err);
      alert("Error sending SMS");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading history...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Customer not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/customers")}
          className="mb-4 text-sm underline"
        >
          ← Back to Customers
        </button>

        <h1 className="text-2xl font-bold mb-2">{customer.name}</h1>
        <p className="text-sm text-gray-700 mb-1">
          Phone: {customer.phone || "-"}
        </p>
        <p className="text-sm text-gray-700 mb-4">
          Type: {customer.customerType}{" "}
          {customer.customerType === "Dairy" && customer.dairyOwnerName
            ? `(Owner: ${customer.dairyOwnerName})`
            : ""}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-3">
            <p className="text-xs text-gray-500">Total Billed</p>
            <p className="text-xl font-bold">₹{totalBilled.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-3">
            <p className="text-xs text-gray-500">Total Paid</p>
            <p className="text-xl font-bold text-green-600">
              ₹{totalPaid.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-3">
            <p className="text-xs text-gray-500">Pending Balance</p>
            <p className="text-xl font-bold text-red-600">
              ₹{totalBalance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Payment form */}
        {/* Payment form – show only if pending balance */}
{totalBalance > 0 && (
  <div className="bg-white rounded-lg shadow p-4 mb-6">
    <h2 className="text-lg font-semibold mb-3">Take Payment</h2>
    {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div>
        <label className="text-sm font-medium">Amount</label>
        <input
          type="number"
          name="amount"
          value={payData.amount}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="₹ amount"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Method</label>
        <select
          name="method"
          value={payData.method}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="CASH">Cash</option>
          <option value="UPI">UPI / Online</option>
        </select>
      </div>
      <div className="flex items-end gap-2">
        <button
          onClick={handlePay}
          disabled={saving}
          className="w-full px-4 py-2 bg-emerald-600 text-white rounded"
        >
          {saving ? "Saving..." : "Save Payment"}
        </button>
      </div>
    </div>
  </div>
)}


        {/* Bills table */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Bills History</h2>
          {safeSales.length === 0 ? (
            <p className="text-sm text-gray-500">No bills yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Bill No</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-right">Total</th>
                  <th className="p-2 text-right">Paid</th>
                  <th className="p-2 text-right">Balance</th>
                  <th className="p-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {safeSales.map((s) => (
                  <tr key={s._id} className="border-t">
                    <td className="p-2">{s.billNumber}</td>
                    <td className="p-2">
                      {new Date(s.createdAt).toLocaleString()}
                    </td>
                    <td className="p-2 text-right">₹{s.grandTotal}</td>
                    <td className="p-2 text-right">₹{s.paidAmount}</td>
                    <td className="p-2 text-right">₹{s.balance}</td>
                    <td className="p-2 text-right">
                      {s.balance > 0 ? "Pending" : "Complete"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => navigate(`/sales/new/${customer._id}`)}
            className="px-4 py-2 bg-slate-900 text-white rounded"
          >
            + New Sale
          </button>
          <button
            onClick={handleSendSummarySms}
            className="px-4 py-2 bg-emerald-600 text-white rounded"
          >
            📱 Send Pending SMS
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerHistory;
