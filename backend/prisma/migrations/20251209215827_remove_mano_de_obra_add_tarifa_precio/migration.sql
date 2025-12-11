/*
  Warnings:

  - You are about to drop the `ManoDeObra` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ManoDeObraPorProducto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ManoDeObraPorProducto" DROP CONSTRAINT "ManoDeObraPorProducto_manoDeObraId_fkey";

-- DropForeignKey
ALTER TABLE "ManoDeObraPorProducto" DROP CONSTRAINT "ManoDeObraPorProducto_productoId_fkey";

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "precio" DOUBLE PRECISION,
ADD COLUMN     "tarifaCosto" DOUBLE PRECISION,
ADD COLUMN     "tarifaHoras" DOUBLE PRECISION;

-- DropTable
DROP TABLE "ManoDeObra";

-- DropTable
DROP TABLE "ManoDeObraPorProducto";
