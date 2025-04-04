import typescriptEslintParser from "@typescript-eslint/parser";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import jestPlugin from "eslint-plugin-jest";

export default [
  {
    files: ["**/*.js", "**/*.ts"], // Lint JS and TS
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "**/*.d.ts",
      "src/main/public/**",
      "src/main/types/**",
      "jest.*config.js",
      ".eslintrc.js",
      "src/test/*/codecept.conf.js",
      "src/test/config.ts",
      ".yarn/**/*", // More aggressive Yarn skip
      "**/*.cjs" // Broaden to all .cjs
    ],
    languageOptions: {
      parser: typescriptEslintParser,
      sourceType: "module"
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      jest: jestPlugin
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "@typescript-eslint/no-empty-function": "error",
      "jest/expect-expect": "error"
    }
  },
  {
    // Explicitly exclude .d.ts files from linting
    files: ["**/*.d.ts"],
    ignores: ["**/*.d.ts"] // Redundant but reinforces intent
  }
];