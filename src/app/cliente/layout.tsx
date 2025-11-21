import ProtectedRoute from "@/componentes/ProtectedRoute";

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute roles={["CLIENTE"]}>
      {children}
    </ProtectedRoute>
  );
}
