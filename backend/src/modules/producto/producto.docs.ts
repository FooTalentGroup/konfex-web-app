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
                schema: { $ref: "#/components/schemas/SuccessResponseProductos" },
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
                nombre: "Polera Oversize",
                descripcion: "Polera algodón 240g",
                activo: true,
                tallas: ["S", "M", "L"],
                colores: ["Negro", "Blanco"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Producto creado exitosamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponseProducto" },
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
                schema: { $ref: "#/components/schemas/SuccessResponseProducto" },
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

      put: {
        tags: ["Productos"],
        summary: "Actualizar un producto",
        parameters: [{ $ref: "#/components/parameters/ProductoId" }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProductoDto" },
              example: {
                nombre: "Polera Oversize Premium",
                descripcion: "Nueva tela 260g",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Producto actualizado correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponseProducto" },
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
        required: ["nombre"],
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string", nullable: true },
          activo: { type: "boolean" },
          tallas: { type: "array", items: { type: "string" } },
          colores: { type: "array", items: { type: "string" } },
        },
      },

      UpdateProductoDto: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string", nullable: true },
          activo: { type: "boolean" },
          tallas: { type: "array", items: { type: "string" } },
          colores: { type: "array", items: { type: "string" } },
        },
      },

      Producto: {
        type: "object",
        properties: {
          id: { type: "number" },
          nombre: { type: "string" },
          descripcion: { type: "string", nullable: true },
          activo: { type: "boolean" },
          tallas: { type: "array", items: { type: "string" } },
          colores: { type: "array", items: { type: "string" } },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      SuccessResponseProducto: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          statusCode: { type: "number" },
          message: { type: "string" },
          data: { $ref: "#/components/schemas/Producto" },
        },
      },

      SuccessResponseProductos: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          statusCode: { type: "number" },
          message: { type: "string" },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Producto" },
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
