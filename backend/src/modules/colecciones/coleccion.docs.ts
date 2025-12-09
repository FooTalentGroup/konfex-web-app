export const coleccionDocs = {
  paths: {
    "/api/v1/colecciones": {
      get: {
        tags: ["Colecciones"],
        summary: "Obtener todas las colecciones",
        responses: {
          200: {
            description: "Colecciones obtenidas correctamente",
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
                          codigo: { type: "number" },
                          nombre: { type: "string" },
                          imagen: { type: "string", nullable: true },
                          icono: { type: "string", nullable: true },
                          createdAt: { type: "string", format: "date-time" },
                          updatedAt: { type: "string", format: "date-time" },
                          productos: {
                            type: "array",
                            items: { type: "object" }, // Idealmente referenciaría a Producto, pero por simpleza object
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
      },

      post: {
        tags: ["Colecciones"],
        summary: "Crear una colección",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateColeccionDto" },
            },
          },
        },
        responses: {
          201: {
            description: "Colección creada exitosamente",
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
                        codigo: { type: "number" },
                        nombre: { type: "string" },
                        imagen: { type: "string", nullable: true },
                        icono: { type: "string", nullable: true },
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
              },
            },
          },
          409: {
            description: "Conflicto (ej: nombre duplicado)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/api/v1/colecciones/{id}": {
      get: {
        tags: ["Colecciones"],
        summary: "Obtener colección por ID",
        parameters: [{ $ref: "#/components/parameters/ColeccionId" }],
        responses: {
          200: {
            description: "Colección obtenida correctamente",
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
                        codigo: { type: "number" },
                        nombre: { type: "string" },
                        imagen: { type: "string", nullable: true },
                        icono: { type: "string", nullable: true },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                        productos: {
                          type: "array",
                          items: { type: "object" }, // Simplificado, idealmente referenciaría a Producto
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Colección no encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },

      put: {
        tags: ["Colecciones"],
        summary: "Actualizar una colección",
        parameters: [{ $ref: "#/components/parameters/ColeccionId" }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateColeccionDto" },
            },
          },
        },
        responses: {
          200: {
            description: "Colección actualizada correctamente",
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
                        codigo: { type: "number" },
                        nombre: { type: "string" },
                        imagen: { type: "string", nullable: true },
                        icono: { type: "string", nullable: true },
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
            description: "Colección no encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          409: {
            description: "Conflicto (ej: nombre duplicado)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },

      delete: {
        tags: ["Colecciones"],
        summary: "Eliminar una colección",
        parameters: [{ $ref: "#/components/parameters/ColeccionId" }],
        responses: {
          204: { description: "Colección eliminada correctamente" },
          404: {
            description: "Colección no encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          409: {
            description: "No se puede eliminar porque tiene productos asociados",
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
      CreateColeccionDto: {
        type: "object",
        required: ["nombre"],
        properties: {
          nombre: { type: "string" },
          imagen: { type: "string", nullable: true },
          icono: { type: "string", nullable: true },
        },
      },

      UpdateColeccionDto: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          imagen: { type: "string", nullable: true },
          icono: { type: "string", nullable: true },
        },
      },
    },

    parameters: {
      ColeccionId: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "number" },
        example: 1,
      },
    },
  },
};
