// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllProducts } from "../../api/productApi";
// import {
//   getStockInEntries,
//   createStockInEntry,
// } from "../../api/stockInApi";
// import { getAllDistributors } from "../../api/distributorApi";


// const IncomingStock = () => {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [entries, setEntries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [distributors, setDistributors] = useState([]);

//   const [form, setForm] = useState({
//   distributorId: "",
//   productId: "",
//   rate: "",
//   quantity: "",
//   date: "",
// });


//   const [filter, setFilter] = useState({
//     from: "",
//     to: "",
//   });

//   const load = async () => {
//     try {
//       setLoading(true);
//       const [prodData, stockData, distData] = await Promise.all([
//   getAllProducts(),
//   getStockInEntries(filter.from, filter.to),
//   getAllDistributors(),
// ]);

// setDistributors(Array.isArray(distData) ? distData : []);

//       setProducts(Array.isArray(prodData) ? prodData : []);
//       setEntries(Array.isArray(stockData) ? stockData : []);
//     } catch (err) {
//       console.error("Error loading stock:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // initial

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilter((prev) => ({ ...prev, [name]: value }));
//   };

//   const applyFilter = async (e) => {
//     e.preventDefault();
//     await load();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!form.distributorId)
//  {
//       setError("Distributor name required");
//       return;
//     }
//     if (!form.productId) {
//       setError("Select product");
//       return;
//     }

//     try {
//       setSaving(true);
//       await createStockInEntry({
//         distributorId: form.distributorId,
//         productId: form.productId,
//         rate: Number(form.rate) || 0,
//         quantity: Number(form.quantity) || 0,
//         date: form.date || undefined,
//       });
//       await load();
//       setForm({
//         distributorId: "",
//         productId: "",
//         rate: "",
//         quantity: "",
//         date: "",
//       });
//     } catch (err) {
//       console.error(err);
//       setError(
//         err.response?.data?.error || "Error saving stock entry"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Safe reduce: always use an array
//   const safeEntries = Array.isArray(entries) ? entries : [];
//   const totalIncoming = safeEntries.reduce(
//     (sum, e) => sum + (e.total || 0),
//     0
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="mb-4 text-sm underline"
//         >
//           ← Back to Dashboard
//         </button>

//         <h1 className="text-2xl font-bold mb-4">
//           Incoming Stock (Distributors)
//         </h1>

//         {/* Add entry form */}
//         <div className="bg-white rounded-lg shadow p-4 mb-6">
//           <h2 className="text-lg font-semibold mb-3">Add Incoming Stock</h2>
//           {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

//           <form
//             onSubmit={handleSubmit}
//             className="grid grid-cols-1 md:grid-cols-5 gap-3"
//           >
//             <div className="md:col-span-2">
//               <label className="text-sm font-medium">Distributor Name</label>
//               <select
//   name="distributorId"
//   value={form.distributorId}
//   onChange={handleFormChange}
//   className="w-full border rounded px-3 py-2"
// >
//   <option value="">Select distributor</option>
//   {distributors.map((d) => (
//     <option key={d._id} value={d._id}>
//       {d.name} ({d.phone})
//     </option>
//   ))}
// </select>

//             </div>
//             <div>
//               <label className="text-sm font-medium">Product</label>
//               <select
//                 name="productId"
//                 value={form.productId}
//                 onChange={handleFormChange}
//                 className="w-full border rounded px-3 py-2"
//               >
//                 <option value="">Select</option>
//                 {products.map((p) => (
//                   <option key={p._id} value={p._id}>
//                     {p.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="text-sm font-medium">Rate</label>
//               <input
//                 type="number"
//                 name="rate"
//                 value={form.rate}
//                 onChange={handleFormChange}
//                 className="w-full border rounded px-3 py-2"
//                 placeholder="0"
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium">Quantity</label>
//               <input
//                 type="number"
//                 name="quantity"
//                 value={form.quantity}
//                 onChange={handleFormChange}
//                 className="w-full border rounded px-3 py-2"
//                 placeholder="0"
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium">Date</label>
//               <input
//                 type="date"
//                 name="date"
//                 value={form.date}
//                 onChange={handleFormChange}
//                 className="w-full border rounded px-3 py-2"
//               />
//             </div>

