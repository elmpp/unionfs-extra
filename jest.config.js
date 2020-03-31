const {defaults: tsjPreset} = require('ts-jest/presets')

module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx', 'graphql'],
  transform: {
    ...tsjPreset.transform,
  },
  testMatch: ['**/__tests__/**/*.spec.ts?(x)', '**/__tests__/**/*.spec.js?(x)'],

  testPathIgnorePatterns: ['\\.(deletable.*?)$'],

  testEnvironment: 'node',

  verbose: true,
  globals: {
    ['ts-jest']: {
      tsConfig: '<rootDir>/tsconfig.jest.json',
    },
  },
}
