import js from "@eslint/js";
import globals from "globals";
import jsdoc from "eslint-plugin-jsdoc";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const googleConfig = require("eslint-config-google");
const prettierConfig = require("eslint-config-prettier");

const sanitizedGoogleRules = { ...googleConfig.rules };
delete sanitizedGoogleRules["valid-jsdoc"];
delete sanitizedGoogleRules["require-jsdoc"];

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      jsdoc: jsdoc,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...sanitizedGoogleRules,
      "jsdoc/require-jsdoc": "warn", 
      "jsdoc/require-description": "warn",
      "no-unused-vars": "warn",
    },
  },
  prettierConfig,
  {
    ignores: ["node_modules/", "dist/"],
  },
];
