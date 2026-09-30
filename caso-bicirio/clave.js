// Generado por sistema-eidas/scripts/cuestionario.py. Publicar solo al terminar.
window.CLAVE = {
 "id": "simulacro-2p-bicirio",
 "respuestas": {
  "1": {
   "correcta": "c",
   "porque": "un actor puede ser otro sistema. La pasarela participa sin iniciar el caso (secundario) y, como organización con interés en el sistema, también es stakeholder."
  },
  "2": {
   "correcta": "c",
   "porque": "que un requisito tenga un número no lo vuelve RNF. Los otros tres describen comportamiento (qué hace el sistema); el desfase de 10 s pone una condición de calidad sobre una función que ya existe, el mapa."
  },
  "3": {
   "correcta": "a",
   "porque": "rol real (no \"el sistema\"), acción observable y un para qué concreto. La de la Secretaría es un deseo sin acción verificable; la del SQL pide una solución técnica en lugar de una necesidad."
  },
  "4": {
   "correcta": "a",
   "porque": "el criterio tiene que poder comprobarse mirando el sistema, con un estado o un valor concreto. \"De manera correcta\" repite el objetivo; el mensaje solo no aplica la regla de los 15 minutos; la última contradice el caso (una estación llena no tiene dónde trabar la bici)."
  },
  "5": {
   "correcta": "c",
   "porque": "valen las dos. \"Confiable\" no se puede probar ni estimar, y además no es una funcionalidad: atraviesa todos los módulos (retiro, devolución, cobro, mapa), así que no se puede entregar sola. Si detrás hay algo concreto (por ejemplo, disponibilidad), es un RNF que se baja a criterios de las historias existentes.",
   "correctas": [
    "c",
    "b"
   ]
  },
  "6": {
   "correcta": "a",
   "porque": "un ítem del DoR se responde sí o no sin discutir. \"Razonablemente\", \"suficiente\" y \"considera\" dejan la respuesta librada a la opinión."
  },
  "7": {
   "correcta": "d",
   "porque": "el DoR es un filtro, no un trámite: no se negocia caso por caso. Su valor es tener esa conversación antes, cuando todavía es barata."
  },
  "8": {
   "correcta": "c",
   "porque": "cada historia del corte correcto entrega algo usable de punta a punta. La primera opción son capas técnicas; la segunda son bloques enormes; la cuarta son funciones sueltas que no arman un viaje."
  },
  "9": {
   "correcta": "d",
   "porque": "la primera tajada es la más fina que ya entrega valor real. Las demás la extienden; sin un viaje básico funcionando, cobrar excedentes o resolver estaciones llenas no tiene sobre qué apoyarse."
  },
  "10": {
   "correcta": "b",
   "porque": "un RF genera cajas nuevas; un RNF ajusta campos de las que ya existen. Si estás creando un CU o una HU \"para cumplir el RNF\", seguramente va adentro de uno que ya tenías."
  },
  "11": {
   "correcta": "d",
   "porque": "un CU que no se rastrea hasta un requisito se inventó suelto. Escribir la HU \"para completar la cadena\" es hacer la trazabilidad al revés: el origen tiene que venir del caso, validado con quien lo pide."
  },
  "12": {
   "correcta": "a",
   "porque": "<<include>> = siempre ocurre, sale del caso base hacia el incluido. <<extend>> = opcional bajo una condición, y la flecha sale del caso que extiende hacia el caso base. Acá importan el tipo y la dirección."
  },
  "13": {
   "correcta": "b",
   "porque": "el actor principal inicia el caso para lograr su objetivo. La app y la base de datos son parte del sistema, no actores externos. La Secretaría es stakeholder pero no participa del retiro."
  },
  "14": {
   "correcta": "c",
   "porque": "una buena excepción dice la condición, qué hace el sistema y en qué estado queda todo. Cerrar el viaje sin más deja una bicicleta posiblemente suelta sin responsable; las otras dos no toman ninguna decisión sobre el viaje ni sobre la bicicleta."
  },
  "15": {
   "correcta": "b",
   "porque": "una postcondición describe qué queda cierto en el sistema al terminar. Un resumen en pantalla o la conformidad del usuario no son estado; la última describe condiciones previas, no el resultado."
  },
  "16": {
   "correcta": "d",
   "porque": "son dos relaciones distintas con la misma entidad, cada una con su rol. Una sola FK con \"tipo\" obliga a dos filas por viaje; partir el viaje en dos entidades rompe la unidad del hecho que se registra."
  },
  "17": {
   "correcta": "b",
   "porque": "la duración es un atributo derivado de las horas de retiro y devolución. El importe parece derivado, pero depende de una tarifa que cambia por ordenanza: es un hecho histórico, y recalcularlo con la tarifa de hoy da otro número."
  },
  "18": {
   "correcta": "a",
   "porque": "el número solo no identifica al anclaje; recién junto con su estación es único. Tampoco alcanza un atributo ni una relación: tiene datos propios (sensor, estado) y existe aunque no tenga bicicleta."
  },
  "19": {
   "correcta": "d",
   "porque": "la accesibilidad se ata a un usuario y una situación real del caso. Citar la norma sin decir qué se hizo sirve para cualquier sistema; el modo oscuro empeora la lectura a pleno sol."
  },
  "20": {
   "correcta": "b",
   "porque": "el patrón se justifica por la tarea del usuario. \"Más usado\" y \"más visual\" no se atan a la decisión que tiene que tomar el operador; el formulario resuelve otra tarea (registrar), no elegir la próxima parada."
  }
 }
};
