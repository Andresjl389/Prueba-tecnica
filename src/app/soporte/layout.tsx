import ProtectedRoute from "@/componentes/ProtectedRoute";

export default function SoporteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute roles={["SOPORTE"]}>
      {children}
    </ProtectedRoute>
  );
}
