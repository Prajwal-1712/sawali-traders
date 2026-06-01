// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllDistributors } from "../../api/distributorApi";

// const DistributorList = () => {
//   const [distributors, setDistributors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDistributors = async () => {
//       try {
//         setLoading(true);
//         const data = await getAllDistributors();
//         setDistributors(data);
//       } catch (err) {
//         console.error("Error fetching distributors:", err);
//         setError("Failed to load distributors");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDistributors();
//   }, []);

//   if (loading)
//     return <p className="text-center mt-4">Loading distributors...</p>;

//   if (error)
//     return <p className="text-center mt-4 text-red-500">{error}</p>;

//   if (distributors.length === 0) {
//     return (
//       <div className="w-full h-full flex items-center justify-center">
//         <div className="bg-white rounded-2xl shadow-lg px-10 py-8 max-w-md w-full text-center">
//           <h2 className="text-2xl font-semibold mb-3">Distributors</h2>
//           <p className="text-gray-700 mb-4">
//             No distributors found. Please add one.
//           </p>
//           <button
//             onClick={() => navigate("/distributors/add")}
//             className="w-full py-2 rounded bg-slate-900 text-white font-semibold"
//           >
//             Add First Distributor
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Distributor List</h2>
//         <button
//           onClick={() => navigate("/distributors/add")}
//           className="px-4 py-2 rounded bg-slate-900 text-white text-sm"
//         >
//           + Add Distributor
//         </button>
//       </div>
//       <table className="w-full border text-sm">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border p-2">Name</th>
//             <th className="border p-2">Phone</th>
//             <th className="border p-2">Address</th>
//             <th className="border p-2">GST No</th>
//             <th className="border p-2">Current Balance</th>
//           </tr>
//         </thead>
//         <tbody>
//           {distributors.map((d) => (
//             <tr key={d._id}>
//               <td className="border p-2">{d.name}</td>
//               <td className="border p-2">{d.phone}</td>
//               <td className="border p-2">{d.address}</td>
//               <td className="border p-2">{d.gstNumber}</td>
//               <td className="border p-2">{d.currentBalance}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DistributorList;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDistributors } from "../../api/distributorApi";

// Initials avatar
const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const DistributorList = () => {
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        setLoading(true);
        const data = await getAllDistributors();
        setDistributors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching distributors:", err);
        setError("Failed to load distributors");
      } finally {
        setLoading(false);
      }
    };
    fetchDistributors();
  }, []);

  const filtered = distributors.filter((d) =>
    search.trim() === "" ||
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.phone?.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading distributors...</p>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 p-6">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  /* ── Empty ── */
  if (distributors.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl px-10 py-10 max-w-sm w-full text-center">
          <div className="text-4xl mb-4">🚚</div>
          <h2 className="text-lg font-semibold text-white mb-2">No Distributors Yet</h2>
          <p className="text-gray-400 text-sm mb-6">पहिला distributor add करा.</p>
          <button
            onClick={() => navigate("/distributors/add")}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm
                       font-medium rounded-xl transition-colors"
          >
            + Add First Distributor
          </button>
        </div>
      </div>
    );
  }

  /* ── Main ── */
  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Distributor List</h1>
            <p className="text-xs text-gray-500 mt-0.5">{distributors.length} distributors</p>
          </div>
          <button
            onClick={() => navigate("/distributors/add")}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm
                       font-medium rounded-xl transition-colors"
          >
            + Add Distributor
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone..."
          className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl
                     px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:border-emerald-500
                     focus:ring-1 focus:ring-emerald-500 transition-colors mb-4"
        />

        {/* Table card */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  {["Name", "Phone", "Address", "GST No", "Current Balance", ""].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider
                        ${h === "Name" || h === "" ? "text-left" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/60">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-gray-500 text-sm">
                      No distributors match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((d) => {
                    const balance = Number(d.currentBalance || 0);
                    return (
                      <tr
                        key={d._id}
                        onClick={() => navigate(`/distributors/${d._id}`)}
                        className="hover:bg-gray-700/40 cursor-pointer transition-colors"
                      >
                        {/* Name + avatar */}
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-900/50 border border-blue-800
                                            flex items-center justify-center text-xs font-medium text-blue-300 shrink-0">
                              {getInitials(d.name)}
                            </div>
                            <span className="text-gray-100 font-medium">{d.name}</span>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-5 py-3 text-gray-400">
                          {d.phone || "—"}
                        </td>

                        {/* Address */}
                        <td className="px-5 py-3 text-gray-400 max-w-[160px] truncate">
                          {d.address || "—"}
                        </td>

                        {/* GST No */}
                        <td className="px-5 py-3 text-gray-400 font-mono text-xs">
                          {d.gstNumber || "—"}
                        </td>

                        {/* Balance */}
                        <td className="px-5 py-3">
                          <span className={`font-medium ${balance > 0 ? "text-red-400" : "text-emerald-400"}`}>
                            ₹{balance.toLocaleString("en-IN")}
                          </span>
                        </td>

                        {/* Arrow */}
                        <td className="px-5 py-3 text-gray-600 text-right">→</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DistributorList;
