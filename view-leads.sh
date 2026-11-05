#!/bin/sh
# Print every saved lead (newest last). Needs the KV namespace id.
#   KV_ID=xxxxxxxx sh view-leads.sh
set -e
: "${KV_ID:?Set KV_ID to the LEADS namespace id}"
for key in $(npx wrangler kv key list --namespace-id "$KV_ID" | grep -o '"name": *"[^"]*"' | cut -d'"' -f4); do
  echo "== $key"
  npx wrangler kv key get "$key" --namespace-id "$KV_ID"
  echo
done
