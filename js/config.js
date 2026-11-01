/* CONFIGURACIÓN CENTRAL: edita solo este archivo para cambiar fecha, hora y ajustes. */
window.COUNTDOWN_CONFIG = {
  departure: {
    date: '2027-06-23',          // AAAA-MM-DD (fecha local del aeropuerto de salida)
    time: '16:35',               // HH:MM en 24 h (hora local del aeropuerto de salida)
    timeZone: 'Europe/Madrid',   // Zona IANA del aeropuerto de salida (p. ej. 'Atlantic/Canary', 'America/Bogota')
    label: 'España'              // Texto que se muestra junto a la hora
  },
  destination: { name: 'Auckland', country: 'Nueva Zelanda', timeZone: 'Pacific/Auckland' },
  progress: { startDate: '2026-11-01', startTime: '00:00' }, // inicio de la espera (0 %). Pon aquí el día que compraste el billete
  states: { nearDays: 30 },      // a partir de cuántos días se considera «el viaje se acerca»
  locale: 'es-ES',
  effects: true,                 // false = arranca sin animaciones decorativas
  planeLoopSeconds: 70,          // duración de cada vuelo del avión
  starCount: 70,
  backgroundPhoto: ''            // opcional: 'assets/mi-foto.jpg' (tu propia foto de Auckland)
};
