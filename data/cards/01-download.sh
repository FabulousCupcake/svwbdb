#!/usr/bin/env bash

set -euo pipefail

BASE_URL="https://shadowverse-wb.com/web/CardList/cardList"
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="${1:-$SCRIPT_DIR/json}"
INCLUDE_TOKEN=1
OFFSET=0
TOTAL_COUNT=1

mkdir -p "$OUTPUT_DIR"

while (( OFFSET < TOTAL_COUNT )); do
    OUTPUT_FILE="$(printf '%s/card-list-%04d.json' "$OUTPUT_DIR" "$OFFSET")"

    printf 'Downloading offset %d to %s\n' "$OFFSET" "${OUTPUT_FILE##*/}"

    curl \
        --fail \
        --silent \
        --show-error \
        --get \
        --data-urlencode "include_token=$INCLUDE_TOKEN" \
        --data-urlencode "offset=$OFFSET" \
        --output "$OUTPUT_FILE" \
        "$BASE_URL"

    PAGE_COUNT="$(jq -er '.data.sort_card_id_list | length' "$OUTPUT_FILE")"
    TOTAL_COUNT="$(jq -er '.data.count' "$OUTPUT_FILE")"

    (( PAGE_COUNT > 0 ))
    OFFSET=$((OFFSET + PAGE_COUNT))

    printf 'Downloaded %d/%d cards\n' "$OFFSET" "$TOTAL_COUNT"
done
