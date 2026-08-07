#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
INPUT_DIR="$SCRIPT_DIR/json"
OUTPUT_FILE="$SCRIPT_DIR/../cards.json"

jq -s 'map(.data.card_details) | add' "$INPUT_DIR"/*.json > "$OUTPUT_FILE"
