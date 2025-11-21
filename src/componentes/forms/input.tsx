import { type InputHTMLAttributes } from "react";

type InputProps = {
  label?: string;
  error?: string;
  onChangeValue?: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">;

export function Input({
  label,
  error,
  onChangeValue,
  className = "",
  type = "text",
  ...rest
}: InputProps) {
  const hasError = Boolean(error);
  const inputClasses = [
    "w-full rounded-xl border px-3 py-2 text-gray-900 shadow-sm outline-none transition bg-white/70",
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200",
    className,
  ].join(" ");

  return (
    <label className="flex w-full flex-col gap-1">
      {label ? (
        <span className="text-sm font-medium text-gray-800">{label}</span>
      ) : null}
      <input
        type={type}
        onChange={(e) => onChangeValue?.(e.target.value)}
        className={inputClasses}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${label}-error` : undefined}
        {...rest}
      />
      {error ? (
        <span
          className="text-xs font-medium text-red-600"
          id={label ? `${label}-error` : undefined}
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}
