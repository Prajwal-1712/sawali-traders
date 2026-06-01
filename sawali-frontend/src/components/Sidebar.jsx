

import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname.startsWith(path);

  const linkStyle = (path) => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 8,
    fontSize: 14,
    color: isActive(path) ? "#ffffff" : "#8b9ab0",
    background: isActive(path) ? "#1e2a3a" : "transparent",
    border: isActive(path) ? "0.5px solid #2d3f55" : "0.5px solid transparent",
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.15s",
  });

  const sectionLabel = {
    fontSize: 10,
    color: "#3d4f63",
    textTransform: "uppercase",
    letterSpacing: 1,
    padding: "12px 12px 4px",
    margin: 0,
  };

  const handleLogout = () => {
  localStorage.removeItem("auth");
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/";
};

  return (
    <aside
      style={{
        width: 220,
        background: "#0d1117",           // ← dashboard शी match: dark navy
        borderRight: "0.5px solid #1a2332",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "1.25rem 0.75rem",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "0 12px 1.25rem",
          borderBottom: "0.5px solid #1a2332",
          marginBottom: "0.75rem",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            color: "#ffffff",            // ← dashboard logo: white
            letterSpacing: 0.5,
          }}
        >
          Sawali Traders
        </h1>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto" }}>
        <Link to="/dashboard" style={linkStyle("/dashboard")}>
          🏠 Dashboard
        </Link>

        <p style={sectionLabel}>Sales</p>
        <Link to="/sales/new" style={linkStyle("/sales/new")}>
          🛒 New Sale
        </Link>

        <p style={sectionLabel}>Customers</p>
        <Link to="/customers" style={linkStyle("/customers")}>
          👥 Customers
        </Link>

        <p style={sectionLabel}>Distributors</p>
        <Link to="/distributors" style={linkStyle("/distributors")}>
          🏪 Distributors
        </Link>

        <p style={sectionLabel}>Stock</p>
        <Link to="/stock/in" style={linkStyle("/stock/in")}>
          📥 Incoming Stock
        </Link>

        <p style={sectionLabel}>Products</p>
        <Link to="/products" style={linkStyle("/products")}>
          📦 Products
        </Link>

        <p style={sectionLabel}>Dairy Owners</p>
        <Link to="/dairy-owners" style={linkStyle("/dairy-owners")}>
          🥛 Dairy Owners
        </Link>
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          marginTop: 12,
          width: "100%",
          background: "#1a0f0f",         // ← dashboard logout button शी match
          border: "0.5px solid #4a1515",
          borderRadius: 8,
          padding: "10px",
          color: "#f87171",
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;