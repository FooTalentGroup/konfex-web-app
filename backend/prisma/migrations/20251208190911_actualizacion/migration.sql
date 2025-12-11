/*
  Warnings:

  - The values [PENDIENTE,LISTO,CANCELADO] on the enum `EstadoPedido` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `categoria` on the `Material` table. All the data in the column will be lost.
  - Added the required column `categoriaId` to the `Material` table without a default value. This is not possible if the table is not empty.

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

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "direccion" TEXT;

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "categoria",
ADD COLUMN     "categoriaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pedido" ALTER COLUMN "estado" SET DEFAULT 'NO_VISTO';

-- AlterTable
ALTER TABLE "Presupuesto" ADD COLUMN     "origen" TEXT NOT NULL DEFAULT 'manual';

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE INDEX "Categoria_nombre_idx" ON "Categoria"("nombre");

-- CreateIndex
CREATE INDEX "MessageRead_messageId_idx" ON "MessageRead"("messageId");

-- CreateIndex
CREATE INDEX "MessageRead_userId_idx" ON "MessageRead"("userId");

-- CreateIndex
CREATE INDEX "MessageRead_messageId_userId_idx" ON "MessageRead"("messageId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageRead_messageId_userId_key" ON "MessageRead"("messageId", "userId");

-- CreateIndex
CREATE INDEX "Material_categoriaId_idx" ON "Material"("categoriaId");

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageRead" ADD CONSTRAINT "MessageRead_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "TelegramMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageRead" ADD CONSTRAINT "MessageRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
