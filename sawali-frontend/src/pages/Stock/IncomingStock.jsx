import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../api/productApi";
import {
  getStockInEntries,
  createStockInEntry,
} from "../../api/stockInApi";
import { getAllDistributors } from "../../api/distributorApi";


const IncomingStock = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [distributors, setDistributors] = useState([]);

  const [form, setForm] = useState({
  distributorId: "",
  productId: "",
  rate: "",
  quantity: "",
  date: "",
});


  const [filter, setFilter] = useState({
    from: "",
    to: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      const [prodData, stockData, distData] = await Promise.all([
  getAllProducts(),
  getStockInEntries(filter.from, filter.to),
  getAllDistributors(),
]);

setDistributors(Array.isArray(distData) ? distData : []);

      setProducts(Array.isArray(prodData) ? prodData : []);
      setEntries(Array.isArray(stockData) ? stockData : []);
    } catch (err) {
      console.error("Error loading stock:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // initial

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilter = async (e) => {
    e.preventDefault();
    await load();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.distributorId)
 {
      setError("Distributor name required");
      return;
    }
    if (!form.productId) {
      setError("Select product");
      return;
    }

    try {
      setSaving(true);
      await createStockInEntry({
        distributorId: form.distributorId,
        productId: form.productId,
        rate: Number(form.rate) || 0,
        quantity: Number(form.quantity) || 0,
        date: form.date || undefined,
      });
      await load();
      setForm({
        distributorId: "",
        productId: "",
        rate: "",
        quantity: "",
        date: "",
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Error saving stock entry"
      );
    } finally {
      setSaving(false);
    }
  };

  // Safe reduce: always use an array
  const safeEntries = Array.isArray(entries) ? entries : [];
  const totalIncoming = safeEntries.reduce(
    (sum, e) => sum + (e.total || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 text-sm underline"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold mb-4">
          Incoming Stock (Distributors)
        </h1>

        {/* Add entry form */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Add Incoming Stock</h2>
          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-5 gap-3"
          >
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Distributor Name</label>
              <select
  name="distributorId"
  value={form.distributorId}
  onChange={handleFormChange}
  className="w-full border rounded px-3 py-2"
>
  <option value="">Select distributor</option>
  {distributors.map((d) => (
    <option key={d._id} value={d._id}>
      {d.name} ({d.phone})
    </option>
  ))}
</select>

            </div>
            <div>
              <label className="text-sm font-medium">Product</label>
              <select
                name="productId"
                value={form.productId}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Rate</label>
              <input
                type="number"
                name="rate"
                value={form.rate}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="md:col-span-5 flex gap-2 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-slate-900 text-white rounded"
              >
                {saving ? "Saving..." : "Add Entry"}
              </button>
            </div>
          </form>
        </div>

        {/* Filter + list */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold">
              Stock Entries (Total: ₹{totalIncoming.toFixed(2)})
            </h2>
            <form
              onSubmit={applyFilter}
              className="flex flex-wrap gap-2 items-center"
            >
              <input
                type="date"
                name="from"
                value={filter.from}
                onChange={handleFilterChange}
                className="border rounded px-3 py-1 text-sm"
              />
              <span className="text-sm">to</span>
              <input
                type="date"
                name="to"
                value={filter.to}
                onChange={handleFilterChange}
                className="border rounded px-3 py-1 text-sm"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-slate-900 text-white rounded text-sm"
              >
                Filter
              </button>
            </form>
          </div>

          {loading ? (
            <p>Loading entries...</p>
          ) : safeEntries.length === 0 ? (
            <p className="text-sm text-gray-500">
              No stock entries for selected period.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Distributor</th>
                  <th className="p-2 text-left">Product</th>
                  <th className="p-2 text-right">Rate</th>
                  <th className="p-2 text-right">Quantity</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {safeEntries.map((e) => (
                  <tr key={e._id} className="border-t">
                    <td className="p-2">
                      {new Date(e.date || e.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">{e.distributorId?.name}</td>
                    <td className="p-2">
                      {e.productName || e.productId?.name}
                    </td>
                    <td className="p-2 text-right">₹{e.rate}</td>
                    <td className="p-2 text-right">{e.quantity}</td>
                    <td className="p-2 text-right">₹{e.total}</td>
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

export default IncomingStock;
