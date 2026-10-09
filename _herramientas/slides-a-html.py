#!/usr/bin/env python3
"""Convierte una presentación hecha con Claude (tipo Slides: project/deck.json +
project/slides/<id>.html) en un HTML autónomo para publicar en este sitio, con un visor
simple: escala a la ventana, flechas / espacio / clic para avanzar, F para pantalla completa
y #N en la URL para abrir en la slide N.

    python3 _herramientas/slides-a-html.py _herramientas/decks/<nombre> <carpeta>/slides.html

Las slides usan tres etiquetas propias que un navegador no conoce y que acá se traducen:
- <x-icon name="...">     → SVG (solo los íconos de ICONOS; otro nombre corta con error)
- <x-shape kind="...">    → <div> (rect, rounded, ellipse) o SVG (flechas)
- <x-connector x1 y1 x2 y2 route head> → SVG absoluto sobre su contenedor (la sección o un
  div con position:relative), en las mismas coordenadas en px
Las notas del orador (<aside>) no se publican.
"""
import itertools
import json
import re
import sys
from html import escape
from pathlib import Path

ICONOS = {
    'Warning': '<path d="M12 3 2 21h20z"/><path d="M12 10v5M12 18v.01"/>',
    'Lock': '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    'Check': '<path d="m4 12 5 5L20 6"/>',
    'Clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    'Users': '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3A6.5 6.5 0 0 1 21.5 20"/>',
    'Database': '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    'Lightbulb': '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
}

CONTADOR = itertools.count(1)

FLECHAS = {  # polígono en una caja de 100 x 50 (o 50 x 100 las verticales)
    'arrow-right': ('0 0 100 50', '0,15 60,15 60,0 100,25 60,50 60,35 0,35'),
    'arrow-left': ('0 0 100 50', '100,15 40,15 40,0 0,25 40,50 40,35 100,35'),
    'arrow-down': ('0 0 50 100', '15,0 15,60 0,60 25,100 50,60 35,60 35,0'),
    'arrow-up': ('0 0 50 100', '15,100 15,40 0,40 25,0 50,40 35,40 35,100'),
}


def estilo(attrs):
    m = re.search(r'style="([^"]*)"', attrs)
    return m.group(1) if m else ''


def prop(st, nombre, defecto=None):
    m = re.search(r'(?:^|;)\s*' + re.escape(nombre) + r'\s*:\s*([^;]+)', st)
    return m.group(1).strip() if m else defecto


def sin_props(st, nombres):
    partes = [p for p in st.split(';') if p.strip() and p.split(':')[0].strip() not in nombres]
    return ';'.join(partes)


def attr(attrs, nombre, defecto=None):
    m = re.search(r'\b' + re.escape(nombre) + r'="([^"]*)"', attrs)
    return m.group(1) if m else defecto


def icono(m):
    attrs = m.group(1)
    nombre = attr(attrs, 'name')
    if nombre not in ICONOS:
        sys.exit(f'Ícono sin traducción: {nombre}. Agregalo a ICONOS en {__file__}.')
    st = estilo(attrs)
    color = prop(st, 'color', 'currentColor')
    resto = sin_props(st, {'color'})
    return (f'<svg viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" '
            f'stroke-linejoin="round" style="flex:none;{resto}" aria-label="{escape(nombre)}">{ICONOS[nombre]}</svg>')


def forma(m):
    attrs = m.group(1)
    tipo = attr(attrs, 'kind', 'rect')
    st = estilo(attrs)
    if tipo in FLECHAS:
        caja, puntos = FLECHAS[tipo]
        relleno = prop(st, 'background', '#000')
        resto = sin_props(st, {'background'})
        return (f'<svg viewBox="{caja}" preserveAspectRatio="none" style="flex:none;{resto}" aria-hidden="true">'
                f'<polygon points="{puntos}" fill="{relleno}"/></svg>')
    radio = {'ellipse': 'border-radius:50%', 'rounded': 'border-radius:16px'}.get(tipo, '')
    if tipo not in ('rect', 'rounded', 'ellipse'):
        sys.exit(f'x-shape sin traducción: {tipo}')
    return f'<div style="flex:none;{st};{radio}"></div>'


