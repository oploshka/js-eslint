//
import eslintPluginJs from '@eslint/js';
// import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

// export default [
//   // Базовые настройки для игнорирования файлов
//   {
//     ignores: [
//       "dist",
//       "node_modules",
//       "coverage",
//       "**/legacy-format",
//       ".eslintrc.cjs", // Если вы мигрируете со старого формата, игнорируйте старый файл
//       "*.config.js",
//       "*.config.cjs",
//       "*.d.ts",
//       "*.json",
//     ],
//   },
//   // Настройки для всего проекта
//   {
//     languageOptions: {
//       ecmaVersion: "latest",
//       sourceType: "module",
//       globals: {
//         ...globals.browser,
//       },
//     },
//   },
//   // Стандартные рекомендованные правила ESLint
//   eslintPluginJs.configs.recommended,
//
//   // Настройки для TypeScript (если используется)
//   ...typescriptEslint.configs.recommended,
//   {
//     files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
//     rules: {
//       // Пример правила для TypeScript, которое будет применяться ко всем TS-файлам
//       "@typescript-eslint/no-unused-vars": "error",
//       // ... другие правила, специфичные для TS
//     },
//   },
//
//   // Настройки для Vue-файлов
//   ...eslintPluginVue.configs["flat/recommended"], // Используем рекомендуемые правила для Vue 3
//   {
//     files: ["**/*.vue"],
//     languageOptions: {
//       parser: "vue-eslint-parser",
//       parserOptions: {
//         parser: "@typescript-eslint/parser", // Используем парсер TypeScript для блока <script>
//         sourceType: "module",
//         ecmaVersion: "latest",
//         extraFileExtensions: [".vue"],
//       },
//     },
//     rules: {
//       // Пример правила, специфичного для Vue
//       "vue/multi-word-component-names": "off", // Отключаем правило, если имена компонентов из одного слова допустимы
//       // ... другие правила для Vue
//     },
//   },
// ];

export default typescriptEslint.config(
  { ignores: ['*.d.ts', '**/coverage', '**/dist'] },
  {
    extends: [
      eslintPluginJs.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      // Пример правила, специфичного для Vue
      "vue/multi-word-component-names": "off", // Отключаем правило, если имена компонентов из одного слова допустимы
      // ... другие правила для Vue
    },
  },
  // eslintConfigPrettier,
);