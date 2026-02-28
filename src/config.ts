/**
 * NewDay frontend config.
 * For Vite: use env vars VITE_LEAD7_WEBHOOK_BASE, VITE_API_BASE.
 * Defaults: n8n production webhooks, no backend in prod (MOCK).
 */
const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export const config = {
  API_BASE: import.meta.env.VITE_API_BASE ?? (isLocal ? "http://127.0.0.1:8001" : null),
  MOCK_MODE: import.meta.env.VITE_MOCK_MODE !== "false" && !isLocal,
  LEAD7_WEBHOOK_BASE:
    import.meta.env.VITE_LEAD7_WEBHOOK_BASE ?? "https://n8n.neyronikol.ru/webhook",
} as const;
