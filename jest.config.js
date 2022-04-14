module.exports = {
  modulePathIgnorePatterns: [
    '<rootDir>\\\\(?:build|dist_electron|node_modules)\\\\',
  ],
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testMatch: ['<rootDir>/tests/**/*.spec.[jt]s?(x)'],
};
