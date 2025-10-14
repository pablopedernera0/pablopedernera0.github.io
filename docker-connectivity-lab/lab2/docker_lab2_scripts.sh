#!/bin/bash
# setup-practica-2.sh
# Script de configuración inicial

echo "🚀 Iniciando configuración de la Práctica 2 de Docker Networking..."

# Limpiar contenedores anteriores
docker rm -f host-app bridge-app subnet-a subnet-b client-bridge service-bridge \
           isolated-app normal-app linked-client linked-server 2>/dev/null

# Crear redes necesarias
echo "📡 Creando redes personalizadas..."
docker network create custom-bridge 2>/dev/null || true
docker network create custom-net 2>/dev/null || true

# Crear contenedor en bridge por defecto
echo "✅ Configuración completada"
echo "Ejecuta: sh problema-1-p2.sh para comenzar con el ejercicio 1"

