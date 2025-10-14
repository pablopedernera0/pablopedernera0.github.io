#!/bin/bash
# problema-3-p2.sh
# Ejercicio 3: FORWARD bloqueado en bridge

echo "🔴 Preparando Ejercicio 3: Tráfico FORWARD Bloqueado"
echo "====================================================="

# Limpiar contenedores previos
docker rm -f client-bridge service-bridge 2>/dev/null || true

# Crear red bridge personalizada
docker network create app-bridge 2>/dev/null || true

# Crear servidor
echo "Creando contenedor service-bridge..."
docker run -d --name service-bridge \
  --network app-bridge \
  -p 6000:6000 \
  alpine:latest \
  sh -c "while true; do echo 'HTTP/1.1 200 OK' | nc -l -p 6000; done"

# Crear cliente
echo "Creando contenedor client-bridge..."
docker run -d --name client-bridge \
  --network app-bridge \
  alpine:latest sleep 3600

# Bloquear FORWARD
echo "Bloqueando cadena FORWARD en iptables..."
sudo iptables -I FORWARD 1 -j DROP 2>/dev/null || true

echo ""
echo "✅ Problema 3 configurado"
echo ""
echo "Verifica: docker exec client-bridge ping service-bridge"
echo "Resultado: El ping funciona"
echo ""
echo "Intenta: docker exec client-bridge curl http://service-bridge:6000"
echo "Resultado: Timeout - tráfico bloqueado por FORWARD DROP"