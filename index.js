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

// ESLint 10: комментарий выше оставлен как исторический. В Flat Config используется `ignores`, а не `ignorePatterns`.
// ESLint 10: конфиг ниже сознательно не поддерживает ESLint 9 и старый .eslintrc-формат.
//
// import { defineConfig } from 'eslint/config';
import { defineConfig } from 'eslint/config';
import eslintPluginJs from '@eslint/js';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import {
  configs as typescriptEslintConfigs,
  parser as typescriptEslintParser,
  plugin as typescriptEslintPlugin,
} from 'typescript-eslint';
//
// import importPlugin from 'eslint-plugin-import';
// import importPluginX from "eslint-plugin-import-x";
// import viteResolver from "eslint-import-resolver-vite";

import { importX, createNodeResolver } from 'eslint-plugin-import-x';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
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
// export default typescriptEslint.config(
export default defineConfig([
  {
    name: 'oploshka/ignores',
    ignores: [
      '**/*.d.ts',
      '**/coverage/**',
      '**/dist/**',
      '**/lib/**',
      '**/node_modules/**',
    ],
  },

  // Базовый JavaScript-конфиг.
  {
    name: 'oploshka/javascript',
    files: ['**/*.{js,mjs,cjs,jsx}'],
    extends: [eslintPluginJs.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      'no-undef': 'off',
    },
  },

  // TypeScript-конфиг. Начиная с ESLint 10 используем стандартный defineConfig + extends,
  // а не deprecated helper typescriptEslint.config().
  {
    name: 'oploshka/typescript',
    files: ['**/*.{ts,mts,cts,tsx}'],
    extends: [
      eslintPluginJs.configs.recommended,
      typescriptEslintConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      'no-undef': 'off',
      "@typescript-eslint/no-unused-vars": 'off',

      // # eslint ругается на this.fn && this.fn()
      //
      // 'no-unused-expressions': ['error', {
      //   'allowShortCircuit': true, // Разрешает a && b()
      //   'allowTernary': true,      // Разрешает a ? b() : c()
      //   'allowTaggedTemplates': true
      // }]
      //
      // 'no-unused-expressions': 'off', // Отключаем базовое правило
      // '@typescript-eslint/no-unused-expressions': ['error', {
      //   'allowShortCircuit': true,
      //   'allowTernary': true
      // }]
      //
      // 'no-unused-expressions': ['error', { 'allowShortCircuit': true }]
      // 1. Обязательно отключаем базовое правило
      'no-unused-expressions': 'off',
      // 2. Настраиваем правило для TypeScript
      '@typescript-eslint/no-unused-expressions': ['error', {
        allowShortCircuit: true,
        allowTernary: true,
      }],
      // Отключаем ругание на наследование интерфейса без переопределения свойств
      '@typescript-eslint/no-empty-object-type': ['error', {
        allowInterfaces: 'with-single-extends',
      }],
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
    name: 'oploshka/imports',
    files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue}'],
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
    name: 'oploshka/vue',
    files: ['**/*.vue'],
    extends: [
      eslintPluginJs.configs.recommended,
      eslintPluginVue.configs['flat/recommended'],
      // eslintPluginVue.configs['base'],
      // importPluginX.flatConfigs.recommended,
      // importPluginX.flatConfigs.typescript,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        // vue-eslint-parser остаётся верхнеуровневым parser из eslint-plugin-vue,
        // а TypeScript parser используется внутри <script lang="ts">.
        parser: typescriptEslintParser,
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      // Регистрируем Vue явно: локальные vue/* rules находятся в этом же config block.
      // Не полагаемся на регистрацию плагина внутри extended flat/recommended.
      vue: eslintPluginVue,
      // Нужен для правил TypeScript, которые применяются к содержимому <script> в .vue.
      '@typescript-eslint': typescriptEslintPlugin,
    },
    rules: {
      // ... другие правила для Vue

      // Сохраняем поведение старого shared config: эти проверки были отключены и для .vue.
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

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
      }],

      // # Vue
      /**
       * <template v-for="rowItem in formRowList" :key="rowItem.id"> // Ругается на :key
       * </template>
       */
      'vue/max-attributes-per-line': ['warn', {
        'singleline': { 'max': 3 }, // Разрешить 3 атрибута, если тег в одну строку
        'multiline': { 'max': 1 },  // Разрешить только 1 атрибут на строку, если тег разбит на несколько
      }],

      /**
       * Данное правило ругалось по умолчанию на пустые строки после template
       */
      'vue/multiline-html-element-content-newline': ['warn', {
        // 'ignoreWhenEmpty': true,
        'allowEmptyLines': true,
      }],

      // Если используешь компоненты в PascalCase (напр. <MyComponent />),
      // полезно включить это правило для единообразия:
      'vue/component-name-in-template-casing': ['warn', 'PascalCase', {
        'registeredComponentsOnly': false,
        'ignores': [],
      }],

      /**
       * Без этого ругается на следующую строку
       * <h2 style="color: red">Экспериментальный вариант отображения:</h2>
       *
       * Ошибка: ожидается перенос строки вокруг '{{ field.name }}'
       * <div class="menu-preset-builder-item-card">{{ field.name }}</div>
       */
      'vue/singleline-html-element-content-newline': ['warn', {
        'ignoreWhenNoAttributes': true,
        'ignoreWhenEmpty': true,
        'ignores': ['h1', 'h2', 'h3', 'span', 'p', 'button', 'pre', 'textarea'], // Список тегов, которые можно писать в одну строку
      }],

      /**
       * Выдавать предупреждение вместо критической ошибки
       * components: {
       *   NotUsedComponents, // Это вызывает ошибку
       * }
       */
      'vue/no-unused-components': ['warn', {
        // 'ignorePattern': '^_' // Можно игнорировать компоненты, начинающиеся с подчёркивания (подумать)
      }],

      /**
       * <FormActionList @runExport="runExport"/>
       * Без этой строчки будет требовать runExport -> @run-export
       */
      'vue/v-on-event-hyphenation': ['warn', 'never', {
        'autofix': false,
        'ignore': ['update:modelValue'], // полезно для Vue 3 v-model
        // 'ignoreTags': ['custom-web-component']
      }],
      // Выключаем принудительный kebab-case для атрибутов
      // "vue/attribute-hyphenation": ["off"],
      // Для пропсов: :myProp вместо :my-prop
      'vue/attribute-hyphenation': ['warn', 'never', { 'ignore': [] }],

      /**
       * Правило vue/html-closing-bracket-spacing контролирует наличие или отсутствие пробела перед закрывающей скобкой (>) в тегах.
       * Как будто не сильно удобное правило из-за того что нельзя отключить selfClosingTag
       */
      // "vue/html-closing-bracket-spacing": ["warn", {
      //   "startTag": "never",
      //   "endTag": "never",
      //   "selfClosingTag": "never" // <br /> — с пробелом (стиль Prettier)
      // }],
      'vue/html-closing-bracket-spacing': 'off',

      // Установка отступа в 2 пробела (стандарт)
      // 'vue/html-indent': ['error', 2, {
      //   'attribute': 1,
      //   'baseIndent': 1,
      //   'closeBracket': 0,
      //   'alignAttributesVertically': true,
      //   'ignores': []
      // }],
      'vue/html-indent': 'off', // TODO: вернуть и произвести фикс в template

      // Ловим ошибку вида:
      // <MyComponent
      //   :foo="foo",
      //   :bar="bar"
      // />
      // Запятая становится отдельным статическим HTML-атрибутом и затем приводит к
      // InvalidCharacterError: Failed to execute 'setAttribute': ',' is not a valid attribute name.
      'vue/no-restricted-static-attribute': ['error', {
        key: ',',
        message: 'Лишняя запятая между атрибутами Vue template',
      }],

      // Явно оставляем parsing errors критическими, даже если preset изменится в будущем.
      'vue/no-parsing-error': 'error',

      // # eslint ругается на this.fn && this.fn()
      //
      // 'no-unused-expressions': ['error', {
      //   'allowShortCircuit': true, // Разрешает a && b()
      //   'allowTernary': true,      // Разрешает a ? b() : c()
      //   'allowTaggedTemplates': true
      // }]
      //
      // 'no-unused-expressions': 'off', // Отключаем базовое правило
      // '@typescript-eslint/no-unused-expressions': ['error', {
      //   'allowShortCircuit': true,
      //   'allowTernary': true
      // }]
      //
      // 'no-unused-expressions': ['error', { 'allowShortCircuit': true }]
      // 1. Обязательно отключаем базовое правило
      'no-unused-expressions': 'off',
      // 2. Настраиваем правило для TypeScript
      '@typescript-eslint/no-unused-expressions': ['error', {
        'allowShortCircuit': true,
        'allowTernary': true,
      }],
      // Отключаем ругание на наследование интерфейса без переопределения свойств
      '@typescript-eslint/no-empty-object-type': ['error', { 'allowInterfaces': 'with-single-extends' }],
    }
  }
]);

// Storybook намеренно не подключён в shared config:
// eslint-plugin-storybook должен оставаться в eslint.config.js конкретного проекта,
// потому что не каждый потребитель eslint-plugin-oploshka использует Storybook.
