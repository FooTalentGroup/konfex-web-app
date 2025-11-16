module.exports = {
  // Evita que ESLint busque configuraciones en carpetas superiores
  root: true,

  // Define el entorno donde corre tu código
  env: {
    node: true,      // habilita variables globales de Node.js
    es2022: true,    // habilita sintaxis moderna (top-level await, etc)
  },

  // Parser para entender TypeScript
  parser: "@typescript-eslint/parser",

  parserOptions: {
    project: "./tsconfig.json", // necesario para reglas “type-aware”
    sourceType: "module",       // permite usar import/export
  },

  // Plugins adicionales para mejorar linting
  plugins: [
    "@typescript-eslint",   // reglas específicas para TS
    "simple-import-sort",   // ordena imports automáticamente
    "import",               // valida orden y uso de imports
  ],

  // Conjuntos de reglas preconfiguradas
  extends: [
    "eslint:recommended",                                   // reglas base
    "plugin:@typescript-eslint/recommended",                // buenas prácticas TS
    "plugin:@typescript-eslint/recommended-requiring-type-checking", // chequeo más profundo
    "plugin:import/recommended",                            // validaciones de imports
    "plugin:import/typescript",                             // mejor soporte para TS
    "prettier",                                             // desactiva reglas que chocan con Prettier
  ],

  rules: {
    // ---------------------------------------
    // GENERALES
    // ---------------------------------------

    "no-console": "warn",             // permitir console.log pero avisar
    "curly": ["error", "all"],        // obliga a usar llaves en bloques
    "eqeqeq": ["error", "always"],    // previene comparaciones peligrosas

    // ---------------------------------------
    // TYPESCRIPT
    // ---------------------------------------

    // Marca variables no usadas (ignora parámetros que empiezan con _)
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_" }
    ],

    // Obliga a usar “import type {...}” para tipos
    "@typescript-eslint/consistent-type-imports": "error",

    // Regla demasiado molesta en Express, se apaga.
    "@typescript-eslint/explicit-function-return-type": "off",

    // Muy importantes en backend asíncrono
    "@typescript-eslint/no-misused-promises": "error",    // evita usar async en sitios incorrectos
    "@typescript-eslint/no-floating-promises": "error",    // promesas sin await/then

    "@typescript-eslint/no-explicit-any": "warn",         // avisa pero no rompe el build

    /**
     * Estas reglas vienen ACTIVADAS por defecto debido al preset:
     * `@typescript-eslint/recommended-requiring-type-checking`
     *
     * Prisma y Zod producen falsos positivos constantemente,
     * por lo que deben desactivarse explícitamente.
     */
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",

    // ---------------------------------------
    // IMPORTS
    // ---------------------------------------

    // TypeScript ya valida imports sin resolver → no es necesario
    "import/no-unresolved": "off",

    // En backend es común usar export default (routers, controllers)
    "import/no-default-export": "off",

    // No exigir extensión .ts en imports
    "import/extensions": ["error", "ignorePackages", { ts: "never" }],

    // Orden automático de imports y exports
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",

    // ---------------------------------------
    // LIMPIEZA
    // ---------------------------------------

    // Evita archivos con espacio visual innecesario
    "no-multiple-empty-lines": ["error", { max: 1 }],
  },

  // Reglas específicas para tests
  overrides: [
    {
      files: ["*.test.ts", "**/__tests__/**"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off", // los tests suelen usar any
        "no-console": "off",                         // consola permitida en tests
      },
    },
  ],
};
