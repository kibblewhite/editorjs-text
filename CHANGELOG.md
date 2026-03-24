# Changelog

## 1.0.3 (2026-03-24)

### Features

- **RTL support** — added `direction` config option (defaults to `'auto'`), sets the `dir` attribute on the rendered block element. CSS updated to use logical properties (`margin-inline-start`, `text-align: start`) so layout adapts correctly in RTL contexts
- **GitHub Pages deployment** — added workflow to publish the demo page on push to `main`

### Demo Page

- Added third editor instance with RTL enabled (`i18n.direction: 'rtl'`)
- Added "Invoke Insert" and "Invoke Insert Paragraph" buttons for testing block injection
- Added "Load Data" button to test rendering from a JSON payload, including unsupported and malformed blocks
- Improved layout with Turret CSS and responsive containers

## 1.0.2 (2026-03-24)

- Fix `repository.url` format in `package.json` (npm publish warning)
- Version bump from 1.0.1 (which published successfully despite a misleading CI error)

## 1.0.1 (2026-03-24)

First stable release. Major refactor, bug fixes, and modernised build tooling.

### Features

- **DisabledParagraph** — included no-op class (`TextElement.DisabledParagraph`) that cleanly disables the built-in paragraph tool without the `"constructable is not a constructor"` warning caused by `paragraph: false`
- **Paste handling** — multi-line paste is automatically condensed into a single line. Uses `execCommand('insertText')` for undo-stack integration with a Selection/Range API fallback
- **`block:enter` event** — emitted when Enter is pressed (when `allowEnterKeyDown` is `false`), allowing the consuming app to handle the event

### Bug Fixes

- **Fixed `addRange(): The given range isn't in document`** — replaced direct DOM removal of blocks with `this.api.blocks.delete()` to keep Editor.js's internal block list in sync
- **Fixed `toolbox` static getter** — removed unreachable instance property check (`this._hidePopoverItem`) from static context
- **Fixed `_currentWrapElement()`** — removed broken `.find()` comparison that would always throw (`item.wrap` on a string is `undefined`)
- **Fixed DOM side effects in `normalizeData()`** — removed block removal logic that didn't belong in a data normalization function
- **Fixed double assignment of `_data` in constructor** — removed dead initial assignment that was immediately overwritten
- **Guarded `render()` against null holder/redactor** — prevents crashes when blocks are created but not yet in the DOM

### Refactored

- Merged `drawView()` into `render()` (only caller)
- Inlined `_instantiate_data()` and `_set_wrap_element()` (single-use wrappers)
- Simplified config defaults to use `??` operator
- Set `contentEditable` once based on `readOnly` instead of setting it twice
- Removed dead code: commented-out `conversionConfig`, commented-out `console.debug`, commented-out Ctrl+V handler
- Removed dead `onPaste()` and `pasteConfig` (superseded by DOM-level paste intercept)
- Cleaned up CSS: removed unreachable `.ce-text p` margin rules and redundant `white-space: nowrap` on child selector

### Build & Dependencies

- Upgraded Vite 7.x to **8.0.2**
- Upgraded `@rollup/plugin-terser` 0.4.4 to **1.0.0** (fixes high severity RCE vulnerability in `serialize-javascript`)
- Upgraded `vite-plugin-css-injected-by-js` 3.x to **4.0.1**
- Fixed `exports.require` in `package.json` to point to CJS file instead of UMD
- Added `repository`, `bugs`, `homepage`, and expanded `keywords` in `package.json`
- Removed redundant `.npmignore` (`"files": ["dist"]` already handles publish filtering)
- Rewrote README with structured documentation, usage examples, and configuration reference

### Breaking Changes

- `pasteConfig` and `onPaste()` removed from `TextElement`. Paste is now handled at the DOM level before Editor.js processes it. This should not affect consumers — it only changes internal behaviour.
- Package version jump from 0.1.10 to 1.0.1 signals the first stable public API.
