// Runtime configuration
// En desarrollo, este archivo se usa directamente
// En producción (Docker), se genera dinámicamente desde variables de entorno

window.ENV = window.ENV || {
  VITE_API_GATEWAY_URL: "https://bondy.bond-box.shop",
  VITE_APP_NAME: "BondBox",
  VITE_APP_VERSION: "1.0.0",
  VITE_HARDCODED_GROUP_ID: "3fff64fa-a3c4-41f0-8a06-9195abb41bf3",
  VITE_HARDCODED_JWT_TOKEN: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY4ZGNiNWM0YjcyMDdhZDY5NmRmMWE3MCIsImVtYWlsIjoiZHJld0Bnb2QuY29tIiwiZXhwIjoxNzYwMTI5MTkwfQ.oANfHyH8IU-_dAOCYahvgQFQCrVGntibLKA3wN4J0CM",
  VITE_ENABLE_AI_FEATURES: "true"
};
