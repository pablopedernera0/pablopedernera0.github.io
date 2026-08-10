# Etapa 1 — crud-stress-test: guía de estudio

Material de repaso para acompañar la práctica `crud-stress-test`. Desarrolla los conceptos que vas a necesitar para interpretar lo que hagas en cada paso: los cuatro números que mide un stress test, la herramienta `ab`, cómo funciona el servidor de una app Flask y qué es Gunicorn.

---

## 1. Los cuatro números que mide un stress test

### Throughput (rendimiento / caudal)

Es la cantidad de peticiones que el sistema logra completar por unidad de tiempo, normalmente expresada en **requests por segundo (req/s)**. Responde la pregunta "¿cuánto tráfico aguanta esta infraestructura, tal como está configurada hoy?".

Se calcula, de forma simple, como:

```
throughput = peticiones completadas / tiempo total del test
```

Es la primera cifra que reporta `ab` (`Requests per second`). Un throughput alto por sí solo no alcanza para decir que un servicio anda bien — hay que mirarlo junto con la tasa de error y la latencia, porque un sistema puede sostener un throughput alto simplemente **descartando** peticiones en vez de atenderlas.

### Latencia

Es el tiempo que transcurre entre que se envía una petición y se recibe la respuesta completa. A diferencia del throughput (una medida agregada de todo el test), la latencia es una medida **por petición individual**, así que se resume con estadísticas:

- **Promedio (mean):** útil como primer vistazo, pero puede ser engañoso — unas pocas peticiones muy lentas pueden pasar desapercibidas si la mayoría fue rápida.
- **Percentiles (p50, p95, p99):** el percentil 95, por ejemplo, es el tiempo por debajo del cual respondió el 95% de las peticiones. Son mucho más representativos de la experiencia real, porque muestran qué le pasa a la "cola" de peticiones con peor suerte, no solo al promedio.

`ab` reporta ambas cosas: el promedio (`Time per request`) y una tabla de percentiles (`Percentage of the requests served within a certain time`).

> **Aclaración:** en la salida de `ab`, "Time per request" aparece **dos veces**, con números distintos. El primero es el tiempo que percibe un cliente individual esperando su respuesta (equivale a `tiempo_total / (n / concurrencia)`). El segundo, "(mean, across all concurrent requests)", divide por el total de peticiones sin ajustar por concurrencia (`tiempo_total / n`) — por eso da un número menor, y está directamente relacionado con el throughput (es, aproximadamente, `1000 / throughput`).

### Concurrencia

Es la cantidad de peticiones que están **en curso al mismo tiempo**, no la cantidad total enviada. Es la variable que controlás directamente con el flag `-c` de `ab`: `-n 500 -c 20` significa "mandá 500 peticiones en total, pero nunca más de 20 al mismo tiempo".

Concurrencia y throughput no son lo mismo, aunque se relacionan. Una forma simple de verlo: si un servidor atiende una petición por vez (concurrencia 1) y cada una tarda 100ms, el throughput máximo posible es 10 req/s, sin importar cuántas peticiones se acumulen esperando. Subir la concurrencia sin que el servidor pueda procesar más en paralelo no aumenta el throughput — solo hace que las peticiones esperen más tiempo en cola, es decir, sube la latencia.

> **Para profundizar (opcional):** esta relación tiene un nombre formal en teoría de colas, la **Ley de Little**: `L = λ × W`, donde `L` es la concurrencia promedio (peticiones en el sistema), `λ` es el throughput y `W` es la latencia promedio. Si el throughput real de un servidor está topado (no puede crecer más), subir la concurrencia solo puede compensarse con una `W` (latencia) más alta.

### Tasa de error

Es la proporción de peticiones que **no** se completaron con éxito: timeouts, conexiones rechazadas, o respuestas con código de error. `ab` las reporta en `Failed requests`.

Es la señal más clara de que un sistema llegó a su límite: el throughput puede parecer estable (o incluso alto) bajo carga creciente, pero la tasa de error es la que revela que, en realidad, cada vez se están descartando más peticiones para sostener ese número. Un throughput "bueno" con tasa de error creciente no es un sistema funcionando bien — es un sistema fallando de forma silenciosa.

---

## 2. La herramienta: Apache Bench (`ab`)

`ab` es una utilidad de línea de comandos que viene con el proyecto Apache HTTP Server (paquete `apache2-utils` en Debian/Ubuntu). A pesar del nombre, no depende de que el servidor de destino sea Apache — sirve para generar carga HTTP contra cualquier servidor web, y es una de las herramientas de stress testing más simples que existen.

**Cómo funciona:** `ab` abre hasta `-c` conexiones simultáneas y va disparando peticiones hasta completar un total de `-n`, midiendo el tiempo de cada una y contando éxitos/fallos.

