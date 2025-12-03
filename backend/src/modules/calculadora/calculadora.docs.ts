// Documentación del módulo de calculadora
export const calculadoraDocs = {
  paths: {
    "/api/v1/calculadoras": {
      get: {
        tags: ["Calculadoras"],
        summary: "Obtener todas las calculadoras",
        description:
          "Obtiene una lista de todas las calculadoras registradas con sus relaciones de cliente y presupuesto.",
        responses: {
          200: {
            description: "Calculadoras obtenidas correctamente",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SuccessResponseCalculadoras",
                },
              },
            },
          },
        },
      },

      post: {
        tags: ["Calculadoras"],
        summary: "Crear una calculadora",
        description:
          "Crea una nueva calculadora asociada a un cliente y presupuesto. El porcentaje se aplica a gasto adicional y gasto de envío.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateCalculadoraDto",
              },
              example: {
                clienteId: 1,
                numeroPresupuesto: 1001,
                precioPrendaNeto: 15000.5,
                horasTrabajo: 8.5,
                porcentaje: 15.0,
                gastoAdicional: 5000.0,
                gastoEnvio: 3000.0,
              },
            },
          },
        },
        responses: {
          201: {
            description: "Calculadora creada exitosamente",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SuccessResponseCalculadora",
                },
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
                  errors: [
                    "clienteId debe ser un número positivo",
                    "porcentaje debe estar entre 0 y 100",
                  ],
                },
              },
            },
          },
          404: {
            description: "Cliente o presupuesto no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  statusCode: 404,
                  message: "Cliente no encontrado",
                },
              },
            },
          },
        },
      },
    },

    "/api/v1/calculadoras/{id}": {
      get: {
        tags: ["Calculadoras"],
        summary: "Obtener calculadora por ID",
        description:
          "Obtiene los detalles de una calculadora específica por su ID, incluyendo información del cliente y presupuesto asociados.",
        parameters: [{ $ref: "#/components/parameters/CalculadoraId" }],
        responses: {
          200: {
            description: "Calculadora obtenida correctamente",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SuccessResponseCalculadora",
                },
              },
            },
          },
          404: {
            description: "Calculadora no encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  statusCode: 404,
                  message: "Calculadora no encontrada",
                },
              },
            },
          },
        },
      },

      put: {
        tags: ["Calculadoras"],
        summary: "Actualizar una calculadora",
        description:
          "Actualiza los datos de una calculadora existente. Todos los campos son opcionales. Si se actualiza clienteId o numeroPresupuesto, se validará que existan.",
        parameters: [{ $ref: "#/components/parameters/CalculadoraId" }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateCalculadoraDto",
              },
              example: {
                precioPrendaNeto: 18000.0,
                horasTrabajo: 10.0,
                porcentaje: 20.0,
                gastoAdicional: 6000.0,
              },
            },
          },
        },
        responses: {
          200: {
            description: "Calculadora actualizada correctamente",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SuccessResponseCalculadora",
                },
              },
            },
          },
          404: {
            description: "Calculadora, cliente o presupuesto no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  statusCode: 404,
                  message: "Calculadora no encontrada",
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
        },
      },

      delete: {
        tags: ["Calculadoras"],
        summary: "Eliminar una calculadora",
        description:
          "Elimina una calculadora del sistema. Esta acción no se puede deshacer.",
        parameters: [{ $ref: "#/components/parameters/CalculadoraId" }],
        responses: {
          204: {
            description: "Calculadora eliminada correctamente",
          },
          404: {
            description: "Calculadora no encontrada",
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
      CreateCalculadoraDto: {
        type: "object",
        required: [
          "clienteId",
          "numeroPresupuesto",
          "precioPrendaNeto",
          "horasTrabajo",
          "porcentaje",
          "gastoAdicional",
          "gastoEnvio",
        ],
        properties: {
          clienteId: {
            type: "number",
            format: "integer",
            minimum: 1,
            description: "ID del cliente asociado",
            example: 1,
          },
          numeroPresupuesto: {
            type: "number",
            format: "integer",
            minimum: 1,
            description: "Número del presupuesto asociado",
            example: 1001,
          },
          precioPrendaNeto: {
            type: "number",
            format: "float",
            minimum: 0,
            description: "Precio neto de la prenda",
            example: 15000.5,
          },
          horasTrabajo: {
            type: "number",
            format: "float",
            minimum: 0,
            description: "Horas de trabajo requeridas",
            example: 8.5,
          },
          porcentaje: {
            type: "number",
            format: "float",
            minimum: 0,
            maximum: 100,
            description:
              "Porcentaje aplicado a gasto adicional y gasto de envío (0-100)",
            example: 15.0,
          },
          gastoAdicional: {
            type: "number",
            format: "float",
            minimum: 0,
            description: "Gasto adicional",
            example: 5000.0,
          },
          gastoEnvio: {
            type: "number",
            format: "float",
            minimum: 0,
            description: "Gasto de envío",
            example: 3000.0,
          },
        },
      },

      UpdateCalculadoraDto: {
        type: "object",
        properties: {
          clienteId: {
            type: "number",
            format: "integer",
            minimum: 1,
            description: "ID del cliente asociado",
          },
          numeroPresupuesto: {
            type: "number",
            format: "integer",
            minimum: 1,
            description: "Número del presupuesto asociado",
          },
          precioPrendaNeto: {
            type: "number",
            format: "float",
            minimum: 0,
            description: "Precio neto de la prenda",
          },
          horasTrabajo: {
            type: "number",
            format: "float",
            minimum: 0,
            description: "Horas de trabajo requeridas",
          },
          porcentaje: {
            type: "number",
            format: "float",
            minimum: 0,
            maximum: 100,
            description:
              "Porcentaje aplicado a gasto adicional y gasto de envío (0-100)",
          },
          gastoAdicional: {
            type: "number",
            format: "float",
            minimum: 0,
            description: "Gasto adicional",
          },
          gastoEnvio: {
            type: "number",
            format: "float",
            minimum: 0,
            description: "Gasto de envío",
          },
        },
      },

      Calculadora: {
        type: "object",
        properties: {
          id: {
            type: "number",
            format: "integer",
            description: "ID único de la calculadora",
            example: 1,
          },
          clienteId: {
            type: "number",
            format: "integer",
            description: "ID del cliente asociado",
            example: 1,
          },
          numeroPresupuesto: {
            type: "number",
            format: "integer",
            description: "Número del presupuesto asociado",
            example: 1001,
          },
          precioPrendaNeto: {
            type: "number",
            format: "float",
            description: "Precio neto de la prenda",
            example: 15000.5,
          },
          horasTrabajo: {
            type: "number",
            format: "float",
            description: "Horas de trabajo requeridas",
            example: 8.5,
          },
          porcentaje: {
            type: "number",
            format: "float",
            description:
              "Porcentaje aplicado a gasto adicional y gasto de envío",
            example: 15.0,
          },
          gastoAdicional: {
            type: "number",
            format: "float",
            description: "Gasto adicional",
            example: 5000.0,
          },
          gastoEnvio: {
            type: "number",
            format: "float",
            description: "Gasto de envío",
            example: 3000.0,
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Fecha de creación",
            example: "2024-01-15T10:30:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Fecha de última actualización",
            example: "2024-01-15T10:30:00Z",
          },
          cliente: {
            type: "object",
            description: "Información del cliente asociado",
            properties: {
              id: { type: "number" },
              nombre: { type: "string" },
              email: { type: "string", nullable: true },
              telefono: { type: "string", nullable: true },
            },
          },
          presupuesto: {
            type: "object",
            description: "Información del presupuesto asociado",
            properties: {
              id: { type: "number" },
              numeroPresupuesto: { type: "number" },
              estado: { type: "string" },
              totalVenta: { type: "number" },
            },
          },
        },
      },

      SuccessResponseCalculadora: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          statusCode: {
            type: "number",
            example: 200,
          },
          message: {
            type: "string",
            example: "Calculadora obtenida correctamente",
          },
          data: {
            $ref: "#/components/schemas/Calculadora",
          },
        },
      },

      SuccessResponseCalculadoras: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          statusCode: {
            type: "number",
            example: 200,
          },
          message: {
            type: "string",
            example: "Calculadoras obtenidas correctamente",
          },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Calculadora" },
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
            example: [
              "clienteId debe ser un número positivo",
              "porcentaje debe estar entre 0 y 100",
            ],
          },
        },
      },
    },

    parameters: {
      CalculadoraId: {
        name: "id",
        in: "path",
        required: true,
        description: "ID de la calculadora",
        schema: {
          type: "number",
          format: "integer",
        },
        example: 1,
      },
    },
  },
};
