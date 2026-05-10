const tsParser = require('@typescript-eslint/parser')
const tsPlugin = require('@typescript-eslint/eslint-plugin')

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
      'no-console':                                 'warn',
      '@typescript-eslint/no-explicit-any':         'error',
      '@typescript-eslint/no-unused-vars':          ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    // CLI scripts — console output is intentional
    files: ['src/seed*.ts', 'src/list-titles.ts', 'src/convert.ts'],
    rules: {
      'no-console': 'off',
    },
  },
]
