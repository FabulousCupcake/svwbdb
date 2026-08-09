# Qualifier color system

This document is the visual contract for recognized search terms. Keep the
recognition overlay inside the search input and the filter annotation below it
on the same color for a given term.

Do not casually reuse these colors for unrelated UI. Their purpose is to make
the search parser's interpretation immediately distinguishable while typing.

## Class colors

A resolved `class` qualifier uses the color belonging to its value. These hex
values are the exact fills used by the monochrome class emblems shipped by the
official Shadowverse: Worlds Beyond card library.

| Class | Internal value | Color | Official emblem |
| --- | ---: | --- | --- |
| Neutral | `0` | `#858585` | [`class_neutral.svg`](https://shadowverse-wb.com/assets/images/common/common/class/class_neutral.svg) |
| Forestcraft | `1` | `#439159` | [`class_elf.svg`](https://shadowverse-wb.com/assets/images/common/common/class/class_elf.svg) |
| Swordcraft | `2` | `#797B1B` | [`class_royal.svg`](https://shadowverse-wb.com/assets/images/common/common/class/class_royal.svg) |
| Runecraft | `3` | `#535FA3` | [`class_witch.svg`](https://shadowverse-wb.com/assets/images/common/common/class/class_witch.svg) |
| Dragoncraft | `4` | `#A05A12` | [`class_dragon.svg`](https://shadowverse-wb.com/assets/images/common/common/class/class_dragon.svg) |
| Abysscraft | `5` | `#8D1E41` | [`class_nightmare.svg`](https://shadowverse-wb.com/assets/images/common/common/class/class_nightmare.svg) |
| Havencraft | `6` | `#B0A98D` | [`class_bishop.svg`](https://shadowverse-wb.com/assets/images/common/common/class/class_bishop.svg) |
| Portalcraft | `7` | `#5BCCE3` | [`class_nemesis.svg`](https://shadowverse-wb.com/assets/images/common/common/class/class_nemesis.svg) |

The official site uses legacy internal asset names (`elf`, `royal`, `witch`,
`nightmare`, `bishop`, and `nemesis`) for the current English class names. Its
[Deck Creation guide](https://shadowverse-wb.com/en/system/cardbattle/deck/)
confirms the eight user-facing class names and their order.

An incomplete or invalid class expression has no resolved class value. It uses
the generic class fallback, `#7BD35F`, until the parser recognizes a valid
class.

## Rarity colors

A resolved `rarity` qualifier uses a separate color for each rarity value.

| Rarity | Internal value | Color | Intended appearance |
| --- | ---: | --- | --- |
| Bronze | `1` | `#B87333` | Bronze |
| Silver | `2` | `#C0C0C0` | Silver |
| Gold | `3` | `#E3B356` | Gold |
| Legendary | `4` | `#C66CE3` | Purple |

An incomplete or invalid rarity expression uses the generic rarity fallback,
`#C66CE3`, until the parser recognizes a valid rarity.

## Other qualifier colors

These colors preserve the current interface. They are intentionally documented
here so future visual changes do not accidentally collapse distinct qualifier
dimensions into the same treatment.

| Qualifier | Color | Intended appearance |
| --- | --- | --- |
| `type` | `#E1BC73` | Warm sand |
| `format` | `#70A8FF` | Blue |
| `set` | `#E3B356` | Gold |
| `cost`, `atk`, `hp` | `#E87848` | Orange |
| `keyword` | `#5AD6D1` | Cyan |
| `trait` | `#A9C76F` | Muted green |
| `name` | `#87939E` | Cool gray |
| `flavor` | `#D09B73` | Tan |
| `description` | `#9C8EE8` | Lavender |

`keyword` is named `mechanic` internally. The internal name is an implementation
detail and must not change its visible color or user-facing qualifier name.

## Maintenance rules

- Recognized class and rarity values must obtain their colors from
  `CLASS_QUALIFIER_COLORS` and `RARITY_QUALIFIER_COLORS` in `src/main.js`.
- All other qualifier colors are defined by `--recognition-color` rules in
  `src/styles.css`.
- The in-input recognition mark, annotation readout, autocomplete completion
  text, qualifier pill, and dropdown entry text must always receive the same
  resolved color.
- If official class emblems change, verify all eight official SVG sources
  before updating the mapping and this document together.
