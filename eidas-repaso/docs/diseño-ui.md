> Ejemplo resuelto para el caso ficticio **"Cosmeticos SA"** — ver el contexto completo (RF/RNF/HU
> y de dónde salen los patrones) en [`molde-reciclable.html`](../molde-reciclable.html).
> Estructura idéntica a `docs/diseño-ui.md` de `eidas-template`: para tu propio proyecto,
> reemplazá cada bloque por tus pantallas reales — no copies este ejemplo con otro nombre.

# Diseño UI

_Presentar al menos un wireframe por pantalla o módulo relevante._
_Los wireframes en imagen o PDF van en `diagramas/wireframes/`; acá se documenta la justificación de cada uno._

---

## Pantalla / Módulo 1 — Productos

**Wireframe:** [`../img/molde-productos.png`](../img/molde-productos.png) (listado) · [`../img/molde-productos-modal.png`](../img/molde-productos-modal.png) (alta)

**Patrones de diseño utilizados:** Tabla con paginación, Modal con formulario corto.

**Justificación:** El encargado de depósito necesita revisar el catálogo completo y agregar
productos nuevos sin perder de vista lo que ya cargó (RNF3). Una tabla con búsqueda y paginación
permite escanear el volumen alto de productos que maneja Cosmeticos SA (RNF2) — una grilla de
Cards obligaría a scrollear mucho más para la misma cantidad de información y no aporta nada
extra para este usuario, que necesita comparar códigos y cantidades, no imágenes de producto. El
alta se resuelve en un modal en vez de navegar a una pantalla nueva: al cerrarlo, el encargado
sigue exactamente en el mismo listado, con el mismo filtro y la misma página que tenía abiertos.

**Formulario (si aplica):**
- Cantidad de campos: 6 (fecha, proveedor, nombre, código de barras, descripción, cantidad).
- Flujo: todo en una sola pantalla (el modal) — no amerita dividirlo en pasos.
- Validaciones relevantes: código de barras único: nombre y cantidad obligatorios.

---

## Pantalla / Módulo 2 — Clientes

**Wireframe:** [`../img/molde-ventas.png`](../img/molde-ventas.png) _(mismo layout de listado, aplicado a la entidad Cliente)_

**Patrones de diseño utilizados:** Tabla con paginación, Modal con formulario corto.

**Justificación:** El administrativo de ventas necesita encontrar un cliente puntual sin
recorrer toda la base (HU — Listado de clientes). La tabla permite buscar por cualquier columna
y ordenar, lo que resuelve el caso de uso real ("¿este cliente ya está cargado?") mejor que un
listado en Cards, donde comparar y buscar entre decenas de tarjetas es más lento que leer filas
de una tabla. El patrón de alta se mantiene igual al de Productos a propósito — es el mismo
molde (RNF1): el administrativo ya sabe cómo se carga un registro nuevo antes de tocar esta
pantalla por primera vez.

**Formulario (si aplica):**
- Cantidad de campos: 4 (nombre, teléfono, dirección, email).
- Flujo: todo en una sola pantalla.
- Validaciones relevantes: email con formato válido; teléfono obligatorio (es el dato que usa
  ventas para confirmar pedidos).

---

## Pantalla / Módulo 3 — Ventas, Proveedores y Usuarios/Roles

_Los tres módulos restantes de RF3 y RF4 repiten exactamente la misma combinación de patrones
que Productos y Clientes — shell fijo, tabla con paginación, modal de alta — así que no hace
falta repetir la justificación completa. Esto es la prueba en la práctica de la sección "El 80%"
del apunte: una vez justificado el patrón, cada módulo nuevo solo aporta lo que cambia._

| Módulo | Patrones | Qué cambia respecto a Productos/Clientes |
|---|---|---|
| Ventas | Tabla + Modal | El modal de alta suma un selector de cliente y una lista de ítems con cantidad (stepper), no solo campos de texto. |
| Proveedores | Tabla + Modal | Igual que Clientes, con campos propios (razón social, CUIT, rubro). |
| Usuarios / Roles | Tabla + Modal | El modal de alta reemplaza los `<input>` de texto por checkboxes de permisos por módulo — sigue siendo "formulario corto en modal", pero con controles distintos porque el dato es otro (permisos, no texto libre). |

**Wireframe:** se omite en este ejemplo de apoyo para no alargarlo — el sidebar ya se ve
completo en las capturas de Productos y Clientes (arriba). En una entrega real, **esto no es
válido**: la rúbrica pide un wireframe por pantalla o módulo, sin excepción. Lo que sí se puede
acortar cuando el patrón ya quedó justificado en detalle en un módulo anterior es el texto de
justificación — no la imagen.

---

## Consideraciones de accesibilidad

El personal de depósito de Cosmeticos SA a veces carga productos con las manos ocupadas o con
guantes, parado frente a la estantería — no sentado cómodamente frente a un monitor. Por eso:

- Los botones del modal (**Guardar** / **Cancelar**) tienen un tap target mínimo de 44×44px y
  alto contraste, para poder tocarlos sin apuntar con precisión.
- Cada campo del formulario tiene una etiqueta (`<label>`) asociada de forma explícita, no solo
  un placeholder — así un lector de pantalla identifica el campo aunque el placeholder
  desaparezca al empezar a escribir.
