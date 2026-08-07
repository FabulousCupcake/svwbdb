import CARD_DATA_URL from "../data/cards.json?url";
import "./styles.css";

const IMAGE_ROOT = "https://shadowverse-wb.com/uploads/card_image/eng/card";
const RESULT_LIMIT = 21;
const DETAIL_RESULT_LIMIT = 6;

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

addAliases("rarity", 1, ["bronze"]);
addAliases("rarity", 2, ["silver"]);
addAliases("rarity", 3, ["gold"]);
addAliases("rarity", 4, ["legendary", "legend"]);

addAliases("format", "rotation", ["rotation"]);
addAliases("format", "all", ["unlimited", "boundless", "infinity"]);
addAliases("format", "starter", ["starter", "simplified"]);

addAliases("token", true, ["token", "tokens"]);
addAliases("token", false, ["nontoken", "non-token", "non_token"]);

const ELEMENTS = {
  dataState: document.querySelector("#data-state"),
  searchForm: document.querySelector("#search-form"),
  searchInput: document.querySelector("#card-search"),
  clearSearch: document.querySelector("#clear-search"),
  resultStatus: document.querySelector("#result-status"),
  workspace: document.querySelector("#workspace"),
  resultsPanel: document.querySelector("#results-panel"),
  resultGrid: document.querySelector("#result-grid"),
  loadingState: document.querySelector("#loading-state"),
  emptyState: document.querySelector("#empty-state"),
  detailPanel: document.querySelector("#detail-panel"),
  detailImage: document.querySelector("#detail-image"),
  artSwitch: document.querySelector("#art-switch"),
  detailOverline: document.querySelector("#detail-overline"),
  detailName: document.querySelector("#detail-name"),
  detailTags: document.querySelector("#detail-tags"),
  statRow: document.querySelector("#stat-row"),
  detailSkill: document.querySelector("#detail-skill"),
  detailFlavour: document.querySelector("#detail-flavour"),
  detailCredits: document.querySelector("#detail-credits"),
  detailClose: document.querySelector("#detail-close"),
};

const STATE = {
  cards: [],
  matches: [],
  cardNodes: new Map(),
  latestSetId: null,
  selectedId: null,
  selectionSource: null,
  evolved: false,
};

ELEMENTS.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  selectFirstResult();
});

ELEMENTS.searchInput.addEventListener("input", runSearch);
ELEMENTS.clearSearch.addEventListener("click", clearSearch);
ELEMENTS.detailClose.addEventListener("click", clearSelection);

ELEMENTS.resultGrid.addEventListener("click", (event) => {
  const cardButton = event.target.closest("[data-card-id]");

  if (!cardButton) {
    return;
  }

  selectCard(Number(cardButton.dataset.cardId), "click");
});

ELEMENTS.artSwitch.addEventListener("click", (event) => {
  const button = event.target.closest("[data-art-mode]");

  if (!button) {
    return;
  }

  STATE.evolved = button.dataset.artMode === "evolved";
  renderSelectedCard();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== ELEMENTS.searchInput) {
    event.preventDefault();
    ELEMENTS.searchInput.focus();
  }

  if (event.key === "Escape") {
    if (STATE.selectedId !== null) {
      clearSelection();
    } else if (ELEMENTS.searchInput.value) {
      clearSearch();
    }
  }
});

initialize();

async function initialize() {
  try {
    const response = await fetch(CARD_DATA_URL);
    const cardsById = await response.json();

    STATE.cards = Object.values(cardsById)
      .map(prepareCard)
      .sort(compareCards)
      .map((card, index) => ({ ...card, sortIndex: index }));

    STATE.latestSetId = Math.max(
      ...STATE.cards
        .filter((card) => !card.common.is_token && card.common.card_set_id !== 90000)
        .map((card) => card.common.card_set_id),
    );

    for (const card of STATE.cards) {
      STATE.cardNodes.set(card.id, createCardNode(card));
    }

    ELEMENTS.loadingState.hidden = true;
    ELEMENTS.dataState.textContent = `${STATE.cards.length} cards loaded locally`;
    ELEMENTS.resultsPanel.setAttribute("aria-busy", "false");
    runSearch();
  } catch (error) {
    ELEMENTS.loadingState.innerHTML = "<strong>Card data could not be loaded.</strong>";
    ELEMENTS.dataState.textContent = "Local data unavailable";
    console.error(error);
  }
}

