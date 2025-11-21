const SESSION_SECRET = process.env.SESSION_SECRET ?? "";

type SessionData = {
  id: number;
  email: string;
  role: string;
};

const subtle =
  typeof crypto !== "undefined"
    ? // @ts-expect-error - webcrypto on Node is namespaced
      (crypto.subtle ?? crypto.webcrypto?.subtle)
    : undefined;

function base64UrlEncode(input: string) {
  if (typeof btoa !== "undefined") {
    return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input).toString("base64url");
  }
  throw new Error("No base64 encoder available");
}

function base64UrlDecode(input: string) {
  if (typeof atob !== "undefined") {
    const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
    return atob(normalized);
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "base64url").toString("utf8");
  }
  throw new Error("No base64 decoder available");
}

async function sign(value: string) {
  if (!subtle) throw new Error("Crypto not available");
  const key = await subtle.importKey(
    "raw",
    new TextEncoder().encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await subtle.sign("HMAC", key, new TextEncoder().encode(value));
  const bytes = new Uint8Array(sig);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return base64UrlEncode(binary);
}

export async function createSessionToken(data: SessionData) {
  if (!SESSION_SECRET) throw new Error("SESSION_SECRET is not set");
  const payload = JSON.stringify(data);
  const encoded = base64UrlEncode(payload);
  const signature = await sign(encoded);
  return `${encoded}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined
): Promise<SessionData | null> {
  if (!token || !SESSION_SECRET || !subtle) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = await sign(encoded);
  // timing safe compare
  const a = expected.length;
  const b = signature.length;
  if (a !== b) return null;
  let diff = 0;
  for (let i = 0; i < a; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  if (diff !== 0) return null;
  try {
    return JSON.parse(base64UrlDecode(encoded));
  } catch {
    return null;
  }
}
