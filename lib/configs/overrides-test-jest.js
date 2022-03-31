/*
 * IMPORTANT!
 *
 */
module.exports = {
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/test/jest/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
};
