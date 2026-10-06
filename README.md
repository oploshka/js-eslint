# eslint-plugin-oploshka

Настройки ESLint для Vue / TypeScript проектов.

> Исторически пакет начинался как набор настроек ESLint 9.
> Начиная с `10.0.0` используется только ESLint 10 и Flat Config.

## Требования

- Node.js `^20.19.0 || ^22.13.0 || >=24`
- ESLint `^10.0.0`
- TypeScript `>=4.8.4 <6.1.0`

## Установка

pnpm:

```bash
pnpm add -D eslint@^10 eslint-plugin-oploshka "typescript@>=4.8.4 <6.1.0"
```

npm:

```bash
npm install -D eslint@^10 eslint-plugin-oploshka "typescript@>=4.8.4 <6.1.0"
```

Новые DEVELOP / PROD профили сейчас находятся в ветке `develop` и пока не опубликованы отдельной npm-версией.

Для проверки именно текущей develop-версии можно временно подключить пакет напрямую из GitHub:

```bash
pnpm add -D github:oploshka/js-eslint#develop
```

После финальной проверки правил будет достаточно вернуться на обычную npm-зависимость новой опубликованной версии.

## Быстрое подключение

По умолчанию пакет экспортирует профиль `DEVELOP`.

```js
// eslint.config.js
import sharedConfig from 'eslint-plugin-oploshka';

export default sharedConfig;
```

После этого:

```bash
pnpm exec eslint .
pnpm exec eslint . --fix
```

или через scripts проекта:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## DEVELOP и PROD

Пакет экспортирует два профиля:

```js
import {
  createEslintConfig,
  ESLINT_MODE,
} from 'eslint-plugin-oploshka';
```

### DEVELOP

Используется для IDE и обычной ежедневной разработки.

```js
export default createEslintConfig(ESLINT_MODE.DEVELOP);
```

Это также default export пакета.

### PROD

Используется для полного lint-аудита:

```js
export default createEslintConfig(ESLINT_MODE.PROD);
```

Рекомендуемая модель:

| Тип проверки | DEVELOP | PROD |
| --- | --- | --- |
| Некритичный legacy / migration debt | off | warn |
| Полезная рекомендация, если она не создаёт шум | warn | warn |
| Потенциальная ошибка программы | error | error |

Warnings не должны автоматически ломать проверку. Для этого не следует добавлять `--max-warnings=0`, если проект сознательно использует PROD как аудит технического долга.

## Один eslint.config.js и выбор режима проектом

Пакет не навязывает способ передачи режима. Проект может выбрать его через собственный runner, environment variable или другой ключ.

Например:

```js
// eslint.config.js
import {
  createEslintConfig,
  ESLINT_MODE,
} from 'eslint-plugin-oploshka';

const MODE_BY_KEY = {
  dev: ESLINT_MODE.DEVELOP,
  develop: ESLINT_MODE.DEVELOP,
  prod: ESLINT_MODE.PROD,
  check: ESLINT_MODE.PROD,
};

const modeKey = (process.env.ESLINT_MODE ?? 'dev').toLowerCase();
const mode = MODE_BY_KEY[modeKey];

if (!mode) {
  throw new Error(`Unknown ESLint mode: ${modeKey}`);
}

export default createEslintConfig(mode);
```

Если проект использует собственный Node runner, он может выставить `process.env.ESLINT_MODE` перед запуском ESLint.

Это позволяет держать в корне только один `eslint.config.js`, а служебную lint-инфраструктуру хранить отдельно.

## Идея конфигурации

Конфигурация разделяет две разные задачи:

1. не мешать разработчику во время ежедневной работы;
2. сохранять возможность увидеть технический долг и постепенно его сокращать.

Большой существующий проект содержит код, который не всегда соответствует всем современным рекомендациям ESLint, TypeScript и Vue.

Если каждое такое отклонение постоянно показывать в IDE как warning или error, полезные сообщения теряются в шуме.

Поэтому DEVELOP не пытается быть максимально строгим. Он пытается быть максимально полезным.

