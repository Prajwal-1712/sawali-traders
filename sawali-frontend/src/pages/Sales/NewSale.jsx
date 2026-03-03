// src/pages/Sales/NewSale.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createOrGetCustomer } from "../../api/customerApi";
import { getAllProducts } from "../../api/productApi";
import { createSale } from "../../api/salesApi";
import { getAllDairyOwners } from "../../api/dairyOwnerApi";
import { getCustomerById } from "../../api/customerApi";


const NewSale = () => {
  const navigate = useNavigate();
  const { customerId: existingCustomerId } = useParams(); // /sales/new/:customerId (optional)

  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [dairyOwners, setDairyOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [billDate] = useState(() => new Date());

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    customerType: "Normal", // Normal / Dairy
    dairyOwnerId: "",
  });

  const [items, setItems] = useState([
    { productId: "", productName: "", quantity: "", rate: "" },
  ]);

  const [paymentInfo, setPaymentInfo] = useState({
    paymentStatus: "COMPLETE", // COMPLETE / PENDING
    paymentMode: "CASH", // CASH / ONLINE / CREDIT(Udhar)
    paidAmount: "",
    notes: "",
  });

  const totalAmount = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    return sum + qty * rate;
  }, 0);

  // Load products + dairy owners
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [prodData, ownerData] = await Promise.all([
          getAllProducts(),
          getAllDairyOwners(),
        ]);
        setProducts(Array.isArray(prodData) ? prodData : []);
        setDairyOwners(Array.isArray(ownerData) ? ownerData : []);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load products/dairy owners");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Auto load existing customer (from history → new sale)
