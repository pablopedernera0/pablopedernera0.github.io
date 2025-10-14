#!/bin/bash
# limpiar-practica-2.sh
# Script para limpiar todos los contenedores y redes

echo "🧹 Limpiando Práctica 2..."

# Detener y eliminar contenedores
docker rm -f host-app bridge-app subnet-a subnet-b client-bridge \
           service-bridge isolated-app normal-app linked-client \
           linked-server 2>/dev/null || true

# Eliminar redes
docker network rm custom-bridge custom-net app-bridge 2>/dev/null || true

# Restaurar iptables (solo en Linux)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  echo "Restaurando iptables..."
  sudo iptables -D FORWARD -j DROP 2>/dev/null || true
fi

echo "✅ Limpieza completada"