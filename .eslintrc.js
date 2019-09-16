module.exports = {
  extends: 'react-app',
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/no-angle-bracket-type-assertion': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
  },
};
