import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { resendOtp } from "../services/authService.js";
import logo from "../assets/logo.png";
import SEO from "../components/SEO.jsx";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

const Register = () => {
  const { register, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  // ── Registration form state ──
  const [role, setRole] = useState("seeker");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", companyName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── OTP verification state ──
  const [step, setStep] = useState("register"); // "register" | "otp"
  const [pendingUserId, setPendingUserId] = useState(null);
  const [pendingRole, setPendingRole] = useState(null);
  const [pendingCompanyName, setPendingCompanyName] = useState(null);
  const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  // ── Resend cooldown timer ──
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // ── Focus first OTP input when step changes ──
  useEffect(() => {
    if (step === "otp" && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  // ── Handle registration form submit ──
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await register({ ...form, role });
      setPendingUserId(data.userId);
      setPendingRole(data.role);
      setPendingCompanyName(data.companyName);
      setResendCooldown(RESEND_COOLDOWN);
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  // ── Handle OTP digit input ──
  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);
    setOtpError("");

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits filled
    if (value && newValues.every((v) => v !== "")) {
      handleVerify(newValues.join(""));
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, OTP_LENGTH).split("");
    const newValues = [...otpValues];
    digits.forEach((digit, i) => {
      newValues[i] = digit;
    });
    setOtpValues(newValues);

    // Focus the next empty input or the last one
    const nextEmpty = newValues.findIndex((v) => v === "");
    const focusIndex = nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();

    // Auto-submit if complete
    if (newValues.every((v) => v !== "")) {
      handleVerify(newValues.join(""));
    }
  };

  // ── Verify OTP ──
  const handleVerify = async (otpString) => {
    const otp = otpString || otpValues.join("");
    if (otp.length !== OTP_LENGTH) {
      setOtpError("Please enter the complete 6-digit code");
      return;
    }
    setOtpError("");
    setOtpLoading(true);
    try {
      const user = await verifyOtp({
        userId: pendingUserId,
        otp,
        companyName: pendingCompanyName,
      });
      if (redirect && redirect.startsWith("/") && !redirect.startsWith("//") && user.role === "seeker") {
        navigate(redirect);
      } else {
        navigate(user.role === "employer" ? "/employer" : "/seeker");
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || "Verification failed. Please try again.");
      // Clear inputs on error so user can re-enter
      setOtpValues(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Resend OTP ──
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await resendOtp({ userId: pendingUserId });
      setResendCooldown(RESEND_COOLDOWN);
      setOtpValues(Array(OTP_LENGTH).fill(""));
      setOtpError("");
      inputRefs.current[0]?.focus();
    } catch (err) {
      setOtpError(err.response?.data?.message || "Could not resend OTP");
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // OTP VERIFICATION STEP
  // ═══════════════════════════════════════════════════════════════════════════
  if (step === "otp") {
    return (
      <div className="max-w-md mx-auto px-4 py-8 sm:py-16">
        <SEO title="Verify Account" noindex={true} />
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-green-light mb-3 sm:mb-4">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-brand-green-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold">Verify your email</h1>
          <p className="text-xs sm:text-sm text-brand-grey mt-1 sm:mt-2">
            We sent a 6-digit code to <strong className="text-brand-green-dark break-all">{form.email}</strong>
          </p>
        </div>

        <div className="card p-4 sm:p-6">
          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-1.5 sm:gap-3 mb-6" onPaste={handleOtpPaste}>
            {otpValues.map((value, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl border-2 border-brand-border focus:border-brand-green focus:ring-2 focus:ring-brand-green-light outline-none transition-all"
                disabled={otpLoading}
              />
            ))}
          </div>

          {otpError && (
            <p className="text-xs text-red-600 text-center mb-4">{otpError}</p>
          )}

          <button
            onClick={() => handleVerify()}
            disabled={otpLoading || otpValues.some((v) => v === "")}
            className="btn-primary w-full"
          >
            {otpLoading ? "Verifying..." : "Verify & Continue"}
          </button>

          {/* Resend OTP */}
          <div className="text-center mt-5">
            <p className="text-xs text-brand-grey mb-1">Didn't receive the code?</p>
            {resendCooldown > 0 ? (
              <p className="text-xs text-brand-grey">
                Resend in <span className="font-semibold text-brand-green-dark">{resendCooldown}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm font-semibold text-brand-green-dark hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            setStep("register");
            setOtpValues(Array(OTP_LENGTH).fill(""));
            setOtpError("");
          }}
          className="block mx-auto mt-6 text-sm text-brand-grey hover:text-brand-green-dark transition-colors"
        >
          ← Back to registration
        </button>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // REGISTRATION FORM STEP
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-16">
      <SEO
        title="Create Account — Job Seeker & Employer Sign Up"
        description="Register on AgriYuvaa. Discover agricultural career opportunities or hire top agribusiness & agronomy talent across India."
        canonical="/register"
      />
      <div className="text-center mb-6 sm:mb-8">
        <img src={logo} alt="AgriYuvaa" className="h-12 w-12 sm:h-14 sm:w-14 mx-auto mb-3" />
        <h1 className="text-2xl font-display font-bold">Join AgriYuvaa</h1>
        <p className="text-sm text-brand-grey mt-1">Create an account to get started</p>
      </div>

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setRole("seeker")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 ${
            role === "seeker" ? "border-brand-green bg-brand-green-light text-brand-green-dark" : "border-brand-border text-brand-grey"
          }`}
        >
          I'm a Job Seeker
        </button>
        <button
          onClick={() => setRole("employer")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 ${
            role === "employer" ? "border-brand-green bg-brand-green-light text-brand-green-dark" : "border-brand-border text-brand-grey"
          }`}
        >
          I'm an Employer
        </button>
      </div>

      <form onSubmit={handleRegister} className="card p-5 sm:p-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Full Name</label>
          <input required className="input-field mt-1 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        {role === "employer" && (
          <div>
            <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Company / Farm Name</label>
            <input required className="input-field mt-1 text-sm" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          </div>
        )}
        <div>
          <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Email</label>
          <input type="email" required className="input-field mt-1 text-sm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Phone</label>
          <input className="input-field mt-1 text-sm" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">Password</label>
          <input type="password" required minLength={6} className="input-field mt-1 text-sm" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button disabled={loading} type="submit" className="btn-primary w-full">
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-sm text-brand-grey text-center mt-6">
        Already have an account?{" "}
        <Link
          to={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"}
          className="text-brand-green-dark font-semibold"
        >
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
