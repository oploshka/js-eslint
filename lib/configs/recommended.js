/*
 * IMPORTANT!
 *
 */
module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    browser: true,
    es6: true
  },
  plugins: ['oploshka'],
  rules: {
    'no-console': 'warn',   // process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': 'warn',  // process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // отступы
    'key-spacing': 'off',
    'no-multi-spaces': 'off',
    'space-before-blocks': 'off',
    'space-before-function-paren': 'off',
    'space-in-parens': 'off',
    'no-trailing-spaces': 'off',
    'semi-spacing': 'off',
    'padded-blocks': 'off',
    'spaced-comment': 'off',
    'indent': 'off',
    // 'no-irregular-whitespace': 'off', // ???
    //
    'no-unused-vars': 'warn', // не используемая константа
    //
    // '@typescript-eslint/no-empty-function': 'off',
    // '@typescript-eslint/ban-ts-comment': 'off',
    // //
    // 'vue/multi-word-component-names': 'off',
    //
    'import/first': 'off',
    //
    'comma-dangle': 'off',
    'quotes': ['warn', 'single'],
    'quote-props': 'off',
    'object-curly-spacing': 'off',
    'array-bracket-spacing': 'off',
    'keyword-spacing': 'off',
    'prefer-const': 'warn',
    'no-multiple-empty-lines': [2, {max: 99999, maxEOF: 0}],
    'semi': ['warn', 'always']
  }
};
