/* RIZAL: IN THE MAKING — scroll engine, book, navigation.
   One timeline value (x, in "units") drives everything. Each scene holds for a few scroll beats
   (one unit apart) and hands over to the next scene through an overlapping transition (TRANS units). */
(() => {
"use strict";
const root = document.documentElement;
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]static(?:[=&]|$)/.test(location.search);   // ?static forces the reduced-motion page
const TOUCH = matchMedia('(hover: none) and (pointer: coarse)').matches;
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
if (RM) root.classList.add('rm');
root.classList.add(TOUCH ? 'touch' : 'fine');
const $ = s => document.querySelector(s);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ss = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const SCENES = window.SCENES, IMG = window.IMG || {portrait: null, slots: {}};

/* ---------- timeline ---------- */
const BEAT = 1, TRANS = 1.4, VH_PER_UNIT = 1.55;   // ~60 viewport heights in total
let acc = 0;
const TL = SCENES.map(S => {
  const b = S.cams.length, s0 = acc, e0 = acc + (b - 1) * BEAT;
  acc = e0 + TRANS;
  return {b, s0, e0};
});
const L = TL[TL.length - 1].e0;
const MILES = TL.flatMap(({b, s0}) => Array.from({length: b}, (_, j) => s0 + j * BEAT));

/* ---------- build the scenes ---------- */
const world = $('#world');
const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII'];
const IMGNOTE = 'Photo · from the class research file';
const pin = (at, pat) => `data-at="${at}"${pat ? ` data-pat="${pat}"` : ''}`;
// every discoverable item, in story order: gold markers, quizzes, candles, photos to interact with
const DISC = [];
SCENES.forEach((S, i) => {
  const add = (key, when, title, k) => { DISC.push({id: S.id + ':' + key, scene: i, k, when, title}); return S.id + ':' + key; };
  const sec = document.createElement('section');
  sec.className = 'scene'; sec.id = 's-' + S.id;
  sec.style.setProperty('--bg', S.bg);
  sec.setAttribute('aria-labelledby', 'k' + i);
  const pinsFor = li => S.hs.map((H, hi) => H.l !== li ? '' :
      `<button type="button" class="hs tx" data-k="${H.k}" ${pin(H.at, H.pat)} data-disc="${add('hs' + hi, H.when, H.title, H.k)}" data-fact="${esc(H.fact)}" data-src="${esc(H.src)}"${H.img ? ` data-img="${esc(H.img)}" data-img-alt="${esc(H.imgAlt)}" data-img-credit="${esc(H.imgCredit || IMGNOTE)}"` : ''} aria-label="Discover: ${esc(H.label)}" aria-haspopup="dialog" aria-expanded="false" aria-controls="pop"></button>`).join('')
    + (S.candles && S.candles.l === li ? S.candles.at.map((at, ci) =>
      `<button type="button" class="candle tx" data-k="${S.candles.k}" data-ci="${ci}" ${pin(at)} aria-label="Light a candle for ${esc(S.candles.names[ci])}" aria-pressed="false"></button>`).join('') : '')
    // each name is pinned to its candle (layer ll), so it stays with it at any camera zoom
    + (S.candles && S.candles.ll === li ? S.candles.label.map((at, ci) => `<span class="cname" data-ci="${ci}" ${pin(at, S.candles.lpat[ci])}>${esc(S.candles.names[ci])}</span>`).join('') : '');
  let h = '<div class="sbg"></div>' + S.layers.map((L_, li) => `<div class="layer" data-d="${L_.d}"><svg viewBox="0 0 1600 900" data-pv="${L_.pv}" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">${L_.art}</svg>${pinsFor(li)}</div>`).join('');
  if (S.candles) add('candles', S.candles.when, S.candles.title, S.candles.k);
  if (S.glow) h += '<div class="glow"></div>';
  if (S.media.length) h += `<div class="layer media" data-d=".38">` + S.media.map((M, mi) => {
    const k = `data-k="${M.k}"${M.to ? ` data-to="${M.to}"` : ''}`, cap = `<figcaption>${M.cap}<small>${M.credit || IMGNOTE}</small></figcaption>`;
    const cls = `${M.pos}${M.size === 'sm' ? ' sm' : ''}`;
    const disc = M.title ? ` data-disc="${add('m' + mi, M.when, M.title, M.k)}"` : '';
    if (M.type === 'thennow') return `<figure class="photo thennow tx ${cls}" ${k}${disc}><div class="frame" style="aspect-ratio:${M.ratio}">${M.thenSrc ? `<img class="then-img" src="${M.thenSrc}" alt="${esc(M.thenAlt)}" loading="lazy">` : M.then}<img class="now-img" src="${M.src}" alt="${esc(M.alt)}" loading="lazy"><button type="button" class="image-view-trigger" aria-label="View today's photo"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3"/><path d="m15.5 15.5 5 5"/></svg></button><span class="tag then">${M.thenTag || 'Drawn'}</span><span class="tag now">Today</span><input type="range" min="0" max="100" value="82" aria-label="Compare the drawing with today's photo: slide left to reveal more of the photo"></div>${cap}</figure>`;
    if (M.type === 'develop') return `<figure class="photo develop tx ${cls}" ${k}${disc}><div class="frame"><img src="${M.src}" alt="${esc(M.alt)}" loading="lazy"><button type="button" class="dev-btn">${TOUCH ? 'Tap' : 'Click'} to develop</button></div>${cap}</figure>`;
    return `<figure class="photo tx ${cls}" ${k}><div class="frame"><img src="${M.src}" alt="${esc(M.alt)}" loading="lazy"></div>${cap}</figure>`;
  }).join('') + '</div>';
  const slot = IMG.slots && IMG.slots[S.id];
  if (slot && slot.src && slot.credit) h += `<div class="layer" data-d=".45"><figure class="slot"><img src="${esc(slot.src)}" alt="${esc(slot.alt || '')}"><figcaption>${esc(slot.credit)}</figcaption></figure></div>`;
  else if (slot) console.warn('IMG.slots.' + S.id + ' needs src and credit; not shown.');
  const Q = S.quiz;
  const quiz = Q ? `<div class="quiz tx" data-k="${Q.k}" data-disc="${add('quiz', Q.when, Q.title, Q.k)}" data-answer="${Q.answer}" role="group" aria-label="Question"><p class="qq">${Q.q}</p><div class="qo">${Q.options.map((o, oi) => `<button type="button" data-o="${oi}">${o}</button>`).join('')}</div><p class="qa" aria-live="polite">${Q.imgs ? `<span class="qimgs">${Q.imgs.map(m => `<span class="qimg"><img src="${m.src}" alt="${esc(m.alt)}" loading="lazy"><span>${m.cap}</span></span>`).join('')}</span>` : ''}${Q.explain}${Q.credit ? `<small class="qcredit">${Q.credit}</small>` : ''}</p></div>` : '';
  h += `<div class="layer txt" data-d=".26">`
    + (S.date ? `<p class="bd ${S.dpos} tx" data-k="0"${S.dateTo ? ` data-to="${S.dateTo}"` : ''} aria-hidden="true">${S.date}</p>` : '')
    + `<div class="tb ${S.tpos}"><p class="kick tx" data-k="0" id="k${i}">Chapter ${ROMAN[i]} · ${S.dot}</p>${S.body.includes('<!--quiz-->') ? S.body.replace('<!--quiz-->', quiz) : S.body + quiz}</div>`
    + (S.end || '') + '</div>';
  h += '<div class="shade"></div><p class="label">Pascual • Salameda • Samiano • Santos</p>';
  sec.innerHTML = h;
  world.appendChild(sec);
});
DISC.sort((a, b) => a.scene - b.scene || a.k - b.k);

// portrait plate inside the cover
const P_ = IMG.portrait;
$('#plate').innerHTML = (P_ && P_.src && P_.credit)
  ? `<div class="oval"><img src="${esc(P_.src)}" alt="${esc(P_.alt || 'Portrait of José Rizal')}"></div><p class="cap">${esc(P_.credit)}</p>`
  : `<div class="oval"><svg viewBox="0 0 156 200" aria-hidden="true"><defs><pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="4" stroke="#5b4a3a" stroke-width="1.2"/></pattern></defs><rect width="156" height="200" fill="#e4d9c3"/><path d="M78 40 C100 40 110 58 108 82 C106 106 94 122 78 122 C62 122 50 106 48 82 C46 58 56 40 78 40Z" fill="url(#hatch)" opacity=".55"/><path d="M50 74 C46 46 64 32 80 33 C100 34 112 48 107 74 C104 58 94 50 78 50 C64 50 54 58 50 74Z" fill="#3e3127"/><path d="M14 200 C18 160 40 140 64 132 L78 150 L92 132 C116 140 138 160 142 200Z" fill="#3e3127"/><path d="M64 132 L78 168 L92 132 L78 150Z" fill="#e4d9c3"/></svg></div><p class="cap">Portrait plate · Illustration · artistic impression</p>`;
if (P_ && !(P_.src && P_.credit)) console.warn('IMG.portrait needs src and credit; not shown.');
document.querySelectorAll('img').forEach(image => {
  if (image.closest('#image-viewer')) return;
  image.setAttribute('role', 'button');
  image.tabIndex = 0;
  image.setAttribute('aria-label', `View image: ${image.alt || 'open image'}`);
});

// chapter rail: the book + ten destinations
const rail = $('#rail');
['The book', ...SCENES.map(S => S.dot)].forEach((label, i) => {
  rail.insertAdjacentHTML('beforeend', `<li><button type="button" data-i="${i}" aria-label="${esc(label)}"><span aria-hidden="true">${esc(label)}</span></button></li>`);
});
const dots = [...rail.querySelectorAll('button')];

const parseOrigin = o => o.split(' ').map(parseFloat);
const scenes = [...world.children].map((el, i) => {
  const S = SCENES[i], [ox, oy] = parseOrigin(S.origin);
  return {
    el, S, tl: TL[i], on: false, active: null,
    cams: S.cams.map(c => ({z: c.z ?? 1, x: c.x ?? 0, y: c.y ?? 0, ox: c.ox ?? ox, oy: c.oy ?? oy})),
    art: [...el.querySelectorAll('.layer:not(.txt):not(.media)')].map(l => ({el: l, d: +l.dataset.d})),
    // text and photos keep their place on screen: they move with the scene, not with the camera
    flat: [...el.querySelectorAll('.layer.txt, .layer.media')].map(l => ({el: l, d: +l.dataset.d})),
    txtLayer: el.querySelector('.layer.txt'),
    // each revealed element, the beat it appears at (k) / leaves at (to), and the controls inside it that only work while it is visible
    tx: [...el.querySelectorAll('.tx')].map(e => ({e, k: +e.dataset.k, to: e.dataset.to ? +e.dataset.to : 99, on: null,
      ctl: e.matches('button,input,img') ? [e] : [...e.querySelectorAll('button,input,img')]})),
    quiz: el.querySelector('.quiz'),
    candles: [...el.querySelectorAll('.candle')],
    dev: el.querySelector('.develop'),
    hs: [...el.querySelectorAll('.hs')],
    shade: el.querySelector('.shade'),
    bg: el.querySelector('.sbg'),
    glow: el.querySelector('.glow'),
    route: el.querySelector('#route'),
    moth: el.querySelector('#moth')
  };
});
scenes.forEach((s, i) => { s.el.style.zIndex = 100 - i; s.flat.forEach(l => l.el.style.transformOrigin = s.S.origin); });
const svgs = [...world.querySelectorAll('svg[data-pv]')];

/* ---------- layout & orientation ---------- */
const spacer = $('#spacer'), stage = $('#stage');
let vw = 0, vhRef = 0, unitPx = 1, maxS = 1, isPortrait = null, pw = 360, openScale = 1, K = 1, dirty = true, state = 'landing';

// place each pinned element (gold markers, candles, names) on its art point, in % of its layer box,
// using the same mapping as the SVG's preserveAspectRatio
function placeHotspots() {
  const A = innerWidth / (RM ? innerHeight : stage.clientHeight || innerHeight);
  world.querySelectorAll('[data-at]').forEach(b => {
    const svg = b.parentNode.querySelector('svg');
    const [vx, vy, vbw, vbh] = svg.getAttribute('viewBox').split(' ').map(Number);
    const [x, y] = ((isPortrait && b.dataset.pat) || b.dataset.at).split(',').map(Number);
    const sc = isPortrait ? Math.min(A / vbw, 1 / vbh) : Math.max(A / vbw, 1 / vbh);
    const ox = (A - vbw * sc) / 2, oy = isPortrait ? 0 : 1 - vbh * sc;
    b.style.left = ((ox + (x - vx) * sc) / A * 100).toFixed(2) + '%';
    b.style.top = ((oy + (y - vy) * sc) * 100).toFixed(2) + '%';
  });
}
function layout() {
  vw = innerWidth; vhRef = innerHeight;
  unitPx = VH_PER_UNIT * vhRef;
  maxS = L * unitPx;
  spacer.style.height = (maxS + vhRef + 100) + 'px';   // +100 absorbs mobile toolbar changes
  pw = Math.min(vw * .7, 380, vhRef * .6 / 1.38);
  openScale = Math.min(1, vw * .94 / (2 * pw));
  root.style.setProperty('--pw', pw + 'px');
  K = vw < 700 ? .65 : 1;   // simpler parallax on phones, depth kept
  const p = vw / vhRef < .8;
  if (p !== isPortrait) {
    isPortrait = p; root.classList.toggle('portrait', p);
    svgs.forEach(s => { s.setAttribute('viewBox', p ? s.dataset.pv : '0 0 1600 900'); s.setAttribute('preserveAspectRatio', p ? 'xMidYMin meet' : 'xMidYMax slice'); });
  }
  placeHotspots();
  dirty = true;
}
layout();
addEventListener('resize', () => {
  // ignore mobile address-bar jitter: only re-layout when the width changes or the height changes a lot
  if (innerWidth === vw && Math.abs(innerHeight - vhRef) < 160) return;
  const x = scrollY / unitPx;
  layout();
  if (state === 'journey' && !RM) scrollTo(0, Math.round(x * unitPx));
});

$('#begin').textContent = TOUCH ? 'TAP TO BEGIN' : 'CLICK TO BEGIN';
$('#hint').textContent = TOUCH ? 'SWIPE TO OPEN' : 'SCROLL TO OPEN';
$('#cue span').textContent = TOUCH ? 'Swipe' : 'Scroll';

/* ---------- image viewer ---------- */
const imageViewer = $('#image-viewer');
const imageViewerImage = imageViewer.querySelector('.image-view-stage img');
const imageViewerCaption = $('#image-view-caption');
const zoomOut = imageViewer.querySelector('[data-zoom="-1"]');
const zoomIn = imageViewer.querySelector('[data-zoom="1"]');
let imageViewerOpener = null, imageZoom = 1;
function setImageZoom(value) {
  imageZoom = clamp(value, 1, 4);
  imageViewerImage.style.setProperty('--zoom', imageZoom);
  zoomOut.disabled = imageZoom === 1;
  zoomIn.disabled = imageZoom === 4;
}
function openImageViewer(image, opener = image) {
  imageViewerOpener = opener;
  imageViewerImage.src = image.currentSrc || image.src;
  imageViewerImage.alt = image.alt;
  const figureCaption = image.closest('figure')?.querySelector('figcaption')?.textContent;
  const quizCaption = image.closest('.qimg')?.querySelector('span')?.textContent;
  imageViewerCaption.textContent = (figureCaption || quizCaption || image.alt).trim();
  setImageZoom(1);
  imageViewer.showModal();
  imageViewer.querySelector('.image-view-close').focus();
}
imageViewer.querySelector('.image-view-close').addEventListener('click', () => imageViewer.close());
imageViewer.querySelectorAll('[data-zoom]').forEach(button => {
  button.addEventListener('click', () => {
    setImageZoom(imageZoom + Number(button.dataset.zoom) * .5);
    if (imageZoom === 1) {
      const stage = imageViewer.querySelector('.image-view-stage');
      stage.scrollTo(0, 0);
    }
  });
});
imageViewer.addEventListener('click', e => { if (e.target === imageViewer) imageViewer.close(); });
imageViewer.addEventListener('close', () => {
  if (imageViewerOpener?.isConnected) imageViewerOpener.focus();
  imageViewerOpener = null;
});
document.addEventListener('click', e => {
  const image = e.target.closest('img');
  if (!image || image.closest('#image-viewer')) return;
  if (image.closest('.thennow')) return;
  if (!image.closest('#world')) openImageViewer(image);
});
document.addEventListener('keydown', e => {
  if (e.target.matches('img[role="button"]') && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    openImageViewer(e.target);
  }
});

/* ---------- popover facts ---------- */
const pop = $('#pop'); let popBtn = null;
function openPop(btn) {
  if (popBtn === btn) return closePop(true);
  closePop(false);
  popBtn = btn; btn.setAttribute('aria-expanded', 'true');
  pop.querySelector('p').textContent = btn.dataset.fact;
  pop.querySelector('small').textContent = 'Source: ' + btn.dataset.src + (btn.dataset.img ? ' · Image: ' + btn.dataset.imgCredit : '');
  const im = pop.querySelector('img');
  im.hidden = !btn.dataset.img;
  if (btn.dataset.img) {
    im.src = btn.dataset.img; im.alt = btn.dataset.imgAlt;
    im.setAttribute('aria-label', `View image: ${im.alt || 'open image'}`);
  }
  pop.hidden = false;
  const r = btn.getBoundingClientRect(), pr = pop.getBoundingClientRect();
  let x = r.left + r.width / 2 - pr.width / 2, y = r.bottom + 8;
  if (y + pr.height > innerHeight - 12) y = r.top - pr.height - 8;
  pop.style.left = clamp(x, 16, innerWidth - pr.width - 16) + 'px';
  pop.style.top = clamp(y, 12, innerHeight - pr.height - 12) + 'px';
  pop.focus();
}
function closePop(refocus) {
  if (!popBtn) return;
  pop.hidden = true; popBtn.setAttribute('aria-expanded', 'false');
  if (refocus) popBtn.focus();
  popBtn = null;
}
world.addEventListener('click', e => {
  const viewTrigger = e.target.closest('.image-view-trigger');
  if (viewTrigger) {
    openImageViewer(viewTrigger.closest('.thennow').querySelector('.now-img'), viewTrigger);
    return;
  }
  const image = e.target.closest('img');
  if (image && !image.closest('.thennow')) { openImageViewer(image); return; }
  const b = e.target.closest('.hs'); if (b) { openPop(b); discover(b.dataset.disc); return; }
  const o = e.target.closest('.quiz button'); if (o) return answerQuiz(o.closest('.quiz'), +o.dataset.o, true);
  const c = e.target.closest('.candle'); if (c) return lightCandle(c.closest('.scene'), +c.dataset.ci, true);
  const d = e.target.closest('.dev-btn'); if (d) return developNow(d.closest('.develop'));
  if (e.target.closest('.found-btn')) openDisc();
  if (e.target.closest('.again-btn')) RM ? scrollTo(0, 0) : goBeginning();   // same rewind as the First Page button
});
world.addEventListener('input', e => {
  const f = e.target.closest('.thennow'); if (!f) return;
  f.style.setProperty('--cut', `calc(${e.target.value} * (100% - 34px) / 100 + 17px)`);   // match the slider thumb's centre
  if (+e.target.value < 50) discover(f.dataset.disc);
});
pop.querySelector('button').addEventListener('click', () => closePop(true));
document.addEventListener('pointerdown', e => { if (popBtn && !pop.contains(e.target) && !(e.target.closest && e.target.closest('.hs'))) closePop(false); });

/* ---------- sources ---------- */
const dlg = $('#src');
$('#btn-src').addEventListener('click', () => dlg.showModal());
dlg.querySelector('.x').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

/* ---------- discoveries: what this viewer has found (kept only in this browser) ---------- */
const found = new Set();
try { JSON.parse(localStorage.getItem('rizal-found') || '[]').forEach(id => DISC.some(d => d.id === id) && found.add(id)); } catch (e) { /* storage blocked: start empty */ }
const discDlg = $('#disc');
let forceUntil = 0;   // keeps rendering while a timed effect (the developing photo) runs
function discover(id) {
  if (!id || found.has(id)) return;
  found.add(id);
  try { localStorage.setItem('rizal-found', JSON.stringify([...found])); } catch (e) { /* not saved, still counted */ }
  updateFound(true);
}
function updateFound(pulse) {
  document.querySelectorAll('.found-n').forEach(n => n.textContent = `${found.size} / ${DISC.length}`);
  if (pulse) { const b = $('#btn-disc'); b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); }
}
function openDisc() {
  $('#disc-list').innerHTML = DISC.map(d => `<li class="${found.has(d.id) ? 'got' : ''}"><span class="dw">${d.when}</span><span class="dt">${found.has(d.id) ? d.title : 'Not found yet'}</span><span class="dc">Chapter ${ROMAN[d.scene]} · ${SCENES[d.scene].dot}</span></li>`).join('');
  $('#disc-sum').textContent = found.size === DISC.length ? `You found all ${DISC.length}. Well read.` : `You have found ${found.size} of ${DISC.length}. The rest are waiting in the chapters listed.`;
  discDlg.showModal();
}
$('#btn-disc').addEventListener('click', openDisc);
discDlg.querySelector('.x').addEventListener('click', () => discDlg.close());
discDlg.addEventListener('click', e => { if (e.target === discDlg) discDlg.close(); });
updateFound(false);

