import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDairyOwnerCustomers,
  payBulkForDairyOwner,
  getDairyOwnerSales 
} from "../../api/dairyOwnerApi";
import * as XLSX from "xlsx";

const DairyOwnerDashboard = () => {
  const { ownerId } = useParams();
  const navigate = useNavigate();

  const [owner, setOwner] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");

  const [payment, setPayment] = useState({
    amount: "",
    method: "CASH",
    note: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getDairyOwnerCustomers(ownerId);
        setOwner(data?.owner || null);
        setCustomers(Array.isArray(data?.customers) ? data.customers : []);
        const salesData = await getDairyOwnerSales(ownerId, fromDate, toDate);
setSales(Array.isArray(salesData) ? salesData : []);

      } catch (err) {
        console.error("Error loading dairy owner:", err);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [ownerId, fromDate, toDate]);


  const toggleCustomer = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === customers.length) {
      setSelected([]);
    } else {
      setSelected(customers.map((c) => c._id));
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  const safeCustomers = Array.isArray(customers) ? customers : [];

  const totalPending = safeCustomers.reduce(
    (sum, c) => sum + (c.balance || 0),
    0
  );

  const selectedPending = safeCustomers
    .filter((c) => selected.includes(c._id))
    .reduce((sum, c) => sum + (c.balance || 0), 0);

  const handleBulkPay = async () => {
    if (selected.length === 0) {
      alert("कमीतकमी एक कस्टमर select करा ✅");
      return;
    }
    if (!payment.amount || Number(payment.amount) <= 0) {
      alert("Amount टाका");
      return;
    }

    try {
      setSaving(true);
      await payBulkForDairyOwner(ownerId, {
        customerIds: selected,
        amount: Number(payment.amount),
        method: payment.method,
        note: payment.note,
      });
      alert("Bulk payment saved ✅");
      const data = await getDairyOwnerCustomers(ownerId);
      setOwner(data?.owner || null);
      setCustomers(Array.isArray(data?.customers) ? data.customers : []);
      setSelected([]);
      setPayment({ amount: "", method: "CASH", note: "" });
    } catch (err) {
      console.error(err);
      alert("Error saving payment");
    } finally {
      setSaving(false);
    }
  };

  const exportExcel = () => {
  const rows = [];

  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      rows.push({
        Date: new Date(sale.createdAt).toLocaleDateString(),
        Customer: sale.customerId?.name,
        Product: item.productId?.name,
        Qty: item.quantity,
        Price: item.rate,
        Total: item.quantity * item.rate,
      });
    });
  });

  const sheet = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "Sales");

  XLSX.writeFile(wb, "sales.xlsx");
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading Dairy Owner...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/customers")}
          className="mb-4 text-sm underline"
        >
          ← Back to Customers
        </button>

        <div className="flex gap-3 mb-4">

  <input
    type="date"
    value={fromDate}
    onChange={(e) => setFromDate(e.target.value)}
    className="border rounded px-2 py-1"
  />

  <input
    type="date"
    value={toDate}
    onChange={(e) => setToDate(e.target.value)}
    className="border rounded px-2 py-1"
  />

 <button
  onClick={exportExcel}
  className="px-4 py-2 bg-green-600 text-white rounded"
>
  Export Excel
</button>


</div>

<h1 className="text-3xl font-bold mb-2">

  🥛 {owner?.name} Dashboard
