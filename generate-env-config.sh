#!/bin/sh
# Generate env-config.js with runtime environment variables

cat <<EOF > /usr/share/nginx/html/env-config.js
window._env_ = {
  CORE_SERVICE_URL: "${CORE_SERVICE_URL}",
  DIAGRAM_SERVICE_URL: "${DIAGRAM_SERVICE_URL}"
};
EOF

