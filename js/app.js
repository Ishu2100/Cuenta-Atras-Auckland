(() => {
  const C = window.COUNTDOWN_CONFIG, { zonedToUtc, breakdown, tzOffset, progress, phase } = window.CountdownCore;
  const $ = s => document.querySelector(s), body = document.body, dep = C.departure;
  const target = zonedToUtc(dep.date, dep.time, dep.timeZone);
  const fmt = (tz, o) => new Intl.DateTimeFormat(C.locale, { timeZone: tz, ...o });

  // --- Tarjetas de información (todo calculado, nada inventado) ---
  $('#depDate').textContent = fmt(dep.timeZone, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(target);
  $('#depTime').textContent = dep.time; $('#depLabel').textContent = dep.label;
  $('#depNz').textContent = fmt(C.destination.timeZone, { weekday: 'long', hour: '2-digit', minute: '2-digit' }).format(target);
  const nzFmt = fmt(C.destination.timeZone, { hour: '2-digit', minute: '2-digit' });
  function zoneInfo(now) {
    $('#nzNow').textContent = nzFmt.format(now);
    const h = (tzOffset(now, C.destination.timeZone) - tzOffset(now, dep.timeZone)) / 36e5;
    $('#nzDiff').textContent = (h > 0 ? '+' : '') + h + ' h respecto a ' + dep.label;
  }

  // --- Estado, progreso y contador ---
  const startMs = zonedToUtc(C.progress.startDate, C.progress.startTime, dep.timeZone);
  const nf = new Intl.NumberFormat(C.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const el = { d: $('#d'), h: $('#h'), m: $('#m'), s: $('#s') }, jn = $('#journey'), bar = $('#bar');
  const span = ms => { const b = breakdown(ms); return `${b.d} d ${b.h} h ${b.m} min`; };
  $('#startDate').textContent = fmt(dep.timeZone, { day: 'numeric', month: 'short', year: 'numeric' }).format(startMs);
  let state = '', ready = false;
  setTimeout(() => { ready = true; jn.classList.add('live'); }, 2700); // tras la entrada del avión, avanza en continuo
  function put(k, v) {
    const t = String(v).padStart(2, '0');
    if (el[k].textContent === t) return;
    el[k].textContent = t;
    if (!body.classList.contains('calm')) el[k].animate([{ transform: 'translateY(-22%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }
  function render() {
    const n = Date.now(), left = target - n, b = breakdown(left), p = progress(startMs, target, n), s = phase(left, C.states.nearDays), first = !state;
    zoneInfo(n);
    if (!b.done) { put('d', b.d); put('h', b.h); put('m', b.m); put('s', b.s); }
    if (ready || first) jn.style.setProperty('--p', p.toFixed(6));
    $('#pctLine').textContent = p >= 1 ? '100 % del camino completado: ¡toca despegar!' : `Ya llevamos un ${nf.format(p * 100)} % del camino hacia Auckland`;
    bar.setAttribute('aria-valuenow', (p * 100).toFixed(1));
    $('#elapsed').textContent = span(n - startMs); $('#remaining').textContent = span(left);
    if (s !== state) enter(s, first);
    if (s !== 'arrived') setTimeout(render, 1000 - (n % 1000) + 5); // alineado con el cambio de segundo
  }
  function enter(s, first) {
    state = s; body.dataset.state = s; $('#last24').hidden = s !== 'final';
    if (s === 'arrived') celebrate(first);
  }
  function celebrate(first) { // contador a cero: transformación suave + despegue
    $('#eyebrow').textContent = 'Ha llegado el gran día'; $('#quote').textContent = 'Your adventure begins now.';
    const clk = $('#clock'), show = () => { clk.hidden = true; $('#arrived').hidden = false; };
    if (first) show(); else { clk.classList.add('out'); setTimeout(show, 900); }
    body.classList.add('takeoff');
    setTimeout(() => on && sparks(), first ? 1700 : 300);
  }
  function sparks() {
    const r = $('.pt.b').getBoundingClientRect(), box = document.createElement('div');
    box.className = 'sparks'; box.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px`;
    for (let i = 0; i < 40; i++) {
      const s = document.createElement('i'), a = -Math.random() * Math.PI, d = 60 + Math.random() * 240;
      s.style.cssText = `--x:${Math.cos(a) * d | 0}px;--y:${Math.sin(a) * d | 0}px;--t:${(1.6 + Math.random() * 1.6).toFixed(1)}s;--l:${(Math.random() * .6).toFixed(2)}s`;
      box.appendChild(s);
    }
    body.appendChild(box); setTimeout(() => box.remove(), 4200);
  }

  // --- Estrellas ---
  const fr = document.createDocumentFragment();
  for (let i = 0; i < C.starCount; i++) {
    const s = document.createElement('i'), z = (Math.random() * 1.8 + .6).toFixed(1) + 'px';
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--z:${z};--o:${(Math.random() * .6 + .3).toFixed(2)};--d:${(Math.random() * 4 + 3).toFixed(1)}s;--l:-${(Math.random() * 6).toFixed(1)}s`;
    fr.appendChild(s);
  }
  $('#stars').appendChild(fr);
  if (C.backgroundPhoto) { const im = new Image(); im.onload = () => { $('#photo').style.backgroundImage = `url("${C.backgroundPhoto}")`; $('#photo').classList.add('on'); }; im.src = C.backgroundPhoto; }

  // --- Efectos (el avión ya no vuela solo: su posición es el progreso real) ---
  const fx = $('#fx'), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let on = C.effects && !reduce;
  function setFx(v) { on = v; body.classList.toggle('calm', !v); fx.setAttribute('aria-pressed', v); fx.textContent = v ? 'Efectos activados' : 'Efectos desactivados'; }
  fx.addEventListener('click', () => setFx(!on)); setFx(on);

  // --- Paralaje suave con el puntero (solo si hay efectos) ---
  addEventListener('pointermove', e => {
    if (!on) return;
    const st = $('#stage').style; st.setProperty('--px', (e.clientX / innerWidth - .5).toFixed(3)); st.setProperty('--py', (e.clientY / innerHeight - .5).toFixed(3));
  }, { passive: true });
  render();
})();
