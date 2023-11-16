# editorjs-text

A plain text block for editorjs. You can capture the enter key to prevent new lines or line breaks from been created.

## NPM and Build

```
npm install vite@latest
npm install @codexteam/icons@latest
npm install vite-plugin-css-injected-by-js --save-dev
```

```
npm install
npm update
```

Build the distribution.

```
npm run build
```

Open `dist\index.html` in a local browser.


## Issues

### Vite

If you get this during the `npm run build`:

```
'vite' is not recognized as an internal or external command, operable program or batch file.
```

Please ensure you have performed the npm install commands earlier in this document.

---

```
file://.../editorjs-text/node_modules/vite/bin/vite.js:7
    await import('source-map-support').then((r) => r.default.install())
    ^^^^^

SyntaxError: Unexpected reserved word
    at Loader.moduleStrategy (internal/modules/esm/translators.js:133:18)
    at async link (internal/modules/esm/module_job.js:42:21)
```

During the npm install, you may have an older version of node/npm/nvm.

Please go through the update process successfully and then try again.


### Console Errors in the Browser

```
Failed to load resource: net::ERR_FILE_NOT_FOUND
```

Or

```
Editor.js is not ready because of TypeError: Cannot set properties of undefined (setting 'focused')
```

Means you are running the wrong `index.html` please open the correct `dist\index.html` into your local browser from the local file system.

If the `dist\index.html` file is missing, you need to run the `npm run build` command in order to build the html.
