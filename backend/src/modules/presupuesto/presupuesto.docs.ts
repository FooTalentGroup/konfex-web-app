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
                          numeroPresupuesto: { type: "number" },
                          nombre: { type: "string", nullable: true },
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
                          costosIndirectos: { type: "number" },
                          ganancias: { type: "number" },
                          notas: { type: "string", nullable: true },
                          detalles: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                id: { type: "number" },
                                productoId: { type: "number" },
                                descripcion: { type: "string", nullable: true },
                                cantidad: { type: "number" },
                                costoUnitario: { type: "number" }
                              }
                            }
                          },
                          adicionales: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                id: { type: "number" },
                                nombre: { type: "string" },
                                cantidad: { type: "number" },
                                monto: { type: "number" },
                                totalCosto: { type: "number" },
                                observaciones: { type: "string", nullable: true },
                                createdAt: { type: "string", format: "date-time" },
                                updatedAt: { type: "string", format: "date-time" }
                              }
                            }
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
                      }
                    }
                  }
                }
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
                nombre: "Presupuesto Colección Verano 2024",
                clienteId: 1,
                fechaVencimiento: "2024-12-31T00:00:00.000Z",
                estado: "BORRADOR",
                margenGananciaPorcentaje: 30.0,
                gastosIndirectosPorcentaje: 15.0,
                totalCosto: 25000.0,
                costosIndirectos: 3750.0,
                ganancias: 8625.0,
                notas: "Presupuesto para colección de verano",
                detalles: [
                  {
                    productoId: 1,
                    descripcion: "Pantalón Casual - Talla M",
                    cantidad: 5,
                    costoUnitario: 5000.0
                  }
                ],
                adicionales: [
                  {
                    nombre: "Embalaje especial",
                    cantidad: 1,
                    monto: 5000.0,
                    totalCosto: 5000.0,
                    observaciones: "Embalaje reforzado para envío"
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
                        numeroPresupuesto: { type: "number" },
                        nombre: { type: "string", nullable: true },
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
                        costosIndirectos: { type: "number" },
                        ganancias: { type: "number" },
                        notas: { type: "string", nullable: true },
                        detalles: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "number" },
                              productoId: { type: "number" },
                              descripcion: { type: "string", nullable: true },
                              cantidad: { type: "number" },
                              costoUnitario: { type: "number" }
                            }
                          }
                        },
                        adicionales: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "number" },
                              nombre: { type: "string" },
                              cantidad: { type: "number" },
                              monto: { type: "number" },
                              totalCosto: { type: "number" },
                              observaciones: { type: "string", nullable: true },
                              createdAt: { type: "string", format: "date-time" },
                              updatedAt: { type: "string", format: "date-time" }
                            }
                          }
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
                    }
                  }
                }
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
                        numeroPresupuesto: { type: "number" },
                        nombre: { type: "string", nullable: true },
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
                        costosIndirectos: { type: "number" },
                        ganancias: { type: "number" },
                        notas: { type: "string", nullable: true },
                        detalles: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "number" },
                              productoId: { type: "number" },
                              descripcion: { type: "string", nullable: true },
                              cantidad: { type: "number" },
                              costoUnitario: { type: "number" }
                            }
                          }
                        },
                        adicionales: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "number" },
                              nombre: { type: "string" },
                              cantidad: { type: "number" },
                              monto: { type: "number" },
                              totalCosto: { type: "number" },
                              observaciones: { type: "string", nullable: true },
                              createdAt: { type: "string", format: "date-time" },
                              updatedAt: { type: "string", format: "date-time" }
                            }
                          }
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
                nombre: "Presupuesto Actualizado",
                clienteId: 1,
                fechaVencimiento: "2024-12-31T00:00:00.000Z",
                estado: "ENVIADO",
                margenGananciaPorcentaje: 35.0,
                gastosIndirectosPorcentaje: 18.0,
                totalCosto: 28000.0,
                costosIndirectos: 5040.0,
                ganancias: 11564.0,
                notas: "Presupuesto actualizado",
                detalles: [
                  {
                    productoId: 1,
                    descripcion: "Pantalón Casual - Talla L",
                    cantidad: 6,
                    costoUnitario: 5500.0
                  }
                ],
                adicionales: []
              }
            }
          }
        },
        responses: {
          200: {
            description: "Presupuesto actualizado correctamente",
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
                        numeroPresupuesto: { type: "number" },
                        nombre: { type: "string", nullable: true },
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
                        costosIndirectos: { type: "number" },
                        ganancias: { type: "number" },
                        notas: { type: "string", nullable: true },
                        detalles: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "number" },
                              productoId: { type: "number" },
                              descripcion: { type: "string", nullable: true },
                              cantidad: { type: "number" },
                              costoUnitario: { type: "number" }
                            }
                          }
                        },
                        adicionales: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "number" },
                              nombre: { type: "string" },
                              cantidad: { type: "number" },
                              monto: { type: "number" },
                              totalCosto: { type: "number" },
                              observaciones: { type: "string", nullable: true },
                              createdAt: { type: "string", format: "date-time" },
                              updatedAt: { type: "string", format: "date-time" }
                            }
                          }
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
                        numeroPresupuesto: { type: "number" },
                        nombre: { type: "string", nullable: true },
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
                        costosIndirectos: { type: "number" },
                        ganancias: { type: "number" },
                        notas: { type: "string", nullable: true },
                        detalles: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "number" },
                              productoId: { type: "number" },
                              descripcion: { type: "string", nullable: true },
                              cantidad: { type: "number" },
                              costoUnitario: { type: "number" }
                            }
                          }
                        },
                        adicionales: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "number" },
                              nombre: { type: "string" },
                              cantidad: { type: "number" },
                              monto: { type: "number" },
                              totalCosto: { type: "number" },
                              observaciones: { type: "string", nullable: true },
                              createdAt: { type: "string", format: "date-time" },
                              updatedAt: { type: "string", format: "date-time" }
                            }
                          }
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

      AdicionalDto: {
        type: "object",
        required: ["nombre", "cantidad", "monto", "totalCosto"],
        properties: {
          nombre: {
            type: "string",
            description: "Nombre del producto o material adicional"
          },
          cantidad: {
            type: "number",
            minimum: 1,
            description: "Cantidad"
          },
          monto: {
            type: "number",
            minimum: 0,
            description: "Monto unitario"
          },
          totalCosto: {
            type: "number",
            minimum: 0,
            description: "Costo total del adicional"
          },
          observaciones: {
            type: "string",
            nullable: true,
            description: "Observaciones adicionales"
          }
        }
      },

      CreatePresupuestoDto: {
        type: "object",
        required: ["estado", "margenGananciaPorcentaje", "gastosIndirectosPorcentaje", "totalCosto", "costosIndirectos", "ganancias"],
        properties: {
          nombre: {
            type: "string",
            nullable: true,
            description: "Nombre del presupuesto"
          },
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
          costosIndirectos: {
            type: "number",
            minimum: 0,
            description: "Costos indirectos calculados"
          },
          ganancias: {
            type: "number",
            minimum: 0,
            description: "Ganancias calculadas"
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
          },
          adicionales: {
            type: "array",
            items: { $ref: "#/components/schemas/AdicionalDto" },
            description: "Lista de costos adicionales (opcional)"
          }
        }
      },

      UpdatePresupuestoDto: {
        type: "object",
        properties: {
          nombre: {
            type: "string",
            nullable: true
          },
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
          costosIndirectos: {
            type: "number",
            minimum: 0
          },
          ganancias: {
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
          },
          adicionales: {
            type: "array",
            items: { $ref: "#/components/schemas/AdicionalDto" }
          }
        }
      },

      PartialUpdatePresupuestoDto: {
        type: "object",
        properties: {
          nombre: {
            type: "string",
            nullable: true
          },
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
          costosIndirectos: {
            type: "number",
            minimum: 0
          },
          ganancias: {
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
          },
          adicionales: {
            type: "array",
            items: { $ref: "#/components/schemas/AdicionalDto" }
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
