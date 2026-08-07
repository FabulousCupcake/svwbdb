#!/usr/bin/env bash

set -euo pipefail

BASE_URL="https://shadowverse-wb.com/web/CardList/cardList"
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="${1:-$SCRIPT_DIR/json}"
OUTPUT_FILE="$OUTPUT_DIR/card-list-0000.json"
INCLUDE_TOKEN=1
LANGUAGE="en"
OFFSET=0

mkdir -p "$OUTPUT_DIR"

printf 'Downloading trait data to %s\n' "${OUTPUT_FILE##*/}"

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

printf 'Downloaded trait data\n'
