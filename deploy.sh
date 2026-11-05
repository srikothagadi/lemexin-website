#!/bin/sh
# Commit everything and push to GitHub. Cloudflare then deploys automatically.
set -e
cd "$(dirname "$0")"
git add -A
git commit -m "${1:-Update website}" || echo "Nothing new to commit"
git push
