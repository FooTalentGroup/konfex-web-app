import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  Role,
  EstadoPresupuesto,
  EstadoPedido,
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

   // Mano de Obra
   const manoDeObra = [
    {
      nombre: "Costurera Principal",
      costoHora: 15000.0,
    },
    {
      nombre: "Diseñador de Patrones",
      costoHora: 20000.0,
    },
    {
      nombre: "Cortador",
      costoHora: 12000.0,
    },
    {
      nombre: "Terminador",
      costoHora: 10000.0,
    },
  ];

  for (const mano of manoDeObra) {
    try {
      const existe = await prisma.manoDeObra.findFirst({
        where: { nombre: mano.nombre },
      });
      if (!existe) {
        await prisma.manoDeObra.create({ data: mano });
      }
    } catch (error: any) {
      if (error.code !== "P2002") {
        throw error;
      }
    }
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

  // Colecciones
  const colecciones = [
    { nombre: "Verano 2026", imagen: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/post-instagram-primavera-nueva-colecci%C3%B3n-design-template-59d147b6a8afea754918bd73c268e55d_screen.jpg?ts=1614790769", icono: "Sun", codigo:1 },
    { nombre: "Invierno 2026", imagen: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/post-instagram-primavera-nueva-colecci%C3%B3n-design-template-59d147b6a8afea754918bd73c268e55d_screen.jpg?ts=1614790769", icono: "CloudSnow", codigo: 2 },
  ];

  for (const coleccion of colecciones) {
    await prisma.coleccion.create({
      data: coleccion,
    });
  }

  // productos
  const productos = [
    // Colección 1
    {
      codigo: 1,
      nombre: "Camiseta Básica",
      descripcion: "Camiseta de algodón unisex",
      activo: true,
      imagen: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/post-instagram-primavera-nueva-colecci%C3%B3n-design-template-59d147b6a8afea754918bd73c268e55d_screen.jpg?ts=1614790769",
      coleccionId: 1,
      tallas: ["S", "M", "L"],
      colores: ["Blanco", "Negro"],
      materiales: {
        create: [
          { materialId: 1, cantidad: 1.5 },
          { materialId: 2, cantidad: 0.2 },
        ],
      },
      manoDeObra: {
        create: [
          { manoDeObraId: 1, cantidadHoras: 0.5 },
          { manoDeObraId: 2, cantidadHoras: 0.3 },
        ],
      },
      mermaCantidad: 0.1,
      mermaUnidad: "m",
      mermaPrecio: 500,
    },
    {
      codigo: 2,
      nombre: "Pantalón Casual",
      descripcion: "Pantalón cómodo para uso diario",
      activo: true,
      imagen: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/post-instagram-primavera-nueva-colecci%C3%B3n-design-template-59d147b6a8afea754918bd73c268e55d_screen.jpg?ts=1614790769",
      coleccionId: 1,
      tallas: ["30", "32", "34"],
      colores: ["Azul", "Negro"],
      materiales: {
        create: [{ materialId: 1, cantidad: 2.0 }],
      },
      manoDeObra: {
        create: [
          { manoDeObraId: 1, cantidadHoras: 0.6 },
          { manoDeObraId: 2, cantidadHoras: 0.4 },
        ],
      },
      mermaCantidad: 0.2,
      mermaUnidad: "m",
      mermaPrecio: 800,
    },
    {
      codigo: 3,
      nombre: "Chaqueta Ligera",
      descripcion: "Chaqueta ligera para primavera",
      activo: true,
      imagen: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/post-instagram-primavera-nueva-colecci%C3%B3n-design-template-59d147b6a8afea754918bd73c268e55d_screen.jpg?ts=1614790769",
      coleccionId: 1,
      tallas: ["S", "M", "L"],
      colores: ["Verde", "Negro"],
      materiales: {
        create: [{ materialId: 3, cantidad: 1.2 }],
      },
      manoDeObra: {
        create: [
          { manoDeObraId: 1, cantidadHoras: 0.7 },
          { manoDeObraId: 3, cantidadHoras: 0.5 },
        ],
      },
      mermaCantidad: 0.15,
      mermaUnidad: "m",
      mermaPrecio: 600,
    },
  
    // Colección 2
    {
      codigo: 4,
      nombre: "Camiseta Básica Verano",
      descripcion: "Camiseta ligera para verano",
      activo: true,
      imagen: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/post-instagram-primavera-nueva-colecci%C3%B3n-design-template-59d147b6a8afea754918bd73c268e55d_screen.jpg?ts=1614790769",
      coleccionId: 2,
      tallas: ["S", "M", "L"],
      colores: ["Amarillo", "Blanco"],
      materiales: {
        create: [
          { materialId: 1, cantidad: 1.3 },
          { materialId: 2, cantidad: 0.2 },
        ],
      },
      manoDeObra: {
        create: [
          { manoDeObraId: 1, cantidadHoras: 0.5 },
          { manoDeObraId: 2, cantidadHoras: 0.3 },
        ],
      },
      mermaCantidad: 0.1,
      mermaUnidad: "m",
      mermaPrecio: 500,
    },
    {
      codigo: 5,
      nombre: "Pantalón Jeans",
      descripcion: "Jeans clásico azul",
      activo: true,
      imagen: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/post-instagram-primavera-nueva-colecci%C3%B3n-design-template-59d147b6a8afea754918bd73c268e55d_screen.jpg?ts=1614790769",
      coleccionId: 2,
      tallas: ["30", "32", "34"],
      colores: ["Azul"],
      materiales: {
        create: [{ materialId: 1, cantidad: 2.0 }],
      },
      manoDeObra: {
        create: [
          { manoDeObraId: 1, cantidadHoras: 0.5 },
          { manoDeObraId: 2, cantidadHoras: 0.3 },
        ],
      },
      mermaCantidad: 0.2,
      mermaUnidad: "m",
      mermaPrecio: 800,
    },
    {
      codigo: 6,
      nombre: "Short Deportivo",
      descripcion: "Short cómodo para deporte",
      activo: true,
      imagen: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/post-instagram-primavera-nueva-colecci%C3%B3n-design-template-59d147b6a8afea754918bd73c268e55d_screen.jpg?ts=1614790769",
      coleccionId: 2,
      tallas: ["S", "M", "L"],
      colores: ["Negro", "Azul"],
      materiales: {
        create: [{ materialId: 3, cantidad: 1.0 }],
      },
      manoDeObra: {
        create: [
          { manoDeObraId: 1, cantidadHoras: 0.4 },
          { manoDeObraId: 3, cantidadHoras: 0.3 },
        ],
      },
      mermaCantidad: 0.12,
      mermaUnidad: "m",
      mermaPrecio: 400,
    },
  ];
  

  for (const producto of productos) {
    await prisma.producto.create({
      data: producto,
    });
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


  // Impuesto General (solo uno activo)
  console.log("Seeding ImpuestoGeneral...");
  const impuestoGeneral = {
    nombre: "IVA",
    porcentaje: 19,
  };

  try {
    const existe = await prisma.impuestoGeneral.findFirst();
    if (!existe) {
      await prisma.impuestoGeneral.create({ data: impuestoGeneral });
      console.log("ImpuestoGeneral creado:", impuestoGeneral);
    } else {
      console.log("ImpuestoGeneral ya existe, omitiendo...");
    }
  } catch (error: any) {
    if (error.code !== "P2002") {
      throw error;
    }
  }

  // Gastos de Negocio
  console.log("Seeding GastosNegocio...");
  const gastosNegocio = [
    {
      nombre: "Gastos Generales",
      porcentaje: 15,
    },
    {
      nombre: "Gastos Administrativos",
      porcentaje: 10,
    },
    {
      nombre: "Gastos de Operación",
      porcentaje: 12,
    },
    {
      nombre: "Gastos Fijos",
      porcentaje: 8,
    },
  ];

  for (const gasto of gastosNegocio) {
    try {
      await prisma.gastosNegocio.create({ data: gasto });
      console.log("GastosNegocio creado:", gasto);
    } catch (error: any) {
      if (error.code !== "P2002") {
        throw error;
      }
    }
  }

  // Obtener clientes, productos y materiales creados para las relaciones
  const clientesCreados = await prisma.cliente.findMany();
  const productosCreados = await prisma.producto.findMany();
  const materialesCreados = await prisma.material.findMany();
  const manoDeObraCreada = await prisma.manoDeObra.findMany();

  // Presupuestos
  const presupuestos = [
    {
      numeroPresupuesto: 1001,
      nombre: "Presupuesto Colección Verano 2024",
      clienteId: clientesCreados[0]?.id || 1,
      fechaVencimiento: new Date("2024-12-31"),
      estado: EstadoPresupuesto.ENVIADO,
      margenGananciaPorcentaje: 30.0,
      gastosIndirectosPorcentaje: 15.0,
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
      clienteId: clientesCreados[1]?.id || 2,
      fechaVencimiento: new Date("2024-12-15"),
      estado: EstadoPresupuesto.ACEPTADO,
      margenGananciaPorcentaje: 25.0,
      gastosIndirectosPorcentaje: 12.0,
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
    {
      numeroPresupuesto: 1003,
      nombre: "Presupuesto Revisión",
      clienteId: clientesCreados[2]?.id || 3,
      fechaVencimiento: new Date("2025-01-15"),
      estado: EstadoPresupuesto.BORRADOR,
      margenGananciaPorcentaje: 35.0,
      gastosIndirectosPorcentaje: 18.0,
      totalCosto: 32000.0,
      ganancias: 13216.0,
      notas: "Presupuesto en revisión",
      detalles: [
        {
          productoId: productosCreados[0]?.id || 1,
          descripcion: "Pantalón Casual - Talla XL",
          cantidad: 8,
          costoUnitario: 4000.0,
        },
      ],
      adicionales: [
        {
          nombre: "Etiquetas personalizadas",
          cantidad: 100,
          monto: 50.0,
          totalCosto: 5000.0,
          observaciones: "Etiquetas con logo del cliente",
        },
      ],
    },
    {
      numeroPresupuesto: 1004,
      nombre: "Presupuesto Vencido",
      clienteId: clientesCreados[3]?.id || 4,
      fechaVencimiento: new Date("2024-11-30"),
      estado: EstadoPresupuesto.VENCIDO,
      margenGananciaPorcentaje: 28.0,
      gastosIndirectosPorcentaje: 14.0,
      totalCosto: 15000.0,
      ganancias: 4788.0,
      notas: "Presupuesto vencido",
      detalles: [
        {
          productoId: productosCreados[1]?.id || 2,
          descripcion: "Camiseta Deportiva - Talla L",
          cantidad: 6,
          costoUnitario: 2500.0,
        },
      ],
      adicionales: [],
    },
    {
      numeroPresupuesto: 1005,
      nombre: "Presupuesto Accesorios",
      clienteId: clientesCreados[4]?.id || 5,
      fechaVencimiento: new Date("2025-02-28"),
      estado: EstadoPresupuesto.ENVIADO,
      margenGananciaPorcentaje: 32.0,
      gastosIndirectosPorcentaje: 16.0,
      totalCosto: 42000.0,
      ganancias: 15590.4,
      notas: "Presupuesto para accesorios",
      detalles: [
        {
          productoId: productosCreados[0]?.id || 1,
          descripcion: "Pantalón Casual - Varias tallas",
          cantidad: 12,
          costoUnitario: 3500.0,
        },
      ],
      adicionales: [
        {
          nombre: "Bolsas de tela",
          cantidad: 50,
          monto: 200.0,
          totalCosto: 10000.0,
          observaciones: "Bolsas ecológicas para empaque",
        },
        {
          nombre: "Tarjetas de agradecimiento",
          cantidad: 50,
          monto: 50.0,
          totalCosto: 2500.0,
          observaciones: null,
        },
      ],
    },
  ];

  // Obtener el impuesto general para calcular IVA
  const impuestoActivo = await prisma.impuestoGeneral.findFirst();
  const ivaPorcentaje = impuestoActivo?.porcentaje || 0;

  for (const presupuesto of presupuestos) {
    const { detalles, adicionales, clienteId, ...presupuestoData } =
      presupuesto;

    // Calcular IVA y totalFinal
    // Calcular costos indirectos desde el porcentaje
    const costosIndirectos =
      presupuestoData.totalCosto *
      (presupuestoData.gastosIndirectosPorcentaje / 100);
    const subtotal =
      presupuestoData.totalCosto + costosIndirectos + presupuestoData.ganancias;
    const iva = subtotal * (ivaPorcentaje / 100);
    const totalFinal = subtotal + iva;

    await prisma.presupuesto.upsert({
      where: { numeroPresupuesto: presupuesto.numeroPresupuesto },
      update: {},
      create: {
        ...presupuestoData,
        clienteId: clienteId ?? null,
        iva,
        totalFinal,
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
        adicionales: adicionales
          ? {
              create: adicionales.map((adicional) => ({
                nombre: adicional.nombre,
                cantidad: adicional.cantidad,
                monto: adicional.monto,
                totalCosto: adicional.totalCosto,
                observaciones: adicional.observaciones,
              })),
            }
          : undefined,
      } as any,
    });
  }

  // MaterialPorProducto - Relaciones entre productos y materiales
  if (productosCreados.length > 0 && materialesCreados.length > 0) {
    const materialPorProducto = [
      {
        productoId: productosCreados[0]?.id || 1, // Pantalón Casual
        materialId: materialesCreados[0]?.id || 1, // Algodón Premium
        cantidad: 2.5, // metros
      },
      {
        productoId: productosCreados[0]?.id || 1, // Pantalón Casual
        materialId: materialesCreados[3]?.id || 4, // Hilo de Algodón
        cantidad: 0.5, // carretes
      },
      {
        productoId: productosCreados[0]?.id || 1, // Pantalón Casual
        materialId: materialesCreados[4]?.id || 5, // Cierres Metálicos
        cantidad: 1, // unidades
      },
      {
        productoId: productosCreados[1]?.id || 2, // Camiseta Deportiva
        materialId: materialesCreados[1]?.id || 2, // Poliéster Deportivo
        cantidad: 1.5, // metros
      },
      {
        productoId: productosCreados[1]?.id || 2, // Camiseta Deportiva
        materialId: materialesCreados[3]?.id || 4, // Hilo de Algodón
        cantidad: 0.3, // carretes
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

  // ManoDeObraPorProducto - Relaciones entre productos y mano de obra
  if (productosCreados.length > 0 && manoDeObraCreada.length > 0) {
    const manoDeObraPorProducto = [
      {
        productoId: productosCreados[0]?.id || 1, // Pantalón Casual
        manoDeObraId: manoDeObraCreada[1]?.id || 2, // Diseñador de Patrones
        cantidadHoras: 2.0,
        costoHora: 20000.0,
      },
      {
        productoId: productosCreados[0]?.id || 1, // Pantalón Casual
        manoDeObraId: manoDeObraCreada[2]?.id || 3, // Cortador
        cantidadHoras: 1.5,
        costoHora: 12000.0,
      },
      {
        productoId: productosCreados[0]?.id || 1, // Pantalón Casual
        manoDeObraId: manoDeObraCreada[0]?.id || 1, // Costurera Principal
        cantidadHoras: 4.0,
        costoHora: 15000.0,
      },
      {
        productoId: productosCreados[0]?.id || 1, // Pantalón Casual
        manoDeObraId: manoDeObraCreada[3]?.id || 4, // Terminador
        cantidadHoras: 1.0,
        costoHora: 10000.0,
      },
      {
        productoId: productosCreados[1]?.id || 2, // Camiseta Deportiva
        manoDeObraId: manoDeObraCreada[1]?.id || 2, // Diseñador de Patrones
        cantidadHoras: 1.5,
        costoHora: 20000.0,
      },
      {
        productoId: productosCreados[1]?.id || 2, // Camiseta Deportiva
        manoDeObraId: manoDeObraCreada[2]?.id || 3, // Cortador
        cantidadHoras: 1.0,
        costoHora: 12000.0,
      },
      {
        productoId: productosCreados[1]?.id || 2, // Camiseta Deportiva
        manoDeObraId: manoDeObraCreada[0]?.id || 1, // Costurera Principal
        cantidadHoras: 2.5,
        costoHora: 15000.0,
      },
      {
        productoId: productosCreados[1]?.id || 2, // Camiseta Deportiva
        manoDeObraId: manoDeObraCreada[3]?.id || 4, // Terminador
        cantidadHoras: 0.5,
        costoHora: 10000.0,
      },
    ];

    for (const relacion of manoDeObraPorProducto) {
      try {
        await prisma.manoDeObraPorProducto.create({
          data: relacion,
        });
      } catch (error: any) {
        // Ignorar errores de duplicados
        if (error.code !== "P2002") {
          throw error;
        }
      }
    }
  }

  // Obtener presupuestos aceptados para crear pedidos
  const presupuestosAceptados = await prisma.presupuesto.findMany({
    where: { estado: EstadoPresupuesto.ACEPTADO },
    include: { detalles: true },
  });

  // Pedidos - Solo para presupuestos aceptados
  for (const presupuesto of presupuestosAceptados) {
    if (!presupuesto.clienteId) continue;

    try {
      const pedido = await prisma.pedido.upsert({
        where: { presupuestoId: presupuesto.id },
        update: {},
        create: {
          presupuestoId: presupuesto.id,
          clienteId: presupuesto.clienteId,
          estado: EstadoPedido.EN_PRODUCCION,
          pagado: false,
          fechaEntregaEstimada: new Date(
            new Date().getTime() + 14 * 24 * 60 * 60 * 1000,
          ), // 14 días desde ahora
          detalles: {
            create: presupuesto.detalles.map((detalle) => ({
              productoId: detalle.productoId,
              cantidad: detalle.cantidad,
              talle: "M", // Talla por defecto
              color: "Negro", // Color por defecto
              costoUnitario: detalle.costoUnitario,
              precioUnitario: detalle.costoUnitario * 1.4, // 40% de margen
              subtotal: detalle.cantidad * detalle.costoUnitario * 1.4,
            })),
          },
        },
        include: { detalles: true },
      });

      // ProduccionEtapa - Etapas de producción para los pedidos
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
          // fechaInicio y responsable se omiten (serán null por defecto)
        },
        {
          pedidoId: pedido.id,
          etapa: "Terminación",
          // fechaInicio y responsable se omiten (serán null por defecto)
        },
      ];

      for (const etapa of etapas) {
        try {
          await prisma.produccionEtapa.create({
            data: etapa,
          });
        } catch (error: any) {
          // Ignorar errores de duplicados
          if (error.code !== "P2002") {
            throw error;
          }
        }
      }
    } catch (error: any) {
      if (error.code !== "P2002") {
        throw error;
      }
    }
  }

  // TelegramMessage - Mensajes de ejemplo
  const telegramMessages = [
    {
      chatId: "123456789",
      clienteId: clientesCreados[0]?.id || null,
      firstName: "Claudia",
      lastName: "Muñoz",
      username: "claudia_munoz",
      text: "Hola, me interesa ver el catálogo de productos",
      source: "telegram",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
    },
    {
      chatId: "123456789",
      clienteId: null,
      firstName: "Konfex",
      lastName: "Bot",
      username: null,
      text: "¡Hola Claudia! Te envío nuestro catálogo completo",
      source: "konfex",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60000), // 1 minuto después
    },
    {
      chatId: "987654321",
      clienteId: clientesCreados[1]?.id || null,
      firstName: "Carlos",
      lastName: "Rojas",
      username: "carlos_rojas",
      text: "Necesito un presupuesto para 50 unidades",
      source: "telegram",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
    },
    {
      chatId: "987654321",
      clienteId: null,
      firstName: "Konfex",
      lastName: "Bot",
      username: null,
      text: "Perfecto Carlos, te preparo el presupuesto. ¿Qué productos necesitas?",
      source: "konfex",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 120000), // 2 minutos después
    },
    {
      chatId: "555666777",
      clienteId: clientesCreados[2]?.id || null,
      firstName: "María",
      lastName: "Pérez",
      username: "maria_p",
      text: "¿Tienen tallas grandes disponibles?",
      source: "telegram",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 horas atrás
    },
  ];

  for (const message of telegramMessages) {
    try {
      await prisma.telegramMessage.create({
        data: message,
      });
    } catch (error: any) {
      // Ignorar errores de duplicados
      if (error.code !== "P2002") {
        throw error;
      }
    }
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
