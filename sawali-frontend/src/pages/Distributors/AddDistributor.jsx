import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDistributor } from "../../api/distributorApi";

const AddDistributor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    gstNumber: "",
    openingBalance: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Distributor name is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        openingBalance: Number(formData.openingBalance) || 0,
      };

      await createDistributor(payload);

      alert("Distributor added successfully!");
      navigate("/distributors");
    } catch (err) {
      console.error("Error adding distributor:", err);
      setError("Failed to add distributor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg px-10 py-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Add Distributor
        </h1>

        {error && (
          <p className="mb-3 text-sm text-red-500 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block mb-1 text-sm font-medium">Name *</label>
            <input
              type="text"
              name="name"
              className="w-full border rounded px-3 py-2 text-sm"
              value={formData.name}
              onChange={handleChange}
              placeholder="Distributor name"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              className="w-full border rounded px-3 py-2 text-sm"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone no."
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              className="w-full border rounded px-3 py-2 text-sm"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">GST Number</label>
            <input
              type="text"
              name="gstNumber"
              className="w-full border rounded px-3 py-2 text-sm"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="GSTIN"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Opening Balance
            </label>
            <input
              type="number"
              name="openingBalance"
              className="w-full border rounded px-3 py-2 text-sm"
              value={formData.openingBalance}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => navigate("/distributors")}
              className="flex-1 py-2 rounded border border-gray-300 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded bg-slate-900 text-white text-sm font-semibold disabled:opacity-60"
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
