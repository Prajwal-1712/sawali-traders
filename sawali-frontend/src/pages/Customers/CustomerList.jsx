// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllCustomers } from "../../api/customerApi";
// import { getAllDairyOwners } from "../../api/dairyOwnerApi";

// const CustomerList = () => {
//   const navigate = useNavigate();
//   const [customers, setCustomers] = useState([]);
//   const [dairyOwners, setDairyOwners] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [normalOpen, setNormalOpen] = useState(false);
//   const [dairyOpen, setDairyOpen] = useState(false);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         const [customerData, ownerData] = await Promise.all([
//           getAllCustomers(),
//           getAllDairyOwners(),
//         ]);
//         setCustomers(Array.isArray(customerData) ? customerData : []);
//         setDairyOwners(Array.isArray(ownerData) ? ownerData : []);
//       } catch (err) {
//         console.error("Error loading customers/owners:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   const safeCustomers = Array.isArray(customers) ? customers : [];

//   const normalCustomers = safeCustomers.filter(
//     (c) => c.customerType === "Normal"
//   );
//   const dairyCustomers = safeCustomers.filter(
//     (c) => c.customerType === "Dairy"
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading customers...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6">Customers</h1>

//         {/* NORMAL CUSTOMERS */}
//         <section className="mb-8">
//           <button
//             onClick={() => setNormalOpen(!normalOpen)}
//             className="w-full flex items-center justify-between px-5 py-3 bg-slate-900 text-white rounded-lg"
//           >
//             <span>Normal Customers ({normalCustomers.length})</span>
//             <span>{normalOpen ? "▲" : "▼"}</span>
//           </button>

//           {normalOpen && (
//             <div className="mt-3 max-h-96 overflow-y-auto space-y-2">
//               {normalCustomers.length === 0 ? (
//                 <p className="text-sm text-gray-500 p-3">
//                   No normal customers yet.
//                 </p>
//               ) : (
//                 normalCustomers.map((c) => (
//                   <div
//                     key={c._id}
//                     className="bg-white border rounded-lg p-3 flex justify-between items-center"
//                   >
//                     <div>
//                       <p className="font-semibold">{c.name}</p>
//                       <p className="text-sm text-gray-600">
//                         📱 {c.phone || "-"}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         Pending: ₹{Number(c.balance || 0).toFixed(2)}
//                       </p>
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() =>
//                           navigate(`/customers/${c._id}/history`)
//                         }
//                         className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
//                       >
//                         History
//                       </button>
//                       <button
//                         onClick={() => navigate(`/sales/new/${c._id}`)}
//                         className="px-3 py-1 text-xs bg-green-600 text-white rounded"
//                       >
//                         New Sale
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </section>

//         {/* DAIRY CUSTOMERS */}
//         <section>
//           <button
//             onClick={() => setDairyOpen(!dairyOpen)}
//             className="w-full flex items-center justify-between px-5 py-3 bg-amber-600 text-white rounded-lg"
//           >
//             <span>Dairy Customers ({dairyCustomers.length})</span>
//             <span>{dairyOpen ? "▲" : "▼"}</span>
//           </button>

//           {dairyOpen && (
//             <div className="mt-3">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                 {(!Array.isArray(dairyOwners) || dairyOwners.length === 0) ? (
//                   <p className="text-sm text-gray-500 p-3">
//                     No dairy owners yet.
//                   </p>
//                 ) : (
//                   dairyOwners.map((owner) => {
//                     const count = dairyCustomers.filter(
//                       (c) =>
//                         String(c.dairyOwnerId) === String(owner._id)
//                     ).length;

