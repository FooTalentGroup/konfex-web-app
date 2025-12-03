// src/modules/auth/auth.docs.ts
export const authDocs = {
    components: {
      schemas: {
        SignUpRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "test@example.com" },
            name: { type: "string", nullable: true, description: "Opcional. Si se proporciona, debe tener al menos 1 carácter. Los strings vacíos se convierten a null.", example: "Miguel" },
            role: { type: "string", enum: ["USER", "ADMIN"], default: "USER", example: "USER" },
            password: { type: "string", minLength: 8, description: "Debe incluir letras y números", example: "test1234" },
          },
        },
        SignInRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "test@example.com" },
            password: { type: "string", minLength: 8, example: "Passw0rd123" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            statusCode: { type: "integer", example: 400 },
            message: { type: "string", example: "Datos inválidos" },
            errors: { type: "array", items: { type: "string" } },
          },
        },
      },
      parameters: {},
    },
  
    paths: {
      "/api/v1/auth/sign-up": {
        post: {
          tags: ["Auth"],
          summary: "Registro de un nuevo usuario",
          description: "Crea un nuevo usuario. Solo ADMIN puede asignar rol ADMIN.",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/SignUpRequest" } } },
          },
          responses: {
            201: { 
              description: "Usuario creado exitosamente", 
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
                          email: { type: "string" },
                          name: { type: "string", nullable: true },
                          role: { type: "string", enum: ["USER", "ADMIN"] }
                        }
                      }
                    }
                  }
                } 
              } 
            },
            400: { description: "Error de validación", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            409: { description: "El usuario ya existe", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/api/v1/auth/sign-in": {
        post: {
          tags: ["Auth"],
          summary: "Iniciar sesión",
          description: "Permite iniciar sesión con email y contraseña.",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/SignInRequest" } } },
          },
          responses: {
            201: { 
              description: "Login exitoso", 
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
                          token: { type: "string" },
                          refreshToken: { type: "string" },
                          user: {
                            type: "object",
                            properties: {
                              id: { type: "number" },
                              email: { type: "string" },
                              name: { type: "string", nullable: true },
                              role: { type: "string", enum: ["USER", "ADMIN"] }
                            }
                          }
                        }
                      }
                    }
                  }
                } 
              } 
            },
            400: { description: "Datos inválidos", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            401: { description: "Credenciales inválidas", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
    },
  };
  