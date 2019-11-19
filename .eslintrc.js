module.exports = {
  root: process.env.NODE_ENV === 'develpment',
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    vue: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    'eslint-config-airbnb'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': 0,
    'arrow-parens': [2, 'as-needed'],
    'prefer-destructuring': ['error', {
      'AssignmentExpression': {
        'array': false,
        'object': true
      }
    }],
    'no-shadow': ['error', { 'allow': ['state', 'getters'] }],
    'no-param-reassign': 0,
    'max-len': ['error', { 'code': 150, 'tabWidth': 2 }],
    'no-plusplus': ["error", { "allowForLoopAfterthoughts": true }]
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
