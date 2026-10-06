# eslint-plugin-oploshka
Настройки eslint 9 под vue js

> Историческая строка выше сохранена из предыдущей версии README.
> Начиная с `10.0.0` пакет предназначен только для ESLint 10 и Flat Config.

## Требования

- Node.js `^20.19.0 || ^22.13.0 || >=24`
- ESLint `^10.0.0`
- TypeScript `>=4.8.4 <6.1.0`

## Использование

```js
// eslint.config.js
import sharedConfig from 'eslint-plugin-oploshka';

export default [
  ...sharedConfig,
];
```

Проектные переопределения лучше добавлять после shared config:

```js
import sharedConfig from 'eslint-plugin-oploshka';

export default [
  ...sharedConfig,
  {
    files: ['**/*.vue'],
    rules: {
      'vue/html-indent': 'off',
    },
  },
];
```

## Storybook

Storybook не включён в shared config намеренно. Если проект использует Storybook, подключай его в `eslint.config.js` самого проекта:

```js
import storybook from 'eslint-plugin-storybook';
import sharedConfig from 'eslint-plugin-oploshka';

export default [
  ...sharedConfig,
  ...storybook.configs['flat/recommended'],
  // Проектные overrides лучше оставлять последними.
];
```

## Vue template: лишняя запятая между атрибутами

В конфиг добавлена отдельная защита от ошибки вида:

```vue
<MyComponent
  :foo="foo",
  :bar="bar"
/>
```

Такая запятая может превратиться в HTML-атрибут с именем `,` и в runtime привести к:

```text
InvalidCharacterError: Failed to execute 'setAttribute' on 'Element': ',' is not a valid attribute name
```

Теперь `vue/no-restricted-static-attribute` помечает это как ESLint error.

## Миграция с 9.x

Версия `10.0.0` не сохраняет обратную совместимость с ESLint 9 и `.eslintrc`.
Используется только Flat Config и `defineConfig` из `eslint/config`.

`package-lock.json` от ветки 9.x удалён при миграции, потому что он описывал старое дерево зависимостей. После checkout ветки нужно выполнить:

```bash
npm install
npm run lint
```

и при необходимости закоммитить новый `package-lock.json`.