function addAliases(field, value, aliases) {
  for (const alias of aliases) {
    FILTER_ALIASES.set(normalize(alias), { field, value });
  }
}

function prepareCard(card) {
  const common = card.common;
  const classInfo = CLASS_INFO[common.class] ?? CLASS_INFO[0];
  const typeLabel = TYPE_INFO[common.type] ?? "Card";
  const rarityLabel = RARITY_INFO[common.rarity] ?? "Unknown";
  const setLabel = SET_INFO[common.card_set_id] ?? `Set ${common.card_set_id}`;
  const cleanSkill = cleanGameText(common.skill_text);
  const cleanFlavour = cleanGameText(common.flavour_text);
  const searchableText = normalize(
    [
      common.card_id,
      common.name,
      common.name_ruby,
      cleanSkill,
      cleanFlavour,
      common.illustrator,
      common.cv,
      classInfo.label,
      typeLabel,
      rarityLabel,
      setLabel,
    ].join(" "),
  );

  return {
    id: common.card_id,
    raw: card,
    common,
    classInfo,
    typeLabel,
    rarityLabel,
    setLabel,
    cleanSkill,
    cleanFlavour,
    searchableText,
    normalizedName: normalize(common.name),
  };
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
  const image = document.createElement("img");

  button.className = "card-tile";
  button.type = "button";
  button.dataset.cardId = String(card.id);
  button.title = card.common.name;
  button.setAttribute("aria-label", `${card.common.name}, ${card.typeLabel}, cost ${card.common.cost}`);
  button.setAttribute("aria-pressed", "false");
  button.style.setProperty("--card-accent", card.classInfo.color);

  image.dataset.src = imageUrl(card.common.card_image_hash);
  image.alt = card.common.name;
  image.width = 530;
  image.height = 687;
  image.loading = "lazy";
  image.decoding = "async";

  image.addEventListener("error", () => {
    button.classList.add("has-image-error");
  });

  button.append(image);
  return button;
}

function runSearch() {
  const query = ELEMENTS.searchInput.value;
  const parsedQuery = parseQuery(query);
  const showLatestExpansion = query.trim().length === 0;

  STATE.matches = STATE.cards
    .filter(
      (card) =>
        (!showLatestExpansion || card.common.card_set_id === STATE.latestSetId) &&
        matchesQuery(card, parsedQuery),
    )
    .map((card) => ({ card, score: scoreCard(card, parsedQuery.terms) }))
    .sort((left, right) => right.score - left.score || left.card.sortIndex - right.card.sortIndex)
    .map(({ card }) => card);

  if (STATE.selectedId !== null && !STATE.matches.some((card) => card.id === STATE.selectedId)) {
    STATE.selectedId = null;
    STATE.selectionSource = null;
    STATE.evolved = false;
  }

  if (STATE.matches.length === 1) {
    if (STATE.selectedId !== STATE.matches[0].id) {
      STATE.evolved = false;
    }

    STATE.selectedId = STATE.matches[0].id;
    STATE.selectionSource = "auto";
  } else if (STATE.selectionSource === "auto") {
    STATE.selectedId = null;
    STATE.selectionSource = null;
    STATE.evolved = false;
  }

  ELEMENTS.clearSearch.hidden = query.length === 0;
  render();
}

