/*
  Warnings:

  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "colores" TEXT[],
ADD COLUMN     "tallas" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "Usuario";

-- DropEnum
DROP TYPE "RolUsuario";

-- CreateTable
CREATE TABLE "ManoDeObra" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "costoHora" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManoDeObra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManoDeObraPorProducto" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "manoDeObraId" INTEGER NOT NULL,
    "cantidadHoras" DOUBLE PRECISION NOT NULL,
    "costoHora" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManoDeObraPorProducto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramMessage" (
    "id" SERIAL NOT NULL,
    "chatId" TEXT NOT NULL,
    "userId" INTEGER,
    "firstName" TEXT,
    "lastName" TEXT,
    "username" TEXT,
    "text" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'telegram',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelegramMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Producto_nombre_key" ON "Producto"("nombre");

-- AddForeignKey
ALTER TABLE "ManoDeObraPorProducto" ADD CONSTRAINT "ManoDeObraPorProducto_manoDeObraId_fkey" FOREIGN KEY ("manoDeObraId") REFERENCES "ManoDeObra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManoDeObraPorProducto" ADD CONSTRAINT "ManoDeObraPorProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramMessage" ADD CONSTRAINT "TelegramMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
