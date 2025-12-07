export const clienteDocs = {
    paths: {
      "/api/v1/clientes": {
        get: {
          tags: ["Clientes"],
          summary: "Obtener todos los clientes",
          responses: {
            200: {
              description: "Clientes obtenidos correctamente",
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
                            nombre: { type: "string" },
                            telefono: { type: "string", nullable: true },
                            email: { type: "string", nullable: true },
                            direccion: { type: "string", nullable: true },
                            origen: { type: "string", nullable: true },
                            instagramUser: { type: "string", nullable: true },
                            notas: { type: "string", nullable: true },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" }
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
          tags: ["Clientes"],
          summary: "Crear un cliente",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateClienteDto" },
                example: {
                  nombre: "Juan Pérez",
                  telefono: "987654321",
                  email: "juan@example.com",
                  direccion: "Av. Principal 123",
                  origen: "Instagram",
                  instagramUser: "@juanp",
                  notas: "Cliente recurrente"
                }
              }
            }
          },
          responses: {
            201: {
              description: "Cliente creado exitosamente",
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
                          telefono: { type: "string", nullable: true },
                          email: { type: "string", nullable: true },
                          origen: { type: "string", nullable: true },
                          instagramUser: { type: "string", nullable: true },
                          notas: { type: "string", nullable: true },
                          createdAt: { type: "string", format: "date-time" },
                          updatedAt: { type: "string", format: "date-time" }
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
            409: {
              description: "Nombre duplicado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                  example: {
                    success: false,
                    statusCode: 409,
                    message: "Ya existe un cliente con ese nombre"
                  }
                }
              }
            }
          }
        }
      },
  
      "/api/v1/clientes/{id}": {
        get: {
          tags: ["Clientes"],
          summary: "Obtener cliente por ID",
          parameters: [{ $ref: "#/components/parameters/ClienteId" }],
          responses: {
            200: {
              description: "Cliente obtenido correctamente",
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
                          telefono: { type: "string", nullable: true },
                          email: { type: "string", nullable: true },
                          origen: { type: "string", nullable: true },
                          instagramUser: { type: "string", nullable: true },
                          notas: { type: "string", nullable: true },
                          createdAt: { type: "string", format: "date-time" },
                          updatedAt: { type: "string", format: "date-time" }
                        }
                      }
                    }
                  }
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
        },
  
        put: {
          tags: ["Clientes"],
          summary: "Actualizar un cliente",
          parameters: [{ $ref: "#/components/parameters/ClienteId" }],
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateClienteDto" },
                example: {
                  telefono: "999888777",
                  notas: "Actualizado por seguimiento"
                }
              }
            }
          },
          responses: {
            200: {
              description: "Cliente actualizado correctamente",
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
                          telefono: { type: "string", nullable: true },
                          email: { type: "string", nullable: true },
                          origen: { type: "string", nullable: true },
                          instagramUser: { type: "string", nullable: true },
                          notas: { type: "string", nullable: true },
                          createdAt: { type: "string", format: "date-time" },
                          updatedAt: { type: "string", format: "date-time" }
                        }
                      }
                    }
                  }
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
        },
  
        delete: {
          tags: ["Clientes"],
          summary: "Eliminar un cliente",
          parameters: [{ $ref: "#/components/parameters/ClienteId" }],
          responses: {
            200: {
              description: "Cliente eliminado correctamente"
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
      }
    },
  
    components: {
      schemas: {
        CreateClienteDto: {
          type: "object",
          required: ["nombre"],
          properties: {
            nombre: { type: "string" },
            telefono: { type: "string", nullable: true },
            email: { type: "string", nullable: true },
            direccion: { type: "string", nullable: true },
            origen: { type: "string", nullable: true },
            instagramUser: { type: "string", nullable: true },
            notas: { type: "string", nullable: true }
          }
        },

        UpdateClienteDto: {
          type: "object",
          properties: {
            nombre: { type: "string" },
            telefono: { type: "string", nullable: true },
            email: { type: "string", nullable: true },
            direccion: { type: "string", nullable: true },
            origen: { type: "string", nullable: true },
            instagramUser: { type: "string", nullable: true },
            notas: { type: "string", nullable: true }
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
        ClienteId: {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "number" },
          example: 1
        }
      }
    }
  };
  