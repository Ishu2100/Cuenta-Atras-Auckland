/* Lógica pura de fechas y zonas horarias (sin DOM, testeable con Node). */
(function (root) {
  function tzOffset(ts, tz) { // desfase en ms de la zona tz respecto a UTC en el instante ts
    const p = {};
    new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
      .formatToParts(ts).forEach(x => p[x.type] = +x.value);
    return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(ts / 1000) * 1000;
  }
  function zonedToUtc(date, time, tz) { // hora de reloj en una zona -> instante UTC real (ms)
    const [y, m, d] = date.split('-').map(Number), [h, mi] = time.split(':').map(Number);
    const wall = Date.UTC(y, m - 1, d, h, mi);
    let u = wall - tzOffset(wall, tz);
    return wall - tzOffset(u, tz); // segunda pasada: corrige cambios de horario de verano
  }
  function breakdown(ms) {
    if (ms <= 0) return { done: true, d: 0, h: 0, m: 0, s: 0 };
    const t = Math.floor(ms / 1000);
    return { done: false, d: Math.floor(t / 86400), h: Math.floor(t % 86400 / 3600), m: Math.floor(t % 3600 / 60), s: t % 60 };
  }
  function progress(start, end, now) { // fracción 0..1 del tramo inicio -> salida
    if (now >= end) return 1;
    if (end <= start || now <= start) return 0;
    return (now - start) / (end - start);
  }
  function phase(msLeft, nearDays) { // far | near | final (últimas 24 h) | arrived
    if (msLeft <= 0) return 'arrived';
    if (msLeft <= 864e5) return 'final';
    return msLeft <= nearDays * 864e5 ? 'near' : 'far';
  }
  const api = { tzOffset, zonedToUtc, breakdown, progress, phase };
  if (typeof module !== 'undefined') module.exports = api; else root.CountdownCore = api;
})(this);
