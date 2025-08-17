/** @type {import('jest').Config} */

export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/test"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],
  moduleNameMapper: {
    "^@adamjanicki/ui/(.*)$": "<rootDir>/src/$1",
    "^@adamjanicki/ui$": "<rootDir>/src/index.ts",
  },
};
