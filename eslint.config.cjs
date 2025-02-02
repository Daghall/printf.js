"use strict";

const globals = require("globals");
const js = require("@eslint/js");

const {
  FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [
  ...compat.extends("eslint:recommended"), {
    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 2018,
      sourceType: "commonjs",
    },

    rules: {
      "arrow-parens": 2,
      "arrow-spacing": 2,

      "brace-style": [2, "1tbs", {
        allowSingleLine: false,
      }],

      "callback-return": 2,
      camelcase: 0,
      "comma-spacing": 1,
      curly: [2, "multi-line"],

      "dot-notation": [2, {
        allowKeywords: true,
      }],

      "eol-last": 2,
      eqeqeq: 2,
      "handle-callback-err": 2,

      "key-spacing": [1, {
        beforeColon: false,
        afterColon: true,
      }],

      "keyword-spacing": 1,

      indent: [1, 2, {
        SwitchCase: 1,
        MemberExpression: 1,
      }],

      "new-cap": 2,
      "new-parens": 1,
      "no-alert": 2,
      "no-array-constructor": 2,
      "no-caller": 2,
      "no-catch-shadow": 2,
      "no-console": 2,
      "no-duplicate-imports": 1,
      "no-eval": 2,
      "no-extend-native": 2,
      "no-extra-bind": 2,
      "no-extra-parens": [1, "functions"],
      "no-implied-eval": 2,
      "no-iterator": 2,
      "no-label-var": 2,
      "no-labels": 2,
      "no-lone-blocks": 2,
      "no-loop-func": 2,
      "no-multi-spaces": 1,
      "no-multi-str": 2,
      "no-multiple-empty-lines": 1,
      "no-native-reassign": 2,
      "no-new": 2,
      "no-new-func": 2,
      "no-new-object": 2,
      "no-new-symbol": 2,
      "no-new-wrappers": 2,
      "no-octal-escape": 2,
      "no-path-concat": 2,
      "no-process-exit": 2,
      "no-proto": 2,
      "no-prototype-builtins": 0,
      "no-return-assign": 2,
      "no-script-url": 2,
      "no-sequences": 2,
      "no-shadow": 2,
      "no-shadow-restricted-names": 2,
      "no-spaced-func": 2,
      "no-trailing-spaces": 1,
      "no-underscore-dangle": 0,
      "no-unused-expressions": 2,
      "no-use-before-define": [2, "nofunc"],
      "no-var": 2,
      "no-with": 2,
      "prefer-arrow-callback": 2,

      "prefer-const": ["error", {
        destructuring: "all",
      }],

      "prefer-template": 1,
      quotes: [1, "double"],
      "require-atomic-updates": 0,
      semi: [2, "always"],

      "semi-spacing": [1, {
        before: false,
        after: true,
      }],

      "space-before-blocks": 1,

      "space-before-function-paren": [1, {
        anonymous: "always",
        named: "never",
      }],

      "space-infix-ops": 1,

      "space-unary-ops": [1, {
        words: true,
        nonwords: false,
      }],

      strict: [2, "global"],
      yoda: [1, "never"],
      "comma-dangle": [1, "always-multiline"],
    },
  },
  {
    files: ["test/**/*.js"],
    languageOptions: {
      globals: {
        beforeEach: false,
        describe: false,
        context: false,
        it: false,
      },
    },
    rules: {
      "no-unused-expressions": 0,
    },
  }];