// a quiz is answered by the viewer, or revealed for them one beat later so no fact stays locked
function answerQuiz(q, o, user) {
  if (q.classList.contains('done')) return;
  const a = +q.dataset.answer;
  q.classList.add('done', user ? 'user' : 'auto');
  q.querySelectorAll('button').forEach(b => {
    const i = +b.dataset.o;
    b.classList.toggle('right', i === a);
    b.classList.toggle('wrong', user && i === o && o !== a);
    b.setAttribute('aria-pressed', user && i === o ? 'true' : 'false');
  });
  if (user) {
    const qa = q.querySelector('.qa'), at = qa.querySelector('.qimgs');
    (at || qa).insertAdjacentHTML(at ? 'afterend' : 'afterbegin', `<b class="verdict">${o === a ? 'Yes. ' : 'Not quite. '}</b>`);
    discover(q.dataset.disc);
  }
}
function lightCandle(sec, ci, user) {
  const b = sec.querySelector(`.candle[data-ci="${ci}"]`);
  if (!b || b.classList.contains('lit')) return;
  b.classList.add('lit'); b.setAttribute('aria-pressed', 'true');
  sec.querySelector('#cf' + ci).classList.add('lit');
  sec.querySelector(`.cname[data-ci="${ci}"]`).classList.add('lit');
  if (user && sec.querySelectorAll('.candle.lit').length === 3) discover(sec.id.slice(2) + ':candles');
}
function developNow(fig) {
  if (fig.dataset.t0) return;
  fig.dataset.t0 = performance.now();
  forceUntil = performance.now() + 2400;
  dirty = true;
  discover(fig.dataset.disc);
}

