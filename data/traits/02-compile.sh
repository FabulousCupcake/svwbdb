#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
INPUT_FILE="$SCRIPT_DIR/json/card-list-0000.json"
OUTPUT_FILE="$SCRIPT_DIR/../traits.json"

jq '.data.tribe_names' "$INPUT_FILE" > "$OUTPUT_FILE"
