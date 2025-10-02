# Guía de Referencia Rápida
## Diagnóstico de Redes en Docker

---

## 📋 Comandos Básicos de Red

### Listar Redes
```bash
docker network ls
```
Muestra todas las redes Docker disponibles en el sistema.

### Inspeccionar una Red
```bash
docker network inspect <nombre_red>
```
Muestra información detallada de una red, incluyendo contenedores conectados, subnet, gateway, etc.

### Crear una Red
```bash
docker network create <nombre_red>
```
Crea una nueva red bridge personalizada.

### Conectar Contenedor a Red
```bash
docker network connect <nombre_red> <nombre_contenedor>
```
Conecta un contenedor existente a una red adicional.

### Desconectar Contenedor de Red
```bash
docker network disconnect <nombre_red> <nombre_contenedor>
```
Desconecta un contenedor de una red específica.

---

## 🔍 Comandos de Diagnóstico en Contenedores

### Ping - Verificar Conectividad Básica
```bash
docker exec <contenedor> ping -c 3 <destino>
```
**¿Qué verifica?** Conectividad de red básica y resolución de nombres DNS.
**Protocolo usado:** ICMP

### Ver Interfaces de Red
```bash
docker exec <contenedor> ip addr show
```
**¿Qué muestra?** Todas las interfaces de red, direcciones IP asignadas y estado de cada interfaz.

### Ver Tabla de Enrutamiento
```bash
docker exec <contenedor> ip route show
```
**¿Qué muestra?** Cómo el contenedor enruta el tráfico, gateway predeterminado y rutas específicas.

### Verificar DNS
```bash
docker exec <contenedor> cat /etc/resolv.conf
```
**¿Qué muestra?** Servidor(es) DNS configurados. Docker por defecto usa su DNS interno (127.0.0.11).

### Resolución de Nombres DNS
```bash
docker exec <contenedor> nslookup <nombre_host>
```
**¿Qué hace?** Intenta resolver un nombre de dominio o contenedor usando el DNS configurado.

### Verificar Puertos Abiertos (Netstat)
```bash
docker exec <contenedor> netstat -tlnp
```
**Flags:**
- `-t`: Conexiones TCP
- `-l`: Sockets escuchando
- `-n`: Mostrar direcciones numéricas
- `-p`: Mostrar proceso asociado

**¿Qué buscar?** La columna "Local Address" muestra en qué interfaz escucha (0.0.0.0 = todas, 127.0.0.1 = solo localhost).

### Test de Conectividad a Puerto Específico
```bash
docker exec <contenedor> nc -zv <host> <puerto>
```
**¿Qué hace?** Verifica si un puerto específico está abierto y accesible.

### Test HTTP/HTTPS
```bash
docker exec <contenedor> curl http://<host>:<puerto>
docker exec <contenedor> curl -v http://<host>:<puerto>  # Modo verbose
```
**¿Qué hace?** Intenta conectarse a un servicio web. `-v` muestra detalles de la conexión.

### Ver Procesos en Ejecución
```bash
docker exec <contenedor> ps aux
docker exec <contenedor> ps aux | grep <proceso>
```
**¿Qué verifica?** Si un servicio/proceso está realmente corriendo dentro del contenedor.

---

## 🛠️ Inspección de Contenedores

### Información Completa del Contenedor
```bash
docker inspect <contenedor>
```
Muestra toda la configuración del contenedor en formato JSON.

### Ver Solo Redes del Contenedor
```bash
docker inspect <contenedor> | grep -A 20 Networks
```
Muestra las redes a las que está conectado y su configuración de red.

### Obtener IP de un Contenedor
```bash
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <contenedor>
```
Extrae solo la dirección IP del contenedor.

### Ver Todas las IPs de un Contenedor
```bash
docker inspect <contenedor> | grep IPAddress
```
Útil cuando un contenedor está conectado a múltiples redes.

---

## 🔥 Firewall y Seguridad (iptables)

