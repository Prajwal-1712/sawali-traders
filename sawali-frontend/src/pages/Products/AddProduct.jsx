// src/pages/Products/ProductsList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllProducts,
  createProduct,
  updateProduct,
} from "../../api/productApi";

const ProductsList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    salePrice: "",
    purchasePrice: "",
    stock: "",
     existingStock: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (p) => {
  setEditingId(p._id);
  setForm({
    name: p.name,
    salePrice: p.salePrice,
    purchasePrice: p.purchasePrice,
    stock: "",           
    existingStock: p.currentStock,  
  });
};

const resetForm = () => {
  setEditingId(null);
  setForm({
    name: "",
    salePrice: "",
    purchasePrice: "",
    stock: "",
    existingStock: 0, 
  });
};

 const handleSubmit = async (e) => {
  
  e.preventDefault();
  setError("");

  // ✅ 1. Name validation
  if (!form.name.trim()) {
    setError("Product name required");
    return;
  }

  // ✅ 2. Duplicate check ONLY for new product
  if (!editingId) {
    const exists = products.some(
      (p) =>
        p.name.trim().toLowerCase() === form.name.trim().toLowerCase()
    );

    if (exists) {
      setError("Product already exists");
      return;
    }
  }

  try {
    setSaving(true);

    const payload = {
  name: form.name.trim(),
  salePrice: Number(form.salePrice) || 0,
  purchasePrice: Number(form.purchasePrice) || 0,
  currentStock: editingId
    ? (Number(form.existingStock) || 0) + (Number(form.stock) || 0)  // ✅ Edit → ADD
    : Number(form.stock) || 0,  // ✅ New Product → SET
};

    // ✅ 4. Edit vs Add
    if (editingId) {
      await updateProduct(editingId, payload);
    } else {
      await createProduct({
        ...payload,
        openingStock: payload.currentStock,
      });
    }

    // ✅ 5. Refresh + reset
    await load();
    resetForm();

  } catch (err) {
    console.error("Error saving product:", err);
    setError(err.response?.data?.error || "Error saving product");
  } finally {
    setSaving(false);
  }
};
  
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 text-sm underline"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold mb-4">Products</h1>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>
          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-3"
          >
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Product name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Sale Price</label>
              <input
                type="number"
                name="salePrice"
                value={form.salePrice}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Purchase Price</label>
              <input
                type="number"
                name="purchasePrice"
                value={form.purchasePrice}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Stock</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="0"
              />
            </div>

            <div className="md:col-span-4 flex gap-2 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-slate-900 text-white rounded"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Product"
                  : "Add Product"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">All Products</h2>
          {loading ? (
            <p>Loading products...</p>
          ) : safeProducts.length === 0 ? (
            <p className="text-sm text-gray-500">No products yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-right">Sale Price</th>
                  <th className="p-2 text-right">Purchase Price</th>
                  <th className="p-2 text-right">Stock</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeProducts.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2 text-right">₹{p.salePrice}</td>
                    <td className="p-2 text-right">₹{p.purchasePrice}</td>
                    <td className="p-2 text-right">{p.currentStock ?? 0}</td>
                    <td className="p-2 text-right">
                      <button
                        onClick={() => startEdit(p)}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
                      >
                        Edit
                      </button>
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

export default ProductsList;
