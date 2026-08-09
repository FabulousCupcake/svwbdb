import CARD_DATA_URL from "../data/cards.json?url";
import KEYWORD_DATA_URL from "../data/keywords.json?url";
import TRAIT_DATA_URL from "../data/traits.json?url";
import ALIAS_DATA_URL from "../data/aliases.json?url";
import ROTATION_FORMAT_ICON_URL from "./assets/format_rotation.svg?url";
import UNLIMITED_FORMAT_ICON_URL from "./assets/format_unlimited.svg?url";
import "./styles.css";

const IMAGE_ROOT = "https://shadowverse-wb.com/uploads/card_image/eng/card";
const CLASS_ICON_ROOT = "https://shadowverse-wb.com/assets/images/common/common/class";
const CLASS_ICON_NAMES = {
  0: "neutral",
  1: "elf",
  2: "royal",
  3: "witch",
  4: "dragon",
  5: "nightmare",
  6: "bishop",
  7: "nemesis",
};
const HEADING_ICON_URLS = [
  ...Object.values(CLASS_ICON_NAMES).map(
    (classIconName) => `${CLASS_ICON_ROOT}/class_${classIconName}.svg`,
  ),
  ROTATION_FORMAT_ICON_URL,
  UNLIMITED_FORMAT_ICON_URL,
];
const MIN_CARD_WIDTH = 200;
const CARD_ASPECT_RATIO = 687 / 530;
const MULTI_DETAIL_VIEW = window.matchMedia("(min-height: 1180px)");
const QUERY_EXAMPLE_TEMPLATES = [
  "[class] >7 rotation",
  "legendary neutral [class]",
  "royal d:gilded spell",
  "rune token spell",
  "sword enhance spell",
  "hp>3 [class]",
  "[name]",
  "rune 10pp",
  "[class] storm rotation",
  "eudie",
  "mama",
  "dao rotation",
];
const QUERY_EXAMPLE_CLASSES = ["forest", "sword", "rune", "dragon", "abyss", "haven", "portal"];
const MIN_QUERY_EXAMPLE_DELAY = 1500;
const MAX_QUERY_EXAMPLE_DELAY = 3000;
const QUERY_EXAMPLE_MILLISECONDS_PER_CHARACTER = 120;

const CLASS_INFO = {
  0: { label: "Neutral", color: "#b9c5cc" },
  1: { label: "Forestcraft", color: "#7bd35f" },
  2: { label: "Swordcraft", color: "#e3b356" },
  3: { label: "Runecraft", color: "#70a8ff" },
  4: { label: "Dragoncraft", color: "#e87848" },
  5: { label: "Abysscraft", color: "#c66ce3" },
  6: { label: "Havencraft", color: "#f1dc7a" },
  7: { label: "Portalcraft", color: "#61d5d0" },
};

const CLASS_QUALIFIER_COLORS = {
  0: "#858585",
  1: "#439159",
  2: "#797b1b",
  3: "#535fa3",
  4: "#a05a12",
  5: "#8d1e41",
  6: "#b0a98d",
  7: "#5bcce3",
};

const TYPE_INFO = {
  1: "Follower",
  2: "Amulet",
  3: "Amulet",
  4: "Spell",
};

const RARITY_INFO = {
  1: "Bronze",
  2: "Silver",
  3: "Gold",
  4: "Legendary",
};

const RARITY_QUALIFIER_COLORS = {
  1: "#b87333",
  2: "#c0c0c0",
  3: "#e3b356",
  4: "#c66ce3",
};

const SPECIFIC_EFFECT_INFO = {
  1: { label: "Crest", showsCost: false },
  2: { label: "Crystallize", showsCost: true },
  3: { label: "Accelerate", showsCost: true },
  4: { label: "Faith", showsCost: false },
};

const SET_INFO = {
  10000: "Basic",
  10001: "Legends Rise",
  10002: "Infinity Evolved",
  10003: "Heirs of the Omen",
  10004: "Skybound Dragons",
  10005: "Blossoming Fate",
  10006: "Apocalypse Pact",
  10007: "Anathema's Gambit",
  10008: "Chronicle of Destiny",
  90000: "Token",
};

const FILTER_ALIASES = new Map();
const MECHANIC_INFO = new Map();
const TRAIT_INFO = new Map();
const NUMERIC_CARD_FIELDS = {
  cost: "cost",
  atk: "atk",
  hp: "life",
};
const QUALIFIER_FIELDS = {
  ability: "description",
  atk: "atk",
  c: "class",
  class: "class",
  co: "cost",
  cost: "cost",
  d: "description",
  description: "description",
  f: "format",
  fl: "flavor",
  flavor: "flavor",
  flavour: "flavor",
  format: "format",
  hp: "hp",
  k: "mechanic",
  key: "mechanic",
  keyword: "mechanic",
  n: "name",
  name: "name",
  r: "rarity",
  rarity: "rarity",
  s: "set",
  set: "set",
  t: "type",
  tr: "trait",
  trait: "trait",
  type: "type",
};
const QUALIFIER_LEGEND = [
  [
    { label: "class", alias: "c" },
    { label: "type", alias: "t" },
    { label: "rarity", alias: "r" },
    { label: "format", alias: "f" },
    { label: "set", alias: "s" },
  ],
  [
    { label: "cost", alias: "co", numeric: true },
    { label: "atk", numeric: true },
    { label: "hp", numeric: true },
  ],
  [
    { label: "keyword", alias: "k" },
    { label: "trait", alias: "tr", secondary: true },
  ],
  [
    { label: "name", alias: "n", secondary: true },
    { label: "description", alias: "d", secondary: true },
    { label: "flavor", alias: "fl", secondary: true },
  ],
];
const QUALIFIER_PATTERN_SOURCE = Object.keys(QUALIFIER_FIELDS)
  .sort((left, right) => right.length - left.length)
  .map(escapeRegExp)
  .join("|");
const NUMERIC_QUALIFIER_PATTERN_SOURCE = Object.entries(QUALIFIER_FIELDS)
  .filter(([, field]) => field in NUMERIC_CARD_FIELDS)
  .map(([qualifier]) => qualifier)
  .sort((left, right) => right.length - left.length)
  .map(escapeRegExp)
  .join("|");

addAliases("class", 0, ["neutral"]);
addAliases("class", 1, ["forest", "forestcraft", "elf"]);
addAliases("class", 2, ["sword", "swordcraft", "royal"]);
addAliases("class", 3, ["rune", "runecraft", "witch"]);
addAliases("class", 4, ["dragon", "dragoncraft"]);
addAliases("class", 5, ["abyss", "abysscraft", "nightmare"]);
addAliases("class", 6, ["haven", "havencraft", "bishop"]);
addAliases("class", 7, ["portal", "portalcraft", "nemesis"]);

addAliases("type", 1, ["follower", "followers"]);
addAliases("type", "amulet", ["amulet", "amulets"]);
addAliases("type", 4, ["spell", "spells"]);
addAliases("type", "token", ["token", "tokens"]);

addAliases("rarity", 1, ["bronze"]);
addAliases("rarity", 2, ["silver"]);
addAliases("rarity", 3, ["gold"]);
addAliases("rarity", 4, ["legendary", "legend"]);

addAliases("format", "rotation", ["rotation"]);
addAliases("format", "all", ["unlimited", "boundless", "infinity"]);
addAliases("format", "starter", ["starter", "simplified"]);

for (const [setId, label] of Object.entries(SET_INFO)) {
  if (Number(setId) !== 90000) {
    addAliases("set", Number(setId), [setQualifierToken(label)]);
  }
}

const ELEMENTS = {
  searchForm: document.querySelector("#search-form"),
  searchInput: document.querySelector("#card-search"),
  recognitionOverlay: document.querySelector("#recognition-overlay"),
  searchAugmentation: document.querySelector("#search-augmentation"),
  augmentationPrefix: document.querySelector("#augmentation-prefix"),
  inlineSuggestion: document.querySelector("#inline-suggestion"),
  completionSuffix: document.querySelector("#completion-suffix"),
  completionBadge: document.querySelector("#completion-badge"),
  qualifierAutocomplete: document.querySelector("#qualifier-autocomplete"),
  qualifierAutocompletePrefix: document.querySelector("#qualifier-autocomplete-prefix"),
  qualifierAutocompleteList: document.querySelector("#qualifier-autocomplete-list"),
  searchAssistStatus: document.querySelector("#search-assist-status"),
  clearSearch: document.querySelector("#clear-search"),
  queryFeedback: document.querySelector("#query-feedback"),
  filterAnnotations: document.querySelector("#filter-annotations"),
  resultStatus: document.querySelector("#result-status"),
  workspace: document.querySelector("#workspace"),
  resultsPanel: document.querySelector("#results-panel"),
  resultGrid: document.querySelector("#result-grid"),
  resultOverflowStatus: document.querySelector("#result-overflow-status"),
  loadingState: document.querySelector("#loading-state"),
  emptyState: document.querySelector("#empty-state"),
  multiDetailPanel: document.querySelector("#multi-detail-panel"),
  detailPanel: document.querySelector("#detail-panel"),
  detailImageFrame: document.querySelector("#detail-image-frame"),
  detailBaseImage: document.querySelector("#detail-base-image"),
  detailEvolvedImage: document.querySelector("#detail-evolved-image"),
  detailName: document.querySelector("#detail-name"),
  detailHeadingIcons: document.querySelector("#detail-heading-icons"),
  detailTags: document.querySelector("#detail-tags"),
  detailSkill: document.querySelector("#detail-skill"),
  detailFlavour: document.querySelector("#detail-flavour"),
  detailCredits: document.querySelector("#detail-credits"),
  detailRelated: document.querySelector("#detail-related"),
  detailRelatedCards: document.querySelector("#detail-related-cards"),
};

