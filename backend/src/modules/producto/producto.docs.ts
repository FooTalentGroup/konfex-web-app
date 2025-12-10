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
                      items: { $ref: "#/components/schemas/ProductoWithRelations" },
                    },
                  },
                },
                example: {
                  success: true,
                  statusCode: 200,
                  message: "Productos obtenidos correctamente",
                  data: [
                    {
                      id: 1,
                      codigo: 1001,
                      nombre: "Polera Oversize",
                      descripcion: "Polera algodón 240g",
                      activo: true,
                      imagen: "https://ejemplo.com/polera-oversize.jpg",
                      tallas: ["S", "M", "L", "XL"],
                      colores: ["Negro", "Blanco", "Gris"],
                      coleccionId: 1,
                      mermaCantidad: 0.5,
                      mermaUnidad: "metros",
                      mermaPrecio: 2.5,
                      tarifaCosto: 15000,
                      tarifaHoras: 2.5,
                      precio: 45000,
                      createdAt: "2024-01-15T10:30:00Z",
                      updatedAt: "2024-01-15T10:30:00Z",
                      coleccion: {
                        id: 1,
                        codigo: 100,
                        nombre: "Colección Verano 2024",
                        imagen: "https://ejemplo.com/coleccion-verano.jpg",
                        icono: "https://ejemplo.com/icono-verano.svg",
                        createdAt: "2024-01-01T00:00:00Z",
                        updatedAt: "2024-01-01T00:00:00Z",
                      },
                      materiales: [
                        {
                          id: 1,
                          productoId: 1,
                          materialId: 1,
                          cantidad: 1.5,
                          material: {
                            id: 1,
                            nombre: "Tela Jersey Algodón",
                            url_imagen: "https://ejemplo.com/tela-jersey.jpg",
                            categoriaId: 1,
                            categoria: {
                              id: 1,
                              nombre: "Telas",
                              createdAt: "2024-01-01T00:00:00Z",
                              updatedAt: "2024-01-01T00:00:00Z",
                            },
                            unidadMedida: "metros",
                            ancho: 1.5,
                            peso: 240,
                            colores: ["Negro", "Blanco", "Gris"],
                            proveedor: "Textiles SA",
                            precio: 8500,
                            createdAt: "2024-01-01T00:00:00Z",
                            updatedAt: "2024-01-01T00:00:00Z",
                          },
                        },
                        {
                          id: 2,
                          productoId: 1,
                          materialId: 2,
                          cantidad: 0.3,
                          material: {
                            id: 2,
                            nombre: "Hilo Poliéster",
                            url_imagen: null,
                            categoriaId: 2,
                            categoria: {
                              id: 2,
                              nombre: "Insumos",
                              createdAt: "2024-01-01T00:00:00Z",
                              updatedAt: "2024-01-01T00:00:00Z",
                            },
                            unidadMedida: "metros",
                            ancho: null,
                            peso: null,
                            colores: ["Negro", "Blanco"],
                            proveedor: "Hilos del Sur",
                            precio: 150,
                            createdAt: "2024-01-01T00:00:00Z",
                            updatedAt: "2024-01-01T00:00:00Z",
                          },
                        },
                      ],
                      pedidos: [],
                      presupuestoDetalles: [],
                    },
                  ],
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
                tarifaCosto: 15000,
                tarifaHoras: 2.5,
                precio: 45000,
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
                    data: { $ref: "#/components/schemas/ProductoWithRelations" },
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
                    data: { $ref: "#/components/schemas/ProductoWithRelations" },
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
                    data: { $ref: "#/components/schemas/ProductoWithRelations" },
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
      // ========== Schemas de Relaciones ==========

      Categoria: {
        type: "object",
        properties: {
          id: { type: "number", description: "ID de la categoría" },
          nombre: { type: "string", description: "Nombre de la categoría" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      Material: {
        type: "object",
        properties: {
          id: { type: "number", description: "ID del material" },
          nombre: { type: "string", description: "Nombre del material" },
          url_imagen: {
            type: "string",
            nullable: true,
            description: "URL de la imagen del material",
          },
          categoriaId: { type: "number", description: "ID de la categoría" },
          categoria: { $ref: "#/components/schemas/Categoria" },
          unidadMedida: { type: "string", description: "Unidad de medida (metros, kg, etc.)" },
          ancho: { type: "number", nullable: true, description: "Ancho del material" },
          peso: { type: "number", nullable: true, description: "Peso del material" },
          colores: { type: "array", items: { type: "string" }, description: "Colores disponibles" },
          proveedor: { type: "string", description: "Nombre del proveedor" },
          precio: { type: "number", description: "Precio del material" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      MaterialPorProducto: {
        type: "object",
        description: "Relación entre producto y material con cantidad requerida",
        properties: {
          id: { type: "number", description: "ID de la relación" },
          productoId: { type: "number", description: "ID del producto" },
          materialId: { type: "number", description: "ID del material" },
          cantidad: { type: "number", description: "Cantidad de material requerida" },
          material: { $ref: "#/components/schemas/Material" },
        },
      },

      ColeccionBasic: {
        type: "object",
        description: "Información básica de la colección",
        properties: {
          id: { type: "number", description: "ID de la colección" },
          codigo: { type: "number", description: "Código de la colección" },
          nombre: { type: "string", description: "Nombre de la colección" },
          imagen: { type: "string", nullable: true, description: "URL de la imagen" },
          icono: { type: "string", nullable: true, description: "URL del icono" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      PedidoDetalleBasic: {
        type: "object",
        description: "Detalle de pedido asociado al producto",
        properties: {
          id: { type: "number" },
          pedidoId: { type: "number" },
          productoId: { type: "number" },
          cantidad: { type: "number" },
          talle: { type: "string", nullable: true },
          color: { type: "string", nullable: true },
          costoUnitario: { type: "number" },
          precioUnitario: { type: "number" },
          subtotal: { type: "number" },
        },
      },

      PresupuestoDetalleBasic: {
        type: "object",
        description: "Detalle de presupuesto asociado al producto",
        properties: {
          id: { type: "number" },
          presupuestoId: { type: "number" },
          productoId: { type: "number" },
          descripcion: { type: "string", nullable: true },
          cantidad: { type: "number" },
          costoUnitario: { type: "number" },
        },
      },

      ProductoWithRelations: {
        type: "object",
        description: "Producto con todas sus relaciones",
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
          tarifaCosto: { type: "number", nullable: true },
          tarifaHoras: { type: "number", nullable: true },
          precio: { type: "number", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },

          // Relaciones
          coleccion: {
            $ref: "#/components/schemas/ColeccionBasic",
            description: "Colección a la que pertenece el producto",
          },
          materiales: {
            type: "array",
            description: "Materiales requeridos para fabricar el producto",
            items: { $ref: "#/components/schemas/MaterialPorProducto" },
          },
          pedidos: {
            type: "array",
            description: "Detalles de pedidos que incluyen este producto",
            items: { $ref: "#/components/schemas/PedidoDetalleBasic" },
          },
          presupuestoDetalles: {
            type: "array",
            description: "Detalles de presupuestos que incluyen este producto",
            items: { $ref: "#/components/schemas/PresupuestoDetalleBasic" },
          },
        },
      },

      // ========== Schemas de DTOs ==========

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
          tarifaCosto: {
            type: "number",
            nullable: true,
            description: "Tarifa de costo del producto",
          },
          tarifaHoras: {
            type: "number",
            nullable: true,
            description: "Tarifa de horas del producto",
          },
          precio: {
            type: "number",
            nullable: true,
            description: "Precio del producto",
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
          tarifaCosto: {
            type: "number",
            nullable: true,
            description: "Tarifa de costo del producto",
          },
          tarifaHoras: {
            type: "number",
            nullable: true,
            description: "Tarifa de horas del producto",
          },
          precio: {
            type: "number",
            nullable: true,
            description: "Precio del producto",
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
