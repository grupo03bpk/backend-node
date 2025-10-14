module.exports = {
  root: true,
  ignores: ['node_modules/', 'dist/'],
  plugins: ['@typescript-eslint'],
  languageOptions: {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      project: './tsconfig.json',
    },
  },
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
  rules: {
    // keep default rules; project-specific rules are enforced via ESLint CLI config
  },
};
