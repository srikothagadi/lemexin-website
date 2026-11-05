#!/bin/sh
# Publish the site to Cloudflare Pages.
#   sh publish.sh        publish to the live site
#   sh publish.sh test   publish a preview (the live site is untouched)
set -e
cd "$(dirname "$0")"
PROJECT="${CF_PROJECT:-lemexin}"

if [ "$1" = "test" ]; then
  npx wrangler pages deploy public --project-name "$PROJECT" --branch preview
else
  npx wrangler pages deploy public --project-name "$PROJECT" --branch main
fi