//             <div className="md:col-span-5 flex gap-2 mt-2">
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="px-4 py-2 bg-slate-900 text-white rounded"
//               >
//                 {saving ? "Saving..." : "Add Entry"}
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Filter + list */}
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
//             <h2 className="text-lg font-semibold">
//               Stock Entries (Total: ₹{totalIncoming.toFixed(2)})
//             </h2>
//             <form
//               onSubmit={applyFilter}
//               className="flex flex-wrap gap-2 items-center"
//             >
//               <input
//                 type="date"
//                 name="from"
//                 value={filter.from}
//                 onChange={handleFilterChange}
//                 className="border rounded px-3 py-1 text-sm"
//               />
//               <span className="text-sm">to</span>
//               <input
//                 type="date"
//                 name="to"
//                 value={filter.to}
//                 onChange={handleFilterChange}
//                 className="border rounded px-3 py-1 text-sm"
//               />
//               <button
//                 type="submit"
//                 className="px-3 py-1 bg-slate-900 text-white rounded text-sm"
//               >
//                 Filter
//               </button>
//             </form>
//           </div>

//           {loading ? (
//             <p>Loading entries...</p>
//           ) : safeEntries.length === 0 ? (
//             <p className="text-sm text-gray-500">
//               No stock entries for selected period.
//             </p>
//           ) : (
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="p-2 text-left">Date</th>
//                   <th className="p-2 text-left">Distributor</th>
//                   <th className="p-2 text-left">Product</th>
//                   <th className="p-2 text-right">Rate</th>
//                   <th className="p-2 text-right">Quantity</th>
//                   <th className="p-2 text-right">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeEntries.map((e) => (
//                   <tr key={e._id} className="border-t">
//                     <td className="p-2">
//                       {new Date(e.date || e.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="p-2">{e.distributorId?.name}</td>
//                     <td className="p-2">
//                       {e.productName || e.productId?.name}
//                     </td>
//                     <td className="p-2 text-right">₹{e.productId?.salePrice}</td>
//                     <td className="p-2 text-right">{e.quantity}</td>
//                     <td className="p-2 text-right">₹{(e.productId?.salePrice || 0) * e.quantity}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IncomingStock;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../api/productApi";
import {
  getStockInEntries,
  createStockInEntry,
  updateStockInEntry,
  deleteStockInEntry,
} from "../../api/stockInApi";
import { getAllDistributors } from "../../api/distributorApi";

