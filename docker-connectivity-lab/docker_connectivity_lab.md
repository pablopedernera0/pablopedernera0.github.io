# Práctica Docker: Diagnóstico de Conectividad entre Contenedores

## Objetivo
Diagnosticar y solucionar problemas de conectividad entre contenedores Docker simulando escenarios reales de red.

## Requisitos Previos
- Docker instalado y funcionando
- Conocimientos básicos de redes y comandos Linux
- Terminal con permisos para ejecutar Docker

## Preparación del Entorno

### Crear la red y contenedores base
```bash
# Crear una red personalizada
docker network create lab-network

# Levantar contenedor A (servidor web)
docker run -d --name container-a \
  --network lab-network \
  nginx:alpine

# Levantar contenedor B (cliente)
docker run -d --name container-b \
  --network lab-network \
  alpine:latest sleep 3600

# Instalar herramientas en container-b (espera unos segundos a que termine)
docker exec container-b apk add --no-cache curl bind-tools iputils busybox-extras

# Si el comando anterior falla, espera un momento y reintenta:
# docker exec container-b apk update
# docker exec container-b apk add --no-cache curl bind-tools iputils busybox-extras
```

### Verificar conectividad inicial
```bash
# Desde container-b hacia container-a
docker exec container-b ping -c 3 container-a
docker exec container-b curl http://container-a

# Si funciona, ¡perfecto! Ahora vamos a romper cosas 😈
```

---

## 🔧 Ejercicio 1: Problema de Red Aislada

### Simular el problema
```bash
# Desconectar container-b de la red
docker network disconnect lab-network container-b
```

### Diagnóstico
```bash
# 1. Intentar ping (fallará)
docker exec container-b ping -c 3 container-a

# 2. Verificar interfaces de red
docker exec container-b ip addr show

# 3. Verificar tabla de routing
docker exec container-b ip route show

# 4. Listar redes del contenedor
docker inspect container-b | grep -A 20 Networks
```

### Preguntas
- ¿Por qué falla el ping?
- ¿Qué interfaces de red tiene el contenedor?
- ¿Está conectado a alguna red?

### Solución
```bash
# Reconectar a la red
docker network connect lab-network container-b

# Verificar
docker exec container-b ping -c 3 container-a
```

---

## 🔧 Ejercicio 2: Problema de DNS

### Simular el problema
```bash
# Crear contenedor con DNS incorrecto
docker run -d --name container-c \
  --network lab-network \
  --dns 1.1.1.1 \
  alpine:latest sleep 3600

docker exec container-c apk add --no-cache curl bind-tools iputils
```

### Diagnóstico
```bash
# 1. Intentar conexión por nombre (puede fallar)
docker exec container-c ping -c 3 container-a

# 2. Verificar DNS
docker exec container-c cat /etc/resolv.conf

# 3. Probar resolución DNS interna
docker exec container-c nslookup container-a

# 4. Intentar por IP (debería funcionar)
CONTAINER_A_IP=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container-a)
docker exec container-c ping -c 3 $CONTAINER_A_IP
```

### Preguntas
- ¿Funciona el ping por IP pero no por nombre?
- ¿Qué servidor DNS está usando?
- ¿Puede resolver nombres internos de Docker?

### Solución
```bash
# Recrear sin DNS personalizado o usar el DNS embebido de Docker
docker rm -f container-c
docker run -d --name container-c \
  --network lab-network \
  alpine:latest sleep 3600
```

---

## 🔧 Ejercicio 3: Puerto No Expuesto

### Simular el problema
```bash
# Crear servidor en puerto específico pero sin exponerlo
docker run -d --name web-server \
  --network lab-network \
  python:3.9-alpine sh -c "echo 'Hello World' > index.html && python -m http.server 8080"

# Cliente que intenta acceder
docker run -d --name web-client \
  --network lab-network \
  alpine:latest sleep 3600

docker exec web-client apk add --no-cache curl
```

### Diagnóstico
```bash
# 1. Verificar que el servidor está corriendo
docker exec web-server ps aux | grep python

# 2. Intentar conexión desde el cliente
docker exec web-client curl http://web-server:8080

# 3. Verificar puertos abiertos en el servidor
docker exec web-server netstat -tlnp

# 4. Verificar conectividad básica
docker exec web-client ping -c 3 web-server

# 5. Test de puerto específico
docker exec web-client nc -zv web-server 8080
```

### Preguntas
- ¿El ping funciona pero curl no?
- ¿El puerto está escuchando en el servidor?
- ¿Hay algún firewall bloqueando?

### Nota
En este caso debería funcionar dentro de la misma red Docker. Si no funciona, verificar que el servidor Python esté escuchando en 0.0.0.0 y no en localhost.

---

## 🔧 Ejercicio 4: Contenedores en Diferentes Redes

### Simular el problema
```bash
# Crear segunda red
docker network create lab-network-2

# Crear contenedores en diferentes redes
docker run -d --name isolated-a \
  --network lab-network \
  alpine:latest sleep 3600

docker run -d --name isolated-b \
  --network lab-network-2 \
  alpine:latest sleep 3600

docker exec isolated-a apk add --no-cache iputils
docker exec isolated-b apk add --no-cache iputils
```