//                     return (
//                       <button
//                         key={owner._id}
//                         onClick={() =>
//                           navigate(`/dairy-owners/${owner._id}`)
//                         }
//                         className="bg-white border rounded-lg p-4 text-left hover:shadow"
//                       >
//                         <p className="font-semibold">{owner.name}</p>
//                         <p className="text-xs text-gray-500">
//                           {count} customers
//                         </p>
//                       </button>
//                     );
//                   })
//                 )}
//               </div>
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default CustomerList;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCustomers } from "../../api/customerApi";
import { getAllDairyOwners } from "../../api/dairyOwnerApi";

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers,   setCustomers]   = useState([]);
  const [dairyOwners, setDairyOwners] = useState([]);
  const [loading,     setLoading]     = useState(true);

  const [normalOpen, setNormalOpen] = useState(true);
  const [dairyOpen,  setDairyOpen]  = useState(true);

  // ── Filters for Normal Customers
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "pending" | "clear"

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [customerData, ownerData] = await Promise.all([
          getAllCustomers(),
          getAllDairyOwners(),
        ]);
        setCustomers(Array.isArray(customerData) ? customerData : []);
        setDairyOwners(Array.isArray(ownerData) ? ownerData : []);
      } catch (err) {
        console.error("Error loading customers/owners:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const safeCustomers = Array.isArray(customers) ? customers : [];

  const normalCustomers = safeCustomers.filter((c) => c.customerType === "Normal");
  const dairyCustomers  = safeCustomers.filter((c) => c.customerType === "Dairy");

  // ── Apply search + status filter on Normal Customers
  const filteredNormal = normalCustomers.filter((c) => {
    const matchSearch =
      search.trim() === "" ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "pending"
        ? Number(c.balance || 0) > 0
        : Number(c.balance || 0) === 0;

    return matchSearch && matchStatus;
  });

  // Initials avatar helper
  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Customers</h1>
        </div>

        {/* ── NORMAL CUSTOMERS ── */}
        <section className="mb-6">
          {/* Section header */}
          <button
            onClick={() => setNormalOpen(!normalOpen)}
            className="w-full flex items-center justify-between px-5 py-3 bg-gray-800 border border-gray-700
                       text-white rounded-xl hover:bg-gray-700 transition-colors duration-150"
          >
            <span className="text-sm font-medium">
              Normal Customers ({filteredNormal.length}/{normalCustomers.length})
            </span>
            <span className="text-gray-400 text-xs">{normalOpen ? "▲" : "▼"}</span>
          </button>

          {normalOpen && (
            <div className="mt-3">

              {/* Search + Status filter */}
              <div className="flex gap-3 mb-3">
                {/* Search */}
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or phone..."
                  className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg
                             px-3 py-2 placeholder-gray-500 focus:outline-none focus:border-emerald-500
                             focus:ring-1 focus:ring-emerald-500 transition-colors"
                />

                {/* Status filter buttons */}
                <div className="flex rounded-lg overflow-hidden border border-gray-700">
                  {[
                    { key: "all",     label: "All"     },
                    { key: "pending", label: "Pending" },
                    { key: "clear",   label: "Clear"   },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setStatusFilter(opt.key)}
                      className={`px-4 py-2 text-xs font-medium transition-colors duration-150
                        ${statusFilter === opt.key
                          ? opt.key === "pending"
                            ? "bg-red-900/60 text-red-300"
                            : opt.key === "clear"
                            ? "bg-emerald-900/60 text-emerald-300"
                            : "bg-gray-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer cards */}
              <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1">
                {filteredNormal.length === 0 ? (
                  <p className="text-sm text-gray-500 p-4 text-center">
                    {search || statusFilter !== "all"
                      ? "No customers match your filter."
                      : "No normal customers yet."}
                  </p>
                ) : (
                  filteredNormal.map((c) => {
                    const balance  = Number(c.balance || 0);
                    const isPending = balance > 0;

                    return (
                      <div
                        key={c._id}
                        className="bg-gray-800 border border-gray-700 rounded-xl p-4
                                   flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                      >
                        {/* Left: avatar + info */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-900/50 border border-blue-800
                                          flex items-center justify-center text-sm font-medium text-blue-300 shrink-0">
                            {getInitials(c.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{c.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              📱 {c.phone || "-"}
                            </p>
                            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium
                              ${isPending
                                ? "bg-red-900/50 text-red-300"
                                : "bg-emerald-900/50 text-emerald-300"
                              }`}>
                              {isPending ? `Pending: ₹${balance.toFixed(2)}` : "Clear"}
                            </span>
                          </div>
                        </div>

                        {/* Right: action buttons */}
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => navigate(`/customers/${c._id}/history`)}
                            className="px-3 py-1.5 text-xs font-medium bg-blue-900/50 border border-blue-800
                                       text-blue-300 rounded-lg hover:bg-blue-800/50 transition-colors"
                          >
                            History
                          </button>
                          <button
                            onClick={() => navigate(`/sales/new/${c._id}`)}
                            className="px-3 py-1.5 text-xs font-medium bg-emerald-900/50 border border-emerald-800
                                       text-emerald-300 rounded-lg hover:bg-emerald-800/50 transition-colors"
                          >
                            New Sale
                          </button>
{isPending && c.phone && (
  <button
    onClick={() => {
      const msg = `🙏 Namaskar ${customer.name} Saheb,

Asha karto ki tumhi sukharup asal.

Tumchyakade ₹${balance.toFixed(2)} RS itki baki rakkam aahe.

Krupaya payment lavkar karave hi vinanti.

- Sawali Traders Savlaj`;

      window.open(
        `https://wa.me/91${c.phone}?text=${encodeURIComponent(msg)}`,
        "_blank"
      );
    }}
    className="px-3 py-1.5 text-xs font-medium bg-green-900/50 border border-green-800 text-green-300 rounded-lg"
  >
    Reminder
  </button>
)}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </section>

        {/* ── DAIRY CUSTOMERS ── */}
        <section>
          <button
            onClick={() => setDairyOpen(!dairyOpen)}
            className="w-full flex items-center justify-between px-5 py-3 bg-amber-900/60 border border-amber-800
                       text-amber-200 rounded-xl hover:bg-amber-900/80 transition-colors duration-150"
          >
            <span className="text-sm font-medium">
              Dairy Customers ({dairyCustomers.length})
            </span>
            <span className="text-amber-400 text-xs">{dairyOpen ? "▲" : "▼"}</span>
          </button>

          {dairyOpen && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              {(!Array.isArray(dairyOwners) || dairyOwners.length === 0) ? (
                <p className="text-sm text-gray-500 p-3">No dairy owners yet.</p>
              ) : (
                dairyOwners.map((owner) => {
                  const count = dairyCustomers.filter(
                    (c) => String(c.dairyOwnerId) === String(owner._id)
                  ).length;

                  return (
                    <button
                      key={owner._id}
                      onClick={() => navigate(`/dairy-owners/${owner._id}`)}
                      className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-left
                                 hover:bg-gray-700 transition-colors duration-150"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-900/50 border border-amber-800
                                        flex items-center justify-center text-xs font-medium text-amber-300 shrink-0">
                          {getInitials(owner.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{owner.name}</p>
                          <p className="text-xs text-gray-400">{count} customers</p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default CustomerList;
