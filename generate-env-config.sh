#!/bin/sh
# Generate env-config.js with runtime environment variables

cat <<EOF > /usr/share/nginx/html/env-config.js
window._env_ = {
  CORE_BASE_URL: "${CORE_BASE_URL}",
  DIAGRAM_BASE_URL: "${DIAGRAM_BASE_URL}"
};
EOF

