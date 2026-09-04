import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tailwind from "eslint-plugin-tailwindcss";
import noRawColor from "./eslint-rules/no-raw-color.mjs";
import noStyleProp from "./eslint-rules/no-style-prop.mjs";

// Local, repo-specific rules. Not published — kept here because there is no
// third-party package that enforces these two BTE-specific constraints.
const bte = {
  rules: {
    "no-raw-color": noRawColor,
    "no-style-prop": noStyleProp,
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    ...tailwind.configs.recommended,
    // Tailwind classes only ever appear in .tsx (JSX). Scoping to .tsx avoids
    // the plugin misreading unrelated .ts identifiers (e.g. cn()'s own
    // "...inputs" parameter in src/lib/utils.ts) as classnames.
    files: ["**/*.tsx"],
    settings: {
      tailwindcss: {
        // Tailwind v4 has no JS config file. The plugin reads the theme
        // straight out of the CSS entry point instead.
        cssConfigPath: "./src/app/globals.css",
      },
    },
    rules: {
      ...tailwind.configs.recommended.rules,
      // The design system's whole point is that these scales are closed.
      // Arbitrary values (p-7, bg-[#ff0000], w-[137px]) reopen them.
      "tailwindcss/no-arbitrary-value": "error",
      "tailwindcss/enforces-shorthand": "error",
      "tailwindcss/classnames-order": "error",
      // meta-label and ember-fill are our own @layer components utilities
      // from globals.css, not Tailwind built-ins.
      "tailwindcss/no-custom-classname": [
        "warn",
        { whitelist: ["meta-label", "ember-fill"] },
      ],
    },
  },
  {
    files: ["**/*.tsx"],
    plugins: { bte },
    rules: {
      "bte/no-raw-color": "error",
      "bte/no-style-prop": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // pnpm's local content-addressable store (see .gitignore).
    ".pnpm-store/**",
  ]),
]);

export default eslintConfig;
