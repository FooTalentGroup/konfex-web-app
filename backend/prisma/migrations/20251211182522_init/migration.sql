-- CreateEnum
CREATE TYPE "EstadoPresupuesto" AS ENUM ('BORRADOR', 'ENVIADO', 'ACEPTADO', 'RECHAZADO', 'VENCIDO');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('NO_VISTO', 'EN_COMPRA', 'EN_PRODUCCION', 'ENTREGADO');

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
CREATE TABLE "RefreshToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "numeroIdentificacion" TEXT,
    "origen" TEXT,
    "instagramUser" TEXT,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "imagen" TEXT,
    "tallas" TEXT[],
    "colores" TEXT[],
    "mermaCantidad" DOUBLE PRECISION,
    "mermaUnidad" TEXT,
    "mermaPrecio" DOUBLE PRECISION,
    "tarifaCosto" DOUBLE PRECISION,
    "tarifaHoras" DOUBLE PRECISION,
    "precio" DOUBLE PRECISION,
    "coleccionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Material" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "url_imagen" TEXT,
    "categoriaId" INTEGER NOT NULL,
    "unidadMedida" TEXT NOT NULL,
    "ancho" DOUBLE PRECISION,
    "peso" DOUBLE PRECISION,
    "colores" TEXT[],
    "proveedor" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Presupuesto" (
    "id" SERIAL NOT NULL,
    "numeroPresupuesto" INTEGER NOT NULL,
    "nombre" TEXT,
    "clienteId" INTEGER,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaVencimiento" TIMESTAMP(3),
    "estado" "EstadoPresupuesto" NOT NULL,
    "margenGananciaPorcentaje" DOUBLE PRECISION NOT NULL,
    "totalCosto" DOUBLE PRECISION NOT NULL,
    "costosIndirectos" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gastosNegocioId" INTEGER NOT NULL,
    "ganancias" DOUBLE PRECISION NOT NULL,
    "iva" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalFinal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notas" TEXT,
    "origen" TEXT NOT NULL DEFAULT 'manual',
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
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "presupuestoId" INTEGER NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'NO_VISTO',
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
    "clienteId" INTEGER,
    "firstName" TEXT,
    "lastName" TEXT,
    "username" TEXT,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "text" TEXT,
    "type" TEXT DEFAULT 'text',
    "fileId" TEXT,
    "fileUniqueId" TEXT,
    "filePath" TEXT,
    "fileUrl" TEXT,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "source" TEXT NOT NULL DEFAULT 'telegram',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelegramMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramConversation" (
    "chatId" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "formData" JSONB DEFAULT '{}',
    "manualMode" BOOLEAN NOT NULL DEFAULT false,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelegramConversation_pkey" PRIMARY KEY ("chatId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_token_idx" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_nombre_key" ON "Cliente"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Coleccion_codigo_key" ON "Coleccion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Coleccion_nombre_key" ON "Coleccion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigo_key" ON "Producto"("codigo");

-- CreateIndex
CREATE INDEX "Producto_coleccionId_idx" ON "Producto"("coleccionId");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE INDEX "Categoria_nombre_idx" ON "Categoria"("nombre");

-- CreateIndex
CREATE INDEX "Material_categoriaId_idx" ON "Material"("categoriaId");

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
CREATE INDEX "Adicional_presupuestoId_idx" ON "Adicional"("presupuestoId");

-- CreateIndex
CREATE INDEX "GastosNegocio_nombre_idx" ON "GastosNegocio"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_presupuestoId_key" ON "Pedido"("presupuestoId");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_coleccionId_fkey" FOREIGN KEY ("coleccionId") REFERENCES "Coleccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialPorProducto" ADD CONSTRAINT "MaterialPorProducto_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialPorProducto" ADD CONSTRAINT "MaterialPorProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presupuesto" ADD CONSTRAINT "Presupuesto_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presupuesto" ADD CONSTRAINT "Presupuesto_gastosNegocioId_fkey" FOREIGN KEY ("gastosNegocioId") REFERENCES "GastosNegocio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresupuestoDetalle" ADD CONSTRAINT "PresupuestoDetalle_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresupuestoDetalle" ADD CONSTRAINT "PresupuestoDetalle_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adicional" ADD CONSTRAINT "Adicional_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoDetalle" ADD CONSTRAINT "PedidoDetalle_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoDetalle" ADD CONSTRAINT "PedidoDetalle_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProduccionEtapa" ADD CONSTRAINT "ProduccionEtapa_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramMessage" ADD CONSTRAINT "TelegramMessage_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
