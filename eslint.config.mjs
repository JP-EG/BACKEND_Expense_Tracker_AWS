import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["dist/**", "cdk.out/**", "webpack.config.js"],
  },
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {files: ["**/*.js"], languageOptions: {sourceType: "script"}},
  {languageOptions: { globals: globals.browser }},
  {
    rules: {
      "no-unused-vars": "warn", // Show as warning
      "no-console": "off",     // Ignore console logs
      "no-debugger": "error",  // Keep as error
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];