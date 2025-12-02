const { defineConfig, globalIgnores } = require("eslint/config");

const globals = require("globals");
const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const _import = require("eslint-plugin-import");

const { fixupPluginRules, fixupConfigRules } = require("@eslint/compat");

const js = require("@eslint/js");

const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  // Ignorar archivos y directorios
  globalIgnores([
    "**/node_modules",
    "**/dist",
    "prisma/migrations",
    "**/*.log",
    "**/coverage",
    "**/.env",
    "**/.env.local",
    "**/jest.config.ts",
    "prisma/seed.ts",
    "eslint.config.cjs",
  ]),

  // Configuraciones base usando compatibilidad
  ...fixupConfigRules(
    compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking",
      "plugin:import/recommended",
      "plugin:import/typescript",
      "prettier"
    )
  ),

  // Configuración principal
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
      },

      parser: tsParser,
      sourceType: "module",

      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },

    plugins: {
      "simple-import-sort": simpleImportSort,
      import: fixupPluginRules(_import),
    },

    rules: {
      "no-console": "warn",
      curly: ["error", "all"],
      eqeqeq: ["error", "always"],

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "import/no-unresolved": "off",
      "import/no-default-export": "off",

      // Desactivado: TypeScript ya valida imports y no requiere extensiones en path aliases
      "import/extensions": "off",
      "import/no-unresolved": [
        "error",
        {
          ignore: [
            "^@/",
            "^@modules/",
            "^@utils/",
            "^@config/",
            "^@routes/",
            "^@middleware/",
            "^@tests/",
          ],
        },
      ],

      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      "no-multiple-empty-lines": [
        "error",
        {
          max: 1,
        },
      ],
    },
  },

  // Configuración específica para tests
  {
    files: ["**/*.test.ts", "**/__tests__/**"],

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
    },
  },
]);
