# Caso BiciRío

**BiciRío** es el sistema de bicicletas públicas de la ciudad. Lo gestiona la **Secretaría de Movilidad** del municipio, que quiere reemplazar el sistema actual (tarjetas magnéticas y planillas) por uno nuevo con app para el celular.

## El sistema

### Estaciones y anclajes

La red tiene **40 estaciones**. Cada estación tiene entre 12 y 20 **anclajes**, numerados desde el 1 dentro de cada estación: el "anclaje 7" existe en muchas estaciones. Cada anclaje tiene un **sensor** que avisa cuándo una bicicleta quedó trabada y cuándo se liberó, y un código QR pegado.

Si una estación pierde la conexión, sigue aceptando devoluciones y sincroniza los datos cuando vuelve.

## Quiénes están involucrados

### Abonado anual

Residente de la ciudad. Se registra con DNI y paga un abono por año. Usa la bici para ir a trabajar o a estudiar.

### Usuario con pase diario

Visitante o usuario ocasional. Compra un pase por día desde la app y paga con tarjeta.

### Operador de logística

Recorre la ciudad con una camioneta llevando bicicletas de las estaciones llenas a las vacías. Hoy decide a ojo, llamando por radio.

### Técnico del taller

Revisa y repara las bicicletas con fallas. Es quien las vuelve a habilitar.

### Secretaría de Movilidad

Dueña del sistema. Fija las tarifas por ordenanza (cambian varias veces al año) y publica estadísticas de uso.

### Pasarela de pagos

Empresa externa que procesa los cobros con tarjeta: pases diarios y excedentes. El sistema se conecta con ella.

## Cómo es un viaje

1. El usuario abre la app y mira en el mapa qué estaciones tienen bicicletas.
2. En la estación, escanea el QR del anclaje. Si tiene una deuda pendiente, no puede retirar.
3. El anclaje libera la bicicleta y empieza a correr el tiempo del viaje.
4. A los 50 minutos, la app le avisa que se acerca al límite.
5. Devuelve la bici en cualquier estación: la engancha en un anclaje libre y el sensor confirma la traba.
6. El viaje se cierra. Si pasó los 60 minutos, se cobra el excedente.

## Reglas

- Cada viaje incluye **60 minutos**. Pasado ese tiempo se cobra **cada 15 minutos o fracción**, según la tarifa vigente en ese momento.
- Si el excedente no se puede cobrar, queda como **deuda** y el usuario no puede retirar otra bici hasta pagarla.
- Si la estación donde quiere devolver está **llena**, la app le suma **15 minutos sin cargo** y le muestra las estaciones cercanas con lugar.
- Cualquier usuario puede **reportar una falla** desde la app. La bicicleta queda bloqueada hasta que un técnico del taller la revisa.

## Lo que pidió la Secretaría

- El mapa tiene que mostrar la ocupación de las estaciones con un **desfase máximo de 10 segundos** respecto de la realidad.
- Todos los meses se publican **estadísticas de viajes como datos abiertos** (por ejemplo, de qué estación a qué estación viaja la gente y a qué hora), sin que se pueda identificar a ninguna persona, como exige la **Ley 25.326** de protección de datos personales.
- La app se usa en la calle: parado junto a la estación, muchas veces con una sola mano y a pleno sol.
- Los operadores de logística necesitan saber rápido cuál es la próxima estación que conviene atender.
