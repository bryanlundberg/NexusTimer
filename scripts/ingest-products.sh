#!/usr/bin/env bash
#
# Pushes scraped product files into Meilisearch through the admin ingestion endpoint.
# One request per category file; the endpoint upserts by id, so re-running is safe.
#
# Usage:
#   scripts/ingest-products.sh <dir-or-file...>
#

set -euo pipefail

: "${INGESTION_BASE_URL:?INGESTION_BASE_URL is required}"
: "${ADMIN_TOKEN:?ADMIN_TOKEN is required}"

URL="${INGESTION_BASE_URL%/}/api/v1/admin/ingestion/products"

files=()
for path in "$@"; do
  if [ -d "$path" ]; then
    for found in "$path"/*.json; do
      if [ -e "$found" ]; then
        files+=("$found")
      fi
    done
  elif [ -f "$path" ]; then
    files+=("$path")
  fi
done

if [ ${#files[@]} -eq 0 ]; then
  echo "No .json files found in: $*" >&2
  exit 1
fi

for file in "${files[@]}"; do
  echo "-> $(basename "$file")"

  curl -sS -f --retry 3 --retry-delay 2 \
    -X POST "$URL" \
    -H 'content-type: application/json' \
    -H "x-admin-token: $ADMIN_TOKEN" \
    --data-binary "@$file"

  echo
done
