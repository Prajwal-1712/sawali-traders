// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   getCustomerById,
//   getCustomerSales,
//   payCustomer,
// } from "../../api/customerApi";
// import { sendSms } from "../../api/smsApi";

// const CustomerHistory = () => {
//   const { customerId } = useParams();
//   const navigate = useNavigate();

//   const [customer, setCustomer] = useState(null);
//   const [sales, setSales] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [payData, setPayData] = useState({
//     amount: "",
//     method: "CASH",
//   });
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

// useEffect(() => {
//   const load = async () => {
//     console.log("CustomerHistory ID:", customerId);
//     setLoading(true);

//     // load customer safely
//     try {
//       const c = await getCustomerById(customerId);
//       console.log("Customer:", c);
//       setCustomer(c);
//     } catch (err) {
//       console.error("Customer load failed:", err);
//       setCustomer(null);
//     }

//     // load sales safely
//     try {
//       const s = await getCustomerSales(customerId);
//       console.log("Sales:", s);
//       setSales(Array.isArray(s) ? s : []);
//     } catch (err) {
//       console.error("Sales load failed:", err);
//       setSales([]);
//     }

//     setLoading(false);
//   };

//   load();
// }, [customerId]);

//   // safe wrapper so reduce/map नेहमी array वरच चालतील
//   const safeSales = Array.isArray(sales) ? sales : [];

