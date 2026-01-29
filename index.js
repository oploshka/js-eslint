// // eslint.config.js
// import sharedConfig from 'eslint-plugin-oploshka/eslint.config.js';
//
// //
// // файл .eslintignore не работает в ESLint 9. Он был устаревшим в пользу новой системы конфигурации (Flat Config),
// // которая используется по умолчанию в этой версии.
// // Вместо него для игнорирования файлов и каталогов нужно использовать свойство ignorePatterns в файле конфигурации ESLint
//
// export default [
//   ...sharedConfig,
//   // // Здесь можно переопределить или добавить специфичные для проекта правила
//   // {
//   //   rules: {
//   //     // Пример: отключить правило, которое вам не подходит в этом проекте
//   //     "no-console": "off",
//   //   },
//   // },
//   {
//     ignorePatterns: [
//       "node_modules/",
//       "dist/",
//       "lib/",
//       // "*.test.js"
//     ]
//   }
// ];

//
// import { defineConfig } from 'eslint/config';
import eslintPluginJs from '@eslint/js';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';
//
// import importPlugin from 'eslint-plugin-import';
// import importPluginX from "eslint-plugin-import-x";
// import viteResolver from "eslint-import-resolver-vite";

import { importX, createNodeResolver } from 'eslint-plugin-import-x'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
// import tsParser from '@typescript-eslint/parser'
// import { createNodeResolver } from 'eslint-plugin-import-x'

// //
// import path from "node:path";
// import { fileURLToPath } from "node:url";
// //
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// //
// import { register } from "tsx/register";
// // Регистрируем поддержку TS на лету
// register();

// export default defineConfig(
export default typescriptEslint.config(
  { ignores: ['*.d.ts', '**/coverage', '**/dist'] },
  {
    extends: [
      eslintPluginJs.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs['flat/recommended'],
      // eslintPluginVue.configs['base'],
      // importPluginX.flatConfigs.recommended,
      // importPluginX.flatConfigs.typescript,
    ],
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      // ... другие правила для Vue

      'no-undef': 'off',
      "@typescript-eslint/no-unused-vars": 'off',
    },
  },
  // {
  //   files: ["**/*.{js,mjs,jsx,vue}"],
  //   plugins: {
  //     // import: importPlugin,
  //     "import-x": importPluginX,
  //   },
  //   rules: {
  //     ...importPluginX.configs.recommended.rules,
  //     //
  //     // 'import/no-unresolved': 'error',
  //     // 'import/named': 'error',
  //     // 'import/default': 'error',
  //   },
  //   // settings: {
  //   //   // 3. Настройка резолвера
  //   //   "import-x/resolver": {
  //   //     vite: {
  //   //       // Указываем путь к конфигу Vite
  //   //       viteConfig: path.resolve(__dirname, "vite.config.js"),
  //   //     },
  //   //   },
  //   // },
  //   settings: {
  //     "import-x/resolver-next": [ // Используем современный интерфейс
  //       {
  //         // typescript: true, // Он сам найдет tsconfig.json
  //         // resolver: viteResolver,
  //         // options: {
  //         //   viteConfig: "./vite.config.js",
  //         //   viteConfig: path.resolve(__dirname, "vite.config.js"), // Это не сработает, так как TS!!!
  //         // }
  //       }
  //     ]
  //   },
  // }
  {
    plugins: {
      'import-x': importX,
    },
    extends: [
      // 'import-x/flat/recommended'
      importX.flatConfigs.recommended,
      importX.flatConfigs.typescript,
    ],
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver(/* Your override options go here */),
        createNodeResolver(/* Your override options go here */),
      ],
    },
    rules: {
      'import-x/no-dynamic-require': 'warn',
      //
      'import-x/no-unresolved': 'error',
      'import-x/named': 'error',
      'import-x/default': 'error',
    },
  },


  // Пример правила, специфичного для Vue
  {
    files: ["**/*.vue"],
    rules: {
      "vue/multi-word-component-names": "off", // Отключаем правило, если имена компонентов из одного слова допустимы
      //
      // https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/order-in-components.js
      //
      "vue/order-in-components": ["warn", {
        "order": [
          // Side Effects (triggers effects outside the component)
          'el',

          // for Vue.js 3.x
          'name',
          'mixins',
          'components',
          'emits',
          'props',
          'provide',
          'inject',
          'setup', // for Vue 3.x
          'data',
          'computed',
          // Non-Reactive Properties (instance properties independent of the reactivity system)
          'methods',

          // Global Awareness (requires knowledge beyond the component)
          'key', // for Nuxt
          'parent',

          // Component Type (changes the type of the component)
          'functional',

          // Template Modifiers (changes the way templates are compiled)
          ['delimiters', 'comments'],



          // Template Dependencies (assets used in the template)
          [ 'directives', 'filters'],


          // Composition (merges properties into the options)
          'extends',

          // Page Options (component rendered as a router page)
          'ROUTER_GUARDS', // for Vue Router
          'layout', // for Nuxt
          'middleware', // for Nuxt
          'validate', // for Nuxt
          'scrollToTop', // for Nuxt
          'transition', // for Nuxt
          'loading', // for Nuxt

          // Interface (the interface to the component)
          'inheritAttrs',
          'model',
          'propsData',
          'slots',
          'expose',

          // Note:
          // The `setup` option is included in the "Composition" category,
          // but the behavior of the `setup` option requires the definition of "Interface",
          // so we prefer to put the `setup` option after the "Interface".

          // Local State (local reactive properties)
          'asyncData', // for Nuxt
          'fetch', // for Nuxt
          'head', // for Nuxt

          // Events (callbacks triggered by reactive events)
          'watch',
          'watchQuery', // for Nuxt
          'LIFECYCLE_HOOKS',


          // Rendering (the declarative description of the component output)
          ['template', 'render'],
          'renderError'
        ]
      }]
    }
  }
);