function parseQuery(query) {
  let working = normalize(query);
  const classes = new Set();
  const types = new Set();
  const rarities = new Set();
  const formats = new Set();
  const tokenValues = new Set();
  const exactCosts = new Set();
  let minimumCost = null;
  let maximumCost = null;

  const consume = (pattern, handler) => {
    working = working.replace(pattern, (...matches) => {
      handler(...matches);
      return " ";
    });
  };

  consume(/cost\s*(\d+)\s*(?:-|–|—|~|to)\s*(\d+)/gu, (_match, first, second) => {
    minimumCost = Math.min(Number(first), Number(second));
    maximumCost = Math.max(Number(first), Number(second));
  });

  consume(/cost\s*(<=|>=|<|>)\s*(\d+)/gu, (_match, operator, value) => {
    const number = Number(value);

    if (operator === "<") maximumCost = number - 1;
    if (operator === "<=") maximumCost = number;
    if (operator === ">") minimumCost = number + 1;
    if (operator === ">=") minimumCost = number;
  });

  consume(/cost\s*(?:under|below|less than)\s*(\d+)/gu, (_match, value) => {
    maximumCost = Number(value) - 1;
  });

  consume(/cost\s*(?:over|above|more than)\s*(\d+)/gu, (_match, value) => {
    minimumCost = Number(value) + 1;
  });

  consume(/cost\s*(\d+)\s*\+/gu, (_match, value) => {
    minimumCost = Number(value);
  });

  consume(/cost\s*(?:=|:)?\s*(\d+)/gu, (_match, value) => {
    exactCosts.add(Number(value));
  });

  consume(/(\d+)\s*(?:cost|pp)/gu, (_match, value) => {
    exactCosts.add(Number(value));
  });

  const terms = [];
  const tokens = working.split(/[\s,;/|]+/u).filter(Boolean);

  for (const rawToken of tokens) {
    const token = rawToken.replace(/^[^\p{L}\p{N}_-]+|[^\p{L}\p{N}_-]+$/gu, "");
    const alias = FILTER_ALIASES.get(token);

    if (alias) {
      if (alias.field === "class") classes.add(alias.value);
      if (alias.field === "type") types.add(alias.value);
      if (alias.field === "rarity") rarities.add(alias.value);
      if (alias.field === "format") formats.add(alias.value);
      if (alias.field === "token") tokenValues.add(alias.value);
      continue;
    }

    if (/^\d{1,2}$/u.test(token) && Number(token) <= 18) {
      exactCosts.add(Number(token));
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
    tokenValues,
    exactCosts,
    minimumCost,
    maximumCost,
    terms,
  };
}

function matchesQuery(card, query) {
  const common = card.common;

  if (query.classes.size && !query.classes.has(common.class)) {
    return false;
  }

  if (query.types.size) {
    const typeMatch = query.types.has(common.type) || (query.types.has("amulet") && [2, 3].includes(common.type));

    if (!typeMatch) {
      return false;
    }
  }

  if (query.rarities.size && !query.rarities.has(common.rarity)) {
    return false;
  }

  if (query.tokenValues.size && !query.tokenValues.has(Boolean(common.is_token))) {
    return false;
  }

  if (query.exactCosts.size && !query.exactCosts.has(common.cost)) {
    return false;
  }

  if (query.minimumCost !== null && common.cost < query.minimumCost) {
    return false;
  }

  if (query.maximumCost !== null && common.cost > query.maximumCost) {
    return false;
  }

  if (query.formats.size && ![...query.formats].some((format) => matchesFormat(common, format))) {
    return false;
  }

  return query.terms.every((term) => card.searchableText.includes(term));
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
    else if (card.normalizedName.includes(term)) score += 5;
    else if (card.cleanSkill.includes(term)) score += 2;
    else score += 1;
  }

  return score;
}

