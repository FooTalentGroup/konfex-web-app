// jest.config.ts
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  clearMocks: true,
  verbose: true,
  moduleFileExtensions: ["ts", "js", "json"],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.jest.json",
    },
  },
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
    "@core/(.*)": "<rootDir>/src/core/$1",
    "@utils/(.*)": "<rootDir>/src/utils/$1",
    "@config/(.*)": "<rootDir>/src/config/$1",
    "@routes/(.*)": "<rootDir>/src/routes/$1",
    "@tests/(.*)": "<rootDir>/tests/$1",
  },
};

export default config;