def conector(m):
    attrs = m.group(1)
    try:
        x1, y1, x2, y2 = (float(attr(attrs, k)) for k in ('x1', 'y1', 'x2', 'y2'))
    except TypeError:
        sys.exit('x-connector sin coordenadas: solo se traducen los que tienen x1 y1 x2 y2')
    st = estilo(attrs)
    color = prop(st, 'color', '#000')
    ancho = prop(st, 'border-width', '2px').replace('px', '')
    trazo = {'dashed': '12 8', 'dotted': '2 6'}.get(prop(st, 'border-style', ''), '')
    ruta = attr(attrs, 'route', 'straight')
    if ruta == 'vh':
        d = f'M{x1} {y1}V{y2}H{x2}'
    elif ruta == 'hv':
        d = f'M{x1} {y1}H{x2}V{y2}'
    elif ruta == 'elbow':
        xm = (x1 + x2) / 2
        d = f'M{x1} {y1}H{xm}V{y2}H{x2}'
    else:
        d = f'M{x1} {y1}L{x2} {y2}'
    cabeza = attr(attrs, 'head', 'end')
    fin = cabeza in ('end', 'both') or attr(attrs, 'head-end') in ('open', 'filled')
    ini = cabeza == 'both' or attr(attrs, 'head-start') in ('open', 'filled')
    marca = f'flecha{next(CONTADOR)}'
    defs = (f'<defs><marker id="{marca}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" '
            f'orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="{color}"/></marker></defs>') if (fin or ini) else ''
    extra = (f' marker-end="url(#{marca})"' if fin else '') + (f' marker-start="url(#{marca})"' if ini else '')
    guiones = f' stroke-dasharray="{trazo}"' if trazo else ''
    return (f'<svg style="position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none" '
            f'aria-hidden="true">{defs}<path d="{d}" fill="none" stroke="{color}" stroke-width="{ancho}"{guiones}{extra}/></svg>')


def convertir(h):
    h = re.sub(r'<aside>.*?</aside>', '', h, flags=re.S)
    h = re.sub(r'<x-icon([^>]*)>\s*</x-icon>', icono, h)
    h = re.sub(r'<x-shape([^>]*)>\s*</x-shape>', forma, h)
    h = re.sub(r'<x-connector([^>]*)>\s*</x-connector>', conector, h)
    resto = re.search(r'<x-[a-z]+', h)
    if resto:
        sys.exit(f'Etiqueta sin traducción: {resto.group(0)}')
    return h.strip()


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    deck, salida = Path(sys.argv[1]), Path(sys.argv[2])
    d = json.loads((deck / 'project/deck.json').read_text(encoding='utf-8'))
    fuentes = sorted({f['href'] for f in d.get('faces', {}).values() if f.get('href')})
    secciones = [convertir((deck / f'project/slides/{sid}.html').read_text(encoding='utf-8')) for sid in d['order']]
    links = ''.join(f'<link rel="stylesheet" href="{escape(u)}">' for u in fuentes)
    html = PLANTILLA.replace('{titulo}', escape(d['title'])).replace('{fuentes}', links).replace('{slides}', '\n'.join(secciones))
    salida.parent.mkdir(parents=True, exist_ok=True)
    salida.write_text(html, encoding='utf-8')
    print(f'{len(secciones)} slides → {salida}')


PLANTILLA = '''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{titulo}</title>
{fuentes}
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { height: 100%; background: #0b0f14; overflow: hidden; }
#escenario { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; transform-origin: 0 0; }
#escenario > section { position: absolute; inset: 0; width: 1920px; height: 1080px; overflow: hidden; }
#escenario > section:not(.activa) { display: none !important; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 0.35em 0.6em; border-bottom: 1px solid rgba(128, 128, 128, 0.35); vertical-align: top; }
th { font-weight: 700; }
#barra { position: fixed; right: 12px; bottom: 10px; font: 14px system-ui, sans-serif; color: #8b949e; display: flex; gap: 10px; align-items: center; }
#barra button { background: #161b22; color: #c9d1d9; border: 1px solid #30363d; border-radius: 6px; padding: 4px 10px; cursor: pointer; font: inherit; }
</style>
</head>
<body>
<div id="escenario">
{slides}
</div>
<div id="barra"><button id="ant" aria-label="Anterior">←</button><span id="num"></span><button id="sig" aria-label="Siguiente">→</button><button id="full" title="Pantalla completa (F)">Pantalla completa</button></div>
<script>
const slides = [...document.querySelectorAll('#escenario > section')];
let i = Math.max(0, Math.min(slides.length - 1, (parseInt(location.hash.slice(1)) || 1) - 1));
function ajustar() {
  const e = document.getElementById('escenario');
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  e.style.transform = `translate(${(innerWidth - 1920 * s) / 2}px, ${(innerHeight - 1080 * s) / 2}px) scale(${s})`;
}
function ir(n) {
  i = Math.max(0, Math.min(slides.length - 1, n));
  slides.forEach((s, k) => s.classList.toggle('activa', k === i));
  document.getElementById('num').textContent = `${i + 1} / ${slides.length}`;
  history.replaceState(null, '', '#' + (i + 1));
}
function pantalla() { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}); }
addEventListener('keydown', (e) => {
  if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); ir(i + 1); }
  else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); ir(i - 1); }
  else if (e.key === 'Home') ir(0);
  else if (e.key === 'End') ir(slides.length - 1);
  else if (e.key === 'f' || e.key === 'F') pantalla();
});
document.getElementById('ant').onclick = () => ir(i - 1);
document.getElementById('sig').onclick = () => ir(i + 1);
document.getElementById('full').onclick = pantalla;
document.getElementById('escenario').addEventListener('click', () => ir(i + 1));
addEventListener('resize', ajustar);
ajustar(); ir(i);
</script>
</body>
</html>
'''

if __name__ == '__main__':
    main()
