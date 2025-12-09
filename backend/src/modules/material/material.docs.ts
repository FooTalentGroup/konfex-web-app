// Documentación del módulo de materiales
export const materialDocs = {
  paths: {
    "/api/v1/materiales": {
      get: {
        tags: ["Materiales"],
        summary: "Obtener todos los materiales",
        description:
          "Obtiene una lista paginada de materiales con opciones de filtrado, búsqueda y ordenamiento.",
        parameters: [
          {
            name: "color",
            in: "query",
            description: "Filtrar por color disponible",
            required: false,
            schema: { type: "string" },
            example: "Azul",
          },
          {
            name: "precioMin",
            in: "query",
            description: "Precio mínimo",
            required: false,
            schema: { type: "number", format: "float" },
            example: 100,
          },
          {
            name: "precioMax",
            in: "query",
            description: "Precio máximo",
            required: false,
            schema: { type: "number", format: "float" },
            example: 500,
          },
          {
            name: "pesoMin",
            in: "query",
            description: "Peso mínimo (kg)",
            required: false,
            schema: { type: "number", format: "float" },
            example: 0.5,
          },
          {
            name: "pesoMax",
            in: "query",
            description: "Peso máximo (kg)",
            required: false,
            schema: { type: "number", format: "float" },
            example: 10,
          },
          {
            name: "anchoMin",
            in: "query",
            description: "Ancho mínimo (cm)",
            required: false,
            schema: { type: "number", format: "float" },
            example: 100,
          },
          {
            name: "anchoMax",
            in: "query",
            description: "Ancho máximo (cm)",
            required: false,
            schema: { type: "number", format: "float" },
            example: 200,
          },
          {
            name: "proveedor",
            in: "query",
            description: "Filtrar por proveedor",
            required: false,
            schema: { type: "string" },
            example: "Textil S.A.",
          },
          {
            name: "search",
            in: "query",
            description: "Búsqueda por nombre",
            required: false,
            schema: { type: "string" },
            example: "algodón",
          },
          {
            name: "page",
            in: "query",
            description: "Número de página",
            required: false,
            schema: { type: "integer", default: 1 },
            example: 1,
          },
          {
            name: "limit",
            in: "query",
            description: "Cantidad de resultados por página",
            required: false,
            schema: { type: "integer", default: 10 },
            example: 10,
          },
          {
            name: "sortBy",
            in: "query",
            description: "Campo por el cual ordenar",
            required: false,
            schema: {
              type: "string",
              enum: ["nombre", "precio", "peso", "ancho", "createdAt"],
            },
            example: "precio",
          },
          {
            name: "sortOrder",
            in: "query",
            description: "Orden de clasificación",
            required: false,
            schema: {
              type: "string",
              enum: ["asc", "desc"],
              default: "desc",
            },
            example: "asc",
          },
        ],
        responses: {
          200: {
            description: "Materiales obtenidos correctamente",
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
                        data: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "number" },
                              nombre: { type: "string" },
                              url_imagen: { type: "string", nullable: true },
                              categoriaId: { type: "number" },
                              categoria: {
                                type: "object",
                                properties: {
                                  id: { type: "number" },
                                  nombre: { type: "string" },
                                  createdAt: { type: "string", format: "date-time" },
                                  updatedAt: { type: "string", format: "date-time" },
                                },
                              },
                              unidadMedida: { type: "string" },
                              ancho: { type: "number", nullable: true },
                              peso: { type: "number", nullable: true },
                              colores: { type: "array", items: { type: "string" } },
                              proveedor: { type: "string" },
                              precio: { type: "number" },
                              createdAt: { type: "string", format: "date-time" },
                              updatedAt: { type: "string", format: "date-time" }
                            }
                          }
                        },
                        pagination: {
                          type: "object",
                          properties: {
                            page: { type: "number" },
                            limit: { type: "number" },
                            total: { type: "number" },
                            totalPages: { type: "number" }
                          }
                        }
                      }
                    }
                  }
                }
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

      post: {
        tags: ["Materiales"],
        summary: "Crear un material",
        description: "Crea un nuevo material en el inventario.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateMaterialDto" },
              example: {
                nombre: "Algodón Premium 240g",
                url_imagen: "https://example.com/images/algodon-premium.jpg",
                categoriaId: 1,
                unidadMedida: "metros",
                ancho: 150,
                peso: 2.5,
                colores: ["Blanco", "Negro", "Azul", "Rojo"],
                proveedor: "Textil S.A.",
                precio: 350.5,
              },
            },
          },
        },
        responses: {
          201: {
            description: "Material creado exitosamente",
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
                        url_imagen: { type: "string", nullable: true },
                        categoria: { type: "string" },
                        unidadMedida: { type: "string" },
                        ancho: { type: "number", nullable: true },
                        peso: { type: "number", nullable: true },
                        colores: { type: "array", items: { type: "string" } },
                        proveedor: { type: "string" },
                        precio: { type: "number" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                      }
                    }
                  }
                }
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
                  errors: ["El nombre es obligatorio", "Debe tener al menos un color"],
                },
              },
            },
          },
        },
      },
    },

    "/api/v1/materiales/{id}": {
      get: {
        tags: ["Materiales"],
        summary: "Obtener material por ID",
        description: "Obtiene los detalles de un material específico por su ID.",
        parameters: [{ $ref: "#/components/parameters/MaterialId" }],
        responses: {
          200: {
            description: "Material obtenido correctamente",
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
                        url_imagen: { type: "string", nullable: true },
                        categoria: { type: "string" },
                        unidadMedida: { type: "string" },
                        ancho: { type: "number", nullable: true },
                        peso: { type: "number", nullable: true },
                        colores: { type: "array", items: { type: "string" } },
                        proveedor: { type: "string" },
                        precio: { type: "number" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                      }
                    }
                  }
                }
              },
            },
          },
          404: {
            description: "Material no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  statusCode: 404,
                  message: "Material no encontrado",
                },
              },
            },
          },
        },
      },

      put: {
        tags: ["Materiales"],
        summary: "Actualizar un material",
        description:
          "Actualiza los datos de un material existente. Todos los campos son opcionales.",
        parameters: [{ $ref: "#/components/parameters/MaterialId" }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateMaterialDto" },
              example: {
                precio: 380.0,
                colores: ["Blanco", "Negro", "Azul", "Rojo", "Verde"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Material actualizado correctamente",
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
                        url_imagen: { type: "string", nullable: true },
                        categoria: { type: "string" },
                        unidadMedida: { type: "string" },
                        ancho: { type: "number", nullable: true },
                        peso: { type: "number", nullable: true },
                        colores: { type: "array", items: { type: "string" } },
                        proveedor: { type: "string" },
                        precio: { type: "number" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                      }
                    }
                  }
                }
              },
            },
          },
          404: {
            description: "Material no encontrado",
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
        tags: ["Materiales"],
        summary: "Eliminar un material",
        description: "Elimina un material del inventario. Esta acción no se puede deshacer.",
        parameters: [{ $ref: "#/components/parameters/MaterialId" }],
        responses: {
          204: {
            description: "Material eliminado correctamente",
          },
          404: {
            description: "Material no encontrado",
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
      CreateMaterialDto: {
        type: "object",
        required: [
          "nombre",
          "categoriaId",
          "unidadMedida",
          "colores",
          "proveedor",
          "precio",
        ],
        properties: {
          nombre: {
            type: "string",
            minLength: 1,
            maxLength: 255,
            description: "Nombre del material",
            example: "Algodón Premium 240g",
          },
          url_imagen: {
            type: "string",
            nullable: true,
            description: "URL de la imagen del material",
            example: "https://example.com/images/algodon-premium.jpg",
          },
          categoriaId: {
            type: "integer",
            minimum: 1,
            description: "ID de la categoría del material",
            example: 1,
          },
          unidadMedida: {
            type: "string",
            minLength: 1,
            description:
              "Unidad de medida del material (metros, unidades, paquetes, kg, etc.)",
            example: "metros",
          },
          ancho: {
            type: "number",
            format: "float",
            minimum: 0,
            nullable: true,
            description:
              "Ancho del material en centímetros (opcional, solo para telas)",
            example: 150,
          },
          peso: {
            type: "number",
            format: "float",
            minimum: 0,
            nullable: true,
            description: "Peso del material en kilogramos (opcional)",
            example: 2.5,
          },
          colores: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
            description: "Lista de colores disponibles",
            example: ["Blanco", "Negro", "Azul"],
          },
          proveedor: {
            type: "string",
            minLength: 1,
            description: "Nombre del proveedor",
            example: "Textil S.A.",
          },
          precio: {
            type: "number",
            format: "float",
            minimum: 0,
            description: "Precio por unidad de medida",
            example: 350.5,
          },
        },
      },

      UpdateMaterialDto: {
        type: "object",
        properties: {
          nombre: {
            type: "string",
            minLength: 1,
            maxLength: 255,
            description: "Nombre del material",
          },
          url_imagen: {
            type: "string",
            nullable: true,
            description: "URL de la imagen del material",
          },
          categoria: {
            type: "string",
            minLength: 1,
            description: "Categoría del material",
          },
          unidadMedida: {
            type: "string",
            minLength: 1,
            description:
              "Unidad de medida del material (metros, unidades, paquetes, kg, etc.)",
          },
          ancho: {
            type: "number",
            format: "float",
            minimum: 0,
            nullable: true,
            description:
              "Ancho del material en centímetros (opcional, solo para telas)",
          },
          peso: {
            type: "number",
            format: "float",
            minimum: 0,
            nullable: true,
            description: "Peso del material en kilogramos (opcional)",
          },
          colores: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
            description: "Lista de colores disponibles",
          },
          proveedor: {
            type: "string",
            minLength: 1,
            description: "Nombre del proveedor",
          },
          precio: {
            type: "number",
            format: "float",
            minimum: 0,
            description: "Precio unitario del material",
          },
        },
      },

      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            default: false,
            example: false,
          },
          statusCode: {
            type: "number",
            example: 400,
          },
          message: {
            type: "string",
            example: "Error de validación",
          },
          errors: {
            oneOf: [
              { type: "array", items: { type: "string" } },
              { type: "object" },
              { type: "null" },
            ],
            example: ["El nombre es obligatorio", "Debe tener al menos un color"],
          },
        },
      },
    },

    parameters: {
      MaterialId: {
        name: "id",
        in: "path",
        required: true,
        description: "ID del material",
        schema: {
          type: "number",
        },
        example: 1,
      },
    },
  },
};
