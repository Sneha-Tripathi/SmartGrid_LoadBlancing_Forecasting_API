import { FaArrowRight } from "react-icons/fa";

export default function Button({
  children,
  variant = "primary",
  icon = false,
  className = "",
  type = "button",
  onClick,
  disabled,
  ariaLabel,
}) {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all duration-300 active:scale-[0.97]";

  const styles = {
    primary:
      "bg-teal-700 text-white hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-600/25 shadow-lg shadow-teal-900/20",

    outline:
      "border border-slate-700 bg-transparent text-white hover:border-teal-500 hover:text-teal-400 hover:bg-teal-500/5",

    secondary:
      "border border-slate-700 bg-[#0B1220] text-slate-200 hover:border-teal-600 hover:text-white hover:bg-teal-600/10",

    ghost:
      "bg-transparent text-slate-300 hover:text-teal-400 hover:bg-white/5",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${base} ${styles[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      {children}
      {icon && <FaArrowRight className="text-xs ml-1" />}
    </button>
  );
}