export const productoDocs = {
  paths: {
    "/api/v1/productos": {
      get: {
        tags: ["Productos"],
        summary: "Obtener todos los productos",
        description: "Retorna la lista completa de productos con sus materiales asociados",
        responses: {
          200: {
            description: "Productos obtenidos correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    statusCode: { type: "number", example: 200 },
                    message: { type: "string", example: "Productos obtenidos correctamente" },
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/ProductoResponse",
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
        description: "Crea un nuevo producto con sus materiales asociados",
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
                precio: 25000,
                wasteMaterial: 0.15,
                wasteUnit: "metros",
                wastePrice: 50.0,
                tarifaCosto: 7500,
                tarifaHoras: 1.5,
                materiales: [
                  { materialId: 1, cantidad: 1.5 },
                  { materialId: 4, cantidad: 0.2 },
                ],
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
                    success: { type: "boolean", example: true },
                    statusCode: { type: "number", example: 201 },
                    message: { type: "string", example: "Producto creado exitosamente" },
                    data: {
                      $ref: "#/components/schemas/ProductoResponse",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Error de validación o producto duplicado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  statusCode: 400,
                  message: "El producto ya existe",
                  errors: null,
                },
              },
            },
          },
          409: {
            description: "Conflicto - Producto ya existe",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  statusCode: 409,
                  message: "El producto ya existe",
                  errors: null,
                },
              },
            },
          },
        },
      },
    },

    "/api/v1/productos/search": {
      get: {
        tags: ["Productos"],
        summary: "Buscar productos",
        description: "Busca productos activos por nombre o descripción",
        parameters: [
          {
            name: "search",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Término de búsqueda (mínimo 2 caracteres)",
            example: "polera",
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "number", default: 10 },
            description: "Número máximo de resultados",
            example: 10,
          },
        ],
        responses: {
          200: {
            description: "Búsqueda de productos realizada correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    statusCode: { type: "number", example: 200 },
                    message: {
                      type: "string",
                      example: "Búsqueda de productos realizada correctamente",
                    },
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
                          precio: { type: "number", nullable: true },
                          mermaCantidad: { type: "number", nullable: true },
                          mermaUnidad: { type: "string", nullable: true },
                          mermaPrecio: { type: "number", nullable: true },
                          tarifaCosto: { type: "number", nullable: true },
                          tarifaHoras: { type: "number", nullable: true },
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
    },

    "/api/v1/productos/{id}": {
      get: {
        tags: ["Productos"],
        summary: "Obtener producto por ID",
        description: "Retorna un producto específico con sus materiales asociados",
        parameters: [{ $ref: "#/components/parameters/ProductoId" }],
        responses: {
          200: {
            description: "Producto obtenido correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    statusCode: { type: "number", example: 200 },
                    message: { type: "string", example: "Producto obtenido correctamente" },
                    data: {
                      $ref: "#/components/schemas/ProductoResponse",
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
                example: {
                  success: false,
                  statusCode: 404,
                  message: "Producto no encontrado",
                  errors: null,
                },
              },
            },
          },
        },
      },

      put: {
        tags: ["Productos"],
        summary: "Actualizar un producto",
        description:
          "Actualiza los datos de un producto existente. Todos los campos son opcionales.",
        parameters: [{ $ref: "#/components/parameters/ProductoId" }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProductoDto" },
              example: {
                nombre: "Polera Oversize Actualizada",
                precio: 28000,
                activo: true,
                tallas: ["S", "M", "L", "XL"],
              },
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
                    success: { type: "boolean", example: true },
                    statusCode: { type: "number", example: 200 },
                    message: { type: "string", example: "Producto actualizado correctamente" },
                    data: {
                      $ref: "#/components/schemas/ProductoResponse",
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
        description: "Elimina un producto del sistema",
        parameters: [{ $ref: "#/components/parameters/ProductoId" }],
        responses: {
          204: {
            description: "Producto eliminado correctamente",
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
                  errors: null,
                },
              },
            },
          },
        },
      },
    },
  },

  components: {
    schemas: {
      ProductoResponse: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          codigo: { type: "number", example: 1001 },
          nombre: { type: "string", example: "Polera Oversize" },
          descripcion: { type: "string", nullable: true, example: "Polera algodón 240g" },
          activo: { type: "boolean", example: true },
          imagen: { type: "string", nullable: true, example: "https://example.com/polera.jpg" },
          coleccionId: { type: "number", example: 1 },
          tallas: { type: "array", items: { type: "string" }, example: ["S", "M", "L"] },
          colores: { type: "array", items: { type: "string" }, example: ["Negro", "Blanco"] },
          precio: { type: "number", nullable: true, example: 25000 },
          mermaCantidad: { type: "number", nullable: true, example: 0.15 },
          mermaUnidad: { type: "string", nullable: true, example: "metros" },
          mermaPrecio: { type: "number", nullable: true, example: 50.0 },
          tarifaCosto: { type: "number", nullable: true, example: 7500 },
          tarifaHoras: { type: "number", nullable: true, example: 1.5 },
          materiales: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "number", example: 1 },
                productoId: { type: "number", example: 1 },
                materialId: { type: "number", example: 1 },
                cantidad: { type: "number", example: 1.5 },
                material: {
                  type: "object",
                  properties: {
                    id: { type: "number", example: 1 },
                    nombre: { type: "string", example: "Algodón Premium 240g" },
                    categoriaId: { type: "number", example: 1 },
                    unidadMedida: { type: "string", example: "metros" },
                    ancho: { type: "number", nullable: true, example: 150 },
                    peso: { type: "number", nullable: true, example: 2.5 },
                    colores: {
                      type: "array",
                      items: { type: "string" },
                      example: ["Blanco", "Negro"],
                    },
                    proveedor: { type: "string", example: "Textil S.A." },
                    precio: { type: "number", example: 350.5 },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      CreateProductoDto: {
        type: "object",
        required: ["nombre", "codigo", "coleccionId"],
        properties: {
          codigo: {
            type: "number",
            description: "Código único del producto",
            example: 1001,
          },
          nombre: {
            type: "string",
            description: "Nombre del producto",
            example: "Polera Oversize",
          },
          descripcion: {
            type: "string",
            nullable: true,
            description: "Descripción del producto",
            example: "Polera algodón 240g",
          },
          activo: {
            type: "boolean",
            default: true,
            description: "Estado del producto",
            example: true,
          },
          imagen: {
            type: "string",
            nullable: true,
            description: "URL de la imagen del producto",
            example: "https://example.com/polera.jpg",
          },
          coleccionId: {
            type: "number",
            description: "ID de la colección a la que pertenece",
            example: 1,
          },
          tallas: {
            type: "array",
            items: { type: "string" },
            default: [],
            description: "Tallas disponibles",
            example: ["S", "M", "L"],
          },
          colores: {
            type: "array",
            items: { type: "string" },
            default: [],
            description: "Colores disponibles",
            example: ["Negro", "Blanco"],
          },
          precio: {
            type: "number",
            nullable: true,
            description: "Precio de venta del producto",
            example: 25000,
          },
          wasteMaterial: {
            type: "number",
            nullable: true,
            description: "Cantidad de material de merma",
            example: 0.15,
          },
          wasteUnit: {
            type: "string",
            nullable: true,
            description: "Unidad de medida de la merma",
            example: "metros",
          },
          wastePrice: {
            type: "number",
            nullable: true,
            description: "Precio de la merma",
            example: 50.0,
          },
          tarifaCosto: {
            type: "number",
            nullable: true,
            description: "Tarifa de costo de producción",
            example: 7500,
          },
          tarifaHoras: {
            type: "number",
            nullable: true,
            description: "Horas de trabajo estimadas",
            example: 1.5,
          },
          materiales: {
            type: "array",
            items: {
              type: "object",
              required: ["materialId", "cantidad"],
              properties: {
                materialId: {
                  type: "number",
                  description: "ID del material",
                  example: 1,
                },
                cantidad: {
                  type: "number",
                  description: "Cantidad de material necesaria",
                  example: 1.5,
                },
              },
            },
            default: [],
            description: "Materiales necesarios para el producto",
          },
        },
      },

      UpdateProductoDto: {
        type: "object",
        description: "Todos los campos son opcionales para actualización parcial",
        properties: {
          codigo: {
            type: "number",
            description: "Código único del producto",
            example: 1001,
          },
          nombre: {
            type: "string",
            description: "Nombre del producto",
            example: "Polera Oversize",
          },
          descripcion: {
            type: "string",
            nullable: true,
            description: "Descripción del producto",
            example: "Polera algodón 240g",
          },
          activo: {
            type: "boolean",
            description: "Estado del producto",
            example: true,
          },
          imagen: {
            type: "string",
            nullable: true,
            description: "URL de la imagen del producto",
            example: "https://example.com/polera.jpg",
          },
          coleccionId: {
            type: "number",
            description: "ID de la colección a la que pertenece",
            example: 1,
          },
          tallas: {
            type: "array",
            items: { type: "string" },
            description: "Tallas disponibles",
            example: ["S", "M", "L", "XL"],
          },
          colores: {
            type: "array",
            items: { type: "string" },
            description: "Colores disponibles",
            example: ["Negro", "Blanco", "Gris"],
          },
          precio: {
            type: "number",
            nullable: true,
            description: "Precio de venta del producto",
            example: 28000,
          },
          wasteMaterial: {
            type: "number",
            nullable: true,
            description: "Cantidad de material de merma",
            example: 0.15,
          },
          wasteUnit: {
            type: "string",
            nullable: true,
            description: "Unidad de medida de la merma",
            example: "metros",
          },
          wastePrice: {
            type: "number",
            nullable: true,
            description: "Precio de la merma",
            example: 50.0,
          },
          tarifaCosto: {
            type: "number",
            nullable: true,
            description: "Tarifa de costo de producción",
            example: 7500,
          },
          tarifaHoras: {
            type: "number",
            nullable: true,
            description: "Horas de trabajo estimadas",
            example: 1.5,
          },
          materiales: {
            type: "array",
            items: {
              type: "object",
              properties: {
                materialId: {
                  type: "number",
                  description: "ID del material",
                  example: 1,
                },
                cantidad: {
                  type: "number",
                  description: "Cantidad de material necesaria",
                  example: 1.5,
                },
              },
            },
            description: "Materiales necesarios para el producto (reemplaza los existentes)",
          },
        },
      },

      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", default: false, example: false },
          statusCode: { type: "number", example: 400 },
          message: { type: "string", example: "Error message" },
          errors: {
            oneOf: [
              { type: "array", items: { type: "string" } },
              { type: "object" },
              { type: "null" },
            ],
            example: null,
          },
        },
      },
    },

    parameters: {
      ProductoId: {
        name: "id",
        in: "path",
        required: true,
        description: "ID único del producto",
        schema: { type: "number" },
        example: 1,
      },
    },
  },
};