// ── inline SVG icons ─────────────────────────────────────────────────────────
const TruckIcon = () => (
  <svg className="inline w-4 h-4 mr-1 opacity-60" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 9.5h13V17H1.5V9.5zM14.5 13h4l3 3v1h-7v-4zM5.5 17a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM18.5 17a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
  </svg>
);
const BoxIcon = () => (
  <svg className="inline w-4 h-4 mr-1 opacity-60" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0v10l-8 4m0-14L4 7m8 4v10" />
  </svg>
);
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l-4 1 1-4 9.268-9.268a2.5 2.5 0 013.536 3.536L9 13z" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2" />
  </svg>
);
const PlusIcon = () => (
  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

// ── constants ─────────────────────────────────────────────────────────────────
const EMPTY_FORM   = { distributorId: "", productId: "", rate: "", quantity: "", date: "", batchNumber: "" };
const EMPTY_FILTER = { from: "", to: "", distributorId: "" };
const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

// ── shared class strings ──────────────────────────────────────────────────────
const inputCls =
  "w-full bg-[#1a1f2e] border border-[#2e3650] text-gray-100 rounded-lg px-3 py-2 text-sm " +
  "placeholder-gray-500 focus:outline-none focus:border-orange-500 transition";
const labelCls = "block text-[11px] font-semibold text-gray-400 mb-1 uppercase tracking-wide";
const filterInputCls =
  "bg-[#1a1f2e] border border-[#2e3650] text-gray-300 rounded-lg px-3 py-1.5 text-sm " +
  "focus:outline-none focus:border-orange-500 transition";

// ── component ─────────────────────────────────────────────────────────────────
const IncomingStock = () => {
  const navigate = useNavigate();

  const [products,     setProducts]     = useState([]);
  const [entries,      setEntries]      = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [error,        setError]        = useState("");

  const [form,   setForm]   = useState(EMPTY_FORM);
  const [filter, setFilter] = useState(EMPTY_FILTER);

  const [editId,   setEditId]   = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);

  // ── load ────────────────────────────────────────────────────────────────────
  const load = async () => {
    try {
      setLoading(true);
      const [prodData, stockData, distData] = await Promise.all([
        getAllProducts(),
        getStockInEntries(filter.from, filter.to),
        getAllDistributors(),
      ]);
      setDistributors(Array.isArray(distData)  ? distData  : []);
      setProducts    (Array.isArray(prodData)  ? prodData  : []);
      setEntries     (Array.isArray(stockData) ? stockData : []);
    } catch (err) {
      console.error("Error loading stock:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  // ── handlers ────────────────────────────────────────────────────────────────
  const onFormChange   = (e) => { const { name, value } = e.target; setForm  (p => ({ ...p, [name]: value })); };
  const onFilterChange = (e) => { const { name, value } = e.target; setFilter(p => ({ ...p, [name]: value })); };
  const onEditChange   = (e) => { const { name, value } = e.target; setEditForm(p => ({ ...p, [name]: value })); };

  const applyFilter = async (e) => { e.preventDefault(); await load(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.distributorId) { setError("Distributor name required"); return; }
    if (!form.productId)     { setError("Select product");            return; }
    try {
      setSaving(true);
      await createStockInEntry({
        distributorId: form.distributorId,
        productId:     form.productId,
        rate:          Number(form.rate)     || 0,
        quantity:      Number(form.quantity) || 0,
        date:          form.date             || undefined,
        batchNumber:   form.batchNumber      || undefined,
      });
      await load();
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.response?.data?.error || "Error saving stock entry");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (entry) => {
    setEditId(entry._id);
    setEditForm({
      distributorId: entry.distributorId?._id || "",
      productId:     entry.productId?._id     || "",
      rate:          entry.rate               ?? "",
      quantity:      entry.quantity           ?? "",
      date:          entry.date ? entry.date.slice(0, 10) : "",
      batchNumber:   entry.batchNumber        || "",
    });
  };

  const saveEdit = async (id) => {
    try {
      await updateStockInEntry(id, {
        distributorId: editForm.distributorId,
        productId:     editForm.productId,
        rate:          Number(editForm.rate)     || 0,
        quantity:      Number(editForm.quantity) || 0,
        date:          editForm.date             || undefined,
        batchNumber:   editForm.batchNumber      || undefined,
      });
      setEditId(null);
      await load();
    } catch (err) {
      alert(err.response?.data?.error || "Error updating entry");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await deleteStockInEntry(id);
      await load();
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting entry");
    }
  };

  // ── derived data ─────────────────────────────────────────────────────────────
  const safeEntries = (Array.isArray(entries) ? entries : []).filter((e) =>
    !filter.distributorId || e.distributorId?._id === filter.distributorId
  );
  const totalIncoming = safeEntries.reduce((sum, e) => sum + (e.total || 0), 0);

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* breadcrumb */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-orange-400 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Incoming Stock (Distributors)
        </button>

        {/* ══ ADD FORM ══════════════════════════════════════════════════════════ */}
        <div className="bg-[#161b2e] border border-[#2e3650] rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-5">Add Incoming Stock</h2>

          {error && (
            <div className="mb-4 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

              {/* Distributor — spans 2 cols */}
              <div className="sm:col-span-2 md:col-span-2">
                <label className={labelCls}>Distributor Name</label>
                <div className="relative">
                  <select name="distributorId" value={form.distributorId} onChange={onFormChange}
                    className={inputCls + " appearance-none pr-8"}>
                    <option value="">Select distributor</option>
                    {distributors.map((d) => (
                      <option key={d._id} value={d._id}>{d.name} ({d.phone})</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▾</span>
                </div>
              </div>

              {/* Product */}
              <div>
                <label className={labelCls}>Product</label>
                <div className="relative">
                  <select name="productId" value={form.productId} onChange={onFormChange}
                    className={inputCls + " appearance-none pr-8"}>
                    <option value="">Select</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▾</span>
                </div>
              </div>

              {/* Rate */}
              <div>
                <label className={labelCls}>Rate</label>
                <input type="number" name="rate" value={form.rate} onChange={onFormChange}
                  placeholder="0" className={inputCls} />
              </div>

              {/* Quantity */}
              <div>
                <label className={labelCls}>Quantity</label>
                <input type="number" name="quantity" value={form.quantity} onChange={onFormChange}
                  placeholder="0" className={inputCls} />
              </div>

              {/* Date */}
              <div>
                <label className={labelCls}>Date</label>
                <input type="date" name="date" value={form.date} onChange={onFormChange}
                  className={inputCls} />
              </div>

              {/* Batch Number */}
              <div>
                <label className={labelCls}>Batch Number</label>
                <input type="text" name="batchNumber" value={form.batchNumber} onChange={onFormChange}
                  placeholder="e.g. B-001" className={inputCls} />
              </div>
            </div>

            <div className="mt-5">
              <button type="submit" disabled={saving}
                className="inline-flex items-center px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-lg transition text-sm">
                <PlusIcon />
                {saving ? "Saving..." : "Add Entry"}
              </button>
            </div>
          </form>
        </div>

        {/* ══ ENTRIES TABLE ════════════════════════════════════════════════════ */}
        <div className="bg-[#161b2e] border border-[#2e3650] rounded-2xl overflow-hidden">

          {/* header row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-6 py-4 border-b border-[#2e3650]">
            <h2 className="text-base font-bold text-white whitespace-nowrap">
              Recent Stock Entries{" "}
              <span className="text-orange-400">(Total: ₹{fmt(totalIncoming)})</span>
            </h2>

            <form onSubmit={applyFilter} className="flex flex-wrap gap-2 items-center">
              {/* distributor filter */}
              <div className="relative">
                <select name="distributorId" value={filter.distributorId} onChange={onFilterChange}
                  className={filterInputCls + " appearance-none pr-7"}>
                  <option value="">All Distributors</option>
                  {distributors.map((d) => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▾</span>
              </div>

              <input type="date" name="from" value={filter.from} onChange={onFilterChange} className={filterInputCls} />
              <span className="text-gray-500 text-sm">to</span>
              <input type="date" name="to"   value={filter.to}   onChange={onFilterChange} className={filterInputCls} />

              <button type="submit"
                className="px-4 py-1.5 bg-[#1a1f2e] border border-[#2e3650] hover:border-orange-500 text-gray-300 hover:text-orange-400 rounded-lg text-sm font-medium transition">
                Filter
              </button>
              <button type="button" onClick={() => setFilter(EMPTY_FILTER)}
                className="px-4 py-1.5 bg-[#1a1f2e] border border-[#2e3650] hover:border-red-500 text-gray-400 hover:text-red-400 rounded-lg text-sm transition">
                Clear
              </button>
            </form>
          </div>

          {/* body */}
          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading entries…</div>
          ) : safeEntries.length === 0 ? (
            <div className="p-10 text-center text-gray-500 text-sm">No stock entries for selected period.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2e3650] text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                    <th className="px-5 py-3 text-left">Date</th>
                    <th className="px-5 py-3 text-left"><TruckIcon />Distributor</th>
                    <th className="px-5 py-3 text-left"><BoxIcon />Product</th>
                    <th className="px-5 py-3 text-right">Rate</th>
                    <th className="px-5 py-3 text-right">Quantity</th>
                    <th className="px-5 py-3 text-right">Total</th>
                    <th className="px-5 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {safeEntries.map((e) =>
                    editId === e._id ? (
                      /* ── inline edit row ── */
                      <tr key={e._id} className="border-t border-[#2e3650] bg-[#1a1f2e]">
                        <td className="px-3 py-2">
                          <input type="date" name="date" value={editForm.date} onChange={onEditChange}
                            className="bg-[#0f1117] border border-[#2e3650] text-gray-200 rounded px-2 py-1 text-xs w-32" />
                        </td>
                        <td className="px-3 py-2">
                          <select name="distributorId" value={editForm.distributorId} onChange={onEditChange}
                            className="bg-[#0f1117] border border-[#2e3650] text-gray-200 rounded px-2 py-1 text-xs">
                            {distributors.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <select name="productId" value={editForm.productId} onChange={onEditChange}
                            className="bg-[#0f1117] border border-[#2e3650] text-gray-200 rounded px-2 py-1 text-xs">
                            {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" name="rate" value={editForm.rate} onChange={onEditChange}
                            className="bg-[#0f1117] border border-[#2e3650] text-gray-200 rounded px-2 py-1 text-xs w-20" />
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" name="quantity" value={editForm.quantity} onChange={onEditChange}
                            className="bg-[#0f1117] border border-[#2e3650] text-gray-200 rounded px-2 py-1 text-xs w-20" />
                        </td>
                        <td className="px-3 py-2 text-right text-orange-400 font-medium">
                          ₹{fmt((Number(editForm.rate) || 0) * (Number(editForm.quantity) || 0))}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button onClick={() => saveEdit(e._id)}
                            className="text-xs px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded mr-1 transition">
                            Save
                          </button>
                          <button onClick={() => setEditId(null)}
                            className="text-xs px-3 py-1 border border-[#2e3650] hover:border-gray-400 text-gray-400 rounded transition">
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ) : (
                      /* ── normal row ── */
                      <tr key={e._id} className="border-t border-[#2e3650] hover:bg-[#1a1f2e] transition-colors">
                        <td className="px-5 py-3 text-gray-300">
                          {new Date(e.date || e.createdAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-5 py-3 text-gray-200">{e.distributorId?.name}</td>
                        <td className="px-5 py-3 text-gray-200">{e.productName || e.productId?.name}</td>
                        <td className="px-5 py-3 text-right text-gray-300">₹{e.rate ?? 0}</td>                  
                              <td className="px-5 py-3 text-right text-gray-300">{e.quantity}</td>
                        <td className="px-5 py-3 text-right font-semibold text-orange-400">
                        ₹{fmt((e.rate || 0) * (e.quantity || 0))}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => startEdit(e)}
                              className="text-gray-400 hover:text-orange-400 transition" title="Edit">
                              <EditIcon />
                            </button>
                            <button onClick={() => handleDelete(e._id)}
                              className="text-gray-400 hover:text-red-400 transition" title="Delete">
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default IncomingStock;
