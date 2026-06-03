import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./auth/ProtectedRoute";

import NewSale from "./pages/Sales/NewSale";

import CustomerList from "./pages/Customers/CustomerList";
import AddCustomer from "./pages/Customers/AddCustomer";
import CustomerHistory from "./pages/Customers/CustomerHistory";

import DistributorList from "./pages/Distributors/DistributorList";
import AddDistributor from "./pages/Distributors/AddDistributor";

import IncomingStock from "./pages/Stock/IncomingStock";
import ProductList from "./pages/Products/ProductList";
import AddProduct from "./pages/Products/AddProduct";
import AddDairyOwner from "./pages/DairyOwner/AddDairyOwner";
import DairyOwnerDashboard from "./pages/DairyOwner/DairyOwnerDashboard";

import PendingPayments from "./pages/Payments/PendingPayments";
import MonthlyProfit from "./pages/Reports/MonthlyProfit";

function App() {
  const isLoggedIn = localStorage.getItem("auth") === "true";

  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        {/* Sidebar only if logged in */}
        {isLoggedIn && <Sidebar />}

        {/* <main className="flex-1 bg-gray-100 p-4 md:p-6"> */}
          <main className="flex-1" style={{ background: "#0f100e" }}>

          <Routes>
            {/* Login route */}
            <Route
              path="/"
              element={
                isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />
              }
            />

            {/* Dashboard (protected) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* New Sale (protected) */}
            <Route
              path="/sales/new"
              element={
                <ProtectedRoute>
                  <NewSale />
                </ProtectedRoute>
              }
            />
            <Route path="/sales/new/:customerId" element={<ProtectedRoute><NewSale /></ProtectedRoute>} />

            {/* Optional route with existing customer */}
            <Route
              path="/sales/new/:customerId"
              element={
                <ProtectedRoute>
                  <NewSale />
                </ProtectedRoute>
              }
            />

            {/* Customers */}
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <CustomerList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers/:customerId/history"
              element={
                <ProtectedRoute>
                  <CustomerHistory />
                </ProtectedRoute>
              }
            />

            {/* Distributors */}
            <Route
              path="/distributors"
              element={
                <ProtectedRoute>
                  <DistributorList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/distributors/add"
              element={
                <ProtectedRoute>
                  <AddDistributor />
                </ProtectedRoute>
              }
            />

            {/* Stock */}
            <Route
  path="/stock/in"
  element={
    <ProtectedRoute>
      <IncomingStock />
    </ProtectedRoute>
  }
/>


            {/* Products */}
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/add"
              element={
                <ProtectedRoute>
                  <AddProduct />
                </ProtectedRoute>
              }
            />

            {/* Dairy Owners */}
<Route
  path="/dairy-owners"
  element={
    <ProtectedRoute>
      {/* choose what you want here: list or dashboard */}
      <DairyOwnerDashboard />
      {/* or <DairyOwnerList /> if you create that component */}
    </ProtectedRoute>
  }
/>
            <Route
              path="/dairy-owners/new"
              element={
                <ProtectedRoute>
                  <AddDairyOwner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dairy-owners/:ownerId"
              element={
                <ProtectedRoute>
                  <DairyOwnerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Pending payments */}
            <Route
              path="/payments/pending"
              element={
                <ProtectedRoute>
                  <PendingPayments />
                </ProtectedRoute>
              }
            />

            {/* Reports */}
            <Route
              path="/reports/monthly"
              element={
                <ProtectedRoute>
                  <MonthlyProfit />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;