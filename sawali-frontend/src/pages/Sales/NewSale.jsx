
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { createOrGetCustomer, getCustomerById } from "../../api/customerApi";
// import { getAllProducts } from "../../api/productApi";
// import { createSale } from "../../api/salesApi";
// import { getAllDairyOwners } from "../../api/dairyOwnerApi";

// const NewSale = () => {
//   const navigate = useNavigate();
//   const { customerId: existingCustomerId } = useParams();

//   const [step, setStep] = useState(1);
//   const [products, setProducts] = useState([]);
//   const [dairyOwners, setDairyOwners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [billDate] = useState(() => new Date());

//   const [customerInfo, setCustomerInfo] = useState({
//     name: "", phone: "", customerType: "Normal", dairyOwnerId: "",
//   });

//   const [items, setItems] = useState([
//     { productId: "", productName: "", quantity: "", rate: "", availableStock: null },
//   ]);

//   const [paymentInfo, setPaymentInfo] = useState({
//     paymentStatus: "COMPLETE", paymentMode: "CASH", paidAmount: "", notes: "",
//   });

//   const totalAmount = items.reduce((sum, item) =>
//     sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         const [prodData, ownerData] = await Promise.all([getAllProducts(), getAllDairyOwners()]);
//         setProducts(Array.isArray(prodData) ? prodData : []);
//         setDairyOwners(Array.isArray(ownerData) ? ownerData : []);
//       } catch { setError("Failed to load products/dairy owners"); }
//       finally { setLoading(false); }
//     };
//     load();
//   }, []);

//   useEffect(() => {
//     if (!existingCustomerId) return;
//     getCustomerById(existingCustomerId).then((c) =>
//       setCustomerInfo({ name: c.name || "", phone: c.phone || "", customerType: c.customerType || "Normal", dairyOwnerId: c.dairyOwnerId || "" })
//     ).catch(console.error);
//   }, [existingCustomerId]);

//   useEffect(() => {
//     const handler = (e) => {
//       if (e.key === "F10" && step === 2) { e.preventDefault(); document.getElementById("confirmBtn")?.click(); }
//     };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [step]);

//   const handleCustomerChange = (e) => {
//     const { name, value } = e.target;
//     setCustomerInfo((prev) => ({ ...prev, [name]: value, ...(name === "customerType" && value === "Normal" ? { dairyOwnerId: "" } : {}) }));
//   };

//   const handleItemChange = (index, field, value) =>
//     setItems((prev) => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));

//   // ── Feature 1, 2, 3: Stock check on product select ─────────────────────────
//   const handleProductSelect = (index, productId) => {
//     const product = products.find((p) => p._id === productId);

//     // Feature 2: Block out of stock
//     if (product && (product.currentStock ?? 0) <= 0) {
//       setError(`⚠ "${product.name}" Out of Stock आहे! हे product add करता येत नाही.`);
//       return;
//     }

//     setError("");
//     setItems((prev) => prev.map((row, i) =>
//       i === index ? {
//         ...row,
//         productId,
//         productName: product?.name || "",
//         rate: product?.salePrice || "",
//         availableStock: product?.currentStock ?? null, // ← stock store करतो
//       } : row
//     ));
//   };

//   const addRow = () => setItems((prev) => [...prev, { productId: "", productName: "", quantity: "", rate: "", availableStock: null }]);
//   const removeRow = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

//   const goToBillStep = (e) => {
//     e.preventDefault();
//     setError("");
//     if (!existingCustomerId && !customerInfo.name.trim()) return setError("Please enter customer name");
//     if (customerInfo.customerType === "Dairy" && !existingCustomerId && !customerInfo.dairyOwnerId) return setError("Please select Dairy Owner");
//     if (!items.some((i) => i.productId && i.quantity && i.rate)) return setError("Please add at least one product row");
//     if (totalAmount <= 0) return setError("Total must be greater than 0");

//     // Feature 4: Block if any qty > stock
//     const overStock = items.find(
//       (i) => i.productId && i.availableStock !== null && Number(i.quantity) > i.availableStock
//     );
//     if (overStock) {
//       return setError(`⚠ "${overStock.productName}" साठी फक्त ${overStock.availableStock} stock शिल्लक आहे!`);
//     }

//     setPaymentInfo((prev) => prev.paymentStatus === "PENDING"
//       ? { ...prev, paidAmount: "0" }
//       : { ...prev, paidAmount: prev.paidAmount || String(totalAmount) });
//     setStep(2);
//   };

