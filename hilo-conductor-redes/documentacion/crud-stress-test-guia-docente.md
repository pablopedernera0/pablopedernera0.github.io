# Etapa 1 — crud-stress-test: desarrollo de contenidos

Material de apoyo para el docente. Desarrolla en profundidad cada punto de los "Objetivos de aprendizaje" de la etapa 1 (`crud-stress-test`) del hilo conductor de redes: los cuatro conceptos que mide un stress test, la herramienta `ab`, por qué el servidor de desarrollo de Flask no aguanta carga, y qué resuelve Gunicorn. Pensado para leer antes de dar la clase, no para repartir tal cual a los alumnos.

---

## 1. Los cuatro conceptos que mide un stress test

### Throughput (rendimiento / caudal)

Es la cantidad de peticiones que el sistema logra completar por unidad de tiempo, normalmente expresada en **requests por segundo (req/s)**. Es la métrica de capacidad más directa: responde la pregunta "¿cuánto tráfico aguanta esta infraestructura, tal como está configurada hoy?".

Se calcula, de forma simple, como:

```
throughput = peticiones completadas / tiempo total del test
```

Es la primera cifra que reporta `ab` (`Requests per second`). Un throughput alto por sí solo no dice si el servicio anda bien — hay que mirarlo junto con la tasa de error y la latencia, porque un sistema puede sostener un throughput alto simplemente **descartando** peticiones en vez de atenderlas.

### Latencia

Es el tiempo que transcurre entre que se envía una petición y se recibe la respuesta completa. A diferencia del throughput (una medida agregada de todo el test), la latencia es una medida **por petición individual**, así que en la práctica se resume con estadísticas:

- **Promedio (mean):** útil como primer vistazo, pero engañoso — unas pocas peticiones muy lentas pueden pasar desapercibidas si la mayoría fue rápida.
- **Percentiles (p50, p95, p99):** el percentil 95, por ejemplo, es el tiempo por debajo del cual respondió el 95% de las peticiones. Son mucho más representativos de la experiencia real, porque muestran qué le pasa a la "cola" de usuarios con peor suerte, no solo al promedio.

`ab` reporta ambas cosas: el promedio (`Time per request`) y una tabla de percentiles (`Percentage of the requests served within a certain time`). En la práctica, cuando el alumno corre `ab -n 500 -c 20`, conviene que mire las dos: un promedio bajo con un p99 disparado es señal de que algo (una conexión lenta a la base, un lock) está afectando a un subconjunto de peticiones.

> **Dato para la clase:** en la salida de `ab`, "Time per request" aparece **dos veces**, con números distintos. El primero es el tiempo que percibe un cliente individual esperando su respuesta (equivale a `tiempo_total / (n / concurrencia)`). El segundo, "(mean, across all concurrent requests)", divide por el total de peticiones sin ajustar por concurrencia (`tiempo_total / n`) — por eso da un número menor, y está directamente relacionado con el throughput (es, aproximadamente, `1000 / throughput`).

### Concurrencia

Es la cantidad de peticiones que están **en curso al mismo tiempo**, no la cantidad total enviada. Es la variable que el alumno controla directamente con el flag `-c` de `ab`: `-n 500 -c 20` significa "mandá 500 peticiones en total, pero nunca más de 20 al mismo tiempo".

Concurrencia y throughput no son lo mismo, aunque se relacionan. Una forma simple de verlo: si un servidor atiende una petición por vez (concurrencia 1) y cada una tarda 100ms, el throughput máximo posible es 10 req/s, sin importar cuántas peticiones se acumulen esperando. Subir la concurrencia sin que el servidor pueda procesar más en paralelo no aumenta el throughput — solo hace que las peticiones esperen más tiempo en cola, es decir, sube la latencia.

> **Para profundizar (opcional):** esta relación tiene un nombre formal en teoría de colas, la **Ley de Little**: `L = λ × W`, donde `L` es la concurrencia promedio (peticiones en el sistema), `λ` es el throughput y `W` es la latencia promedio. Si el throughput real de un servidor está tapado (no puede crecer más), subir la concurrencia (`-c`) solo puede compensarse con una `W` (latencia) más alta — es matemáticamente inevitable. Es una buena forma de anticipar, antes de correr el Paso 4, por qué forzar la concurrencia va a romper algo tarde o temprano.

### Tasa de error

Es la proporción de peticiones que **no** se completaron con éxito: timeouts, conexiones rechazadas, o respuestas con código de error. `ab` las reporta en `Failed requests`.

Es la señal más clara de que un sistema llegó a su límite: mientras el throughput puede parecer estable (o incluso alto) bajo carga creciente, la tasa de error es la que revela que, en realidad, cada vez se están descartando más peticiones para sostener ese número. Un throughput "bueno" con tasa de error creciente no es un sistema funcionando bien — es un sistema fallando de forma silenciosa.

