import { type ButtonHTMLAttributes } from "react";

type ButtonProps = {
  loading?: boolean;
  variant?: "primary" | "secondary";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  className = "",
  type = "button",
  loading = false,
  disabled,
  variant = "primary",
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-70";
  const styles =
    variant === "secondary"
      ? "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
      : "bg-gray-900 text-white hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900";
  return (
    <button
      className={`${base} ${styles} ${className}`}
      type={type}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? "Procesando..." : children}
    </button>
  );
}
