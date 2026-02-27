// Frontend API configuration.
// Локально: ходим на FastAPI по localhost.
// На Vercel (и любых не‑localhost доменах) включаем демо‑режим без реального API.
window.APP_CONFIG = (function () {
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isLocal) {
    return {
      API_BASE: "http://127.0.0.1:8001",
      MOCK_MODE: false,
    };
  }

  // Прод / превью без поднятого backend: включаем мок‑данные.
  return {
    API_BASE: null,
    MOCK_MODE: true,
  };
})();