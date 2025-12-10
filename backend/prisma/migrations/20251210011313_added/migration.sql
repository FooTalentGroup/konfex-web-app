/*
  Warnings:

  - You are about to drop the column `precio` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `tarifaCosto` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `tarifaHoras` on the `Producto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "precio",
DROP COLUMN "tarifaCosto",
DROP COLUMN "tarifaHoras";

-- CreateTable
CREATE TABLE "ManoDeObra" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "costoHora" DOUBLE PRECISION NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManoDeObraPorProducto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ManoDeObra_nombre_key" ON "ManoDeObra"("nombre");

-- CreateIndex
CREATE INDEX "ManoDeObraPorProducto_productoId_idx" ON "ManoDeObraPorProducto"("productoId");

-- CreateIndex
CREATE INDEX "ManoDeObraPorProducto_manoDeObraId_idx" ON "ManoDeObraPorProducto"("manoDeObraId");

-- AddForeignKey
ALTER TABLE "ManoDeObraPorProducto" ADD CONSTRAINT "ManoDeObraPorProducto_manoDeObraId_fkey" FOREIGN KEY ("manoDeObraId") REFERENCES "ManoDeObra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManoDeObraPorProducto" ADD CONSTRAINT "ManoDeObraPorProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
