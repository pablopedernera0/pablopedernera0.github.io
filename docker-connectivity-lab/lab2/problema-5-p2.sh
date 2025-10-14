#!/bin/bash
# problema-5-p2.sh
# Ejercicio 5: Links Legados Deprecados

echo "🔴 Preparando Ejercicio 5: Links Legados Deprecados"
echo "===================================================="

# Limpiar contenedores previos
docker rm -f linked-server linked-client 2>/dev/null || true

# Crear servidor
echo "Creando contenedor linked-server..."
docker run -d --name linked-server \
  -e SERVER_PORT=8080 \
  alpine:latest \
  sh -c "while true; do echo 'Welcome to Server' | nc -l -p 8080; done"

# Crear cliente con --link (deprecado)
echo "Creando contenedor linked-client con --link..."
docker run -d --name linked-client \
  --link linked-server:linked_server \
  alpine:latest sleep 3600

echo ""
echo "✅ Problema 5 configurado"
echo "Se usó --link (DEPRECADO)"
echo ""
echo "Verifica variables de entorno:"
echo "  docker exec linked-client env | grep LINKED"
echo "  Resultado: Variables heredadas LINKED_SERVER_*"
echo ""
echo "Verifica /etc/hosts:"
echo "  docker exec linked-client cat /etc/hosts"
echo "  Resultado: Entrada manual para linked_server"
echo ""
echo "Prueba resolución:"
echo "  docker exec linked-client ping linked_server"
echo "  Resultado: Funciona pero es la forma antigua"
echo ""
echo "⚠️  Los links legados están deprecados desde Docker 1.9"
echo "La solución moderna es usar redes personalizadas con DNS automático"