#!/bin/sh
# Generate env-config.js with runtime environment variables

cat <<EOF > /usr/share/nginx/html/env-config.js
window._env_ = {
  PROXY_SERVICE_URL: "${PROXY_SERVICE_URL}"
};
EOF

