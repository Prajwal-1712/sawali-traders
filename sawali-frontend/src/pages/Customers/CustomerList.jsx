import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCustomers } from "../../api/customerApi";
import { getAllDairyOwners } from "../../api/dairyOwnerApi";

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [dairyOwners, setDairyOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [normalOpen, setNormalOpen] = useState(false);
  const [dairyOpen, setDairyOpen] = useState(false);

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

  const normalCustomers = safeCustomers.filter(
    (c) => c.customerType === "Normal"
  );
  const dairyCustomers = safeCustomers.filter(
    (c) => c.customerType === "Dairy"
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Customers</h1>

        {/* NORMAL CUSTOMERS */}
        <section className="mb-8">
          <button
            onClick={() => setNormalOpen(!normalOpen)}
            className="w-full flex items-center justify-between px-5 py-3 bg-slate-900 text-white rounded-lg"
          >
            <span>Normal Customers ({normalCustomers.length})</span>
            <span>{normalOpen ? "▲" : "▼"}</span>
          </button>

          {normalOpen && (
            <div className="mt-3 max-h-96 overflow-y-auto space-y-2">
              {normalCustomers.length === 0 ? (
                <p className="text-sm text-gray-500 p-3">
                  No normal customers yet.
                </p>
              ) : (
                normalCustomers.map((c) => (
                  <div
                    key={c._id}
                    className="bg-white border rounded-lg p-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-sm text-gray-600">
                        📱 {c.phone || "-"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Pending: ₹{Number(c.balance || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/customers/${c._id}/history`)
                        }
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
                      >
                        History
                      </button>
                      <button
                        onClick={() => navigate(`/sales/new/${c._id}`)}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded"
                      >
                        New Sale
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        {/* DAIRY CUSTOMERS */}
        <section>
          <button
            onClick={() => setDairyOpen(!dairyOpen)}
            className="w-full flex items-center justify-between px-5 py-3 bg-amber-600 text-white rounded-lg"
          >
            <span>Dairy Customers ({dairyCustomers.length})</span>
            <span>{dairyOpen ? "▲" : "▼"}</span>
          </button>

          {dairyOpen && (
            <div className="mt-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(!Array.isArray(dairyOwners) || dairyOwners.length === 0) ? (
                  <p className="text-sm text-gray-500 p-3">
                    No dairy owners yet.
                  </p>
                ) : (
                  dairyOwners.map((owner) => {
                    const count = dairyCustomers.filter(
                      (c) =>
                        String(c.dairyOwnerId) === String(owner._id)
                    ).length;

                    return (
                      <button
                        key={owner._id}
                        onClick={() =>
                          navigate(`/dairy-owners/${owner._id}`)
                        }
                        className="bg-white border rounded-lg p-4 text-left hover:shadow"
                      >
                        <p className="font-semibold">{owner.name}</p>
                        <p className="text-xs text-gray-500">
                          {count} customers
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CustomerList;