/* ---------- reduced motion: static page, done ---------- */
if (RM) {
  scenes.forEach(s => { if (s.route) s.route.setAttribute('stroke-dashoffset', '0'); s.candles.forEach((c, ci) => lightCandle(s.el, ci, false)); });
  root.classList.remove('lock');
  document.body.dataset.state = 'journey';
  $('#btn-begin').addEventListener('click', () => scrollTo(0, 0));
  dots.forEach(b => b.addEventListener('click', () => { const i = +b.dataset.i; (i ? scenes[i - 1].el : $('#rmhead')).scrollIntoView(); }));
  return;
}

/* ---------- dust ---------- */
const dust = $('#dust');
for (let i = 0; i < (vw < 700 ? 10 : 22); i++) {
  const d = document.createElement('i');
  d.style.left = (i * 47 % 100) + '%'; d.style.top = (40 + i * 29 % 60) + '%';
  d.style.setProperty('--dx', ((i % 5) - 2) * 3 + 'vw');
  d.style.animationDuration = (14 + i % 7 * 3) + 's'; d.style.animationDelay = -(i * 1.7) + 's';
  dust.appendChild(d);
}

/* ---------- state ---------- */
let bookT = 0, bookTarget = 0, bookK = .16, bookDir = 1, bookTimer = 0, tween = null;
let Xs = 0, lastInput = 'wheel', touching = false;
let gliding = false, glideY = 0, glideCur = 0, rewind = null;
let settleTimer = 0, gStartY = 0, gStartT = 0, gLastT = 0, lastY = 0, dir = 1;
let topSince = 0, lastWheelT = 0, lastActivity = performance.now();
let mx = 0, my = 0, tmx = 0, tmy = 0;
let gx = innerWidth / 2, gy = innerHeight * .6, tgx = gx, tgy = gy;
const intro = $('#intro'), landing = $('#landing'), bookwrap = $('#bookwrap'), hint = $('#hint'), cue = $('#cue');
const cover = $('#cover'), book = $('#book'), dive = $('#dive'), backdrop = $('#backdrop');
const progress = $('#progress');

