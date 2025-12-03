import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  Role,
  EstadoPresupuesto,
} from "../generated/prisma/client";
import bcrypt from "bcrypt";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("Missing required environment variable: DATABASE_URL");
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding database...");

  // Clientes
  const clientes = [
    {
      nombre: "Claudia Muñoz",
      telefono: "987112233",
      email: "claudia.munoz@example.com",
      origen: "Instagram",
      instagramUser: "@claudia_munoz_cl",
      notas: "Interesada en colecciones de temporada",
    },
    {
      nombre: "Carlos Rojas",
      telefono: "987445566",
      email: "carlos.rojas@example.com",
      origen: "Facebook",
      instagramUser: "@carlos_rojas",
      notas: "Compra mayorista",
    },
    {
      nombre: "María Pérez",
      telefono: "987778899",
      email: "maria.perez@example.com",
      origen: "TikTok",
      instagramUser: "@maria_p",
      notas: "Consulta sobre talles grandes",
    },
    {
      nombre: "Juan López",
      telefono: "987334455",
      email: "juan.lopez@example.com",
      origen: "Instagram",
      instagramUser: "@juan_lopez",
      notas: "Quiere ver catálogo de invierno",
    },
    {
      nombre: "Sofía Díaz",
      telefono: "987556677",
      email: "sofia.diaz@example.com",
      origen: "Facebook",
      instagramUser: "@sofia_d",
      notas: "Interesada en accesorios",
    },
    {
      nombre: "Pedro Martínez",
      telefono: "987889900",
      email: "pedro.martinez@example.com",
      origen: "Instagram",
      instagramUser: "@pedro_m",
      notas: "Compra al por mayor",
    },
    {
      nombre: "Ana Torres",
      telefono: "987223344",
      email: "ana.torres@example.com",
      origen: "Web",
      instagramUser: "@ana_torres",
      notas: "Primer pedido online",
    },
  ];

  for (const cliente of clientes) {
    try {
      await prisma.cliente.create({ data: cliente });
    } catch (error: any) {
      // Ignorar errores de duplicados
      if (error.code !== "P2002") {
        throw error;
      }
    }
  }

  // Productos
  const productos = [
    {
      nombre: "Pantalón Casual",
      descripcion: "Pantalón cómodo de algodón",
      activo: true,
      tallas: ["S", "M", "L", "XL"],
      colores: ["Azul", "Negro", "Beige"],
    },
    {
      nombre: "Camiseta Deportiva",
      descripcion: "Camiseta ligera para entrenamiento",
      activo: true,
      tallas: ["XS", "S", "M", "L"],
      colores: ["Rojo", "Negro", "Blanco"],
    },
  ];

  for (const producto of productos) {
    await prisma.producto.upsert({
      where: { nombre: producto.nombre },
      update: {},
      create: producto,
    });
  }

  // Materiales
  const materiales = [
    {
      nombre: "Algodón Premium 240g",
      url_imagen: null,
      categoria: "Tela",
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
      categoria: "Tela",
      unidadMedida: "metros",
      ancho: 140,
      peso: 1.8,
      colores: ["Negro", "Blanco", "Gris", "Azul Marino"],
      proveedor: "Deportes Textiles",
      precio: 280.0,
    },
    {
      nombre: "Lycra Elástica",
      url_imagen: null,
      categoria: "Tela",
      unidadMedida: "metros",
      ancho: 160,
      peso: 1.2,
      colores: ["Negro", "Blanco", "Rosa", "Azul", "Verde"],
      proveedor: "Elásticos Premium",
      precio: 420.75,
    },
    {
      nombre: "Hilo de Algodón 40/2",
      url_imagen: null,
      categoria: "Hilo",
      unidadMedida: "carretes",
      ancho: null,
      peso: null,
      colores: ["Blanco", "Negro", "Azul", "Rojo", "Verde", "Amarillo"],
      proveedor: "Hilos y Más",
      precio: 45.0,
    },
    {
      nombre: "Cierres Metálicos #5",
      url_imagen: null,
      categoria: "Accesorio",
      unidadMedida: "unidades",
      ancho: null,
      peso: null,
      colores: ["Negro", "Blanco", "Plata", "Dorado"],
      proveedor: "Accesorios Textiles",
      precio: 12.5,
    },
    {
      nombre: "Botones de Madera 15mm",
      url_imagen: null,
      categoria: "Accesorio",
      unidadMedida: "unidades",
      ancho: null,
      peso: null,
      colores: ["Natural", "Negro", "Blanco", "Marrón"],
      proveedor: "Accesorios Textiles",
      precio: 8.0,
    },
    {
      nombre: "Jean Denim 12oz",
      url_imagen: null,
      categoria: "Tela",
      unidadMedida: "metros",
      ancho: 150,
      peso: 3.0,
      colores: ["Azul Claro", "Azul Oscuro", "Negro", "Blanco"],
      proveedor: "Denim Factory",
      precio: 480.0,
    },
    {
      nombre: "Forro Polar 200g",
      url_imagen: null,
      categoria: "Tela",
      unidadMedida: "metros",
      ancho: 150,
      peso: 2.0,
      colores: ["Negro", "Gris", "Azul", "Rojo", "Verde"],
      proveedor: "Textil S.A.",
      precio: 320.0,
    },
  ];

  for (const material of materiales) {
    try {
      await prisma.material.create({ data: material as any });
    } catch (error: any) {
      // Ignorar errores de duplicados
      if (error.code !== "P2002") {
        throw error;
      }
    }
  }

  // Usuarios
  const users = [
    {
      email: "mia@mail.com",
      name: "testQA",
      password: "030914Km$",
      role: Role.ADMIN,
    },
    {
      email: "testqa1@example.com",
      name: "testQA",
      password: "testQA1!",
      role: Role.ADMIN,
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        role: user.role,
      },
    });
  }

  // Obtener clientes y productos creados para las relaciones
  const clientesCreados = await prisma.cliente.findMany();
  const productosCreados = await prisma.producto.findMany();

  // Presupuestos
  const presupuestos = [
    {
      numeroPresupuesto: 1001,
      clienteId: clientesCreados[0]?.id || 1,
      fechaVencimiento: new Date("2024-12-31"),
      estado: EstadoPresupuesto.ENVIADO,
      margenGananciaPorcentaje: 30.0,
      gastosIndirectosPorcentaje: 15.0,
      totalCosto: 25000.0,
      totalVenta: 37375.0,
      notas: "Presupuesto para colección de verano",
      detalles: [
        {
          productoId: productosCreados[0]?.id || 1,
          descripcion: "Pantalón Casual - Talla M",
          cantidad: 5,
          costoUnitario: 5000.0,
        },
      ],
    },
    {
      numeroPresupuesto: 1002,
      clienteId: clientesCreados[1]?.id || 2,
      fechaVencimiento: new Date("2024-12-15"),
      estado: EstadoPresupuesto.ACEPTADO,
      margenGananciaPorcentaje: 25.0,
      gastosIndirectosPorcentaje: 12.0,
      totalCosto: 18000.0,
      totalVenta: 25200.0,
      notas: "Pedido mayorista",
      detalles: [
        {
          productoId: productosCreados[1]?.id || 2,
          descripcion: "Camiseta Deportiva - Varias tallas",
          cantidad: 10,
          costoUnitario: 1800.0,
        },
      ],
    },
    {
      numeroPresupuesto: 1003,
      clienteId: clientesCreados[2]?.id || 3,
      fechaVencimiento: new Date("2025-01-15"),
      estado: EstadoPresupuesto.BORRADOR,
      margenGananciaPorcentaje: 35.0,
      gastosIndirectosPorcentaje: 18.0,
      totalCosto: 32000.0,
      totalVenta: 48960.0,
      notas: "Presupuesto en revisión",
      detalles: [
        {
          productoId: productosCreados[0]?.id || 1,
          descripcion: "Pantalón Casual - Talla XL",
          cantidad: 8,
          costoUnitario: 4000.0,
        },
      ],
    },
    {
      numeroPresupuesto: 1004,
      clienteId: clientesCreados[3]?.id || 4,
      fechaVencimiento: new Date("2024-11-30"),
      estado: EstadoPresupuesto.VENCIDO,
      margenGananciaPorcentaje: 28.0,
      gastosIndirectosPorcentaje: 14.0,
      totalCosto: 15000.0,
      totalVenta: 20520.0,
      notas: "Presupuesto vencido",
      detalles: [
        {
          productoId: productosCreados[1]?.id || 2,
          descripcion: "Camiseta Deportiva - Talla L",
          cantidad: 6,
          costoUnitario: 2500.0,
        },
      ],
    },
    {
      numeroPresupuesto: 1005,
      clienteId: clientesCreados[4]?.id || 5,
      fechaVencimiento: new Date("2025-02-28"),
      estado: EstadoPresupuesto.ENVIADO,
      margenGananciaPorcentaje: 32.0,
      gastosIndirectosPorcentaje: 16.0,
      totalCosto: 42000.0,
      totalVenta: 62160.0,
      notas: "Presupuesto para accesorios",
      detalles: [
        {
          productoId: productosCreados[0]?.id || 1,
          descripcion: "Pantalón Casual - Varias tallas",
          cantidad: 12,
          costoUnitario: 3500.0,
        },
      ],
    },
  ];

  for (const presupuesto of presupuestos) {
    const { detalles, ...presupuestoData } = presupuesto;
    await prisma.presupuesto.upsert({
      where: { numeroPresupuesto: presupuesto.numeroPresupuesto },
      update: {},
      create: {
        ...presupuestoData,
        detalles: detalles
          ? {
              create: detalles.map((detalle) => ({
                productoId: detalle.productoId,
                descripcion: detalle.descripcion,
                cantidad: detalle.cantidad,
                costoUnitario: detalle.costoUnitario,
              })),
            }
          : undefined,
      } as any,
    });
  }

  // Obtener presupuestos creados para las calculadoras
  const presupuestosCreados = await prisma.presupuesto.findMany({
    orderBy: { numeroPresupuesto: "asc" },
  });

  // Calculadoras
  const calculadoras = [
    {
      clienteId: clientesCreados[0]?.id || 1,
      numeroPresupuesto: presupuestosCreados[0]?.numeroPresupuesto || 1001,
      precioPrendaNeto: 15000.5,
      horasTrabajo: 8.5,
      porcentaje: 15.0,
      gastoAdicional: 5000.0,
      gastoEnvio: 3000.0,
    },
    {
      clienteId: clientesCreados[1]?.id || 2,
      numeroPresupuesto: presupuestosCreados[1]?.numeroPresupuesto || 1002,
      precioPrendaNeto: 12000.0,
      horasTrabajo: 6.0,
      porcentaje: 20.0,
      gastoAdicional: 3000.0,
      gastoEnvio: 2000.0,
    },
    {
      clienteId: clientesCreados[2]?.id || 3,
      numeroPresupuesto: presupuestosCreados[2]?.numeroPresupuesto || 1003,
      precioPrendaNeto: 18000.0,
      horasTrabajo: 10.0,
      porcentaje: 18.0,
      gastoAdicional: 6000.0,
      gastoEnvio: 4000.0,
    },
    {
      clienteId: clientesCreados[3]?.id || 4,
      numeroPresupuesto: presupuestosCreados[3]?.numeroPresupuesto || 1004,
      precioPrendaNeto: 10000.0,
      horasTrabajo: 5.5,
      porcentaje: 12.0,
      gastoAdicional: 2500.0,
      gastoEnvio: 1500.0,
    },
    {
      clienteId: clientesCreados[4]?.id || 5,
      numeroPresupuesto: presupuestosCreados[4]?.numeroPresupuesto || 1005,
      precioPrendaNeto: 22000.0,
      horasTrabajo: 12.0,
      porcentaje: 25.0,
      gastoAdicional: 8000.0,
      gastoEnvio: 5000.0,
    },
  ];

  for (const calculadora of calculadoras) {
    await prisma.calculadora.create({
      data: calculadora,
    });
  }

  console.log("Database seeded successfully");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
