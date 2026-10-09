# Caso SIGA: el lunes de las inscripciones

Leelo completo antes de empezar el cuestionario. Los números de lo que pasó ese lunes están más abajo, en "El pizarrón".

## La institución

El **Instituto Superior Ribera** es un terciario público con unos **2.400 estudiantes**. Cada cuatrimestre, la inscripción a materias se hace por **SIGA**, un sistema web propio. La inscripción abre un lunes a las 8:00 y dura 48 horas. Los cupos de cada comisión se asignan por orden de llegada, así que a las 8:00 entra casi todo el mundo a la vez.

Hay un solo administrador de sistemas, que trabaja medio tiempo.

## Cómo está armado SIGA hoy

Todo corre en un solo servidor virtual de la sala de servidores del instituto: **4 vCPU, 8 GB de RAM**. Adentro hay estas piezas:

### Servidor web (Nginx)

Recibe los pedidos y se los pasa a la app. También manda las imágenes. Puerto abierto a internet: **80**.

### La app SIGA

Arma las páginas. Está levantada en modo de desarrollo, con **1 solo worker**. Puerto abierto a internet: ninguno.

### Base de datos (MySQL)

Estudiantes, materias e inscripciones. Puerto abierto a internet: **3306** (para que Secretaría use un cliente de escritorio).

### phpMyAdmin

Panel web para administrar la base. Puerto abierto a internet: **8080**.

## Datos que midió el administrador

- Con un solo usuario, cada pedido a SIGA tarda unos **45 ms**. Casi todo ese tiempo la app está esperando la respuesta de MySQL.
- Cada página de SIGA pesa unos **250 KB**: 30 KB de HTML, 20 KB entre logo y estilos, y una foto del edificio de 200 KB en el encabezado. El servidor no le dice al navegador que guarde las imágenes (no hay caché), así que cada recarga la vuelve a descargar.
- La sala de servidores sale a internet por el enlace del edificio: **100 Mbps**, el mismo que usan el wifi, los laboratorios y la administración.

## Qué pasó el lunes pasado

A las 8:00 SIGA dejó de responder. La página quedaba cargando y después mostraba **504 Gateway Time-out**. Los estudiantes apretaban F5 una y otra vez. En el edificio, el wifi también andaba lento, porque mucha gente estaba intentando inscribirse desde ahí y desde los laboratorios.

Recién a la tarde el sistema volvió a andar normal. Secretaría tuvo que extender la inscripción un día y recibió decenas de reclamos por cupos perdidos.

No había monitoreo instalado. Los números del pizarrón el administrador los reconstruyó después, a partir de los registros (logs) del servidor web y de lo que fue anotando del uso de CPU durante la mañana.

## El pizarrón

### 07:50 (antes de abrir)

- Pedidos/s que llegan: **4**
- Pedidos/s atendidos: **4**
- Latencia p95: **0,3 s**
- CPU del servidor: **12 %**
- Conexiones a la base: **3**
- Enlace (de 100): **30 Mbps**

### 08:15 (el pico)

- Pedidos/s que llegan: **180**
- Pedidos/s atendidos: **22**
- Latencia p95: **14 s**
- CPU del servidor: **28 %**
- Conexiones a la base: **3**
- Enlace (de 100): **74 Mbps**

### 14:00 (a la tarde)

- Pedidos/s que llegan: **9**
- Pedidos/s atendidos: **9**
- Latencia p95: **0,4 s**
- CPU del servidor: **14 %**
- Conexiones a la base: **3**
- Enlace (de 100): **33 Mbps**

> El enlace incluye al resto del edificio (wifi, laboratorios, administración): unos 30 Mbps, también en el pico.

## Lo que encontró después, revisando

Mientras buscaba qué había pasado, el administrador encontró otras dos cosas.

### 1. Puertos abiertos

Desde su casa, revisó qué puertos responden en la IP pública del instituto (con una herramienta llamada nmap). Respondieron tres: `80/tcp open http`, `3306/tcp open mysql` y `8080/tcp open http-proxy`.

El usuario `root` de MySQL todavía tiene la contraseña del ejemplo de instalación que se usó para armar el sistema, que está publicado en internet.

### 2. Algo raro en los logs del servidor web

El domingo a la noche, la noche anterior a la inscripción, hubo **3.200 pedidos `POST /login` desde la misma IP en 20 minutos**. Casi todos devolvieron `200` (el formulario de login otra vez, con el mensaje de error). Un `302` es una redirección: el servidor manda al navegador a otra página. Las últimas líneas fueron así:

- `203.0.113.77 [23:41:02] "POST /login" 200 1843`
- `203.0.113.77 [23:41:02] "POST /login" 200 1843`
- `203.0.113.77 [23:41:03] "POST /login" 302 0`
- `203.0.113.77 [23:41:03] "GET /panel" 200 9120`

El usuario administrador de SIGA es `admin`.

## Lo que pide la Dirección

La próxima inscripción es en **cuatro semanas**. La Dirección quiere una propuesta concreta que responda:

1. que el lunes a las 8:00 **el sistema aguante**, y que no se pierdan inscripciones;
2. que el administrador pueda **ver en vivo** cómo está el sistema y enterarse antes que los estudiantes si algo se rompe;
3. que la base de datos **deje de estar expuesta** y que lo del domingo no vuelva a pasar.

> Presupuesto: alcanza para una sola de estas dos opciones, no las dos. Alquilar una máquina en la nube (8 vCPU, 16 GB, enlace propio de 1 Gbps) durante las 48 horas de inscripción, o ampliar el enlace del edificio a 300 Mbps durante todo un año.

Además, hay cosas que no cuestan nada: subir la cantidad de workers de la app, activar el caché de imágenes y estilos en el servidor web, achicar la página, cerrar puertos e instalar un monitoreo gratuito.
