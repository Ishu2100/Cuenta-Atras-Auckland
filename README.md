# Auckland Countdown

Cuenta atrás cinematográfica hasta la salida del vuelo a Auckland. HTML + CSS + JS puro, sin dependencias ni compilación.

## Ejecutar
Abre `index.html` con doble clic (funciona sin servidor). Opcional: `npx serve .` o `python3 -m http.server`.
`auckland-countdown-standalone.html` es la misma página en un único archivo.

## Cambiar fecha, hora y zona horaria
Edita solo `js/config.js`:
- `departure.date` y `departure.time`: fecha y hora **locales del aeropuerto de salida**.
- `departure.timeZone`: zona IANA de ese aeropuerto (`Europe/Madrid`, `Atlantic/Canary`, `America/Bogota`…).
  La hora de verano/invierno se resuelve sola; el contador usa el instante UTC real.
- `departure.label`: texto mostrado junto a la hora.
- `backgroundPhoto`: ruta a tu propia foto de Auckland (se mezcla sobre el cielo).

## Comprobar la lógica
`node tests/test-countdown.js` (requiere Node 14+). Verifica 16:35 Madrid = 14:35 UTC en junio de 2027.

## Estructura
`index.html` · `css/styles.css` · `js/config.js` (ajustes) · `js/countdown.js` (fechas/zonas, sin DOM) · `js/app.js` (interfaz y animaciones) · `assets/skyline.svg` (ilustración original) · `tests/`.

## Barra de progreso y estados
- El avión de la barra está en `progreso = (ahora − inicio) / (salida − inicio)`, calculado con fechas absolutas: sobrevive a recargas y es igual en cualquier dispositivo. Nunca depende de cuándo abres la página.
- El inicio (0 %) se configura en `progress.startDate` / `progress.startTime` (hora de la zona de salida). Antes del inicio marca 0 %; después de la salida, 100 %.
- Estados automáticos (`body[data-state]`): `far`, `near` (a partir de `states.nearDays` días), `final` (últimas 24 h, con aviso) y `arrived` (despegue y mensaje final).