### Ver Todas las Reglas de Firewall
```bash
docker exec <contenedor> iptables -L -n -v
```
**Flags:**
- `-L`: Listar reglas
- `-n`: Mostrar IPs numéricas
- `-v`: Modo verbose (muestra contadores)

### Ver Reglas de una Cadena Específica
```bash
docker exec <contenedor> iptables -L OUTPUT -v
docker exec <contenedor> iptables -L INPUT -v
```
**Cadenas comunes:**
- `INPUT`: Tráfico entrante
- `OUTPUT`: Tráfico saliente
- `FORWARD`: Tráfico reenviado

### Agregar Regla de Bloqueo (ejemplo)
```bash
docker exec <contenedor> iptables -A OUTPUT -p icmp -j DROP
```
**¿Qué hace?** Bloquea (DROP) todo el tráfico ICMP (ping) saliente.

### Eliminar Regla de Bloqueo
```bash
docker exec <contenedor> iptables -D OUTPUT -p icmp -j DROP
```
**¿Qué hace?** Elimina la regla que bloquea ICMP saliente.

---

## 📦 Gestión de Contenedores

### Listar Contenedores Activos
```bash
docker ps
```

### Listar Todos los Contenedores (incluidos detenidos)
```bash
docker ps -a
```

### Detener Contenedor
```bash
docker stop <contenedor>
```

### Eliminar Contenedor
```bash
docker rm <contenedor>
docker rm -f <contenedor>  # Forzar eliminación (detiene y elimina)
```

### Ver Logs de un Contenedor
```bash
docker logs <contenedor>
docker logs -f <contenedor>  # Seguir logs en tiempo real
```

### Ejecutar Comando en Contenedor
```bash
docker exec <contenedor> <comando>
docker exec -it <contenedor> sh  # Abrir shell interactivo
```

---

## 🧪 Instalación de Herramientas en Contenedores Alpine

Muchos contenedores Alpine vienen sin herramientas de red. Instálalas así:

```bash
# Actualizar repositorios
docker exec <contenedor> apk update

# Instalar herramientas básicas
docker exec <contenedor> apk add --no-cache iputils curl

# Instalar herramientas DNS
docker exec <contenedor> apk add --no-cache bind-tools

# Instalar netcat
docker exec <contenedor> apk add --no-cache netcat-openbsd

# Instalar netstat
docker exec <contenedor> apk add --no-cache busybox-extras

# Instalar iptables
docker exec <contenedor> apk add --no-cache iptables

# Todo en uno
docker exec <contenedor> apk add --no-cache curl bind-tools iputils busybox-extras netcat-openbsd
```

---

## 🐛 Problemas Comunes y Cómo Diagnosticarlos

### Problema 1: Contenedor No Puede Hacer Ping

**Posibles causas:**
1. ❌ **No está conectado a ninguna red**
   - Verificar: `docker inspect <contenedor> | grep -A 20 Networks`
   - Solución: `docker network connect <red> <contenedor>`

2. ❌ **Contenedores en redes diferentes**
   - Verificar: `docker network inspect <red1>` y `docker network inspect <red2>`
   - Solución: Conectar a la misma red o crear puente entre redes

3. ❌ **Firewall bloqueando ICMP**
   - Verificar: `docker exec <contenedor> iptables -L -n -v`
   - Solución: Eliminar regla que bloquea ICMP

---

### Problema 2: Contenedor No Resuelve Nombres

**Posibles causas:**
1. ❌ **DNS configurado incorrectamente**
   - Verificar: `docker exec <contenedor> cat /etc/resolv.conf`
   - Debe mostrar: `nameserver 127.0.0.11` (DNS interno de Docker)
   - Solución: No usar `--dns` personalizado, o usar DNS interno de Docker

2. ❌ **No está en una red personalizada**
   - Los contenedores deben estar en una red bridge personalizada para resolución automática de nombres
   - Verificar: `docker network inspect <red>`

---

### Problema 3: Ping Funciona pero Servicios No

