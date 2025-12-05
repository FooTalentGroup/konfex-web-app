export const pedidoDocs = {
  paths: {
    "/api/v1/pedidos": {
      get: {
        tags: ["Pedidos"],
        summary: "Obtener todos los pedidos",
        description:
          "Retorna una lista de todos los pedidos con sus detalles, cliente, presupuesto asociado y chatId de Telegram.",
        responses: {
          200: {
            description: "Pedidos obtenidos correctamente",
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
                        $ref: "#/components/schemas/PedidoResponse",
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

    "/api/v1/pedidos/{id}": {
      get: {
        tags: ["Pedidos"],
        summary: "Obtener pedido por ID",
        description: "Obtiene los detalles de un pedido específico por su ID.",
        parameters: [{ $ref: "#/components/parameters/PedidoId" }],
        responses: {
          200: {
            description: "Pedido obtenido correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    statusCode: { type: "number" },
                    message: { type: "string" },
                    data: {
                      $ref: "#/components/schemas/PedidoResponse",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Pedido no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },

      patch: {
        tags: ["Pedidos"],
        summary: "Actualizar un pedido",
        description:
          "Actualiza los datos de un pedido existente. Todos los campos son opcionales.",
        parameters: [{ $ref: "#/components/parameters/PedidoId" }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePedidoDto" },
              example: {
                estado: "EN_PRODUCCION",
                pagado: true,
                fechaEntregaEstimada: "2024-12-31T00:00:00.000Z",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Pedido actualizado correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    statusCode: { type: "number" },
                    message: { type: "string" },
                    data: {
                      $ref: "#/components/schemas/PedidoResponse",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Pedido no encontrado",
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
    },
  },

  components: {
    schemas: {
      PedidoResponse: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          presupuestoId: { type: "number", example: 5 },
          clienteId: { type: "number", example: 2 },
          fechaCreacion: { type: "string", format: "date-time" },
          estado: {
            type: "string",
            enum: ["PENDIENTE", "EN_PRODUCCION", "LISTO", "ENTREGADO", "CANCELADO"],
            example: "PENDIENTE",
          },
          pagado: { type: "boolean", example: false },
          fechaEntregaEstimada: { type: "string", format: "date-time", nullable: true },
          fechaEntregaReal: { type: "string", format: "date-time", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          telegramChatId: { type: "string", nullable: true, example: "1585032016" },
          cliente: {
            type: "object",
            properties: {
              id: { type: "number" },
              nombre: { type: "string", example: "Ana Julieta" },
              telefono: { type: "string", nullable: true },
              email: { type: "string", nullable: true },
            },
          },
          presupuesto: {
            type: "object",
            properties: {
              id: { type: "number" },
              numeroPresupuesto: { type: "number", example: 1001 },
              nombre: { type: "string", example: "Blusa manga larga" },
              totalFinal: { type: "number", example: 15000.0 },
            },
          },
          detalles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "number" },
                productoId: { type: "number" },
                cantidad: { type: "number", example: 2 },
                talle: { type: "string", nullable: true },
                color: { type: "string", nullable: true },
                costoUnitario: { type: "number", example: 5000.0 },
                precioUnitario: { type: "number", example: 7500.0 },
                subtotal: { type: "number", example: 15000.0 },
                producto: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    nombre: { type: "string", example: "Blusa manga larga" },
                    codigo: { type: "number", example: 101 },
                  },
                },
              },
            },
          },
          etapas: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "number" },
                etapa: { type: "string", example: "Corte" },
                fechaInicio: { type: "string", format: "date-time" },
                fechaFin: { type: "string", format: "date-time", nullable: true },
                responsable: { type: "string", nullable: true },
              },
            },
          },
        },
      },

      UpdatePedidoDto: {
        type: "object",
        properties: {
          estado: {
            type: "string",
            enum: ["PENDIENTE", "EN_PRODUCCION", "LISTO", "ENTREGADO", "CANCELADO"],
            description: "Estado del pedido",
            example: "EN_PRODUCCION",
          },
          pagado: {
            type: "boolean",
            description: "Indica si el pedido está pagado",
            example: true,
          },
          fechaEntregaEstimada: {
            type: "string",
            format: "date-time",
            nullable: true,
            description: "Fecha estimada de entrega",
            example: "2024-12-31T00:00:00.000Z",
          },
          fechaEntregaReal: {
            type: "string",
            format: "date-time",
            nullable: true,
            description: "Fecha real de entrega",
            example: "2024-12-30T00:00:00.000Z",
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
      PedidoId: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "integer", format: "int32" },
        description: "ID del pedido",
        example: 1,
      },
    },
  },
};

