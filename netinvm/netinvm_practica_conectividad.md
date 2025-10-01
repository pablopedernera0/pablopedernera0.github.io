# Práctica NetinVM: Diagnóstico de Conectividad inta ↔ intb

## Objetivo
Diagnosticar y solucionar un problema de conectividad entre las máquinas `inta` e `intb` en la red interna del laboratorio NetinVM.

## Escenario del Problema
Las máquinas `inta` e `intb` han perdido conectividad entre ellas. Los usuarios reportan que no pueden acceder a servicios compartidos ni realizar transferencias de archivos entre ambos hosts.

## Información Inicial
- **Topología**: Ambas máquinas están en la red interna (int)
- **Síntoma**: No hay conectividad entre `inta` e `intb`
- **Otras conexiones**: El acceso desde `base` hacia ambas máquinas funciona correctamente

## Metodología de Diagnóstico

### Paso 1: Verificación Básica de Conectividad
```bash
# Desde inta hacia intb
ping -c 4 intb.example.net
ping -c 4 [IP_de_intb]

# Desde intb hacia inta  
ping -c 4 inta.example.net
ping -c 4 [IP_de_inta]
```

**Posibles resultados y significado:**
- **Sin respuesta**: Problema de red, firewall o host apagado
- **Destination Host Unreachable**: Problema de routing
- **Name resolution failed**: Problema de DNS

### Paso 2: Verificación de Configuración de Red

#### Comprobar interfaces de red
```bash
# En ambas máquinas
ip addr show
ip link show
```

#### Verificar tabla de routing
```bash
# En ambas máquinas
ip route show
route -n
```

#### Comprobar resolución DNS
```bash
# Verificar resolución de nombres
nslookup inta.example.net
nslookup intb.example.net
dig inta.example.net
dig intb.example.net
```

### Paso 3: Análisis de Servicios de Red

#### Verificar servicios DHCP y DNS
```bash
# Comprobar configuración IP obtenida por DHCP
cat /var/lib/dhcp/dhclient.leases
dhclient -v

# Verificar configuración DNS
cat /etc/resolv.conf
```

#### Comprobar ARP
```bash
# Ver tabla ARP
arp -a
ip neigh show
```

### Paso 4: Diagnóstico de Firewall

#### Verificar reglas de iptables
```bash
# Listar reglas actuales
iptables -L -n -v
iptables -t nat -L -n -v

# Verificar si hay reglas bloqueando tráfico
iptables -L INPUT -n --line-numbers
iptables -L OUTPUT -n --line-numbers
```

#### Análisis de logs del sistema
```bash
# Revisar logs de firewall y sistema
tail -f /var/log/messages
tail -f /var/log/syslog
dmesg | grep -i network
```

### Paso 5: Pruebas de Conectividad Específicas

#### Test de puertos específicos
```bash
# Verificar conectividad SSH
telnet intb.example.net 22
nc -zv intb.example.net 22

# Test con diferentes protocolos
nc -u intb.example.net 53  # DNS UDP
nc -zv intb.example.net 80  # HTTP TCP
```

#### Análisis con traceroute
```bash
# Rastrear ruta de paquetes
traceroute intb.example.net
mtr intb.example.net
```

## Problemas Comunes y Soluciones

### Problema 1: Firewall Bloqueando Tráfico
**Síntoma**: Ping falla, pero configuración de red es correcta
**Diagnóstico**:
```bash
iptables -L INPUT | grep DROP
iptables -L OUTPUT | grep DROP
```
**Solución**:
```bash
# Permitir tráfico ICMP entre redes internas
iptables -I INPUT -s 192.168.1.0/24 -p icmp -j ACCEPT
iptables -I OUTPUT -d 192.168.1.0/24 -p icmp -j ACCEPT
```

### Problema 2: Configuración IP Incorrecta
**Síntoma**: Host unreachable o wrong network
**Diagnóstico**:
```bash
ip addr show eth0
ip route show default
```
**Solución**:
```bash
# Renovar IP por DHCP
dhclient -r && dhclient
# O configurar IP estática si es necesario
```

### Problema 3: Problemas DNS
**Síntoma**: Ping por IP funciona, por nombre no
**Diagnóstico**:
```bash
nslookup intb.example.net
cat /etc/resolv.conf
```
**Solución**:
```bash
# Verificar que apunte al DNS correcto (base.example.net)
echo "nameserver 192.168.1.1" > /etc/resolv.conf
```

### Problema 4: Interface de Red Caída
**Síntoma**: No hay conectividad alguna desde el host
**Diagnóstico**:
```bash
ip link show eth0
```
**Solución**:
```bash
# Levantar interface
ip link set eth0 up
# Reiniciar servicios de red
systemctl restart networking
```

## Herramientas de Monitorización Avanzada

### Captura de Tráfico con tcpdump
```bash
# Capturar tráfico ICMP entre hosts
tcpdump -i eth0 -n icmp and host intb.example.net

# Capturar todo el tráfico hacia/desde intb
tcpdump -i eth0 -n host intb.example.net
```

### Análisis con Wireshark
1. Iniciar captura en la interface de red interna
2. Generar tráfico de prueba (ping, telnet)
3. Analizar paquetes capturados para identificar dónde se pierden

## Ejercicio Práctico Propuesto

### Configuración del Problema (Instructor)
```bash
# En inta: Simular problema de firewall
iptables -I OUTPUT -d intb.example.net -j DROP

# En intb: Simular problema de DNS
echo "nameserver 8.8.8.8" > /etc/resolv.conf
```

### Tareas del Estudiante
1. **Diagnóstico Inicial**: Identificar que hay pérdida de conectividad
2. **Análisis Sistemático**: Seguir la metodología propuesta
3. **Identificación del Problema**: Determinar la causa raíz
4. **Implementación de Solución**: Corregir la configuración
5. **Verificación**: Confirmar que la conectividad se restauró
6. **Documentación**: Registrar el problema y la solución aplicada

## Documentación de Resultados

### Plantilla de Reporte
```
PROBLEMA: Pérdida de conectividad entre inta e intb
FECHA: ___________
TÉCNICO: ___________

SÍNTOMAS OBSERVADOS:
- [ ] Ping falla
- [ ] Resolución DNS no funciona  
- [ ] Servicios TCP no accesibles
- [ ] Otros: ___________

DIAGNÓSTICO REALIZADO:
- [ ] Verificación de interfaces de red
- [ ] Comprobación de routing
- [ ] Análisis de firewall
- [ ] Test de DNS
- [ ] Análisis de logs

CAUSA IDENTIFICADA:
___________

SOLUCIÓN APLICADA:
___________

VERIFICACIÓN:
- [ ] Ping exitoso
- [ ] Servicios accesibles
- [ ] DNS resuelve correctamente

TIEMPO DE RESOLUCIÓN: _____ minutos
```

## Extensiones de la Práctica

### Nivel Intermedio
- Implementar monitorización continua con scripts
- Configurar alertas automáticas por pérdida de conectividad
- Practicar con diferentes protocolos (UDP, TCP específicos)

### Nivel Avanzado
- Simular problemas de routing entre segmentos
- Implementar soluciones de alta disponibilidad
- Integrar con herramientas de monitorización profesional

---

**Nota**: Esta práctica está diseñada para ser ejecutada en el entorno NetinVM y simula problemas reales que los administradores enfrentan en entornos de producción.