module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:protractor/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    require: 'readonly',
    describe: 'readonly',
    it: 'readonly',
    expect: 'readonly',
    process: 'readonly',
    cy: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['react', 'protractor', 'prettier'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'max-len': [1, { "code": 160 }],
    'react/jsx-max-props-per-line': [1, { "when": "multiline" }],
    'react/prop-types': 0, // TODO: activate rule
    'protractor/no-absolute-url': 0, // TODO: activate rule
    'protractor/no-describe-selectors': 0, // TODO: activate rule
    'protractor/no-repetitive-locators': 0, // TODO: activate rule
    'protractor/no-repetitive-selectors': 0, // TODO: activate rule
    'protractor/no-browser-sleep': 0, // TODO: activate rule
    'protractor/missing-wait-message': 0 // TODO: activate rule
  }
}
