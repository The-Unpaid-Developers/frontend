#!/bin/sh
# Docker entrypoint script to inject environment variables at runtime

set -e

# Generate the env-config.js file with environment variables
sh /generate-env-config.sh

# Execute the CMD (start nginx)
exec "$@"

