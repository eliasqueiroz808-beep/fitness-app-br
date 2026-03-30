// ── Server-side premium approval store ────────────────────────────────────
// Uses a module-level Map as an in-memory store.
// Replace with a real database (Postgres, Redis, etc.) for production
// multi-instance deployments — this works correctly for single-process Node.

interface Approval {
  paymentId: string;
  approvedAt: string;
}

// Module-level singleton — persists for the lifetime of the Node.js process.
const approvals = new Map<string, Approval>();

export function markApproved(userRef: string, paymentId: string): void {
  approvals.set(userRef, {
    paymentId,
    approvedAt: new Date().toISOString(),
  });
}

export function isApproved(userRef: string): boolean {
  return approvals.has(userRef);
}

export function getApproval(userRef: string): Approval | undefined {
  return approvals.get(userRef);
}
