#!/bin/sh
# One-time setup: create the Pages project and the KV namespace for leads.
# After it runs, bind the namespace in Cloudflare:
#   Pages > lemexin > Settings > Functions > KV namespace bindings > LEADS
set -e
npx wrangler login
npx wrangler pages project create lemexin --production-branch main
npx wrangler kv namespace create LEADS
echo
echo "Copy the namespace id above into the LEADS binding, then run: sh publish.sh"
