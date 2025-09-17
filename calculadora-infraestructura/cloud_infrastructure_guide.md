# Guía de Estimación de Infraestructura en la Nube
## Para Analistas Funcionales de Sistemas

### 1. FUNDAMENTOS DE LA ESTIMACIÓN

#### 1.1 Factores Clave a Considerar
- **Usuarios concurrentes esperados**
- **Volumen de datos a almacenar**
- **Tipo de aplicación** (estática, dinámica, tiempo real)
- **Nivel de disponibilidad requerido**
- **Requisitos de seguridad**
- **Presupuesto disponible**
- **Escalabilidad futura**

#### 1.2 Métricas Base
- **RPS (Requests Per Second)**: Peticiones por segundo
- **CCU (Concurrent Users)**: Usuarios concurrentes
- **Storage**: Almacenamiento necesario
- **Bandwidth**: Ancho de banda
- **Uptime**: Tiempo de actividad requerido

### 2. METODOLOGÍA DE ESTIMACIÓN

#### 2.1 Análisis de Usuarios

##### Factores de Pico por Industria:
| Tipo de Aplicación | Factor de Pico | Justificación |
|-------------------|----------------|---------------|
| **E-commerce** | 2.0 - 4.0 | Black Friday, Cyber Monday, ofertas flash |
| **Sistema Médico** | 1.2 - 1.5 | Horarios de consulta, urgencias menores |
| **Educación** | 3.0 - 5.0 | Inicio/fin de semestre, fechas de examen |
| **Restaurantes** | 2.5 - 3.5 | Almuerzo (12-14h), cena (19-21h) |
| **Gobierno** | 1.3 - 1.8 | Fechas límite de trámites, vencimientos |
| **Sitio Corporativo** | 1.2 - 1.4 | Horario laboral vs. fuera de horario |

##### Fórmula ajustada:
```
CCU = (Usuarios totales × % activos diarios × % concurrentes) × Factor de pico

Componentes:
- Usuarios totales: Base registrada
- % activos diarios: 10-30% típico
- % concurrentes: 5-15% de los activos
- Factor de pico: Ver tabla por industria

Ejemplo E-commerce:
- 10,000 usuarios registrados
- 25% activos diariamente (2,500)
- 10% concurrentes de activos (250)
- Factor de pico: 2.5 (ofertas especiales)
- CCU estimado: 250 × 2.5 = 625
```

##### Factores Adicionales a Considerar:
- **Estacionalidad**: Navidad, vuelta al cole, etc.
- **Campañas de marketing**: Publicidad que puede generar picos inesperados
- **Eventos externos**: Noticias, viral en redes sociales
- **Zona geográfica**: Diferencias horarias, patrones culturales
- **Tipo de dispositivo**: Móvil vs. desktop tiene patrones diferentes

#### 2.2 Cálculo de Recursos de Servidor

##### CPU y RAM por Tipo de Aplicación:
- **Sitio web estático**: 1 vCPU, 1GB RAM por 100 usuarios concurrentes
- **Aplicación web dinámica**: 2 vCPU, 4GB RAM por 50 usuarios concurrentes
- **Sistema transaccional**: 4 vCPU, 8GB RAM por 25 usuarios concurrentes
- **Sistema en tiempo real**: 8 vCPU, 16GB RAM por 10 usuarios concurrentes

#### 2.3 Estimación de Almacenamiento

##### Base de Datos:
```
Cálculo por usuario/registro:
- Usuario básico: 1-5 KB
- Transacción: 0.5-2 KB
- Imagen pequeña: 100-500 KB
- Documento: 1-10 MB
- Factor de crecimiento: 2-3x anual
```

##### Archivos y Media:
- Backup automático: 100% adicional
- Logs del sistema: 10-20% del storage total
- Cache temporal: 5-10% del storage activo

#### 2.4 Ancho de Banda
```
Fórmula:
Bandwidth = CCU × Avg_page_size × Requests_per_user_session

Ejemplo:
- 300 CCU
- 2 MB promedio por página
- 10 requests por sesión
- Bandwidth: 300 × 2MB × 10 = 6 GB/hora
```

### 3. NIVELES DE SERVICIO RECOMENDADOS

#### 3.1 Por Tipo de Negocio

| Tipo | Uptime | Escalabilidad | Backup |
|------|--------|---------------|---------|
| **E-commerce** | 99.9% | Auto | Diario |
| **Sistema Médico** | 99.95% | Manual | Cada 4h |
| **Sitio Corporativo** | 99.5% | Manual | Semanal |
| **Aplicación Educativa** | 99.0% | Manual | Diario |
| **Sistema Gubernamental** | 99.5% | Auto | Diario |

#### 3.2 Configuraciones Tipo

