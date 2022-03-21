module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./packages/*/tsconfig.json",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint/eslint-plugin",
    "no-only-tests",
    "monorepo-cop",
  ],
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:monorepo-cop/recommended",
  ],
  ignorePatterns: [".eslintrc.js", "dist", "build"],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-only-tests/no-only-tests": "error",
    // if you have a variable that needs to exist but is unused, prepend it with an underscore
    "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^_" }],
  },
  overrides: [
    {
      files: ["*.entity.ts"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
  ],
};
