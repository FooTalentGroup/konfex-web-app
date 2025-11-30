import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { Express } from "express";
import { productoDocs } from "../modules/producto";
import { authDocs } from "../modules/auth";
import { materialDocs } from "../modules/material";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API - EOS - KONFEX",
      version: "1.0.0",
      description: "Documentación de la API"
    },

    components: {
      schemas: {
        ...productoDocs.components.schemas,
        ...authDocs.components.schemas,
        ...materialDocs.components.schemas
      },
      parameters: {
        ...productoDocs.components.parameters,
        ...authDocs.components.parameters,
        ...materialDocs.components.parameters
      }
    },

    paths: {
      ...productoDocs.paths,
      ...authDocs.paths,
      ...materialDocs.paths
    }
  },

  // NO vas a usar decoradores ni comentarios → vacío
  apis: []
};

const spec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(spec));
}
