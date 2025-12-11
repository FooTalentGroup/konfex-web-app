/*
  Warnings:

  - You are about to drop the column `gastosIndirectosPorcentaje` on the `Presupuesto` table. All the data in the column will be lost.
  - Made the column `gastosNegocioId` on table `Presupuesto` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Presupuesto" DROP CONSTRAINT "Presupuesto_gastosNegocioId_fkey";

-- AlterTable
ALTER TABLE "Adicional" ADD COLUMN     "tarifaEnvio" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "Presupuesto" DROP COLUMN "gastosIndirectosPorcentaje",
ALTER COLUMN "gastosNegocioId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Presupuesto" ADD CONSTRAINT "Presupuesto_gastosNegocioId_fkey" FOREIGN KEY ("gastosNegocioId") REFERENCES "GastosNegocio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
