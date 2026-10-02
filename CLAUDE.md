# pablopedernera0.github.io

Sitio de recursos públicos para estudiantes de Pablo Pedernera (Terciario Urquiza). Una
carpeta por tema con su propio `index.html` autocontenido, no siempre enlazada desde la
portada. También aloja la versión publicada de la guía docente del hilo conductor de redes
y páginas de referencia operativa del docente (ej. `eidas-cheatsheet`), no solo tutoriales
para estudiantes.

**Antes de arrancar, leer también** `~/trabajos/pablo/terciario-urquiza/contexto-docente/CONTEXTO.md`
(repo privado `pablopedernera0/contexto-docente`) — contexto que cruza este repo con
`la-cajonera`, `sistema-eidas`, `sistema-eidas-datos` y `hilo-conductor-redes-ataques`
(cuentas de GitHub, incidente Killercoda, hábito de dos máquinas). La memoria de Claude
Code es por proyecto; ese repo es el complemento manual para lo que es transversal a
varios.

## Estructura de la portada

- `index.html` (raíz): portada neutra con dos entradas, `terciario/` y `notas/`. Reenvía los
  deep links viejos (`/#infraestructura`, `/#desarrollo`, `/#redes`) a `terciario/`.
- `terciario/index.html`: índice de recursos del terciario. Se arma desde
  `js/recursos-data.js`; para publicar un recurso se agrega una entrada ahí. Las carpetas de
  los recursos siguen en la raíz (no se mueven: hay links en el Classroom que apuntan a ellas).
- `notas/`: textos propios, una carpeta por nota, y una entrada a mano en `notas/index.html`.
  Comparten `css/lectura.css` con la portada.