function render() {
  const selectedCard = STATE.cards.find((card) => card.id === STATE.selectedId) ?? null;
  const hasDetail = selectedCard !== null;
  const isSingleResult = hasDetail && STATE.matches.length === 1;
  const resultLimit = isSingleResult ? 0 : hasDetail ? DETAIL_RESULT_LIMIT : RESULT_LIMIT;
  const orderedMatches = hasDetail
    ? [selectedCard, ...STATE.matches.filter((card) => card.id !== selectedCard.id)]
    : STATE.matches;
  const visibleCards = orderedMatches.slice(0, resultLimit);
  const fragment = document.createDocumentFragment();

  ELEMENTS.workspace.classList.toggle("has-detail", hasDetail);
  ELEMENTS.workspace.classList.toggle("single-result", isSingleResult);
  ELEMENTS.detailPanel.hidden = !hasDetail;
  ELEMENTS.emptyState.hidden = STATE.matches.length !== 0;
  ELEMENTS.resultGrid.hidden = STATE.matches.length === 0;

  for (const card of visibleCards) {
    const cardNode = STATE.cardNodes.get(card.id);
    const cardImage = cardNode.querySelector("img");
    const isSelected = card.id === STATE.selectedId;

    if (!cardImage.hasAttribute("src")) {
      cardImage.src = cardImage.dataset.src;
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
    renderSelectedCard();
  }
}

function renderSelectedCard() {
  const card = STATE.cards.find((candidate) => candidate.id === STATE.selectedId);

  if (!card) {
    return;
  }

  const evolved = card.raw.evo && Object.keys(card.raw.evo).length > 0 ? card.raw.evo : null;
  const displayedSide = STATE.evolved && evolved ? evolved : card.common;
  const skillText = cleanGameText(displayedSide.skill_text) || "No ability text.";
  const flavourText = cleanGameText(displayedSide.flavour_text) || "No flavour text.";

  ELEMENTS.detailPanel.style.setProperty("--class-accent", card.classInfo.color);
  const detailImageUrl = imageUrl(displayedSide.card_image_hash);

  if (ELEMENTS.detailImage.getAttribute("src") !== detailImageUrl) {
    ELEMENTS.detailImage.src = detailImageUrl;
  }
  ELEMENTS.detailImage.alt = `${card.common.name}${STATE.evolved ? " evolved" : ""}`;
  ELEMENTS.detailOverline.textContent = `${card.classInfo.label} / ${card.setLabel}`;
  ELEMENTS.detailName.textContent = card.common.name;
  ELEMENTS.detailSkill.textContent = skillText;
  ELEMENTS.detailFlavour.textContent = flavourText;
  ELEMENTS.artSwitch.hidden = !evolved;

  for (const button of ELEMENTS.artSwitch.querySelectorAll("button")) {
    button.classList.toggle("is-active", button.dataset.artMode === (STATE.evolved ? "evolved" : "base"));
  }

  ELEMENTS.detailTags.replaceChildren(
    createTag(card.typeLabel),
    createTag(card.rarityLabel),
    ...(card.common.is_include_rotation ? [createTag("Rotation")] : []),
    ...(card.common.is_token ? [createTag("Token")] : []),
  );

  const stats = [{ label: "COST", value: card.common.cost }];

  if (card.common.type === 1) {
    stats.push(
      { label: "ATK", value: card.common.atk },
      { label: "DEF", value: card.common.life },
    );
  }

  ELEMENTS.statRow.replaceChildren(...stats.map(createStat));
  ELEMENTS.detailCredits.replaceChildren(
    ...createCredit("CARD ID", card.id),
    ...createCredit("ILLUSTRATOR", card.common.illustrator || "—"),
    ...createCredit("CV", card.common.cv || "—"),
  );
}

function createTag(label) {
  const tag = document.createElement("span");
  tag.textContent = label;
  return tag;
}

function createStat(stat) {
  const item = document.createElement("div");
  const label = document.createElement("span");
  const value = document.createElement("strong");

  label.textContent = stat.label;
  value.textContent = stat.value;
  item.append(label, value);
  return item;
}

function createCredit(labelText, valueText) {
  const label = document.createElement("dt");
  const value = document.createElement("dd");
  label.textContent = labelText;
  value.textContent = valueText;
  return [label, value];
}

function selectCard(cardId, source) {
  if (STATE.selectedId === cardId && source === "click") {
    clearSelection();
    return;
  }

  STATE.selectedId = cardId;
  STATE.selectionSource = source;
  STATE.evolved = false;
  render();
}

function selectFirstResult() {
  if (STATE.matches.length) {
    selectCard(STATE.matches[0].id, "click");
  }
}

function clearSelection() {
  STATE.selectedId = null;
  STATE.selectionSource = null;
  STATE.evolved = false;
  render();
  ELEMENTS.searchInput.focus();
}

function clearSearch() {
  ELEMENTS.searchInput.value = "";
  runSearch();
  ELEMENTS.searchInput.focus();
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