//   const handleConfirmSale = async () => {
//     setError("");
//     try {
//       setSaving(true);
//       let finalCustomerId = existingCustomerId;
//       if (!finalCustomerId) {
//         const doc = await createOrGetCustomer({
//           name: customerInfo.name, phone: customerInfo.phone,
//           customerType: customerInfo.customerType,
//           dairyOwnerId: customerInfo.customerType === "Dairy" ? customerInfo.dairyOwnerId || null : null,
//         });
//         finalCustomerId = doc._id;
//       }
//       const numericPaid = paymentInfo.paymentStatus === "PENDING" ? 0 : Number(paymentInfo.paidAmount) || totalAmount;
//       const sale = await createSale({
//         customerId: finalCustomerId,
//         items: items.map((i) => ({ productId: i.productId, quantity: Number(i.quantity), rate: Number(i.rate) })),
//         paidAmount: numericPaid,
//         paymentMode: paymentInfo.paymentStatus === "PENDING" ? "CREDIT" : paymentInfo.paymentMode,
//         notes: paymentInfo.notes,
//       });
//       alert(`Bill created!\nBill No: ${sale.billNumber}\nTotal: ₹${sale.grandTotal}\nPaid: ₹${sale.paidAmount}\nBalance: ₹${sale.balance}`);
//       navigate(`/customers/${finalCustomerId}/history`);
//     } catch (err) {
//       setError(err.response?.data?.error || err.message || "Failed to create bill");
//     } finally { setSaving(false); }
//   };

//   // const inputCls = "w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors";
//   // const labelCls = "block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5";

//   const inputCls = "w-full bg-gray-600 border border-gray-500 text-white text-sm rounded-lg px-3 py-2.5 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors";
// const labelCls = "block text-xs font-medium text-gray-200 uppercase tracking-wider mb-1.5";

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <p className="text-gray-400 text-sm">Loading...</p>
//       </div>
//     );
//   }

//   // ─── STEP 1 ───────────────────────────────────────────────────────────────
//   if (step === 1) {
//     return (
//     <div className="min-h-screen bg-[#0f1117] text-gray-100 p-6">
//         <div className="max-w-4xl mx-auto">

//           <div className="mb-6">
//             <h1 className="text-xl font-semibold text-white">New Sale Entry</h1>
//             <p className="text-xs text-gray-300 mt-0.5">Step 1 of 2 — Customer & Products</p>
//           </div>

//           {error && (
//             <div className="bg-red-900/40 border border-red-800 text-red-300 text-sm rounded-xl px-4 py-3 mb-4">
//               {error}
//             </div>
//           )}

//           {/* Customer Details */}
//           <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-4">
//             <p className="text-xs font-medium text-gray-200 uppercase tracking-wider mb-4">Customer Details</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className={labelCls}>Customer Name</label>
//                 <input className={`${inputCls} ${existingCustomerId ? "opacity-50 cursor-not-allowed" : ""}`}
//                   name="name" value={customerInfo.name} onChange={handleCustomerChange}
//                   placeholder="Enter customer name" disabled={!!existingCustomerId} />
//               </div>
//               <div>
//                 <label className={labelCls}>Date & Time</label>
//                 <input className={`${inputCls} opacity-50 cursor-not-allowed`} readOnly value={billDate.toLocaleString()} />
//               </div>
//               <div>
//                 <label className={labelCls}>Phone</label>
//                 <input className={`${inputCls} ${existingCustomerId ? "opacity-50 cursor-not-allowed" : ""}`}
//                   name="phone" value={customerInfo.phone} onChange={handleCustomerChange}
//                   placeholder="Phone number (optional)" disabled={!!existingCustomerId} />
//               </div>
//               <div>
//                 <label className={labelCls}>Customer Type</label>
//                 <select className={`${inputCls} ${existingCustomerId ? "opacity-50 cursor-not-allowed" : ""}`}
//                   name="customerType" value={customerInfo.customerType}
//                   onChange={handleCustomerChange} disabled={!!existingCustomerId}>
//                   <option value="Normal">Normal Customer</option>
//                   <option value="Dairy">Dairy Customer</option>
//                 </select>
//               </div>
//               {customerInfo.customerType === "Dairy" && !existingCustomerId && (
//                 <div className="md:col-span-2">
//                   <label className={labelCls}>Dairy Owner</label>
//                   <select className={inputCls} name="dairyOwnerId" value={customerInfo.dairyOwnerId} onChange={handleCustomerChange}>
//                     <option value="">Select dairy owner</option>
//                     {dairyOwners.map((o) => <option key={o._id} value={o._id}>{o.name} ({o.phone})</option>)}
//                   </select>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Products */}
//           <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-4">
//             <p className="text-xs font-medium text-gray-200 uppercase tracking-wider mb-4">Products</p>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b border-gray-700">
//                     {["Product", "Qty", "Rate", "Amount", ""].map((h, i) => (
//                       <th key={i} className="pb-3 text-left text-xs font-semibold text-white uppercase tracking-wider pr-3">{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {items.map((row, index) => {
//                     const amount = (Number(row.quantity) || 0) * (Number(row.rate) || 0);
//                     const qty = Number(row.quantity) || 0;
//                     const stock = row.availableStock;