**Posibles causas:**
1. ❌ **Servicio escuchando solo en localhost (127.0.0.1)**
   - Verificar: `docker exec <contenedor> netstat -tlnp`
   - Buscar: Local Address debe ser `0.0.0.0:puerto` no `127.0.0.1:puerto`
   - Solución: Configurar servicio para escuchar en `0.0.0.0` o todas las interfaces

2. ❌ **Puerto incorrecto**
   - Verificar: `docker exec <contenedor> nc -zv <host> <puerto>`
   - Verificar qué puertos están abiertos: `netstat -tlnp`

3. ❌ **Firewall bloqueando puerto específico**
   - Verificar: `docker exec <contenedor> iptables -L -n -v`

---

## 🌐 Tipos de Redes en Docker

### Bridge (Por Defecto)
- Red privada interna en el host
- Contenedores pueden comunicarse entre sí
- Necesita port mapping para acceso externo

### Bridge Personalizada (Recomendada)
- Igual que bridge pero con DNS automático
- Los contenedores pueden encontrarse por nombre
- Mejor aislamiento

### Host
- Contenedor usa directamente la red del host
- Sin aislamiento de red
- Mejor rendimiento pero menor seguridad

### None
- Sin red
- Contenedor completamente aislado

---

## 📚 Conceptos Importantes

### DNS Interno de Docker
- Docker proporciona un servidor DNS en `127.0.0.11`
- Resuelve automáticamente nombres de contenedores en la misma red
- Solo funciona en redes bridge personalizadas

### Resolución de Nombres
```
contenedor_a -> DNS Docker (127.0.0.11) -> IP de contenedor_b
```

### 0.0.0.0 vs 127.0.0.1
- **0.0.0.0**: Escucha en TODAS las interfaces (accesible desde la red)
- **127.0.0.1**: Escucha SOLO en localhost (solo accesible desde dentro del contenedor)

### Protocolos Comunes
- **ICMP**: Usado por ping
- **TCP**: Conexiones confiables (HTTP, SSH, etc.)
- **UDP**: Conexiones sin estado (DNS, etc.)

---

## 🔗 Links Útiles

### Documentación Oficial
- **Docker Networking Overview**: https://docs.docker.com/network/
- **Docker Network Commands**: https://docs.docker.com/engine/reference/commandline/network/
- **Docker Container Networking**: https://docs.docker.com/config/containers/container-networking/

### Tutoriales y Guías
- **Docker Networking Tutorial**: https://docs.docker.com/network/network-tutorial-standalone/
- **Bridge Networks**: https://docs.docker.com/network/bridge/
- **Troubleshooting Docker Networks**: https://docs.docker.com/config/daemon/troubleshoot/

### Herramientas de Diagnóstico
- **iproute2 Docs** (ip command): https://www.man7.org/linux/man-pages/man8/ip.8.html
- **netstat Docs**: https://linux.die.net/man/8/netstat
- **iptables Tutorial**: https://www.frozentux.net/iptables-tutorial/iptables-tutorial.html

### Alpine Linux
- **Alpine Packages Search**: https://pkgs.alpinelinux.org/packages
- **APK Command Docs**: https://wiki.alpinelinux.org/wiki/Alpine_Package_Keeper

---

## 💡 Tips y Mejores Prácticas

### ✅ Para Desarrollo
1. Usa siempre redes bridge personalizadas (no la default)
2. Nombra tus contenedores para facilitar la referencia
3. Agrupa contenedores relacionados en la misma red
4. Usa `docker-compose` para aplicaciones multi-contenedor

### ✅ Para Diagnóstico
1. Comienza siempre con lo básico: ping y conectividad
2. Verifica la configuración de red antes de buscar problemas complejos
3. Usa `-v` (verbose) en comandos para más información
4. Revisa logs del contenedor si un servicio no responde

### ✅ Para Seguridad
1. No expongas puertos innecesariamente
2. Usa redes separadas para diferentes aplicaciones
3. Limita capacidades del contenedor (`--cap-drop`, `--cap-add`)
4. Revisa periódicamente reglas de firewall

