import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(
      "https://sawali-traders.onrender.com/api/auth/signin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.username,
          password: form.password,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("auth", "true");

      window.location.href = "/dashboard";
    } else {
      setError(data.message);
    }
  } catch (err) {
    setError("Server Error");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Owner Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
              placeholder="Enter owner email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-center text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