//                     // Feature 4: qty > stock warning
//                     const overStock = row.productId && stock !== null && qty > stock;
//                     // Low stock warning
//                     const lowStock  = row.productId && stock !== null && stock <= 10 && stock > 0 && !overStock;

//                     return (
//                       <React.Fragment key={index}>
//                         <tr>
//                           {/* Feature 1: dropdown with stock count */}
//                           <td className="py-3 pr-3 min-w-[200px]">
//                             <select
//                               className={`${inputCls} ${overStock ? "border-red-600 focus:border-red-500 focus:ring-red-500" : ""}`}
//                               value={row.productId}
//                               onChange={(e) => handleProductSelect(index, e.target.value)}
//                             >
//                               <option value="">Select product</option>
//                               {products.map((p) => {
//                                 const s = p.currentStock ?? 0;
//                                 const isOut = s <= 0;
//                                 return (
//                                   // Feature 2: disabled if out of stock
//                                   <option key={p._id} value={p._id} disabled={isOut}>
//                                     {p.name}
//                                     {isOut
//                                       ? " — Out of Stock 🔴"
//                                       : s <= 10
//                                       ? ` (Stock: ${s} 🟡)`
//                                       : ` (Stock: ${s})`}
//                                   </option>
//                                 );
//                               })}
//                             </select>
//                           </td>

//                           <td className="py-3 pr-3 min-w-[90px]">
//                             <input
//                               className={`${inputCls} ${overStock ? "border-red-600 focus:border-red-500 focus:ring-red-500" : ""}`}
//                               type="number" value={row.quantity}
//                               onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
//                               placeholder="Qty"
//                             />
//                           </td>

//                           <td className="py-3 pr-3 min-w-[100px]">
//                             <input className={inputCls} type="number" value={row.rate}
//                               onChange={(e) => handleItemChange(index, "rate", e.target.value)} placeholder="Rate" />
//                           </td>

//                           <td className="py-3 pr-3 text-right text-orange-400 font-medium whitespace-nowrap">
//                             ₹{amount.toFixed(2)}
//                           </td>

//                           <td className="py-3 text-center">
//                             {items.length > 1 && (
//                               <button onClick={() => removeRow(index)}
//                                 className="bg-red-900/40 hover:bg-red-900/70 border border-red-800 text-red-300 text-xs px-2 py-1.5 rounded-lg transition-colors">
//                                 🗑
//                               </button>
//                             )}
//                           </td>
//                         </tr>

