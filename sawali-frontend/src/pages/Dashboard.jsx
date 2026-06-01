// // src/pages/Dashboard.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   getTodaySummary,
//   getPendingSummary,
//   getRecentSales,
// } from "../api/dashboardApi";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [today, setToday] = useState({ totalSales: 0, billCount: 0 });
//   const [pending, setPending] = useState({
//     totalPending: 0,
//     customerCount: 0,
//   });
//   const [recent, setRecent] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         const [t, p, r] = await Promise.all([
//           getTodaySummary(),
//           getPendingSummary(),
//           getRecentSales(),
//         ]);
//         setToday(t || {});
//         setPending(p || {});
//         setRecent(Array.isArray(r) ? r : []); // ensure array
//       } catch (err) {
//         console.error("Error loading dashboard:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6">Sawali Traders Dashboard</h1>

//         {/* Top cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <div className="bg-white shadow rounded-xl p-4">
//             <p className="text-sm text-gray-500">Today's Sales</p>
//             <p className="text-2xl font-bold">
//               ₹{Number(today.totalSales || 0).toFixed(2)}
//             </p>
//             <p className="text-xs text-gray-400">
//               {today.billCount || 0} bills today
//             </p>
//           </div>
//           <div className="bg-white shadow rounded-xl p-4">
//             <p className="text-sm text-gray-500">Total Pending</p>
//             <p className="text-2xl font-bold text-red-600">
//               ₹{Number(pending.totalPending || 0).toFixed(2)}
//             </p>
//             <p className="text-xs text-gray-400">
//               {pending.customerCount || 0} customers
//             </p>
//           </div>
//           <div className="bg-white shadow rounded-xl p-4">
//             <p className="text-sm text-gray-500">Quick Action</p>
//             <button
//               onClick={() => navigate("/sales/new")}
//               className="mt-2 px-4 py-2 bg-slate-900 text-white rounded"
//             >
//               + New Sale
//             </button>
//           </div>
//         </div>

//         {/* Quick navigation buttons */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
//           <button
//             onClick={() => navigate("/customers")}
//             className="bg-white shadow rounded-lg p-3 text-sm"
//           >
//             👥 Customers
//           </button>
//           <button
//             onClick={() => navigate("/dairy-owners")}
//             className="bg-white shadow rounded-lg p-3 text-sm"
//           >
//             🥛 Dairy Owners
//           </button>
//           <button
//             onClick={() => navigate("/payments/pending")}
//             className="bg-white shadow rounded-lg p-3 text-sm"
//           >
//             💳 Pending Payments
//           </button>
//           <button
//             onClick={() => navigate("/products")}
//             className="bg-white shadow rounded-lg p-3 text-sm"
//           >
//             📦 Products
//           </button>
//           <button
//             onClick={() => navigate("/stock/in")}
//             className="bg-white shadow rounded-lg p-3 text-sm"
//           >
//             📥 Incoming Stock
//           </button>
//           <button
//             onClick={() => navigate("/reports/monthly")}
//             className="bg-white shadow rounded-lg p-3 text-sm"
//           >
//             📊 Monthly Report
//           </button>
//         </div>

//         {/* Recent sales */}
//         <div className="bg-white shadow rounded-xl p-4">
//           <h2 className="text-lg font-semibold mb-3">Recent Bills</h2>
//           {!Array.isArray(recent) || recent.length === 0 ? (
//             <p className="text-sm text-gray-500">No bills yet.</p>
//           ) : (
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="p-2 text-left">Bill No</th>
//                   <th className="p-2 text-left">Customer</th>
//                   <th className="p-2 text-left">Date</th>
//                   <th className="p-2 text-right">Total</th>
//                   <th className="p-2 text-right">Balance</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recent.map((s) => (
//                   <tr key={s._id} className="border-b">
//                     <td className="p-2">{s.billNumber}</td>
//                     <td className="p-2">{s.customerId?.name || "-"}</td>
//                     <td className="p-2">
//                       {s.createdAt
//                         ? new Date(s.createdAt).toLocaleString()
//                         : "-"}
//                     </td>
//                     <td className="p-2 text-right">
//                       ₹{Number(s.grandTotal || 0).toFixed(2)}
//                     </td>
//                     <td className="p-2 text-right">
//                       {Number(s.balance || 0) > 0
//                         ? `₹${Number(s.balance).toFixed(2)}`
//                         : "✓ Paid"}
//                     </td>
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

