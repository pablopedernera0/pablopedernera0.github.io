// Índice de recursos del terciario (terciario/index.html, lo arma js/render-recursos.js).
// Última actualización: 2026-11-11 ART.
//
// Para publicar un recurso: agregar un objeto a RECURSOS. No hace falta tocar el HTML.
// Para sumar o renombrar una materia o un tipo: editar MATERIAS o TIPOS; los filtros
// y los links con #id (ej. terciario/#redes) salen de ahí.

// Materias: el id es el que va en el link (terciario/#infraestructura).
// "corto" es el nombre que va en los botones de filtro y en la marca de cada tarjeta.
const MATERIAS = [
    { id: "infraestructura", nombre: "Infraestructura de Redes",   corto: "Infraestructura", sigla: "ITI" },
    { id: "desarrollo",      nombre: "Desarrollo de Sistemas Web", corto: "Desarrollo Web",  sigla: "AF" },
    { id: "redes",           nombre: "Redes y Comunicaciones",     corto: "Redes",           sigla: "AF" }
];

// Tipos de recurso: el icono se usa si la entrada no trae uno propio.
const TIPOS = [
    { id: "aviso",       nombre: "Aviso",       icono: "📣" },
    { id: "clase",       nombre: "Clase",       icono: "🎓" },
    { id: "guia",        nombre: "Guía",        icono: "📘" },
    { id: "practica",    nombre: "Práctica",    icono: "🛠️" },
    { id: "caso",        nombre: "Caso",        icono: "🧩" },
    { id: "herramienta", nombre: "Herramienta", icono: "🧮" }
];

// Lo publicado antes de esta fecha va al "Archivo" plegado, salvo que la entrada diga
// archivado: false. Al empezar un ciclo nuevo, mover esta fecha.
const ARCHIVO_ANTES_DE = "2026-03-01";

// Cuántos días se muestra la marca "Nuevo" después de la fecha de publicación.
const DIAS_NUEVO = 14;

