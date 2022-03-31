
module.exports = {
  overrides: [
    {
      files: [
        '**/__test__/*.{j,t}s?(x)',
        '**/test/jest/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
};
