import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.png";

const dashboardPathForRole = (role) => {
  switch (role) {
    case "superadmin": return "/superadmin";
    case "admin": return "/admin";
    case "employer": return "/employer";
    default: return "/seeker";
  }
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(dashboardPathForRole(user.role));
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <img src={logo} alt="AgriYuvaa" className="h-14 w-14 mx-auto mb-3" />
        <h1 className="text-2xl font-display font-bold">Welcome back</h1>
        <p className="text-sm text-brand-grey mt-1">Log in to continue to AgriYuvaa</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Email</label>
          <input
            type="email"
            required
            className="input-field mt-1 text-sm"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Password</label>
          <input
            type="password"
            required
            className="input-field mt-1 text-sm"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button disabled={loading} type="submit" className="btn-primary w-full">
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-sm text-brand-grey text-center mt-6">
        New to AgriYuvaa?{" "}
        <Link to="/register" className="text-brand-green-dark font-semibold">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
