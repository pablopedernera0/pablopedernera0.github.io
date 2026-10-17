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

## Slides hechas con Claude

Las presentaciones se publican acá como HTML autónomo con `_herramientas/slides-a-html.py`
(fuentes en `_herramientas/decks/`, ver `_herramientas/README.md`). Jekyll no publica
`_herramientas/`: el script y las fuentes viajan por git pero no quedan en el sitio.

## Editor de cuestionarios (prueba, desde 16/10/2026)

- `editor/index.html`: login con email + contraseña. La contraseña descifra en el navegador
  un token fine-grained guardado cifrado en `editor/usuarios.json` (alta con
  `_herramientas/alta-profe.py`, ver `_herramientas/README.md`). No hay servidor.
- Edita los cuestionarios del repo **privado** `pablopedernera0/contenidos-prueba`
  (`cuestionarios/<id>.json` con clave + `index.json`; campo `tipo`: `practica` | `nota`).
  Cada commit lleva al final "Editado desde el editor web por <email>".
- "Publicar" escribe en `editor/publicados/<id>.json` + `index.json` de este sitio; los de
  `tipo: nota` salen **sin** `correctas` ni `porque`.
- Los estudiantes lo responden en el visor de siempre con `&fuente=editor`:
  `caso-bicirio/v2/?cuestionario=<id>&fuente=editor`. Sin clave = sin autocorrección ni
  vista docente; las respuestas llegan por mail (`envio_mail`).
- El editor commitea directo en GitHub: hacer `git pull` antes de tocar este repo a mano.
- Es una prueba: lo de `caso-bicirio/v2/cuestionarios/` no se migró. Pendientes: `envio_mail`
  del profe logueado, corrección de los "con nota" con la clave privada, alta de colegas,
  presentaciones.
