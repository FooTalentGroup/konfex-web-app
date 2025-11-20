// src/config/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API - Footalent",
      version: "1.0.0",
      description: "Documentación oficial de la API",
    },
    servers: [
      {
        url: process.env.SWAGGER_HOST || "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      // ---------------------------------------------
      // SCHEMAS (GENERADOS DESDE SCHEMA.PRISMA)
      // ---------------------------------------------
      schemas: {
        // ENUMS
        RolUsuario: {
          type: "string",
          enum: ["ADMIN", "VENDEDOR", "PRODUCCION"],
        },
        EstadoPresupuesto: {
          type: "string",
          enum: ["BORRADOR", "ENVIADO", "ACEPTADO", "RECHAZADO", "VENCIDO"],
        },
        EstadoPedido: {
          type: "string",
          enum: [
            "PENDIENTE",
            "EN_PRODUCCION",
            "LISTO",
            "ENTREGADO",
            "CANCELADO",
          ],
        },

        // MODELOS
        Usuario: {
          type: "object",
          required: ["nombre", "email", "passwordHash", "rol"],
          properties: {
            id: { type: "integer" },
            nombre: { type: "string" },
            email: { type: "string" },
            passwordHash: { type: "string" },
            rol: { $ref: "#/components/schemas/RolUsuario" },
            activo: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        Cliente: {
          type: "object",
          required: ["nombre"],
          properties: {
            id: { type: "integer" },
            nombre: { type: "string" },
            telefono: { type: "string", nullable: true },
            email: { type: "string", nullable: true },
            origen: { type: "string", nullable: true },
            instagramUser: { type: "string", nullable: true },
            notas: { type: "string", nullable: true },
            presupuestos: {
              type: "array",
              items: { $ref: "#/components/schemas/Presupuesto" },
            },
            pedidos: {
              type: "array",
              items: { $ref: "#/components/schemas/Pedido" },
            },
          },
        },

        Producto: {
          type: "object",
          required: ["nombre"],
          properties: {
            id: { type: "integer" },
            nombre: { type: "string" },
            descripcion: { type: "string", nullable: true },
            activo: { type: "boolean" },
            materiales: {
              type: "array",
              items: { $ref: "#/components/schemas/MaterialPorProducto" },
            },
            presupuestos: {
              type: "array",
              items: { $ref: "#/components/schemas/PresupuestoDetalle" },
            },
            pedidos: {
              type: "array",
              items: { $ref: "#/components/schemas/PedidoDetalle" },
            },
          },
        },

        Material: {
          type: "object",
          required: ["nombre", "costoUnitario", "unidadMedida", "stock"],
          properties: {
            id: { type: "integer" },
            nombre: { type: "string" },
            costoUnitario: { type: "number" },
            unidadMedida: { type: "string" },
            stock: { type: "number" },
            tipo: { type: "string", nullable: true },
            productos: {
              type: "array",
              items: { $ref: "#/components/schemas/MaterialPorProducto" },
            },
          },
        },

        MaterialPorProducto: {
          type: "object",
          required: ["productoId", "materialId", "cantidad"],
          properties: {
            id: { type: "integer" },
            productoId: { type: "integer" },
            materialId: { type: "integer" },
            cantidad: { type: "number" },
            producto: { $ref: "#/components/schemas/Producto" },
            material: { $ref: "#/components/schemas/Material" },
          },
        },

        Presupuesto: {
          type: "object",
          required: [
            "clienteId",
            "estado",
            "margenGananciaPorcentaje",
            "gastosIndirectosPorcentaje",
          ],
          properties: {
            id: { type: "integer" },
            clienteId: { type: "integer" },
            fechaCreacion: { type: "string", format: "date-time" },
            fechaVencimiento: { type: "string", format: "date-time", nullable: true },
            estado: { $ref: "#/components/schemas/EstadoPresupuesto" },
            margenGananciaPorcentaje: { type: "number" },
            gastosIndirectosPorcentaje: { type: "number" },
            totalCosto: { type: "number" },
            totalVenta: { type: "number" },
            notas: { type: "string", nullable: true },
            cliente: { $ref: "#/components/schemas/Cliente" },
            detalles: {
              type: "array",
              items: { $ref: "#/components/schemas/PresupuestoDetalle" },
            },
            pedido: { $ref: "#/components/schemas/Pedido" },
          },
        },

        PresupuestoDetalle: {
          type: "object",
          required: ["presupuestoId", "productoId", "cantidad"],
          properties: {
            id: { type: "integer" },
            presupuestoId: { type: "integer" },
            productoId: { type: "integer" },
            cantidad: { type: "integer" },
            talle: { type: "string", nullable: true },
            color: { type: "string", nullable: true },
            costoUnitarioCalculado: { type: "number" },
            precioUnitario: { type: "number" },
            subtotal: { type: "number" },
            producto: { $ref: "#/components/schemas/Producto" },
          },
        },

        Pedido: {
          type: "object",
          required: ["presupuestoId", "clienteId", "estado"],
          properties: {
            id: { type: "integer" },
            presupuestoId: { type: "integer" },
            clienteId: { type: "integer" },
            fechaCreacion: { type: "string", format: "date-time" },
            estado: { $ref: "#/components/schemas/EstadoPedido" },
            pagado: { type: "boolean" },
            fechaEntregaEstimada: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            fechaEntregaReal: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            detalles: {
              type: "array",
              items: { $ref: "#/components/schemas/PedidoDetalle" },
            },
            etapas: {
              type: "array",
              items: { $ref: "#/components/schemas/ProduccionEtapa" },
            },
          },
        },

        PedidoDetalle: {
          type: "object",
          required: ["pedidoId", "productoId", "cantidad"],
          properties: {
            id: { type: "integer" },
            pedidoId: { type: "integer" },
            productoId: { type: "integer" },
            cantidad: { type: "integer" },
            talle: { type: "string", nullable: true },
            color: { type: "string", nullable: true },
            costoUnitario: { type: "number" },
            precioUnitario: { type: "number" },
            subtotal: { type: "number" },
            producto: { $ref: "#/components/schemas/Producto" },
          },
        },

        ProduccionEtapa: {
          type: "object",
          required: ["pedidoId", "etapa"],
          properties: {
            id: { type: "integer" },
            pedidoId: { type: "integer" },
            etapa: { type: "string" },
            fechaInicio: { type: "string", format: "date-time" },
            fechaFin: { type: "string", format: "date-time", nullable: true },
            responsable: { type: "string", nullable: true },
          },
        },
      },
    },
  },

  apis: ["./src/routes/**/*.ts", "./src/modules/**/controller.ts"],
};

const spec = swaggerJsdoc(options);

export function setupSwagger(app: Express, path = "/docs") {
  app.use(path, swaggerUi.serve, swaggerUi.setup(spec));
}