### ⚠️ Evita
1. Usar la red `bridge` por defecto (no tiene DNS automático)
2. Ejecutar contenedores con `--network host` sin necesidad
3. Dar privilegios innecesarios (`--privileged`)
4. Hardcodear IPs en lugar de usar nombres

---

## 🎯 Metodología de Diagnóstico

### Paso 1: Verificar Estado Básico
```bash
docker ps                           # ¿Está corriendo?
docker logs <contenedor>            # ¿Hay errores?
docker inspect <contenedor>         # Configuración correcta?
```

### Paso 2: Verificar Conectividad
```bash
docker exec <contenedor> ping -c 3 <destino>
docker exec <contenedor> ip addr show
docker exec <contenedor> ip route show
```

### Paso 3: Verificar DNS
```bash
docker exec <contenedor> cat /etc/resolv.conf
docker exec <contenedor> nslookup <nombre>
```

### Paso 4: Verificar Redes
```bash
docker network ls
docker network inspect <red>
docker inspect <contenedor> | grep -A 20 Networks
```

### Paso 5: Verificar Servicios y Puertos
```bash
docker exec <contenedor> ps aux | grep <servicio>
docker exec <contenedor> netstat -tlnp
docker exec <contenedor> nc -zv <host> <puerto>
```

### Paso 6: Verificar Firewall
```bash
docker exec <contenedor> iptables -L -n -v
```

---

## 📝 Script de Diagnóstico Automático

Guarda esto como `docker-diag.sh`:

```bash
#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Uso: $0 <contenedor_origen> <contenedor_destino>"
    exit 1
fi

ORIGEN=$1
DESTINO=$2

echo "========================================="
echo "DIAGNÓSTICO DE CONECTIVIDAD DOCKER"
echo "========================================="
echo "Origen: $ORIGEN"
echo "Destino: $DESTINO"
echo ""

echo "1️⃣  TEST DE CONECTIVIDAD (PING)"
echo "-----------------------------------"
docker exec $ORIGEN ping -c 3 $DESTINO 2>&1 | tail -5
echo ""

echo "2️⃣  INTERFACES DE RED"
echo "-----------------------------------"
docker exec $ORIGEN ip addr show 2>&1 | grep -E "inet |^[0-9]:"
echo ""

echo "3️⃣  TABLA DE ENRUTAMIENTO"
echo "-----------------------------------"
docker exec $ORIGEN ip route show 2>&1
echo ""

echo "4️⃣  CONFIGURACIÓN DNS"
echo "-----------------------------------"
docker exec $ORIGEN cat /etc/resolv.conf 2>&1
echo ""

echo "5️⃣  REDES DEL CONTENEDOR ORIGEN"
echo "-----------------------------------"
docker inspect $ORIGEN 2>&1 | grep -A 15 "Networks"
echo ""

echo "6️⃣  IP DEL CONTENEDOR DESTINO"
echo "-----------------------------------"
docker inspect $DESTINO 2>&1 | grep "IPAddress" | head -1
echo ""

echo "========================================="
echo "DIAGNÓSTICO COMPLETADO"
echo "========================================="
```

**Uso:**
```bash
chmod +x docker-diag.sh
./docker-diag.sh container-b container-a
```

---

## 📞 Comandos de Limpieza

### Limpiar Contenedores
```bash
# Detener todos los contenedores
docker stop $(docker ps -aq)

# Eliminar todos los contenedores detenidos
docker container prune

# Eliminar contenedor específico
docker rm -f <contenedor>
```

### Limpiar Redes
```bash
# Eliminar redes no utilizadas
docker network prune

# Eliminar red específica
docker network rm <red>
```

### Limpieza Completa
```bash
# ⚠️ CUIDADO: Esto elimina TODO lo no usado
docker system prune -a --volumes
```

---

**Última actualización:** Octubre 2025  
**Versión:** 1.0  
**Autor:** Laboratorio Docker - Diagnóstico de Redes