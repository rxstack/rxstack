/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  "bail": 1,
  "verbose": true,
  "testTimeout": 50000,
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  "collectCoverageFrom": [
    "packages/**/src/**/*.ts"
  ]
};
