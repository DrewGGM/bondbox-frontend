// Runtime configuration
// En desarrollo, este archivo se usa directamente
// En producción (Docker), se genera dinámicamente desde variables de entorno

window.ENV = window.ENV || {
  VITE_API_GATEWAY_URL: "https://bondy.bond-box.shop"
};
