import path from "path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import * as pkg from "./package.json";

const NODE_ENV = process.argv.mode || "development";
const VERSION = pkg.version;

export default {
  build: {
    lib: {
      entry: path.resolve(__dirname, "src", "text.js"),
      formats: [ "cjs", "umd", "es", "iife" ],
      fileName: (format, chunk) => {
        switch(format) {
          case 'iife':
            return 'bundle.js';
          case 'es':
            return 'text.mjs';
          case 'umd':
            return 'text.umd.js';
          case 'cjs':
            return 'text.cjs';
          default:
            return null;
        }
      },
      name: "Text",
    },
    minify: false,
    rollupOptions: {
      // Add any additional rollup options here
    },
  },
  define: {
    'process.env.VERSION': JSON.stringify(VERSION),
    NODE_ENV: JSON.stringify(NODE_ENV),
    VERSION: JSON.stringify(VERSION),
  },
  plugins: [cssInjectedByJsPlugin()],
};
