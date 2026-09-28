import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.png";
import SEO from "../components/SEO.jsx";

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
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
        navigate(redirect);
      } else {
        navigate(dashboardPathForRole(user.role));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-16">
      <SEO title="Log In" noindex={true} />
      <div className="text-center mb-6 sm:mb-8">
        <img src={logo} alt="AgriYuvaa" className="h-12 w-12 sm:h-14 sm:w-14 mx-auto mb-3" />
        <h1 className="text-2xl font-display font-bold">Welcome back</h1>
        <p className="text-sm text-brand-grey mt-1">Log in to continue to AgriYuvaa</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-5 sm:p-6 space-y-4">
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
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Password</label>
            <Link to="/forgot-password" className="text-xs text-brand-green-dark hover:underline font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="input-field !pr-10 text-sm"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 focus:outline-none cursor-pointer transition-colors"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button disabled={loading} type="submit" className="btn-primary w-full">
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-sm text-brand-grey text-center mt-6">
        New to AgriYuvaa?{" "}
        <Link
          to={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : "/register"}
          className="text-brand-green-dark font-semibold"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
