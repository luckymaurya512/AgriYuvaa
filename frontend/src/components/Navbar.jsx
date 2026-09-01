import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.png";

const dashboardPathForRole = (role) => {
  switch (role) {
    case "superadmin":
      return "/superadmin";
    case "admin":
      return "/admin";
    case "employer":
      return "/employer";
    default:
      return "/seeker";
  }
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { label: "Find Jobs", to: "/jobs" },
    { label: "Resume Builder", to: "/resume-builder" },
    { label: "Employers", to: "/employers" },
    { label: "About", to: "/about" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="AgriYuvaa" className="h-9 w-9 object-contain" />
          <span className="font-display font-bold text-lg">
            Agri<span className="text-brand-green">Yuvaa</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-brand-black/80 hover:text-brand-green-dark transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to={dashboardPathForRole(user.role)} className="btn-secondary text-sm py-2">
                <User size={16} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-primary text-sm py-2">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold hover:text-brand-green-dark">
                Log in
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2">
                Join AgriYuvaa
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-brand-border bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="block text-sm font-medium" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <hr className="border-brand-border" />
          {user ? (
            <>
              <Link to={dashboardPathForRole(user.role)} className="block text-sm font-semibold" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="block text-sm font-semibold text-left w-full">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-sm font-semibold" onClick={() => setOpen(false)}>
                Log in
              </Link>
              <Link to="/register" className="block text-sm font-semibold text-brand-green-dark" onClick={() => setOpen(false)}>
                Join AgriYuvaa
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
