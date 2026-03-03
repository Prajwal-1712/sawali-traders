import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCustomer } from "../../api/customerApi";

const AddCustomer = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    customerType: "Normal", // DEFAULT VALUE
  });

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
      setError("Customer name is required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        customerType: formData.customerType, // <-- IMPORTANT
        openingBalance: 0,
      };

      await createCustomer(payload);

      alert("Customer added successfully!");
      navigate("/customers");
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to save customer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="bg-white rounded-2xl shadow-md border max-w-xl w-full px-8 py-6">
        <h1 className="text-2xl font-bold mb-6">Add Customer</h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input
              type="text"
              name="name"
              className="w-full border border-gray-400 rounded px-3 py-2 text-sm"
              placeholder="Enter customer name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              className="w-full border border-gray-400 rounded px-3 py-2 text-sm"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              className="w-full border border-gray-400 rounded px-3 py-2 text-sm"
              placeholder="Area / village"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Customer Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Customer Type</label>
            <select
              name="customerType"
              className="w-full border border-gray-400 rounded px-3 py-2 text-sm"
              value={formData.customerType}
              onChange={handleChange}
            >
              <option value="Normal">Normal Customer</option>
              <option value="Dairy">Dairy Customer</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/customers")}
              className="px-4 py-2 rounded border border-gray-400 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded bg-slate-900 text-white text-sm font-semibold disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