**Flags que vas a usar en la práctica:**

| Flag | Qué hace |
|---|---|
| `-n <número>` | Cantidad total de peticiones a enviar |
| `-c <número>` | Concurrencia: cuántas peticiones simultáneas mantener en vuelo |
| `-p <archivo>` | Body a enviar en una petición `POST` (leído de un archivo) |
| `-T <content-type>` | Header `Content-Type` a usar junto con `-p` |
| `-s <segundos>` | Timeout por petición |

**Cómo leer la salida (de arriba hacia abajo):**

1. **`Complete requests` / `Failed requests`** — cuántas terminaron, cuántas fallaron. Es lo primero a mirar: si `Failed requests` es alto, el resto de los números hay que leerlos con cautela.
2. **`Requests per second`** — el throughput.
3. **`Time per request`** (las dos líneas explicadas arriba) — la latencia.
4. **`Connection Times`** (tabla con `min/mean/[+/-sd]/median/max`) — desglosa la latencia en las etapas de una conexión HTTP: `Connect` (armar la conexión TCP), `Processing` (el servidor generando la respuesta), `Waiting` (esperando el primer byte de respuesta), `Total`.
5. **`Percentage of the requests served within a certain time`** — la tabla de percentiles.

---

## 3. Cómo maneja las peticiones el servidor de Flask

### WSGI, en una línea

Flask (y casi todo el ecosistema web de Python) sigue el estándar **WSGI** (Web Server Gateway Interface): una interfaz común entre un servidor HTTP y una aplicación Python, que permite que la misma app corra sin cambios detrás de servidores distintos. Es lo que vas a comprobar en el Paso 5: el mismo `app.py`, sin tocar una línea, corre primero con el servidor de desarrollo y después con Gunicorn.

### El servidor de desarrollo (Werkzeug)

Cuando el código llama a `app.run(...)`, Flask levanta el servidor HTTP de **Werkzeug**, pensado exclusivamente para desarrollo local: recargar código automáticamente, mostrar tracebacks detallados en el navegador, no requerir configuración. Por defecto (sin pasar `threaded=True` ni `processes=N`) es **single-threaded**: atiende **una sola petición a la vez**, en un único proceso y un único hilo.

Esto no es un descuido — Flask lo documenta explícitamente ("do not use it in a production deployment"). Con tráfico bajo, la diferencia con un servidor de producción casi no se nota, porque las peticiones son rápidas y el servidor las procesa en secuencia sin que se note la espera. Con concurrencia alta, la limitación se vuelve visible.

### Qué pasa exactamente bajo carga

Cada petición que llega mientras el servidor está ocupado con otra **no se procesa en paralelo**: queda esperando en la cola de conexiones del sistema operativo (el *backlog* del socket). Si esa cola también se llena, el sistema operativo empieza a rechazar directamente nuevas conexiones. El resultado observable: la latencia sube (las peticiones esperan cada vez más) y, más allá de cierto punto, aparecen errores (timeouts o conexiones rechazadas) — es decir, sube la tasa de error.

---

## 4. Gunicorn

**Gunicorn** ("Green Unicorn") es un servidor WSGI HTTP pensado para producción, inspirado en el servidor Unicorn de Ruby. La diferencia central con el servidor de desarrollo de Flask es el **modelo de workers**: un proceso *master* que no atiende peticiones él mismo, sino que administra varios procesos *worker* independientes, cada uno con su propia copia de la aplicación cargada en memoria.

**Por qué esto resuelve el problema de concurrencia:** al ser procesos del sistema operativo separados (no hilos dentro de un mismo proceso), varios workers pueden atender peticiones **verdaderamente en paralelo**, cada uno en su propio núcleo de CPU si hace falta. Con 4 workers, hasta 4 peticiones pueden estar siendo procesadas al mismo tiempo en vez de una sola.

**Flags que vas a usar en la práctica:**

| Flag | Qué hace |
|---|---|
| `-w <número>` | Cantidad de procesos worker a levantar |
| `-b <host:puerto>` | Dirección donde escuchar |

**Un criterio orientativo (no absoluto):** una regla de referencia habitual para aplicaciones con workers síncronos (el modo por defecto de Gunicorn) es `(2 × núcleos de CPU) + 1`. El número de workers es un recurso finito y configurable, no algo que Gunicorn resuelve solo.

**Para pensar:** el código de la aplicación sigue siendo el mismo con Gunicorn, con las mismas consultas a MySQL. Si el cuello de botella real estuviera en la base de datos (por ejemplo, un límite bajo de conexiones concurrentes en MySQL), ¿hasta qué punto ayudaría agregar más workers? ¿Qué pasaría después de ese punto?
