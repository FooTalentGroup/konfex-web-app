export const presupuestoDocs = {
  paths: {
    "/api/v1/presupuestos": {
      get: {
        tags: ["Presupuestos"],
        summary: "Obtener todos los presupuestos",
        description: "Retorna una lista de todos los presupuestos con sus detalles, cliente y pedido asociado",
        responses: {
          200: {
            description: "Lista de presupuestos obtenida correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponsePresupuestos" }
              }
            }
          }
        }
      },

      post: {
        tags: ["Presupuestos"],
        summary: "Crear un presupuesto",
        description: "Crea un nuevo presupuesto con sus detalles opcionales",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreatePresupuestoDto" },
              example: {
                clienteId: 1,
                fechaVencimiento: "2024-12-31T00:00:00.000Z",
                estado: "BORRADOR",
                margenGananciaPorcentaje: 30.0,
                gastosIndirectosPorcentaje: 15.0,
                totalCosto: 25000.0,
                totalVenta: 37375.0,
                notas: "Presupuesto para colección de verano",
                detalles: [
                  {
                    productoId: 1,
                    descripcion: "Pantalón Casual - Talla M",
                    cantidad: 5,
                    costoUnitario: 5000.0
                  }
                ]
              }
            }
          }
        },
        responses: {
          201: {
            description: "Presupuesto creado exitosamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponsePresupuesto" }
              }
            }
          },
          400: {
            description: "Error de validación",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          404: {
            description: "Cliente no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },

    "/api/v1/presupuestos/next-number": {
      get: {
        tags: ["Presupuestos"],
        summary: "Obtener siguiente número de presupuesto",
        description: "Retorna el siguiente número de presupuesto disponible",
        responses: {
          200: {
            description: "Siguiente número obtenido correctamente",
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
                        numeroPresupuesto: { type: "number", example: 1006 }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/api/v1/presupuestos/{id}": {
      get: {
        tags: ["Presupuestos"],
        summary: "Obtener presupuesto por ID",
        parameters: [{ $ref: "#/components/parameters/PresupuestoId" }],
        responses: {
          200: {
            description: "Presupuesto obtenido correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponsePresupuesto" }
              }
            }
          },
          404: {
            description: "Presupuesto no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },

      put: {
        tags: ["Presupuestos"],
        summary: "Actualizar un presupuesto completamente",
        description: "Actualiza todos los campos del presupuesto",
        parameters: [{ $ref: "#/components/parameters/PresupuestoId" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePresupuestoDto" },
              example: {
                clienteId: 1,
                fechaVencimiento: "2024-12-31T00:00:00.000Z",
                estado: "ENVIADO",
                margenGananciaPorcentaje: 35.0,
                gastosIndirectosPorcentaje: 18.0,
                totalCosto: 28000.0,
                totalVenta: 42840.0,
                notas: "Presupuesto actualizado",
                detalles: [
                  {
                    productoId: 1,
                    descripcion: "Pantalón Casual - Talla L",
                    cantidad: 6,
                    costoUnitario: 5500.0
                  }
                ]
              }
            }
          }
        },
        responses: {
          200: {
            description: "Presupuesto actualizado correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponsePresupuesto" }
              }
            }
          },
          404: {
            description: "Presupuesto no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },

      patch: {
        tags: ["Presupuestos"],
        summary: "Actualizar parcialmente un presupuesto",
        description: "Actualiza solo los campos proporcionados del presupuesto",
        parameters: [{ $ref: "#/components/parameters/PresupuestoId" }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PartialUpdatePresupuestoDto" },
              example: {
                estado: "ACEPTADO",
                notas: "Cliente aceptó el presupuesto"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Presupuesto actualizado parcialmente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponsePresupuesto" }
              }
            }
          },
          404: {
            description: "Presupuesto no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },

      delete: {
        tags: ["Presupuestos"],
        summary: "Eliminar un presupuesto",
        parameters: [{ $ref: "#/components/parameters/PresupuestoId" }],
        responses: {
          200: {
            description: "Presupuesto eliminado correctamente",
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
                        id: { type: "number" }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            description: "Presupuesto no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    }
  },

  components: {
    schemas: {
      PresupuestoDetalleDto: {
        type: "object",
        required: ["productoId", "cantidad", "costoUnitario"],
        properties: {
          productoId: {
            type: "number",
            minimum: 1,
            description: "ID del producto"
          },
          descripcion: {
            type: "string",
            nullable: true,
            description: "Descripción del detalle"
          },
          cantidad: {
            type: "number",
            minimum: 1,
            description: "Cantidad de productos"
          },
          costoUnitario: {
            type: "number",
            minimum: 0,
            description: "Costo unitario del producto"
          }
        }
      },

      CreatePresupuestoDto: {
        type: "object",
        required: ["estado", "margenGananciaPorcentaje", "gastosIndirectosPorcentaje", "totalCosto", "totalVenta"],
        properties: {
          clienteId: {
            type: "number",
            nullable: true,
            minimum: 1,
            description: "ID del cliente (opcional)"
          },
          fechaVencimiento: {
            type: "string",
            format: "date-time",
            nullable: true,
            description: "Fecha de vencimiento del presupuesto"
          },
          estado: {
            type: "string",
            enum: ["BORRADOR", "ENVIADO", "ACEPTADO", "RECHAZADO", "VENCIDO"],
            description: "Estado del presupuesto"
          },
          margenGananciaPorcentaje: {
            type: "number",
            minimum: 0,
            maximum: 100,
            description: "Porcentaje de margen de ganancia"
          },
          gastosIndirectosPorcentaje: {
            type: "number",
            minimum: 0,
            maximum: 100,
            description: "Porcentaje de gastos indirectos"
          },
          totalCosto: {
            type: "number",
            minimum: 0,
            description: "Costo total del presupuesto"
          },
          totalVenta: {
            type: "number",
            minimum: 0,
            description: "Precio de venta total"
          },
          notas: {
            type: "string",
            nullable: true,
            description: "Notas adicionales"
          },
          detalles: {
            type: "array",
            items: { $ref: "#/components/schemas/PresupuestoDetalleDto" },
            description: "Lista de detalles del presupuesto (opcional)"
          }
        }
      },

      UpdatePresupuestoDto: {
        type: "object",
        properties: {
          clienteId: {
            type: "number",
            nullable: true,
            minimum: 1
          },
          fechaVencimiento: {
            type: "string",
            format: "date-time",
            nullable: true
          },
          estado: {
            type: "string",
            enum: ["BORRADOR", "ENVIADO", "ACEPTADO", "RECHAZADO", "VENCIDO"]
          },
          margenGananciaPorcentaje: {
            type: "number",
            minimum: 0,
            maximum: 100
          },
          gastosIndirectosPorcentaje: {
            type: "number",
            minimum: 0,
            maximum: 100
          },
          totalCosto: {
            type: "number",
            minimum: 0
          },
          totalVenta: {
            type: "number",
            minimum: 0
          },
          notas: {
            type: "string",
            nullable: true
          },
          detalles: {
            type: "array",
            items: { $ref: "#/components/schemas/PresupuestoDetalleDto" }
          }
        }
      },

      PartialUpdatePresupuestoDto: {
        type: "object",
        properties: {
          clienteId: {
            type: "number",
            nullable: true,
            minimum: 1
          },
          fechaVencimiento: {
            type: "string",
            format: "date-time",
            nullable: true
          },
          estado: {
            type: "string",
            enum: ["BORRADOR", "ENVIADO", "ACEPTADO", "RECHAZADO", "VENCIDO"]
          },
          margenGananciaPorcentaje: {
            type: "number",
            minimum: 0,
            maximum: 100
          },
          gastosIndirectosPorcentaje: {
            type: "number",
            minimum: 0,
            maximum: 100
          },
          totalCosto: {
            type: "number",
            minimum: 0
          },
          totalVenta: {
            type: "number",
            minimum: 0
          },
          notas: {
            type: "string",
            nullable: true
          },
          detalles: {
            type: "array",
            items: { $ref: "#/components/schemas/PresupuestoDetalleDto" }
          }
        }
      },

      PresupuestoDetalleResponse: {
        type: "object",
        properties: {
          id: { type: "number" },
          productoId: { type: "number" },
          descripcion: { type: "string", nullable: true },
          cantidad: { type: "number" },
          costoUnitario: { type: "number" }
        }
      },

      PresupuestoResponse: {
        type: "object",
        properties: {
          id: { type: "number" },
          numeroPresupuesto: { type: "number" },
          clienteId: { type: "number", nullable: true },
          fechaCreacion: { type: "string", format: "date-time" },
          fechaVencimiento: { type: "string", format: "date-time", nullable: true },
          estado: {
            type: "string",
            enum: ["BORRADOR", "ENVIADO", "ACEPTADO", "RECHAZADO", "VENCIDO"]
          },
          margenGananciaPorcentaje: { type: "number" },
          gastosIndirectosPorcentaje: { type: "number" },
          totalCosto: { type: "number" },
          totalVenta: { type: "number" },
          notas: { type: "string", nullable: true },
          detalles: {
            type: "array",
            items: { $ref: "#/components/schemas/PresupuestoDetalleResponse" }
          },
          cliente: {
            type: "object",
            nullable: true,
            properties: {
              id: { type: "number" },
              nombre: { type: "string" },
              email: { type: "string", nullable: true }
            }
          },
          pedido: {
            type: "object",
            nullable: true,
            properties: {
              id: { type: "number" },
              estado: { type: "string" }
            }
          }
        }
      },

      SuccessResponsePresupuesto: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          statusCode: { type: "number" },
          message: { type: "string" },
          data: { $ref: "#/components/schemas/PresupuestoResponse" }
        }
      },

      SuccessResponsePresupuestos: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          statusCode: { type: "number" },
          message: { type: "string" },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/PresupuestoResponse" }
          }
        }
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
              { type: "null" }
            ]
          }
        }
      }
    },

    parameters: {
      PresupuestoId: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "number" },
        description: "ID del presupuesto",
        example: 1
      }
    }
  }
};

