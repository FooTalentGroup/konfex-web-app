import { PrismaClient, Role } from '@prisma/client';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clientes
  const clientes = [
    { nombre: "Claudia Muñoz", telefono: "987112233", email: "claudia.munoz@example.com", origen: "Instagram", instagramUser: "@claudia_munoz_cl", notas: "Interesada en colecciones de temporada" },
    { nombre: "Carlos Rojas", telefono: "987445566", email: "carlos.rojas@example.com", origen: "Facebook", instagramUser: "@carlos_rojas", notas: "Compra mayorista" },
    { nombre: "María Pérez", telefono: "987778899", email: "maria.perez@example.com", origen: "TikTok", instagramUser: "@maria_p", notas: "Consulta sobre talles grandes" },
    { nombre: "Juan López", telefono: "987334455", email: "juan.lopez@example.com", origen: "Instagram", instagramUser: "@juan_lopez", notas: "Quiere ver catálogo de invierno" },
    { nombre: "Sofía Díaz", telefono: "987556677", email: "sofia.diaz@example.com", origen: "Facebook", instagramUser: "@sofia_d", notas: "Interesada en accesorios" },
    { nombre: "Pedro Martínez", telefono: "987889900", email: "pedro.martinez@example.com", origen: "Instagram", instagramUser: "@pedro_m", notas: "Compra al por mayor" },
    { nombre: "Ana Torres", telefono: "987223344", email: "ana.torres@example.com", origen: "Web", instagramUser: "@ana_torres", notas: "Primer pedido online" },
  ];

  for (const cliente of clientes) {
    await prisma.cliente.create({ data: cliente });
  }

  // Productos
  const productos = [
    { nombre: "Tela de algodón", descripcion: "Tela 100% algodón, ideal para camisetas", activo: true },
    { nombre: "Hilo poliéster", descripcion: "Hilo resistente, varias combinaciones de colores", activo: true },
    { nombre: "Botones de plástico", descripcion: "Botones de 1.5cm, varios colores", activo: true },
    { nombre: "Cremalleras metálicas", descripcion: "Cremalleras de 20cm, colores surtidos", activo: true },
    { nombre: "Elástico para cintura", descripcion: "Elástico de 2cm, varias longitudes", activo: true },
    { nombre: "Telas de lino", descripcion: "Tela ligera de lino para blusas y vestidos", activo: true },
    { nombre: "Cintas decorativas", descripcion: "Cintas de colores y texturas variadas", activo: true },
    { nombre: "Botones metálicos", descripcion: "Botones de 2cm, resistentes y duraderos", activo: true },
  ];

  for (const producto of productos) {
    await prisma.producto.create({ data: producto });
  }

  const users = [
    {
      email: "mia@mail.com",
      name: "testQA",
      password: "030914Km$",
      role: Role.ADMIN, // 🔥 usar enum, no string
    }
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        role: user.role,
      }
    });
  }

  console.log("Database seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