##### Configuración BÁSICA (Startups, Pequeños Negocios)
- **Servidor**: 1-2 vCPU, 2-4 GB RAM
- **Storage**: 50-100 GB SSD
- **Bandwidth**: 1-5 GB/mes
- **Backup**: Semanal
- **Estimado**: $20-50 USD/mes

##### Configuración INTERMEDIA (PyMEs, Sistemas Departamentales)
- **Servidor**: 2-4 vCPU, 4-8 GB RAM
- **Storage**: 100-500 GB SSD
- **Database**: Instancia dedicada
- **CDN**: Básico
- **Backup**: Diario
- **Estimado**: $100-300 USD/mes

##### Configuración EMPRESARIAL (Grandes Organizaciones)
- **Servidores**: Múltiples instancias con load balancer
- **Storage**: 1TB+ con replicación
- **Database**: Cluster con alta disponibilidad
- **CDN**: Global
- **Monitoreo**: 24/7
- **Backup**: Continuo
- **Estimado**: $500-2000+ USD/mes

### 4. CHECKLIST DE ESTIMACIÓN

#### 4.1 Análisis Funcional
- [ ] Identificar usuarios tipo y patrones de uso
- [ ] Mapear flujos de datos principales
- [ ] Determinar integraciones necesarias
- [ ] Evaluar requisitos de seguridad
- [ ] Definir SLAs (Service Level Agreements)

#### 4.2 Dimensionamiento Técnico
- [ ] Calcular usuarios concurrentes
- [ ] Estimar volumen de transacciones
- [ ] Dimensionar base de datos
- [ ] Evaluar necesidades de CDN
- [ ] Planificar estrategia de backup

#### 4.3 Consideraciones Adicionales
- [ ] Cumplimiento regulatorio (GDPR, HIPAA, etc.)
- [ ] Integración con sistemas legacy
- [ ] Planes de disaster recovery
- [ ] Monitoreo y alertas
- [ ] Escalabilidad futura

### 5. HERRAMIENTAS DE CÁLCULO

#### 5.1 Calculadoras de Proveedores
- **AWS Calculator**: Para estimar costos en Amazon Web Services
- **Azure Pricing Calculator**: Para Microsoft Azure
- **Google Cloud Pricing Calculator**: Para Google Cloud Platform

#### 5.2 Herramientas de Monitoreo
- **New Relic**: APM y monitoreo de performance
- **DataDog**: Monitoreo de infraestructura
- **Pingdom**: Monitoreo de uptime

### 6. BUENAS PRÁCTICAS

#### 6.1 Planificación
- Siempre agregar un 30-50% de margen a las estimaciones iniciales
- Considerar picos estacionales del negocio
- Planificar para el crecimiento de 2-3 años
- Evaluar opciones de autoescalado

#### 6.2 Costos
- Comparar precios entre proveedores
- Considerar reservas de instancias para ahorrar
- Implementar políticas de apagado automático para desarrollo
- Monitorear constantemente el uso real vs. estimado

#### 6.3 Seguridad
- Implementar cifrado en tránsito y reposo
- Configurar firewalls y grupos de seguridad
- Mantener backups en diferentes regiones geográficas
- Implementar autenticación multifactor

### 7. PLANTILLA DE ESTIMACIÓN

```
PROYECTO: [Nombre del proyecto]
FECHA: [Fecha de estimación]

USUARIOS:
- Usuarios registrados: ___
- Usuarios activos diarios: ___
- Usuarios concurrentes pico: ___

RECURSOS CALCULADOS:
- vCPUs necesarios: ___
- RAM necesaria: ___ GB
- Storage inicial: ___ GB
- Bandwidth mensual: ___ GB
- Nivel de servicio: ___%

COSTO ESTIMADO MENSUAL:
- Compute: $___
- Storage: $___
- Network: $___
- Backup: $___
- TOTAL: $___

CONSIDERACIONES ESPECIALES:
- [Lista de requisitos específicos]
- [Integraciones necesarias]
- [Regulaciones aplicables]
```

---

## CASOS ESPECIALES POR INDUSTRIA

### Healthcare
- Cumplimiento HIPAA/LOPD
- Backup cada 4-6 horas
- Cifrado extremo to extremo
- Auditoría completa de accesos

### E-commerce
- Disponibilidad crítica (99.9%+)
- CDN global obligatorio
- Escalado automático por estacionalidad
- Integración con pasarelas de pago

### Educación
- Picos de tráfico en fechas de examen
- Almacenamiento masivo de contenido multimedia
- Integración con sistemas académicos existentes
- Accesibilidad para diversos dispositivos

### Gobierno
- Transparencia y auditoría
- Accesibilidad según normativas
- Seguridad nacional
- Integraciones con otros sistemas gubernamentales