export const coleccionDocs = {
  paths: {
    "/api/v1/colecciones": {
      get: {
        tags: ["Colecciones"],
        summary: "Obtener todas las colecciones",
        description:
          "Retorna una lista de todas las colecciones disponibles con sus productos asociados",
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
                      items: { $ref: "#/components/schemas/Coleccion" },
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
        description: "Crea una nueva colección con los datos proporcionados",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateColeccionDto" },
              example: {
                nombre: "Colección Verano 2024",
                imagen: "https://ejemplo.com/imagen-coleccion.jpg",
                icono: "https://ejemplo.com/icono-coleccion.svg",
              },
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
                    data: { $ref: "#/components/schemas/Coleccion" },
                  },
                },
              },
            },
          },
          400: {
            description: "Error de validación o colección duplicada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  statusCode: 400,
                  message: "Ya existe una colección con ese nombre",
                  errors: null,
                },
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
        description: "Retorna una colección específica por su ID con sus productos asociados",
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
                    data: { $ref: "#/components/schemas/Coleccion" },
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
                example: {
                  success: false,
                  statusCode: 404,
                  message: "Colección no encontrada",
                },
              },
            },
          },
        },
      },

      put: {
        tags: ["Colecciones"],
        summary: "Actualizar una colección",
        description: "Actualiza los datos de una colección existente",
        parameters: [{ $ref: "#/components/parameters/ColeccionId" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateColeccionDto" },
              example: {
                nombre: "Colección Verano 2024 - Actualizada",
                imagen: "https://ejemplo.com/nueva-imagen.jpg",
              },
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
                    data: { $ref: "#/components/schemas/Coleccion" },
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
          400: {
            description: "Error de validación",
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
        description: "Elimina una colección existente por su ID",
        parameters: [{ $ref: "#/components/parameters/ColeccionId" }],
        responses: {
          200: {
            description: "Colección eliminada correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    statusCode: { type: "number" },
                    message: { type: "string" },
                    data: { type: "null" },
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
    },
  },

  components: {
    schemas: {
      Coleccion: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID único de la colección",
          },
          codigo: {
            type: "number",
            description: "Código único de la colección",
          },
          nombre: {
            type: "string",
            description: "Nombre de la colección",
          },
          imagen: {
            type: "string",
            nullable: true,
            description: "URL de la imagen de la colección",
          },
          icono: {
            type: "string",
            nullable: true,
            description: "URL del icono de la colección",
          },
          productos: {
            type: "array",
            description: "Productos asociados a esta colección",
            items: {
              type: "object",
              properties: {
                id: { type: "number" },
                codigo: { type: "number" },
                nombre: { type: "string" },
                descripcion: { type: "string", nullable: true },
                activo: { type: "boolean" },
                imagen: { type: "string", nullable: true },
                tallas: { type: "array", items: { type: "string" } },
                colores: { type: "array", items: { type: "string" } },
                coleccionId: { type: "number" },
                mermaCantidad: { type: "number", nullable: true },
                mermaUnidad: { type: "string", nullable: true },
                mermaPrecio: { type: "number", nullable: true },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
              },
            },
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Fecha de creación",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Fecha de última actualización",
          },
        },
      },

      CreateColeccionDto: {
        type: "object",
        required: ["nombre"],
        properties: {
          nombre: {
            type: "string",
            description: "Nombre de la colección (obligatorio y único)",
          },
          imagen: {
            type: "string",
            format: "uri",
            description: "URL de la imagen de la colección (opcional)",
          },
          icono: {
            type: "string",
            format: "uri",
            description: "URL del icono de la colección (opcional)",
          },
        },
      },

      UpdateColeccionDto: {
        type: "object",
        properties: {
          nombre: {
            type: "string",
            description: "Nombre de la colección",
          },
          imagen: {
            type: "string",
            format: "uri",
            description: "URL de la imagen de la colección",
          },
          icono: {
            type: "string",
            format: "uri",
            description: "URL del icono de la colección",
          },
        },
      },

      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            default: false,
          },
          statusCode: {
            type: "number",
          },
          message: {
            type: "string",
          },
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
      ColeccionId: {
        name: "id",
        in: "path",
        required: true,
        description: "ID de la colección",
        schema: { type: "number" },
        example: 1,
      },
    },
  },
};
