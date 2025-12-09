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
                imagen: "https://ejemplo.com/polera-oversize.jpg",
                tallas: ["S", "M", "L"],
                colores: ["Negro", "Blanco"],
                coleccionId: 1,
                mermaCantidad: 0.5,
                mermaUnidad: "metros",
                mermaPrecio: 2.5,
                materiales: [
                  { materialId: 1, cantidad: 1.5 },
                  { materialId: 2, cantidad: 0.3 },
                ],
                manoDeObra: [{ accionId: 1, horas: 2.5 }],
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
        required: ["codigo", "nombre", "coleccionId"],
        properties: {
          codigo: {
            type: "number",
            description: "Código único del producto",
          },
          nombre: {
            type: "string",
            description: "Nombre del producto",
          },
          descripcion: {
            type: "string",
            nullable: true,
            description: "Descripción del producto",
          },
          activo: {
            type: "boolean",
            default: true,
            description: "Estado activo/inactivo del producto",
          },
          imagen: {
            type: "string",
            format: "uri",
            nullable: true,
            description: "URL de la imagen del producto",
          },
          tallas: {
            type: "array",
            items: { type: "string" },
            description: "Tallas disponibles del producto",
          },
          colores: {
            type: "array",
            items: { type: "string" },
            description: "Colores disponibles del producto",
          },
          coleccionId: {
            type: "number",
            description: "ID de la colección a la que pertenece el producto",
          },
          mermaCantidad: {
            type: "number",
            nullable: true,
            description: "Cantidad de merma del producto",
          },
          mermaUnidad: {
            type: "string",
            nullable: true,
            description: "Unidad de medida de la merma",
          },
          mermaPrecio: {
            type: "number",
            nullable: true,
            description: "Precio de la merma",
          },
          materiales: {
            type: "array",
            items: {
              type: "object",
              properties: {
                materialId: { type: "number" },
                cantidad: { type: "number", minimum: 0.0001 },
              },
            },
            description: "Materiales asociados al producto",
          },
          manoDeObra: {
            type: "array",
            items: {
              type: "object",
              properties: {
                accionId: { type: "number" },
                horas: { type: "number", minimum: 0.1 },
              },
            },
            description: "Mano de obra asociada al producto",
          },
        },
      },

      UpdateProductoDto: {
        type: "object",
        properties: {
          codigo: {
            type: "number",
            description: "Código único del producto",
          },
          nombre: {
            type: "string",
            description: "Nombre del producto",
          },
          descripcion: {
            type: "string",
            nullable: true,
            description: "Descripción del producto",
          },
          activo: {
            type: "boolean",
            description: "Estado activo/inactivo del producto",
          },
          imagen: {
            type: "string",
            format: "uri",
            nullable: true,
            description: "URL de la imagen del producto",
          },
          tallas: {
            type: "array",
            items: { type: "string" },
            description: "Tallas disponibles del producto",
          },
          colores: {
            type: "array",
            items: { type: "string" },
            description: "Colores disponibles del producto",
          },
          coleccionId: {
            type: "number",
            description: "ID de la colección a la que pertenece el producto",
          },
          mermaCantidad: {
            type: "number",
            nullable: true,
            description: "Cantidad de merma del producto",
          },
          mermaUnidad: {
            type: "string",
            nullable: true,
            description: "Unidad de medida de la merma",
          },
          mermaPrecio: {
            type: "number",
            nullable: true,
            description: "Precio de la merma",
          },
          materiales: {
            type: "array",
            items: {
              type: "object",
              properties: {
                materialId: { type: "number" },
                cantidad: { type: "number", minimum: 0.0001 },
              },
            },
            description: "Materiales asociados al producto",
          },
          manoDeObra: {
            type: "array",
            items: {
              type: "object",
              properties: {
                accionId: { type: "number" },
                horas: { type: "number", minimum: 0.1 },
              },
            },
            description: "Mano de obra asociada al producto",
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
