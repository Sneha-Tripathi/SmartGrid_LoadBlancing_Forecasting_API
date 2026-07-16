import { FaArrowRight } from "react-icons/fa";

export default function Button({
  children,
  variant = "primary",
  icon = false,
  className = "",
  type = "button",
}) {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all duration-300";

  const styles = {
    primary:
      "bg-teal-700 text-white hover:bg-teal-600 shadow-lg shadow-teal-900/20",

    outline:
      "border border-slate-700 bg-transparent text-white hover:border-teal-500 hover:text-teal-400",

    secondary:
      "border border-slate-700 bg-[#0B1220] text-slate-200 hover:border-teal-600 hover:text-white",

    ghost:
      "bg-transparent text-slate-300 hover:text-teal-400",
  };

  return (
    <button
      type={type}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}

      {icon && <FaArrowRight className="text-xs ml-1" />}
    </button>
  );
}