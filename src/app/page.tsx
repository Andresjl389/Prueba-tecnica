"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import { loginRequest } from "@/services/auth";
import { Input } from "@/componentes/forms/input";
import { Button } from "@/componentes/forms/button";

const roleRoutes: Record<string, string> = {
  CLIENTE: "/cliente",
  SOPORTE: "/soporte",
  ADMIN: "/admin",
};

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const showToast = (type: "error" | "success", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = "Ingresa tu correo";
    if (email && !email.includes("@")) errors.email = "Formato de correo inválido";
    if (!password) errors.password = "Ingresa tu contraseña";
    if (password && password.length < 6)
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setToast(null);
    setLoading(true);

    try {
      const user = await loginRequest({ email, password });
      login(user);

      const redirect = roleRoutes[user.role.nombre] ?? "/";
      showToast("success", "Inicio de sesión exitoso. Redirigiendo...");
      setTimeout(() => {
        window.location.href = redirect;
      }, 800);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo iniciar sesión. Verifica tus credenciales.";
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 left-1/2 z-50 max-w-md -translate-x-1/2 rounded-xl border px-4 py-3 text-sm shadow-lg ${
              toast.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/90 p-8 shadow-xl backdrop-blur"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 space-y-2 text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900">Hola de nuevo</h1>
            <p className="text-sm text-gray-600">
              Ingresa tus credenciales para continuar
            </p>
          </motion.div>

          <motion.form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading) submit();
            }}
            animate={toast?.type === "error" ? { x: [-8, 8, -8, 8, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <div className="space-y-1">
              <Input
                label="Correo"
                type="email"
                placeholder="nombre@correo.com"
                onChangeValue={setEmail}
                autoComplete="email"
                value={email}
                required
                error={fieldErrors.email}
              />
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Input
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  onChangeValue={setPassword}
                  autoComplete="current-password"
                  value={password}
                  required
                  error={fieldErrors.password}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-[38px] text-xs text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}
