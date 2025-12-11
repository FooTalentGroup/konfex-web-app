import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role, EstadoPresupuesto, EstadoPedido } from "../generated/prisma/client";

import { clienteRepository } from "../src/modules/cliente/cliente.repository";
import { productoRepository } from "../src/modules/producto/producto.repository";
import { materialRepository } from "../src/modules/material/material.repository";
import { gastosNegocioRepository } from "../src/modules/gastos-negocio/gastos-negocio.repository";
import { impuestoGeneralRepository } from "../src/modules/impuesto-general/impuesto-general.repository";
import { UserRepository } from "../src/modules/user/user.repository";
import { PresupuestoRepository } from "../src/modules/presupuesto/presupuesto.repository";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("Falta la variable de entorno DATABASE_URL");
}

const pool = new Pool({
  connectionString: databaseUrl,
  max: 1,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 60000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const clientes = [
    {
      nombre: "Claudia Muñoz",
      telefono: "987112233",
      email: "claudia.munoz@example.com",
      direccion: "Av. Libertador 1234, Santiago",
      origen: "Instagram",
      instagramUser: "@claudia_munoz_cl",
      notas: "Interesada en colecciones de temporada",
    },
    {
      nombre: "Carlos Rojas",
      telefono: "987445566",
      email: "carlos.rojas@example.com",
      direccion: "Calle Principal 567, Valparaíso",
      origen: "Facebook",
      instagramUser: "@carlos_rojas",
      notas: "Compra mayorista",
    },
  ];

  for (const cliente of clientes) {
    try {
      const existe = await clienteRepository.findByName(cliente.nombre);
      if (!existe) {
        await clienteRepository.create(cliente);
      }
    } catch (error: any) {
      if (error.code !== "P2002") {
        throw error;
      }
    }
  }

  const categoriasNombres = ["Tela", "Hilo", "Accesorio", "Forro"];
  const categoriasMap: Record<string, number> = {};

  for (const nombreCategoria of categoriasNombres) {
    try {
      const categoriaExistente = await prisma.categoria.findUnique({
        where: { nombre: nombreCategoria },
      });
      if (categoriaExistente) {
        categoriasMap[nombreCategoria] = categoriaExistente.id;
      } else {
        const nuevaCategoria = await prisma.categoria.create({
          data: { nombre: nombreCategoria },
        });
        categoriasMap[nombreCategoria] = nuevaCategoria.id;
      }
    } catch (error: any) {
      if (error.code !== "P2002") {
        throw error;
      }
      const categoriaExistente = await prisma.categoria.findUnique({
        where: { nombre: nombreCategoria },
      });
      if (categoriaExistente) {
        categoriasMap[nombreCategoria] = categoriaExistente.id;
      }
    }
  }

  const materiales = [
    {
      nombre: "Algodón Premium 240g",
      url_imagen: null,
      categoriaId: categoriasMap["Tela"],
      unidadMedida: "metros",
      ancho: 150,
      peso: 2.5,
      colores: ["Blanco", "Negro", "Azul", "Rojo", "Beige"],
      proveedor: "Textil S.A.",
      precio: 350.5,
    },
    {
      nombre: "Poliéster Deportivo",
      url_imagen: null,
      categoriaId: categoriasMap["Tela"],
      unidadMedida: "metros",
      ancho: 140,
      peso: 1.8,
      colores: ["Negro", "Blanco", "Gris", "Azul Marino"],
      proveedor: "Deportes Textiles",
      precio: 280.0,
    },
  ];

  for (const material of materiales) {
    try {
      await prisma.material.create({ data: material as any });
    } catch (error: any) {
      if (error.code !== "P2002") {
        throw error;
      }
    }
  }

  const colecciones = [
    {
      nombre: "Verano 2026",
      imagen:
        "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/post-instagram-primavera-nueva-colecci%C3%B3n-design-template-59d147b6a8afea754918bd73c268e55d_screen.jpg?ts=1614790769",
      icono: "Sun",
      codigo: 1,
    },
    {
      nombre: "Invierno 2026",
      imagen:
        "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/post-instagram-primavera-nueva-colecci%C3%B3n-design-template-59d147b6a8afea754918bd73c268e55d_screen.jpg?ts=1614790769",
      icono: "CloudSnow",
      codigo: 2,
    },
  ];

  for (const coleccion of colecciones) {
    try {
      const existe = await prisma.coleccion.findFirst({
        where: { codigo: coleccion.codigo },
      });
      if (!existe) {
        await prisma.coleccion.create({
          data: coleccion,
        });
      }
    } catch (error: any) {
      if (error.code !== "P2002") {
        throw error;
      }
    }
  }

  const productos = [
    {
      codigo: 1,
      nombre: "Camiseta Básica",
      descripcion: "Camiseta de algodón unisex",
      activo: true,
      imagen:
        "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/post-instagram-primavera-nueva-colecci%C3%B3n-design-template-59d147b6a8afea754918bd73c268e55d_screen.jpg?ts=1614790769",
      coleccionId: 1,
      tallas: ["S", "M", "L"],
      colores: ["Blanco", "Negro"],
      materiales: {
        create: [
          { materialId: 1, cantidad: 1.5 },
          { materialId: 2, cantidad: 0.2 },
        ],
      },
      mermaCantidad: 0.1,
      mermaUnidad: "m",
      mermaPrecio: 500,
      tarifaCosto: 12000,
      tarifaHoras: 0.8,
      precio: 15000,
    },
    {
      codigo: 2,
      nombre: "Pantalón Casual",
      descripcion: "Pantalón cómodo para uso diario",
      activo: true,
      imagen:
        "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/post-instagram-primavera-nueva-colecci%C3%B3n-design-template-59d147b6a8afea754918bd73c268e55d_screen.jpg?ts=1614790769",
      coleccionId: 1,
      tallas: ["30", "32", "34"],
      colores: ["Azul", "Negro"],
      materiales: {
        create: [{ materialId: 1, cantidad: 2.0 }],
      },
      mermaCantidad: 0.2,
      mermaUnidad: "m",
      mermaPrecio: 800,
      tarifaCosto: 18000,
      tarifaHoras: 1.0,
      precio: 28000,
    },
  ];

  for (const producto of productos) {
    try {
      const existe = await prisma.producto.findFirst({
        where: { codigo: producto.codigo },
      });
      if (!existe) {
        await prisma.producto.create({
          data: producto,
        });
      }
    } catch (error: any) {
      if (error.code !== "P2002") {
        throw error;
      }
    }
  }

  const users = [
    {
      email: "test@example.com",
      name: "testQA",
      password: "test1234",
      role: Role.ADMIN,
    },
    {
      email: "admin@konfex.com",
      name: "Administrador",
      password: "Admin123!",
      role: Role.ADMIN,
    },
  ];

  for (const user of users) {
    try {
      const existe = await UserRepository.findByEmail(user.email);
      if (!existe) {
        await UserRepository.create(user);
      }
    } catch (error: any) {
      if (error.code !== "P2002") {
        throw error;
      }
    }
  }

  const impuestoGeneral = {
    nombre: "IVA",
    porcentaje: 19,
  };

  try {
    const existe = await impuestoGeneralRepository.findFirst();
    if (!existe) {
      await impuestoGeneralRepository.create(impuestoGeneral);
    }
  } catch (error: any) {
    if (error.code !== "P2002") {
      throw error;
    }
  }

  const gastosNegocio = [
    {
      nombre: "Gastos Generales",
      porcentaje: 15,
    },
    {
      nombre: "Gastos Administrativos",
      porcentaje: 10,
    },
  ];

  for (const gasto of gastosNegocio) {
    try {
      const existe = await gastosNegocioRepository.findAll();
      const yaExiste = existe.some((g) => g.nombre === gasto.nombre);
      if (!yaExiste) {
        await gastosNegocioRepository.create(gasto);
      }
    } catch (error: any) {
      if (error.code !== "P2002") {
        throw error;
      }
    }
  }

  const clientesCreados = await clienteRepository.findAll();
  const productosCreados = await productoRepository.findAll();
  const materialesCreados = await materialRepository.findAll();
  const gastosNegocioCreados = await gastosNegocioRepository.findAll();

  const presupuestos = [
    {
      numeroPresupuesto: 1001,
      nombre: "Presupuesto Colección Verano 2024",
      clienteId: clientesCreados[0]?.id || null,
      fechaVencimiento: new Date("2024-12-31"),
      estado: EstadoPresupuesto.ENVIADO,
      margenGananciaPorcentaje: 30.0,
      gastosNegocioId: gastosNegocioCreados[0]?.id || 1,
      totalCosto: 25000.0,
      ganancias: 8625.0,
      notas: "Presupuesto para colección de verano",
      detalles: [
        {
          productoId: productosCreados[0]?.id || 1,
          descripcion: "Pantalón Casual - Talla M",
          cantidad: 5,
          costoUnitario: 5000.0,
        },
      ],
      adicionales: [
        {
          nombre: "Embalaje especial",
          cantidad: 1,
          monto: 5000.0,
          totalCosto: 5000.0,
          observaciones: "Embalaje reforzado para envío",
        },
      ],
    },
    {
      numeroPresupuesto: 1002,
      nombre: "Presupuesto Pedido Mayorista",
      clienteId: clientesCreados[1]?.id || null,
      fechaVencimiento: new Date("2024-12-15"),
      estado: EstadoPresupuesto.ACEPTADO,
      margenGananciaPorcentaje: 25.0,
      gastosNegocioId: gastosNegocioCreados[1]?.id || 1,
      totalCosto: 18000.0,
      ganancias: 5040.0,
      notas: "Pedido mayorista",
      detalles: [
        {
          productoId: productosCreados[1]?.id || 2,
          descripcion: "Camiseta Deportiva - Varias tallas",
          cantidad: 10,
          costoUnitario: 1800.0,
        },
      ],
      adicionales: [],
    },
  ];

  const impuestoActivo = await impuestoGeneralRepository.findFirst();
  const ivaPorcentaje = impuestoActivo?.porcentaje || 0;

  for (const presupuesto of presupuestos) {
    const { detalles, adicionales, clienteId, gastosNegocioId, ...presupuestoData } = presupuesto;

    const detallesValidos = (detalles || []).filter((detalle) => {
      const productoExiste = productosCreados.some((p) => p.id === detalle.productoId);
      if (!productoExiste) {
      }
      return productoExiste;
    });

    if (detallesValidos.length === 0 && (detalles || []).length > 0) {
      continue;
    }

    const gastoNegocio =
      gastosNegocioCreados.find((g) => g.id === gastosNegocioId) || gastosNegocioCreados[0];
    const gastosIndirectosPorcentaje = gastoNegocio?.porcentaje || 15;

    const costosIndirectos = presupuestoData.totalCosto * (gastosIndirectosPorcentaje / 100);
    const subtotal = presupuestoData.totalCosto + costosIndirectos + presupuestoData.ganancias;
    const iva = subtotal * (ivaPorcentaje / 100);
    const totalFinal = subtotal + iva;

    try {
      const existe = await prisma.presupuesto.findUnique({
        where: { numeroPresupuesto: presupuesto.numeroPresupuesto },
      });
      if (!existe) {
        await PresupuestoRepository.create({
          data: {
            ...presupuestoData,
            clienteId: clienteId ?? null,
            gastosNegocioId: gastosNegocioId || gastosNegocioCreados[0]?.id || 1,
            costosIndirectos,
            iva,
            totalFinal,
            detalles: detallesValidos.length > 0 ? detallesValidos : detalles || [],
            adicionales: adicionales || [],
          },
        });
      }
    } catch (error: any) {
      if (error.code !== "P2002" && error.code !== "P2003") {
        throw error;
      }
    }
  }

  if (productosCreados.length > 0 && materialesCreados.length > 0) {
    const materialPorProducto = [
      {
        productoId: productosCreados[0]?.id || 1,
        materialId: materialesCreados[0]?.id || 1,
        cantidad: 2.5,
      },
      {
        productoId: productosCreados[1]?.id || 2,
        materialId: materialesCreados[1]?.id || 2,
        cantidad: 1.5,
      },
    ];

    for (const relacion of materialPorProducto) {
      try {
        await prisma.materialPorProducto.upsert({
          where: {
            productoId_materialId: {
              productoId: relacion.productoId,
              materialId: relacion.materialId,
            },
          },
          update: {},
          create: relacion,
        });
      } catch (error: any) {
        if (error.code !== "P2002") {
          throw error;
        }
      }
    }
  }

  const presupuestosAceptados = await prisma.presupuesto.findMany({
    where: { estado: EstadoPresupuesto.ACEPTADO },
    include: { detalles: true },
  });

  for (const presupuesto of presupuestosAceptados) {
    if (!presupuesto.clienteId) continue;

    try {
      const existe = await prisma.pedido.findUnique({
        where: { presupuestoId: presupuesto.id },
      });
      if (!existe) {
        const pedido = await prisma.pedido.create({
          data: {
            presupuestoId: presupuesto.id,
            clienteId: presupuesto.clienteId,
            estado: EstadoPedido.NO_VISTO,
            pagado: false,
            fechaEntregaEstimada: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000),
            detalles: {
              create: presupuesto.detalles.map((detalle) => ({
                productoId: detalle.productoId,
                cantidad: detalle.cantidad,
                talle: "M",
                color: "Negro",
                costoUnitario: detalle.costoUnitario,
                precioUnitario: detalle.costoUnitario * 1.4,
                subtotal: detalle.cantidad * detalle.costoUnitario * 1.4,
              })),
            },
          },
          include: { detalles: true },
        });

        const etapas = [
          {
            pedidoId: pedido.id,
            etapa: "Corte",
            fechaInicio: new Date(),
            responsable: "Juan Pérez",
          },
          {
            pedidoId: pedido.id,
            etapa: "Confección",
          },
          {
            pedidoId: pedido.id,
            etapa: "Terminación",
          },
        ];

        for (const etapa of etapas) {
          try {
            await prisma.produccionEtapa.create({
              data: etapa,
            });
          } catch (error: any) {
            if (error.code !== "P2002") {
              throw error;
            }
          }
        }
      }
    } catch (error: any) {
      if (error.code !== "P2002") {
        throw error;
      }
    }
  }

  const telegramMessages = [
    {
      chatId: "123456789",
      clienteId: clientesCreados[0]?.id || null,
      firstName: "Claudia",
      lastName: "Muñoz",
      username: "claudia_munoz",
      text: "Hola, me interesa ver el catálogo de productos",
      source: "telegram",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      chatId: "987654321",
      clienteId: clientesCreados[1]?.id || null,
      firstName: "Carlos",
      lastName: "Rojas",
      username: "carlos_rojas",
      text: "Necesito un presupuesto para 50 unidades",
      source: "telegram",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const message of telegramMessages) {
    try {
      await prisma.telegramMessage.create({
        data: message,
      });
    } catch (error: any) {
      if (error.code !== "P2002") {
        throw error;
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log("Seed completed");
  })
  .catch(async (e) => {
    console.error("Seed failed:");
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