const STATE = {
  cards: [],
  matches: [],
  cardNodes: new Map(),
  latestSetId: null,
  suggestions: [],
  optionRequest: null,
  qualifierOptions: [],
  qualifierOptionIndex: 0,
  selectedId: null,
  selectionSource: null,
  followerNameExamples: [],
  searchAliases: new Map(),
};
let queryExampleQueue = [];
let previousQueryExampleTemplate = null;

for (const iconUrl of HEADING_ICON_URLS) {
  const icon = new Image();
  icon.loading = "eager";
  icon.decoding = "async";
  icon.fetchPriority = "high";
  icon.src = iconUrl;
}

ELEMENTS.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  selectFirstResult();
});

ELEMENTS.searchInput.addEventListener("input", runSearch);
ELEMENTS.searchInput.addEventListener("scroll", syncAugmentationScroll);
ELEMENTS.searchInput.addEventListener("keydown", (event) => {
  if (["ArrowDown", "ArrowUp"].includes(event.key) && STATE.qualifierOptions.length) {
    event.preventDefault();
    moveQualifierOptionSelection(event.key === "ArrowDown" ? 1 : -1);
    return;
  }

  if (["Tab", "Enter"].includes(event.key) && STATE.qualifierOptions.length) {
    event.preventDefault();
    applyQualifierOption(STATE.qualifierOptions[STATE.qualifierOptionIndex]);
    return;
  }

  if (["Tab", "Enter"].includes(event.key) && STATE.suggestions.length) {
    event.preventDefault();
    applySuggestion(STATE.suggestions[0]);
  }
});
ELEMENTS.clearSearch.addEventListener("click", clearSearch);
ELEMENTS.inlineSuggestion.addEventListener("click", () => applySuggestion(STATE.suggestions[0]));

ELEMENTS.qualifierAutocompleteList.addEventListener("click", (event) => {
  const optionButton = event.target.closest("[data-qualifier-option]");

  if (optionButton) {
    applyQualifierOption(STATE.qualifierOptions[Number(optionButton.dataset.qualifierOption)]);
  }
});

ELEMENTS.multiDetailPanel.addEventListener("click", (event) => {
  const cardButton = event.target.closest("[data-multi-card-id], [data-related-card-id]");

  if (cardButton) {
    selectCard(Number(cardButton.dataset.multiCardId ?? cardButton.dataset.relatedCardId), "click");
  }
});

ELEMENTS.detailPanel.addEventListener("click", (event) => {
  const cardButton = event.target.closest("[data-related-card-id]");

  if (cardButton) {
    selectCard(Number(cardButton.dataset.relatedCardId), "click");
  }
});

ELEMENTS.resultGrid.addEventListener("click", (event) => {
  const cardButton = event.target.closest("[data-card-id]");

  if (!cardButton) {
    return;
  }

  selectCard(Number(cardButton.dataset.cardId), "click");
});

document.addEventListener("click", (event) => {
  const cardButton = event.target.closest(
    "[data-card-id], [data-multi-card-id], [data-related-card-id]",
  );

  if (
    STATE.selectedId !== null &&
    !ELEMENTS.detailPanel.contains(event.target) &&
    !cardButton
  ) {
    clearSelection(false);
  }
});

document.addEventListener("keydown", (event) => {
  const searchIsFocused = document.activeElement === ELEMENTS.searchInput;
  const commandSearch = event.key.toLocaleLowerCase() === "k" && (event.metaKey || event.ctrlKey);

  if ((!searchIsFocused && event.key === "/") || commandSearch) {
    event.preventDefault();
    ELEMENTS.searchInput.focus();
    ELEMENTS.searchInput.setSelectionRange(
      ELEMENTS.searchInput.value.length,
      ELEMENTS.searchInput.value.length,
    );
    return;
  }

  if (
    !searchIsFocused &&
    event.key.length === 1 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey
  ) {
    event.preventDefault();
    ELEMENTS.searchInput.focus();
    ELEMENTS.searchInput.setSelectionRange(
      ELEMENTS.searchInput.value.length,
      ELEMENTS.searchInput.value.length,
    );
    ELEMENTS.searchInput.setRangeText(
      event.key,
      ELEMENTS.searchInput.selectionStart,
      ELEMENTS.searchInput.selectionEnd,
      "end",
    );
    runSearch();
    return;
  }

  if (event.key === "Escape") {
    if (STATE.selectedId !== null) {
      clearSelection();
    } else if (ELEMENTS.searchInput.value) {
      clearSearch();
    }
  }
});

window.addEventListener("resize", () => {
  if (STATE.cards.length) {
    render();
  }
});

renderQueryReadout("", []);
initialize();

async function initialize() {
  try {
    const [cardResponse, keywordResponse, traitResponse, aliasResponse] = await Promise.all([
      fetch(CARD_DATA_URL),
      fetch(KEYWORD_DATA_URL),
      fetch(TRAIT_DATA_URL),
      fetch(ALIAS_DATA_URL),
    ]);
    const [cardsById, keywordNames, traitNames, searchAliases] = await Promise.all([
      cardResponse.json(),
      keywordResponse.json(),
      traitResponse.json(),
      aliasResponse.json(),
    ]);

    registerReferenceData(keywordNames, traitNames);
    STATE.searchAliases = new Map(
      Object.entries(searchAliases).map(([alias, replacement]) => [
        normalize(alias),
        normalize(replacement),
      ]),
    );

    STATE.cards = Object.values(cardsById)
      .map(prepareCard)
      .sort(compareCards)
      .map((card, index) => ({ ...card, sortIndex: index }));
    STATE.followerNameExamples = collectFollowerNameExamples();

    STATE.latestSetId = Math.max(
      ...STATE.cards
        .filter((card) => !card.common.is_token && card.common.card_set_id !== 90000)
        .map((card) => card.common.card_set_id),
    );

    for (const card of STATE.cards) {
      STATE.cardNodes.set(card.id, createCardNode(card));
    }

    ELEMENTS.loadingState.hidden = true;
    ELEMENTS.resultsPanel.setAttribute("aria-busy", "false");
    rotateQueryExample();
    runSearch();
  } catch (error) {
    ELEMENTS.loadingState.innerHTML = "<strong>Card data could not be loaded.</strong>";
    ELEMENTS.resultStatus.textContent = "Card data unavailable";
    console.error(error);
  }
}

function rotateQueryExample() {
  if (!queryExampleQueue.length) {
    queryExampleQueue = shuffleQueryExamples();
  }

  const template = queryExampleQueue.pop();
  const example = resolveQueryExample(template);
  const delay = Math.min(
    MAX_QUERY_EXAMPLE_DELAY,
    Math.max(
      MIN_QUERY_EXAMPLE_DELAY,
      example.length * QUERY_EXAMPLE_MILLISECONDS_PER_CHARACTER,
    ),
  );

  previousQueryExampleTemplate = template;
  ELEMENTS.searchInput.placeholder = example;
  window.setTimeout(rotateQueryExample, delay);
}

function shuffleQueryExamples() {
  const examples = [...QUERY_EXAMPLE_TEMPLATES];

  for (let index = examples.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [examples[index], examples[randomIndex]] = [examples[randomIndex], examples[index]];
  }

  const nextExampleIndex = examples.length - 1;

  if (
    examples.length > 1 &&
    previousQueryExampleTemplate !== null &&
    examples[nextExampleIndex] === previousQueryExampleTemplate
  ) {
    [examples[0], examples[nextExampleIndex]] = [examples[nextExampleIndex], examples[0]];
  }

  return examples;
}

function resolveQueryExample(template) {
  return template
    .replaceAll("[class]", () => randomItem(QUERY_EXAMPLE_CLASSES))
    .replaceAll("[name]", () => randomItem(STATE.followerNameExamples) ?? "shymm");
}