---

## 2. La herramienta: Apache Bench (`ab`)

`ab` es una utilidad de línea de comandos que viene con el proyecto Apache HTTP Server (paquete `apache2-utils` en Debian/Ubuntu). A pesar del nombre, no depende de que el servidor de destino sea Apache — sirve para generar carga HTTP contra cualquier servidor web, y es una de las herramientas de stress testing más simples y más viejas que existen (por eso es un buen punto de partida didáctico, antes de herramientas más modernas como `wrk`, `k6` o `locust`).

**Cómo funciona:** `ab` abre hasta `-c` conexiones simultáneas y va disparando peticiones hasta completar un total de `-n`, midiendo el tiempo de cada una y contando éxitos/fallos.

**Flags usados en esta práctica:**

| Flag | Qué hace |
|---|---|
| `-n <número>` | Cantidad total de peticiones a enviar |
| `-c <número>` | Concurrencia: cuántas peticiones simultáneas mantener en vuelo |
| `-p <archivo>` | Body a enviar en una petición `POST` (leído de un archivo) |
| `-T <content-type>` | Header `Content-Type` a usar junto con `-p` |
| `-s <segundos>` | Timeout por petición |

**Cómo leer la salida (de arriba hacia abajo, tal como la ve el alumno):**

1. **`Complete requests` / `Failed requests`** — cuántas terminaron, cuántas fallaron. Es lo primero a mirar: si `Failed requests` es alto, el resto de los números hay que leerlos con cautela.
2. **`Requests per second`** — el throughput.
3. **`Time per request`** (las dos líneas explicadas arriba) — la latencia.
4. **`Connection Times`** (tabla con `min/mean/[+/-sd]/median/max`) — desglosa la latencia en las etapas de una conexión HTTP: `Connect` (armar la conexión TCP), `Processing` (el servidor generando la respuesta), `Waiting` (esperando el primer byte de respuesta), `Total`.
5. **`Percentage of the requests served within a certain time`** — la tabla de percentiles.

---

## 3. Procesos e hilos: la base para entender lo que viene

Antes de explicar por qué Werkzeug se traba y por qué Gunicorn no, conviene dejar clara la diferencia entre dos formas de ejecutar código en paralelo que el sistema operativo ofrece. Es la misma distinción que después reaparece, en la práctica de ataques, cuando se comparan procesos con `ps aux`.

### Proceso

Un **proceso** es un programa en ejecución con su propio espacio de memoria, aislado del de cualquier otro proceso. El sistema operativo le asigna recursos (memoria, descriptores de archivo, etc.) y lo va turnando en la CPU mediante el *scheduler*. Dos procesos no pueden leer la memoria uno del otro directamente — si necesitan comunicarse, tienen que hacerlo por mecanismos explícitos del sistema operativo (sockets, pipes, memoria compartida). Ese aislamiento tiene un costo: crear un proceso nuevo y cambiar de uno a otro (*context switch*) es relativamente caro.

### Hilo (thread)

Un **hilo** es una unidad de ejecución que corre **dentro** de un proceso, compartiendo su mismo espacio de memoria con los demás hilos de ese proceso. Son mucho más livianos de crear y de intercambiar que procesos completos, pero esa liviandad tiene la contracara de que, al compartir memoria, dos hilos pueden pisarse si acceden a los mismos datos al mismo tiempo sin coordinarse (*condiciones de carrera*) — por eso hacen falta mecanismos de sincronización (locks) cuando varios hilos tocan el mismo dato.

En criollo: **multiproceso = aislamiento total, más pesado. Multihilo = comparten memoria, más liviano, pero hay que cuidar la sincronización.**

### El intérprete de Python y el GIL

CPython (el intérprete estándar de Python, el que se usa en esta práctica) tiene una particularidad importante: el **GIL** (*Global Interpreter Lock*), un lock global que permite que **un solo hilo ejecute bytecode Python a la vez**, incluso en una máquina con varios núcleos. Esto tiene una consecuencia directa y muchas veces contraintuitiva: **agregar hilos en Python no logra paralelismo real para trabajo de CPU** (cálculos), aunque sí puede ayudar en trabajo de **I/O** (esperar una respuesta de red o de disco), porque el GIL se libera mientras un hilo está bloqueado esperando esa I/O.

**Por qué esto importa acá:** nuestra app pasa la mayor parte del tiempo de cada petición esperando la respuesta de MySQL — es decir, es un caso de I/O, no de cálculo puro. Aun así, Werkzeug en su modo por defecto no usa ni siquiera esa ventaja: es single-threaded, un solo hilo, una petición a la vez. Si se activara `threaded=True`, ganaría algo (varias peticiones podrían superponerse mientras esperan a MySQL), pero seguiría atada al mismo proceso y al mismo GIL. Gunicorn, en cambio, resuelve esto por otro camino — usando **procesos**, no hilos — como se ve en la sección 5.

