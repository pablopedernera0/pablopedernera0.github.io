// Índice de recursos del sitio. Última actualización: 2026-08-18 ART.
// Cada entrada agrega una carpeta al índice de la home (ver render-recursos.js).
// Para publicar un recurso nuevo: agregar un objeto acá, no tocar index.html.
//
// categoria: debe coincidir con el id de la course-card en index.html
//   'infraestructura' | 'desarrollo' | 'redes'
const RECURSOS = [
    {
        titulo: "Qué pide el mercado",
        categoria: "desarrollo",
        carpeta: "que-pide-el-mercado",
        icono: "▸",
        descripcion: "Tres avisos reales de analista funcional, leídos en orden ascendente de seniority — y las tres deudas de la materia que aparecen en los tres.",
        fecha: "2026-08-18"
    },
    {
        titulo: "Definition of Ready y Slicing Vertical",
        categoria: "desarrollo",
        carpeta: "dor-slicing",
        icono: "▸",
        descripcion: "Qué condiciones tiene que cumplir una historia antes de entrar a desarrollo, y cómo partir una épica en historias que entregan algo usable de punta a punta. Incluye el soporte del taller de slicing.",
        fecha: "2026-08-18"
    },
    {
        titulo: "El Contrato REST",
        categoria: "redes",
        carpeta: "api-rest",
        icono: "📡",
        descripcion: "Cómo se hablan los sistemas: HTTP, JSON, endpoints, y los casos reales — Mercado Pago, AFIP, turnos médicos.",
        fecha: "2026-08-14"
    },
    {
        titulo: "Alternativas gratuitas a Claude Code",
        categoria: "desarrollo",
        carpeta: "alternativas-claude-code",
        icono: "🆓",
        descripcion: "Gemini CLI y otras herramientas agénticas de terminal, gratis, para seguir practicando el mismo flujo de trabajo sin costo.",
        fecha: "2026-08-13"
    },
    {
        titulo: "IA Aplicada: Introducción, Análisis Funcional y Redes/DevOps",
        categoria: "desarrollo",
        carpeta: "ia-analisis-devops",
        icono: "🧭",
        descripcion: "Serie de 3 páginas: cómo escribir un buen prompt, y dos casos concretos — ajustar un modelo ER y leer logs de un incidente.",
        fecha: "2026-08-13"
    },
    {
        titulo: "Dimensionamiento de Servidores — Clase 1",
        categoria: "redes",
        carpeta: "dimensionamiento-servidores",
        icono: "📶",
        descripcion: "Página completa vs. JSON: datos reales de tamaño y su impacto al escalar de 10 a 10.000 usuarios.",
        fecha: "2026-08-07"
    },
    {
        titulo: "Sistema EIDAS — Modelo de trabajo",
        categoria: "desarrollo",
        carpeta: "eidas-modelo-trabajo",
        icono: "📋",
        descripcion: "Cómo volcar el análisis funcional ya presentado a las plantillas de EIDAS, el nuevo sistema de corrección.",
        fecha: "2026-08-07"
    },
    {
        titulo: "S3 + IAM en profundidad",
        categoria: "infraestructura",
        carpeta: "s3-iam-avanzado",
        icono: "🔐",
        descripcion: "Almacenamiento de objetos y control de acceso: consola web y AWS CLI en paralelo.",
        fecha: "2026-08-06"
    },
    {
        titulo: "AWS y Cloud Computing — Introducción",
        categoria: "infraestructura",
        carpeta: "aws-cloud-intro",
        icono: "☁️",
        descripcion: "Qué es la nube, modelos de servicio y las categorías principales de AWS.",
        fecha: "2026-08-04"
    },
    {
        titulo: "Git y GitHub — Introducción",
        categoria: "infraestructura",
        carpeta: "github-git-intro",
        icono: "🐙",
        descripcion: "Control de versiones y flujo de trabajo colaborativo con Git y GitHub.",
        fecha: "2026-08-04"
    },
    {
        titulo: "DHCP — Proceso DORA",
        categoria: "redes",
        carpeta: "dhcp",
        icono: "🌐",
        descripcion: "Asignación dinámica de direcciones IP y el proceso Discover-Offer-Request-Ack.",
        fecha: "2026-04-24"
    },
    {
        titulo: "iptables: Firewall en Linux",
        categoria: "redes",
        carpeta: "iptables",
        icono: "🧱",
        descripcion: "Reglas de filtrado de paquetes y cadenas de firewall en Linux.",
        fecha: "2025-10-16"
    },
    {
        titulo: "Lab Docker — Diagnóstico de Redes",
        categoria: "infraestructura",
        carpeta: "docker-connectivity-lab",
        icono: "🐳",
        descripcion: "Práctica de conectividad y diagnóstico de red entre contenedores.",
        fecha: "2025-10-02"
    },
    {
        titulo: "Monitor de Red - Console View",
        categoria: "infraestructura",
        carpeta: "monitorizacion-redes",
        icono: "📊",
        descripcion: "Monitoreo de red desde una vista de consola.",
        fecha: "2025-09-17"
    },
    {
        titulo: "Arquitectura de Netflix",
        categoria: "desarrollo",
        carpeta: "netflix",
        icono: "🎬",
        descripcion: "Caso de estudio de arquitectura de sistemas a gran escala.",
        fecha: "2025-09-26"
    },
    {
        titulo: "IA y Diseño de Sistemas Web",
        categoria: "desarrollo",
        carpeta: "ia-disenio-sistemas-web",
        icono: "🧠",
        descripcion: "Charla introductoria: historia, cómo funciona y dónde entra la IA en el trabajo de análisis funcional.",
        fecha: "2026-08-13"
    },
    {
        titulo: "Análisis Funcional - Sistema de Pedidos a Domicilio",
        categoria: "desarrollo",
        carpeta: "analisis-funcional-restaurant",
        icono: "🍔",
        descripcion: "Caso práctico de análisis funcional aplicado a un sistema de pedidos.",
        fecha: "2025-08-29"
    },
    {
        titulo: "Diseños Preliminares - Sistema de Pedidos",
        categoria: "desarrollo",
        carpeta: "disenio-interfaces",
        icono: "🎨",
        descripcion: "Diseño preliminar de interfaces para el sistema de pedidos.",
        fecha: "2025-08-29"
    },
    {
        titulo: "Calculadora de Infraestructura en la Nube",
        categoria: "infraestructura",
        carpeta: "calculadora-infraestructura",
        icono: "🧮",
        descripcion: "Herramienta para estimar recursos y costos de infraestructura cloud.",
        fecha: "2025-08-29"
    },
    {
        titulo: "Direccionamiento IP",
        categoria: "redes",
        carpeta: "direccionamiento-ip",
        icono: "🔢",
        descripcion: "Clases de direcciones, subredes y cálculo de direccionamiento IP.",
        fecha: "2025-08-26"
    },
    {
        titulo: "Fundamentos de Ingeniería de Software",
        categoria: "desarrollo",
        carpeta: "clase-repaso-ing-soft",
        icono: "📐",
        descripcion: "Repaso de conceptos fundamentales de ingeniería de software.",
        fecha: "2025-08-06"
    },
    {
        titulo: "Monitoreo y Mantenimiento de Servidores Virtuales",
        categoria: "infraestructura",
        carpeta: "servidores-virtuales-conceptos-monitoreo",
        icono: "🖥️",
        descripcion: "Conceptos de monitoreo y mantenimiento de servidores virtualizados.",
        fecha: "2025-08-18"
    }
];
