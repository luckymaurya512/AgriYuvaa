import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Bell, Check, ExternalLink, Sparkles, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  enablePushNotifications,
} from "../services/notificationService.js";
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
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pushStatus, setPushStatus] = useState("");
  const notifRef = useRef(null);
  const navigate = useNavigate();

  const loadNotifications = () => {
    if (user) {
      fetchNotifications()
        .then((data) => {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEnablePush = async () => {
    setPushStatus("requesting");
    const res = await enablePushNotifications();
    if (res.success) {
      setPushStatus("enabled");
      alert("✅ Web Push Notifications enabled! You will receive instant device alerts when employers you follow post new jobs.");
    } else {
      setPushStatus("denied");
      alert(res.reason || "Notification permission denied");
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead().catch(() => {});
    setUnreadCount(0);
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await markNotificationRead(notif._id).catch(() => {});
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    setNotifOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { label: "Find Jobs", to: "/jobs" },
    { label: "Govt Vacancies", to: "/govt-jobs", isGovt: true },
    { label: "Resume Builder", to: "/resume-builder" },
    { label: "Blog", to: "/blog" },
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

        <nav className="hidden md:flex items-center h-full gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium transition-colors text-brand-black/80 hover:text-brand-green-dark flex items-center h-full"
            >
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 rounded-xl border border-brand-border hover:border-brand-green/50 text-gray-700 hover:text-brand-black transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-brand-border overflow-hidden z-50">
                    <div className="p-3.5 bg-gray-50 border-b border-brand-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-xs uppercase tracking-wider text-brand-black">
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] font-semibold text-brand-green-dark hover:underline flex items-center gap-1"
                        >
                          <Check size={12} /> Mark all read
                        </button>
                      )}
                    </div>

                    {/* Enable Device Push Notification Banner */}
                    <div className="p-3 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-emerald-950 leading-tight">
                        <strong>Get Instant Device Alerts</strong>
                        <p className="text-[10px] text-emerald-800/80">Push alerts on mobile & desktop</p>
                      </div>
                      <button
                        onClick={handleEnablePush}
                        className="text-[11px] font-bold bg-emerald-800 text-white px-2.5 py-1 rounded-lg hover:bg-emerald-900 transition-colors shrink-0 shadow-2xs"
                      >
                        Enable 🔔
                      </button>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-brand-grey space-y-1">
                          <Bell size={20} className="mx-auto text-gray-300" />
                          <p>No notifications yet.</p>
                          <p className="text-[11px]">Follow employers to get notified when they post jobs!</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-3.5 text-xs hover:bg-gray-50 cursor-pointer transition-colors space-y-1 ${
                              !n.isRead ? "bg-emerald-50/30 font-medium" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-brand-black">{n.title}</p>
                              {!n.isRead && (
                                <span className="h-2 w-2 rounded-full bg-emerald-600 shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-gray-600 text-[11px] leading-relaxed">{n.message}</p>
                            <span className="text-[10px] text-brand-grey block">
                              {new Date(n.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/profile"
                className="px-3 py-2 rounded-xl border border-brand-border hover:border-brand-black/30 bg-white hover:bg-brand-surface text-brand-black text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="My Profile & Account Settings"
              >
                <User size={14} className="text-brand-grey" />
                <span>Profile</span>
              </Link>

              <Link
                to={dashboardPathForRole(user.role)}
                className="px-3 py-2 rounded-xl border border-brand-border hover:border-brand-black/30 bg-white hover:bg-brand-surface text-brand-black text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <LayoutDashboard size={14} className="text-brand-grey" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-xl border border-brand-border text-brand-grey hover:text-red-600 hover:bg-red-50 hover:border-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                aria-label="Log out of account"
                title="Log out"
              >
                <LogOut size={14} /> <span>Logout</span>
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

        {/* Mobile Header Right: Action Button + Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {!user ? (
            <Link
              to="/login"
              className="btn-primary text-xs py-1.5 px-3 font-semibold shadow-xs whitespace-nowrap"
            >
              Login
            </Link>
          ) : ["superadmin", "admin", "employer"].includes(user.role) ? (
            <Link
              to="/employer/post-job"
              className="btn-primary text-xs py-1.5 px-3 font-semibold shadow-xs whitespace-nowrap"
            >
              Post a Job
            </Link>
          ) : (
            <Link
              to="/jobs"
              className="btn-primary text-xs py-1.5 px-3 font-semibold shadow-xs whitespace-nowrap"
            >
              Jobs
            </Link>
          )}

          <button
            className="p-1.5 rounded-lg text-brand-black hover:text-brand-green-dark transition-colors cursor-pointer"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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
              <Link to="/profile" className="block text-sm font-bold text-emerald-900" onClick={() => setOpen(false)}>
                👤 My Profile & Account Settings
              </Link>
              <Link to={dashboardPathForRole(user.role)} className="block text-sm font-semibold text-brand-black" onClick={() => setOpen(false)}>
                📊 Dashboard
              </Link>
              <button onClick={handleLogout} className="block text-sm font-semibold text-left w-full text-red-600">
                🚪 Logout
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
