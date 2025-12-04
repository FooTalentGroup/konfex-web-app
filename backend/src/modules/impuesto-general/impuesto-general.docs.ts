export const impuestoGeneralDocs = {
  paths: {
    "/api/v1/impuesto-general": {
      get: {
        tags: ["Impuesto General"],
        summary: "Obtener todos los impuestos generales",
        responses: {
          200: {
            description: "Impuestos generales obtenidos correctamente",
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
        tags: ["Impuesto General"],
        summary: "Crear un impuesto general",
        description:
          "Solo puede haber un impuesto general activo. Si ya existe uno, use PUT para actualizarlo.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateImpuestoGeneralDto" },
              example: {
                nombre: "IVA",
                porcentaje: 19,
              },
            },
          },
        },
        responses: {
          201: {
            description: "Impuesto general creado exitosamente",
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
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
          },
          409: {
            description: "Ya existe un impuesto general",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  statusCode: 409,
                  message:
                    "Ya existe un impuesto general. Solo puede haber uno activo. Use PUT para actualizarlo.",
                  errors: null,
                },
              },
            },
          },
        },
      },
    },

    "/api/v1/impuesto-general/activo": {
      get: {
        tags: ["Impuesto General"],
        summary: "Obtener el impuesto general activo",
        description:
          "Retorna el impuesto general que está actualmente activo (el primero encontrado).",
        responses: {
          200: {
            description: "Impuesto general activo obtenido correctamente",
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
            description: "No hay impuesto general configurado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/api/v1/impuesto-general/{id}": {
      get: {
        tags: ["Impuesto General"],
        summary: "Obtener impuesto general por ID",
        parameters: [{ $ref: "#/components/parameters/ImpuestoGeneralId" }],
        responses: {
          200: {
            description: "Impuesto general obtenido correctamente",
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
            description: "Impuesto general no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },

      put: {
        tags: ["Impuesto General"],
        summary: "Actualizar un impuesto general",
        parameters: [{ $ref: "#/components/parameters/ImpuestoGeneralId" }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateImpuestoGeneralDto" },
              example: {
                nombre: "IVA Actualizado",
                porcentaje: 21,
              },
            },
          },
        },
        responses: {
          200: {
            description: "Impuesto general actualizado correctamente",
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
            description: "Impuesto general no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },

      delete: {
        tags: ["Impuesto General"],
        summary: "Eliminar un impuesto general",
        parameters: [{ $ref: "#/components/parameters/ImpuestoGeneralId" }],
        responses: {
          204: { description: "Impuesto general eliminado correctamente" },
          404: {
            description: "Impuesto general no encontrado",
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
      CreateImpuestoGeneralDto: {
        type: "object",
        required: ["nombre", "porcentaje"],
        properties: {
          nombre: { type: "string" },
          porcentaje: { type: "number" },
        },
      },

      UpdateImpuestoGeneralDto: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          porcentaje: { type: "number" },
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
      ImpuestoGeneralId: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "number" },
        example: 1,
      },
    },
  },
};
