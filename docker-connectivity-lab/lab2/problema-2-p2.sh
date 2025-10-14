#!/bin/bash
# problema-2-p2.sh
# Ejercicio 2: Rutas no configuradas

echo "🔴 Preparando Ejercicio 2: Rutas de Red no Configuradas"
echo "========================================================"

# Limpiar contenedores previos
docker rm -f subnet-a subnet-b 2>/dev/null || true

# Crear red personalizada
docker network create custom-net --subnet=172.20.0.0/16 2>/dev/null || true

# Crear contenedores en diferentes subredes de la misma red
echo "Creando contenedor subnet-a en 172.20.1.0/24..."
docker run -d --name subnet-a \
  --network custom-net \
  --ip 172.20.1.10 \
  alpine:latest sleep 3600

echo "Creando contenedor subnet-b en 172.20.2.0/24..."
docker run -d --name subnet-b \
  --network custom-net \
  --ip 172.20.2.10 \
  alpine:latest sleep 3600

echo ""
echo "✅ Problema 2 configurado"
echo "subnet-a: 172.20.1.10"
echo "subnet-b: 172.20.2.10"
echo ""
echo "Intenta: docker exec subnet-a ping -c 2 subnet-b"
echo "Resultado: Debería fallar por rutas no configuradas"