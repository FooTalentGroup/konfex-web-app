/*
  Warnings:

  - The values [PENDIENTE,LISTO,CANCELADO] on the enum `EstadoPedido` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `costoHora` on the `ManoDeObraPorProducto` table. All the data in the column will be lost.
  - You are about to drop the column `categoria` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `gastosIndirectosPorcentaje` on the `Presupuesto` table. All the data in the column will be lost.
  - You are about to drop the column `totalVenta` on the `Presupuesto` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `ManoDeObra` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.
  - Made the column `costoHora` on table `ManoDeObra` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `categoriaId` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ganancias` to the `Presupuesto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gastosNegocioId` to the `Presupuesto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigo` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coleccionId` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoPedido_new" AS ENUM ('NO_VISTO', 'EN_COMPRA', 'EN_PRODUCCION', 'ENTREGADO');
ALTER TABLE "Pedido" ALTER COLUMN "estado" TYPE "EstadoPedido_new" USING ("estado"::text::"EstadoPedido_new");
ALTER TYPE "EstadoPedido" RENAME TO "EstadoPedido_old";
ALTER TYPE "EstadoPedido_new" RENAME TO "EstadoPedido";
DROP TYPE "public"."EstadoPedido_old";
COMMIT;

-- DropIndex
DROP INDEX "Material_categoria_idx";

-- DropIndex
DROP INDEX "Producto_nombre_key";

-- AlterTable
ALTER TABLE "ManoDeObra" ALTER COLUMN "costoHora" SET NOT NULL;

-- AlterTable
ALTER TABLE "ManoDeObraPorProducto" DROP COLUMN "costoHora";

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "categoria",
ADD COLUMN     "categoriaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pedido" ALTER COLUMN "estado" SET DEFAULT 'NO_VISTO';

-- AlterTable
ALTER TABLE "Presupuesto" DROP COLUMN "gastosIndirectosPorcentaje",
DROP COLUMN "totalVenta",
ADD COLUMN     "ganancias" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "gastosNegocioId" INTEGER NOT NULL,
ADD COLUMN     "iva" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "nombre" TEXT,
ADD COLUMN     "origen" TEXT NOT NULL DEFAULT 'manual',
ADD COLUMN     "totalFinal" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "codigo" INTEGER NOT NULL,
ADD COLUMN     "coleccionId" INTEGER NOT NULL,
ADD COLUMN     "imagen" TEXT,
ADD COLUMN     "mermaCantidad" DOUBLE PRECISION,
ADD COLUMN     "mermaPrecio" DOUBLE PRECISION,
ADD COLUMN     "mermaUnidad" TEXT;

-- AlterTable
ALTER TABLE "TelegramMessage" ALTER COLUMN "type" SET DEFAULT 'text';

-- CreateTable
CREATE TABLE "Coleccion" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "imagen" TEXT,
    "icono" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coleccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adicional" (
    "id" SERIAL NOT NULL,
    "presupuestoId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "totalCosto" DOUBLE PRECISION NOT NULL,
    "tarifaEnvio" DOUBLE PRECISION DEFAULT 0,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Adicional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GastosNegocio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "porcentaje" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GastosNegocio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImpuestoGeneral" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL DEFAULT 'IVA',
    "porcentaje" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImpuestoGeneral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageRead" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageRead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coleccion_codigo_key" ON "Coleccion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Coleccion_nombre_key" ON "Coleccion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE INDEX "Categoria_nombre_idx" ON "Categoria"("nombre");

-- CreateIndex
CREATE INDEX "Adicional_presupuestoId_idx" ON "Adicional"("presupuestoId");

-- CreateIndex
CREATE INDEX "GastosNegocio_nombre_idx" ON "GastosNegocio"("nombre");

-- CreateIndex
CREATE INDEX "MessageRead_messageId_idx" ON "MessageRead"("messageId");

-- CreateIndex
CREATE INDEX "MessageRead_userId_idx" ON "MessageRead"("userId");

-- CreateIndex
CREATE INDEX "MessageRead_messageId_userId_idx" ON "MessageRead"("messageId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageRead_messageId_userId_key" ON "MessageRead"("messageId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ManoDeObra_nombre_key" ON "ManoDeObra"("nombre");

-- CreateIndex
CREATE INDEX "ManoDeObraPorProducto_productoId_idx" ON "ManoDeObraPorProducto"("productoId");

-- CreateIndex
CREATE INDEX "ManoDeObraPorProducto_manoDeObraId_idx" ON "ManoDeObraPorProducto"("manoDeObraId");

-- CreateIndex
CREATE INDEX "Material_categoriaId_idx" ON "Material"("categoriaId");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigo_key" ON "Producto"("codigo");

-- CreateIndex
CREATE INDEX "Producto_coleccionId_idx" ON "Producto"("coleccionId");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_coleccionId_fkey" FOREIGN KEY ("coleccionId") REFERENCES "Coleccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presupuesto" ADD CONSTRAINT "Presupuesto_gastosNegocioId_fkey" FOREIGN KEY ("gastosNegocioId") REFERENCES "GastosNegocio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adicional" ADD CONSTRAINT "Adicional_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageRead" ADD CONSTRAINT "MessageRead_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "TelegramMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageRead" ADD CONSTRAINT "MessageRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
