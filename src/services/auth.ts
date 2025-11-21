export type LoginPayload = {
  email: string;
  password: string;
};

export async function loginRequest({ email, password }: LoginPayload) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    const message = data?.error ?? "Credenciales incorrectas";
    throw new Error(message);
  }

  return data;
}
