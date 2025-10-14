#!/bin/bash
# problema-4-p2.sh
# Ejercicio 4: Network Mode None

echo "🔴 Preparando Ejercicio 4: Network Mode None"
echo "=============================================="

# Limpiar contenedores previos
docker rm -f isolated-app normal-app 2>/dev/null || true

# Crear contenedor con network none
echo "Creando contenedor con network mode: none..."
docker run -d --name isolated-app \
  --network none \
  alpine:latest sleep 3600

# Crear contenedor normal para comparar
echo "Creando contenedor normal en bridge..."
docker run -d --name normal-app \
  alpine:latest sleep 3600

echo ""
echo "✅ Problema 4 configurado"
echo ""
echo "Verifica isolated-app:"
echo "  docker exec isolated-app ip addr show"
echo "  Resultado: Solo loopback (lo), sin eth0"
echo ""
echo "Verifica normal-app:"
echo "  docker exec normal-app ip addr show"
echo "  Resultado: Tiene eth0 con IP"
echo ""
echo "Intenta: docker exec normal-app ping isolated-app"
echo "Resultado: Completamente inalcanzable"