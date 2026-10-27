#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="${1:-$SCRIPT_DIR/json}"
OUTPUT_FILE="$OUTPUT_DIR/card-list-0000.json"

mkdir -p "$OUTPUT_DIR"

printf 'Downloading card set data to %s\n' "${OUTPUT_FILE##*/}"

BASE_URL="https://shadowverse-wb.com/web/CardList/cardList"
INCLUDE_TOKEN=1
LANGUAGE="en"
OFFSET=0
curl \
    --fail \
    --silent \
    --show-error \
    --header "Lang: $LANGUAGE" \
    --get \
    --data-urlencode "include_token=$INCLUDE_TOKEN" \
    --data-urlencode "offset=$OFFSET" \
    --output "$OUTPUT_FILE" \
    "$BASE_URL"

if jq -e '.data_headers.result_code == 90000 or (.maintenance | type == "object")' "$OUTPUT_FILE" > /dev/null; then
    printf 'Download failed: the official card API is under maintenance. Try again later.\n' >&2
    printf '### Game data download failed\n\nThe official card API is under maintenance. Try again later.\n' >> "${GITHUB_STEP_SUMMARY:-/dev/null}" || true
    exit 1
fi

printf 'Downloaded card set data\n'
