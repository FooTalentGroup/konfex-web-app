import type { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { authDocs } from "../modules/auth";
import { materialDocs } from "../modules/material";
import { clienteDocs } from "@/modules/cliente/cliente.docs";
import { productoDocs } from "@/modules/producto";

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
        ...materialDocs.components.schemas,
        ...clienteDocs.components.schemas
      },
      parameters: {
        ...productoDocs.components.parameters,
        ...authDocs.components.parameters,
        ...materialDocs.components.parameters,
        ...clienteDocs.components.parameters
      }
    },

    paths: {
      ...productoDocs.paths,
      ...authDocs.paths,
      ...materialDocs.paths,
      ...clienteDocs.paths
    }
  },

  // NO vas a usar decoradores ni comentarios → vacío
  apis: [],
};

const spec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(spec));
}
