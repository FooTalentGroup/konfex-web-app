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
  throw new Error("Missing required environment variable: DATABASE_URL");
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

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
    {
      nombre: "María Pérez",
      telefono: "987778899",
      email: "maria.perez@example.com",
      direccion: "Pasaje Los Olivos 890, Concepción",
      origen: "TikTok",
      instagramUser: "@maria_p",
      notas: "Consulta sobre talles grandes",
    },
    {
      nombre: "Juan López",
      telefono: "987334455",
      email: "juan.lopez@example.com",
      direccion: "Av. Providencia 2345, Santiago",
      origen: "Instagram",
      instagramUser: "@juan_lopez",
      notas: "Quiere ver catálogo de invierno",
    },
    {
      nombre: "Sofía Díaz",
      telefono: "987556677",
      email: "sofia.diaz@example.com",
      direccion: "Calle Central 678, Viña del Mar",
      origen: "Facebook",
      instagramUser: "@sofia_d",
      notas: "Interesada en accesorios",
    },
    {
      nombre: "Pedro Martínez",
      telefono: "987889900",
      email: "pedro.martinez@example.com",
      direccion: "Boulevard Industrial 901, Santiago",
      origen: "Instagram",
      instagramUser: "@pedro_m",
      notas: "Compra al por mayor",
    },
    {
      nombre: "Ana Torres",
      telefono: "987223344",
      email: "ana.torres@example.com",
      direccion: "Av. Costanera 345, La Serena",
      origen: "Web",
      instagramUser: "@ana_torres",
      notas: "Primer pedido online",
    },
    // Nuevos clientes
    {
      nombre: "Laura Fernández",
      telefono: "987667788",
      email: "laura.fernandez@example.com",
      direccion: "Calle Ecología 456, Puerto Montt",
      origen: "WhatsApp",
      instagramUser: "@laura_f",
      notas: "Cliente frecuente, prefiere productos ecológicos",
    },
    {
      nombre: "Roberto Silva",
      telefono: "987990011",
      email: "roberto.silva@example.com",
      direccion: "Av. Empresarial 7890, Las Condes, Santiago",
      origen: "Referido",
      instagramUser: "@roberto_s",
      notas: "Empresario, compras corporativas",
    },
    {
      nombre: "Carmen Vega",
      telefono: "987112233",
      email: "carmen.vega@example.com",
      direccion: "Calle Influencer 123, Providencia, Santiago",
      origen: "Instagram",
      instagramUser: "@carmen_v",
      notas: "Influencer, colaboraciones especiales",
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
    {
      nombre: "Lycra Elástica",
      url_imagen: null,
      categoriaId: categoriasMap["Tela"],
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
      categoriaId: categoriasMap["Hilo"],
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
      categoriaId: categoriasMap["Accesorio"],
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
      categoriaId: categoriasMap["Accesorio"],
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
      categoriaId: categoriasMap["Tela"],
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
      categoriaId: categoriasMap["Tela"],
      unidadMedida: "metros",
      ancho: 150,
      peso: 2.0,
      colores: ["Negro", "Gris", "Azul", "Rojo", "Verde"],
      proveedor: "Textil S.A.",
      precio: 320.0,
    },
    // Nuevos materiales
    {
      nombre: "Seda Natural",
      url_imagen: null,
      categoriaId: categoriasMap["Tela"],
      unidadMedida: "metros",
      ancho: 140,
      peso: 0.8,
      colores: ["Blanco", "Beige", "Rosa", "Azul Claro"],
      proveedor: "Telas Premium",
      precio: 850.0,
    },
    {
      nombre: "Lino Orgánico",
      url_imagen: null,
      categoriaId: categoriasMap["Tela"],
      unidadMedida: "metros",
      ancho: 150,
      peso: 1.5,
      colores: ["Natural", "Beige", "Blanco", "Gris Claro"],
      proveedor: "Eco Textiles",
      precio: 520.0,
    },
    {
      nombre: "Hilo de Poliéster 100/3",
      url_imagen: null,
      categoriaId: categoriasMap["Hilo"],
      unidadMedida: "carretes",
      ancho: null,
      peso: null,
      colores: ["Blanco", "Negro", "Azul", "Rojo", "Verde", "Amarillo", "Rosa"],
      proveedor: "Hilos y Más",
      precio: 38.5,
    },
    {
      nombre: "Cremalleras Nylon #8",
      url_imagen: null,
      categoriaId: categoriasMap["Accesorio"],
      unidadMedida: "unidades",
      ancho: null,
      peso: null,
      colores: ["Negro", "Blanco", "Azul", "Rojo", "Verde"],
      proveedor: "Accesorios Textiles",
      precio: 15.0,
    },
    {
      nombre: "Forro de Seda",
      url_imagen: null,
      categoriaId: categoriasMap["Forro"],
      unidadMedida: "metros",
      ancho: 140,
      peso: 0.6,
      colores: ["Blanco", "Beige", "Rosa", "Azul Claro"],
      proveedor: "Telas Premium",
      precio: 420.0,
    },
    {
      nombre: "Entretela Fusible",
      url_imagen: null,
      categoriaId: categoriasMap["Forro"],
      unidadMedida: "metros",
      ancho: 90,
      peso: 0.3,
      colores: ["Blanco"],
      proveedor: "Forros Industriales",
      precio: 180.0,
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
    {
      codigo: 3,
      nombre: "Chaqueta Ligera",
      descripcion: "Chaqueta ligera para primavera",
      activo: true,
      imagen:
        "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/post-instagram-primavera-nueva-colecci%C3%B3n-design-template-59d147b6a8afea754918bd73c268e55d_screen.jpg?ts=1614790769",
      coleccionId: 1,
      tallas: ["S", "M", "L"],
      colores: ["Verde", "Negro"],
      materiales: {
        create: [{ materialId: 3, cantidad: 1.2 }],
      },
      mermaCantidad: 0.15,
      mermaUnidad: "m",
      mermaPrecio: 600,
      tarifaCosto: 20000,
      tarifaHoras: 1.2,
      precio: 35000,
    },

    // Colección 2
    {
      codigo: 4,
      nombre: "Camiseta Básica Verano",
      descripcion: "Camiseta ligera para verano",
      activo: true,
      imagen:
        "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/post-instagram-primavera-nueva-colecci%C3%B3n-design-template-59d147b6a8afea754918bd73c268e55d_screen.jpg?ts=1614790769",
      coleccionId: 2,
      tallas: ["S", "M", "L"],
      colores: ["Amarillo", "Blanco"],
      materiales: {
        create: [
          { materialId: 1, cantidad: 1.3 },
          { materialId: 2, cantidad: 0.2 },
        ],
      },
      mermaCantidad: 0.1,
      mermaUnidad: "m",
      mermaPrecio: 500,
      tarifaCosto: 11000,
      tarifaHoras: 0.8,
      precio: 14000,
    },
    {
      codigo: 5,
      nombre: "Pantalón Jeans",
      descripcion: "Jeans clásico azul",
      activo: true,
      imagen:
        "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/post-instagram-primavera-nueva-colecci%C3%B3n-design-template-59d147b6a8afea754918bd73c268e55d_screen.jpg?ts=1614790769",
      coleccionId: 2,
      tallas: ["30", "32", "34"],
      colores: ["Azul"],
      materiales: {
        create: [{ materialId: 1, cantidad: 2.0 }],
      },
      mermaCantidad: 0.2,
      mermaUnidad: "m",
      mermaPrecio: 800,
      tarifaCosto: 16000,
      tarifaHoras: 0.8,
      precio: 25000,
    },
    {
      codigo: 6,
      nombre: "Short Deportivo",
      descripcion: "Short cómodo para deporte",
      activo: true,
      imagen:
        "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/post-instagram-primavera-nueva-colecci%C3%B3n-design-template-59d147b6a8afea754918bd73c268e55d_screen.jpg?ts=1614790769",
      coleccionId: 2,
      tallas: ["S", "M", "L"],
      colores: ["Negro", "Azul"],
      materiales: {
        create: [{ materialId: 3, cantidad: 1.0 }],
      },
      mermaCantidad: 0.12,
      mermaUnidad: "m",
      mermaPrecio: 400,
      tarifaCosto: 14000,
      tarifaHoras: 0.7,
      precio: 22000,
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
      email: "testqa1@example.com",
      name: "testQA",
      password: "testQA1!",
      role: Role.ADMIN,
    },
    // Nuevos usuarios
    {
      email: "admin@konfex.com",
      name: "Administrador",
      password: "Admin123!",
      role: Role.ADMIN,
    },
    {
      email: "usuario@konfex.com",
      name: "Usuario Regular",
      password: "User123!",
      role: Role.USER,
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
    {
      nombre: "Gastos de Operación",
      porcentaje: 12,
    },
    {
      nombre: "Gastos Fijos",
      porcentaje: 8,
    },
    {
      nombre: "Gastos de Marketing",
      porcentaje: 5,
    },
    {
      nombre: "Gastos de Almacén",
      porcentaje: 7,
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
    {
      numeroPresupuesto: 1003,
      nombre: "Presupuesto Revisión",
      clienteId: clientesCreados[2]?.id || null,
      fechaVencimiento: new Date("2025-01-15"),
      estado: EstadoPresupuesto.BORRADOR,
      margenGananciaPorcentaje: 35.0,
      gastosNegocioId: gastosNegocioCreados[2]?.id || 1,
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
      clienteId: clientesCreados[3]?.id || null,
      fechaVencimiento: new Date("2024-11-30"),
      estado: EstadoPresupuesto.VENCIDO,
      margenGananciaPorcentaje: 28.0,
      gastosNegocioId: gastosNegocioCreados[3]?.id || 1,
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
      clienteId: clientesCreados[4]?.id || null,
      fechaVencimiento: new Date("2025-02-28"),
      estado: EstadoPresupuesto.ENVIADO,
      margenGananciaPorcentaje: 32.0,
      gastosNegocioId: gastosNegocioCreados[0]?.id || 1,
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
    {
      numeroPresupuesto: 1006,
      nombre: "Presupuesto Colección Formal",
      clienteId: clientesCreados[7]?.id || null,
      fechaVencimiento: new Date("2025-03-15"),
      estado: EstadoPresupuesto.ENVIADO,
      margenGananciaPorcentaje: 40.0,
      gastosNegocioId: gastosNegocioCreados[0]?.id || 1,
      totalCosto: 55000.0,
      ganancias: 24750.0,
      notas: "Presupuesto para línea formal empresarial",
      detalles: [
        {
          productoId: productosCreados[4]?.id || 5,
          descripcion: "Pantalón Formal - Varias tallas",
          cantidad: 15,
          costoUnitario: 3500.0,
        },
        {
          productoId: productosCreados[5]?.id || 6,
          descripcion: "Blusa de Oficina - Varias tallas",
          cantidad: 20,
          costoUnitario: 2800.0,
        },
      ],
      adicionales: [
        {
          nombre: "Planchado profesional",
          cantidad: 35,
          monto: 500.0,
          totalCosto: 17500.0,
          observaciones: "Planchado especial para prendas formales",
        },
      ],
    },
    {
      numeroPresupuesto: 1007,
      nombre: "Presupuesto Rechazado",
      clienteId: clientesCreados[5]?.id || null,
      fechaVencimiento: new Date("2024-12-20"),
      estado: EstadoPresupuesto.RECHAZADO,
      margenGananciaPorcentaje: 30.0,
      gastosNegocioId: gastosNegocioCreados[1]?.id || 1,
      totalCosto: 22000.0,
      ganancias: 7260.0,
      notas: "Presupuesto rechazado por el cliente",
      detalles: [
        {
          productoId: productosCreados[2]?.id || 3,
          descripcion: "Chaqueta Deportiva - Talla L",
          cantidad: 8,
          costoUnitario: 2750.0,
        },
      ],
      adicionales: [],
    },
    {
      numeroPresupuesto: 1008,
      nombre: "Presupuesto Gran Volumen",
      clienteId: clientesCreados[8]?.id || null,
      fechaVencimiento: new Date("2025-04-30"),
      estado: EstadoPresupuesto.BORRADOR,
      margenGananciaPorcentaje: 20.0,
      gastosNegocioId: gastosNegocioCreados[2]?.id || 1,
      totalCosto: 120000.0,
      ganancias: 28800.0,
      notas: "Pedido de gran volumen para distribuidor",
      detalles: [
        {
          productoId: productosCreados[1]?.id || 2,
          descripcion: "Camiseta Deportiva - Varias tallas",
          cantidad: 50,
          costoUnitario: 1800.0,
        },
        {
          productoId: productosCreados[6]?.id || 7,
          descripcion: "Shorts Deportivos - Varias tallas",
          cantidad: 50,
          costoUnitario: 1200.0,
        },
      ],
      adicionales: [
        {
          nombre: "Descuento por volumen",
          cantidad: 1,
          monto: -5000.0,
          totalCosto: -5000.0,
          observaciones: "Descuento aplicado por volumen",
        },
      ],
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
        productoId: productosCreados[0]?.id || 1,
        materialId: materialesCreados[3]?.id || 4,
        cantidad: 0.5,
      },
      {
        productoId: productosCreados[0]?.id || 1,
        materialId: materialesCreados[4]?.id || 5,
        cantidad: 1,
      },
      {
        productoId: productosCreados[1]?.id || 2,
        materialId: materialesCreados[1]?.id || 2,
        cantidad: 1.5,
      },
      {
        productoId: productosCreados[1]?.id || 2,
        materialId: materialesCreados[3]?.id || 4,
        cantidad: 0.3,
      },
      {
        productoId: productosCreados[2]?.id || 3,
        materialId: materialesCreados[1]?.id || 2,
        cantidad: 2.0,
      },
      {
        productoId: productosCreados[2]?.id || 3,
        materialId: materialesCreados[10]?.id || 11,
        cantidad: 1,
      },
      {
        productoId: productosCreados[3]?.id || 4,
        materialId: materialesCreados[8]?.id || 9,
        cantidad: 3.0,
      },
      {
        productoId: productosCreados[3]?.id || 4,
        materialId: materialesCreados[12]?.id || 13,
        cantidad: 1.5,
      },
      {
        productoId: productosCreados[4]?.id || 5,
        materialId: materialesCreados[6]?.id || 7,
        cantidad: 2.8,
      },
      {
        productoId: productosCreados[4]?.id || 5,
        materialId: materialesCreados[12]?.id || 13,
        cantidad: 2.0,
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
      chatId: "123456789",
      clienteId: null,
      firstName: "Konfex",
      lastName: "Bot",
      username: null,
      text: "¡Hola Claudia! Te envío nuestro catálogo completo",
      source: "konfex",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60000),
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
    {
      chatId: "987654321",
      clienteId: null,
      firstName: "Konfex",
      lastName: "Bot",
      username: null,
      text: "Perfecto Carlos, te preparo el presupuesto. ¿Qué productos necesitas?",
      source: "konfex",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 120000),
    },
    {
      chatId: "555666777",
      clienteId: clientesCreados[2]?.id || null,
      firstName: "María",
      lastName: "Pérez",
      username: "maria_p",
      text: "¿Tienen tallas grandes disponibles?",
      source: "telegram",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      chatId: "111222333",
      clienteId: clientesCreados[7]?.id || null,
      firstName: "Laura",
      lastName: "Fernández",
      username: "laura_f",
      text: "Buenos días, estoy interesada en productos ecológicos",
      source: "telegram",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      chatId: "111222333",
      clienteId: null,
      firstName: "Konfex",
      lastName: "Bot",
      username: null,
      text: "Hola Laura, tenemos una línea de productos con materiales orgánicos. ¿Te interesa?",
      source: "konfex",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000 + 90000),
    },
    {
      chatId: "444555666",
      clienteId: clientesCreados[8]?.id || null,
      firstName: "Roberto",
      lastName: "Silva",
      username: "roberto_s",
      text: "Necesito un presupuesto para uniformes corporativos",
      source: "telegram",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
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
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
