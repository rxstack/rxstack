/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  "bail": 1,
  "verbose": true,
  "testTimeout": 30000,
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  "collectCoverageFrom": [
    "src/packages/**/src/**/*.ts"
  ],
  "coveragePathIgnorePatterns": [
    "index.ts",
  ]
};
