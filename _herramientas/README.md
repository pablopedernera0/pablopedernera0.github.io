# _herramientas

Lo que hay acá no se publica: GitHub Pages arma el sitio con Jekyll, que deja afuera las
carpetas que empiezan con `_`. Viaja por git entre máquinas, que es para lo que está.

## slides-a-html.py

Convierte una presentación hecha con Claude (tipo Slides) en un HTML autónomo con visor
(flechas, clic, F para pantalla completa, `#N` en la URL para abrir en la slide N).

```bash
python3 _herramientas/slides-a-html.py _herramientas/decks/<nombre> <carpeta>/slides.html
```

`decks/<nombre>/project/` es la copia de la fuente de cada presentación (`deck.json` y
`slides/<id>.html`, tal cual la guarda Claude). La presentación original sigue en Claude;
si se edita ahí, hay que bajar los archivos de nuevo a esta carpeta (la sesión de Claude
los puede leer con la acción `read` del artifact) y volver a correr el script.

| Fuente | Publicada en | Presentación en Claude |
|---|---|---|
| `decks/requisitos-ultimo-momento` | `requisitos-ultimo-momento/slides.html` | https://claude.ai/artifact/57GXe1Y2ycUy9FiTyKy17H |
| `decks/caso-costanera` | `caso-costanera-af/slides.html` | https://claude.ai/artifact/23ctvDgLsiGxPpT7dPCbo9 |

Los íconos y formas propias de las slides (`<x-icon>`, `<x-shape>`, `<x-connector>`) se
traducen a SVG. Un ícono que no esté en `ICONOS` corta la conversión con un error que dice
cuál falta: se agrega ahí.

## alta-profe.py — acceso al editor de cuestionarios (prueba)

```bash
python3 _herramientas/alta-profe.py <email>          # alta o nueva contraseña
python3 _herramientas/alta-profe.py --baja <email>   # saca la entrada
```

Pide por consola (sin eco) un token **fine-grained** de GitHub para ese profe (Contents:
Read and write, solo sobre `contenidos-prueba` y `pablopedernera0.github.io`, con
vencimiento), genera una contraseña y escribe en `editor/usuarios.json` el token **cifrado
con esa contraseña** (PBKDF2-SHA256 600k sobre `email|contraseña` → AES-256-GCM). Correrlo
en una terminal aparte, nunca pegar el token en un chat. Después commitear y pushear
`editor/usuarios.json`. Para revocar de verdad: borrar el token en GitHub.
