#!/bin/sh
set -e

# Generar archivo de configuración con variables de entorno reales
cat > /usr/share/nginx/html/config.js << EOF
window.ENV = {
  VITE_API_GATEWAY_URL: "${VITE_API_GATEWAY_URL:-http://localhost:8000}"
};
EOF

echo "✅ Runtime configuration generated:"
cat /usr/share/nginx/html/config.js

# Iniciar nginx
exec nginx -g 'daemon off;'
