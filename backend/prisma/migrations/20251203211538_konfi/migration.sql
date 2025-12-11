-- CreateEnum
CREATE TYPE "EstadoPresupuesto" AS ENUM ('BORRADOR', 'ENVIADO', 'ACEPTADO', 'RECHAZADO', 'VENCIDO');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE', 'EN_PRODUCCION', 'LISTO', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "origen" TEXT,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "instagramUser" TEXT,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "tallas" TEXT[],
    "colores" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "unidadMedida" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ancho" DOUBLE PRECISION,
    "categoria" TEXT NOT NULL,
    "colores" TEXT[],
    "peso" DOUBLE PRECISION,
    "precio" DOUBLE PRECISION NOT NULL,
    "proveedor" TEXT NOT NULL,
    "url_imagen" TEXT,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "MaterialPorProducto" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "cantidad" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MaterialPorProducto_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Presupuesto" (
    "id" SERIAL NOT NULL,
    "numeroPresupuesto" INTEGER NOT NULL,
    "clienteId" INTEGER,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaVencimiento" TIMESTAMP(3),
    "estado" "EstadoPresupuesto" NOT NULL,
    "margenGananciaPorcentaje" DOUBLE PRECISION NOT NULL,
    "gastosIndirectosPorcentaje" DOUBLE PRECISION NOT NULL,
    "totalCosto" DOUBLE PRECISION NOT NULL,
    "totalVenta" DOUBLE PRECISION NOT NULL,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Presupuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresupuestoDetalle" (
    "id" SERIAL NOT NULL,
    "presupuestoId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "descripcion" TEXT,
    "cantidad" INTEGER NOT NULL,
    "costoUnitario" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PresupuestoDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "presupuestoId" INTEGER NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoPedido" NOT NULL,
    "pagado" BOOLEAN NOT NULL DEFAULT false,
    "fechaEntregaEstimada" TIMESTAMP(3),
    "fechaEntregaReal" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoDetalle" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "talle" TEXT,
    "color" TEXT,
    "costoUnitario" DOUBLE PRECISION NOT NULL,
    "precioUnitario" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PedidoDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProduccionEtapa" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "etapa" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" TIMESTAMP(3),
    "responsable" TEXT,

    CONSTRAINT "ProduccionEtapa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramMessage" (
    "id" SERIAL NOT NULL,
    "chatId" TEXT NOT NULL,
    "text" TEXT,
    "source" TEXT NOT NULL DEFAULT 'telegram',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstName" TEXT,
    "lastName" TEXT,
    "username" TEXT,
    "clienteId" INTEGER,
    "fileId" TEXT,
    "filePath" TEXT,
    "fileSize" INTEGER,
    "fileUniqueId" TEXT,
    "fileUrl" TEXT,
    "mimeType" TEXT,
    "type" TEXT,

    CONSTRAINT "TelegramMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_nombre_key" ON "Cliente"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_nombre_key" ON "Producto"("nombre");

-- CreateIndex
CREATE INDEX "Material_categoria_idx" ON "Material"("categoria");

-- CreateIndex
CREATE INDEX "Material_precio_idx" ON "Material"("precio");

-- CreateIndex
CREATE INDEX "Material_proveedor_idx" ON "Material"("proveedor");

-- CreateIndex
CREATE INDEX "MaterialPorProducto_materialId_idx" ON "MaterialPorProducto"("materialId");

-- CreateIndex
CREATE INDEX "MaterialPorProducto_productoId_idx" ON "MaterialPorProducto"("productoId");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialPorProducto_productoId_materialId_key" ON "MaterialPorProducto"("productoId", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "Presupuesto_numeroPresupuesto_key" ON "Presupuesto"("numeroPresupuesto");

-- CreateIndex
CREATE INDEX "PresupuestoDetalle_presupuestoId_idx" ON "PresupuestoDetalle"("presupuestoId");

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_presupuestoId_key" ON "Pedido"("presupuestoId");

-- AddForeignKey
ALTER TABLE "MaterialPorProducto" ADD CONSTRAINT "MaterialPorProducto_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialPorProducto" ADD CONSTRAINT "MaterialPorProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManoDeObraPorProducto" ADD CONSTRAINT "ManoDeObraPorProducto_manoDeObraId_fkey" FOREIGN KEY ("manoDeObraId") REFERENCES "ManoDeObra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManoDeObraPorProducto" ADD CONSTRAINT "ManoDeObraPorProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presupuesto" ADD CONSTRAINT "Presupuesto_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresupuestoDetalle" ADD CONSTRAINT "PresupuestoDetalle_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresupuestoDetalle" ADD CONSTRAINT "PresupuestoDetalle_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoDetalle" ADD CONSTRAINT "PedidoDetalle_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoDetalle" ADD CONSTRAINT "PedidoDetalle_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProduccionEtapa" ADD CONSTRAINT "ProduccionEtapa_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramMessage" ADD CONSTRAINT "TelegramMessage_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