### Почему в DEVELOP используется off

Правило подходит для `off` в DEVELOP, если оно:

- не указывает на непосредственную ошибку выполнения;
- часто встречается в legacy-коде;
- не требует немедленного исправления;
- хорошо обнаруживается повторно при полном аудите;
- может быть исправлено массово или автоматически отдельным коммитом.

В частности, к такому migration debt относятся unused, `any`, часть TypeScript legacy-конструкций и некоторые stylistic rules.

### Почему в PROD используется warn

PROD возвращает такой технический долг в отчёт, но не делает его критической ошибкой.

Это позволяет:

- видеть накопившийся debt;
- оценивать объём будущей чистки;
- постепенно улучшать проект;
- не смешивать массовую миграцию с функциональными изменениями.

## Что остаётся error

Error должен означать потенциально реальную проблему, а не предпочтение оформления.

Строгими остаются, в частности:

- синтаксические ошибки;
- некорректный Vue template;
- invalid Vue directives;
- недостижимый или явно ошибочный JavaScript;
- ошибки импортов;
- присваивание константам;
- duplicate keys / attributes и другие конструкции, способные изменить поведение программы.

Например, `import-x/no-unresolved`, `import-x/default`, `import-x/named` и `import-x/export` не переводятся глобально в warning.

Если корректный специальный механизм сборщика вызывает false positive, предпочтительно добавить узкое исключение именно для него.

## TypeScript migration profile

В DEVELOP скрывается, а в PROD возвращается как warning ряд некритичных TypeScript-проверок, включая:

- unused variables;
- `no-explicit-any`;
- `ban-ts-comment`;
- `no-unsafe-function-type`;
- legacy namespace / require / this alias;
- wrapper object types;
- array constructor;
- некоторые migration-рекомендации типов.

Для `@ts-expect-error` в PROD требуется короткое описание.

Важно: TypeScript compiler сам может выдавать, например, `TS2578 Unused '@ts-expect-error' directive`. Severity ошибок TypeScript compiler не управляется ESLint.

## Vue: style и correctness

Vue recommended содержит как correctness rules, так и правила оформления.

В shared config stylistic noise отделён от потенциальных runtime-проблем.

### Порядок

`vue/attributes-order`:

- DEVELOP — off;
- PROD — warn.

`vue/order-in-components`:

- DEVELOP — off;
- PROD — warn.

Сохраняется проектный порядок секций компонента.

`vue/block-order` специально не смягчается: для него пока нет практической необходимости вводить отдельный override.

### Количество атрибутов

`vue/max-attributes-per-line` отключён полностью.

Проект не фиксирует максимальное количество атрибутов на одной строке. Решение о переносе зависит от читаемости конкретного template.

Например, допустимо:

```vue
<input type="number" id="num" min="1" max="10" value="5">
```

### Множественные пробелы

`vue/no-multi-spaces` отключён.

В однотипных структурах дополнительные пробелы могут использоваться как визуальные колонки:

```js
[
  { id: null,          name: 'Все' },
  { id: 'EXPIRED',     name: 'Истекла' },
  { id: 'NOT_EXPIRED', name: 'Не истекла' },
]
```

Такое форматирование считается осознанным средством читаемости, а не техническим долгом.

### Mustache spacing

`vue/mustache-interpolation-spacing` отключён.

Оба варианта не влияют на результат выражения:

```vue
<pre>{{navMenuSchema}}</pre>
<pre>{{ navMenuSchema }}</pre>
```

### Attribute hyphenation

`vue/attribute-hyphenation` отключён.

Пакет не навязывает единственный casing template-атрибутов, если форма имени несёт смысл для проекта.

### Имена компонентов и "_"

Стандартные:

- `vue/component-definition-name-casing`;
- `vue/component-name-in-template-casing`;

пока отключены.

Причина — проект использует `_` как смысловой разделитель PascalCase-сегментов:

```text
ViewDateTime_Month
FveRelation_Modal
```

TODO для `eslint-plugin-oploshka`: добавить собственное правило примерно с такой семантикой:

