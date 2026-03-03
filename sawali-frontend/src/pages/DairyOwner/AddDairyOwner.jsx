import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDairyOwner } from "../../api/dairyOwnerApi";

const AddDairyOwner = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Owner name is required");
      return;
    }
    if (!phone.trim()) {
      setError("Mobile number is required");
      return;
    }

    try {
      setSaving(true);
      await createDairyOwner({ name, phone });
      setMessage("Dairy owner added successfully!");
      setName("");
      setPhone("");
      // go back to dashboard or wherever owners are listed
      navigate("/dashboard"); // or "/customers" or "/sales/new"
    } catch (err) {
      console.error("Error adding dairy owner:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      const backendMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "";

      setError(backendMsg || "Failed to add dairy owner");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Add Dairy Owner</h2>

      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
      {message && !error && (
        <p className="text-sm text-green-600 mb-2">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="border w-full px-2 py-1"
          placeholder="Owner Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border w-full px-2 py-1"
          placeholder="Mobile No"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-1 bg-slate-900 text-white rounded disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default AddDairyOwner;
