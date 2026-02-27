// Frontend API configuration.
// For local development we use the FastAPI backend on localhost.
// In production this should point to the deployed NewDay API domain.
window.APP_CONFIG = {
  API_BASE:
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "http://127.0.0.1:8001"
      : "https://api.newday.your-domain.com",
};