### Diagnóstico
```bash
# 1. Intentar ping entre contenedores
docker exec isolated-a ping -c 3 isolated-b

# 2. Verificar redes de cada contenedor
docker inspect isolated-a | grep -A 10 Networks
docker inspect isolated-b | grep -A 10 Networks

# 3. Listar todas las redes
docker network ls

# 4. Ver qué contenedores están en cada red
docker network inspect lab-network
docker network inspect lab-network-2
```

### Preguntas
- ¿Por qué no hay conectividad?
- ¿En qué redes está cada contenedor?
- ¿Cómo podrían comunicarse?

### Solución
```bash
# Opción 1: Conectar isolated-a a la segunda red también
docker network connect lab-network-2 isolated-a
docker exec isolated-a ping -c 3 isolated-b

# Opción 2: Conectar isolated-b a la primera red
docker network connect lab-network isolated-b
docker exec isolated-a ping -c 3 isolated-b
```

---

## 🔧 Ejercicio 5: Problema de Firewall con iptables

### Simular el problema
```bash
# Crear contenedor con privilegios para modificar iptables
docker run -d --name firewall-test \
  --network lab-network \
  --cap-add=NET_ADMIN \
  alpine:latest sleep 3600

docker exec firewall-test apk add --no-cache iputils iptables curl

# Bloquear tráfico ICMP saliente
docker exec firewall-test iptables -A OUTPUT -p icmp -j DROP
```

### Diagnóstico
```bash
# 1. Intentar ping (fallará)
docker exec firewall-test ping -c 3 container-a

# 2. Verificar reglas iptables
docker exec firewall-test iptables -L -n -v

# 3. Intentar con otro protocolo
docker exec firewall-test curl http://container-a

# 4. Ver estadísticas de paquetes bloqueados
docker exec firewall-test iptables -L OUTPUT -v
```

### Preguntas
- ¿Por qué curl funciona pero ping no?
- ¿Qué reglas están bloqueando tráfico?
- ¿Qué protocolos están afectados?

### Solución
```bash
# Eliminar la regla bloqueante
docker exec firewall-test iptables -D OUTPUT -p icmp -j DROP

# Verificar
docker exec firewall-test ping -c 3 container-a
```

---

## 📊 Script de Diagnóstico Completo

Guarda este script como `docker-net-check.sh`:

```bash
#!/bin/bash

CONTAINER_NAME=$1
TARGET=$2

if [ -z "$CONTAINER_NAME" ] || [ -z "$TARGET" ]; then
    echo "Uso: $0 <contenedor_origen> <contenedor_destino>"
    exit 1
fi

echo "=== DIAGNÓSTICO DE CONECTIVIDAD ==="
echo "Origen: $CONTAINER_NAME"
echo "Destino: $TARGET"
echo ""

echo "1. Test de ping:"
docker exec $CONTAINER_NAME ping -c 3 $TARGET 2>&1 | tail -3
echo ""

echo "2. Interfaces de red:"
docker exec $CONTAINER_NAME ip addr show 2>&1 | grep -E "inet |^[0-9]"
echo ""

echo "3. Tabla de routing:"
docker exec $CONTAINER_NAME ip route show 2>&1
echo ""

echo "4. Configuración DNS:"
docker exec $CONTAINER_NAME cat /etc/resolv.conf 2>&1
echo ""

echo "5. Redes del contenedor:"
docker inspect $CONTAINER_NAME | grep -A 20 Networks
echo ""

echo "6. IP del destino:"
docker inspect $TARGET 2>&1 | grep IPAddress | head -1
echo ""
```

Uso:
```bash
chmod +x docker-net-check.sh
./docker-net-check.sh container-b container-a
```

---

## 🧹 Limpieza del Laboratorio

```bash
# Detener y eliminar todos los contenedores del lab
docker stop container-a container-b container-c web-server web-client \
  isolated-a isolated-b firewall-test 2>/dev/null

docker rm container-a container-b container-c web-server web-client \
  isolated-a isolated-b firewall-test 2>/dev/null

# Eliminar redes
docker network rm lab-network lab-network-2 2>/dev/null
```

---

## 📝 Plantilla de Reporte

```
LABORATORIO DE CONECTIVIDAD DOCKER
FECHA: ___________
ESTUDIANTE: ___________

EJERCICIO #: _____
PROBLEMA SIMULADO: ___________

SÍNTOMAS OBSERVADOS:
□ Ping falla
□ Resolución DNS no funciona
□ Servicios TCP no accesibles
□ Contenedores en redes diferentes
□ Firewall bloqueando tráfico

COMANDOS UTILIZADOS PARA DIAGNÓSTICO:
1. ___________
2. ___________
3. ___________

CAUSA IDENTIFICADA:
___________

SOLUCIÓN APLICADA:
___________

VERIFICACIÓN EXITOSA: □ Sí  □ No

APRENDIZAJES:
___________
```

---

## 🎯 Desafío Final

Crea un escenario complejo combinando varios problemas:
1. Tres contenedores en dos redes diferentes
2. Uno con DNS mal configurado
3. Otro con reglas de firewall
4. Diagnostica y soluciona paso a paso

¡Buena suerte! 🚀