function collectFollowerNameExamples() {
  return [
    ...new Set(
      STATE.cards
        .filter((card) => card.common.type === 1)
        .map((card) => card.common.name.match(/[\p{L}\p{N}][\p{L}\p{N}'’_-]*/u)?.[0])
        .filter(Boolean)
        .map((word) => word.toLocaleLowerCase())
        .filter((word) => !FILTER_ALIASES.has(normalize(word))),
    ),
  ];
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function addAliases(field, value, aliases) {
  for (const alias of aliases) {
    FILTER_ALIASES.set(normalize(alias), { field, value });
  }
}

function registerReferenceData(keywordNames, traitNames) {
  for (const [rawValue, label] of Object.entries(keywordNames)) {
    if (!label) {
      continue;
    }

    const value = Number(rawValue);
    MECHANIC_INFO.set(value, label);

    for (const alias of new Set([normalize(label), mechanicQualifierToken(label)])) {
      FILTER_ALIASES.set(alias, { field: "mechanic", value });
    }
  }

  for (const [rawValue, label] of Object.entries(traitNames)) {
    if (!label || label === "-") {
      continue;
    }

    const value = Number(rawValue);
    TRAIT_INFO.set(value, label);

    for (const alias of new Set([normalize(label), traitQualifierToken(label)])) {
      if (!FILTER_ALIASES.has(alias)) {
        FILTER_ALIASES.set(alias, { field: "trait", value });
      }
    }
  }
}

function prepareCard(card) {
  const common = card.common;
  const classInfo = CLASS_INFO[common.class] ?? CLASS_INFO[0];
  const typeLabel = TYPE_INFO[common.type] ?? "Card";
  const rarityLabel = RARITY_INFO[common.rarity] ?? "Unknown";
  const setLabel = SET_INFO[common.card_set_id] ?? `Set ${common.card_set_id}`;
  const skillText = combinedSkillText(card);

  return {
    id: common.card_id,
    raw: card,
    common,
    classInfo,
    typeLabel,
    rarityLabel,
    setLabel,
    skillText,
    mechanics: extractMechanics(skillText, card.evo?.skill_text),
    normalizedDescription: normalize(
      [cleanGameText(skillText), cleanGameText(card.evo?.skill_text)].filter(Boolean).join(" "),
    ),
    normalizedFlavor: normalize(
      [cleanGameText(common.flavour_text), cleanGameText(card.evo?.flavour_text)].filter(Boolean).join(" "),
    ),
    normalizedName: normalize(common.name),
  };
}

function combinedSkillText(card) {
  const specificEffects = (card.specific_effects ?? []).map(formatSpecificEffect);
  return [...specificEffects, card.common.skill_text].filter(Boolean).join("\n<hr>");
}

function formatSpecificEffect(effect) {
  const info = SPECIFIC_EFFECT_INFO[effect.specific_effect_type] ?? {
    label: "Additional Effect",
    showsCost: false,
  };
  const cost = info.showsCost ? ` (${effect.cost})` : "";
  return `<b><color=Keyword>${info.label}</color>${cost}</b>:\n${effect.skill_text}`;
}

function extractMechanics(...skillTexts) {
  const mechanics = new Set();

  for (const skillText of skillTexts) {
    const text = String(skillText || "");

    for (const match of text.matchAll(/<color=Keyword>([^<]+)<\/color>/giu)) {
      const precedingText = text.slice(0, match.index);
      const insideItalicName = precedingText.lastIndexOf("<i>") > precedingText.lastIndexOf("</i>");
      const label = match[1].trim();
      const value = resolveMechanic(label);

      if (!insideItalicName && value !== null) {
        mechanics.add(value);
      }
    }
  }

  return mechanics;
}

function compareCards(left, right) {
  if (left.common.is_token !== right.common.is_token) {
    return Number(left.common.is_token) - Number(right.common.is_token);
  }

  if (left.common.card_set_id !== right.common.card_set_id) {
    return right.common.card_set_id - left.common.card_set_id;
  }

  if (left.common.rarity !== right.common.rarity) {
    return right.common.rarity - left.common.rarity;
  }

  if (left.common.class !== right.common.class) {
    return left.common.class - right.common.class;
  }

  if (left.common.cost !== right.common.cost) {
    return left.common.cost - right.common.cost;
  }

  return left.id - right.id;
}

function createCardNode(card) {
  const button = document.createElement("button");
  const [baseImage] = createArtworkImages(card, true, false);

  button.className = "card-tile";
  button.type = "button";
  button.dataset.cardId = String(card.id);
  button.title = card.common.name;
  button.setAttribute("aria-label", `${card.common.name}, ${card.typeLabel}, cost ${card.common.cost}`);
  button.setAttribute("aria-pressed", "false");
  button.style.setProperty("--card-accent", card.classInfo.color);

  baseImage.addEventListener("error", () => {
    button.classList.add("has-image-error");
  });

  button.append(baseImage);
  return button;
}

function evolvedSide(card) {
  const evolved = card.raw.evo;
  return evolved && Object.keys(evolved).length > 0 && evolved.card_image_hash ? evolved : null;
}

function createArtworkImages(card, deferred = false, includeEvolved = true) {
  const baseImage = document.createElement("img");
  const evolved = includeEvolved ? evolvedSide(card) : null;
  const evolvedImage = evolved ? document.createElement("img") : null;
  const setSource = (image, source) => {
    if (deferred) {
      image.dataset.src = source;
    } else {
      image.src = source;
    }
  };

  baseImage.className = "card-art-image card-art-image--base";
  baseImage.alt = card.common.name;
  baseImage.width = 530;
  baseImage.height = 687;
  baseImage.loading = deferred ? "lazy" : "eager";
  baseImage.decoding = "async";
  setSource(baseImage, imageUrl(card.common.card_image_hash));

  if (evolvedImage) {
    evolvedImage.className = "card-art-image card-art-image--evolved";
    evolvedImage.alt = "";
    evolvedImage.width = 530;
    evolvedImage.height = 687;
    evolvedImage.loading = "eager";
    evolvedImage.decoding = "async";
    evolvedImage.setAttribute("aria-hidden", "true");
    setSource(evolvedImage, imageUrl(evolved.card_image_hash));
  }

  return [baseImage, evolvedImage];
}

function runSearch() {
  const query = ELEMENTS.searchInput.value;
  const parsedQuery = parseQuery(query);
  const showLatestExpansion = query.trim().length === 0;

  STATE.suggestions = findFilterSuggestions(query);
  STATE.optionRequest = parsedQuery.optionRequest;
  STATE.qualifierOptions = parsedQuery.optionRequest?.options ?? [];
  STATE.qualifierOptionIndex = 0;

  STATE.matches = STATE.cards
    .filter(
      (card) =>
        (!showLatestExpansion || card.common.card_set_id === STATE.latestSetId) &&
        matchesQuery(card, parsedQuery),
    )
    .map((card) => ({
      card,
      score: scoreCard(card, [...parsedQuery.terms, ...parsedQuery.nameTerms]),
    }))
    .sort((left, right) => {
      if (!showLatestExpansion) {
        const costDifference = left.card.common.cost - right.card.common.cost;

        if (costDifference) {
          return costDifference;
        }
      }

      return right.score - left.score || left.card.sortIndex - right.card.sortIndex;
    })
    .map(({ card }) => card);

  if (STATE.optionRequest) {
    STATE.selectedId = null;
    STATE.selectionSource = null;
  } else if (STATE.selectedId !== null && !STATE.matches.some((card) => card.id === STATE.selectedId)) {
    STATE.selectedId = null;
    STATE.selectionSource = null;
  }

  if (!STATE.optionRequest && STATE.matches.length === 1) {
    STATE.selectedId = STATE.matches[0].id;
    STATE.selectionSource = "auto";
  } else if (!STATE.optionRequest && STATE.selectionSource === "auto") {
    STATE.selectedId = null;
    STATE.selectionSource = null;
  }

  ELEMENTS.clearSearch.hidden = query.length === 0;
  renderSearchAugmentation(parsedQuery, query);
  render();
}

function findFilterSuggestions(query) {
  const tokenMatch = query.match(/(?:^|[\s,;/|])([\p{L}\p{N}_-]+)$/u);

  if (!tokenMatch) {
    return [];
  }

  const rawToken = tokenMatch[1];
  const prefix = normalize(rawToken);

  if (prefix.length < 2 || FILTER_ALIASES.has(prefix)) {
    return [];
  }

  const suggestionsByFilter = new Map();

  for (const [alias, filter] of FILTER_ALIASES) {
    if (!alias.startsWith(prefix)) {
      continue;
    }

    const key = `${filter.field}:${filter.value}`;
    const existing = suggestionsByFilter.get(key);

    if (!existing || alias.length < existing.alias.length) {
      suggestionsByFilter.set(key, {
        ...filter,
        alias,
        start: query.length - rawToken.length,
      });
    }
  }

  return [...suggestionsByFilter.values()]
    .sort((left, right) => left.alias.length - right.alias.length || left.alias.localeCompare(right.alias))
    .slice(0, 3);
}

function applySuggestion(suggestion) {
  if (!suggestion) {
    return;
  }

  const beforeSuggestion = ELEMENTS.searchInput.value.slice(0, suggestion.start);
  ELEMENTS.searchInput.value = `${beforeSuggestion}${suggestion.alias} `;
  runSearch();
  ELEMENTS.searchInput.focus();
  ELEMENTS.searchInput.setSelectionRange(
    ELEMENTS.searchInput.value.length,
    ELEMENTS.searchInput.value.length,
  );
}

function applyQualifierOption(option) {
  const request = STATE.optionRequest;

  if (!request || !option) {
    return;
  }

  const query = ELEMENTS.searchInput.value;
  const replacement = `${request.qualifier}:${option.insertValue} `;
  ELEMENTS.searchInput.value = `${query.slice(0, request.start)}${replacement}${query.slice(request.end).trimStart()}`;
  runSearch();
  ELEMENTS.searchInput.focus();
  ELEMENTS.searchInput.setSelectionRange(
    ELEMENTS.searchInput.value.length,
    ELEMENTS.searchInput.value.length,
  );
}

function moveQualifierOptionSelection(direction) {
  const optionCount = STATE.qualifierOptions.length;

  if (!optionCount) {
    return;
  }

  STATE.qualifierOptionIndex =
    (STATE.qualifierOptionIndex + direction + optionCount) % optionCount;
  renderQualifierAutocomplete(ELEMENTS.searchInput.value);
  document
    .querySelector(`[data-qualifier-option="${STATE.qualifierOptionIndex}"]`)
    ?.scrollIntoView({ block: "nearest" });
}

function renderSearchAugmentation(parsedQuery, query) {
  const suggestion = STATE.suggestions[0] ?? null;
  const structuredCriteria = describeCriteria(parsedQuery).filter((criterion) => !criterion.isKeyword);
  const annotations = collectQueryAnnotations(query);

  renderRecognitionOverlay(query, annotations);
  renderQueryReadout(query, annotations);
  renderQualifierAutocomplete(query);
  ELEMENTS.augmentationPrefix.textContent = query;
  ELEMENTS.inlineSuggestion.hidden = !suggestion;
  ELEMENTS.completionSuffix.className = "completion-suffix";
  ELEMENTS.completionSuffix.style.removeProperty("--recognition-color");
  ELEMENTS.completionBadge.className = "completion-badge";
  ELEMENTS.completionBadge.style.removeProperty("--recognition-color");

  if (suggestion) {
    const typedLength = query.length - suggestion.start;
    const field = filterFieldLabel(suggestion.field);
    const value = filterValueLabel(suggestion.field, suggestion.value);

    ELEMENTS.completionSuffix.textContent = suggestion.alias.slice(typedLength);
    ELEMENTS.completionSuffix.classList.add(`completion-suffix--${suggestion.field}`);
    applyAnnotationColor(ELEMENTS.completionSuffix, suggestion);
    ELEMENTS.completionBadge.textContent = `${field} · ${value}`;
    ELEMENTS.completionBadge.classList.add(`completion-badge--${suggestion.field}`);
    applyAnnotationColor(ELEMENTS.completionBadge, suggestion);
    ELEMENTS.inlineSuggestion.setAttribute(
      "aria-label",
      `Complete as ${value}, ${field.toLocaleLowerCase()} filter`,
    );
    ELEMENTS.searchAssistStatus.textContent = `Autocomplete available: ${field} ${value}. Press Tab or Enter.`;
  } else if (structuredCriteria.length) {
    ELEMENTS.searchAssistStatus.textContent = `Filtering by ${structuredCriteria
      .map((criterion) => `${criterion.field} ${criterion.value}`)
      .join(", ")}.`;
  } else {
    ELEMENTS.searchAssistStatus.textContent = query.trim() ? "Searching card text." : "";
  }

  syncAugmentationScroll();
}

function syncAugmentationScroll() {
  const transform = `translateX(-${ELEMENTS.searchInput.scrollLeft}px)`;
  ELEMENTS.searchAugmentation.style.transform = transform;
  ELEMENTS.recognitionOverlay.style.transform = transform;
  ELEMENTS.qualifierAutocomplete.style.transform = transform;
}

function renderQualifierAutocomplete(query) {
  const request = STATE.optionRequest;

  ELEMENTS.qualifierAutocomplete.hidden = request === null;

  if (!request) {
    ELEMENTS.qualifierAutocompletePrefix.textContent = "";
    ELEMENTS.qualifierAutocompleteList.replaceChildren();
    ELEMENTS.searchInput.removeAttribute("aria-activedescendant");
    return;
  }

  ELEMENTS.qualifierAutocompletePrefix.textContent = query.slice(0, request.end);
  const fragment = document.createDocumentFragment();

  STATE.qualifierOptions.forEach((option, index) => {
    const button = document.createElement("button");
    const label = option.label.toLocaleLowerCase();

    button.type = "button";
    button.id = `qualifier-option-${index}`;
    button.dataset.qualifierOption = String(index);
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(index === STATE.qualifierOptionIndex));
    button.setAttribute("aria-label", `Use ${option.label}`);
    button.classList.add(
      "qualifier-autocomplete-option",
      `qualifier-autocomplete-option--${request.field}`,
    );
    applyAnnotationColor(button, { field: request.field, value: option.value });

    if (index === 0) {
      const typedValue = normalize(request.rawValue).replaceAll("-", " ");
      const optionValue = normalize(option.label).replaceAll("-", " ");

      if (optionValue.startsWith(typedValue)) {
        button.classList.add("qualifier-autocomplete-completion");
        button.textContent = option.insertValue.slice(request.rawValue.length);
      } else {
        button.classList.add("qualifier-autocomplete-fuzzy");
        button.textContent = label;
      }
    } else {
      button.textContent = label;
    }

    if (index === STATE.qualifierOptionIndex) {
      button.classList.add("is-active");
    }

    fragment.append(button);
  });

  if (!STATE.qualifierOptions.length) {
    const empty = document.createElement("span");
    empty.className = "qualifier-autocomplete-empty";
    empty.textContent = "no match";
    fragment.append(empty);
  }

  ELEMENTS.qualifierAutocompleteList.replaceChildren(fragment);
  if (!STATE.qualifierOptions.length) {
    ELEMENTS.searchInput.removeAttribute("aria-activedescendant");
  } else {
    ELEMENTS.searchInput.setAttribute(
      "aria-activedescendant",
      `qualifier-option-${STATE.qualifierOptionIndex}`,
    );
  }
}

function collectQueryAnnotations(query) {
  const annotations = [];
  const addAnnotation = (start, end, field, value, valueLabel = null) => {
    if (annotations.some((annotation) => start < annotation.end && end > annotation.start)) {
      return;
    }

    annotations.push({
      start,
      end,
      field,
      value,
      fieldLabel: filterFieldLabel(field),
      valueLabel: valueLabel ?? filterValueLabel(field, value),
    });
  };

  for (const expression of findQualifierExpressions(query)) {
    const { field, value, rawValue } = expression;
    let resolvedValue = value;
    let displayValue = rawValue || "type a value";

    if (["class", "type", "rarity", "format", "set", "mechanic", "trait"].includes(field)) {
      resolvedValue = resolveQualifiedFilter(field, value);

      if (resolvedValue !== null) {
        displayValue = filterValueLabel(field, resolvedValue);
      } else if (!value) {
        displayValue = field === "mechanic" ? "all keywords" : "choose a value";
      }
    } else if (field in NUMERIC_CARD_FIELDS && !value) {
      displayValue = "choose a value";
    }

    addAnnotation(
      expression.start,
      expression.end,
      field,
      resolvedValue ?? value,
      displayValue,
    );
  }

  const filterPhrases = [...FILTER_ALIASES]
    .filter(
      ([alias, filter]) =>
        ["mechanic", "trait"].includes(filter.field) && alias.includes(" "),
    )
    .sort((left, right) => right[0].length - left[0].length);

  for (const [alias, filter] of filterPhrases) {
    const escapedAlias = alias.split(" ").map(escapeRegExp).join("\\s+");
    const pattern = new RegExp(`(^|[\\s,;/|])(${escapedAlias})(?=$|[\\s,;/|])`, "giu");

    for (const match of query.matchAll(pattern)) {
      const start = match.index + match[1].length;
      addAnnotation(start, start + match[2].length, filter.field, filter.value);
    }
  }

  const costPatterns = [
    /cost\s*(?:\d+\s*(?:-|–|—|~|to)\s*\d+|(?:<=|>=|<|>)\s*\d+|\d+\s*\+?)/giu,
    /cost\s*(?:under|below|less than|over|above|more than)\s*\d+/giu,
    /\d+\s*(?:cost|pp)/giu,
  ];

  for (const pattern of costPatterns) {
    for (const match of query.matchAll(pattern)) {
      const value = normalize(match[0]).replace(/^cost\s*/u, "").replace(/\s*(?:cost|pp)$/u, "");
      addAnnotation(match.index, match.index + match[0].length, "cost", value);
    }
  }

  for (const match of query.matchAll(
    /(^|[\s,;/|])((?:<=|>=|!=|=|<|>)\s*\d+)(?=$|[\s,;/|])/gu,
  )) {
    const start = match.index + match[1].length;
    addAnnotation(start, start + match[2].length, "cost", normalize(match[2]));
  }

  for (const match of query.matchAll(/[\p{L}\p{N}_-]+/gu)) {
    const token = normalize(match[0]);
    const alias = FILTER_ALIASES.get(token);
    const searchAlias = STATE.searchAliases.get(token);

    if (searchAlias) {
      addAnnotation(match.index, match.index + match[0].length, "name", searchAlias);
    } else if (alias) {
      addAnnotation(match.index, match.index + match[0].length, alias.field, alias.value);
    } else if (/^\d{1,2}$/u.test(token) && Number(token) <= 18) {
      addAnnotation(match.index, match.index + match[0].length, "cost", token);
    } else {
      addAnnotation(match.index, match.index + match[0].length, "name", match[0]);
    }
  }

  return annotations.sort((left, right) => left.start - right.start);
}

function renderRecognitionOverlay(query, annotations) {
  const fragment = document.createDocumentFragment();
  let cursor = 0;

  for (const annotation of annotations) {
    if (annotation.start > cursor) {
      fragment.append(createRecognitionSpan(query.slice(cursor, annotation.start)));
    }

    const recognizedSpan = createRecognitionSpan(query.slice(annotation.start, annotation.end));
    recognizedSpan.classList.add("recognized-token", `recognized-token--${annotation.field}`);
    applyAnnotationColor(recognizedSpan, annotation);
    fragment.append(recognizedSpan);
    cursor = annotation.end;
  }

  if (cursor < query.length) {
    fragment.append(createRecognitionSpan(query.slice(cursor)));
  }

  ELEMENTS.recognitionOverlay.replaceChildren(fragment);
}

function createRecognitionSpan(text) {
  const span = document.createElement("span");
  span.textContent = text;
  return span;
}

function renderQueryReadout(query, annotations) {
  const annotationFragment = document.createDocumentFragment();
  const legend = document.createElement("span");

  legend.className = "query-qualifier-legend";

  for (const qualifiers of QUALIFIER_LEGEND) {
    const row = document.createElement("span");

    row.className = "query-qualifier-row";
    if (qualifiers.every((qualifier) => qualifier.secondary)) {
      row.classList.add("query-qualifier-row--secondary");
    }
    if (qualifiers.every((qualifier) => qualifier.numeric)) {
      row.classList.add("query-qualifier-row--numeric");
    }

    for (const qualifier of qualifiers) {
      const hint = document.createElement("span");

      hint.className = "query-hint";

      if (qualifier.alias) {
        const alias = document.createElement("strong");
        const aliasIndex = qualifier.label.indexOf(qualifier.alias);

        hint.title = `${qualifier.alias}:`;
        alias.className = "query-hint-alias";
        alias.textContent = qualifier.alias;
        hint.append(
          document.createTextNode(qualifier.label.slice(0, aliasIndex)),
          alias,
          document.createTextNode(`${qualifier.label.slice(aliasIndex + qualifier.alias.length)}:`),
        );
      } else {
        hint.textContent = `${qualifier.label}:`;
      }

      row.append(hint);
    }

    legend.append(row);
  }
  let annotationCount = 0;

  if (query.trim()) {
    const seen = new Set();

    for (const annotation of annotations) {
      const key = `${annotation.field}:${normalize(annotation.valueLabel)}`;

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      const row = document.createElement("span");
      const field = document.createElement("span");
      const value = document.createElement("strong");

      row.className = `filter-annotation filter-annotation--${annotation.field}`;
      applyAnnotationColor(row, annotation);
      field.textContent = `${annotation.fieldLabel.toLocaleLowerCase()}:`;
      value.textContent = annotation.valueLabel.toLocaleLowerCase();
      row.append(field, value);
      annotationFragment.append(row);
      annotationCount += 1;
    }
  }

  ELEMENTS.queryFeedback.replaceChildren(legend);
  ELEMENTS.filterAnnotations.replaceChildren(annotationFragment);
  ELEMENTS.filterAnnotations.hidden = annotationCount === 0;
}

function applyAnnotationColor(element, annotation) {
  const valueColors = {
    class: CLASS_QUALIFIER_COLORS,
    rarity: RARITY_QUALIFIER_COLORS,
  };
  const color = valueColors[annotation.field]?.[annotation.value];

  if (color) {
    element.style.setProperty("--recognition-color", color);
  }
}

function describeCriteria(query) {
  const criteria = [];
  const addValues = (field, values) => {
    for (const value of values) {
      criteria.push({
        field: filterFieldLabel(field),
        value: filterValueLabel(field, value),
        isKeyword: false,
      });
    }
  };

  addValues("class", query.classes);
  addValues("type", query.types);
  addValues("rarity", query.rarities);
  addValues("format", query.formats);
  addValues("set", query.sets);
  addValues("mechanic", query.mechanics);
  addValues("trait", query.traits);

  for (const field of Object.keys(NUMERIC_CARD_FIELDS)) {
    const filter = query.numericFilters[field];

    if (filter.minimum !== null || filter.maximum !== null) {
      let value = "";

      if (filter.minimum !== null && filter.maximum !== null) {
        value = `${filter.minimum}–${filter.maximum}`;
      } else if (filter.minimum !== null) {
        value = `≥ ${filter.minimum}`;
      } else {
        value = `≤ ${filter.maximum}`;
      }

      criteria.push({ field: filterFieldLabel(field), value, isKeyword: false });
    }

    for (const exactValue of filter.exact) {
      criteria.push({
        field: filterFieldLabel(field),
        value: String(exactValue),
        isKeyword: false,
      });
    }

    for (const excludedValue of filter.excluded) {
      criteria.push({
        field: filterFieldLabel(field),
        value: `≠ ${excludedValue}`,
        isKeyword: false,
      });
    }
  }

  for (const term of query.terms) {
    criteria.push({ field: "KEYWORD", value: term, isKeyword: true });
  }

  return criteria;
}

function filterFieldLabel(field) {
  return {
    class: "CLASS",
    type: "TYPE",
    rarity: "RARITY",
    format: "FORMAT",
    set: "SET",
    mechanic: "KEYWORD",
    trait: "TRAIT",
    name: "NAME",
    cost: "COST",
    atk: "ATK",
    hp: "HP",
    flavor: "FLAVOR",
    description: "DESCRIPTION",
  }[field] ?? field.toUpperCase();
}

function filterValueLabel(field, value) {
  if (field === "class") return CLASS_INFO[value]?.label ?? String(value);
  if (field === "type") {
    if (value === "amulet") return "Amulet";
    if (value === "token") return "Token";
    return TYPE_INFO[value] ?? String(value);
  }
  if (field === "rarity") return RARITY_INFO[value] ?? String(value);
  if (field === "format") {
    return { rotation: "Rotation", all: "Unlimited", starter: "Starter" }[value] ?? String(value);
  }
  if (field === "set") return SET_INFO[value] ?? String(value);
  if (field === "mechanic") return MECHANIC_INFO.get(value) ?? String(value);
  if (field === "trait") return TRAIT_INFO.get(value) ?? String(value);
  if (["name", "cost", "atk", "hp"].includes(field)) return String(value);
  if (["flavor", "description"].includes(field)) return String(value);
  return String(value);
}

function findQualifierExpressions(query) {
  const qualifiedPattern = new RegExp(
    `\\b(${QUALIFIER_PATTERN_SOURCE}):(?:"([^"]*)"|([^\\s,;/|]*))`,
    "giu",
  );
  const expressions = [...query.matchAll(qualifiedPattern)].map((match) => ({
    start: match.index,
    end: match.index + match[0].length,
    qualifier: normalize(match[1]),
    field: QUALIFIER_FIELDS[normalize(match[1])],
    rawValue: match[2] ?? match[3] ?? "",
    value: normalize(match[2] ?? match[3] ?? ""),
  }));
  const directNumericPattern = new RegExp(
    `\\b(${NUMERIC_QUALIFIER_PATTERN_SOURCE})\\s*(<=|>=|!=|=|<|>)\\s*(\\d+)`,
    "giu",
  );

  for (const match of query.matchAll(directNumericPattern)) {
    expressions.push({
      start: match.index,
      end: match.index + match[0].length,
      qualifier: normalize(match[1]),
      field: QUALIFIER_FIELDS[normalize(match[1])],
      rawValue: `${match[2]}${match[3]}`,
      value: `${match[2]}${match[3]}`,
    });
  }

  return expressions.sort((left, right) => left.start - right.start);
}

function mechanicQualifierToken(value) {
  return normalize(value).replace(/^on\s+/u, "").replaceAll(" ", "-");
}

function setQualifierToken(value) {
  return normalize(value).replaceAll(" ", "-");
}

function traitQualifierToken(value) {
  return normalize(value).replaceAll(" ", "-");
}

function resolveMechanic(value) {
  const comparableValue = mechanicQualifierToken(value);

  for (const [mechanic, label] of MECHANIC_INFO) {
    if (mechanicQualifierToken(label) === comparableValue) {
      return mechanic;
    }
  }

  return null;
}

function resolveTrait(value) {
  const comparableValue = traitQualifierToken(value);

  for (const [trait, label] of TRAIT_INFO) {
    if (traitQualifierToken(label) === comparableValue) {
      return trait;
    }
  }

  return null;
}

function resolveQualifiedFilter(field, value) {
  if (field === "mechanic") {
    return resolveMechanic(value);
  }

  if (field === "trait") {
    return resolveTrait(value);
  }

  const alias = FILTER_ALIASES.get(normalize(value));
  return alias?.field === field ? alias.value : null;
}

function getQualifierOptions(field, prefix = "") {
  const comparablePrefix = normalize(prefix).replaceAll("-", " ");
  let options = [];

  if (field === "class") {
    options = Object.entries(CLASS_INFO).map(([value, info]) => ({
      label: info.label,
      insertValue: normalize(info.label),
      value: Number(value),
    }));
  } else if (field === "type") {
    options = [
      { label: "Follower", insertValue: "follower", value: 1 },
      { label: "Amulet", insertValue: "amulet", value: "amulet" },
      { label: "Spell", insertValue: "spell", value: 4 },
      { label: "Token", insertValue: "token", value: "token" },
    ];
  } else if (field === "rarity") {
    options = Object.entries(RARITY_INFO).map(([value, label]) => ({
      label,
      insertValue: normalize(label),
      value: Number(value),
    }));
  } else if (field === "format") {
    options = [
      { label: "Rotation", insertValue: "rotation", value: "rotation" },
      { label: "Unlimited", insertValue: "unlimited", value: "all" },
      { label: "Starter", insertValue: "starter", value: "starter" },
    ];
  } else if (field === "set") {
    options = Object.entries(SET_INFO)
      .filter(([value]) => Number(value) !== 90000)
      .map(([value, label]) => ({
        label,
        insertValue: setQualifierToken(label),
        value: Number(value),
      }));
  } else if (field === "mechanic") {
    options = [...MECHANIC_INFO].map(([value, label]) => ({
      label: mechanicQualifierToken(label),
      insertValue: mechanicQualifierToken(label),
      value,
    }));
  } else if (field === "trait") {
    options = [...TRAIT_INFO].map(([value, label]) => ({
      label,
      insertValue: traitQualifierToken(label),
      value,
    }));
  } else if (field in NUMERIC_CARD_FIELDS) {
    return null;
  } else {
    return null;
  }

  return options
    .map((option) => ({
      option,
      score: qualifierOptionMatchScore(option.label, comparablePrefix),
    }))
    .filter(({ score }) => score !== null)
    .sort(
      (left, right) =>
        left.score - right.score || left.option.label.localeCompare(right.option.label),
    )
    .map(({ option }) => option);
}

function qualifierOptionMatchScore(label, prefix) {
  if (!prefix) {
    return 0;
  }

  const comparableLabel = normalize(label).replaceAll("-", " ");

  if (comparableLabel.startsWith(prefix)) {
    return 0;
  }

  const wordIndex = comparableLabel.split(/\s+/u).findIndex((word) => word.startsWith(prefix));

  if (wordIndex !== -1) {
    return 100 + wordIndex;
  }

  const substringIndex = comparableLabel.indexOf(prefix);

  if (substringIndex !== -1) {
    return 200 + substringIndex;
  }

  const compactLabel = comparableLabel.replaceAll(" ", "");
  const compactPrefix = prefix.replaceAll(" ", "");
  let searchFrom = 0;
  let firstMatch = -1;
  let lastMatch = -1;

  for (const character of compactPrefix) {
    const matchIndex = compactLabel.indexOf(character, searchFrom);

    if (matchIndex === -1) {
      return null;
    }

    if (firstMatch === -1) {
      firstMatch = matchIndex;
    }

    lastMatch = matchIndex;
    searchFrom = matchIndex + 1;
  }

  return 300 + firstMatch + (lastMatch - firstMatch + 1 - compactPrefix.length);
}

function createNumericFilter() {
  return {
    exact: new Set(),
    excluded: new Set(),
    minimum: null,
    maximum: null,
  };
}

function applyNumericFilterValue(filter, value) {
  let match = value.match(/^(\d+)\s*(?:-|–|—|~|to)\s*(\d+)$/u);

  if (match) {
    const first = Number(match[1]);
    const second = Number(match[2]);
    constrainNumericMinimum(filter, Math.min(first, second));
    constrainNumericMaximum(filter, Math.max(first, second));
    return true;
  }

  match = value.match(/^(<=|>=|!=|=|<|>)(\d+)$/u);

  if (match) {
    const number = Number(match[2]);

    if (match[1] === "<") constrainNumericMaximum(filter, number - 1);
    if (match[1] === "<=") constrainNumericMaximum(filter, number);
    if (match[1] === ">") constrainNumericMinimum(filter, number + 1);
    if (match[1] === ">=") constrainNumericMinimum(filter, number);
    if (match[1] === "!=") filter.excluded.add(number);
    if (match[1] === "=") filter.exact.add(number);
    return true;
  }

  match = value.match(/^(\d+)\+$/u);

  if (match) {
    constrainNumericMinimum(filter, Number(match[1]));
    return true;
  }

  if (/^\d+$/u.test(value)) {
    filter.exact.add(Number(value));
    return true;
  }

  return false;
}

function constrainNumericMinimum(filter, minimum) {
  filter.minimum = filter.minimum === null ? minimum : Math.max(filter.minimum, minimum);
}

function constrainNumericMaximum(filter, maximum) {
  filter.maximum = filter.maximum === null ? maximum : Math.min(filter.maximum, maximum);
}

function parseQuery(query) {
  let working = normalize(query);
  const classes = new Set();
  const types = new Set();
  const rarities = new Set();
  const formats = new Set();
  const sets = new Set();
  const mechanics = new Set();
  const traits = new Set();
  const nameTerms = [];
  const flavorTerms = [];
  const descriptionTerms = [];
  const numericFilters = Object.fromEntries(
    Object.keys(NUMERIC_CARD_FIELDS).map((field) => [field, createNumericFilter()]),
  );
  let optionRequest = null;

  const consume = (pattern, handler) => {
    working = working.replace(pattern, (...matches) => {
      handler(...matches);
      return " ";
    });
  };

  for (const expression of findQualifierExpressions(query)) {
    const { field, value } = expression;

    if (["name", "flavor", "description"].includes(field)) {
      if (value) {
        if (field === "name") nameTerms.push(...resolveSearchAlias(value));
        if (field === "flavor") flavorTerms.push(value);
        if (field === "description") descriptionTerms.push(value);
      }
      continue;
    }

    if (field in NUMERIC_CARD_FIELDS) {
      if (applyNumericFilterValue(numericFilters[field], value)) {
        continue;
      }
    } else {
      const resolvedValue = resolveQualifiedFilter(field, value);

      if (resolvedValue !== null) {
        if (field === "class") classes.add(resolvedValue);
        if (field === "type") types.add(resolvedValue);
        if (field === "rarity") rarities.add(resolvedValue);
        if (field === "format") formats.add(resolvedValue);
        if (field === "set") sets.add(resolvedValue);
        if (field === "mechanic") mechanics.add(resolvedValue);
        if (field === "trait") traits.add(resolvedValue);
        continue;
      }
    }

    const options = getQualifierOptions(field, value);

    if (options !== null) {
      optionRequest = { ...expression, options };
    }
  }

  working = working.replace(
    new RegExp(
      `\\b(?:${QUALIFIER_PATTERN_SOURCE}):(?:"[^"]*"|[^\\s,;/|]*)`,
      "giu",
    ),
    " ",
  );
  working = working.replace(
    new RegExp(
      `\\b(?:${NUMERIC_QUALIFIER_PATTERN_SOURCE})\\s*(?:<=|>=|!=|=|<|>)\\s*\\d+`,
      "giu",
    ),
    " ",
  );

  consume(/cost\s*(\d+)\s*(?:-|–|—|~|to)\s*(\d+)/gu, (_match, first, second) => {
    applyNumericFilterValue(numericFilters.cost, `${first}-${second}`);
  });

  consume(/cost\s*(<=|>=|!=|=|<|>)\s*(\d+)/gu, (_match, operator, value) => {
    applyNumericFilterValue(numericFilters.cost, `${operator}${value}`);
  });

  consume(/cost\s*(?:under|below|less than)\s*(\d+)/gu, (_match, value) => {
    applyNumericFilterValue(numericFilters.cost, `<${value}`);
  });

  consume(/cost\s*(?:over|above|more than)\s*(\d+)/gu, (_match, value) => {
    applyNumericFilterValue(numericFilters.cost, `>${value}`);
  });

  consume(/cost\s*(\d+)\s*\+/gu, (_match, value) => {
    applyNumericFilterValue(numericFilters.cost, `${value}+`);
  });

  consume(/cost\s*(?:=|:)?\s*(\d+)/gu, (_match, value) => {
    applyNumericFilterValue(numericFilters.cost, value);
  });

  consume(/(\d+)\s*(?:cost|pp)/gu, (_match, value) => {
    applyNumericFilterValue(numericFilters.cost, value);
  });

  consume(
    /(^|[\s,;/|])(<=|>=|!=|=|<|>)\s*(\d+)(?=$|[\s,;/|])/gu,
    (_match, _leadingSeparator, operator, value) => {
      applyNumericFilterValue(numericFilters.cost, `${operator}${value}`);
    },
  );

  for (const [alias, filter] of FILTER_ALIASES) {
    if (!["mechanic", "trait"].includes(filter.field) || !alias.includes(" ")) {
      continue;
    }

    const mechanicPattern = new RegExp(
      `(^|[\\s,;/|])${escapeRegExp(alias)}(?=$|[\\s,;/|])`,
      "gu",
    );

    working = working.replace(mechanicPattern, (_match, leadingSeparator) => {
      if (filter.field === "mechanic") mechanics.add(filter.value);
      if (filter.field === "trait") traits.add(filter.value);
      return leadingSeparator;
    });
  }

  const terms = [];
  const tokens = working.split(/[\s,;/|]+/u).filter(Boolean);

  for (const rawToken of tokens) {
    const token = rawToken.replace(/^[^\p{L}\p{N}_-]+|[^\p{L}\p{N}_-]+$/gu, "");
    const alias = FILTER_ALIASES.get(token);
    const searchAlias = STATE.searchAliases.get(token);

    if (searchAlias) {
      nameTerms.push(...searchAlias.split(/\s+/u));
      continue;
    }

    if (alias) {
      if (alias.field === "class") classes.add(alias.value);
      if (alias.field === "type") types.add(alias.value);
      if (alias.field === "rarity") rarities.add(alias.value);
      if (alias.field === "format") formats.add(alias.value);
      if (alias.field === "set") sets.add(alias.value);
      if (alias.field === "mechanic") mechanics.add(alias.value);
      if (alias.field === "trait") traits.add(alias.value);
      continue;
    }

    if (/^\d{1,2}$/u.test(token) && Number(token) <= 18) {
      numericFilters.cost.exact.add(Number(token));
      continue;
    }

    if (token) {
      terms.push(token);
    }
  }

  return {
    classes,
    types,
    rarities,
    formats,
    sets,
    mechanics,
    traits,
    nameTerms,
    flavorTerms,
    descriptionTerms,
    numericFilters,
    optionRequest,
    terms,
  };
}

function resolveSearchAlias(value) {
  return (STATE.searchAliases.get(normalize(value)) ?? value).split(/\s+/u).filter(Boolean);
}

function matchesNumericFilter(value, filter) {
  if (filter.exact.size && !filter.exact.has(value)) {
    return false;
  }

  if (filter.excluded.has(value)) {
    return false;
  }

  if (filter.minimum !== null && value < filter.minimum) {
    return false;
  }

  if (filter.maximum !== null && value > filter.maximum) {
    return false;
  }

  return true;
}

function matchesQuery(card, query) {
  const common = card.common;

  if (query.classes.size && !query.classes.has(common.class)) {
    return false;
  }

  if (query.types.has("token") && !common.is_token) {
    return false;
  }

  const hasSpecificType = query.types.size > Number(query.types.has("token"));

  if (hasSpecificType) {
    const typeMatch = query.types.has(common.type) || (query.types.has("amulet") && [2, 3].includes(common.type));

    if (!typeMatch) {
      return false;
    }
  }

  if (query.rarities.size && !query.rarities.has(common.rarity)) {
    return false;
  }

  for (const [field, commonField] of Object.entries(NUMERIC_CARD_FIELDS)) {
    if (!matchesNumericFilter(common[commonField], query.numericFilters[field])) {
      return false;
    }
  }

  if (query.formats.size && ![...query.formats].some((format) => matchesFormat(common, format))) {
    return false;
  }

  if (query.sets.size && !query.sets.has(common.card_set_id)) {
    return false;
  }

  if (query.mechanics.size && ![...query.mechanics].every((mechanic) => card.mechanics.has(mechanic))) {
    return false;
  }

  if (query.traits.size && ![...query.traits].every((trait) => (common.tribes ?? []).includes(trait))) {
    return false;
  }

  if (![...query.terms, ...query.nameTerms].every((term) => card.normalizedName.includes(term))) {
    return false;
  }

  if (!query.flavorTerms.every((term) => card.normalizedFlavor.includes(term))) {
    return false;
  }

  if (!query.descriptionTerms.every((term) => card.normalizedDescription.includes(term))) {
    return false;
  }

  return true;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function matchesFormat(common, format) {
  if (format === "all") return true;
  if (format === "rotation") return Boolean(common.is_include_rotation);
  if (format === "starter") return Boolean(common.starter_card) || [10000, 10001].includes(common.card_set_id);
  return true;
}

function scoreCard(card, terms) {
  let score = 0;

  for (const term of terms) {
    if (card.normalizedName === term) score += 20;
    else if (card.normalizedName.startsWith(term)) score += 10;
    else score += 5;
  }

  return score;
}

function render() {
  const selectedCard = STATE.cards.find((card) => card.id === STATE.selectedId) ?? null;
  const hasDetail = selectedCard !== null;
  const relatedCards = selectedCard ? getRelatedCards(selectedCard) : [];
  const showsMultipleDetails =
    !hasDetail && STATE.matches.length === 2 && MULTI_DETAIL_VIEW.matches;
  const hidesSoleResultList = hasDetail && STATE.matches.length === 1;

  ELEMENTS.workspace.classList.toggle("has-detail", hasDetail);
  ELEMENTS.workspace.classList.toggle("has-multi-detail", showsMultipleDetails);
  ELEMENTS.resultsPanel.hidden = showsMultipleDetails || hidesSoleResultList;
  ELEMENTS.multiDetailPanel.hidden = !showsMultipleDetails;
  ELEMENTS.detailPanel.hidden = !hasDetail;

  if (showsMultipleDetails) {
    ELEMENTS.resultGrid.replaceChildren();
    ELEMENTS.resultOverflowStatus.hidden = true;
    ELEMENTS.multiDetailPanel.replaceChildren(...STATE.matches.map(createMultiDetailCard));
    ELEMENTS.resultStatus.textContent = "2 cards · showing both details";
    return;
  }

  ELEMENTS.multiDetailPanel.replaceChildren();

  const isFiltering = Boolean(ELEMENTS.searchInput.value.trim());
  let resultLayout = calculateResultLayout();

  if (isFiltering && STATE.matches.length > resultLayout.limit) {
    resultLayout = calculateResultLayout(44);
  }

  const resultLimit = resultLayout.limit;
  const orderedMatches = STATE.matches;
  const visibleCards = orderedMatches.slice(0, resultLimit);
  const showsTruncatedFilterCount =
    isFiltering &&
    visibleCards.length > 0 &&
    visibleCards.length < orderedMatches.length;
  const fragment = document.createDocumentFragment();
  const hasPartialFirstRow = visibleCards.length > 0 && visibleCards.length < resultLayout.columns;
  const renderedColumns = hasPartialFirstRow ? visibleCards.length : resultLayout.columns;

  ELEMENTS.resultGrid.style.setProperty("--result-columns", String(Math.max(1, renderedColumns)));
  ELEMENTS.resultGrid.style.width = hasPartialFirstRow
    ? `${resultLayout.cardWidth * visibleCards.length}px`
    : "100%";

  ELEMENTS.emptyState.hidden = STATE.matches.length !== 0;
  ELEMENTS.resultGrid.hidden = STATE.matches.length === 0;
  ELEMENTS.resultOverflowStatus.hidden = !showsTruncatedFilterCount;
  ELEMENTS.resultOverflowStatus.textContent = showsTruncatedFilterCount
    ? `${visibleCards.length} / ${orderedMatches.length} cards`
    : "";

  for (const card of visibleCards) {
    const cardNode = STATE.cardNodes.get(card.id);
    const isSelected = card.id === STATE.selectedId;

    for (const cardImage of cardNode.querySelectorAll("img[data-src]")) {
      if (!cardImage.hasAttribute("src")) {
        cardImage.src = cardImage.dataset.src;
      }
    }

    cardNode.classList.toggle("is-selected", isSelected);
    cardNode.setAttribute("aria-pressed", String(isSelected));
    fragment.append(cardNode);
  }

  ELEMENTS.resultGrid.replaceChildren(fragment);

  if (!ELEMENTS.searchInput.value.trim() && STATE.matches.length) {
    const latestSetLabel = SET_INFO[STATE.latestSetId] ?? `Set ${STATE.latestSetId}`;
    ELEMENTS.resultStatus.textContent = `Showing ${visibleCards.length} of ${STATE.matches.length} · ${latestSetLabel}`;
  } else if (STATE.matches.length === 0) {
    ELEMENTS.resultStatus.textContent = "0 cards";
  } else if (STATE.matches.length > resultLimit) {
    ELEMENTS.resultStatus.textContent = `Showing ${visibleCards.length} of ${STATE.matches.length} cards`;
  } else {
    ELEMENTS.resultStatus.textContent = `${STATE.matches.length} ${STATE.matches.length === 1 ? "card" : "cards"}`;
  }

  if (hasDetail) {
    renderSelectedCard(selectedCard, relatedCards);
  }
}

function calculateResultLayout(reservedHeight = 0) {
  const panelStyle = getComputedStyle(ELEMENTS.resultsPanel);
  const horizontalPadding = parseFloat(panelStyle.paddingLeft) + parseFloat(panelStyle.paddingRight);
  const panelWidth = Math.max(
    ELEMENTS.resultsPanel.clientWidth - horizontalPadding,
    MIN_CARD_WIDTH,
  );
  const panelHeight = Math.max(ELEMENTS.resultsPanel.clientHeight - reservedHeight, 1);
  const columns = Math.max(1, Math.floor(panelWidth / MIN_CARD_WIDTH));
  const cardWidth = panelWidth / columns;
  const cardHeight = cardWidth * CARD_ASPECT_RATIO;
  const rows = Math.max(1, Math.floor(panelHeight / cardHeight));

  return {
    limit: columns * rows,
    columns,
    cardWidth,
  };
}

function createMultiDetailCard(card) {
  const article = document.createElement("article");
  const visualButton = document.createElement("button");
  const imageFrame = document.createElement("div");
  const [baseImage, evolvedImage] = createArtworkImages(card);
  const copy = document.createElement("div");
  const content = document.createElement("div");
  const heading = document.createElement("div");
  const headingText = document.createElement("div");
  const headingIcons = document.createElement("div");
  const name = document.createElement("h2");
  const tags = document.createElement("div");
  const ability = createMultiDetailSection(card.skillText, false, true);
  const flavour = createMultiDetailSection(card.common.flavour_text, true);
  const credits = document.createElement("dl");

  article.className = "detail-panel multi-detail-card";
  article.style.setProperty("--class-accent", card.classInfo.color);

  visualButton.className = "detail-visual multi-detail-visual";
  visualButton.type = "button";
  visualButton.dataset.multiCardId = String(card.id);
  visualButton.setAttribute("aria-label", `Focus ${card.common.name}`);

  imageFrame.className = "detail-image-frame";
  imageFrame.classList.toggle("has-evolved-art", evolvedImage !== null);
  imageFrame.append(baseImage, ...(evolvedImage ? [evolvedImage] : []));
  visualButton.append(imageFrame);

  copy.className = "detail-copy";
  content.className = "detail-copy-content";
  heading.className = "detail-heading";
  headingIcons.className = "detail-heading-icons";
  headingIcons.classList.toggle("has-no-format", Boolean(card.common.is_token));
  name.textContent = card.common.name;
  headingText.append(name);
  headingIcons.append(...createDetailHeadingIcons(card));
  heading.append(headingText, headingIcons);

  tags.className = "detail-tags";
  tags.append(
    createTag(card.typeLabel),
    ...(card.common.is_token ? [createTag("Token")] : []),
  );

  credits.className = "detail-credits";
  credits.append(...createCredits(card));
  content.append(tags, ability, flavour, credits);
  copy.append(heading, content, createRelatedCardList(getRelatedCards(card)));
  article.append(visualButton, copy);
  return article;
}

function createMultiDetailSection(valueText, isFlavour = false, highlightsKeywords = false) {
  const section = document.createElement("section");
  const value = document.createElement("p");

  section.className = `detail-section ${isFlavour ? "detail-section--flavour" : "detail-section--ability"}`;
  value.className = `detail-text${isFlavour ? " detail-text--flavour" : ""}`;

  if (highlightsKeywords) {
    renderHighlightedGameText(value, valueText, "No ability text.");
  } else {
    value.textContent = cleanGameText(valueText) || "No flavour text.";
  }

  section.append(value);
  return section;
}

function renderSelectedCard(card, relatedCards) {
  const evolved = evolvedSide(card);
  const flavourText = cleanGameText(card.common.flavour_text) || "No flavour text.";

  ELEMENTS.detailPanel.style.setProperty("--class-accent", card.classInfo.color);
  const baseImageUrl = imageUrl(card.common.card_image_hash);

  if (ELEMENTS.detailBaseImage.getAttribute("src") !== baseImageUrl) {
    ELEMENTS.detailBaseImage.src = baseImageUrl;
  }
  ELEMENTS.detailBaseImage.alt = card.common.name;
  ELEMENTS.detailImageFrame.classList.toggle("has-evolved-art", evolved !== null);

  if (evolved) {
    const evolvedImageUrl = imageUrl(evolved.card_image_hash);

    if (ELEMENTS.detailEvolvedImage.getAttribute("src") !== evolvedImageUrl) {
      ELEMENTS.detailEvolvedImage.src = evolvedImageUrl;
    }
  } else {
    ELEMENTS.detailEvolvedImage.removeAttribute("src");
  }

  ELEMENTS.detailName.textContent = card.common.name;
  ELEMENTS.detailHeadingIcons.classList.toggle(
    "has-no-format",
    Boolean(card.common.is_token),
  );
  ELEMENTS.detailHeadingIcons.replaceChildren(...createDetailHeadingIcons(card));
  renderHighlightedGameText(ELEMENTS.detailSkill, card.skillText, "No ability text.");
  ELEMENTS.detailFlavour.textContent = flavourText;

  ELEMENTS.detailTags.replaceChildren(
    createTag(card.typeLabel),
    ...(card.common.tribes ?? [])
      .map((trait) => TRAIT_INFO.get(trait))
      .filter(Boolean)
      .map(createTag),
    ...(card.common.is_token ? [createTag("Token")] : []),
  );

  ELEMENTS.detailCredits.replaceChildren(...createCredits(card));
  renderRelatedCards(ELEMENTS.detailRelatedCards, relatedCards);
  ELEMENTS.detailRelated.hidden = relatedCards.length === 0;
}

function createTag(label) {
  const tag = document.createElement("span");
  tag.textContent = label;
  return tag;
}

function createCredit(labelText, valueText) {
  const label = document.createElement("dt");
  const value = document.createElement("dd");
  label.textContent = labelText;
  value.textContent = valueText;
  return [label, value];
}

function createVoiceCredit(card) {
  const [japaneseLabel, japaneseValue] = createCredit("CV", card.common.cv_jp || "—");
  const [englishLabel, englishValue] = createCredit("CV (EN)", card.common.cv || "—");

  japaneseValue.lang = "ja";
  englishValue.lang = "en";

  return [japaneseLabel, japaneseValue, englishLabel, englishValue];
}

function createDetailHeadingIcons(card) {
  const classIcon = document.createElement("img");
  const classIconName = CLASS_ICON_NAMES[card.common.class] ?? CLASS_ICON_NAMES[0];

  classIcon.className = `detail-heading-icon detail-heading-icon--class detail-heading-icon--class-${card.common.class}`;
  classIcon.src = `${CLASS_ICON_ROOT}/class_${classIconName}.svg`;
  classIcon.alt = card.classInfo.label;
  classIcon.title = card.classInfo.label;
  classIcon.loading = "eager";
  classIcon.decoding = "async";
  classIcon.fetchPriority = "high";

  if (card.common.is_token) {
    return [classIcon];
  }

  const formatIcon = document.createElement("img");
  const formatLabel = card.common.is_include_rotation ? "Rotation" : "Unlimited";

  formatIcon.className = "detail-heading-icon detail-heading-icon--format";
  formatIcon.src = card.common.is_include_rotation
    ? ROTATION_FORMAT_ICON_URL
    : UNLIMITED_FORMAT_ICON_URL;
  formatIcon.alt = formatLabel;
  formatIcon.title = formatLabel;
  formatIcon.loading = "eager";
  formatIcon.decoding = "async";
  formatIcon.fetchPriority = "high";

  return [classIcon, formatIcon];
}

function createCredits(card) {
  const mainCredits = document.createElement("div");
  const cardIdentity = document.createElement("div");

  mainCredits.className = "detail-credit-column";
  cardIdentity.className = "detail-credit-column detail-credit-column--identity";
  mainCredits.append(
    ...createCredit("SET", card.setLabel),
    ...createCredit("ILLUSTRATOR", card.common.illustrator || "—"),
    ...createVoiceCredit(card),
  );
  cardIdentity.append(...createCredit("CARD ID", card.id));

  return [mainCredits, cardIdentity];
}

function getRelatedCards(card) {
  const seen = new Set([card.id]);

  return (card.raw.related_card_ids ?? [])
    .map((cardId) => STATE.cards.find((candidate) => candidate.id === cardId))
    .filter((relatedCard) => {
      if (!relatedCard || seen.has(relatedCard.id)) {
        return false;
      }

      seen.add(relatedCard.id);
      return true;
    })
    .sort(
      (left, right) =>
        left.common.cost - right.common.cost || left.sortIndex - right.sortIndex,
    );
}

function createRelatedCardList(cards) {
  const wrapper = document.createElement("div");
  const heading = document.createElement("p");
  const list = document.createElement("div");

  wrapper.className = "detail-related";
  wrapper.hidden = cards.length === 0;
  heading.className = "detail-related-heading";
  heading.textContent = "RELATED CARDS";
  list.className = "detail-related-cards";
  list.setAttribute("aria-label", "Related cards");
  renderRelatedCards(list, cards);
  wrapper.append(heading, list);
  return wrapper;
}

function renderRelatedCards(list, cards) {
  const cardNodes = cards.map((card) => {
    const button = document.createElement("button");
    const [image] = createArtworkImages(card, false, false);

    button.className = "detail-related-card";
    button.type = "button";
    button.dataset.relatedCardId = String(card.id);
    button.title = card.common.name;
    button.setAttribute("aria-label", `View related card ${card.common.name}`);
    button.style.setProperty("--card-accent", card.classInfo.color);
    button.append(image);
    return button;
  });

  list.replaceChildren(...cardNodes);
}

function selectCard(cardId, source) {
  if (STATE.selectedId === cardId && source === "click") {
    clearSelection();
    return;
  }

  STATE.selectedId = cardId;
  STATE.selectionSource = source;
  render();
}

function selectFirstResult() {
  if (ELEMENTS.searchInput.value.trim() && STATE.matches.length) {
    selectCard(STATE.matches[0].id, "click");
  }
}

function clearSelection(focusSearch = true) {
  STATE.selectedId = null;
  STATE.selectionSource = null;
  render();

  if (focusSearch) {
    ELEMENTS.searchInput.focus();
  }
}

function clearSearch() {
  ELEMENTS.searchInput.value = "";
  runSearch();
  ELEMENTS.searchInput.focus();
}

function renderHighlightedGameText(element, value, fallback) {
  const text = cleanGameText(value) || fallback;
  const terms = [...MECHANIC_INFO.values()]
    .map((label) => String(label).replace(/^on\s+/iu, ""))
    .filter((label) => label.length > 1 && normalize(label) !== "follower")
    .sort((left, right) => right.length - left.length)
    .map(escapeRegExp);

  if (!terms.length) {
    element.textContent = text;
    return;
  }

  const pattern = new RegExp(
    `(?<![\\p{L}\\p{N}])(?:${terms.join("|")})(?![\\p{L}\\p{N}])`,
    "giu",
  );
  const fragment = document.createDocumentFragment();
  let cursor = 0;

  for (const match of text.matchAll(pattern)) {
    fragment.append(document.createTextNode(text.slice(cursor, match.index)));

    const keyword = document.createElement("mark");
    keyword.className = "detail-keyword";
    keyword.textContent = match[0];
    fragment.append(keyword);
    cursor = match.index + match[0].length;
  }

  fragment.append(document.createTextNode(text.slice(cursor)));
  element.replaceChildren(fragment);
}

function cleanGameText(value = "") {
  return value
    .replace(/<br\s*\/?\s*>/giu, "\n")
    .replace(/<[^>]*>/gu, "")
    .replace(/_/gu, " ")
    .replace(/[ \t]+\n/gu, "\n")
    .replace(/\n{3,}/gu, "\n\n")
    .trim();
}

function normalize(value = "") {
  return String(value)
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/\s+/gu, " ")
    .trim();
}

function imageUrl(hash) {
  return `${IMAGE_ROOT}/${hash}.png`;
}
