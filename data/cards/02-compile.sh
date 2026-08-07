#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
INPUT_DIR="$SCRIPT_DIR/json"
OUTPUT_FILE="$SCRIPT_DIR/../cards.json"

jq -s '
    map(
        .data as $DATA
        | ($DATA.specific_effect_card_info | if type == "object" then . else {} end) as $EFFECTS
        | $DATA.card_details
        | with_entries(
            .key as $CARD_ID
            | ($DATA.cards[$CARD_ID].specific_effect_card_ids // []) as $EFFECT_IDS
            | .value.related_card_ids = ($DATA.cards[$CARD_ID].related_card_ids // [])
            | .value.specific_effect_card_ids = $EFFECT_IDS
            | .value.specific_effects = [
                $EFFECT_IDS[] as $EFFECT_ID
                | ($EFFECTS[($EFFECT_ID | tostring)] // empty)
                | { specific_effect_card_id: $EFFECT_ID } + .
            ]
        )
    )
    | add
' "$INPUT_DIR"/*.json > "$OUTPUT_FILE"
