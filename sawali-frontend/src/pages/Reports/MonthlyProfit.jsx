import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSalesSummary, getStockInSummary } from "../../api/reportsApi";

const MonthlyProfit = () => {
  const navigate = useNavigate();
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);

  const [from, setFrom] = useState(monthStart);
  const [to, setTo] = useState(monthEnd);
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState(0);
  const [incoming, setIncoming] = useState(0);

  const load = async () => {
    try {
      setLoading(true);
      const [s, i] = await Promise.all([
        getSalesSummary(from, to),
        getStockInSummary(from, to),
      ]);
      setSales(s.totalSales || 0);
      setIncoming(i.totalIncoming || 0);
    } catch (err) {
      console.error("Error loading profit report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // initial

  const handleSubmit = async (e) => {
    e.preventDefault();
    await load();
  };

  const profit = sales - incoming;
  const margin =
    sales > 0 ? ((profit / sales) * 100).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 text-sm underline"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold mb-4">Monthly Profit Report</h1>

        {/* Filter */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-3 items-center"
        >
          <div>
            <label className="text-sm font-medium">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border rounded px-3 py-2 text-sm ml-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border rounded px-3 py-2 text-sm ml-2"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 text-white rounded text-sm"
          >
            Apply
          </button>
        </form>

        {/* Summary cards */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            Loading summary...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-gray-500">
                Incoming Stock (Purchases)
              </p>
              <p className="text-2xl font-bold text-red-600">
                ₹{incoming.toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-gray-500">Outgoing Sales</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{sales.toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-gray-500">Profit</p>
              <p
                className={`text-2xl font-bold ${
                  profit >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                ₹{profit.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                Margin: {margin}%
              </p>
            </div>
          </div>
        )}

        {/* Simple table for clarity */}
        {!loading && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-3">Summary</h2>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="p-2">Period</td>
                  <td className="p-2 text-right">
                    {from} → {to}
                  </td>
                </tr>
                <tr>
                  <td className="p-2">Total Incoming Stock</td>
                  <td className="p-2 text-right">
                    ₹{incoming.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="p-2">Total Sales</td>
                  <td className="p-2 text-right">
                    ₹{sales.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Profit</td>
                  <td className="p-2 text-right font-semibold">
                    ₹{profit.toFixed(2)} ({margin}%)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyProfit;
