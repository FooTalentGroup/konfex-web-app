/*
  Warnings:

  - You are about to drop the column `costoHora` on the `ManoDeObraPorProducto` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `ManoDeObra` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.
  - Made the column `costoHora` on table `ManoDeObra` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `codigo` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coleccionId` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Producto_nombre_key";

-- AlterTable
ALTER TABLE "ManoDeObra" ALTER COLUMN "costoHora" SET NOT NULL;

-- AlterTable
ALTER TABLE "ManoDeObraPorProducto" DROP COLUMN "costoHora";

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "codigo" INTEGER NOT NULL,
ADD COLUMN     "coleccionId" INTEGER NOT NULL,
ADD COLUMN     "imagen" TEXT,
ADD COLUMN     "mermaCantidad" DOUBLE PRECISION,
ADD COLUMN     "mermaPrecio" DOUBLE PRECISION,
ADD COLUMN     "mermaUnidad" TEXT;

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

-- CreateIndex
CREATE UNIQUE INDEX "Coleccion_codigo_key" ON "Coleccion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Coleccion_nombre_key" ON "Coleccion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "ManoDeObra_nombre_key" ON "ManoDeObra"("nombre");

-- CreateIndex
CREATE INDEX "ManoDeObraPorProducto_productoId_idx" ON "ManoDeObraPorProducto"("productoId");

-- CreateIndex
CREATE INDEX "ManoDeObraPorProducto_manoDeObraId_idx" ON "ManoDeObraPorProducto"("manoDeObraId");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigo_key" ON "Producto"("codigo");

-- CreateIndex
CREATE INDEX "Producto_coleccionId_idx" ON "Producto"("coleccionId");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_coleccionId_fkey" FOREIGN KEY ("coleccionId") REFERENCES "Coleccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
