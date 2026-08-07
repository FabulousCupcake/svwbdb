# Project master plan

## Vision

Build a fast, static Shadowverse: Worlds Beyond card browser inspired by the
[official card list](https://shadowverse-wb.com/en/deck/cardslist/), with a more
responsive and expressive search experience.

The official browser sends a server request for each query. This project will
instead load the complete card dataset when the page opens, retain it in
memory, and perform all searching, filtering, and display updates locally in
the browser.

## Project character

This is a hobby tool, not an enterprise or corporate project. Prefer direct,
understandable code over defensive abstractions and speculative complexity. If
something breaks, it can be investigated and repaired when it happens.

- Keep dependencies and tooling lean.
- Do not add libraries without a concrete need.
- Do not create an automated test suite.
- Prefer native browser features over framework or library replacements.
- Keep operational work hands-off wherever practical.

## Primary goals

- Deliver immediate search and filter updates without query-time server
  requests.
- Load the complete card dataset once during initial page load.
- Keep the site deployable as a static webpage.
- Offer a search experience that is more capable and natural than the official
  browser.
- Show useful countdowns for recurring and upcoming in-game events.
- Automatically incorporate newly released cards without manual maintenance.

## Technical direction

The initial application stack will be:

- Vite for the development server and production build
- Vanilla JavaScript using ES modules
- Plain CSS
- Native DOM and browser APIs

Do not introduce a UI framework, router, state-management library, search
library, or heavy date/time library initially. Vanilla JavaScript should still
be organized into focused modules rather than one monolithic file. Exact module
and component boundaries will be specified later.

TypeScript remains optional rather than a project requirement.

## Card search

The card browser will query the in-memory card list and render matching cards
entirely on the client.

Search must update on every input event. It must not use debouncing or
throttling. The current dataset is small enough to normalize once and scan
synchronously for each input change.

Users should be able to express any combination of these conditions by typing:

- Keyword
- Class
- Format
- Card type
- Rarity
- Cost

Search and filtering will use a custom domain-specific query parser. Generic
search libraries are not expected to fit the desired input model. The parser
should recognize structured conditions as naturally as practical, matching how
a person thinks about the desired cards instead of requiring cumbersome filter
interactions. Its exact grammar and matching rules will be designed later.

## Card rendering

Loading the complete card list means preloading the card JSON, not eagerly
loading every card image.

The initial rendering strategy will favor persistent DOM nodes:

- Create each card element once and retain it by card ID.
- Filter by changing each element's `hidden` state instead of recreating it.
- Move existing elements if result ordering changes.
- Do not replace image elements or repeatedly assign their `src` values.
- Use native `loading="lazy"` and `decoding="async"` on card images.
- Give images explicit dimensions to avoid layout shifts.
- Use `content-visibility: auto` on card containers where appropriate.

This keeps loaded and decoded images alive while allowing the CSS layout to
collapse non-matching cards. Virtualization should only be considered if this
approach is observably slow; it is not part of the initial implementation.

## Card images

Card images will initially be hotlinked from the official site using the image
hash supplied in the card data:

```text
https://shadowverse-wb.com/uploads/card_image/{resource-language}/card/{card_image_hash}.png
```

The official resource-language mapping currently includes `jpn` for Japanese
and `eng` for English. Cross-origin image requests using GitHub Pages- and
Cloudflare Pages-style referrers were successfully served as image data when
checked on 2026-08-07.

The image responses do not currently advertise CORS permission. They can be
displayed with ordinary `<img>` elements, but should not be fetched for
cross-origin pixel access or read through a canvas.

Hotlink availability is an external dependency and may change without notice.
Technical accessibility also does not itself grant permission to use the card
art. A public deployment must comply with the applicable
[Cygames fan-content guidelines](https://shadowverse-wb.com/en/guideline/) and
[terms](https://shadowverse-wb.com/en/terms/).

## Game event countdowns

The static webpage will display live countdowns for:

- Daily reset
- Weekly reset
- Seasonal ranking reset
- New card expansion

Use native `Date`, `Intl`, and timers unless a concrete scheduling requirement
cannot be expressed with them. Do not add Temporal or a heavy date library.

Fixed reset schedules can be calculated locally. A hands-off expansion
countdown will require a reliable source for the next announced expansion date;
that source has not yet been selected.

## Card data and automation

The existing card-data pipeline downloads every page of the official card list
and compiles only the card details into `data/cards.json`. The browser will use
this compiled file as its initial in-memory dataset.

The scheduled GitHub Actions workflow checks for updated card data daily and
commits a changed `data/cards.json` to `master`. Once deployment is connected,
this should make new cards available without manual intervention. Their image
hashes allow the browser to construct the corresponding official image URLs
without a separate image update process.

## Hosting and deployment

The site will be deployed to either GitHub Pages or Cloudflare Pages. Both can
host the static Vite build.

The production deployment must rebuild automatically when the scheduled card
update changes `master`:

- Cloudflare Pages can deploy production-branch changes through its Git
  integration.
- A GitHub Pages deployment must account for the fact that a commit pushed with
  `GITHUB_TOKEN` does not trigger another push-based GitHub Actions workflow.
  The update and deployment should therefore be connected explicitly, such as
  by deploying within the updater or triggering deployment from its completion.

GitHub Pages repository-path hosting will also require the correct Vite base
path. The final host and exact deployment integration will be selected later.

## Design principles

- Responsiveness is a core feature, not a later optimization.
- Filtering happens locally after the initial dataset load.
- Search favors natural expression and immediate feedback.
- The browser remains useful without a query server.
- The simplest sufficient implementation is preferred.
- Complexity is added in response to observed problems, not anticipated ones.

## Deferred decisions

The following are intentionally not decided in this master plan:

- Technical module and component boundaries
- Visual design and layout
- Query grammar and matching rules
- Card sorting and result presentation
- Countdown schedules, configuration, and update sources
- A fallback image strategy if official hotlink behavior changes