function setState(s) {
  state = s;
  document.body.dataset.state = s;
  root.classList.toggle('lock', s !== 'journey');
  intro.classList.toggle('off', s === 'journey');
  dirty = true;
}
function begin() {
  if (state !== 'landing') return;
  setState('book');
  landing.classList.add('gone');
  bookwrap.classList.add('risen');
  setTimeout(() => { if (!hint.classList.contains('done')) hint.classList.add('show'); }, 1500);
}
$('#begin').addEventListener('click', begin);
landing.addEventListener('click', begin);

function unlock() {
  bookT = bookTarget = 1; tween = null;
  setState('journey');
  scrollTo(0, 0); Xs = 0;
  topSince = lastWheelT = performance.now();
  world.style.transform = '';
}
function relock(target = .985, k = .16) {
  cancelGlide(); rewind = null; closePop(false);
  setState('book');
  scrollTo(0, 0); Xs = 0;
  bookT = 1; bookTarget = target; bookK = k;
  hint.classList.add('done');
  renderScenes();
}
// timed book animation (used by the Beginning sequence); any book input takes over from it
function tweenBook(to, dur, done) { tween = {from: bookT, to, t0: performance.now(), dur, done}; }

/* Beginning: rewind the camera through every scene, sink into page one, then close the cover */
function goBeginning() {
  closePop(false); cancelGlide();
  if (state === 'book') { tweenBook(0, 1400, reshowHint); return; }
  if (state !== 'journey' || rewind) return;
  const y0 = scrollY;
  if (y0 < 2) return closeBook();
  rewind = {y0, t0: performance.now(), dur: 900 + 2600 * Math.sqrt(y0 / maxS)};
}
function closeBook() {
  relock(1);
  tweenBook(.6, 1100, () => tweenBook(0, 1400, reshowHint));
}
function reshowHint() { hint.classList.remove('done'); hint.classList.add('show'); }
function stopRewind() {
  if (!rewind) return;
  rewind = null;
  clearTimeout(settleTimer); settleTimer = setTimeout(settle, 220);
}
$('#btn-begin').addEventListener('click', goBeginning);
dots.forEach(b => b.addEventListener('click', () => {
  const i = +b.dataset.i;
  if (i === 0) goBeginning();
  else { stopRewind(); glideTo(scenes[i - 1].tl.s0 * unitPx); }
}));

