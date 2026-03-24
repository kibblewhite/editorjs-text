# editorjs-text

A single-line plain text block tool for [Editor.js](https://editorjs.io/). Designed as a drop-in replacement for the default paragraph tool when you need constrained, single-line text inputs — title fields, label inputs, or form-like UIs built inside an Editor.js instance.

- Enforces single-line input (Enter key is captured, line breaks are stripped)
- Multi-line paste is automatically condensed into a single line
- Emits a `block:enter` event when Enter is pressed, so your app can handle it
- Can hide the toolbar and popover for a minimal, input-field experience
- Supports read-only mode

## Demo

Try the live demo: [https://kibblewhite.github.io/editorjs-text/](https://kibblewhite.github.io/editorjs-text/)

## Installation

### NPM

```bash
npm install editorjs-text
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/editorjs-text/dist/bundle.js"></script>
```

## Quick Start

### ESM

```javascript
import TextElement from 'editorjs-text';

const editor = new EditorJS({
  holder: 'editorjs',
  defaultBlock: 'text',
  tools: {
    paragraph: { class: TextElement.DisabledParagraph },
    text: {
      class: TextElement,
      inlineToolbar: true,
      config: {
        placeholder: 'Type here...',
      }
    }
  }
});
```

### CDN / IIFE

```html
<script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/editorjs-text/dist/bundle.js"></script>
<script>
  const editor = new EditorJS({
    holder: 'editorjs',
    defaultBlock: 'text',
    tools: {
      paragraph: { class: TextElement.DisabledParagraph },
      text: {
        class: TextElement,
        inlineToolbar: true,
        config: {
          placeholder: 'Type here...',
        }
      }
    }
  });
</script>
```

## Disabling the Built-in Paragraph Tool

When using `TextElement` as the default block, you should disable the built-in paragraph tool. The common workaround `paragraph: false` causes a console warning:

```
Paste handling for «paragraph» Tool hasn't been set up because of the error
TypeError: this.constructable is not a constructor
```

This happens because Editor.js's Paste module tries to instantiate every registered tool, and `false` is not a constructor.

This plugin includes `TextElement.DisabledParagraph` — a no-op class that satisfies the Block Tool API without rendering anything or handling paste events:

```javascript
paragraph: { class: TextElement.DisabledParagraph }
```

## Configuration

| Field | Type | Default | Description |
|---|---|---|---|
| `placeholder` | `string` | `''` | Placeholder text shown when the editor is empty |
| `preserveBlank` | `boolean` | `false` | Keep blank entries when saving editor data |
| `allowEnterKeyDown` | `boolean` | `false` | Allow the Enter key to pass through to Editor.js. When `false`, Enter is captured and a `block:enter` event is emitted instead |
| `hidePopoverItem` | `boolean` | `false` | Hide the "Text" item from the block toolbox popover |
| `hideToolbar` | `boolean` | `false` | Hide the Editor.js toolbar entirely (affects all tools in that editor instance) |
| `startMarginZero` | `boolean` | `false` | Remove the default max-width constraint so the input spans its full container |
| `wrapElement` | `string` | `'text'` | Semantic metadata stored with the block data. Supported values: `text`, `custom`, `title`, `synopsis` |

### Full Configuration Example

```javascript
const editor = new EditorJS({
  holder: 'editorjs',
  defaultBlock: 'text',
  tools: {
    paragraph: { class: TextElement.DisabledParagraph },
    text: {
      class: TextElement,
      inlineToolbar: true,
      config: {
        placeholder: 'Enter a title...',
        preserveBlank: false,
        allowEnterKeyDown: false,
        hidePopoverItem: true,
        hideToolbar: true,
        startMarginZero: true,
        wrapElement: 'title'
      }
    }
  },
  onReady: () => {
    editor.events.on('block:enter', (eventData) => {
      console.log('Enter pressed:', eventData);
    });
  }
});
```

## Events

### `block:enter`

Emitted when the Enter key is pressed and `allowEnterKeyDown` is `false` (the default). The event data contains:

| Field | Type | Description |
|---|---|---|
| `element` | `HTMLDivElement` | The contentEditable element |
| `event` | `KeyboardEvent` | The original keyboard event |

```javascript
editor.events.on('block:enter', ({ element, event }) => {
  // Handle enter key — e.g., submit a form, move focus
});
```

## Output Data

```json
{
  "type": "text",
  "data": {
    "text": "Check out our projects on a <a href=\"https://github.com/codex-team\">GitHub page</a>.",
    "wrap": "text"
  }
}
```

| Field | Type | Description |
|---|---|---|
| `text` | `string` | HTML text content (single line, no line breaks) |
| `wrap` | `string` | Semantic wrap element type (`text`, `custom`, `title`, or `synopsis`) |

## Paste Handling

Multi-line content pasted into the editor is automatically condensed into a single line. Newlines and carriage returns are replaced with spaces. This prevents Editor.js from splitting pasted content into multiple blocks.

## Development

Requires Node.js `^20.19.0` or `>=22.12.0`.

```bash
npm install
npm run build
```

The build outputs to `dist/` in four formats:

| Format | File | Usage |
|---|---|---|
| IIFE | `bundle.js` | `<script>` tags, CDN |
| ESM | `text-element.mjs` | `import` |
| CJS | `text-element.cjs` | `require()` |
| UMD | `text-element.umd.js` | Universal |

To test locally, open `dist/index.html` directly in a browser from the filesystem.

## Troubleshooting

### `'vite' is not recognized` during build

Run `npm install` first to install dependencies.

### `SyntaxError: Unexpected reserved word` from Vite

Your Node.js version is too old. Update via [nvm](https://github.com/nvm-sh/nvm):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
nvm install --lts
```

### `ERR_FILE_NOT_FOUND` or `Cannot set properties of undefined (setting 'focused')`

You are opening the wrong HTML file. Open `dist/index.html`, not `public/index.html`. If it doesn't exist, run `npm run build` first.

## License

[MIT](LICENSE)
