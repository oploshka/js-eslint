# eslint-plugin-oploshka

oploshka web dev

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-oploshka`:

```sh
npm install eslint-plugin-oploshka --save-dev
```

## Usage

```js
module.exports = {
  root: true,
  'extends': [
    // ...
    'plugin:oploshka/recommended',
    'plugin:oploshka/overrides-test-jest',
  ],
  globals: {
    // ...
  }
  // ...
}
```