/* book input */
function bookInput(delta) {
  hint.classList.add('done');
  if (tween) { tween = null; bookTarget = bookT; }
  bookK = .16;
  bookTarget = clamp(bookTarget + delta);
  if (delta) bookDir = Math.sign(delta);
  clearTimeout(bookTimer);
  bookTimer = setTimeout(bookSettle, lastInput === 'touch' ? 260 : 200);
}
function bookSettle() {
  if (state !== 'book' || touching || tween) return;
  const stops = [0, .6, 1], biased = bookTarget + bookDir * .12;
  const stop = stops.reduce((a, b) => Math.abs(b - biased) < Math.abs(a - biased) ? b : a);
  if (Math.abs(stop - bookTarget) > .005) { bookTarget = stop; bookK = .07; }
}

/* ---------- milestone choice (pure, self-checked below) ---------- */
// returns the beat index to glide to, or -1 when the view already rests on a beat
function pickMilestone(x, fast, d, M = MILES) {
  let n = 0;
  M.forEach((m, i) => { if (Math.abs(m - x) < Math.abs(M[n] - x)) n = i; });
  if (Math.abs(M[n] - x) <= .18) return -1;
  if (!fast) return n;
  if (d > 0) { const i = M.findIndex(m => m > x); return i < 0 ? M.length - 1 : i; }
  for (let i = M.length - 1; i >= 0; i--) if (M[i] < x) return i;
  return 0;
}
{ const M = [0, 1, 2, 3.4, 4.4];
  console.assert(pickMilestone(0, true, 1, M) === -1, 'resting on a beat');
  console.assert(pickMilestone(1.1, true, 1, M) === -1, 'close enough to a beat');
  console.assert(pickMilestone(1.4, false, 1, M) === 1, 'slow -> nearest');
  console.assert(pickMilestone(1.4, true, 1, M) === 2, 'fast forward -> next');
  console.assert(pickMilestone(2.7, true, -1, M) === 2, 'fast back -> previous');
  console.assert(pickMilestone(2.7, false, 1, M) === 3, 'slow in a transition -> nearest beat');
  console.assert(pickMilestone(4.9, true, 1, M) === 4, 'clamped at end'); }

