// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   getAllProducts,
//   createProduct,
//   updateProduct,
// } from "../../api/productApi";

// const ProductsList = () => {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [form, setForm] = useState({
//     name: "",
//     salePrice: "",
//     purchasePrice: "",
//     stock: "",
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [error, setError] = useState("");
//   const [saving, setSaving] = useState(false);

//   const load = async () => {
//     try {
//       setLoading(true);
//       const data = await getAllProducts();

//       // If API returns { products: [...] } use data.products instead
//       // setProducts(Array.isArray(data.products) ? data.products : []);

//       setProducts(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Error loading products:", err);
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const startEdit = (p) => {
//   setEditingId(p._id);
//   setForm({
//     name: p.name,
//     salePrice: p.salePrice,
//     purchasePrice: p.purchasePrice,
//     stock: "",
//     existingStock: p.currentStock ?? 0,  // ✅ undefined असेल तर 0 घे
//   });
// };

//   const resetForm = () => {
//     setEditingId(null);
//     setForm({
//       name: "",
//       salePrice: "",
//       purchasePrice: "",
//       stock: "",
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!form.name.trim()) {
//       setError("Product name required");
//       return;
//     }
// if (editingId === null) {
//   const duplicate = products.find(
//     (p) => p.name.trim().toLowerCase() === form.name.trim().toLowerCase()
//   );

//   if (duplicate) {
//     setError("Product already exists");
//     return;
//   }

// }
//     try {
//       setSaving(true);
//       if (editingId !== null) {
//   await updateProduct(editingId, {
//     name: form.name.trim(),
//     salePrice: Number(form.salePrice) || 0,
//     purchasePrice: Number(form.purchasePrice) || 0,
//     currentStock: (Number(form.existingStock) || 0) + (Number(form.stock) || 0), // ✅ हे replace कर
//   });

//       } else {
//         await createProduct({
//          name: form.name.trim(),
//           salePrice: Number(form.salePrice) || 0,
//           purchasePrice: Number(form.purchasePrice) || 0,
//          openingStock: Number(form.stock) || 0,

//         });
//       }
//       await load();
//       resetForm();
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.error || "Error saving product");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const safeProducts = Array.isArray(products) ? products : [];

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="mb-4 text-sm underline"
//         >
//           ← Back to Dashboard
//         </button>

//         <h1 className="text-2xl font-bold mb-4">Products</h1>

//         {/* Form */}
//         <div className="bg-white rounded-lg shadow p-4 mb-6">
//           <h2 className="text-lg font-semibold mb-3">
//             {editingId ? "Edit Product" : "Add New Product"}
//           </h2>
//           {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

//           <form
//             onSubmit={handleSubmit}
//             className="grid grid-cols-1 md:grid-cols-4 gap-3"
//           >
//             <div>
//               <label className="text-sm font-medium">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 className="w-full border rounded px-3 py-2"
//                 placeholder="Product name"
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium">Sale Price</label>
//               <input
//                 type="number"
//                 name="salePrice"
//                 value={form.salePrice}
//                 onChange={handleChange}
//                 className="w-full border rounded px-3 py-2"
//                 placeholder="0"
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium">Purchase Price</label>
//               <input
//                 type="number"
//                 name="purchasePrice"
//                 value={form.purchasePrice}
//                 onChange={handleChange}
//                 className="w-full border rounded px-3 py-2"
//                 placeholder="0"
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium">Stock</label>
//               <input
//                 type="number"
//                 name="stock"
//                 value={form.stock}
//                 onChange={handleChange}
//                 className="w-full border rounded px-3 py-2"
//                 placeholder="0"
//               />
//             </div>

//             <div className="md:col-span-4 flex gap-2 mt-2">
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="px-4 py-2 bg-slate-900 text-white rounded"
//               >
//                 {saving
//                   ? "Saving..."
//                   : editingId
//                   ? "Update Product"
//                   : "Add Product"}
//               </button>
//               {editingId && (
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="px-4 py-2 border rounded"
//                 >
//                   Cancel
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>

//         {/* List */}
//         <div className="bg-white rounded-lg shadow p-4">
//           <h2 className="text-lg font-semibold mb-3">All Products</h2>
//           {loading ? (
//             <p>Loading products...</p>
//           ) : safeProducts.length === 0 ? (
//             <p className="text-sm text-gray-500">No products yet.</p>
//           ) : (
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="p-2 text-left">Name</th>
//                   <th className="p-2 text-right">Sale Price</th>
//                   <th className="p-2 text-right">Purchase Price</th>
//                   <th className="p-2 text-right">Stock</th>
//                   <th className="p-2 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {safeProducts.map((p) => (
//                   <tr key={p._id} className="border-t">
//                     <td className="p-2">{p.name}</td>
//                     <td className="p-2 text-right">₹{p.salePrice}</td>
//                     <td className="p-2 text-right">₹{p.purchasePrice}</td>
//                     <td className="p-2 text-right">{p.currentStock}</td>
//                     <td className="p-2 text-right">
//                       <button
//                         onClick={() => startEdit(p)}
//                         className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
//                       >
//                         Edit
//                       </button>
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

// export default ProductsList;
// src/pages/Products/ProductsList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllProducts,
  createProduct,
  updateProduct,
} from "../../api/productApi";

