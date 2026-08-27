import React, { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, register as registerApi, getMe, verifyOtp as verifyOtpApi } from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const { user: freshUser } = await getMe();
          setUser(freshUser);
          localStorage.setItem("user", JSON.stringify(freshUser));
        } catch {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    };
    bootstrap();
  }, []);

  const login = async (email, password) => {
    const data = await loginApi({ email, password });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  // Register now returns { userId, message, role, companyName } — NO tokens yet.
  // User must verify OTP before being logged in.
  const register = async (payload) => {
    const data = await registerApi(payload);
    return data; // { message, userId, role, companyName }
  };

  // After OTP verification, the backend returns tokens + user
  const verifyOtp = async (payload) => {
    const data = await verifyOtpApi(payload);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