function glideTo(y) {
  glideY = clamp(Math.round(y), 0, maxS);
  glideCur = scrollY; gliding = true;
}
function cancelGlide() { gliding = false; }
function settle() {
  if (state !== 'journey' || touching || gliding || rewind) return;
  const y = scrollY, x = clamp(y / unitPx, 0, L);
  const speed = Math.abs(y - gStartY) / Math.max(60, gLastT - gStartT + 50);   // px per ms over this gesture
  const fast = speed > unitPx / 700;
  gStartY = y; gStartT = 0;
  const n = pickMilestone(x, fast, dir);
  if (n >= 0) glideTo(MILES[n] * unitPx);
}
function stepBeat(d) {
  const x = (gliding ? glideY : scrollY) / unitPx;
  let n = 0;
  MILES.forEach((m, i) => { if (Math.abs(m - x) < Math.abs(MILES[n] - x)) n = i; });
  if (d > 0 && MILES[n] <= x + .25) n++;
  if (d < 0 && MILES[n] >= x - .25) n--;
  glideTo(MILES[clamp(n, 0, MILES.length - 1)] * unitPx);
}

/* ---------- input ---------- */
function activity() { lastActivity = performance.now(); cue.classList.remove('show'); }
addEventListener('wheel', e => {
  lastInput = 'wheel'; activity();
  const now = performance.now();
  const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1);
  if (state === 'landing') { e.preventDefault(); lastWheelT = now; return; }
  if (state === 'book') { e.preventDefault(); bookInput(dy / (innerHeight * 2.2)); lastWheelT = now; return; }
  cancelGlide(); stopRewind();
  // re-lock only on a fresh upward gesture after resting at the top (trackpad momentum can't trigger it)
  if (dy < 0 && scrollY <= 0 && Xs < .01 && topSince && now - topSince > 450 && now - lastWheelT > 250) {
    e.preventDefault(); relock();
  }
  lastWheelT = now;
}, {passive: false});

let ty0 = 0, tyLast = 0, touchTopReady = false;
addEventListener('touchstart', e => {
  lastInput = 'touch'; touching = true; cancelGlide(); stopRewind(); activity();
  ty0 = tyLast = e.touches[0].clientY;
  touchTopReady = state === 'journey' && scrollY <= 0 && Xs < .01 && topSince && performance.now() - topSince > 450;
}, {passive: true});
addEventListener('touchmove', e => {
  const y = e.touches[0].clientY;
  if (state !== 'journey') {
    e.preventDefault();
    if (state === 'book') bookInput((tyLast - y) / (innerHeight * 1.5));
  } else if (touchTopReady && y - ty0 > 28) {
    e.preventDefault(); touchTopReady = false; relock();
  }
  tyLast = y;
}, {passive: false});
addEventListener('touchend', () => {
  touching = false;
  if (state === 'book') { clearTimeout(bookTimer); bookTimer = setTimeout(bookSettle, 260); }
  if (state === 'journey') { clearTimeout(settleTimer); settleTimer = setTimeout(settle, 260); }
}, {passive: true});

addEventListener('keydown', e => {
  if (dlg.open || discDlg.open) return;
  activity();
  if (e.key === 'Escape') { closePop(true); return; }
  if (e.target.matches && e.target.matches('input')) return;   // the then/now slider uses the arrow keys itself
  const k = e.key, onCtrl = e.target.closest && e.target.closest('button,a,input,textarea,select');
  if (state === 'landing') {
    if (k === 'Enter' || k === ' ') { e.preventDefault(); begin(); }
    return;
  }
  const fwd = ['ArrowDown', 'PageDown', 'ArrowRight'].includes(k) || (k === ' ' && !e.shiftKey && !onCtrl);
  const back = ['ArrowUp', 'PageUp', 'ArrowLeft'].includes(k) || (k === ' ' && e.shiftKey && !onCtrl);
  lastInput = 'key';
  if (state === 'book') {
    const step = k.startsWith('Page') || k === ' ' ? .2 : .07;
    if (fwd) { e.preventDefault(); bookInput(step); }
    else if (back) { e.preventDefault(); bookInput(-step); }
    else if (k === 'Home') { e.preventDefault(); bookInput(-1); }
    else if (k === 'End') { e.preventDefault(); bookInput(1); }
    return;
  }
  if (!fwd && !back && k !== 'Home' && k !== 'End') return;
  e.preventDefault(); stopRewind();
  if (k === 'Home') return glideTo(0);
  if (k === 'End') return glideTo(maxS);
  if (back && scrollY <= 2 && Xs < .01) return relock(.9);
  stepBeat(fwd ? 1 : -1);
});