// Campos de cada entrada:
//   titulo, carpeta, icono, descripcion, fecha (AAAA-MM-DD)  obligatorios
//   materias: ["infraestructura", ...]  una o varias, ids de MATERIAS
//   tipo: id de TIPOS
//   archivo         página dentro de la carpeta, si no es index.html
//   destacadoHasta  "AAAA-MM-DD": hasta ese día sale arriba, en "Destacado"
//   conClave: true  muestra la marca 🔒 (la página pide clave)
//   archivado       true/false: fuerza ir o no ir al Archivo, sin mirar la fecha
const RECURSOS = [
    {
        titulo: "Cloud Foundations en verano (inscripción)",
        materias: ["infraestructura", "desarrollo", "redes"],
        tipo: "aviso",
        destacadoHasta: "2026-11-30",
        carpeta: "cloud-foundations",
        icono: "☁️",
        descripcion: "Curso oficial AWS Academy Cloud Foundations, gratis, en línea y a tu ritmo, del 3/12/2026 al 26/2/2027, para estudiantes y egresados de cualquier carrera (18+). Da la insignia AWS Academy Graduate y prepara para Cloud Practitioner. Inscripción hasta el 30/11.",
        fecha: "2026-11-10"
    },
    {
        titulo: "Casos y cuestionarios",
        materias: ["redes", "desarrollo"],
        tipo: "caso",
        carpeta: "casos",
        icono: "📋",
        descripcion: "Índice de los casos de estudio con cuestionario en línea: Caso Costanera Deportes (la medianoche del Hot Sale) y Caso SIGA, más los simulacros de Diseño de Sistemas Web. Al finalizar, las respuestas se envían por mail.",
        fecha: "2026-10-09"
    },
    {
        titulo: "AWS Academy en el Terciario Urquiza",
        materias: ["infraestructura"],
        tipo: "guia",
        conClave: true,
        carpeta: "aws-academy",
        icono: "🔒",
        descripcion: "Instructivos para docentes y estudiantes, con clave: cómo funciona AWS Academy, qué hace falta para dar cada curso, cómo se arma un Learner Lab, la inscripción, qué correo usar en cada cuenta y las insignias en Credly.",
        fecha: "2026-10-09"
    },
    {
        titulo: "Formación AWS: de Floci a AWS real",
        materias: ["infraestructura"],
        tipo: "guia",
        carpeta: "formacion-aws",
        icono: "🧭",
        descripcion: "El recorrido completo de AWS en orden: cada tema con su práctica sin AWS (Floci / Killercoda) y su práctica en AWS real (AWS Academy Learner Lab).",
        fecha: "2026-10-05"
    },
    {
        titulo: "Caso SIGA: el lunes de las inscripciones",
        materias: ["redes"],
        tipo: "caso",
        carpeta: "caso-siga-af",
        icono: "🧾",
        descripcion: "Caso de estudio presencial, en papel (60 min): el sistema de inscripciones de un instituto colapsa a las 8:00. Con las métricas del pizarrón, los grupos diagnostican el cuello de botella, hacen la cuenta de ancho de banda, revisan dos problemas de seguridad y escriben una propuesta con su RNF de capacidad. Planilla para imprimir: caso-siga-af/planilla.pdf.",
        fecha: "2026-10-02"
    },
    {
        titulo: "Monitoreo en tiempo real: Prometheus y Grafana",
        materias: ["infraestructura"],
        tipo: "clase",
        carpeta: "hilo-conductor-redes/documentacion",
        archivo: "crud-monitoreo-prometheus-grafana-clase.html",
        icono: "▸",
        descripcion: "Clase de conceptos de la Etapa 6 del hilo conductor de redes: métricas vs. logs, series temporales, scrape y exporters, la arquitectura de la práctica en un diagrama, el viaje de un dato hasta el panel, PromQL (up, etiquetas, rate) y Grafana.",
        fecha: "2026-09-24"
    },
    {
        titulo: "Simulador de capacidad: por qué un servidor se cae",
        materias: ["redes"],
        tipo: "practica",
        carpeta: "simulador-capacidad-servidor",
        icono: "🖥️",
        descripcion: "Guía y práctica extra de dimensionamiento: subís carga sobre un servidor simulado hasta encontrar sus dos cuellos de botella (procesos y memoria), los resolvés cada uno con su script, y cerrás con tu propio RNF de capacidad. Acompaña la práctica de Killercoda.",
        fecha: "2026-09-24"
    },
    {
        titulo: "SQL, JOINs e índices",
        materias: ["infraestructura"],
        tipo: "clase",
        carpeta: "mysql-joins-indices",
        icono: "▸",
        descripcion: "Consultas SQL básicas, INNER y LEFT JOIN, y cómo un índice convierte una búsqueda de segundos en una de milisegundos sobre un padrón de 3 millones de personas. Acompaña la práctica de Killercoda con MySQL y phpMyAdmin.",
        fecha: "2026-09-23"
    },
    {
        titulo: "Reconocimiento, fuerza bruta y SQLi",
        materias: ["infraestructura"],
        tipo: "clase",
        carpeta: "repaso-red-ataques",
        icono: "▸",
        descripcion: "Repaso presencial del hilo conductor de redes (Etapas 3 y 4): anatomía de una URL y regex de ruteo, host vs. red interna de Docker, fingerprinting con nmap, fuerza bruta con hydra, y la consulta SQL vulnerable vs. la parametrizada. Incluye cheat sheet complementario.",
        fecha: "2026-09-08"
    },
    {
        titulo: "Autenticación, WSGI y Workers",
        materias: ["redes"],
        tipo: "clase",
        carpeta: "repaso-auth-wsgi-gunicorn",
        icono: "▸",
        descripcion: "Repaso presencial del hilo conductor de redes (Etapas 1 y 2): sesión/cookie, el \"portero\" before_request, WSGI y el modelo de workers de Gunicorn, con diagramas y links a fuentes externas.",
        fecha: "2026-08-25"
    },
    {
        titulo: "Seguridad en Capas",
        materias: ["infraestructura"],
        tipo: "clase",
        carpeta: "seguridad-en-capas",
        icono: "▸",
        descripcion: "Cierre conceptual del hilo conductor de redes: panorama de ciberataques en América Latina, el modelo AV-EDR-MDR-backup, y el espejo entre IA de ataque e IA de defensa.",
        fecha: "2026-08-18"
    },
    {
        titulo: "Qué pide el mercado",
        materias: ["desarrollo"],
        tipo: "clase",
        carpeta: "que-pide-el-mercado",
        icono: "▸",
        descripcion: "Tres avisos reales de analista funcional, leídos en orden ascendente de seniority — y las tres deudas de la materia que aparecen en los tres.",
        fecha: "2026-08-18"
    },
    {
        titulo: "Wireframes con PlantUML Salt",
        materias: ["desarrollo"],
        tipo: "guia",
        carpeta: "wireframes-salt",
        icono: "▭",
        descripcion: "Cómo bocetar las pantallas del sistema en texto, dentro del repo, y cómo justificarlas en docs/diseño-ui.md. Tres ejemplos para copiar: inicio de sesión, listado con filtros y asistente por pasos.",
        fecha: "2026-10-16"
    },
    {
        titulo: "Definition of Ready y Slicing Vertical",
        materias: ["desarrollo"],
        tipo: "clase",
        carpeta: "dor-slicing",
        icono: "▸",
        descripcion: "Qué condiciones tiene que cumplir una historia antes de entrar a desarrollo, y cómo partir una épica en historias que entregan algo usable de punta a punta. Incluye el soporte del taller de slicing.",
        fecha: "2026-08-18"
    },
    {
        titulo: "El Contrato REST",
        materias: ["redes"],
        tipo: "clase",
        carpeta: "api-rest",
        icono: "📡",
        descripcion: "Cómo se hablan los sistemas: HTTP, JSON, endpoints, y los casos reales — Mercado Pago, AFIP, turnos médicos.",
        fecha: "2026-08-14"
    },
    {
        titulo: "Alternativas gratuitas a Claude Code",
        materias: ["desarrollo"],
        tipo: "guia",
        carpeta: "alternativas-claude-code",
        icono: "🆓",
        descripcion: "Gemini CLI y otras herramientas agénticas de terminal, gratis, para seguir practicando el mismo flujo de trabajo sin costo.",
        fecha: "2026-08-13"
    },
    {
        titulo: "IA Aplicada: Introducción, Uso seguro, Análisis Funcional y Redes/DevOps",
        materias: ["desarrollo"],
        tipo: "clase",
        carpeta: "ia-analisis-devops",
        icono: "🧭",
        descripcion: "Serie de 4 páginas: cómo escribir un buen prompt, cómo usar la IA sin exponer datos (anonimización, alucinaciones, sesgos, con actividad autocorregible), y dos casos concretos — ajustar un modelo ER y leer logs de un incidente.",
        fecha: "2026-10-16"
    },
    {
        titulo: "Dimensionamiento de Servidores",
        materias: ["redes"],
        tipo: "clase",
        carpeta: "dimensionamiento-servidores",
        icono: "📶",
        descripcion: "Serie de 3 clases: de HTML vs. JSON con datos reales, a dimensionar un servidor para EIDAS, a medirlo vos mismo en Killercoda.",
        fecha: "2026-08-21"
    },
    {
        titulo: "Sistema EIDAS — Modelo de trabajo",
        materias: ["desarrollo"],
        tipo: "guia",
        carpeta: "eidas-modelo-trabajo",
        icono: "📋",
        descripcion: "Cómo volcar el análisis funcional ya presentado a las plantillas de EIDAS, el nuevo sistema de corrección.",
        fecha: "2026-08-07"
    },
    {
        titulo: "Repaso EIDAS",
        materias: ["desarrollo"],
        tipo: "clase",
        carpeta: "eidas-repaso",
        icono: "▸",
        descripcion: "Una presentación de apoyo por cada sección de la rúbrica (Stakeholders, Requisitos, HU, Casos de Uso, Diseño UI), con el mismo caso de ejemplo — y Modelo ER como clase completa: teoría, práctica con 10 casos/preguntas (incluye diagramas en PlantUML) y cuestionario de entrega en Classroom.",
        fecha: "2026-09-23"
    },
    {
        titulo: "S3 + IAM en profundidad (con Floci)",
        materias: ["infraestructura"],
        tipo: "practica",
        carpeta: "s3-iam-avanzado",
        icono: "🔐",
        descripcion: "Almacenamiento de objetos y control de acceso: consola web y AWS CLI en paralelo, contra Floci.",
        fecha: "2026-08-06"
    },
    {
        titulo: "AWS y Cloud Computing — Introducción (con Floci)",
        materias: ["infraestructura"],
        tipo: "clase",
        carpeta: "aws-cloud-intro-floci",
        icono: "☁️",
        descripcion: "Qué es la nube, modelos de servicio y las categorías principales de AWS. Práctica con Floci, el emulador de AWS.",
        fecha: "2026-08-04"
    },
    {
        titulo: "Git y GitHub — Introducción",
        materias: ["infraestructura"],
        tipo: "clase",
        carpeta: "github-git-intro",
        icono: "🐙",
        descripcion: "Control de versiones y flujo de trabajo colaborativo con Git y GitHub.",
        fecha: "2026-08-04"
    },
    {
        titulo: "DHCP — Proceso DORA",
        materias: ["redes"],
        tipo: "clase",
        carpeta: "dhcp",
        icono: "🌐",
        descripcion: "Asignación dinámica de direcciones IP y el proceso Discover-Offer-Request-Ack.",
        fecha: "2026-04-24"
    },
    {
        titulo: "iptables: Firewall en Linux",
        materias: ["redes"],
        tipo: "clase",
        carpeta: "iptables",
        icono: "🧱",
        descripcion: "Reglas de filtrado de paquetes y cadenas de firewall en Linux.",
        fecha: "2025-10-16"
    },
    {
        titulo: "Lab Docker — Diagnóstico de Redes",
        materias: ["infraestructura"],
        tipo: "practica",
        carpeta: "docker-connectivity-lab",
        icono: "🐳",
        descripcion: "Práctica de conectividad y diagnóstico de red entre contenedores.",
        fecha: "2025-10-02"
    },
    {
        titulo: "Monitor de Red - Console View",
        materias: ["infraestructura"],
        tipo: "herramienta",
        carpeta: "monitorizacion-redes",
        icono: "📊",
        descripcion: "Monitoreo de red desde una vista de consola.",
        fecha: "2025-09-17"
    },
    {
        titulo: "Arquitectura de Netflix",
        materias: ["desarrollo"],
        tipo: "caso",
        carpeta: "netflix",
        icono: "🎬",
        descripcion: "Caso de estudio de arquitectura de sistemas a gran escala.",
        fecha: "2025-09-26"
    },
    {
        titulo: "IA y Diseño de Sistemas Web",
        materias: ["desarrollo"],
        tipo: "clase",
        carpeta: "ia-disenio-sistemas-web",
        icono: "🧠",
        descripcion: "Charla introductoria: historia, cómo funciona y dónde entra la IA en el trabajo de análisis funcional.",
        fecha: "2026-08-13"
    },
    {
        titulo: "Análisis Funcional - Sistema de Pedidos a Domicilio",
        materias: ["desarrollo"],
        tipo: "caso",
        carpeta: "analisis-funcional-restaurant",
        icono: "🍔",
        descripcion: "Caso práctico de análisis funcional aplicado a un sistema de pedidos.",
        fecha: "2025-08-29"
    },
    {
        titulo: "Diseños Preliminares - Sistema de Pedidos",
        materias: ["desarrollo"],
        tipo: "caso",
        carpeta: "disenio-interfaces",
        icono: "🎨",
        descripcion: "Diseño preliminar de interfaces para el sistema de pedidos.",
        fecha: "2025-08-29"
    },
    {
        titulo: "Calculadora de Infraestructura en la Nube",
        materias: ["infraestructura"],
        tipo: "herramienta",
        carpeta: "calculadora-infraestructura",
        icono: "🧮",
        descripcion: "Herramienta para estimar recursos y costos de infraestructura cloud.",
        fecha: "2025-08-29"
    },
    {
        titulo: "Direccionamiento IP",
        materias: ["redes"],
        tipo: "clase",
        carpeta: "direccionamiento-ip",
        icono: "🔢",
        descripcion: "Clases de direcciones, subredes y cálculo de direccionamiento IP.",
        fecha: "2025-08-26"
    },
    {
        titulo: "Fundamentos de Ingeniería de Software",
        materias: ["desarrollo"],
        tipo: "clase",
        carpeta: "clase-repaso-ing-soft",
        icono: "📐",
        descripcion: "Repaso de conceptos fundamentales de ingeniería de software.",
        fecha: "2025-08-06"
    },
    {
        titulo: "Monitoreo y Mantenimiento de Servidores Virtuales",
        materias: ["infraestructura"],
        tipo: "clase",
        carpeta: "servidores-virtuales-conceptos-monitoreo",
        icono: "🖥️",
        descripcion: "Conceptos de monitoreo y mantenimiento de servidores virtualizados.",
        fecha: "2025-08-18"
    }
];
