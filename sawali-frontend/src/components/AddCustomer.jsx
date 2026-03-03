// src/pages/.../AddCustomer.jsx
import React, { useState } from "react";
import { createOrGetCustomer } from "../../api/customerApi";

const AddCustomer = ({ onCustomerAdded }) => {
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
      setError("Customer name is required");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        openingBalance: Number(formData.openingBalance) || 0,
      };

      // ✅ use createOrGetCustomer here
      const newCustomer = await createOrGetCustomer(payload);

      if (onCustomerAdded) {
        onCustomerAdded(newCustomer);
      }

      alert("Customer added successfully!");

      setFormData({
        name: "",
        phone: "",
        address: "",
        gstNumber: "",
        openingBalance: "",
      });
    } catch (err) {
      console.error("Error adding customer:", err);
      setError("Failed to add customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>

      {error && <p className="mb-2 text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block mb-1">Name *</label>
          <input
            type="text"
            name="name"
            className="w-full border p-2 rounded"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter customer name"
          />
        </div>

        <div>
          <label className="block mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            className="w-full border p-2 rounded"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block mb-1">Address</label>
          <input
            type="text"
            name="address"
            className="w-full border p-2 rounded"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
          />
        </div>

        <div>
          <label className="block mb-1">GST Number</label>
          <input
            type="text"
            name="gstNumber"
            className="w-full border p-2 rounded"
            value={formData.gstNumber}
            onChange={handleChange}
            placeholder="Enter GST number"
          />
        </div>

        <div>
          <label className="block mb-1">Opening Balance</label>
          <input
            type="number"
            name="openingBalance"
            className="w-full border p-2 rounded"
            value={formData.openingBalance}
            onChange={handleChange}
            placeholder="0"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Save Customer"}
        </button>
      </form>
    </div>
  );
};

export default AddCustomer;