//   const totalBilled = safeSales.reduce(
//     (sum, s) => sum + (s.grandTotal || 0),
//     0
//   );
//   const totalPaid = safeSales.reduce(
//     (sum, s) => sum + (s.paidAmount || 0),
//     0
//   );
//   const totalBalance = safeSales.reduce(
//     (sum, s) => sum + (s.balance || 0),
//     0
//   );

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setPayData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePay = async () => {
//     setError("");
//     const amount = Number(payData.amount || 0);
//     if (amount <= 0) {
//       setError("Enter amount > 0");
//       return;
//     }

//     try {
//       setSaving(true);
//       await payCustomer(customerId, {
//         amount,
//         method: payData.method,
//       });
//       alert("Payment saved ✅");

//       // const [c, s] = await Promise.all([
//       //   getCustomerById(customerId),
//       //   getCustomerSales(customerId),
//       // ]);
//       const c = await getCustomerById(customerId);
// console.log("Customer:", c);

// const s = await getCustomerSales(customerId);
// console.log("Sales:", s);

// setCustomer(c);
// setSales(Array.isArray(s) ? s : []);

//       setCustomer(c);
//       setSales(Array.isArray(s) ? s : []);
//       setPayData({ amount: "", method: "CASH" });
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.error || "Error saving payment");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSendSummarySms = async () => {
//     if (!customer.phone) {
//       alert("No phone number for this customer");
//       return;
//     }

//     const msg = `Sawali Traders: Your pending amount is ₹${totalBalance.toFixed(
//       2
//     )}. Total billed: ₹${totalBilled.toFixed(
//       2
//     )}, paid: ₹${totalPaid.toFixed(2)}.`;

//     try {
//       await sendSms({ phone: customer.phone, message: msg });
//       alert("SMS sent ✅");
//     } catch (err) {
//       console.error(err);
//       alert("Error sending SMS");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading history...</p>
//       </div>
//     );
//   }

//   if (!customer) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Customer not found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         <button
//           onClick={() => navigate("/customers")}
//           className="mb-4 text-sm underline"
//         >
//           ← Back to Customers
//         </button>

//         <h1 className="text-2xl font-bold mb-2">{customer.name}</h1>
//         <p className="text-sm text-gray-700 mb-1">
//           Phone: {customer.phone || "-"}
//         </p>
//         <p className="text-sm text-gray-700 mb-4">
//           Type: {customer.customerType}{" "}
//           {customer.customerType === "Dairy" && customer.dairyOwnerName
//             ? `(Owner: ${customer.dairyOwnerName})`
//             : ""}
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-white rounded-lg shadow p-3">
//             <p className="text-xs text-gray-500">Total Billed</p>
//             <p className="text-xl font-bold">₹{totalBilled.toFixed(2)}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-3">
//             <p className="text-xs text-gray-500">Total Paid</p>
//             <p className="text-xl font-bold text-green-600">
//               ₹{totalPaid.toFixed(2)}
//             </p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-3">
//             <p className="text-xs text-gray-500">Pending Balance</p>
//             <p className="text-xl font-bold text-red-600">
//               ₹{totalBalance.toFixed(2)}
//             </p>
//           </div>
//         </div>

//         {/* Payment form */}
//         {/* Payment form – show only if pending balance */}
// {totalBalance > 0 && (
//   <div className="bg-white rounded-lg shadow p-4 mb-6">
//     <h2 className="text-lg font-semibold mb-3">Take Payment</h2>
//     {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//       <div>
//         <label className="text-sm font-medium">Amount</label>
//         <input
//           type="number"
//           name="amount"
//           value={payData.amount}
//           onChange={handleChange}
//           className="w-full border rounded px-3 py-2"
//           placeholder="₹ amount"
//         />
//       </div>
//       <div>
//         <label className="text-sm font-medium">Method</label>
//         <select
//           name="method"
//           value={payData.method}
//           onChange={handleChange}
//           className="w-full border rounded px-3 py-2"
//         >
//           <option value="CASH">Cash</option>
//           <option value="UPI">UPI / Online</option>
//         </select>
//       </div>
//       <div className="flex items-end gap-2">
//         <button
//           onClick={handlePay}
//           disabled={saving}
//           className="w-full px-4 py-2 bg-emerald-600 text-white rounded"
//         >
//           {saving ? "Saving..." : "Save Payment"}
//         </button>
//       </div>
//     </div>
//   </div>
// )}


//         {/* Bills table */}
//         <div className="bg-white rounded-lg shadow p-4">
//           <h2 className="text-lg font-semibold mb-3">Bills History</h2>
//           {safeSales.length === 0 ? (
//             <p className="text-sm text-gray-500">No bills yet.</p>
//           ) : (
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="p-2 text-left">Bill No</th>
//                   <th className="p-2 text-left">Date</th>
//                   <th className="p-2 text-right">Total</th>
//                   <th className="p-2 text-right">Paid</th>
//                   <th className="p-2 text-right">Balance</th>
//                   <th className="p-2 text-right">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeSales.map((s) => (
//                   <tr key={s._id} className="border-t">
//                     <td className="p-2">{s.billNumber}</td>
//                     <td className="p-2">
//                       {new Date(s.createdAt).toLocaleString()}
//                     </td>
//                     <td className="p-2 text-right">₹{s.grandTotal}</td>
//                     <td className="p-2 text-right">₹{s.paidAmount}</td>
//                     <td className="p-2 text-right">₹{s.balance}</td>
//                     <td className="p-2 text-right">
//                       {s.balance > 0 ? "Pending" : "Complete"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         <div className="mt-4 flex gap-2">
//           <button
//             onClick={() => navigate(`/sales/new/${customer._id}`)}
//             className="px-4 py-2 bg-slate-900 text-white rounded"
//           >
//             + New Sale
//           </button>
//           <button
//             onClick={handleSendSummarySms}
//             className="px-4 py-2 bg-emerald-600 text-white rounded"
//           >
//             📱 Send Pending SMS
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerHistory;


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
  const [payData, setPayData] = useState({ amount: "", method: "CASH" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [expandedRows, setExpandedRows] = useState({}); // track which bill rows are expanded

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const c = await getCustomerById(customerId);
        setCustomer(c);
      } catch (err) {
        console.error("Customer load failed:", err);
        setCustomer(null);
      }

      try {
        const s = await getCustomerSales(customerId);
        setSales(Array.isArray(s) ? s : []);
      } catch (err) {
        console.error("Sales load failed:", err);
        setSales([]);
      }

      setLoading(false);
    };
    load();
  }, [customerId]);

  const safeSales = Array.isArray(sales) ? sales : [];

  // ── Sort bills by billNumber ascending (1, 2, 3 ...)
  const sortedSales = [...safeSales].sort(
    (a, b) => Number(a.billNumber) - Number(b.billNumber)
  );

  const totalBilled  = safeSales.reduce((sum, s) => sum + (s.grandTotal  || 0), 0);
  const totalPaid    = safeSales.reduce((sum, s) => sum + (s.paidAmount  || 0), 0);
  const totalBalance = safeSales.reduce((sum, s) => sum + (s.balance     || 0), 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePay = async () => {
    setError("");
    const amount = Number(payData.amount || 0);
    if (amount <= 0) { setError("Enter amount > 0"); return; }

    try {
      setSaving(true);
      await payCustomer(customerId, { amount, method: payData.method });
      alert("Payment saved ✅");

      const c = await getCustomerById(customerId);
      const s = await getCustomerSales(customerId);
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
    if (!customer.phone) { alert("No phone number for this customer"); return; }
    const msg = `Sawali Traders: Your pending amount is ₹${totalBalance.toFixed(2)}. Total billed: ₹${totalBilled.toFixed(2)}, paid: ₹${totalPaid.toFixed(2)}.`;
    try {
      await sendSms({ phone: customer.phone, message: msg });
      alert("SMS sent ✅");
    } catch (err) {
      console.error(err);
      alert("Error sending SMS");
    }
  };

  // Toggle expand/collapse for a bill row
  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading history...</p>
      </div>
    );
  }

  /* ── Not found ── */
  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-400 text-sm">Customer not found.</p>
      </div>
    );
  }

  /* ── Main ── */
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate("/customers")}
          className="mb-5 text-sm text-gray-400 hover:text-gray-200 transition-colors duration-150"
        >
          ← Back to Customers
        </button>

        {/* Customer info */}
        <h1 className="text-2xl font-bold text-white mb-1">{customer.name}</h1>
        <p className="text-sm text-gray-400 mb-1">Phone: {customer.phone || "-"}</p>
        <p className="text-sm text-gray-400 mb-6">
          Type: {customer.customerType}
          {customer.customerType === "Dairy" && customer.dairyOwnerName
            ? ` (Owner: ${customer.dairyOwnerName})`
            : ""}
        </p>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Total Billed</p>
            <p className="text-2xl font-bold text-white">₹{totalBilled.toFixed(2)}</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-green-400">₹{totalPaid.toFixed(2)}</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Pending Balance</p>
            <p className={`text-2xl font-bold ${totalBalance > 0 ? "text-red-400" : "text-green-400"}`}>
              ₹{totalBalance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Payment form – only when balance pending */}
        {totalBalance > 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-6">
            <h2 className="text-base font-semibold text-white mb-4">Take Payment</h2>

            {error && <p className="text-sm text-red-400 mb-3">⚠ {error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={payData.amount}
                  onChange={handleChange}
                  placeholder="₹ amount"
                  className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 placeholder-gray-500
                             focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Method</label>
                <select
                  name="method"
                  value={payData.method}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2
                             focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                >
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI / Online</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handlePay}
                  disabled={saving}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed
                             text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors duration-150"
                >
                  {saving ? "Saving..." : "Save Payment"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bills History */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Bills History</h2>
            <span className="text-xs text-gray-500">
              👆 Row वर click करा — products पाहा
            </span>
          </div>

          {sortedSales.length === 0 ? (
            <p className="text-sm text-gray-500">No bills yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-3 w-6"></th>{/* expand icon */}
                    <th className="pb-3 text-left  text-xs font-medium text-gray-400 uppercase tracking-wider">Sr.No</th>
                    <th className="pb-3 text-left   text-xs font-medium text-gray-400 uppercase tracking-wider">Bill No</th>
                    <th className="pb-3 text-left   text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="pb-3 text-left   text-xs font-medium text-gray-400 uppercase tracking-wider">Products</th>
                    <th className="pb-3 text-right  text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                    <th className="pb-3 text-right  text-xs font-medium text-gray-400 uppercase tracking-wider">Paid</th>
                    <th className="pb-3 text-right  text-xs font-medium text-gray-400 uppercase tracking-wider">Balance</th>
                    <th className="pb-3 text-right  text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
              {sortedSales.map((s, index) => {
                    const isOpen = !!expandedRows[s._id];
                    // items array: [{ productName, quantity, unit, price, total }, ...]
                    const items = Array.isArray(s.items) ? s.items : [];
                    // short summary for the Products column
                    const productSummary =
                      items.length > 0
                        ? items.map((i) => i?.productId?.name || "—").join(", ")
                        : "—";

                    return (
                      <React.Fragment key={s._id}>
                        {/* Main bill row */}
                        <tr
                          onClick={() => toggleRow(s._id)}
                          className="border-t border-gray-700 hover:bg-gray-700/40 cursor-pointer transition-colors duration-100"
                        >
                          {/* Expand arrow */}
                          <td className="py-3 pr-2 text-gray-500 text-xs select-none">
                            {isOpen ? "▼" : "▶"}
                          </td>
                          <td className="py-3 text-gray-400">{index + 1}</td>

                          <td className="py-3 text-gray-200 font-medium">#{s.billNumber}</td>

                          <td className="py-3 text-gray-400 whitespace-nowrap">
                            {new Date(s.createdAt).toLocaleString()}
                          </td>

                          {/* Products summary */}
                          <td className="py-3 text-gray-300 max-w-[180px] truncate">
                            {productSummary}
                          </td>

                          <td className="py-3 text-right text-gray-200">₹{s.grandTotal}</td>
                          <td className="py-3 text-right text-gray-200">₹{s.paidAmount}</td>
                          <td className="py-3 text-right text-gray-200">₹{s.balance}</td>
                          <td className="py-3 text-right">
                            {s.balance > 0
                              ? <span className="text-red-400  font-medium">Pending</span>
                              : <span className="text-green-400 font-medium">Complete</span>}
                          </td>
                        </tr>

                        {/* Expanded product detail row */}
                        {isOpen && (
                          <tr className="border-t border-gray-700/50 bg-gray-900/60">
                            <td colSpan={9} className="px-6 py-3">
                              {items.length === 0 ? (
                                <p className="text-xs text-gray-500 italic">No product details available.</p>
                              ) : (
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="text-gray-500 uppercase tracking-wider">
                                      <th className="pb-2 text-left font-medium">Product</th>
                                      <th className="pb-2 text-right font-medium">Qty</th>
                                      <th className="pb-2 text-right font-medium">Unit</th>
                                      <th className="pb-2 text-right font-medium">Price</th>
                                      <th className="pb-2 text-right font-medium">Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-700/50">
                                    {items.map((item, idx) => (
                                      <tr key={idx}>
                                        <td className="py-1.5 text-gray-300">
                                          {item?.productId?.name }
                                        </td>
                                        <td className="py-1.5 text-right text-gray-300">
                                          {item.quantity ?? "—"}
                                        </td>
                                        <td className="py-1.5 text-right text-gray-400">
                                          {item?.productId?.unit }
                                        </td>
                                        <td className="py-1.5 text-right text-gray-300">
                                          ₹{item.price ?? item.rate ?? "—"}
                                        </td>
                                        <td className="py-1.5 text-right text-white font-medium">
                                          ₹{item.quantity * item.rate}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => navigate(`/sales/new/${customer._id}`)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600
                       text-white text-sm font-medium rounded-lg transition-colors duration-150"
          >
            + New Sale
          </button>

          <button
            onClick={handleSendSummarySms}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500
                       text-white text-sm font-medium rounded-lg transition-colors duration-150"
          >
            📱 Send Pending SMS
          </button>
        </div>

      </div>
    </div>
  );
};

export default CustomerHistory;