</h1>

        <p className="text-gray-700 mb-4">
          Total Pending:{" "}
          <span className="font-semibold text-red-600">
            ₹{totalPending.toFixed(2)}
          </span>{" "}
          ({safeCustomers.length} customers)
        </p>

        {/* Customer list with checkboxes */}
        <div className="bg-white rounded-xl shadow mb-6 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-amber-100">
            <p className="font-semibold">
              Customers (select for bulk payment)
            </p>
            <p className="text-sm text-gray-700">
              Selected pending: ₹{selectedPending.toFixed(2)}
            </p>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              
            </thead>
            <tbody>
              {safeCustomers.length === 0 ? (
                <tr>
                 
                </tr>
              ) : (
                safeCustomers.map((c) => (
                  <tr key={c._id} className="border-t">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(c._id)}
                        onChange={() => toggleCustomer(c._id)}
                      />
                    </td>
                    <td className="p-2 font-semibold">{c.name}</td>
                    <td className="p-2">{c.phone || "-"}</td>
                    <td className="p-2 text-right text-red-600 font-semibold">
                      ₹{(c.balance || 0).toFixed(2)}
                    </td>
                    <td className="p-2 text-right">
                      <button
                        onClick={() =>
                          navigate(`/customers/${c._id}/history`)
                        }
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
                      >
                        History
                      </button>{" "}
                      <button
                        onClick={() => navigate(`/sales/new/${c._id}`)}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded"
                      >
                        New Sale
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
           <div className="bg-white rounded-xl shadow p-4 mb-6">
  <h2 className="text-lg font-semibold mb-3">Sales Breakdown</h2>

  <table className="w-full text-sm">
    <thead className="bg-gray-100">
  <tr>
    <th className="p-2 text-left">Date</th>
    <th className="p-2 text-left">Customer</th>
    <th className="p-2 text-left">Product</th>
    <th className="p-2 text-right">Qty</th>
    <th className="p-2 text-right">Price</th>
    <th className="p-2 text-right">Total</th>
  </tr>
</thead>
 

    <tbody>
      {sales.length === 0 ? (
        <tr>
          <td colSpan="5" className="p-4 text-center text-gray-500">
            No sales yet
          </td>
        </tr>
      ) : (
        sales.flatMap((sale) =>
          sale.items.map((item, i) => (
            <tr key={`${sale._id}-${i}`} className="border-t">
  <td className="p-2">
    {new Date(sale.createdAt).toLocaleDateString()}
  </td>
  <td className="p-2">{sale.customerId?.name}</td>
  <td className="p-2">{item.productId?.name}</td>

              <td className="p-2 text-right">{item.quantity}</td>
              <td className="p-2 text-right">₹{item.rate}</td>
              <td className="p-2 text-right font-semibold">
                ₹{item.quantity * item.rate}
              </td>
            </tr>
          ))
        )
      )}
    </tbody>
  </table>
</div>
     {/* <div className="bg-white rounded-xl shadow p-4 mb-6">
  <h2 className="text-lg font-semibold mb-3">Sales Breakdown</h2>

  {sales.length === 0 ? (
    <p className="text-gray-500">No sales yet.</p>
  ) : (
    sales.map((sale) => (
      <div key={sale._id} className="mb-4 border-b pb-2">
        <p className="font-semibold">
          Customer: {sale.customerId?.name}
        </p>

        {sale.items.map((item, i) => (
          <p key={i} className="text-sm ml-3">
            {item.productId?.name} —
            {item.quantity} × ₹{item.rate}
            = ₹{item.quantity * item.rate}
          </p>
        ))}

        <p className="text-right font-semibold">
          Total: ₹{sale.grandTotal}
        </p>
      </div>
    ))
  )} */}
</div>

        {/* Bulk payment section */}
        {safeCustomers.length > 0 && (
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-3">
              Bulk Payment from Dairy Owner
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={payment.amount}
                  onChange={handlePaymentChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="₹ amount"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Method</label>
                <select
                  name="method"
                  value={payment.method}
                  onChange={handlePaymentChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI / Online</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Note</label>
                <input
                  type="text"
                  name="note"
                  value={payment.note}
                  onChange={handlePaymentChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Optional note"
                />
              </div>
            </div>

            <button
              onClick={handleBulkPay}
              disabled={saving}
              className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded"
            >
              {saving ? "Saving..." : "Save Bulk Payment"}
            </button>
          </div>
        )}
      </div>
    
  );
};

export default DairyOwnerDashboard;
