import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? "bg-gray-800 text-yellow-300"
      : "hover:bg-gray-800";

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-4 hidden md:flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Sawali Traders</h1>

      <nav className="flex-1 space-y-1 text-sm">
        <Link to="/dashboard" className={`block px-3 py-2 rounded ${isActive("/dashboard")}`}>
          Dashboard
        </Link>

        <p className="mt-4 text-gray-400 uppercase text-xs">Sales</p>
        <Link to="/sales/new" className={`block px-3 py-2 rounded ${isActive("/sales/new")}`}>
          New Sale
        </Link>

        <p className="mt-4 text-gray-400 uppercase text-xs">Customers</p>
        <Link to="/customers" className={`block px-3 py-2 rounded ${isActive("/customers")}`}>
          Customers
        </Link>

        <p className="mt-4 text-gray-400 uppercase text-xs">Distributors</p>
        <Link
          to="/distributors"
          className={`block px-3 py-2 rounded ${isActive("/distributors")}`}
        >
          Distributors
        </Link>

        <p className="mt-4 text-gray-400 uppercase text-xs">Stock</p>

<Link
  to="/stock/in"
  className="block px-3 py-2 rounded hover:bg-gray-800"
>
  Incoming Stock
</Link>

<p className="mt-4 text-gray-400 uppercase text-xs">Products</p>
<Link
  to="/products"
  className="block px-3 py-2 rounded hover:bg-gray-800"
>
  Products
</Link>
      <p className="mt-4 text-gray-400 uppercase text-xs">Dairy Owners</p>
<Link
  to="/dairy-owners/new"
  className="block px-3 py-2 rounded hover:bg-gray-800"
>
  Dairy Owners
</Link>


      </nav>

      <button
        onClick={handleLogout}
        className="mt-4 w-full bg-red-600 py-2 rounded-lg text-sm hover:bg-red-500"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
