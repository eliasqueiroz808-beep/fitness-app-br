// ── Persistent anonymous user identifier ──────────────────────────────────
// Used as `external_reference` in Mercado Pago preferences so the webhook
// knows which "user" to unlock premium for.

const USER_REF_KEY = "fitbr_user_ref";

export function getUserRef(): string {
  if (typeof window === "undefined") return "";
  let ref = localStorage.getItem(USER_REF_KEY);
  if (!ref) {
    ref = crypto.randomUUID();
    localStorage.setItem(USER_REF_KEY, ref);
  }
  return ref;
}