```text
ViewDateTime                  OK
ViewDateTime_Month            OK
ViewDateTime_MonthCalendar    OK

viewDateTime_Month            error
ViewDateTime_month            error
ViewDateTime__Month           error
ViewDateTime_                 error
```

До появления такого правила лучше отключить несовместимое стандартное правило, чем расставлять множество локальных `eslint-disable`.

### Self-closing

Для native HTML используется HTML-подобный стиль:

```vue
<img class="camera-image" :src="image" alt="">

<div class="preset-default-icon"></div>

<MyComponent />
```

Идея:

- HTML void elements (`img`, `input`, `br`) не получают `/>`;
- обычные native HTML elements используют явный closing tag;
- пустые Vue components могут быть self-closing.

Проверка считается stylistic debt:

- DEVELOP — off;
- PROD — warn.

### Inline content

Для короткого inline-content разрешены часто используемые HTML-теги, включая `div`.

Например:

```vue
<div @click="runWorker">testWorker</div>
```

не должен требовать искусственного переноса текста только из-за наличия атрибута.

## Массовые autofix-изменения

Правила, которые хорошо исправляются через `eslint --fix`, желательно мигрировать отдельно:

1. выбрать один тип исправления;
2. выполнить autofix;
3. проверить `git diff`;
4. сделать отдельный commit;
5. перейти к следующему классу изменений.

Это сохраняет историю Git читаемой и не смешивает форматирование с функциональными изменениями.

## Project overrides

Проектные переопределения добавляются после shared config:

```js
import sharedConfig from 'eslint-plugin-oploshka';

export default [
  ...sharedConfig,

  {
    files: ['**/*.vue'],
    rules: {
      // Только особенности конкретного проекта.
    },
  },
];
```

Если используется factory:

```js
import {
  createEslintConfig,
  ESLINT_MODE,
} from 'eslint-plugin-oploshka';

export default [
  ...createEslintConfig(ESLINT_MODE.DEVELOP),

  {
    rules: {
      // Project-specific overrides.
    },
  },
];
```

Shared package не должен содержать пути конкретного проекта, vendor-файлы или его временные каталоги.

Такие исключения остаются в project config.

## Storybook

Storybook не включён в shared config намеренно.

Если проект использует Storybook:

```bash
pnpm add -D eslint-plugin-storybook
```

```js
import storybook from 'eslint-plugin-storybook';
import sharedConfig from 'eslint-plugin-oploshka';

export default [
  ...sharedConfig,
  ...storybook.configs['flat/recommended'],

  // Project overrides должны идти последними.
];
```

При использовании factory:

```js
import storybook from 'eslint-plugin-storybook';
import {
  createEslintConfig,
  ESLINT_MODE,
} from 'eslint-plugin-oploshka';

export default [
  ...createEslintConfig(ESLINT_MODE.DEVELOP),
  ...storybook.configs['flat/recommended'],
];
```

## Vue template: лишняя запятая между атрибутами

В конфиге есть отдельная защита от ошибки:

```vue
<MyComponent
  :foo="foo",
  :bar="bar"
/>
```

Запятая может превратиться в HTML-атрибут с именем `,` и в runtime привести к:

```text
InvalidCharacterError: Failed to execute 'setAttribute' on 'Element': ',' is not a valid attribute name
```

`vue/no-restricted-static-attribute` помечает этот случай как ESLint error.

Также `vue/no-parsing-error` явно остаётся error.

## Ignore

Shared config игнорирует только общие артефакты:

```text
**/*.d.ts
**/coverage/**
**/dist/**
**/lib/**
**/node_modules/**
```

Project-specific generated/vendor/archive paths должны добавляться самим проектом.

## Миграция с 9.x

Версия `10.x` не поддерживает ESLint 9 и `.eslintrc`.

Используется только Flat Config и `defineConfig` из `eslint/config`.

После checkout репозитория:

```bash
pnpm install
pnpm run lint
```

Публикацию новой версии следует делать только после проверки изменений на реальном проекте.
