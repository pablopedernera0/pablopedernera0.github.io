// Generado por sistema-eidas/scripts/cuestionario.py. No editar a mano.
window.CUESTIONARIO = {
 "id": "simulacro-2p-bicirio",
 "titulo": "Simulacro 2° parcial — Diseño de Sistemas Web — Caso BiciRío",
 "total": 30,
 "preguntas": [
  {
   "num": 1,
   "puntos": 2,
   "enunciado": "La pasarela de pagos externa que cobra los pases diarios y los excedentes, ¿qué es en el análisis?",
   "opciones": [
    {
     "letra": "a",
     "texto": "El actor principal de \"Pagar excedente\", porque es quien termina ejecutando el cobro."
    },
    {
     "letra": "b",
     "texto": "Un stakeholder, pero no un actor: los actores de un caso de uso tienen que ser personas."
    },
    {
     "letra": "c",
     "texto": "Un actor secundario de los casos de uso de cobro y, a la vez, un stakeholder."
    },
    {
     "letra": "d",
     "texto": "Ni actor ni stakeholder: es un componente técnico que se define en la implementación."
    }
   ]
  },
  {
   "num": 2,
   "puntos": 1,
   "enunciado": "¿Cuál de estos requisitos es no funcional?",
   "opciones": [
    {
     "letra": "a",
     "texto": "\"Cobrar cada 15 minutos o fracción una vez pasados los 60 minutos incluidos en el viaje.\""
    },
    {
     "letra": "b",
     "texto": "\"Avisar al usuario con una notificación cuando su viaje en curso llega a los 50 minutos.\""
    },
    {
     "letra": "c",
     "texto": "\"El mapa muestra la ocupación de las estaciones con un desfase máximo de 10 segundos.\""
    },
    {
     "letra": "d",
     "texto": "\"Sumar 15 minutos sin cargo al viaje cuando la estación elegida para devolver está llena.\""
    }
   ]
  },
  {
   "num": 3,
   "puntos": 1,
   "enunciado": "¿Cuál es la mejor historia de usuario para la redistribución de bicicletas?",
   "opciones": [
    {
     "letra": "a",
     "texto": "Como operador de logística, quiero ver las estaciones con menos de 3 bicicletas, para decidir la próxima parada."
    },
    {
     "letra": "b",
     "texto": "Como operador de logística, quiero una consulta SQL que liste la ocupación de cada estación, para verla desde la camioneta."
    },
    {
     "letra": "c",
     "texto": "Como sistema, quiero calcular cada minuto la ocupación de todas las estaciones, para que los operadores tengan datos actualizados."
    },
    {
     "letra": "d",
     "texto": "Como Secretaría de Movilidad, quiero que la redistribución de bicicletas sea más eficiente, para mejorar el servicio."
    }
   ]
  },
  {
   "num": 4,
   "puntos": 2,
   "enunciado": "HU: \"Como usuario, quiero devolver la bicicleta aunque la estación esté llena, para no pagar de más\". ¿Cuál es el mejor criterio de aceptación?",
   "opciones": [
    {
     "letra": "a",
     "texto": "Sin anclajes libres, la app lista las 3 estaciones con lugar más cercanas y el viaje pasa a incluir 75 minutos."
    },
    {
     "letra": "b",
     "texto": "Cuando la estación está llena, el sistema resuelve la devolución de manera correcta y el usuario no paga de más."
    },
    {
     "letra": "c",
     "texto": "Cuando la estación está llena, la app muestra un mensaje claro que avisa que no quedan anclajes disponibles."
    },
    {
     "letra": "d",
     "texto": "El usuario puede devolver la bicicleta en cualquier estación de la ciudad, esté llena o no, sin costo adicional."
    }
   ]
  },
  {
   "num": 5,
   "puntos": 1,
   "enunciado": "HU: \"Como usuario, quiero que BiciRío sea confiable, para usarlo todos los días\". Según INVEST, ¿qué falla principalmente?",
   "opciones": [
    {
     "letra": "a",
     "texto": "Valiosa: la confiabilidad no le aporta nada concreto al usuario."
    },
    {
     "letra": "b",
     "texto": "Independiente: depende de que todas las demás historias estén terminadas."
    },
    {
     "letra": "c",
     "texto": "Verificable y Estimable: no se puede comprobar ni calcular su esfuerzo."
    },
    {
     "letra": "d",
     "texto": "Pequeña: abarca demasiado y hay que partirla en varias historias."
    }
   ]
  },
  {
   "num": 6,
   "puntos": 1,
   "enunciado": "¿Cuál de estos ítems puede ir en un Definition of Ready?",
   "opciones": [
    {
     "letra": "a",
     "texto": "Cada criterio de aceptación nombra un estado o un valor observable en el sistema."
    },
    {
     "letra": "b",
     "texto": "La historia fue revisada por el equipo con el nivel de detalle suficiente para empezar."
    },
    {
     "letra": "c",
     "texto": "Las dependencias de la historia con otras historias están razonablemente identificadas."
    },
    {
     "letra": "d",
     "texto": "El equipo considera que la historia tiene un tamaño adecuado para una iteración."
    }
   ]
  },
  {
   "num": 7,
   "puntos": 1,
   "enunciado": "La historia \"Pagar excedente\" no pasa el DoR porque nadie definió qué pasa si la tarjeta es rechazada. ¿Qué corresponde?",
   "opciones": [
    {
     "letra": "a",
     "texto": "Se ajusta el DoR para esta historia, ya que el rechazo es un caso poco frecuente."
    },
    {
     "letra": "b",
     "texto": "Entra igual porque el resto de los ítems se cumple, y ese queda anotado como pendiente."
    },
    {
     "letra": "c",
     "texto": "Entra a desarrollo y el rechazo de tarjeta se define cuando aparezca en las pruebas."
    },
    {
     "letra": "d",
     "texto": "Vuelve a refinamiento y no entra a desarrollo hasta tener esa decisión escrita."
    }
   ]
  },
  {
   "num": 8,
   "puntos": 2,
   "enunciado": "Épica: \"Viaje completo en BiciRío\". ¿Cuál de estos cortes es slicing vertical?",
   "opciones": [
    {
     "letra": "a",
     "texto": "Todo el viaje del abonado anual / Todo el viaje del pase diario / Todas las tareas del operador de logística."
    },
    {
     "letra": "b",
     "texto": "Alta de bicicletas y estaciones / Consulta del mapa / Modificación de tarifas / Baja de usuarios con deuda."
    },
    {
     "letra": "c",
     "texto": "Viaje en la misma estación sin excedente / Devolver en otra estación / Pagar excedente / Devolver con estación llena."
    },
    {
     "letra": "d",
     "texto": "Pantalla de escaneo del QR / Servicio de viajes en el backend / Tabla VIAJE en la base / Integración con la pasarela."
    }
   ]
  },
  {
   "num": 9,
   "puntos": 1,
   "enunciado": "Del corte vertical anterior, ¿cuál conviene construir primero?",
   "opciones": [
    {
     "letra": "a",
     "texto": "Devolver en otra estación, porque es como la mayoría de los usuarios usa el sistema."
    },
    {
     "letra": "b",
     "texto": "Pagar excedente, porque es la historia que genera ingresos para el municipio."
    },
    {
     "letra": "c",
     "texto": "Devolver con estación llena, porque es la más riesgosa y conviene resolverla antes."
    },
    {
     "letra": "d",
     "texto": "El viaje en la misma estación sin excedente: es lo mínimo que ya funciona completo."
    }
   ]
  },
  {
   "num": 10,
   "puntos": 2,
   "enunciado": "RNF: \"Las estadísticas publicadas como datos abiertos deben estar anonimizadas (Ley 25.326)\". ¿Cómo se traza?",
   "opciones": [
    {
     "letra": "a",
     "texto": "Con un caso de uso nuevo, \"Anonimizar datos\", que \"Publicar estadísticas\" incluye con <<include>>."
    },
    {
     "letra": "b",
     "texto": "Dentro de \"Publicar estadísticas\", como paso o postcondición: lo publicado no identifica a nadie."
    },
    {
     "letra": "c",
     "texto": "Con una historia de usuario propia: \"Como Secretaría, quiero cumplir la Ley 25.326, para evitar sanciones\"."
    },
    {
     "letra": "d",
     "texto": "Con un atributo \"anonimizado\" (sí/no) en la entidad VIAJE, que se marca antes de publicar."
    }
   ]
  },
  {
   "num": 11,
   "puntos": 2,
   "enunciado": "En los casos de uso aparece \"Ranking de ciclistas con premios\", pero ningún requisito ni historia lo menciona. ¿Qué indica?",
   "opciones": [
    {
     "letra": "a",
     "texto": "Que hay que agregar una historia de usuario para ese caso de uso, así la cadena queda completa."
    },
    {
     "letra": "b",
     "texto": "Que está bien: los casos de uso detallan funciones que en los requisitos quedaron implícitas."
    },
    {
     "letra": "c",
     "texto": "Que conviene modelarlo como <<extend>> de \"Devolver bicicleta\", porque es opcional."
    },
    {
     "letra": "d",
     "texto": "Que no se rastrea hasta el caso: se saca, o se valida con un stakeholder antes de agregarlo."
    }
   ]
  },
  {
   "num": 12,
   "puntos": 2,
   "enunciado": "\"Devolver bicicleta\" siempre confirma la traba del anclaje, y solo si el viaje pasó los 60 minutos cobra el excedente. ¿Qué modelado es correcto?",
   "opciones": [
    {
     "letra": "a",
     "texto": "\"Devolver bicicleta\" <<include>> \"Confirmar traba\" y \"Cobrar excedente\" <<extend>> \"Devolver bicicleta\"."
    },
    {
     "letra": "b",
     "texto": "\"Devolver bicicleta\" <<include>> \"Confirmar traba\" y \"Devolver bicicleta\" <<include>> \"Cobrar excedente\"."
    },
    {
     "letra": "c",
     "texto": "\"Cobrar excedente\" <<include>> \"Devolver bicicleta\" y \"Confirmar traba\" <<extend>> \"Devolver bicicleta\"."
    },
    {
     "letra": "d",
     "texto": "\"Devolver bicicleta\" <<include>> \"Confirmar traba\" y \"Devolver bicicleta\" <<extend>> \"Cobrar excedente\"."
    }
   ]
  },
  {
   "num": 13,
   "puntos": 1,
   "enunciado": "En el caso de uso \"Retirar bicicleta\" de un usuario con pase diario, ¿quiénes son los actores?",
   "opciones": [
    {
     "letra": "a",
     "texto": "Principal: el usuario. Secundarios: la pasarela de pagos y la base de datos."
    },
    {
     "letra": "b",
     "texto": "Principal: el usuario. Secundario: la pasarela de pagos."
    },
    {
     "letra": "c",
     "texto": "Principal: la app de BiciRío. Secundarios: el usuario y la pasarela de pagos."
    },
    {
     "letra": "d",
     "texto": "Principal: el usuario. Secundario: la Secretaría de Movilidad."
    }
   ]
  },
  {
   "num": 14,
   "puntos": 2,
   "enunciado": "En \"Devolver bicicleta\", el sensor del anclaje no confirma la traba. ¿Cuál es la excepción mejor resuelta?",
   "opciones": [
    {
     "letra": "a",
     "texto": "El sistema cierra el viaje igual, para no cobrarle al usuario un excedente que no es su culpa, y registra el anclaje como defectuoso."
    },
    {
     "letra": "b",
     "texto": "El sistema muestra \"No se pudo confirmar la devolución, intente más tarde\" y vuelve a la pantalla principal de la app."
    },
    {
     "letra": "c",
     "texto": "Pasados 10 s sin confirmación, el viaje sigue abierto y la app pide reintentar o reportar. Si reporta, se cierra a esa hora y la bici se bloquea."
    },
    {
     "letra": "d",
     "texto": "El sistema mantiene el viaje abierto y le indica al usuario que se comunique con el centro de atención para resolverlo."
    }
   ]
  },
  {
   "num": 15,
   "puntos": 2,
   "enunciado": "¿Cuál es la mejor postcondición de éxito de \"Devolver bicicleta\"?",
   "opciones": [
    {
     "letra": "a",
     "texto": "La bicicleta fue devuelta correctamente en una estación habilitada del sistema y el usuario quedó conforme."
    },
    {
     "letra": "b",
     "texto": "El viaje queda cerrado con hora y estación de llegada, la bici disponible y el excedente cobrado o como deuda."
    },
    {
     "letra": "c",
     "texto": "El usuario ve el resumen del viaje con la duración, el recorrido y el importe, y puede calificar el servicio."
    },
    {
     "letra": "d",
     "texto": "Se validó que el usuario no tuviera deuda y que el anclaje estuviera libre antes de confirmar la devolución."
    }
   ]
  },
  {
   "num": 16,
   "puntos": 2,
   "enunciado": "Un VIAJE tiene una estación de origen y una de destino. ¿Cómo se modela?",
   "opciones": [
    {
     "letra": "a",
     "texto": "Una relación N:M entre BICICLETA y ESTACION, con la fecha y la hora como atributos de la relación."
    },
    {
     "letra": "b",
     "texto": "VIAJE con una sola FK estacion_id y un atributo \"tipo\" (origen o destino) para distinguir las dos."
    },
    {
     "letra": "c",
     "texto": "Dos entidades, VIAJE_ORIGEN y VIAJE_DESTINO, cada una con su FK a ESTACION y a BICICLETA."
    },
    {
     "letra": "d",
     "texto": "VIAJE con dos FK a ESTACION, origen y destino; el destino queda vacío mientras el viaje sigue en curso."
    }
   ]
  },
  {
   "num": 17,
   "puntos": 2,
   "enunciado": "En VIAJE, ¿qué conviene hacer con \"duración\" y con \"importe cobrado\"?",
   "opciones": [
    {
     "letra": "a",
     "texto": "Guardar los dos: aunque se puedan calcular, así las consultas y los reportes son más rápidos."
    },
    {
     "letra": "b",
     "texto": "Calcular la duración y guardar el importe: la tarifa cambia y hay que conservar lo cobrado."
    },
    {
     "letra": "c",
     "texto": "Calcular los dos cada vez: los dos son atributos derivados y guardarlos duplica información."
    },
    {
     "letra": "d",
     "texto": "Guardar la duración, porque es un dato del viaje, y calcular el importe con la tarifa vigente."
    }
   ]
  },
  {
   "num": 18,
   "puntos": 1,
   "enunciado": "Cada estación tiene anclajes numerados del 1 al 20, así que el anclaje 7 existe en muchas estaciones. ¿Qué es ANCLAJE en el modelo?",
   "opciones": [
    {
     "letra": "a",
     "texto": "Una entidad débil: se identifica por su estación más su número."
    },
    {
     "letra": "b",
     "texto": "Una entidad fuerte, con el número de anclaje como clave primaria."
    },
    {
     "letra": "c",
     "texto": "Una relación N:M entre ESTACION y BICICLETA, con el número como atributo."
    },
    {
     "letra": "d",
     "texto": "Un atributo multivaluado de ESTACION, sin entidad propia."
    }
   ]
  },
  {
   "num": 19,
   "puntos": 1,
   "enunciado": "En diseno-ui.md, ¿cuál es la mejor consideración de accesibilidad para la pantalla \"Retirar bicicleta\"?",
   "opciones": [
    {
     "letra": "a",
     "texto": "Todas las acciones tienen un ícono y un texto descriptivo, y la tipografía es moderna y fácil de leer."
    },
    {
     "letra": "b",
     "texto": "Se ofrece un modo oscuro con colores suaves, para que la lectura sea más cómoda en cualquier momento."
    },
    {
     "letra": "c",
     "texto": "La pantalla cumple con las pautas WCAG 2.1 nivel AA de contraste, tamaño de texto y navegación."
    },
    {
     "letra": "d",
     "texto": "Botón de escanear de 44x44 px al alcance del pulgar y alto contraste: se usa en la calle, al sol."
    }
   ]
  },
  {
   "num": 20,
   "puntos": 1,
   "enunciado": "Para la pantalla del operador de logística, ¿cuál es la decisión de UI mejor justificada?",
   "opciones": [
    {
     "letra": "a",
     "texto": "Un mapa grande con todas las estaciones coloreadas por ocupación, porque es más visual e intuitivo."
    },
    {
     "letra": "b",
     "texto": "Lista ordenada por menos bicicletas, con la distancia: el operador decide comparando esos dos valores."
    },
    {
     "letra": "c",
     "texto": "Un formulario por pasos para registrar cuántas bicicletas dejó o retiró en cada estación visitada."
    },
    {
     "letra": "d",
     "texto": "Patrón Card para cada estación, porque es el patrón más usado en aplicaciones móviles actuales."
    }
   ]
  }
 ]
};