// export default Dashboard;
// src/pages/Dashboard.jsx


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  getTodaySummary,
  getPendingSummary,
  getRecentSales,
  getLast7Days,
  getTopProducts,
} from "../api/dashboardApi";
import { getAllProducts } from "../api/productApi";
import { getAllCustomers } from "../api/customerApi";

// ── API helpers (dashboardApi मध्ये नसतील तर इथेच define केले) ──
const BASE = import.meta.env?.VITE_API_URL || "";


// ── helpers ──
const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

const LOW_STOCK = 10;

// ── Custom Tooltip for chart ──
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-emerald-400">Sales: ₹{Number(payload[0]?.value || 0).toLocaleString("en-IN")}</p>
      <p className="text-blue-400">Paid: ₹{Number(payload[1]?.value || 0).toLocaleString("en-IN")}</p>
    </div>
  );
};

// ── Main Component ──
const Dashboard = () => {
  const navigate = useNavigate();

  const [today,       setToday]       = useState({ totalSales: 0, billCount: 0 });
  const [pending,     setPending]     = useState({ totalPending: 0, customerCount: 0 });
  const [recent,      setRecent]      = useState([]);
  const [last7Days,   setLast7Days]   = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [products,    setProducts]    = useState([]);
  const [pendingCusts,setPendingCusts]= useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [t, p, r, days, top, prods, custs] = await Promise.all([
          getTodaySummary(),
          getPendingSummary(),
          getRecentSales(),
         getLast7Days().catch(() => []),    // ✅
         getTopProducts().catch(() => []),
          getAllProducts().catch(() => []),
          getAllCustomers().catch(() => []),
        ]);
        setToday(t   || {});
        setPending(p || {});
        setRecent(Array.isArray(r) ? r : []);
        setLast7Days(Array.isArray(days) ? days : []);
        setTopProducts(Array.isArray(top) ? top : []);

        const safeProds = Array.isArray(prods) ? prods : [];
        setProducts(safeProds);

        const safeCusts = Array.isArray(custs) ? custs : [];
        setPendingCusts(safeCusts.filter((c) => Number(c.balance || 0) > 0)
          .sort((a, b) => b.balance - a.balance).slice(0, 5));
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Derived stats
  const totalSalesAll   = last7Days.reduce((s, d) => s + (d.totalSales || 0), 0);
  const totalPaidAll    = last7Days.reduce((s, d) => s + (d.totalPaid  || 0), 0);
  const totalPendingAmt = totalSalesAll - totalPaidAll;
  const lowStockProds   = products.filter((p) => (p.currentStock ?? 0) <= LOW_STOCK && (p.currentStock ?? 0) > 0);
  const outStockProds   = products.filter((p) => (p.currentStock ?? 0) <= 0);
  const maxSales        = Math.max(...last7Days.map((d) => d.totalSales || 0), 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">Sawali Traders Dashboard</h1>
          <span className="text-xs text-gray-500">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </span>
        </div>

        {/* ── Row 1: Stat cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Today's Sales */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Today's Sales</p>
            <p className="text-2xl font-bold text-white">₹{fmt(today.totalSales)}</p>
            <p className="text-xs text-gray-500 mt-1">{today.billCount || 0} bills today</p>
          </div>

          {/* 7-day Total Sales */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">7-Day Total Sales</p>
            <p className="text-2xl font-bold text-emerald-400">₹{fmt(totalSalesAll)}</p>
            <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
          </div>

          {/* 7-day Pending */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Sales Pending</p>
            <p className="text-2xl font-bold text-orange-400">₹{fmt(totalPendingAmt)}</p>
            <p className="text-xs text-gray-500 mt-1">Unpaid in 7 days</p>
          </div>

          {/* Total Customer Pending */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Customer Pending</p>
            <p className="text-2xl font-bold text-red-400">₹{fmt(pending.totalPending)}</p>
            <p className="text-xs text-gray-500 mt-1">{pending.customerCount || 0} customers</p>
          </div>
        </div>

        {/* ── Row 2: Chart + Quick Actions ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Last 7 Days Bar Chart */}
          <div className="md:col-span-2 bg-gray-800 border border-gray-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Last 7 Days Sales</h2>
              <div className="flex gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/>Sales</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/>Paid</span>
              </div>
            </div>
            {last7Days.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={last7Days} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="totalSales" fill="#10b981" radius={[4,4,0,0]} name="Sales" />
                  <Bar dataKey="totalPaid"  fill="#3b82f6" radius={[4,4,0,0]} name="Paid" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              {[
                { label: "+ New Sale",        path: "/sales/new",      color: "bg-emerald-600 hover:bg-emerald-500 text-white" },
                { label: "+ New Customer",    path: "/customers/new",  color: "bg-blue-700 hover:bg-blue-600 text-white" },
                { label: "Manage Customers",  path: "/customers",      color: "bg-gray-700 hover:bg-gray-600 text-gray-200" },
                { label: "Check Stock",       path: "/products",       color: "bg-gray-700 hover:bg-gray-600 text-gray-200" },
                { label: "Incoming Stock",    path: "/stock/incoming", color: "bg-gray-700 hover:bg-gray-600 text-gray-200" },
                { label: "View Reports",      path: "/reports/monthly",color: "bg-gray-700 hover:bg-gray-600 text-gray-200" },
              ].map((b) => (
                <button key={b.label} onClick={() => navigate(b.path)}
                  className={`w-full text-left text-sm font-medium px-4 py-2.5 rounded-lg transition-colors ${b.color}`}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 3: Top Products + Pending Customers + Stock Alerts ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Top Selling Products */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">🏆 Top Selling Products</h2>
            {topProducts.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">No sales data yet</p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((p, i) => {
                  const pct = Math.round((p.totalAmount / (topProducts[0]?.totalAmount || 1)) * 100);
                  return (
                    <div key={p.name}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-4">#{i + 1}</span>
                          <span className="text-sm text-gray-200">{p.name}</span>
                        </div>
                        <span className="text-xs text-emerald-400 font-medium">₹{Number(p.totalAmount).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{p.totalQty} units sold</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pending Customers */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">⏳ Pending Customers</h2>
              <button onClick={() => navigate("/customers")}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                View All →
              </button>
            </div>
            {pendingCusts.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">🎉 No pending customers!</p>
            ) : (
              <div className="space-y-2">
                {pendingCusts.map((c) => (
                  <div key={c._id}
                    onClick={() => navigate(`/customers/${c._id}/history`)}
                    className="flex items-center justify-between bg-gray-700/50 hover:bg-gray-700
                               border border-gray-700 rounded-lg px-3 py-2 cursor-pointer transition-colors">
                    <div>
                      <p className="text-sm text-gray-200 font-medium">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.phone || "—"}</p>
                    </div>
                    <span className="text-xs text-red-400 font-semibold">
                      ₹{Number(c.balance || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stock Alerts */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">📦 Stock Alerts</h2>
              <button onClick={() => navigate("/products")}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                View All →
              </button>
            </div>
            {outStockProds.length === 0 && lowStockProds.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">🟢 All products in stock!</p>
            ) : (
              <div className="space-y-2">
                {outStockProds.map((p) => (
                  <div key={p._id} className="flex items-center justify-between bg-red-900/30
                    border border-red-800/50 rounded-lg px-3 py-2">
                    <p className="text-sm text-gray-200">{p.name}</p>
                    <span className="text-xs text-red-400 font-medium">🔴 Out of Stock</span>
                  </div>
                ))}
                {lowStockProds.map((p) => (
                  <div key={p._id} className="flex items-center justify-between bg-amber-900/30
                    border border-amber-800/50 rounded-lg px-3 py-2">
                    <p className="text-sm text-gray-200">{p.name}</p>
                    <span className="text-xs text-amber-400 font-medium">🟡 {p.currentStock} left</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* ── Row 4: Recent Bills ── */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">🧾 Recent Bills</h2>
            <button onClick={() => navigate("/sales")}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
              View All →
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                {["Bill No","Customer","Date","Total","Paid","Balance","Status"].map((h) => (
                  <th key={h} className="pb-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">
                    अजून कोणतेही bills नाहीत
                  </td>
                </tr>
              ) : (
                recent.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-700/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/customers/${s.customerId?._id}/history`)}>
                    <td className="py-2.5 text-orange-400 text-xs font-medium">
                      #{s.billNumber}
                    </td>
                    <td className="py-2.5 text-gray-200 text-xs">{s.customerId?.name || "—"}</td>
                    <td className="py-2.5 text-gray-500 text-xs">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="py-2.5 text-gray-200 text-xs">₹{fmt(s.grandTotal)}</td>
                    <td className="py-2.5 text-emerald-400 text-xs">₹{fmt(s.paidAmount)}</td>
                    <td className="py-2.5 text-xs">
                      <span className={Number(s.balance) > 0 ? "text-red-400" : "text-gray-500"}>
                        ₹{fmt(s.balance)}
                      </span>
                    </td>
                    <td className="py-2.5">
                      {s.status === "COMPLETE"
                        ? <span className="text-xs bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded-full">Paid</span>
                        : <span className="text-xs bg-red-900/50 text-red-300 px-2 py-0.5 rounded-full">Pending</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
