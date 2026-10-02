import React, { useEffect } from "react";
import { AlertTriangle, AlertCircle, Info, X, ShieldAlert } from "lucide-react";

/**
 * Reusable Confirmation Dialog Modal
 * Designed for critical actions (deleting jobs, promoting/demoting users, suspending accounts, resetting SEO).
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  subtitle = "",
  message = "This action is critical and may have permanent consequences. Please review carefully before proceeding.",
  itemName = "",
  itemType = "",
  confirmText = "Yes, Proceed",
  cancelText = "Think Again / Cancel",
  variant = "danger", // "danger" | "warning" | "info"
  loading = false,
}) => {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconBg: "bg-rose-50 border-rose-200 text-rose-600",
          icon: <AlertTriangle size={26} className="text-rose-600" />,
          confirmBtn:
            "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 focus:ring-rose-500",
          itemBadge: "bg-rose-50 text-rose-900 border-rose-200",
          warningCallout:
            "bg-rose-50/70 border-rose-200/80 text-rose-800",
        };
      case "warning":
        return {
          iconBg: "bg-amber-50 border-amber-200 text-amber-600",
          icon: <ShieldAlert size={26} className="text-amber-600" />,
          confirmBtn:
            "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200 focus:ring-amber-500",
          itemBadge: "bg-amber-50 text-amber-900 border-amber-200",
          warningCallout:
            "bg-amber-50/70 border-amber-200/80 text-amber-800",
        };
      case "info":
      default:
        return {
          iconBg: "bg-emerald-50 border-emerald-200 text-emerald-700",
          icon: <Info size={26} className="text-emerald-700" />,
          confirmBtn:
            "bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-200 focus:ring-emerald-500",
          itemBadge: "bg-emerald-50 text-emerald-900 border-emerald-200",
          warningCallout:
            "bg-emerald-50/70 border-emerald-200/80 text-emerald-800",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-150">
        {/* Close icon */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="p-6 space-y-4">
          {/* Header with Icon */}
          <div className="flex items-start gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-2xs ${styles.iconBg}`}
            >
              {styles.icon}
            </div>
            <div className="space-y-1 pr-4">
              <h3 className="font-display font-bold text-lg text-gray-900 leading-snug">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-gray-500 leading-normal">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Item Highlight Pill if provided */}
          {itemName && (
            <div
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 break-all ${styles.itemBadge}`}
            >
              <span className="truncate">
                {itemType ? `${itemType}: ` : ""}
                <span className="font-bold underline decoration-dotted">
                  {itemName}
                </span>
              </span>
            </div>
          )}

          {/* Core message explanation */}
          <div className="text-xs text-gray-600 leading-relaxed bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
            {typeof message === "string" ? <p>{message}</p> : message}
          </div>

          {/* Permanent consequence warning for danger */}
          {variant === "danger" && (
            <div
              className={`text-[11px] p-2.5 rounded-lg border flex items-center gap-1.5 ${styles.warningCallout}`}
            >
              <AlertCircle size={13} className="shrink-0" />
              <span>
                <strong>Warning:</strong> This operation is permanent and cannot be undone.
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 px-4 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors cursor-pointer shadow-2xs hover:text-gray-900 text-center"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 flex items-center justify-center gap-2 ${styles.confirmBtn} ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
