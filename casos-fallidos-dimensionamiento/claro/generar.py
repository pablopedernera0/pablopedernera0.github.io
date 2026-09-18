#!/usr/bin/env python3
"""Genera la versión clara de casos-fallidos-dimensionamiento en esta carpeta (claro/).

Las páginas de claro/ son copias de las oscuras: las oscuras son la fuente de verdad.
Cada vez que se edite una página oscura, volver a correr:  python3 claro/generar.py
También agrega a las páginas oscuras el botón "Versión clara" (si falta).
"""
import glob, os, re

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)

PALETA_CLARA = """/* Versión clara: reutiliza estilo.css y solo redefine la paleta. Generado por generar.py */
@import url("../estilo.css");
:root{
  --bg:#f6f7f9;
  --panel:#ffffff;
  --panel-border:#d3dae3;
  --text:#1b2530;
  --muted:#556477;
  --accent:#a86a00;
  --accent-soft:rgba(168,106,0,.12);
  --bad:#c0392b;
  --bad-soft:rgba(192,57,43,.10);
  --ok:#0b7f70;
  --ok-soft:rgba(11,127,112,.10);
  --info:#1f5fae;
  --info-soft:rgba(31,95,174,.10);
  --bg-deep:#eef1f5;
  --node:#ffffff;
  --off:#b4bfcc;
  --topbar-bg:rgba(246,247,249,.94);
  --on-accent:#ffffff;
  --glow:rgba(168,106,0,.55);
}
"""

def enlace_tema(href, texto):
    return '<a class="tema" href="%s">%s</a>' % (href, texto)

def agregar_boton(html, boton):
    html = re.sub(r'\s*<a class="tema"[^>]*>[^<]*</a>', '', html)   # idempotente
    return html.replace('</header>', '  ' + boton + '\n</header>', 1)

def main():
    with open(os.path.join(AQUI, 'estilo.css'), 'w', encoding='utf-8') as f:
        f.write(PALETA_CLARA)
    n = 0
    for ruta in sorted(glob.glob(os.path.join(RAIZ, '*.html'))):
        nombre = os.path.basename(ruta)
        with open(ruta, encoding='utf-8') as f:
            oscuro = f.read()
        # 1) la página oscura apunta a su versión clara
        oscuro = agregar_boton(oscuro, enlace_tema('claro/' + nombre, '☀ Versión clara'))
        with open(ruta, 'w', encoding='utf-8') as f:
            f.write(oscuro)
        # 2) la copia clara: un nivel más de profundidad y botón de vuelta
        claro = oscuro.replace('href="../', 'href="../../')
        claro = agregar_boton(claro, enlace_tema('../' + nombre, '🌙 Versión oscura'))
        claro = claro.replace('</title>', ' (versión clara)</title>', 1)
        with open(os.path.join(AQUI, nombre), 'w', encoding='utf-8') as f:
            f.write(claro)
        n += 1
    print('generadas %d páginas claras en %s' % (n, AQUI))

if __name__ == '__main__':
    main()
