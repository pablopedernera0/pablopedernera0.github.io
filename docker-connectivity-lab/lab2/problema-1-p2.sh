#!/bin/bash
# problema-1-p2.sh
# Ejercicio 1: Host Network Mode

echo "🔴 Preparando Ejercicio 1: Host Network Mode"
echo "================================================"

# Limpiar contenedores previos
docker rm -f host-app bridge-app 2>/dev/null || true

# Crear contenedor en host network
echo "Creando contenedor con host network..."
docker run -d --name host-app \
  --network host \
  --hostname host-app \
  alpine:latest sleep 3600

# Crear contenedor normal en bridge
echo "Creando contenedor en bridge network..."
docker run -d --name bridge-app \
  --network bridge \
  --hostname bridge-app \
  alpine:latest sleep 3600

echo ""
echo "✅ Problema 1 configurado"
echo "El contenedor 'host-app' está en network mode: host"
echo "El contenedor 'bridge-app' está en network mode: bridge"
echo ""
echo "Intenta: docker exec host-app ping -c 2 bridge-app"
echo "Resultado: Debería fallar porque host-app no puede alcanzar bridge networks"