addEventListener('scroll', () => {
  if (state !== 'journey') { if (scrollY) scrollTo(0, 0); return; }
  const now = performance.now(), y = scrollY;
  if (y !== lastY) dir = Math.sign(y - lastY);
  lastY = y;
  if (!gStartT) { gStartT = now; gStartY = y; }
  gLastT = now;
  if (y <= 0) { if (!topSince) topSince = now; } else topSince = 0;
  if (!gliding && !rewind) { activity(); clearTimeout(settleTimer); settleTimer = setTimeout(settle, lastInput === 'touch' ? 260 : 170); }
}, {passive: true});

if (FINE) addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse') return;
  tmx = e.clientX / innerWidth * 2 - 1; tmy = e.clientY / innerHeight * 2 - 1;
  tgx = e.clientX; tgy = e.clientY;
}, {passive: true});
addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { tgx = e.clientX; tgy = e.clientY; } }, {passive: true});
addEventListener('pointermove', e => { if (e.pointerType === 'touch') { tgx = e.clientX; tgy = e.clientY; } }, {passive: true});

/* ---------- render ---------- */
function camAt(s, k) {
  const j = Math.min(Math.floor(k), s.cams.length - 1), f = k - j;
  const a = s.cams[j], b = s.cams[Math.min(j + 1, s.cams.length - 1)];
  const e = .5 * f + .5 * f * f * (3 - 2 * f);   // eases into each beat without stalling between them
  return {z: lerp(a.z, b.z, e), x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e), ox: lerp(a.ox, b.ox, e), oy: lerp(a.oy, b.oy, e)};
}
function renderScenes() {
  const vwScale = vw / 1440, x = Xs;
  scenes.forEach(s => {
    const {s0, e0, b} = s.tl;
    const u = x < s0 ? (x - s0) / TRANS : x > e0 ? (x - e0) / TRANS : 0;   // -1 arriving … 0 holding … 1 gone
    const k = clamp((x - s0) / BEAT, 0, b - 1);                              // beat progress while holding
    const op = ss(-.85, -.3, u) * (1 - ss(.3, .85, u));
    if (op <= .001) {
      if (s.on) { s.el.style.display = 'none'; s.on = false; }
      s.tx.forEach(t => setOn(t, false));
      return;
    }
    if (!s.on) { s.el.style.display = 'block'; s.on = true; }
    s.el.style.opacity = op.toFixed(3);
    const [px, py] = s.S.pan, rot = s.S.rot || 0, c = camAt(s, k), origin = `${c.ox.toFixed(2)}% ${c.oy.toFixed(2)}%`;
    s.art.forEach(l => {
      const d = l.d * K, f = .35 + .65 * l.d;
      const sc = Math.exp(u * (.22 + 1.1 * d)) * (1 + (c.z - 1) * f);
      const tx = px * u * vwScale + mx * d * 18 + c.x * vw * f;
      const ty = (py * u - u * d * 70) * vwScale + my * d * 10 + c.y * vhRef * f;
      l.el.style.transformOrigin = origin;
      l.el.style.transform = `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) scale(${sc.toFixed(4)}) rotate(${(u * rot * l.d).toFixed(2)}deg)`;
      l.el.style.opacity = u > 0 ? (1 - ss(.22, .8 - .35 * l.d, u)).toFixed(3) : 1;
    });
    s.flat.forEach(l => {
      const d = l.d * K;
      l.el.style.transform = `translate3d(${(px * u * vwScale).toFixed(1)}px,${((py * u - u * d * 70) * vwScale).toFixed(1)}px,0) scale(${Math.exp(u * (.22 + 1.1 * d)).toFixed(4)})`;
    });
    s.bg.style.opacity = u > 0 ? (1 - ss(.15, .55, u)).toFixed(3) : 1;   // a receding scene stops hiding the one behind it
    s.shade.style.opacity = (ss(.25, 1, Math.abs(u)) * .6).toFixed(3);
    s.tx.forEach(t => {
      const v = (t.k === 0 ? ss(-.45, -.15, u) : ss(t.k - .7, t.k - .2, k)) * (1 - ss(t.to - .7, t.to - .2, k)) * (1 - ss(.12, .4, u));
      t.e.style.opacity = v.toFixed(3);
      t.e.style.transform = v < 1 ? `translateY(${((1 - v) * (u > 0 ? -22 : 22)).toFixed(1)}px)` : '';
      setOn(t, v > .6 && op > .55);
    });
    if (s.quiz && (k >= +s.quiz.dataset.k + 1 || u > 0)) answerQuiz(s.quiz, +s.quiz.dataset.answer, false);   // revealed one beat later, or as the scene is left
    if (s.candles.length && k >= b - 1) s.candles.forEach((c, ci) => lightCandle(s.el, ci, false));
    if (s.dev) {
      const kd = +s.dev.dataset.k, t0 = +s.dev.dataset.t0 || 0;
      s.dev.style.setProperty('--dev', Math.max(ss(kd - .2, kd + 1, k), t0 ? clamp((performance.now() - t0) / 2200) : 0).toFixed(3));
    }
    if (s.route) s.route.setAttribute('stroke-dashoffset', (1 - (ss(.15, 1, k) * .42 + ss(1.15, 2, k) * .58)).toFixed(4));
    if (s.moth) {
      const q = (x - (s0 - TRANS)) / (e0 - s0 + 2 * TRANS), th = q * 26, r = lerp(430, 70, ss(0, .62, q));
      s.moth.setAttribute('transform', `translate(${(800 + Math.cos(th) * r).toFixed(1)} ${(548 + Math.sin(th) * r * .55).toFixed(1)}) rotate(${(Math.cos(th) * 30).toFixed(1)})`);
    }
    if (s.glow) { s.el.style.setProperty('--gx', gx.toFixed(0) + 'px'); s.el.style.setProperty('--gy', gy.toFixed(0) + 'px'); }
  });
}
// controls inside a line, photo or marker work only while it is clearly visible
function setOn(t, on) {
  if (t.on === on) return;
  t.on = on;
  t.ctl.forEach(c => { c.tabIndex = on ? 0 : -1; c.style.pointerEvents = on ? 'auto' : 'none'; });
  if (!on && popBtn && t.ctl.includes(popBtn)) closePop(false);
}
function renderBook() {
  const o = ss(0, .6, bookT), d = clamp((bookT - .6) / .4), e = d * d * (3 - 2 * d);
  cover.style.transform = `rotateY(${(-178 * o).toFixed(2)}deg)`;
  const sc = lerp(1, openScale, o);
  book.style.transform = `translateX(${(-25 * (1 - o)).toFixed(2)}%) rotateX(${(20 * (1 - o)).toFixed(2)}deg) rotateY(${(-9 * (1 - o)).toFixed(2)}deg) rotateZ(${(-3 * (1 - o)).toFixed(2)}deg) scale(${sc.toFixed(4)})`;
  dive.style.transformOrigin = `${50 + 25 * sc}% ${50 - 12 * sc}%`;
  dive.style.transform = `translate(${(-25 * sc * e).toFixed(2)}%,${(12 * sc * e).toFixed(2)}%) scale(${(1 + 9 * Math.pow(d, 2.2)).toFixed(4)})`;
  dive.style.opacity = (1 - ss(.8, .98, bookT)).toFixed(3);
  backdrop.style.opacity = (1 - ss(.62, .92, bookT)).toFixed(3);
  world.style.transform = `scale(${(.84 + .16 * ss(.6, 1, bookT)).toFixed(4)})`;
}

