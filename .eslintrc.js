module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    requireConfigFile: false,
    project: [
      './packages/backend/tsconfig.json',
      './packages/frontend/tsconfig.json',
      './packages/mobile/tsconfig.json',
    ],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier', 'react-hooks', 'react', 'react-native'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'no-unused-vars': 'off',
    quotes: ['error', 'single'],
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ['*.ts', '*.tsx'],
      rules: {
        // '@typescript-eslint/explicit-function-return-type': ['error'],
      },
    },
  ],
};
