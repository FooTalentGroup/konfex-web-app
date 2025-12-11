#!/bin/sh
set -e

echo "🚀 Iniciando aplicación Konfex Backend..."

# Verificar que DATABASE_URL esté configurada
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL no está configurada"
  exit 1
fi

echo "✅ DATABASE_URL configurada"

# Ejecutar migraciones
echo "📦 Ejecutando migraciones de Prisma..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo "✅ Migraciones ejecutadas correctamente"
else
  echo "❌ Error al ejecutar migraciones"
  exit 1
fi

# Iniciar la aplicación
echo "🎯 Iniciando servidor..."
exec node dist/src/index.js
