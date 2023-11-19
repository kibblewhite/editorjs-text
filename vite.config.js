import path from "path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import * as pkg from "./package.json";

const NODE_ENV = process.argv.mode || "development";
const VERSION = pkg.version;

export default {
  build: {
    lib: {
      entry: path.resolve(__dirname, "src", "text.js"),
      formats: [ "iife" ],
      fileName: (format) => `text.${format === 'iife' ? 'js' : format + '.js'}`,
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