let lastXs = -1, lastBook = -1, lastDot = -1, lastT = performance.now();
function frame(now) {
  const dt = Math.min(64, now - lastT); lastT = now;
  const kf = n => 1 - Math.pow(1 - n, dt / 16.67);   // frame-rate independent smoothing (60 Hz and 120 Hz feel the same)
  if (rewind) {
    const p = clamp((now - rewind.t0) / rewind.dur);
    scrollTo(0, Math.round(rewind.y0 * (1 - easeInOut(p))));
    if (p >= 1) { rewind = null; closeBook(); }
  } else if (gliding) {
    glideCur += (glideY - glideCur) * kf(.075);
    if (Math.abs(glideY - glideCur) < .75) { glideCur = glideY; gliding = false; }
    scrollTo(0, Math.round(glideCur));
  }
  if (state === 'journey') {
    const x = clamp(scrollY / unitPx, 0, L);
    Xs = rewind ? x : Xs + (x - Xs) * kf(.16);
    if (Math.abs(x - Xs) < 1e-4) Xs = x;
  } else {
    Xs = 0;
    if (tween) {
      const p = clamp((now - tween.t0) / tween.dur);
      bookT = bookTarget = lerp(tween.from, tween.to, easeInOut(p));
      if (p >= 1) { const t = tween; tween = null; t.done && t.done(); }
    } else {
      bookT += (bookTarget - bookT) * kf(bookK);
      if (Math.abs(bookTarget - bookT) < .0004) bookT = bookTarget;
    }
    if (state === 'book' && !tween && bookTarget >= 1 && bookT > .996) unlock();
  }
  mx += (tmx - mx) * kf(.06); my += (tmy - my) * kf(.06);
  gx += (tgx - gx) * kf(.12); gy += (tgy - gy) * kf(.12);
  const moving = Math.abs(tmx - mx) > .001 || Math.abs(tmy - my) > .001 || Math.abs(tgx - gx) > .5 || Math.abs(tgy - gy) > .5;
  if (dirty || moving || Xs !== lastXs || now < forceUntil) { renderScenes(); lastXs = Xs; }
  if (state !== 'journey' && (dirty || bookT !== lastBook)) { renderBook(); lastBook = bookT; }
  dirty = false;
  if (state === 'journey') {
    progress.style.transform = `scaleX(${(Xs / L).toFixed(4)})`;
    let a = 1;
    TL.forEach((t, i) => { if (Xs >= t.s0 - TRANS / 2) a = i + 1; });
    if (a !== lastDot) {
      dots.forEach((b, i) => i === a ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current'));
      lastDot = a;
    }
    // a quiet nudge when the viewer has stopped for a while and there is more to see
    if (!gliding && !rewind && !touching && now - lastActivity > 3500 && Xs < L - .05) cue.classList.add('show');
  } else lastDot = -1;
  requestAnimationFrame(frame);
}
window.__rizal = () => ({state, bookT, bookTarget, Xs, L, unitPx, scrollY, maxS, gliding, rewinding: !!rewind, MILES});   // inspection hook for testing
history.scrollRestoration = 'manual';
scrollTo(0, 0);
setState('landing');
requestAnimationFrame(frame);
})();
