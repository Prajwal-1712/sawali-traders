// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { createDistributor } from "../../api/distributorApi";

// const AddDistributor = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     address: "",
//     gstNumber: "",
//     openingBalance: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!formData.name.trim()) {
//       setError("Distributor name is required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload = {
//         ...formData,
//         openingBalance: Number(formData.openingBalance) || 0,
//       };

//       await createDistributor(payload);

//       alert("Distributor added successfully!");
//       navigate("/distributors");
//     } catch (err) {
//       console.error("Error adding distributor:", err);
//       setError("Failed to add distributor");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full h-full flex items-center justify-center">
//       <div className="bg-white rounded-2xl shadow-lg px-10 py-8 max-w-lg w-full">
//         <h1 className="text-2xl font-bold mb-4 text-center">
//           Add Distributor
//         </h1>

//         {error && (
//           <p className="mb-3 text-sm text-red-500 text-center">{error}</p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-3">
//           <div>
//             <label className="block mb-1 text-sm font-medium">Name *</label>
//             <input
//               type="text"
//               name="name"
//               className="w-full border rounded px-3 py-2 text-sm"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Distributor name"
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-sm font-medium">Phone</label>
//             <input
//               type="text"
//               name="phone"
//               className="w-full border rounded px-3 py-2 text-sm"
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder="Phone no."
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-sm font-medium">Address</label>
//             <input
//               type="text"
//               name="address"
//               className="w-full border rounded px-3 py-2 text-sm"
//               value={formData.address}
//               onChange={handleChange}
//               placeholder="Address"
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-sm font-medium">GST Number</label>
//             <input
//               type="text"
//               name="gstNumber"
//               className="w-full border rounded px-3 py-2 text-sm"
//               value={formData.gstNumber}
//               onChange={handleChange}
//               placeholder="GSTIN"
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-sm font-medium">
//               Opening Balance
//             </label>
//             <input
//               type="number"
//               name="openingBalance"
//               className="w-full border rounded px-3 py-2 text-sm"
//               value={formData.openingBalance}
//               onChange={handleChange}
//               placeholder="0"
//             />
//           </div>

//           <div className="flex gap-3 mt-4">
//             <button
//               type="button"
//               onClick={() => navigate("/distributors")}
//               className="flex-1 py-2 rounded border border-gray-300 text-sm"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 py-2 rounded bg-slate-900 text-white text-sm font-semibold disabled:opacity-60"
//             >
//               {loading ? "Saving..." : "Save Distributor"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddDistributor;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDistributor } from "../../api/distributorApi";

const AddDistributor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", phone: "", address: "", gstNumber: "", openingBalance: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.name.trim()) { setError("Distributor name is required"); return; }
    try {
      setLoading(true);
      await createDistributor({ ...formData, openingBalance: Number(formData.openingBalance) || 0 });
      alert("Distributor added successfully!");
      navigate("/distributors");
    } catch (err) {
      console.error("Error adding distributor:", err);
      setError("Failed to add distributor");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors";
  const labelCls = "block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5";

  const fields = [
    { label: "Name *",           name: "name",           type: "text",   placeholder: "Distributor name" },
    { label: "Phone",            name: "phone",          type: "text",   placeholder: "Phone number" },
    { label: "Address",         name: "address",        type: "text",   placeholder: "Address" },
    { label: "GST Number",      name: "gstNumber",      type: "text",   placeholder: "GSTIN" },
    { label: "Opening Balance", name: "openingBalance", type: "number", placeholder: "0" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 w-full max-w-lg">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/distributors")}
            className="text-xs text-gray-400 hover:text-gray-200 transition-colors mb-4 flex items-center gap-1"
          >
            ← Back to Distributors
          </button>
          <h1 className="text-xl font-semibold text-white">Add Distributor</h1>
          <p className="text-xs text-gray-500 mt-0.5">नवा distributor add करा</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-2.5 bg-red-900/40 border border-red-800 rounded-lg text-red-300 text-sm">
            ⚠ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className={labelCls}>{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                value={formData[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className={inputCls}
              />
            </div>
          ))}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/distributors")}
              className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 border border-gray-600
                         text-gray-300 text-sm font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50
                         disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
            >
              {loading ? "Saving..." : "Save Distributor"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddDistributor;
