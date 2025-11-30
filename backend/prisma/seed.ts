import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

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
    await prisma.cliente.create({ data: cliente });
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
    await prisma.producto.create({ data: producto });
  }

  // Materiales
  const materiales = [
    {
      nombre: "Algodón Premium 240g",
      url_imagen: null,
      categoria: "Tela",
      ancho: 150,
      peso: 2.5,
      colores: ["Blanco", "Negro", "Azul", "Rojo", "Beige"],
      proveedor: "Textil S.A.",
      precio: 350.5,
      stock: 100,
    },
    {
      nombre: "Poliéster Deportivo",
      url_imagen: null,
      categoria: "Tela",
      ancho: 140,
      peso: 1.8,
      colores: ["Negro", "Blanco", "Gris", "Azul Marino"],
      proveedor: "Deportes Textiles",
      precio: 280.0,
      stock: 75,
    },
    {
      nombre: "Lycra Elástica",
      url_imagen: null,
      categoria: "Tela",
      ancho: 160,
      peso: 1.2,
      colores: ["Negro", "Blanco", "Rosa", "Azul", "Verde"],
      proveedor: "Elásticos Premium",
      precio: 420.75,
      stock: 50,
    },
    {
      nombre: "Hilo de Algodón 40/2",
      url_imagen: null,
      categoria: "Hilo",
      ancho: 0,
      peso: 0.1,
      colores: ["Blanco", "Negro", "Azul", "Rojo", "Verde", "Amarillo"],
      proveedor: "Hilos y Más",
      precio: 45.0,
      stock: 200,
    },
    {
      nombre: "Cierres Metálicos #5",
      url_imagen: null,
      categoria: "Accesorio",
      ancho: 0,
      peso: 0.05,
      colores: ["Negro", "Blanco", "Plata", "Dorado"],
      proveedor: "Accesorios Textiles",
      precio: 12.5,
      stock: 500,
    },
    {
      nombre: "Botones de Madera 15mm",
      url_imagen: null,
      categoria: "Accesorio",
      ancho: 0,
      peso: 0.02,
      colores: ["Natural", "Negro", "Blanco", "Marrón"],
      proveedor: "Accesorios Textiles",
      precio: 8.0,
      stock: 300,
    },
    {
      nombre: "Jean Denim 12oz",
      url_imagen: null,
      categoria: "Tela",
      ancho: 150,
      peso: 3.0,
      colores: ["Azul Claro", "Azul Oscuro", "Negro", "Blanco"],
      proveedor: "Denim Factory",
      precio: 480.0,
      stock: 60,
    },
    {
      nombre: "Forro Polar 200g",
      url_imagen: null,
      categoria: "Tela",
      ancho: 150,
      peso: 2.0,
      colores: ["Negro", "Gris", "Azul", "Rojo", "Verde"],
      proveedor: "Textil S.A.",
      precio: 320.0,
      stock: 80,
    },
  ];

  for (const material of materiales) {
    await prisma.material.create({ data: material as any });
  }

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

    await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        role: user.role,
      },
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
