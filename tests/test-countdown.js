const { zonedToUtc, breakdown, tzOffset, progress, phase } = require('../js/countdown.js'), a = require('assert');
const t = zonedToUtc('2027-06-23', '16:35', 'Europe/Madrid');
a.strictEqual(new Date(t).toISOString(), '2027-06-23T14:35:00.000Z');          // verano: UTC+2
a.strictEqual(new Date(zonedToUtc('2027-12-01', '10:00', 'Europe/Madrid')).toISOString(), '2027-12-01T09:00:00.000Z'); // invierno: UTC+1
a.strictEqual(new Date(zonedToUtc('2027-06-23', '16:35', 'America/New_York')).toISOString(), '2027-06-23T20:35:00.000Z');
a.strictEqual(tzOffset(t, 'Pacific/Auckland') / 36e5, 12);                      // Auckland en junio: UTC+12
a.deepStrictEqual(breakdown((2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000), { done: false, d: 2, h: 3, m: 4, s: 5 });
a.ok(breakdown(0).done && breakdown(-5000).done);
a.strictEqual(progress(0, 100, 50), .5); a.strictEqual(progress(0, 100, -5), 0); a.strictEqual(progress(0, 100, 150), 1); a.strictEqual(progress(100, 50, 40), 0); a.strictEqual(progress(100, 50, 70), 1);
const s0 = zonedToUtc('2026-11-01', '00:00', 'Europe/Madrid');
a.ok(Math.abs(progress(s0, t, (s0 + t) / 2) - .5) < 1e-12);
a.strictEqual(phase(-1, 30), 'arrived'); a.strictEqual(phase(864e5, 30), 'final'); a.strictEqual(phase(864e5 + 1, 30), 'near'); a.strictEqual(phase(31 * 864e5, 30), 'far');
console.log('Progreso ahora mismo: ' + (progress(s0, t, Date.now()) * 100).toFixed(3) + ' %');
console.log('Salida (UTC):', new Date(t).toISOString());
console.log('Salida en Auckland:', new Intl.DateTimeFormat('es-ES', { timeZone: 'Pacific/Auckland', dateStyle: 'full', timeStyle: 'short' }).format(t));
console.log('Todas las comprobaciones OK');