---

## 4. Por qué el servidor de desarrollo de Flask se degrada bajo concurrencia

### WSGI, en una línea

Flask (y casi todo el ecosistema web de Python) sigue el estándar **WSGI** (Web Server Gateway Interface): una interfaz común entre un servidor HTTP y una aplicación Python, que permite que la misma app corra sin cambios detrás de servidores distintos. Es exactamente lo que se demuestra en el Paso 5 de esta práctica: el mismo `app.py`, sin tocar una línea, corre primero con el servidor de desarrollo y después con Gunicorn.

### El servidor de desarrollo (Werkzeug)

Cuando el código llama a `app.run(...)`, Flask levanta el servidor HTTP de **Werkzeug**, pensado exclusivamente para desarrollo local: recargar código automáticamente, mostrar tracebacks detallados en el navegador, no requerir configuración. Por defecto (sin pasar `threaded=True` ni `processes=N`) es **single-threaded**: atiende **una sola petición a la vez**, en un único proceso y un único hilo.

Esto no es un descuido — Flask lo documenta explícitamente ("do not use it in a production deployment"). El problema es que, en esta práctica, es fácil no darse cuenta hasta que se lo somete a concurrencia real: con tráfico bajo (`-c 20` del Paso 2), la diferencia con un servidor de producción casi no se nota, porque las peticiones son rápidas y el servidor las procesa en secuencia sin que se note la espera. El Paso 4 sube la concurrencia justamente para que esa limitación se vuelva visible.

### Qué pasa exactamente bajo carga

Cada petición que llega mientras el servidor está ocupado con otra **no se procesa en paralelo**: queda esperando en la cola de conexiones del sistema operativo (el *backlog* del socket). Si esa cola también se llena, el sistema operativo empieza a rechazar directamente nuevas conexiones. El resultado observable es exactamente lo que documenta el Paso 4: la latencia sube (las peticiones esperan cada vez más) y, más allá de cierto punto, aparecen errores (timeouts o conexiones rechazadas) — es decir, sube la tasa de error.

---

## 5. Gunicorn

**Gunicorn** ("Green Unicorn") es un servidor WSGI HTTP pensado para producción, inspirado en el servidor Unicorn de Ruby. La diferencia central con el servidor de desarrollo de Flask es el **modelo de workers**: un proceso *master* que no atiende peticiones él mismo, sino que administra varios procesos *worker* independientes (`-w 4` en la práctica levanta 4), cada uno con su propia copia de la aplicación cargada en memoria.

**Por qué esto soluciona el problema de concurrencia:** retomando la sección 3 — Gunicorn logra paralelismo usando **procesos**, no hilos. Cada worker es un proceso del sistema operativo completamente separado, con su propio intérprete Python y, por lo tanto, su propio GIL. El GIL de un worker no tiene nada que ver con el GIL de otro: por eso varios workers sí pueden atender peticiones **verdaderamente en paralelo**, cada uno en su propio núcleo de CPU si hace falta, sin ninguna de las limitaciones que tendría intentar lo mismo con hilos dentro de un único proceso Python. Con 4 workers, hasta 4 peticiones pueden estar siendo procesadas al mismo tiempo en vez de una sola — que es exactamente lo que se mide al repetir el mismo `ab` del Paso 4 contra el puerto de Gunicorn y comparar `Requests per second` y `Failed requests`.

El costo de este enfoque es memoria: cada worker carga su propia copia completa de la aplicación (y de todo lo que haya importado), a diferencia de los hilos, que comparten esa memoria. Es el trade-off clásico de la sección 3: más aislamiento y paralelismo real, a cambio de más uso de recursos.

**Flags usados en la práctica:**

| Flag | Qué hace |
|---|---|
| `-w <número>` | Cantidad de procesos worker a levantar |
| `-b <host:puerto>` | Dirección donde escuchar |

**Un criterio orientativo (no absoluto):** una regla de referencia habitual para aplicaciones con workers síncronos (el modo por defecto de Gunicorn, el que se usa en esta práctica) es `(2 × núcleos de CPU) + 1`. No hace falta que el alumno la aplique en la práctica — alcanza con que entienda que el número de workers es un recurso finito y configurable, no algo que "Gunicorn resuelve solo".

**Lo que Gunicorn no cambia:** el código de la aplicación sigue siendo el mismo, con las mismas consultas a MySQL. Si el cuello de botella real estuviera en la base de datos (por ejemplo, un límite bajo de conexiones concurrentes en MySQL), agregar workers de Gunicorn ayudaría hasta cierto punto y después trasladaría el problema a la base — un buen disparador para que la clase discuta que "escalar" nunca es una sola pieza, sino la cadena completa.
