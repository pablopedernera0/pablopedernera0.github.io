// Renderiza RECURSOS (js/recursos-data.js) dentro de cada
// <div class="resources-list" data-categoria="..."> de index.html.
document.addEventListener('DOMContentLoaded', function () {
    if (typeof RECURSOS === 'undefined') return;

    const contenedores = document.querySelectorAll('.resources-list[data-categoria]');

    contenedores.forEach(function (contenedor) {
        const categoria = contenedor.dataset.categoria;
        const recursos = RECURSOS
            .filter(function (r) { return r.categoria === categoria; })
            .sort(function (a, b) { return b.fecha.localeCompare(a.fecha); });

        if (recursos.length === 0) {
            contenedor.innerHTML =
                '<div class="resources-placeholder">' +
                '<div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;">📭</div>' +
                '<p>Todavía no hay recursos publicados para esta materia.</p>' +
                '</div>';
            return;
        }

        contenedor.innerHTML = recursos.map(function (r) {
            return '' +
                '<a class="resource-item" href="' + r.carpeta + '/index.html">' +
                    '<span class="resource-item-icon">' + r.icono + '</span>' +
                    '<span class="resource-item-body">' +
                        '<span class="resource-item-title">' + r.titulo + '</span>' +
                        '<span class="resource-item-desc">' + r.descripcion + '</span>' +
                    '</span>' +
                '</a>';
        }).join('');
    });
});
