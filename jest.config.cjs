/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [ "**/__tests__/**/*.[jt]s?(x)"],
  // collectCoverage: false,
  // coverageProvider: 'v8'
};