useEffect(() => {
  const loadCustomer = async () => {
    if (!existingCustomerId) return;

    try {
      const c = await getCustomerById(existingCustomerId);

      setCustomerInfo({
        name: c.name || "",
        phone: c.phone || "",
        customerType: c.customerType || "Normal",
        dairyOwnerId: c.dairyOwnerId || "",
      });
    } catch (err) {
      console.error("Failed to load customer:", err);
    }
  };

  loadCustomer();
}, [existingCustomerId]);


  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "customerType" && value === "Normal"
        ? { dairyOwnerId: "" }
        : {}),
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const handleProductSelect = (index, productId) => {
    const product = products.find((p) => p._id === productId);
    setItems((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              productId,
              productName: product?.name || "",
              rate: product?.salePrice || "",
            }
          : row
      )
    );
  };

  const addRow = () => {
    setItems((prev) => [
      ...prev,
      { productId: "", productName: "", quantity: "", rate: "" },
    ]);
  };

  const removeRow = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // STEP 1 → STEP 2
  const goToBillStep = (e) => {
    e.preventDefault();
    setError("");

    if (!existingCustomerId && !customerInfo.name.trim()) {
      setError("Please enter customer name");
      return;
    }

    if (
      customerInfo.customerType === "Dairy" &&
      !existingCustomerId &&
      !customerInfo.dairyOwnerId
    ) {
      setError("Please select Dairy Owner");
      return;
    }

    const validItems = items.filter(
      (i) => i.productId && i.quantity && i.rate
    );
    if (validItems.length === 0) {
      setError("Please add at least one product row");
      return;
    }

    if (totalAmount <= 0) {
      setError("Total must be greater than 0");
      return;
    }

    setPaymentInfo((prev) => {
      if (prev.paymentStatus === "PENDING") {
        return { ...prev, paidAmount: "0" };
      }
      return {
        ...prev,
        paidAmount: prev.paidAmount || String(totalAmount),
      };
    });

    setStep(2);
  };

  const handleConfirmSale = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);

      let finalCustomerId = existingCustomerId;
      let customerDoc = null;

      // Create / get customer if route has no id
      // if (!finalCustomerId) {
      //   customerDoc = await createOrGetCustomer({
      //     name: customerInfo.name,
      //     phone: customerInfo.phone,
      //     customerType: customerInfo.customerType,
      //     dairyOwnerId:
      //       customerInfo.customerType === "Dairy"
      //         ? customerInfo.dairyOwnerId || null
      //         : null,
      //   });
      //   finalCustomerId = customerDoc._id;
      // }
        if (!finalCustomerId) {
  customerDoc = await createOrGetCustomer({
    name: customerInfo.name,
    phone: customerInfo.phone,
    customerType: customerInfo.customerType,
    dairyOwnerId:
      customerInfo.customerType === "Dairy"
        ? customerInfo.dairyOwnerId || null
        : null,
  });

  finalCustomerId = customerDoc._id;
}

      const numericPaid =
        paymentInfo.paymentStatus === "PENDING"
          ? 0
          : Number(paymentInfo.paidAmount) || totalAmount;

      const salePayload = {
        customerId: finalCustomerId,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: Number(i.quantity),
          rate: Number(i.rate),
        })),
        paidAmount: numericPaid,
        paymentMode:
          paymentInfo.paymentStatus === "PENDING"
            ? "CREDIT"
            : paymentInfo.paymentMode,
        notes: paymentInfo.notes,
      };

      const sale = await createSale(salePayload);

      alert(
        `Bill created!
Bill No: ${sale.billNumber}
Total: ₹${sale.grandTotal}
Paid: ₹${sale.paidAmount}
Balance: ₹${sale.balance}
Status: ${sale.status}`
      );

      navigate(`/customers/${finalCustomerId}/history`);
    } catch (err) {
      console.error("Error confirming sale:", {
        message: err.message,
        status: err.response?.status,
        url: err.config?.url,
        data: err.response?.data,
      });
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to create bill (check backend logs)"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Loading products...</p>
      </div>
    );
  }

  // STEP 1 – details
  if (step === 1) {
    return (
      <div className="p-4 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">New Sale – Details</h1>
        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={goToBillStep} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Date & Time</label>
            <input
              type="text"
              readOnly
              value={billDate.toLocaleString()}
              className="w-full border rounded px-3 py-2 bg-gray-100 text-sm"
            />
          </div>

          {/* Customer section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium">Customer Name</label>
              <input
                type="text"
                name="name"
                value={customerInfo.name ?? ""}
                onChange={handleCustomerChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter customer name"
                disabled={!!existingCustomerId}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Phone (optional)
              </label>
              <input
                type="text"
                name="phone"
                value={customerInfo.phone ?? ""}
                onChange={handleCustomerChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Phone number"
                disabled={!!existingCustomerId}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Customer Type</label>
              <select
                name="customerType"
                value={customerInfo.customerType ?? "Normal"}
                onChange={handleCustomerChange}
                className="w-full border rounded px-3 py-2"
                disabled={!!existingCustomerId}
              >
                <option value="Normal">Normal Customer</option>
                <option value="Dairy">Dairy Customer</option>
              </select>
            </div>
          </div>

          {/* Dairy owner (dynamic) */}
          {customerInfo.customerType === "Dairy" && !existingCustomerId && (
            <div>
              <label className="text-sm font-medium">Dairy Owner</label>
             
               <select
                      name="dairyOwnerId"
                    value={customerInfo.dairyOwnerId || ""}
                onChange={handleCustomerChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select dairy owner</option>
                {Array.isArray(dairyOwners) &&
                  dairyOwners.map((owner) => (
                    <option key={owner._id} value={owner._id}>
    {owner.name} ({owner.phone})
  </option>
                  ))}
              </select>
            </div>
          )}

          {/* Products table */}
          <div className="bg-white shadow rounded p-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Product</th>
                  <th className="border p-2">Qty</th>
                  <th className="border p-2">Rate</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row, index) => {
                  const qty = Number(row.quantity) || 0;
                  const rate = Number(row.rate) || 0;
                  const amount = qty * rate;

                  return (
                    <tr key={index}>
                      <td className="border p-2">
                        <select
                          value={row.productId ?? ""}
                          onChange={(e) =>
                            handleProductSelect(index, e.target.value)
                          }
                          className="w-full border rounded px-2 py-1"
                        >
                          <option value="">Select product</option>
                          {Array.isArray(products) &&
                            products.map((p) => (
                              <option key={p._id} value={p._id}>
                                {p.name}
                              </option>
                            ))}
                        </select>
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={row.quantity ?? ""}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="w-full border rounded px-2 py-1"
                          placeholder="Qty"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={row.rate ?? ""}
                          onChange={(e) =>
                            handleItemChange(index, "rate", e.target.value)
                          }
                          className="w-full border rounded px-2 py-1"
                          placeholder="Rate"
                        />
                      </td>
                      <td className="border p-2 text-right">
                        ₹{amount.toFixed(2)}
                      </td>
                      <td className="border p-2 text-center">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRow(index)}
                            className="text-red-600 text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <button
              type="button"
              onClick={addRow}
              className="mt-3 px-3 py-1 bg-gray-200 rounded text-sm"
            >
              + Add Row
            </button>
          </div>

          <div className="flex justify-between items-center mt-4">
            <h2 className="text-xl font-semibold">
              Total: ₹{totalAmount.toFixed(2)}
            </h2>
            <button
              type="submit"
              className="px-6 py-2 bg-slate-900 text-white rounded"
            >
              Next → Billing
            </button>
          </div>
        </form>
      </div>
    );
  }

  // STEP 2 – BILLING
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bill Generation</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <div className="bg-white shadow rounded p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Customer</h2>
        <p>
          <strong>Name:</strong> {customerInfo.name || "(Existing Customer)"}
        </p>
        <p>
          <strong>Phone:</strong> {customerInfo.phone || "-"}
        </p>
        <p>
          <strong>Type:</strong> {customerInfo.customerType}
        </p>

        <h2 className="text-lg font-semibold mt-4 mb-2">Items</h2>
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Product</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row, index) => {
              const qty = Number(row.quantity) || 0;
              const rate = Number(row.rate) || 0;
              const amount = qty * rate;
              return (
                <tr key={index}>
                  <td className="border p-2">{row.productName}</td>
                  <td className="border p-2">{qty}</td>
                  <td className="border p-2">₹{rate}</td>
                  <td className="border p-2 text-right">₹{amount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h2 className="text-xl font-semibold text-right mt-3">
          Total: ₹{totalAmount.toFixed(2)}
        </h2>
      </div>

      <form onSubmit={handleConfirmSale} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-medium">Payment Status</label>
            <select
              name="paymentStatus"
              value={paymentInfo.paymentStatus ?? "COMPLETE"}
              onChange={handlePaymentChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="COMPLETE">Complete</option>
              <option value="PENDING">Pending (Udhar)</option>
            </select>
          </div>

          {paymentInfo.paymentStatus === "COMPLETE" && (
            <>
              <div>
                <label className="text-sm font-medium">Payment Mode</label>
                <select
                  name="paymentMode"
                  value={paymentInfo.paymentMode ?? "CASH"}
                  onChange={handlePaymentChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="CASH">Cash</option>
                  <option value="ONLINE">Online/UPI</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Paid Amount</label>
                <input
                  type="number"
                  name="paidAmount"
                  value={paymentInfo.paidAmount ?? ""}
                  onChange={handlePaymentChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder={String(totalAmount)}
                />
              </div>
            </>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Notes</label>
          <input
            type="text"
            name="notes"
            value={paymentInfo.notes ?? ""}
            onChange={handlePaymentChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Optional"
          />
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="px-4 py-2 border rounded"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-slate-900 text-white rounded"
          >
            {saving ? "Saving..." : "Confirm & Save Bill"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewSale;