// ── icons ─────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l-4 1 1-4 9.268-9.268a2.5 2.5 0 013.536 3.536L9 13z" />
  </svg>
);
const BoxIcon = () => (
  <svg className="inline w-4 h-4 mr-1 opacity-60" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0v10l-8 4m0-14L4 7m8 4v10" />
  </svg>
);

// ── shared styles ─────────────────────────────────────────────────────────────
const inputCls =
  "w-full bg-[#1a1f2e] border border-[#2e3650] text-gray-100 rounded-lg px-3 py-2 text-sm " +
  "placeholder-gray-500 focus:outline-none focus:border-orange-500 transition";
const labelCls = "block text-[11px] font-semibold text-gray-400 mb-1 uppercase tracking-wide";

// ── component ─────────────────────────────────────────────────────────────────
const ProductsList = () => {
  const navigate = useNavigate();
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState("");
  const [editingId,  setEditingId]  = useState(null);

  const [form, setForm] = useState({
    name: "",
    salePrice: "",
    purchasePrice: "",
    stock: "",
    existingStock: 0,
  });

  // ── load ──────────────────────────────────────────────────────────────────
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

  useEffect(() => { load(); }, []);

  // ── handlers ─────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name:          p.name,
      salePrice:     p.salePrice,
      purchasePrice: p.purchasePrice,
      stock:         "",
      existingStock: p.currentStock ?? 0,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setError("");
    setForm({ name: "", salePrice: "", purchasePrice: "", stock: "", existingStock: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) { setError("Product name required"); return; }

    if (!editingId) {
      const exists = products.some(
        (p) => p.name.trim().toLowerCase() === form.name.trim().toLowerCase()
      );
      if (exists) { setError("Product already exists"); return; }
    }

    try {
      setSaving(true);
      const payload = {
        name:          form.name.trim(),
        salePrice:     Number(form.salePrice)     || 0,
        purchasePrice: Number(form.purchasePrice) || 0,
        currentStock:  editingId
          ? (Number(form.existingStock) || 0) + (Number(form.stock) || 0)
          : Number(form.stock) || 0,
      };

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct({ ...payload, openingStock: payload.currentStock });
      }

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

  // ── render ────────────────────────────────────────────────────────────────
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
          Back to Dashboard
        </button>

        {/* ══ FORM ════════════════════════════════════════════════════════════ */}
        <div className="bg-[#161b2e] border border-[#2e3650] rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-5">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>

          {error && (
            <div className="mb-4 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

              {/* Name */}
              <div>
                <label className={labelCls}>Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Product name" className={inputCls} />
              </div>

              {/* Sale Price */}
              <div>
                <label className={labelCls}>Sale Price</label>
                <input type="number" name="salePrice" value={form.salePrice} onChange={handleChange}
                  placeholder="0" className={inputCls} />
              </div>

              {/* Purchase Price */}
              <div>
                <label className={labelCls}>Purchase Price</label>
                <input type="number" name="purchasePrice" value={form.purchasePrice} onChange={handleChange}
                  placeholder="0" className={inputCls} />
              </div>

              {/* Stock */}
              <div>
                <label className={labelCls}>
                  {editingId ? "Add Stock" : "Opening Stock"}
                </label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange}
                  placeholder="0" className={inputCls} />
                {editingId && (
                  <p className="text-[11px] text-gray-500 mt-1">
                    Current: {form.existingStock} → New total:{" "}
                    <span className="text-orange-400 font-semibold">
                      {(Number(form.existingStock) || 0) + (Number(form.stock) || 0)}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button type="submit" disabled={saving}
                className="inline-flex items-center px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-lg transition text-sm">
                <PlusIcon />
                {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm}
                  className="px-5 py-2.5 border border-[#2e3650] hover:border-gray-400 text-gray-400 hover:text-gray-200 rounded-lg text-sm transition">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ══ TABLE ═══════════════════════════════════════════════════════════ */}
        <div className="bg-[#161b2e] border border-[#2e3650] rounded-2xl overflow-hidden">

          <div className="px-6 py-4 border-b border-[#2e3650]">
            <h2 className="text-base font-bold text-white">
              All Products{" "}
              <span className="text-orange-400 font-normal text-sm">
                ({safeProducts.length})
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading products…</div>
          ) : safeProducts.length === 0 ? (
            <div className="p-10 text-center text-gray-500 text-sm">No products yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2e3650] text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                    <th className="px-5 py-3 text-left"><BoxIcon />Name</th>
                    <th className="px-5 py-3 text-right">Sale Price</th>
                    <th className="px-5 py-3 text-right">Purchase Price</th>
                    <th className="px-5 py-3 text-right">Stock</th>
                    <th className="px-5 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {safeProducts.map((p) => (
                    <tr key={p._id} className="border-t border-[#2e3650] hover:bg-[#1a1f2e] transition-colors">
                      <td className="px-5 py-3 text-gray-100 font-medium">{p.name}</td>
                      <td className="px-5 py-3 text-right text-gray-300">₹{p.salePrice}</td>
                      <td className="px-5 py-3 text-right text-gray-300">₹{p.purchasePrice}</td>
                      <td className="px-5 py-3 text-right">
                        <span className={`font-semibold ${(p.currentStock ?? 0) <= 0 ? "text-red-400" : "text-orange-400"}`}>
                          {p.currentStock ?? 0}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button onClick={() => startEdit(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 hover:text-orange-400 border border-[#2e3650] hover:border-orange-500 rounded-lg transition">
                          <EditIcon />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductsList;
