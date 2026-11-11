// Arma terciario/index.html a partir de js/recursos-data.js (MATERIAS, TIPOS, RECURSOS).
// <body data-base="../"> indica dónde están las carpetas respecto de la página.
//
// Filtros: texto libre + una materia + un tipo. La materia elegida queda en el hash
// (terciario/#redes), así siguen andando los links viejos del Classroom.
document.addEventListener('DOMContentLoaded', function () {
    if (typeof RECURSOS === 'undefined') return;

    const base = document.body.dataset.base || '';
    const hoy = fechaLocal(new Date());
    const corteNuevo = fechaLocal(new Date(Date.now() - DIAS_NUEVO * 86400000));

    const materiaPorId = {};
    MATERIAS.forEach(function (m) { materiaPorId[m.id] = m; });
    const tipoPorId = {};
    TIPOS.forEach(function (t) { tipoPorId[t.id] = t; });

    const estado = { texto: '', materia: '', tipo: '' };

    // Se calcula una sola vez qué va en cada bloque y el texto donde buscar.
    const recursos = RECURSOS.map(function (r) {
        const materias = r.materias || [];
        const tipo = tipoPorId[r.tipo];
        return Object.assign({}, r, {
            materias: materias,
            destacado: !!(r.destacadoHasta && r.destacadoHasta >= hoy),
            enArchivo: r.archivado !== undefined ? r.archivado : r.fecha < ARCHIVO_ANTES_DE,
            nuevo: r.fecha >= corteNuevo && r.fecha <= hoy,
            buscable: normalizar([
                r.titulo, r.descripcion, r.carpeta, tipo ? tipo.nombre : ''
            ].concat(materias.map(function (id) {
                const m = materiaPorId[id];
                return m ? m.nombre + ' ' + m.sigla : id;
            })).join(' '))
        });
    }).sort(function (a, b) { return b.fecha.localeCompare(a.fecha); });

    // ---- Filtros ----
    const $materias = document.getElementById('filtro-materias');
    const $tipos = document.getElementById('filtro-tipos');
    const $buscar = document.getElementById('buscar');

    function chip(grupo, valor, texto, cantidad) {
        return '<button type="button" class="chip" data-grupo="' + grupo + '" data-valor="' + valor +
            '" aria-pressed="false">' + texto +
            (cantidad !== undefined ? ' <span class="chip-n">' + cantidad + '</span>' : '') + '</button>';
    }

    $materias.innerHTML = chip('materia', '', 'Todas las materias') + MATERIAS.map(function (m) {
        const n = recursos.filter(function (r) { return r.materias.indexOf(m.id) !== -1; }).length;
        return chip('materia', m.id, m.corto, n);
    }).join('');

    $tipos.innerHTML = chip('tipo', '', 'Todos los tipos') + TIPOS.filter(function (t) {
        return recursos.some(function (r) { return r.tipo === t.id; });
    }).map(function (t) {
        return chip('tipo', t.id, t.icono + ' ' + t.nombre);
    }).join('');

    document.querySelector('.toolbar').addEventListener('click', function (e) {
        const b = e.target.closest('.chip');
        if (!b) return;
        estado[b.dataset.grupo] = b.dataset.valor;
        if (b.dataset.grupo === 'materia') actualizarHash();
        render();
    });

    $buscar.addEventListener('input', function () {
        estado.texto = normalizar($buscar.value.trim());
        render();
    });

    document.getElementById('limpiar').addEventListener('click', function () {
        estado.texto = ''; estado.materia = ''; estado.tipo = '';
        $buscar.value = '';
        actualizarHash();
        render();
    });

    function leerHash() {
        const h = decodeURIComponent(window.location.hash.slice(1));
        estado.materia = materiaPorId[h] ? h : '';
    }

    function actualizarHash() {
        const url = window.location.pathname + window.location.search +
            (estado.materia ? '#' + estado.materia : '');
        history.replaceState(null, '', url);
    }

    window.addEventListener('hashchange', function () { leerHash(); render(); });

    // ---- Render ----
    function pasa(r) {
        if (estado.materia && r.materias.indexOf(estado.materia) === -1) return false;
        if (estado.tipo && r.tipo !== estado.tipo) return false;
        if (estado.texto) {
            return estado.texto.split(/\s+/).every(function (p) { return r.buscable.indexOf(p) !== -1; });
        }
        return true;
    }

    function tarjeta(r) {
        const tipo = tipoPorId[r.tipo];
        const icono = r.icono && r.icono !== '▸' ? r.icono : (tipo ? tipo.icono : '📄');
        const marcas = [];
        if (r.nuevo) marcas.push('<span class="marca marca-nuevo">Nuevo</span>');
        if (tipo) marcas.push('<span class="marca marca-tipo">' + tipo.nombre + '</span>');
        r.materias.forEach(function (id) {
            const m = materiaPorId[id];
            if (m) marcas.push('<span class="marca marca-materia" title="' + m.nombre + ' (' + m.sigla + ')">' + m.corto + '</span>');
        });
        if (r.conClave) marcas.push('<span class="marca marca-clave">🔒 Con clave</span>');

        return '' +
            '<a class="recurso' + (r.destacado ? ' recurso-destacado' : '') + '" href="' +
                base + r.carpeta + '/' + (r.archivo || 'index.html') + '">' +
                '<span class="recurso-icono" aria-hidden="true">' + icono + '</span>' +
                '<span class="recurso-cuerpo">' +
                    '<span class="recurso-titulo">' + r.titulo + '</span>' +
                    '<span class="recurso-marcas">' + marcas.join('') + '</span>' +
                    '<span class="recurso-desc">' + r.descripcion + '</span>' +
                    '<span class="recurso-fecha">' + fechaLegible(r.fecha) + '</span>' +
                '</span>' +
            '</a>';
    }

    function render() {
        document.querySelectorAll('.chip').forEach(function (b) {
            b.setAttribute('aria-pressed', String(estado[b.dataset.grupo] === b.dataset.valor));
        });

        const visibles = recursos.filter(pasa);
        const destacados = visibles.filter(function (r) { return r.destacado; });
        const actuales = visibles.filter(function (r) { return !r.destacado && !r.enArchivo; });
        const archivo = visibles.filter(function (r) { return !r.destacado && r.enArchivo; });

        document.getElementById('destacados').hidden = destacados.length === 0;
        document.getElementById('lista-destacados').innerHTML = destacados.map(tarjeta).join('');

        document.getElementById('lista').innerHTML = actuales.map(tarjeta).join('');
        document.getElementById('titulo-lista').textContent = estado.materia
            ? materiaPorId[estado.materia].nombre + ' (' + materiaPorId[estado.materia].sigla + ')'
            : 'Recursos';
        document.getElementById('contador').textContent =
            actuales.length + (actuales.length === 1 ? ' recurso' : ' recursos');

        const $archivo = document.getElementById('archivo');
        $archivo.hidden = archivo.length === 0;
        document.getElementById('lista-archivo').innerHTML = archivo.map(tarjeta).join('');
        document.getElementById('contador-archivo').textContent = archivo.length;
        // Si se está buscando, abrir el archivo para que no queden resultados escondidos.
        if (estado.texto && archivo.length) $archivo.open = true;

        document.getElementById('vacio').hidden = visibles.length !== 0;
    }

    // ---- Utilidades ----
    function normalizar(s) {
        return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    function fechaLocal(d) {
        const p = function (n) { return String(n).padStart(2, '0'); };
        return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    }

    function fechaLegible(f) {
        const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        const partes = f.split('-');
        return 'Publicado: ' + Number(partes[2]) + ' ' + meses[Number(partes[1]) - 1] + ' ' + partes[0];
    }

    document.getElementById('anio').textContent = new Date().getFullYear();
    leerHash();
    render();
});
