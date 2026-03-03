import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPendingCustomers, payCustomer } from "../../api/customerApi";
import { sendSms } from "../../api/smsApi";

const PendingPayments = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [amountMap, setAmountMap] = useState({});
  const [methodMap, setMethodMap] = useState({});

  const load = async () => {
    try {
      setLoading(true);
      const data = await getPendingCustomers(search);
      // if API returns { customers: [...] } use data.customers instead
      // setCustomers(Array.isArray(data.customers) ? data.customers : []);
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading pending customers:", err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // initial

  const handleSearch = async (e) => {
    e.preventDefault();
    await load();
  };

  const handleAmountChange = (id, value) => {
    setAmountMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleMethodChange = (id, value) => {
    setMethodMap((prev) => ({ ...prev, [id]: value }));
  };

  const handlePay = async (customerId) => {
    const amount = Number(amountMap[customerId] || 0);
    const method = methodMap[customerId] || "CASH";

    if (amount <= 0) {
      alert("Enter amount > 0");
      return;
    }

    try {
      setPayingId(customerId);
      await payCustomer(customerId, { amount, method });
      alert("Payment saved ✅");
      await load();
      setAmountMap((prev) => ({ ...prev, [customerId]: "" }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error saving payment");
    } finally {
      setPayingId(null);
    }
  };

  const handleReminderSms = async (c) => {
    if (!c.phone) {
      alert("No phone number for this customer");
      return;
    }
    const msg = `Sawali Traders: Dear ${c.name}, your pending amount is ₹${(
      c.balance || 0
    ).toFixed(2)}. Please pay soon.`;

    try {
      await sendSms({ phone: c.phone, message: msg });
      alert("Reminder SMS sent ✅");
    } catch (err) {
      console.error(err);
      alert("Error sending SMS");
    }
  };

  const safeCustomers = Array.isArray(customers) ? customers : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 text-sm underline"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold mb-4">Pending Payments</h1>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex gap-2 items-center mb-4"
        >
          <input
            type="text"
            placeholder="Search by customer name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 text-white rounded"
          >
            Search
          </button>
        </form>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <p>Loading pending customers...</p>
          </div>
        ) : safeCustomers.length === 0 ? (
          <p className="text-sm text-gray-500">
            No pending payments. All clear! 🎉
          </p>
        ) : (
          <div className="bg-white rounded-lg shadow p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Customer</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Phone</th>
                  <th className="p-2 text-right">Pending</th>
                  <th className="p-2 text-right">Pay Now</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeCustomers.map((c) => (
                  <tr key={c._id} className="border-t">
                    <td className="p-2">
                      <p className="font-semibold">{c.name}</p>
                      {c.dairyOwnerName && (
                        <p className="text-xs text-amber-700">
                          Owner: {c.dairyOwnerName}
                        </p>
                      )}
                    </td>
                    <td className="p-2">
                      {c.customerType || "Normal"}
                    </td>
                    <td className="p-2">{c.phone || "-"}</td>
                    <td className="p-2 text-right text-red-600 font-semibold">
                      ₹{(c.balance || 0).toFixed(2)}
                    </td>
                    <td className="p-2 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <input
                          type="number"
                          className="w-24 border rounded px-2 py-1 text-right"
                          placeholder="₹"
                          value={amountMap[c._id] || ""}
                          onChange={(e) =>
                            handleAmountChange(c._id, e.target.value)
                          }
                        />
                        <select
                          className="w-24 border rounded px-2 py-1 text-xs"
                          value={methodMap[c._id] || "CASH"}
                          onChange={(e) =>
                            handleMethodChange(c._id, e.target.value)
                          }
                        >
                          <option value="CASH">Cash</option>
                          <option value="UPI">UPI</option>
                        </select>
                        <button
                          onClick={() => handlePay(c._id)}
                          disabled={payingId === c._id}
                          className="mt-1 px-3 py-1 bg-emerald-600 text-white text-xs rounded"
                        >
                          {payingId === c._id ? "Saving..." : "Pay"}
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <button
                          onClick={() =>
                            navigate(`/customers/${c._id}/history`)
                          }
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
                        >
                          History
                        </button>
                        <button
                          onClick={() => handleReminderSms(c)}
                          className="px-3 py-1 text-xs bg-amber-600 text-white rounded"
                        >
                          SMS
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingPayments;
