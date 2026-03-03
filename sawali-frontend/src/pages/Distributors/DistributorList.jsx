import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDistributors } from "../../api/distributorApi";

const DistributorList = () => {
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        setLoading(true);
        const data = await getAllDistributors();
        setDistributors(data);
      } catch (err) {
        console.error("Error fetching distributors:", err);
        setError("Failed to load distributors");
      } finally {
        setLoading(false);
      }
    };

    fetchDistributors();
  }, []);

  if (loading)
    return <p className="text-center mt-4">Loading distributors...</p>;

  if (error)
    return <p className="text-center mt-4 text-red-500">{error}</p>;

  if (distributors.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg px-10 py-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold mb-3">Distributors</h2>
          <p className="text-gray-700 mb-4">
            No distributors found. Please add one.
          </p>
          <button
            onClick={() => navigate("/distributors/add")}
            className="w-full py-2 rounded bg-slate-900 text-white font-semibold"
          >
            Add First Distributor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Distributor List</h2>
        <button
          onClick={() => navigate("/distributors/add")}
          className="px-4 py-2 rounded bg-slate-900 text-white text-sm"
        >
          + Add Distributor
        </button>
      </div>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">GST No</th>
            <th className="border p-2">Current Balance</th>
          </tr>
        </thead>
        <tbody>
          {distributors.map((d) => (
            <tr key={d._id}>
              <td className="border p-2">{d.name}</td>
              <td className="border p-2">{d.phone}</td>
              <td className="border p-2">{d.address}</td>
              <td className="border p-2">{d.gstNumber}</td>
              <td className="border p-2">{d.currentBalance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DistributorList;
