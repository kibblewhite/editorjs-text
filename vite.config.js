import path from "path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import * as pkg from "./package.json";
import terser from '@rollup/plugin-terser';

const NODE_ENV = process.argv.mode || "development";
const VERSION = pkg.version;

export default {
  build: {
    lib: {
      name: "TextElement",
      entry: path.resolve(__dirname, "src", "text-element.js"),
      formats: [ "cjs", "umd", "es", "iife" ],
      fileName: (format, chunk) => {
        switch(format) {
          case 'iife':
            return 'bundle.js';
          case 'es':
            return 'text-element.mjs';
          case 'umd':
            return 'text-element.umd.js';
          case 'cjs':
            return 'text-element.cjs';
          default:
            return null;
        }
      }
    },
    minify: false,
    rollupOptions: {
      plugins: [terser()]
    }
  },
  define: {
    'process.env.VERSION': JSON.stringify(VERSION),
    NODE_ENV: JSON.stringify(NODE_ENV),
    VERSION: JSON.stringify(VERSION),
  },
  plugins: [cssInjectedByJsPlugin()],
};
