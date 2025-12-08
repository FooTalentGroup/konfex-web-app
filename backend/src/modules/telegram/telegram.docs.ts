export const telegramDocs = {
  paths: {
    "/api/v1/telegram/webhook": {
      post: {
        tags: ["Telegram"],
        summary: "Webhook de Telegram",
        description:
          "Endpoint para recibir actualizaciones de Telegram Bot. Este endpoint es llamado por Telegram cuando hay nuevos mensajes o actualizaciones.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TelegramUpdate" },
              example: {
                update_id: 123456789,
                message: {
                  message_id: 1,
                  from: {
                    id: 123456789,
                    is_bot: false,
                    first_name: "Juan",
                    last_name: "Pérez",
                    username: "juanperez",
                    language_code: "es",
                  },
                  chat: {
                    id: 123456789,
                    first_name: "Juan",
                    last_name: "Pérez",
                    username: "juanperez",
                    type: "private",
                  },
                  date: 1609459200,
                  text: "Hola, quiero información sobre presupuestos",
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Webhook procesado correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "string",
                  example: "OK",
                },
              },
            },
          },
          500: {
            description: "Error al procesar el webhook",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/v1/telegram/chats": {
      get: {
        tags: ["Telegram"],
        summary: "Obtener lista de chats",
        description:
          "Retorna una lista de todos los chats de Telegram con información del último mensaje",
        responses: {
          200: {
            description: "Lista de chats obtenida correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    statusCode: { type: "number" },
                    message: { type: "string" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          chatId: { type: "string" },
                          name: { type: "string" },
                          lastMessage: { type: "string" },
                          lastMessageSource: {
                            type: "string",
                            enum: ["telegram", "konfex"],
                          },
                          timestamp: { type: "string", format: "date-time" },
                          hasBudget: { type: "boolean" },
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

    "/api/v1/telegram/chats/{chatId}/messages": {
      get: {
        tags: ["Telegram"],
        summary: "Obtener mensajes de un chat",
        description: "Retorna todos los mensajes de un chat específico",
        parameters: [{ $ref: "#/components/parameters/ChatId" }],
        responses: {
          200: {
            description: "Mensajes obtenidos correctamente",
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
                          chatId: { type: "string" },
                          text: { type: "string" },
                          source: {
                            type: "string",
                            enum: ["telegram", "konfex"],
                          },
                          firstName: { type: "string", nullable: true },
                          lastName: { type: "string", nullable: true },
                          username: { type: "string", nullable: true },
                          timestamp: { type: "string", format: "date-time" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "chatId es requerido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/api/v1/telegram/send": {
      post: {
        tags: ["Telegram"],
        summary: "Enviar mensaje de texto",
        description: "Envía un mensaje de texto a un chat específico de Telegram",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SendMessageDto" },
              example: {
                chatId: "123456789",
                text: "Hola, este es un mensaje de prueba",
                firstName: "Konfex",
                lastName: "Usuario",
                username: null,
              },
            },
          },
        },
        responses: {
          200: {
            description: "Mensaje enviado correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    message: { type: "string", example: "Mensaje enviado" },
                    telegramResponse: {
                      type: "object",
                      description: "Respuesta de la API de Telegram",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "chatId y text son requeridos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string", example: "chatId y text son requeridos" },
                  },
                },
              },
            },
          },
          500: {
            description: "Error al enviar el mensaje",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
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
      TelegramUpdate: {
        type: "object",
        description: "Estructura de actualización de Telegram",
        properties: {
          update_id: { type: "number" },
          message: {
            type: "object",
            properties: {
              message_id: { type: "number" },
              from: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  is_bot: { type: "boolean" },
                  first_name: { type: "string" },
                  last_name: { type: "string", nullable: true },
                  username: { type: "string", nullable: true },
                  language_code: { type: "string", nullable: true },
                },
              },
              chat: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  first_name: { type: "string", nullable: true },
                  last_name: { type: "string", nullable: true },
                  username: { type: "string", nullable: true },
                  type: { type: "string" },
                },
              },
              date: { type: "number" },
              text: { type: "string", nullable: true },
            },
          },
        },
      },

      SendMessageDto: {
        type: "object",
        required: ["chatId", "text"],
        properties: {
          chatId: {
            type: "string",
            description: "ID del chat de Telegram",
          },
          text: {
            type: "string",
            description: "Texto del mensaje a enviar",
          },
          firstName: {
            type: "string",
            nullable: true,
            description: "Nombre del remitente (opcional, por defecto 'Konfex')",
          },
          lastName: {
            type: "string",
            nullable: true,
            description: "Apellido del remitente (opcional, por defecto 'Usuario')",
          },
          username: {
            type: "string",
            nullable: true,
            description: "Username del remitente (opcional)",
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
      ChatId: {
        name: "chatId",
        in: "path",
        required: true,
        schema: { type: "string" },
        description: "ID del chat de Telegram",
        example: "123456789",
      },
    },
  },
};
