import type { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { authDocs } from "../modules/auth";
import { categoriaDocs } from "../modules/categoria";
import { clienteDocs } from "../modules/cliente";
import { coleccionDocs } from "../modules/colecciones";
import { gastosNegocioDocs } from "../modules/gastos-negocio";
import { impuestoGeneralDocs } from "../modules/impuesto-general";
import { materialDocs } from "../modules/material";
import { pedidoDocs } from "../modules/pedido";
import { presupuestoDocs } from "../modules/presupuesto";
import { productoDocs } from "../modules/producto";
import { telegramDocs } from "../modules/telegram";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API - EOS - KONFEX",
      version: "1.0.0",
      description: "Documentación de la API",
    },

    components: {
      schemas: {
        ...productoDocs.components.schemas,
        ...authDocs.components.schemas,
        ...categoriaDocs.components.schemas,
        ...materialDocs.components.schemas,
        ...clienteDocs.components.schemas,
        ...presupuestoDocs.components.schemas,
        ...telegramDocs.components.schemas,
        ...gastosNegocioDocs.components.schemas,
        ...impuestoGeneralDocs.components.schemas,
        ...pedidoDocs.components.schemas,
        ...coleccionDocs.components.schemas,
      },
      parameters: {
        ...productoDocs.components.parameters,
        ...authDocs.components.parameters,
        ...categoriaDocs.components.parameters,
        ...materialDocs.components.parameters,
        ...clienteDocs.components.parameters,
        ...presupuestoDocs.components.parameters,
        ...telegramDocs.components.parameters,
        ...gastosNegocioDocs.components.parameters,
        ...impuestoGeneralDocs.components.parameters,
        ...pedidoDocs.components.parameters,
        ...coleccionDocs.components.parameters,
      },
    },

    paths: {
      ...productoDocs.paths,
      ...authDocs.paths,
      ...categoriaDocs.paths,
      ...materialDocs.paths,
      ...clienteDocs.paths,
      ...presupuestoDocs.paths,
      ...telegramDocs.paths,
      ...gastosNegocioDocs.paths,
      ...impuestoGeneralDocs.paths,
      ...pedidoDocs.paths,
      ...coleccionDocs.paths,
    },
  },

  // NO vas a usar decoradores ni comentarios → vacío
  apis: [],
};

const spec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(spec));
}
