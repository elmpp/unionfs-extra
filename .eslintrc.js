
/**
 * This builds upon the airbnb eslint rules but has loads of extra stuff added incrementally
 * Airbnb already includes react etc etc (via command `npx install-peerdeps --dev eslint-config-airbnb`)
 *
 * ! Remember that typescript has its own "rules" when it comes to transpiling
 * ! see `tsconfig.base.json#compilerOptions`
 *
 *  - good blog post about typescript eslint - https://tinyurl.com/y29eselt
 */

const commonPrettierRules = {
  singleQuote: true,
      bracketSpacing: false,
      semi: false,
      singleQuote: true,
      trailingComma: 'es5',
      printWidth: 120,
}

const commonExtends = ['eslint:recommended', 'prettier', 'prettier/react', 'plugin:react/recommended', 'plugin:jsx-a11y/recommended']
const commonPlugins = ['prettier', 'react', 'react-hooks', 'promise', 'import', 'jest', 'jsx-a11y']

const commonRules = {
  'import/no-unresolved': 0,
  'react/jsx-filename-extension': {
    extensions: ['.jsx', '.tsx'],
  },

  'arrow-body-style': 0,
  'arrow-parens': ['off'],
  'class-methods-use-this': 0,
  'comma-dangle': [
    'error',
    {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'ignore',
    },
  ],
  // 'compat/compat': 2,
  'consistent-return': 0,
  'func-names': 0,
  'function-paren-newline': 0,
  'generator-star-spacing': 0,
  'global-require': 0,
  'import/no-cycle': 0,
  'import/no-extraneous-dependencies': 0,
  'import/no-unresolved': [2],
  'import/order': 0,
  'import/prefer-default-export': 0,
  'lines-between-class-members': 0,
  'max-classes-per-file': 0,
  'max-len': 0,
  'no-case-declarations': 0,
  'no-cond-assign': 1,
  'no-console': 0,
  'no-else-return': 0,
  'no-multi-assign': 0,
  'no-multi-spaces': 0,
  'no-new': 0,
  'no-param-reassign': 0,
  'no-restricted-syntax': 0,
  'no-script-url': 0,
  'no-unused-vars': [1, {varsIgnorePattern: '^_', argsIgnorePattern: '^_', ignoreRestSiblings: true}],
  'no-use-before-define': 0,
  'no-underscore-dangle': 0,
  'object-curly-newline': 0,
  'object-curly-spacing': [2, 'never'],
  'object-shorthand': 0,
  'prefer-promise-reject-errors': 1,
  'promise/always-return': 'error',
  'promise/catch-or-return': 2,
  'promise/no-native': 0,
  'promise/param-names': 2,
  semi: [2, 'never'],
  'space-before-function-paren': [
    'error',
    {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'ignore',
    },
  ],

  // overriding airbnb - https://tinyurl.com/y65rbugm
  'jsx-a11y/alt-text': 0,
  'jsx-a11y/anchor-is-valid': 0,
  'jsx-a11y/click-events-have-key-events': 0,
  'jsx-a11y/href-no-hash': 0,
  'jsx-a11y/img-has-alt': 0,
  'jsx-a11y/no-noninteractive-element-interactions': 0,
  'jsx-a11y/no-static-element-interactions': 0,
  // overriding prettier - https://tinyurl.com/y94dyf3q
  'prettier/prettier': [
    1,
    {
      ...commonPrettierRules,
    },
  ], // this will merge with .prettierrc.json but be ignore by vscode
  // overriding react hooks - https://tinyurl.com/y25926tx
  'react-hooks/rules-of-hooks': 2,
  'react-hooks/exhaustive-deps': 2,
  // overriding react - https://tinyurl.com/y4dcrm8f
  'react/destructuring-assignment': [1, 'always', {ignoreClassFields: true}],
  'react/jsx-filename-extension': [2, {extensions: ['.js', '.tsx']}],
  'react/jsx-props-no-spreading': 0,
  'react/jsx-no-bind': 0,
  'react/no-multi-comp': 0,
  'react/no-string-refs': 0,
  'react/no-unused-state': 1,
  'react/prefer-stateless-function': 0,
  'react/prop-types': 0,
  'react/react-in-jsx-scope': 0,
  'react/static-property-placement': [2, 'static public field'],
  // not found rule definitions following typescript-eslint move...
  'react/static-property-placement': 0,
  'react/jsx-curly-newline': 0,
  'react/state-in-constructor': 0,
}

// react settings - https://tinyurl.com/zq3bb4s
const commonSettings = {
  react: {
    createClass: 'createReactClass',
    pragma: 'React',
    version: 'detect',
  },
  'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
  'import/resolver': {
    node: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  },
}

module.exports = {
  ignorePatterns: ['**/node_modules', '**/dist', '**/*.deleteable.*', '**/*.pre-.*', '**/*.post-.*'],
  extends: [...commonExtends],
  plugins: [...commonPlugins],
  parser: 'babel-eslint',
  globals: {
    page: true,
    browser: true,
    jestPuppeteer: true,
  },
  env: {
    browser: true,
    jest: true,
    node: true,
  },
  rules: commonRules,
  settings: {
    ...commonSettings,
  },
  // overrides specifically for .ts[x] files... - https://tinyurl.com/sxpvohp
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      env: {browser: true, es6: true, node: true},
      extends: [...commonExtends, 'plugin:@typescript-eslint/recommended'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: {jsx: true},
        ecmaVersion: 2018,
        sourceType: 'module',

        project: [],
      },
      plugins: [...commonPlugins, 'eslint-plugin-tsdoc', '@typescript-eslint'],
      rules: {
        ...commonRules,
        'prettier/prettier': [
          1,
          {
            ...commonPrettierRules,
            parser: 'typescript',
          },
        ],
        'tsdoc/syntax': 1,
        'no-undef': 0, // not required alongside ts - https://tinyurl.com/voo2zzp
        // overriding @typescript-eslint
        '@typescript-eslint/ban-ts-ignore': 0,
        '@typescript-eslint/camelcase': 0,
        '@typescript-eslint/explicit-member-accessibility': 0,
        '@typescript-eslint/indent': 0,
        '@typescript-eslint/member-delimiter-style': 0,
        '@typescript-eslint/no-empty-interface': 1,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-object-literal-type-assertion': 0,
        '@typescript-eslint/no-use-before-define': 0,
        // '@typescript-eslint/no-use-before-define': ['error', {functions: false, typedefs: false}],
        // "@typescript-eslint/no-object-literal-type-assertion": [1, { // "definition for rule not found"
        //   "allowAsParameter": true
        // }],
        '@typescript-eslint/explicit-function-return-type': [
          0,
          {allowExpressions: true, allowTypedFunctionExpressions: true},
        ],
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-angle-bracket-type-assertion': 0,
        '@typescript-eslint/prefer-interface': 0,
        '@typescript-eslint/no-namespace': [0, {allowDeclarations: true}],
        '@typescript-eslint/no-unused-vars': [
          1,
          {varsIgnorePattern: '^_', argsIgnorePattern: '^_', ignoreRestSiblings: true},
        ],
        '@typescript-eslint/triple-slash-reference': 1,
        '@typescript-eslint/no-triple-slash-reference': 0,
      },
      settings: {
        ...commonSettings,
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
      },
    },
  ],
}
