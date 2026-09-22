import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { forgotPassword, resetPassword, resendOtp } from "../services/authService.js";
import logo from "../assets/logo.png";
import SEO from "../components/SEO.jsx";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Enter email, 2 = Enter OTP & new password, 3 = Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword({ email });
      setStep(2);
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code. Please check the email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    try {
      await forgotPassword({ email });
      setResendCooldown(60);
      alert("A new 6-digit reset code has been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email, otp, newPassword });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired reset code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <SEO title="Reset Password" noindex={true} />
      <div className="text-center mb-8">
        <img src={logo} alt="AgriYuvaa" className="h-14 w-14 mx-auto mb-3" />
        <h1 className="text-2xl font-display font-bold">
          {step === 3 ? "Password Reset Complete" : "Reset Your Password"}
        </h1>
        <p className="text-sm text-brand-grey mt-1">
          {step === 1 && "Enter your registered email to receive a 6-digit verification code."}
          {step === 2 && `Enter the 6-digit code sent to ${email}`}
          {step === 3 && "Your password has been successfully updated."}
        </p>
      </div>

      <div className="card p-6 md:p-8 space-y-5 shadow-sm border border-brand-border">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ── STEP 1: ENTER EMAIL ── */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
                Registered Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. rahul@example.com"
                className="input-field mt-1 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button disabled={loading} type="submit" className="btn-primary w-full py-2.5 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending Code...
                </>
              ) : (
                "Send Reset Code"
              )}
            </button>
          </form>
        )}

        {/* ── STEP 2: ENTER OTP & NEW PASSWORD ── */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
                6-Digit Verification Code *
              </label>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="Enter verification code"
                className="input-field mt-1 text-sm text-gray-800 placeholder:text-gray-400"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
                New Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Min. 6 characters"
                className="input-field mt-1 text-sm"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Re-type new password"
                className="input-field mt-1 text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button disabled={loading} type="submit" className="btn-primary w-full py-2.5 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Resetting Password...
                </>
              ) : (
                "Update Password"
              )}
            </button>

            <div className="flex items-center justify-between pt-2 text-xs text-brand-grey">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="hover:text-brand-black underline"
              >
                Change Email
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className={`font-semibold ${
                  resendCooldown > 0 ? "text-gray-400 cursor-not-allowed" : "text-brand-green-dark hover:underline"
                }`}
              >
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend Code"}
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3: SUCCESS ── */}
        {step === 3 && (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Your password has been changed successfully. You can now log in using your new credentials.
            </p>
            <Link to="/login" className="btn-primary w-full block text-center py-2.5 text-xs font-bold">
              Proceed to Login →
            </Link>
          </div>
        )}
      </div>

      <div className="text-center mt-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-grey hover:text-brand-black transition-colors"
        >
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
