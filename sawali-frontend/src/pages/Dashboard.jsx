// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTodaySummary,
  getPendingSummary,
  getRecentSales,
} from "../api/dashboardApi";

const Dashboard = () => {
  const navigate = useNavigate();
  const [today, setToday] = useState({ totalSales: 0, billCount: 0 });
  const [pending, setPending] = useState({
    totalPending: 0,
    customerCount: 0,
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [t, p, r] = await Promise.all([
          getTodaySummary(),
          getPendingSummary(),
          getRecentSales(),
        ]);
        setToday(t || {});
        setPending(p || {});
        setRecent(Array.isArray(r) ? r : []); // ensure array
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Sawali Traders Dashboard</h1>

        {/* Top cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white shadow rounded-xl p-4">
            <p className="text-sm text-gray-500">Today's Sales</p>
            <p className="text-2xl font-bold">
              ₹{Number(today.totalSales || 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">
              {today.billCount || 0} bills today
            </p>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <p className="text-sm text-gray-500">Total Pending</p>
            <p className="text-2xl font-bold text-red-600">
              ₹{Number(pending.totalPending || 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">
              {pending.customerCount || 0} customers
            </p>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <p className="text-sm text-gray-500">Quick Action</p>
            <button
              onClick={() => navigate("/sales/new")}
              className="mt-2 px-4 py-2 bg-slate-900 text-white rounded"
            >
              + New Sale
            </button>
          </div>
        </div>

        {/* Quick navigation buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <button
            onClick={() => navigate("/customers")}
            className="bg-white shadow rounded-lg p-3 text-sm"
          >
            👥 Customers
          </button>
          <button
            onClick={() => navigate("/dairy-owners")}
            className="bg-white shadow rounded-lg p-3 text-sm"
          >
            🥛 Dairy Owners
          </button>
          <button
            onClick={() => navigate("/payments/pending")}
            className="bg-white shadow rounded-lg p-3 text-sm"
          >
            💳 Pending Payments
          </button>
          <button
            onClick={() => navigate("/products")}
            className="bg-white shadow rounded-lg p-3 text-sm"
          >
            📦 Products
          </button>
          <button
            onClick={() => navigate("/stock/in")}
            className="bg-white shadow rounded-lg p-3 text-sm"
          >
            📥 Incoming Stock
          </button>
          <button
            onClick={() => navigate("/reports/monthly")}
            className="bg-white shadow rounded-lg p-3 text-sm"
          >
            📊 Monthly Report
          </button>
        </div>

        {/* Recent sales */}
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Recent Bills</h2>
          {!Array.isArray(recent) || recent.length === 0 ? (
            <p className="text-sm text-gray-500">No bills yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Bill No</th>
                  <th className="p-2 text-left">Customer</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-right">Total</th>
                  <th className="p-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((s) => (
                  <tr key={s._id} className="border-b">
                    <td className="p-2">{s.billNumber}</td>
                    <td className="p-2">{s.customerId?.name || "-"}</td>
                    <td className="p-2">
                      {s.createdAt
                        ? new Date(s.createdAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="p-2 text-right">
                      ₹{Number(s.grandTotal || 0).toFixed(2)}
                    </td>
                    <td className="p-2 text-right">
                      {Number(s.balance || 0) > 0
                        ? `₹${Number(s.balance).toFixed(2)}`
                        : "✓ Paid"}
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

export default Dashboard;
