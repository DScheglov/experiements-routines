import globals from 'globals';
import tsLint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier/recommended';

export default tsLint.config(
  {
    plugins: {
      '@typescript-eslint': tsLint.plugin,
    },
  },
  {
    files: ['**/*.{ts,mjs}'],
  },
  {
    ignores: ['dist', 'node_modules', 'coverage', '**/*.{js,cjs,json}'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.es2025,
      },
      parserOptions: {
        project: [
          'tsconfig.json',
          'tsconfig.eslint.json',
          'tsconfig.test.json',
        ],
      },
    },
  },
  ...tsLint.configs.recommended,
  prettierPlugin,
  {
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'all',
          tabWidth: 2,
          useTabs: false,
          semi: true,
          singleQuote: true,
          experimentalTernaries: false,
        },
      ],
    },
  },
);
