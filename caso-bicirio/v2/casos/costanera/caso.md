# Caso Costanera Deportes: la medianoche del Hot Sale

Leelo completo antes de empezar el cuestionario. Los números de esa noche están más abajo, en "El pizarrón".

## La tienda

**Costanera Deportes** es una tienda de indumentaria deportiva de Rosario, con local a la calle y tienda online desde hace un año. Vende unos **600 productos**, cada uno con sus talles y colores. El stock es **uno solo** para el local y la web: si se vende un par de zapatillas en el mostrador, desaparece de la web, y al revés.

La tienda online la hizo una consultora y la mantiene un programador freelance que pasa una vez por semana. El cobro se hace con **Mercado Pago**.

## Los requisitos con los que se construyó

Cuando se armó la tienda, se escribieron estos requisitos no funcionales. Se cumplieron todos en las pruebas de entrega:

- **RNF-01.** El catálogo, el carrito y "Mi cuenta" responden en 3 segundos o menos, probado con **50 usuarios simultáneos**.
- **RNF-02.** El checkout se completa en 5 segundos o menos, **sin contar el tiempo de respuesta de Mercado Pago**.
- **RNF-03.** El sistema procesa al menos 10 pedidos por minuto en hora pico.
- **RNF-04.** El sistema está disponible al menos el **95 % del tiempo en horario comercial (9:00 a 20:00)**.
- **RNF-14.** Cada imagen de producto pesa **menos de 300 KB**.

## Cómo está armada la tienda online

Todo corre en un solo servidor virtual alquilado (un VPS) en un proveedor nacional: **2 vCPU, 4 GB de RAM y un enlace de 100 Mbps**. Adentro hay:

### Servidor web (Nginx)

Recibe los pedidos. Las páginas se las pide a la app; las **imágenes y los estilos los manda él directamente**, sin pasar por la app.

### La app de la tienda

Arma las páginas y hace el checkout. Tiene **8 workers**. Una página del catálogo le lleva unos **100 ms** de trabajo.

### Base de datos (MySQL)

Productos, stock, clientes, pedidos y cupones.

## Datos que midió el programador

- Una página de producto pesa unos **1.100 KB**: 40 KB de HTML, 60 KB de estilos y logo, y **4 fotos de 250 KB** cada una. Todas cumplen el RNF-14.
- En el checkout, la app le pide el cobro a Mercado Pago y **espera su respuesta** antes de confirmar el pedido. Mientras espera, ese worker no atiende a nadie más. Un día normal, Mercado Pago contesta en **1 segundo**.
- Si la app tarda más de **30 segundos** en responder, contando el tiempo que el pedido esperó turno, Nginx corta la espera y le muestra al cliente un error **504 Gateway Time-out**. La app abandona ese checkout a la mitad: no guarda el pedido.
- Mirando la documentación, encontró que Mercado Pago puede **avisarle a la tienda** cuando un pago queda aprobado (una notificación), en lugar de que la tienda se quede esperando la respuesta.

## Qué pasó en el Hot Sale

El Hot Sale arrancó el lunes a las **00:00**. Costanera Deportes lo anunció en Instagram con un 40 % de descuento en zapatillas y un cupón **HOT100**, de un solo uso por persona y solo para los **primeros 100 compradores**.

A las 00:02 la tienda dejó de responder. El catálogo quedaba cargando, las fotos aparecían a medias y muchos checkouts terminaban en 504. El servidor recién se normalizó a la mañana.

El martes, el local recibió tres tipos de reclamos:

1. **37 clientes** a los que Mercado Pago les había cobrado, pero la tienda no tenía ningún pedido a su nombre.
2. Del modelo de zapatillas más pedido, en talle 42 **quedaban 3 pares y se vendieron 11**. Hubo que llamar a 8 clientes para cancelarles la compra.
3. El cupón HOT100, pensado para 100 compradores, se usó **140 veces**.

## El pizarrón

> En la apertura, cada usuario conectado pedía en promedio una página cada 30 segundos.

### Domingo 23:00 (la noche anterior)

- Usuarios conectados a la vez: **120**
- Páginas/s que llegan: **4**
- Páginas/s atendidas: **4**
- Latencia p95: **0,3 s**
- Workers ocupados: **2 de 8**
- CPU del servidor: **15 %**
- Enlace (de 100): **35 Mbps**
- Respuesta de Mercado Pago: **1 s**

### Lunes 00:05 (la apertura)

- Usuarios conectados a la vez: **1.800**
- Páginas/s que llegan: **60**
- Páginas/s atendidas: **11**
- Latencia p95: **25 s**
- Workers ocupados: **8 de 8**
- CPU del servidor: **35 %**
- Enlace (de 100): **100 Mbps**
- Respuesta de Mercado Pago: **8 s**
- Checkouts por segundo: **5**

### Lunes 10:00 (a la mañana)

- Usuarios conectados a la vez: **300**
- Páginas/s que llegan: **10**
- Páginas/s atendidas: **10**
- Latencia p95: **0,6 s**
- Workers ocupados: **4 de 8**
- CPU del servidor: **20 %**
- Enlace (de 100): **88 Mbps**
- Respuesta de Mercado Pago: **2 s**

## Lo que encontró el programador en el código

Para vender, la app hace tres pasos separados: **1)** lee de la base cuántas unidades quedan, **2)** si hay, sigue con el pago, y **3)** al final descuenta la unidad vendida. El cupón funciona igual: lee cuántas veces se usó, deja pasar la compra si son menos de 100 y recién después suma uno.

## Lo que viene

En **seis semanas** es el Cyber Monday. El dueño quiere saber qué cambiar. Le ofrecieron dos opciones, y la plata alcanza para una sola:

- **Un VPS 4 veces más grande** (8 vCPU, 16 GB) que se paga **todos los meses del año**.
- **Pasar a la nube con autoescalado**: la tienda corre en servidores que se suman solos cuando sube la carga y se apagan cuando baja. Se paga **por hora de uso**. En el año hay tres eventos grandes (Hot Sale, Cyber Monday y Black Friday), de unos tres días cada uno.

Además, hay cambios que cuestan poco o nada:

- Un **CDN** para las imágenes y los estilos: un servicio que guarda copias en servidores repartidos por el país y se las entrega al navegador en lugar del VPS de la tienda. El plan gratuito alcanza.
- Usar la **notificación de Mercado Pago**: el pedido queda "pago pendiente", el worker se libera enseguida y el pedido se confirma cuando llega el aviso.
- Cambiar cómo se descuenta el stock y cómo se cuentan los usos del cupón.

Las slides con las que se presentó el caso: [ver slides](https://pablopedernera0.github.io/caso-costanera-af/slides.html).
