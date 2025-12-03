export const gastosNegocioDocs = {
  paths: {
    "/api/v1/gastos-negocio": {
      get: {
        tags: ["Gastos de Negocio"],
        summary: "Obtener todos los gastos de negocio",
        responses: {
          200: {
            description: "Gastos de negocio obtenidos correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    statusCode: { type: "number" },
                    message: { type: "string" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "number" },
                          nombre: { type: "string" },
                          porcentaje: { type: "number" },
                          impuestos: { type: "number" },
                          createdAt: { type: "string", format: "date-time" },
                          updatedAt: { type: "string", format: "date-time" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      post: {
        tags: ["Gastos de Negocio"],
        summary: "Crear un gasto de negocio",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateGastosNegocioDto" },
              example: {
                nombre: "Gastos Generales",
                porcentaje: 15,
                impuestos: 19,
              },
            },
          },
        },
        responses: {
          201: {
            description: "Gastos de negocio creados exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    statusCode: { type: "number" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        nombre: { type: "string" },
                        porcentaje: { type: "number" },
                        impuestos: { type: "number" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Error de validación",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  statusCode: 400,
                  message: "Error de validación",
                  errors: null,
                },
              },
            },
          },
        },
      },
    },

    "/api/v1/gastos-negocio/{id}": {
      get: {
        tags: ["Gastos de Negocio"],
        summary: "Obtener gasto de negocio por ID",
        parameters: [{ $ref: "#/components/parameters/GastosNegocioId" }],
        responses: {
          200: {
            description: "Gastos de negocio obtenidos correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    statusCode: { type: "number" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        nombre: { type: "string" },
                        porcentaje: { type: "number" },
                        impuestos: { type: "number" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Gastos de negocio no encontrados",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  statusCode: 404,
                  message: "Gastos de negocio no encontrados",
                },
              },
            },
          },
        },
      },

      put: {
        tags: ["Gastos de Negocio"],
        summary: "Actualizar un gasto de negocio",
        parameters: [{ $ref: "#/components/parameters/GastosNegocioId" }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateGastosNegocioDto" },
              example: {
                nombre: "Gastos Generales Actualizados",
                porcentaje: 18,
              },
            },
          },
        },
        responses: {
          200: {
            description: "Gastos de negocio actualizados correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    statusCode: { type: "number" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        nombre: { type: "string" },
                        porcentaje: { type: "number" },
                        impuestos: { type: "number" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Gastos de negocio no encontrados",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },

      delete: {
        tags: ["Gastos de Negocio"],
        summary: "Eliminar un gasto de negocio",
        parameters: [{ $ref: "#/components/parameters/GastosNegocioId" }],
        responses: {
          204: { description: "Gastos de negocio eliminados correctamente" },
          404: {
            description: "Gastos de negocio no encontrados",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },

  components: {
    schemas: {
      CreateGastosNegocioDto: {
        type: "object",
        required: ["nombre", "porcentaje", "impuestos"],
        properties: {
          nombre: { type: "string" },
          porcentaje: { type: "number" },
          impuestos: { type: "number" },
        },
      },

      UpdateGastosNegocioDto: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          porcentaje: { type: "number" },
          impuestos: { type: "number" },
        },
      },

      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", default: false },
          statusCode: { type: "number" },
          message: { type: "string" },
          errors: {
            oneOf: [
              { type: "array", items: { type: "string" } },
              { type: "object" },
              { type: "null" },
            ],
          },
        },
      },
    },

    parameters: {
      GastosNegocioId: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "number" },
        example: 1,
      },
    },
  },
};