//                         {/* Feature 3 & 4: Inline stock warnings per row */}
//                         {overStock && (
//                           <tr>
//                             <td colSpan={5} className="pb-2">
//                               <div className="flex items-center gap-2 bg-red-900/30 border border-red-800 text-red-300 text-xs rounded-lg px-3 py-2">
//                                 🔴 <span>फक्त <strong>{stock}</strong> stock शिल्लक आहे! तुम्ही <strong>{qty}</strong> टाकले आहे.</span>
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                         {lowStock && (
//                           <tr>
//                             <td colSpan={5} className="pb-2">
//                               <div className="flex items-center gap-2 bg-amber-900/30 border border-amber-800 text-amber-300 text-xs rounded-lg px-3 py-2">
//                                 🟡 <span>Low Stock: फक्त <strong>{stock}</strong> शिल्लक आहे.</span>
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//             <button onClick={addRow}
//               className="mt-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-300 text-xs px-4 py-2 rounded-lg transition-colors">
//               + Add New Product Row
//             </button>
//           </div>

//           {/* Footer */}
//           <div className="flex justify-between items-center">
//             <div className="text-lg font-semibold text-orange-400">
//               Total: ₹{totalAmount.toFixed(2)}
//             </div>
//             <button onClick={goToBillStep}
//               className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">
//               Next → Billing
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ─── STEP 2 ───────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
//       <div className="max-w-2xl mx-auto">

//         <div className="mb-6">
//           <h1 className="text-xl font-semibold text-white">Bill Generation</h1>
//           <p className="text-xs text-gray-300 mt-0.5">Step 2 of 2 — Review & Confirm</p>
//         </div>

//         {error && (
//           <div className="bg-red-900/40 border border-red-800 text-red-300 text-sm rounded-xl px-4 py-3 mb-4">
//             ⚠ {error}
//           </div>
//         )}

//         {/* Customer + Items */}
//         <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-4">
//           <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Customer Details</p>
//           <div className="text-sm text-gray-300 space-y-1 mb-4">
//             <div><span className="text-gray-400">Name:</span> {customerInfo.name || "(Existing)"}</div>
//             <div><span className="text-gray-400">Phone:</span> {customerInfo.phone || "—"}</div>
//             <div><span className="text-gray-400">Type:</span> {customerInfo.customerType}</div>
//           </div>

//           <div className="border-t border-gray-700 pt-4">
//             <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Bill Items</p>
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-gray-700">
//                   {["Product","Qty","Rate","Amount"].map((h) => (
//                     <th key={h} className="pb-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-700/50">
//                 {items.map((row, i) => {
//                   const amt = (Number(row.quantity) || 0) * (Number(row.rate) || 0);
//                   return (
//                     <tr key={i}>
//                       <td className="py-2.5 text-gray-200">{row.productName}</td>
//                       <td className="py-2.5 text-white">{row.quantity}</td>
//                       <td className="py-2.5 text-white">₹{row.rate}</td>
//                       <td className="py-2.5 text-right text-orange-400 font-medium">₹{amt.toFixed(2)}</td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//             <div className="text-right mt-3 text-base font-semibold text-orange-400">
//               Grand Total: ₹{totalAmount.toFixed(2)}
//             </div>
//           </div>
//         </div>

//         {/* Payment */}
//         <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-4">
//           <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Payment Details</p>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className={labelCls}>Payment Status</label>
//               <select className={inputCls} value={paymentInfo.paymentStatus}
//                 onChange={(e) => setPaymentInfo((p) => ({ ...p, paymentStatus: e.target.value }))}>
//                 <option value="COMPLETE">Complete</option>
//                 <option value="PENDING">Pending (Udhar)</option>
//               </select>
//             </div>
//             {paymentInfo.paymentStatus === "COMPLETE" && (
//               <>
//                 <div>
//                   <label className={labelCls}>Payment Mode</label>
//                   <select className={inputCls} value={paymentInfo.paymentMode}
//                     onChange={(e) => setPaymentInfo((p) => ({ ...p, paymentMode: e.target.value }))}>
//                     <option value="CASH">Cash</option>
//                     <option value="ONLINE">Online / UPI</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className={labelCls}>Paid Amount</label>
//                   <input className={inputCls} type="number" value={paymentInfo.paidAmount}
//                     onChange={(e) => setPaymentInfo((p) => ({ ...p, paidAmount: e.target.value }))}
//                     placeholder={String(totalAmount)} />
//                 </div>
//               </>
//             )}
//           </div>
//           <div className="mt-4">
//             <label className={labelCls}>Notes</label>
//             <input className={inputCls} value={paymentInfo.notes}
//               onChange={(e) => setPaymentInfo((p) => ({ ...p, notes: e.target.value }))}
//               placeholder="Optional" />
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex justify-between items-center">
//           <button onClick={() => setStep(1)}
//             className="bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-300 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
//             ← Back
//           </button>
//           <button id="confirmBtn" onClick={handleConfirmSale} disabled={saving}
//             className={`flex flex-col items-center gap-0.5 px-7 py-2.5 rounded-xl text-sm font-semibold transition-colors
//               ${saving ? "bg-emerald-800 cursor-not-allowed text-emerald-300" : "bg-emerald-600 hover:bg-emerald-500 text-white"}`}>
//             <span>🖨 {saving ? "Saving..." : "Confirm & Save Bill"}</span>
//             {!saving && <span className="text-xs opacity-60">(F10)</span>}
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default NewSale;


// src/pages/Sales/NewSale.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createOrGetCustomer, getCustomerById } from "../../api/customerApi";
import { getAllProducts } from "../../api/productApi";
import { createSale } from "../../api/salesApi";
import { getAllDairyOwners } from "../../api/dairyOwnerApi";

// ─── WhatsApp Bill Message formatter ────────────────────────────────────────
const buildWhatsAppMessage = (sale, customerInfo, items) => {
  const date = new Date(sale.createdAt || Date.now()).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
  const itemLines = items
    .filter((i) => i.productId && i.quantity && i.rate)
    .map((i) => `  • ${i.productName} x${i.quantity} bag = ₹${(Number(i.quantity) * Number(i.rate)).toLocaleString("en-IN")}`)
    .join("\n");
  const pending = (sale.grandTotal || 0) - (sale.paidAmount || 0);

  return `🐄 *SAWALI TRADERS*
━━━━━━━━━━━━━━━━━━━
📋 Bill No: *#${sale.billNumber}*
📅 Date: ${date}
👤 Customer: *${customerInfo.name || "Customer"}*
━━━━━━━━━━━━━━━━━━━
🛒 *Items:*
${itemLines}
━━━━━━━━━━━━━━━━━━━
💰 Total:  *₹${(sale.grandTotal || 0).toLocaleString("en-IN")}*
✅ Paid:   ₹${(sale.paidAmount || 0).toLocaleString("en-IN")}
${pending > 0 ? `⏳ Pending: *₹${pending.toLocaleString("en-IN")}*` : `✅ *Fully Paid*`}
━━━━━━━━━━━━━━━━━━━
धन्यवाद! 🙏
Sawali Traders, Sangli`;
};

// ─── Bill Success Modal ──────────────────────────────────────────────────────
const BillSuccessModal = ({ sale, customerInfo, items, onClose }) => {
  const [countdown, setCountdown] = useState(3);
  const [sent, setSent] = useState(false);

  const openWhatsApp = () => {
    const msg = buildWhatsAppMessage(sale, customerInfo, items);
    const phone = customerInfo.phone?.replace(/\D/g, "");
    const url = phone
      ? `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setSent(true);
  };

  useEffect(() => {
    if (countdown === 0) { openWhatsApp(); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const pending = (sale.grandTotal || 0) - (sale.paidAmount || 0);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999,
    }}>
      <div style={{
        background: "#111827",
        border: "0.5px solid #1f2937",
        borderRadius: 16,
        padding: "2rem 1.75rem",
        width: "100%", maxWidth: 420,
        textAlign: "center",
      }}>
        {/* Success Icon */}
        <div style={{
          width: 68, height: 68, borderRadius: "50%",
          background: "#14532d", border: "2px solid #22c55e",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.25rem", fontSize: 28,
        }}>✅</div>

        <h2 style={{ margin: "0 0 0.25rem", fontSize: 20, fontWeight: 700, color: "#fff" }}>
          Bill Confirmed!
        </h2>
        <p style={{ margin: "0 0 1.25rem", fontSize: 13, color: "#9ca3af" }}>
          Bill #{sale.billNumber} successfully save झाला
        </p>

        {/* Summary rows */}
        {[
          { label: "Customer",     value: customerInfo.name || "—",                         color: "#fff" },
          { label: "Grand Total",  value: `₹${(sale.grandTotal || 0).toLocaleString("en-IN")}`, color: "#34d399" },
          { label: "Paid",         value: `₹${(sale.paidAmount || 0).toLocaleString("en-IN")}`, color: "#34d399" },
          ...(pending > 0 ? [{ label: "Pending", value: `₹${pending.toLocaleString("en-IN")}`, color: "#f87171" }] : []),
        ].map((row) => (
          <div key={row.label} style={{
            display: "flex", justifyContent: "space-between",
            background: "#1f2937", borderRadius: 8,
            padding: "9px 14px", marginBottom: 8, fontSize: 13,
          }}>
            <span style={{ color: "#9ca3af" }}>{row.label}</span>
            <span style={{ color: row.color, fontWeight: 600 }}>{row.value}</span>
          </div>
        ))}

        {/* Countdown notice */}
        {!sent && (
          <div style={{
            background: "#052e16", border: "0.5px solid #166534",
            borderRadius: 8, padding: "10px 14px",
            margin: "14px 0 0",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#25d366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span style={{ fontSize: 13, color: "#86efac" }}>
              <strong style={{ fontSize: 16 }}>{countdown}</strong> seconds मध्ये WhatsApp automatically उघडेल...
            </span>
          </div>
        )}

        {/* WhatsApp button */}
        <button
          onClick={openWhatsApp}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%",
            background: sent ? "#14532d" : "#15803d",
            border: "none", borderRadius: 10,
            padding: "12px", color: "#fff",
            fontSize: 14, fontWeight: 600,
            cursor: "pointer", marginTop: 12,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {sent ? "✅ WhatsApp उघडले! पुन्हा पाठवायचं?" : "आत्ताच WhatsApp वर पाठवा"}
        </button>

        {/* Skip */}
        <button
          onClick={onClose}
          style={{
            width: "100%", background: "transparent",
            border: "0.5px solid #1f2937", borderRadius: 10,
            padding: "10px", color: "#6b7280",
            fontSize: 13, cursor: "pointer", marginTop: 8,
          }}
        >
          Skip — नंतर पाठवतो
        </button>
      </div>
    </div>
  );
};

// ─── Main NewSale Component ──────────────────────────────────────────────────
const NewSale = () => {
  const navigate = useNavigate();
  const { customerId: existingCustomerId } = useParams();

  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [dairyOwners, setDairyOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [billDate] = useState(() => new Date());

  // ✅ CHANGE 1: success state add केला
  const [successData, setSuccessData] = useState(null);

  const [customerInfo, setCustomerInfo] = useState({
    name: "", phone: "", customerType: "Normal", dairyOwnerId: "",
  });

  const [items, setItems] = useState([
    { productId: "", productName: "", quantity: "", rate: "", availableStock: null },
  ]);

  const [paymentInfo, setPaymentInfo] = useState({
    paymentStatus: "COMPLETE", paymentMode: "CASH", paidAmount: "", notes: "",
  });

  const totalAmount = items.reduce((sum, item) =>
    sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [prodData, ownerData] = await Promise.all([getAllProducts(), getAllDairyOwners()]);
        setProducts(Array.isArray(prodData) ? prodData : []);
        setDairyOwners(Array.isArray(ownerData) ? ownerData : []);
      } catch { setError("Failed to load products/dairy owners"); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  useEffect(() => {
    if (!existingCustomerId) return;
    getCustomerById(existingCustomerId).then((c) =>
      setCustomerInfo({ name: c.name || "", phone: c.phone || "", customerType: c.customerType || "Normal", dairyOwnerId: c.dairyOwnerId || "" })
    ).catch(console.error);
  }, [existingCustomerId]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "F10" && step === 2) { e.preventDefault(); document.getElementById("confirmBtn")?.click(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [step]);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value, ...(name === "customerType" && value === "Normal" ? { dairyOwnerId: "" } : {}) }));
  };

  const handleItemChange = (index, field, value) =>
    setItems((prev) => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));

  const handleProductSelect = (index, productId) => {
    const product = products.find((p) => p._id === productId);
    if (product && (product.currentStock ?? 0) <= 0) {
      setError(`⚠ "${product.name}" Out of Stock आहे!`);
      return;
    }
    setError("");
    setItems((prev) => prev.map((row, i) =>
      i === index ? {
        ...row,
        productId,
        productName: product?.name || "",
        rate: product?.salePrice || "",
        availableStock: product?.currentStock ?? null,
      } : row
    ));
  };

  const addRow = () => setItems((prev) => [...prev, { productId: "", productName: "", quantity: "", rate: "", availableStock: null }]);
  const removeRow = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  const goToBillStep = (e) => {
    e.preventDefault();
    setError("");
    if (!existingCustomerId && !customerInfo.name.trim()) return setError("Please enter customer name");
    if (customerInfo.customerType === "Dairy" && !existingCustomerId && !customerInfo.dairyOwnerId) return setError("Please select Dairy Owner");
    if (!items.some((i) => i.productId && i.quantity && i.rate)) return setError("Please add at least one product row");
    if (totalAmount <= 0) return setError("Total must be greater than 0");
    const overStock = items.find((i) => i.productId && i.availableStock !== null && Number(i.quantity) > i.availableStock);
    if (overStock) return setError(`⚠ "${overStock.productName}" साठी फक्त ${overStock.availableStock} stock शिल्लक!`);
    setPaymentInfo((prev) => prev.paymentStatus === "PENDING"
      ? { ...prev, paidAmount: "0" }
      : { ...prev, paidAmount: prev.paidAmount || String(totalAmount) });
    setStep(2);
  };

  // ✅ CHANGE 2: alert काढला → successData set केला
  const handleConfirmSale = async () => {
    setError("");
    try {
      setSaving(true);
      let finalCustomerId = existingCustomerId;
      if (!finalCustomerId) {
        const doc = await createOrGetCustomer({
          name: customerInfo.name, phone: customerInfo.phone,
          customerType: customerInfo.customerType,
          dairyOwnerId: customerInfo.customerType === "Dairy" ? customerInfo.dairyOwnerId || null : null,
        });
        finalCustomerId = doc._id;
      }
      const numericPaid = paymentInfo.paymentStatus === "PENDING" ? 0 : Number(paymentInfo.paidAmount) || totalAmount;
      const sale = await createSale({
        customerId: finalCustomerId,
        items: items.map((i) => ({ productId: i.productId, quantity: Number(i.quantity), rate: Number(i.rate) })),
        paidAmount: numericPaid,
        paymentMode: paymentInfo.paymentStatus === "PENDING" ? "CREDIT" : paymentInfo.paymentMode,
        notes: paymentInfo.notes,
      });

      // ✅ alert ऐवजी modal दाखवतो
      setSuccessData({ sale, finalCustomerId });

    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to create bill");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full bg-gray-600 border border-gray-500 text-white text-sm rounded-lg px-3 py-2.5 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors";
  const labelCls = "block text-xs font-medium text-gray-200 uppercase tracking-wider mb-1.5";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  // ─── STEP 1 ───────────────────────────────────────────────────────────────
  if (step === 1) {
    return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-white">New Sale Entry</h1>
            <p className="text-xs text-gray-300 mt-0.5">Step 1 of 2 — Customer & Products</p>
          </div>
          {error && (
            <div className="bg-red-900/40 border border-red-800 text-red-300 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
          )}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-4">
            <p className="text-xs font-medium text-gray-200 uppercase tracking-wider mb-4">Customer Details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Customer Name</label>
                <input className={`${inputCls} ${existingCustomerId ? "opacity-50 cursor-not-allowed" : ""}`}
                  name="name" value={customerInfo.name} onChange={handleCustomerChange}
                  placeholder="Enter customer name" disabled={!!existingCustomerId} />
              </div>
              <div>
                <label className={labelCls}>Date & Time</label>
                <input className={`${inputCls} opacity-50 cursor-not-allowed`} readOnly value={billDate.toLocaleString()} />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input className={`${inputCls} ${existingCustomerId ? "opacity-50 cursor-not-allowed" : ""}`}
                  name="phone" value={customerInfo.phone} onChange={handleCustomerChange}
                  placeholder="Phone number (optional)" disabled={!!existingCustomerId} />
              </div>
              <div>
                <label className={labelCls}>Customer Type</label>
                <select className={`${inputCls} ${existingCustomerId ? "opacity-50 cursor-not-allowed" : ""}`}
                  name="customerType" value={customerInfo.customerType}
                  onChange={handleCustomerChange} disabled={!!existingCustomerId}>
                  <option value="Normal">Normal Customer</option>
                  <option value="Dairy">Dairy Customer</option>
                </select>
              </div>
              {customerInfo.customerType === "Dairy" && !existingCustomerId && (
                <div className="md:col-span-2">
                  <label className={labelCls}>Dairy Owner</label>
                  <select className={inputCls} name="dairyOwnerId" value={customerInfo.dairyOwnerId} onChange={handleCustomerChange}>
                    <option value="">Select dairy owner</option>
                    {dairyOwners.map((o) => <option key={o._id} value={o._id}>{o.name} ({o.phone})</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-4">
            <p className="text-xs font-medium text-gray-200 uppercase tracking-wider mb-4">Products</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    {["Product", "Qty", "Rate", "Amount", ""].map((h, i) => (
                      <th key={i} className="pb-3 text-left text-xs font-semibold text-white uppercase tracking-wider pr-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((row, index) => {
                    const amount = (Number(row.quantity) || 0) * (Number(row.rate) || 0);
                    const qty = Number(row.quantity) || 0;
                    const stock = row.availableStock;
                    const overStock = row.productId && stock !== null && qty > stock;
                    const lowStock = row.productId && stock !== null && stock <= 10 && stock > 0 && !overStock;
                    return (
                      <React.Fragment key={index}>
                        <tr>
                          <td className="py-3 pr-3 min-w-[200px]">
                            <select
                              className={`${inputCls} ${overStock ? "border-red-600" : ""}`}
                              value={row.productId}
                              onChange={(e) => handleProductSelect(index, e.target.value)}
                            >
                              <option value="">Select product</option>
                              {products.map((p) => {
                                const s = p.currentStock ?? 0;
                                const isOut = s <= 0;
                                return (
                                  <option key={p._id} value={p._id} disabled={isOut}>
                                    {p.name}{isOut ? " — Out of Stock 🔴" : s <= 10 ? ` (Stock: ${s} 🟡)` : ` (Stock: ${s})`}
                                  </option>
                                );
                              })}
                            </select>
                          </td>
                          <td className="py-3 pr-3 min-w-[90px]">
                            <input className={`${inputCls} ${overStock ? "border-red-600" : ""}`}
                              type="number" value={row.quantity}
                              onChange={(e) => handleItemChange(index, "quantity", e.target.value)} placeholder="Qty" />
                          </td>
                          <td className="py-3 pr-3 min-w-[100px]">
                            <input className={inputCls} type="number" value={row.rate}
                              onChange={(e) => handleItemChange(index, "rate", e.target.value)} placeholder="Rate" />
                          </td>
                          <td className="py-3 pr-3 text-right text-orange-400 font-medium whitespace-nowrap">
                            ₹{amount.toFixed(2)}
                          </td>
                          <td className="py-3 text-center">
                            {items.length > 1 && (
                              <button onClick={() => removeRow(index)}
                                className="bg-red-900/40 hover:bg-red-900/70 border border-red-800 text-red-300 text-xs px-2 py-1.5 rounded-lg transition-colors">
                                🗑
                              </button>
                            )}
                          </td>
                        </tr>
                        {overStock && (
                          <tr><td colSpan={5} className="pb-2">
                            <div className="flex items-center gap-2 bg-red-900/30 border border-red-800 text-red-300 text-xs rounded-lg px-3 py-2">
                              🔴 <span>फक्त <strong>{stock}</strong> stock शिल्लक! तुम्ही <strong>{qty}</strong> टाकले.</span>
                            </div>
                          </td></tr>
                        )}
                        {lowStock && (
                          <tr><td colSpan={5} className="pb-2">
                            <div className="flex items-center gap-2 bg-amber-900/30 border border-amber-800 text-amber-300 text-xs rounded-lg px-3 py-2">
                              🟡 <span>Low Stock: फक्त <strong>{stock}</strong> शिल्लक.</span>
                            </div>
                          </td></tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <button onClick={addRow}
              className="mt-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-300 text-xs px-4 py-2 rounded-lg transition-colors">
              + Add New Product Row
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold text-orange-400">Total: ₹{totalAmount.toFixed(2)}</div>
            <button onClick={goToBillStep}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">
              Next → Billing
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 2 ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-2xl mx-auto">

        {/* ✅ CHANGE 3: Modal render करतो */}
        {successData && (
          <BillSuccessModal
            sale={successData.sale}
            customerInfo={customerInfo}
            items={items}
            onClose={() => navigate(`/customers/${successData.finalCustomerId}/history`)}
          />
        )}

        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white">Bill Generation</h1>
          <p className="text-xs text-gray-300 mt-0.5">Step 2 of 2 — Review & Confirm</p>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-800 text-red-300 text-sm rounded-xl px-4 py-3 mb-4">⚠ {error}</div>
        )}

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Customer Details</p>
          <div className="text-sm text-gray-300 space-y-1 mb-4">
            <div><span className="text-gray-400">Name:</span> {customerInfo.name || "(Existing)"}</div>
            <div><span className="text-gray-400">Phone:</span> {customerInfo.phone || "—"}</div>
            <div><span className="text-gray-400">Type:</span> {customerInfo.customerType}</div>
          </div>
          <div className="border-t border-gray-700 pt-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Bill Items</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  {["Product", "Qty", "Rate", "Amount"].map((h) => (
                    <th key={h} className="pb-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {items.map((row, i) => {
                  const amt = (Number(row.quantity) || 0) * (Number(row.rate) || 0);
                  return (
                    <tr key={i}>
                      <td className="py-2.5 text-gray-200">{row.productName}</td>
                      <td className="py-2.5 text-white">{row.quantity}</td>
                      <td className="py-2.5 text-white">₹{row.rate}</td>
                      <td className="py-2.5 text-right text-orange-400 font-medium">₹{amt.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="text-right mt-3 text-base font-semibold text-orange-400">
              Grand Total: ₹{totalAmount.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Payment Details</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Payment Status</label>
              <select className={inputCls} value={paymentInfo.paymentStatus}
                onChange={(e) => setPaymentInfo((p) => ({ ...p, paymentStatus: e.target.value }))}>
                <option value="COMPLETE">Complete</option>
                <option value="PENDING">Pending (Udhar)</option>
              </select>
            </div>
            {paymentInfo.paymentStatus === "COMPLETE" && (
              <>
                <div>
                  <label className={labelCls}>Payment Mode</label>
                  <select className={inputCls} value={paymentInfo.paymentMode}
                    onChange={(e) => setPaymentInfo((p) => ({ ...p, paymentMode: e.target.value }))}>
                    <option value="CASH">Cash</option>
                    <option value="ONLINE">Online / UPI</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Paid Amount</label>
                  <input className={inputCls} type="number" value={paymentInfo.paidAmount}
                    onChange={(e) => setPaymentInfo((p) => ({ ...p, paidAmount: e.target.value }))}
                    placeholder={String(totalAmount)} />
                </div>
              </>
            )}
          </div>
          <div className="mt-4">
            <label className={labelCls}>Notes</label>
            <input className={inputCls} value={paymentInfo.notes}
              onChange={(e) => setPaymentInfo((p) => ({ ...p, notes: e.target.value }))} placeholder="Optional" />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button onClick={() => setStep(1)}
            className="bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-300 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
            ← Back
          </button>
          <button id="confirmBtn" onClick={handleConfirmSale} disabled={saving}
            className={`flex flex-col items-center gap-0.5 px-7 py-2.5 rounded-xl text-sm font-semibold transition-colors
              ${saving ? "bg-emerald-800 cursor-not-allowed text-emerald-300" : "bg-emerald-600 hover:bg-emerald-500 text-white"}`}>
            <span>🖨 {saving ? "Saving..." : "Confirm & Save Bill"}</span>
            {!saving && <span className="text-xs opacity-60">(F10)</span>}
          </button>
        </div>

      </div>
    </div>
  );
};

export default NewSale;
