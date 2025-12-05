export const categoriaDocs = {
  paths: {
    "/api/v1/categorias": {
      get: {
        tags: ["Categorías"],
        summary: "Obtener todas las categorías",
        description: "Retorna una lista de todas las categorías ordenadas por nombre",
        responses: {
          200: {
            description: "Categorías obtenidas correctamente",
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
                        $ref: "#/components/schemas/Categoria",
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
        tags: ["Categorías"],
        summary: "Crear una categoría",
        description: "Crea una nueva categoría. El nombre debe ser único.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCategoriaDto" },
              example: {
                nombre: "Tela",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Categoría creada exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    statusCode: { type: "number" },
                    message: { type: "string" },
                    data: {
                      $ref: "#/components/schemas/Categoria",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Error de validación o categoría ya existente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  statusCode: 400,
                  message: 'Ya existe una categoría con el nombre "Tela"',
                  errors: null,
                },
              },
            },
          },
        },
      },
    },

    "/api/v1/categorias/{id}": {
      get: {
        tags: ["Categorías"],
        summary: "Obtener categoría por ID",
        description: "Retorna los detalles de una categoría específica",
        parameters: [{ $ref: "#/components/parameters/CategoriaId" }],
        responses: {
          200: {
            description: "Categoría obtenida correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    statusCode: { type: "number" },
                    message: { type: "string" },
                    data: {
                      $ref: "#/components/schemas/Categoria",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Categoría no encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  statusCode: 404,
                  message: "Categoría no encontrada",
                },
              },
            },
          },
        },
      },

      put: {
        tags: ["Categorías"],
        summary: "Actualizar una categoría",
        description:
          "Actualiza los datos de una categoría existente. El nombre debe ser único si se modifica.",
        parameters: [{ $ref: "#/components/parameters/CategoriaId" }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateCategoriaDto" },
              example: {
                nombre: "Tela Premium",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Categoría actualizada correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    statusCode: { type: "number" },
                    message: { type: "string" },
                    data: {
                      $ref: "#/components/schemas/Categoria",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Error de validación o nombre duplicado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Categoría no encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },

      delete: {
        tags: ["Categorías"],
        summary: "Eliminar una categoría",
        description: "Elimina una categoría. No se puede eliminar si tiene materiales asociados.",
        parameters: [{ $ref: "#/components/parameters/CategoriaId" }],
        responses: {
          204: { description: "Categoría eliminada correctamente" },
          400: {
            description: "No se puede eliminar porque tiene materiales asociados",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  statusCode: 400,
                  message:
                    "No se puede eliminar la categoría porque tiene 5 material(es) asociado(s)",
                },
              },
            },
          },
          404: {
            description: "Categoría no encontrada",
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
      Categoria: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          nombre: { type: "string", example: "Tela" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["id", "nombre", "createdAt", "updatedAt"],
      },

      CreateCategoriaDto: {
        type: "object",
        required: ["nombre"],
        properties: {
          nombre: {
            type: "string",
            minLength: 1,
            maxLength: 255,
            example: "Tela",
            description: "Nombre único de la categoría",
          },
        },
      },

      UpdateCategoriaDto: {
        type: "object",
        properties: {
          nombre: {
            type: "string",
            minLength: 1,
            maxLength: 255,
            example: "Tela Premium",
            description: "Nombre único de la categoría",
          },
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
      CategoriaId: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "number" },
        description: "ID de la categoría",
        example: 1,
      },
    },
  },
};
