export const productoDocs = {
  paths: {
    "/api/v1/productos": {
      get: {
        tags: ["Productos"],
        summary: "Obtener todos los productos",
        responses: {
          200: {
            description: "Productos obtenidos correctamente",
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
                          descripcion: { type: "string", nullable: true },
                          activo: { type: "boolean" },
                          imagen: { type: "string", nullable: true },
                          coleccionId: { type: "number" },
                          tallas: { type: "array", items: { type: "string" } },
                          colores: { type: "array", items: { type: "string" } },
                          mermaCantidad: { type: "number", nullable: true },
                          mermaUnidad: { type: "string", nullable: true },
                          mermaPrecio: { type: "number", nullable: true },
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
        tags: ["Productos"],
        summary: "Crear un producto",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateProductoDto" },
              example: {
                codigo: 1001,
                nombre: "Polera Oversize",
                descripcion: "Polera algodón 240g",
                activo: true,
                imagen: "https://example.com/polera.jpg",
                coleccionId: 1,
                tallas: ["S", "M", "L"],
                colores: ["Negro", "Blanco"],
                wasteMaterial: 0.15,
                wasteUnit: "metros",
                wastePrice: 50.0,
              },
            },
          },
        },
        responses: {
          201: {
            description: "Producto creado exitosamente",
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
                        descripcion: { type: "string", nullable: true },
                        activo: { type: "boolean" },
                        imagen: { type: "string", nullable: true },
                        coleccionId: { type: "number" },
                        tallas: { type: "array", items: { type: "string" } },
                        colores: { type: "array", items: { type: "string" } },
                        mermaCantidad: { type: "number", nullable: true },
                        mermaUnidad: { type: "string", nullable: true },
                        mermaPrecio: { type: "number", nullable: true },
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
            description: "Error de validación o duplicado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  statusCode: 400,
                  message: "Ya existe un producto con ese nombre",
                  errors: null,
                },
              },
            },
          },
          404: {
            description: "Producto no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  statusCode: 404,
                  message: "Producto no encontrado",
                },
              },
            },
          },
        },
      },
    },

    "/api/v1/productos/{id}": {
      get: {
        tags: ["Productos"],
        summary: "Obtener producto por ID",
        parameters: [{ $ref: "#/components/parameters/ProductoId" }],
        responses: {
          200: {
            description: "Producto obtenido correctamente",
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
                        descripcion: { type: "string", nullable: true },
                        activo: { type: "boolean" },
                        imagen: { type: "string", nullable: true },
                        coleccionId: { type: "number" },
                        tallas: { type: "array", items: { type: "string" } },
                        colores: { type: "array", items: { type: "string" } },
                        mermaCantidad: { type: "number", nullable: true },
                        mermaUnidad: { type: "string", nullable: true },
                        mermaPrecio: { type: "number", nullable: true },
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
            description: "Producto no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },

      put: {
        tags: ["Productos"],
        summary: "Actualizar un producto",
        parameters: [{ $ref: "#/components/parameters/ProductoId" }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProductoDto" },
            },
          },
        },
        responses: {
          200: {
            description: "Producto actualizado correctamente",
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
                        descripcion: { type: "string", nullable: true },
                        activo: { type: "boolean" },
                        imagen: { type: "string", nullable: true },
                        coleccionId: { type: "number" },
                        tallas: { type: "array", items: { type: "string" } },
                        colores: { type: "array", items: { type: "string" } },
                        mermaCantidad: { type: "number", nullable: true },
                        mermaUnidad: { type: "string", nullable: true },
                        mermaPrecio: { type: "number", nullable: true },
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
            description: "Producto no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },

      delete: {
        tags: ["Productos"],
        summary: "Eliminar un producto",
        parameters: [{ $ref: "#/components/parameters/ProductoId" }],
        responses: {
          204: { description: "Producto eliminado correctamente" },
          404: {
            description: "Producto no encontrado",
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
      CreateProductoDto: {
        type: "object",
        required: ["nombre", "codigo", "coleccionId"],
        properties: {
          codigo: { type: "number" },
          nombre: { type: "string" },
          descripcion: { type: "string", nullable: true },
          activo: { type: "boolean" },
          imagen: { type: "string", nullable: true },
          coleccionId: { type: "number" },
          tallas: { type: "array", items: { type: "string" } },
          colores: { type: "array", items: { type: "string" } },
          wasteMaterial: { type: "number" },
          wasteUnit: { type: "string" },
          wastePrice: { type: "number" },
        },
      },

      UpdateProductoDto: {
        type: "object",
        properties: {
          codigo: { type: "number" },
          nombre: { type: "string" },
          descripcion: { type: "string", nullable: true },
          activo: { type: "boolean" },
          imagen: { type: "string", nullable: true },
          coleccionId: { type: "number" },
          tallas: { type: "array", items: { type: "string" } },
          colores: { type: "array", items: { type: "string" } },
          wasteMaterial: { type: "number" },
          wasteUnit: { type: "string" },
          wastePrice: { type: "number" },
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
      ProductoId: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "number" },
        example: 1,
      },
    },
  },
};
