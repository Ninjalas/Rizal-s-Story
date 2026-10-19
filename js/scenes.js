/* Scene art (illustration, generated in code), the text of each destination, and its discoveries.
   Order is strictly chronological. Facts come from the class docx, the class PDF, and the sources listed in The Archive. */
window.SCENES = (() => {
"use strict";
/* ---------- art helpers (all illustration, generated in code) ---------- */
function palm(x, y, h, lean, col = '#060709') {
  const tx = x + lean, ty = y - h, w = h * 0.045;
  let s = `<path d="M${x} ${y} Q${x + lean * 0.1} ${y - h * 0.55} ${tx} ${ty}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  [-172, -145, -118, -88, -60, -30, -6, 18].forEach((a, i) => {
    const r = a * Math.PI / 180, L = h * (0.4 + (i * 37 % 5) * 0.035);
    const ex = tx + Math.cos(r) * L, ey = ty + Math.sin(r) * L * 0.3 + L * 0.42;
    const cx = tx + Math.cos(r) * L * 0.55, cy = ty + Math.sin(r) * L * 0.55 - L * 0.1;
    const d = `M${tx} ${ty} Q${cx} ${cy} ${ex} ${ey}`;
    s += `<path d="${d}" stroke="${col}" stroke-width="${w * 0.55}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${col}" stroke-width="${w * 2.4}" stroke-dasharray="2.2 ${w * 0.45}" fill="none"/>`;
  });
  return s;
}
function grass(x0, x1, y, h, col, n = 60) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + (x1 - x0) * i / n + (i * 53 % 17), hh = h * (0.5 + (i * 29 % 10) / 20), b = ((i * 13 % 9) - 4) * 3;
    s += `M${x} ${y} q${b / 2} ${-hh / 2} ${b} ${-hh} `;
  }
  return `<path d="${s}" stroke="${col}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
}
function flame(x, y, s, cls = 'fl', delay = 0) {
  return `<g class="${cls}" style="animation-delay:${delay}s"><path d="M${x} ${y - 40 * s} C${x - 13 * s} ${y - 16 * s} ${x - 10 * s} ${y} ${x} ${y} C${x + 10 * s} ${y} ${x + 13 * s} ${y - 16 * s} ${x} ${y - 40 * s}Z" fill="#f2cf86"/><path d="M${x} ${y - 24 * s} C${x - 5 * s} ${y - 10 * s} ${x - 4 * s} ${y} ${x} ${y} C${x + 4 * s} ${y} ${x + 5 * s} ${y - 10 * s} ${x} ${y - 24 * s}Z" fill="#fff4dc"/></g>`;
}
// gradients are defined per SVG (p = id prefix) so a hidden scene never breaks another scene's fills
const candleDefs = p => `<defs><radialGradient id="${p}halo"><stop offset="0" stop-color="#f3d48e" stop-opacity=".38"/><stop offset="1" stop-color="#f3d48e" stop-opacity="0"/></radialGradient><linearGradient id="${p}wax" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8c8579"/><stop offset=".45" stop-color="#e2d9c8"/><stop offset="1" stop-color="#6e685e"/></linearGradient></defs>`;
function candle(x, base, h, w, delay, p, litId) {
  const f = `<circle cx="${x}" cy="${base - h - 20}" r="${w * 4}" fill="url(#${p}halo)"/>${flame(x, base - h - 6, w / 24, 'fl', delay)}`;
  return `<rect x="${x - w / 2}" y="${base - h}" width="${w}" height="${h}" fill="url(#${p}wax)"/>
  <path d="M${x - w / 2} ${base - h + 4} q${w * .2} 18 ${w * .05} 30 M${x + w * .3} ${base - h + 2} q-${w * .1} 12 0 22" stroke="#efe6d6" stroke-width="3" fill="none" opacity=".7"/>
  <line x1="${x}" y1="${base - h}" x2="${x}" y2="${base - h - 8}" stroke="#2a2420" stroke-width="2"/>
  ${litId ? `<g class="cf" id="${litId}">${f}</g>` : f}`;
}
function capiz(x, y, w, h, cols, rows, op) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#e8cf9c" opacity="${op}"/>`;
  for (let i = 1; i < cols; i++) s += `<line x1="${x + w * i / cols}" y1="${y}" x2="${x + w * i / cols}" y2="${y + h}" stroke="#1a120d" stroke-width="5"/>`;
  for (let j = 1; j < rows; j++) s += `<line x1="${x}" y1="${y + h * j / rows}" x2="${x + w}" y2="${y + h * j / rows}" stroke="#1a120d" stroke-width="5"/>`;
  return s + `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#1a120d" stroke-width="12"/>`;
}
function stars(n, x0, x1, y1, seed = 1) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + ((i * 7919 * seed) % 1000) / 1000 * (x1 - x0), y = ((i * 104729 * seed) % 1000) / 1000 * y1;
    s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(i % 3) * .5 + .8}" fill="#F0EADF" opacity="${.25 + (i % 4) * .12}"/>`;
  }
  return s;
}
function figure(x, y, h, col) { // simple standing silhouette
  const r = h * .12;
  return `<circle cx="${x}" cy="${y - h + r}" r="${r}" fill="${col}"/><path d="M${x - h * .16} ${y} L${x - h * .13} ${y - h * .72} Q${x} ${y - h * .8} ${x + h * .13} ${y - h * .72} L${x + h * .16} ${y}Z" fill="${col}"/>`;
}
function arches(x, y, n, w, h, fill) {
  let s = '';
  for (let i = 0; i < n; i++) { const ax = x + i * w; s += `<path d="M${ax + w * .15} ${y} V${y - h + w * .35} A${w * .35} ${w * .35} 0 0 1 ${ax + w * .85} ${y - h + w * .35} V${y}Z" fill="${fill}"/>`; }
  return s;
}
const GUT = 'Photo: Rizal’s Own Story of His Life (1918) · public domain · Project Gutenberg';
const CC = (who, lic) => `Photo: ${who} · ${lic} · Wikimedia Commons`;
const RIDGE = 'M0 612 C150 602 260 562 360 502 C430 457 500 407 560 392 C620 382 660 402 720 442 C800 492 880 562 980 592 C1120 602 1300 592 1600 602 V900 H0Z';

/* map geography (stylised, not to scale) */
const LAKE = 'M700 430 C760 400 860 392 950 410 C1050 380 1180 400 1260 450 C1320 500 1300 580 1250 640 C1210 690 1150 720 1100 700 C1060 650 1040 600 1000 600 C970 640 990 700 960 730 C900 762 820 744 760 704 C700 660 660 560 700 430Z';
const BAY = 'M0 100 C200 130 330 200 382 296 C420 380 362 470 300 560 C250 640 210 760 160 900 L0 900Z';

/* "then" drawings for the then/now sliders (illustration, not a record of what the buildings looked like) */
const HOUSE_THEN = `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="hts" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2228"/><stop offset=".7" stop-color="#8a5c40"/><stop offset="1" stop-color="#c79a62"/></linearGradient></defs><rect width="400" height="300" fill="url(#hts)"/><rect y="250" width="400" height="50" fill="#2a2420"/>${palm(28, 255, 150, 12, '#1a1512')}<path d="M24 102 H376 L326 52 H74Z" fill="#6b2f22"/>${Array.from({length:9}, (_, i) => `<line x1="${84 + i * 30}" y1="54" x2="${70 + i * 33}" y2="100" stroke="#4e2219" stroke-width="2"/>`).join('')}<rect x="48" y="100" width="304" height="72" fill="#5a3d2a"/>${Array.from({length:8}, (_, i) => `<rect x="${58 + i * 37}" y="110" width="28" height="52" fill="#e8cf9c" opacity=".75"/><path d="M${58 + i * 37} 127 h28 M${58 + i * 37} 144 h28 M${72 + i * 37} 110 v52" stroke="#3a281b" stroke-width="2"/>`).join('')}<rect x="58" y="172" width="284" height="80" fill="#8a8172"/>${Array.from({length:5}, (_, j) => `<line x1="58" y1="${186 + j * 14}" x2="342" y2="${186 + j * 14}" stroke="#6f675b" stroke-width="1.5"/>`).join('')}<path d="M182 252 V212 A18 18 0 0 1 218 212 V252Z" fill="#3a2a1d"/><rect x="262" y="200" width="22" height="30" fill="#2a2018"/></svg>`;
const SCHOOL_THEN = `<svg viewBox="0 0 400 253" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="sts" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3f48"/><stop offset="1" stop-color="#b9a07a"/></linearGradient></defs><rect width="400" height="253" fill="url(#sts)"/><rect y="200" width="400" height="53" fill="#3d3628"/>${palm(40, 205, 150, 14, '#22201b')}${palm(352, 205, 130, -12, '#22201b')}<path d="M110 120 L200 52 L290 120Z" fill="#7a6440"/>${Array.from({length:12}, (_, i) => `<line x1="${200}" y1="54" x2="${112 + i * 16}" y2="120" stroke="#5e4c2e" stroke-width="1.5"/>`).join('')}<rect x="124" y="120" width="152" height="58" fill="#a88d5f"/>${Array.from({length:10}, (_, i) => `<line x1="${128 + i * 15}" y1="120" x2="${128 + i * 15}" y2="178" stroke="#8a7248" stroke-width="2"/>`).join('')}<rect x="150" y="134" width="34" height="24" fill="#2a241b"/><rect x="216" y="134" width="34" height="24" fill="#2a241b"/>${[134, 170, 230, 266].map(x => `<rect x="${x}" y="178" width="5" height="26" fill="#4a3b25"/>`).join('')}<path d="M196 178 L206 204 M204 178 L214 204" stroke="#4a3b25" stroke-width="3"/></svg>`;

/* ---------- the journey ----------
   cams: one camera per scroll beat (z zoom, x/y pan as a fraction of the screen, ox/oy zoom origin in %).
   data-k on text: the beat at which that line appears.  hs: gold markers pinned to an art layer (l) at a 1600x900 point (at; pat on phones).
   quiz: a question at beat k whose answer is revealed when chosen, or automatically one beat later.
   media: real photos (print), then/now sliders (thennow) and the developing photo (develop).
   when/title on hs, quiz, candles and media feed the "Discoveries" timeline. */
const SCENES = [
{ id:'calamba', dot:'Calamba, 1861', bg:'#17151a', origin:'50% 72%', pan:[0, 0], rot:0,
  cams:[{z:1}, {z:1.05}, {z:1.1, ox:52, oy:76}, {z:1.16, ox:52, oy:78, y:-.01}],
  date:'1861', dpos:'tl', tpos:'l',
  layers:[
    {d:.03, pv:'540 0 414 900', art:`<defs><linearGradient id="k0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#111218"/><stop offset=".42" stop-color="#2a2127"/><stop offset=".63" stop-color="#6b4636"/><stop offset=".72" stop-color="#b98a5a"/></linearGradient><radialGradient id="k0s"><stop offset="0" stop-color="#f3d9a4" stop-opacity=".9"/><stop offset=".3" stop-color="#e2b97a" stop-opacity=".35"/><stop offset="1" stop-color="#c6a36a" stop-opacity="0"/></radialGradient></defs><rect width="1600" height="900" fill="url(#k0)"/>${stars(40, 0, 1600, 300)}<circle cx="900" cy="590" r="330" fill="url(#k0s)"/><circle cx="900" cy="588" r="40" fill="#f1d6a0"/>`},
    {d:.16, pv:'540 0 414 900', art:`<path d="M0 600 C300 572 500 562 760 576 C1000 560 1300 542 1600 560 V700 H0Z" fill="#3c2d31" opacity=".8"/><path d="${RIDGE}" fill="#221b21"/>`},
    {d:.3, pv:'540 0 414 900', art:`<defs><linearGradient id="k0l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4540"/><stop offset="1" stop-color="#16161b"/></linearGradient></defs><rect y="628" width="1600" height="272" fill="url(#k0l)"/>${Array.from({length:9}, (_, i) => `<line x1="${900 - 70 + i * 6}" y1="${642 + i * 15}" x2="${900 + 70 - i * 6}" y2="${642 + i * 15}" stroke="#e7c58c" stroke-width="2" opacity="${.6 - i * .055}"/>`).join('')}${Array.from({length:14}, (_, i) => `<line x1="${(i * 211) % 1500}" y1="${660 + (i * 37) % 90}" x2="${(i * 211) % 1500 + 60}" y2="${660 + (i * 37) % 90}" stroke="#c6a36a" stroke-width="1" opacity=".22"/>`).join('')}`},
    {d:.55, pv:'540 0 414 900', art:`<path d="M0 760 C260 736 520 742 760 752 C1000 762 1300 742 1600 750 V900 H0Z" fill="#0f1015"/><g fill="#0b0c10"><rect x="796" y="672" width="26" height="82"/><path d="M790 672 L809 646 L828 672Z"/><rect x="822" y="700" width="70" height="54"/><path d="M816 700 L857 676 L898 700Z"/><line x1="809" y1="646" x2="809" y2="628" stroke="#0b0c10" stroke-width="3"/><line x1="802" y1="636" x2="816" y2="636" stroke="#0b0c10" stroke-width="3"/><path d="M600 754 V722 L630 702 L660 722 V754Z"/><path d="M682 756 V730 L706 714 L730 730 V756Z"/></g><rect x="804" y="686" width="6" height="9" fill="#d9a65e" opacity=".75"/><rect x="616" y="732" width="8" height="8" fill="#d9a65e" opacity=".6"/>${grass(0, 1600, 772, 26, '#0b0c10', 90)}`},
    {d:.95, pv:'540 0 414 900', art:`<g class="lo">${palm(150, 930, 560, 50)}${palm(320, 930, 400, -40)}${palm(1450, 930, 600, -70)}${palm(1320, 930, 380, 30)}</g><g class="po">${palm(548, 930, 360, -30)}${palm(950, 930, 320, 30)}</g>${grass(0, 1600, 905, 70, '#050608', 70)}`}
  ],
  body:`<p class="ln tx" data-k="1"><b>June 19, 1861.</b> José Rizal is born in Calamba, Laguna.</p>`,
  quiz:{k:2, when:'June 19, 1861', title:'Seventh of eleven', q:'He had ten brothers and sisters. Where did he fall among them?', options:['The eldest', 'The seventh', 'The youngest'], answer:1,
        explain:'He was the <b>seventh of eleven children</b> of <b>Francisco Mercado</b> and <b>Teodora Alonso</b>.',
        imgs:[{src:'img/francisco-mercado.jpg', alt:'Portrait photograph of Francisco Mercado', cap:'Francisco Mercado'}, {src:'img/teodora-alonso.jpg', alt:'Portrait photograph of Teodora Alonso', cap:'Teodora Alonso'}], credit:GUT},
  hs:[],
  media:[{type:'print', k:1, to:3, pos:'r', src:'img/makiling-from-calamba.jpg', alt:'Mount Makiling across the water, seen from the Calamba shore of Laguna de Bay.',
          cap:'Mount Makiling, seen today from the lakeshore at Calamba.', credit:CC('Zian Colt', 'CC BY-SA 4.0')}]
},
{ id:'baptism', dot:'Baptism, 1861', bg:'#1b1714', origin:'50% 58%', pan:[0, -10], rot:0,
  cams:[{z:1}, {z:1.1, oy:52}, {z:1.22, oy:80}],
  date:'June 22, 1861', dpos:'tl sm2', tpos:'r',
  layers:[
    {d:.04, pv:'593 0 414 900', art:`<defs><radialGradient id="kb" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="#e8c98f" stop-opacity=".55"/><stop offset="1" stop-color="#e8c98f" stop-opacity="0"/></radialGradient></defs><rect width="1600" height="900" fill="#241d18"/><path d="M620 720 V360 A180 180 0 0 1 980 360 V720Z" fill="#3a2e24"/><path d="M560 760 V340 A240 240 0 0 1 1040 340 V760Z" fill="url(#kb)"/><rect x="730" y="540" width="140" height="70" fill="#4a3a2a"/><line x1="800" y1="390" x2="800" y2="510" stroke="#c6a36a" stroke-width="6"/><line x1="764" y1="426" x2="836" y2="426" stroke="#c6a36a" stroke-width="6"/>`},
    {d:.2, pv:'593 0 414 900', art:`${arches(-40, 780, 4, 160, 600, '#16120e')}${arches(1000, 780, 4, 160, 600, '#16120e')}<polygon points="360,0 450,0 980,900 720,900" fill="#f0dcae" opacity=".06"/>`},
    {d:.45, pv:'593 0 414 900', art:`${candleDefs('b')}<rect y="740" width="1600" height="160" fill="#1a1511"/>${Array.from({length:21}, (_, i) => { const k = i - 10; return `<line x1="${800 + k * 170 * .45}" y1="740" x2="${800 + k * 170}" y2="900" stroke="#120e0b" stroke-width="3"/>`; }).join('')}${candle(560, 740, 170, 22, .3, 'b')}${candle(880, 740, 120, 18, .9, 'b')}<rect x="548" y="740" width="24" height="10" fill="#3a2e24"/><rect x="870" y="740" width="20" height="10" fill="#3a2e24"/>`},
    {d:.82, pv:'593 0 414 900', art:`<ellipse cx="800" cy="776" rx="150" ry="28" fill="#6b6157"/><path d="M650 776 C662 850 938 850 950 776Z" fill="#4f463e"/><ellipse cx="800" cy="776" rx="128" ry="19" fill="#22303b"/><ellipse cx="770" cy="772" rx="40" ry="5" fill="#9fb3bf" opacity=".35"/><rect x="766" y="836" width="68" height="90" fill="#3d362f"/>`}
  ],
  body:`<p class="ln tx" data-k="1">Three days after his birth, he is baptized at the Catholic parish in Calamba.</p>
        <p class="sm tx" data-k="2">Historical biographies commonly record that <b>Father Rufino Collantes</b> was the officiating priest.</p>
        <p class="note tx" data-k="2">Tap or click the gold markers to discover more.</p>`,
  hs:[{l:3, at:[800, 790], k:2, when:'June 22, 1861', title:'His godfather', label:'his godfather', fact:'The historical marker at the Calamba church baptistery names Father Pedro Casañas as his godfather.', src:'NHCP registry — José Rizal 1861–1896 (Calamba Church)',
      img:'img/baptism-record.jpg', imgAlt:'A handwritten page from the Calamba parish book of baptisms recording José Rizal’s baptism.', imgCredit:'Baptismal register page · public domain · Wikimedia Commons'}],
  media:[{type:'print', k:1, pos:'lb', src:'img/calamba-church.jpg', alt:'The Saint John the Baptist Parish Church in Calamba today.',
          cap:'The parish church of Calamba today, where he was baptized.', credit:CC('Patrick Roque', 'CC BY-SA 4.0')}]
},
{ id:'home', dot:'The family home', bg:'#211812', origin:'50% 62%', pan:[0, -20], rot:0,
  cams:[{z:1}, {z:1.1, ox:50, oy:72}, {z:1.16, ox:50, oy:40}],
  date:'c. 1864', dpos:'tl sm2', tpos:'l',
  layers:[
    {d:.05, pv:'593 0 414 900', art:`<defs><linearGradient id="k1w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3c3238"/><stop offset="1" stop-color="#b8855a"/></linearGradient></defs><rect width="1600" height="900" fill="#2e221b"/>${Array.from({length:20}, (_, i) => `<line x1="${i * 80}" y1="0" x2="${i * 80}" y2="900" stroke="#1d1510" stroke-width="3" opacity=".5"/>`).join('')}<rect x="690" y="200" width="220" height="320" fill="url(#k1w)"/>${palm(860, 540, 230, -20, '#2a1f1d')}${capiz(690, 200, 110, 320, 3, 6, .5)}<rect x="690" y="200" width="220" height="320" fill="none" stroke="#1a120d" stroke-width="14"/><polygon points="700,520 900,520 1060,900 560,900" fill="#f0d9a8" opacity=".05"/>`},
    {d:.22, pv:'593 0 414 900', art:`<g class="lo"><rect x="250" y="330" width="250" height="12" fill="#1a130e"/>${[0,1,2,3,4,5,6].map(i => `<rect x="${262 + i * 30}" y="${270 + (i % 3) * 8}" width="${22 + (i % 2) * 4}" height="${60 - (i % 3) * 8}" fill="${['#5b2f2c','#3a3227','#6b5a3e','#2c2a2f'][i % 4]}"/>`).join('')}<rect x="1150" y="300" width="210" height="420" fill="#1c140f"/><rect x="1165" y="318" width="85" height="380" fill="#241a13"/><rect x="1260" y="318" width="85" height="380" fill="#241a13"/><circle cx="1245" cy="510" r="4" fill="#c6a36a"/><circle cx="1265" cy="510" r="4" fill="#c6a36a"/></g>`},
    {d:.42, pv:'593 0 414 900', art:`<rect y="700" width="1600" height="200" fill="#1c140f"/>${Array.from({length:21}, (_, i) => { const k = i - 10; return `<line x1="${800 + k * 170 * .583}" y1="700" x2="${800 + k * 170}" y2="900" stroke="#120d0a" stroke-width="3"/>`; }).join('')}`},
    {d:.68, pv:'593 0 414 900', art:`<defs><radialGradient id="k1g"><stop offset="0" stop-color="#f3d48e" stop-opacity=".55"/><stop offset="1" stop-color="#f3d48e" stop-opacity="0"/></radialGradient></defs><circle cx="975" cy="560" r="230" fill="url(#k1g)"/><rect x="540" y="640" width="520" height="20" fill="#3a271b"/><rect x="560" y="660" width="18" height="200" fill="#2a1c13"/><rect x="1022" y="660" width="18" height="200" fill="#2a1c13"/><path d="M700 636 L800 622 L800 640 L700 650Z" fill="#e8ddc8"/><path d="M900 636 L800 622 L800 640 L900 650Z" fill="#f2e8d4"/><text x="738" y="640" font-family="Cormorant Garamond,Georgia,serif" font-size="17" fill="#3a2c22" transform="rotate(-6 738 640)">A b</text><text x="826" y="634" font-family="Cormorant Garamond,Georgia,serif" font-size="17" fill="#3a2c22" transform="rotate(6 826 634)">C d</text><ellipse cx="975" cy="630" rx="30" ry="10" fill="#1f1712"/><path d="M955 630 C955 600 995 600 995 630Z" fill="#6d6152" opacity=".8"/>${flame(975, 600, .7)}`},
    {d:1, pv:'593 0 414 900', art:`<g fill="#0b0908"><g class="lo"><rect x="0" y="0" width="110" height="900"/><rect x="1490" y="0" width="110" height="900"/><rect x="0" y="0" width="1600" height="70"/></g><g class="po"><rect x="560" y="0" width="70" height="900"/><rect x="970" y="0" width="70" height="900"/><rect x="560" y="0" width="480" height="60"/></g></g>`}
  ],
  body:`<p class="ln tx" data-k="1">At about three, he begins learning the alphabet from his mother, <b>Teodora Alonso</b> — his first teacher.</p>
        <p class="sm tx" data-k="2">She helped develop his early reading skills and encouraged his love of learning.</p>`,
  hs:[{l:0, at:[800, 300], k:2, when:'Childhood', title:'A second mother', label:'his eldest sister', fact:'His eldest sister, Saturnina — called Neneng — acted as a second mother to him.', src:'National Museum of the Philippines — Jose Rizal Day',
      img:'img/saturnina-painting.jpg', imgAlt:'A painted portrait of Saturnina Rizal by her brother José.', imgCredit:'Painting by José Rizal, from Rizal’s Own Story of His Life (1918) · public domain'}],
  media:[{type:'print', k:1, to:2, pos:'r', size:'sm', src:'img/teodora-alonso.jpg', alt:'Portrait photograph of Teodora Alonso, Rizal’s mother.',
          cap:'Teodora Alonso, his mother and first teacher.', credit:GUT},
         {type:'thennow', k:2, pos:'r', ratio:'4/3', thenSrc:'img/calamba-house-old.jpg', thenAlt:'Old photograph of the Rizal-Mercado house in Calamba.', thenTag:'Early 1900s', src:'img/calamba-house-today.jpg', alt:'The Rizal Shrine in Calamba today: a two-storey house with a stone ground floor and capiz windows above.',
          cap:'The family house in Calamba — in an early photograph (left) and today as the rebuilt Rizal Shrine (right).', credit:GUT + ' (left) · class research file (right)', when:'Today', title:'The Calamba house today'}]
},
{ id:'moth', dot:'The moth & the flame', bg:'#07080a', origin:'50% 62%', pan:[0, 0], rot:0, glow:true,
  cams:[{z:1}, {z:1.12}, {z:1.28}],
  date:'Childhood', dpos:'tr sm2', tpos:'lt',
  layers:[
    {d:.06, pv:'593 0 414 900', art:`<rect width="1600" height="900" fill="#0c0d10"/><ellipse cx="400" cy="300" rx="380" ry="200" fill="#121317" opacity=".6"/><ellipse cx="1200" cy="420" rx="300" ry="260" fill="#111216" opacity=".6"/>`},
    {d:.5, pv:'593 0 414 900', art:`<defs><radialGradient id="k2h"><stop offset="0" stop-color="#f3d48e" stop-opacity=".42"/><stop offset=".4" stop-color="#d8a55f" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><circle cx="800" cy="560" r="320" fill="url(#k2h)"/><rect y="690" width="1600" height="210" fill="#0a0a0c"/><ellipse cx="800" cy="694" rx="300" ry="26" fill="#3a2a1a" opacity=".5"/><ellipse cx="800" cy="690" rx="86" ry="12" fill="#1c1611"/><path d="M730 600 C724 690 876 690 870 600Z" fill="#5d5448" opacity=".55" stroke="#8c7f6b" stroke-width="2"/><path d="M736 640 C744 684 856 684 864 640Z" fill="#b8925a" opacity=".45"/><ellipse cx="800" cy="600" rx="70" ry="9" fill="none" stroke="#8c7f6b" stroke-width="2"/><line x1="800" y1="600" x2="800" y2="582" stroke="#2a2420" stroke-width="3"/>${flame(800, 584, 1.15)}<g id="moth" transform="translate(1180 260)"><g class="wing"><path d="M0 0 C-16 -18 -34 -10 -28 6 C-24 16 -8 10 0 0Z M0 0 C16 -18 34 -10 28 6 C24 16 8 10 0 0Z" fill="#cdc4b2"/></g><ellipse rx="3.4" ry="10" fill="#7d7568"/></g>`}
  ],
  body:`<p class="ln tx" data-k="1">One night, by a coconut-oil lamp, his mother read him a fable of a young moth and an old one.</p>
        <p class="sm tx" data-k="2">The boy watched real moths circle the flame. Recalling it years later, Rizal wrote that the moth’s fate stayed with him more than the warning.</p>
        <p class="note tx" data-k="2">From his own recollection, “My First Reading Lesson.” Its year is not recorded.</p>
        <p class="note tx hintfine" data-k="0">Move your cursor — the light follows.</p><p class="note tx hinttouch" data-k="0">Touch the dark — the light follows.</p>`,
  hs:[{l:1, at:[800, 650], k:2, when:'Childhood', title:'Read in two languages', label:'the reading lesson', fact:'His mother read from a Spanish reader and translated the fable into Tagalog as she went.', src:'“My First Reading Lesson,” in Rizal’s Own Story of His Life',
      img:'img/teodora-alonso.jpg', imgAlt:'Portrait photograph of Teodora Alonso.', imgCredit:GUT}],
  media:[{type:'print', k:2, pos:'rb', src:'img/shrine-interior.jpg', alt:'A room inside the reconstructed Rizal house in Calamba, with dark wooden ceiling beams.',
          cap:'A room in the family house as reconstructed today.', credit:CC('Tsambaproductions', 'CC BY-SA 3.0')}]
},
{ id:'concha', dot:'Concha, 1865', bg:'#0b0c10', origin:'52% 50%', pan:[0, 0], rot:0,
  cams:[{z:1}, {z:1.08, ox:56, oy:46}, {z:1.16, ox:44, oy:70}],
  date:'1865', dpos:'tl', tpos:'r',
  layers:[
    {d:.04, pv:'633 0 414 900', art:`<defs><linearGradient id="kcw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2230"/><stop offset="1" stop-color="#3c4a5c"/></linearGradient><radialGradient id="kcm"><stop offset="0" stop-color="#cfd8e6" stop-opacity=".22"/><stop offset="1" stop-color="#cfd8e6" stop-opacity="0"/></radialGradient></defs><rect width="1600" height="900" fill="#101117"/><rect x="860" y="200" width="240" height="340" fill="url(#kcw)"/><circle cx="1010" cy="290" r="34" fill="#dfe5ee" opacity=".85"/>${stars(14, 870, 1090, 520, 7)}${capiz(860, 200, 120, 340, 3, 6, .12)}<rect x="860" y="200" width="240" height="340" fill="none" stroke="#090a0d" stroke-width="16"/><circle cx="980" cy="400" r="360" fill="url(#kcm)"/><polygon points="870,540 1100,540 1300,900 760,900" fill="#cfd8e6" opacity=".05"/>`},
    {d:.3, pv:'633 0 414 900', art:`<rect y="700" width="1600" height="200" fill="#0b0c10"/><rect x="560" y="660" width="300" height="16" fill="#1a1712"/><rect x="580" y="676" width="12" height="120" fill="#141109"/><rect x="828" y="676" width="12" height="120" fill="#141109"/>`},
    {d:.55, pv:'633 0 414 900', art:`<defs><radialGradient id="kch"><stop offset="0" stop-color="#f3d48e" stop-opacity=".35"/><stop offset="1" stop-color="#f3d48e" stop-opacity="0"/></radialGradient></defs><circle cx="660" cy="600" r="150" fill="url(#kch)"/><rect x="652" y="620" width="16" height="40" fill="#d9d0bf"/>${flame(660, 620, .5)}${[[730, 652], [748, 646], [742, 658], [764, 654], [756, 662]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#f2efe6"/><circle cx="${x}" cy="${y}" r="1.6" fill="#e8d79c"/>`).join('')}`}
  ],
  body:`<p class="ln tx" data-k="1">His younger sister Concepción — <b>Concha</b> — dies at the age of three.</p>
        <p class="sm tx" data-k="2">Rizal was four. He later recalled it as the first time he cried out of love and sorrow.</p>`,
  hs:[],
  media:[{type:'print', k:2, pos:'lb', size:'sm', src:'img/mother-and-daughters.jpg', alt:'Old photograph of Teodora Alonso seated with her daughter Saturnina, holding baby Trinidad.',
          cap:'His mother with his sisters Saturnina and the baby Trinidad — a photograph of the family he grew up in.', credit:GUT}]
},
{ id:'antipolo', dot:'Antipolo, 1868', bg:'#24201e', origin:'52% 48%', pan:[-30, 10], rot:1.5,
  cams:[{z:1}, {z:1.12, ox:52, oy:60}, {z:1.28, ox:52, oy:46}],
  date:'1868', dpos:'tr', tpos:'l',
  layers:[
    {d:.04, pv:'613 0 414 900', art:`<defs><linearGradient id="k3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1c22"/><stop offset=".55" stop-color="#584d45"/><stop offset="1" stop-color="#a58f6e"/></linearGradient></defs><rect width="1600" height="900" fill="url(#k3)"/><circle cx="560" cy="250" r="34" fill="#e9dcc0" opacity=".75"/>`},
    {d:.18, pv:'613 0 414 900', art:`<path d="M0 560 C200 520 380 540 560 500 C760 470 980 520 1200 480 C1380 450 1500 480 1600 470 V900 H0Z" fill="#3f3936"/>`},
    {d:.36, pv:'613 0 414 900', art:`<path d="M240 900 C460 700 640 470 820 432 C990 468 1170 660 1420 900Z" fill="#2a2624"/><g fill="#16151a"><rect x="790" y="378" width="72" height="56"/><path d="M784 380 L826 352 L868 380Z"/><rect x="766" y="330" width="30" height="104"/><path d="M766 330 Q781 300 796 330Z"/><line x1="781" y1="304" x2="781" y2="284" stroke="#16151a" stroke-width="3"/><line x1="773" y1="292" x2="789" y2="292" stroke="#16151a" stroke-width="3"/></g><path d="M818 434 V408 A8 8 0 0 1 834 408 V434Z" fill="#d9a65e" opacity=".55"/>`},
    {d:.6, pv:'613 0 414 900', art:`<path d="M760 920 C900 830 640 760 760 690 C860 630 700 580 800 520 C832 500 815 470 820 442" stroke="#9a8664" stroke-width="7" fill="none" stroke-dasharray="14 10" opacity=".45"/>${figure(778, 700, 54, '#0e0e12')}${figure(752, 704, 34, '#0e0e12')}`},
    {d:.9, pv:'613 0 414 900', art:`${grass(0, 1600, 900, 110, '#0b0b0e', 80)}<g class="lo">${palm(120, 940, 460, 40, '#08090b')}${palm(1500, 940, 420, -40, '#08090b')}</g><g class="po">${palm(600, 940, 380, 30, '#08090b')}</g>`}
  ],
  body:`<p class="ln tx" data-k="1"><b>June 1868.</b> With his father, <b>Francisco Mercado</b>, he makes the journey to Antipolo.</p>`,
  quiz:{k:1, when:'June 1868', title:'Why Antipolo?', q:'Why did father and son make this trip?', options:['To fulfill a vow', 'To enroll him in school', 'To visit relatives'], answer:0,
        explain:'To fulfill a <b>vow his mother made before his birth</b>. From Antipolo they travelled on to Manila.'},
  hs:[{l:3, at:[778, 650], k:2, when:'June 1868', title:'By boat to Manila', label:'the journey', fact:'Rizal recalled travelling by casco, a flat river boat, stopping at Cainta, Taytay and Antipolo. In Manila he visited his eldest sister Saturnina, then a student at La Concordia College in Santa Ana.', src:'Rizal’s Own Story of His Life, chapter I',
      img:'img/saturnina-painting.jpg', imgAlt:'A painted portrait of Saturnina Rizal by her brother José.', imgCredit:'Painting by José Rizal, from Rizal’s Own Story of His Life (1918) · public domain'}],
  media:[{type:'print', k:2, pos:'rb', src:'img/antipolo-cathedral.jpg', alt:'The facade of Antipolo Cathedral today.',
          cap:'Antipolo Cathedral today — the shrine at the end of the pilgrimage, long since rebuilt.', credit:CC('Urbanroamer', 'CC BY-SA 4.0')}]
},
{ id:'binan', dot:'Biñan, 1869/70', bg:'#1a1c1e', origin:'50% 35%', pan:[20, 0], rot:0,
  cams:[{z:1}, {z:1.04}, {z:1.08, ox:60, oy:45}, {z:1.12, ox:60, oy:45}],
  date:'1869 / 1870', dpos:'chalk', tpos:'l',
  layers:[
    {d:.05, pv:'553 0 414 900', art:`<rect width="1600" height="900" fill="#2a2723"/>${Array.from({length:12}, (_, i) => `<line x1="0" y1="${i * 75}" x2="1600" y2="${i * 75}" stroke="#211e1b" stroke-width="2"/>`).join('')}<g class="lo"><rect x="1230" y="230" width="230" height="250" fill="#8d8371"/>${palm(1400, 500, 200, -20, '#4b463d')}<rect x="1230" y="230" width="230" height="250" fill="none" stroke="#1c1814" stroke-width="14"/><line x1="1345" y1="230" x2="1345" y2="480" stroke="#1c1814" stroke-width="8"/></g>`},
    {d:.2, pv:'553 0 414 900', art:`<rect x="360" y="150" width="880" height="420" fill="#1e2723"/><rect x="360" y="150" width="880" height="420" fill="none" stroke="#3b2c22" stroke-width="16"/><path d="M420 220 q60 -8 120 4 M1080 500 q50 6 110 -2 M460 520 q80 -10 150 6" stroke="#e8e4d6" stroke-width="3" fill="none" opacity=".08"/><rect x="380" y="572" width="840" height="10" fill="#3b2c22"/><rect x="900" y="566" width="30" height="7" fill="#e8e4d6" opacity=".7"/>`},
    {d:.45, pv:'553 0 414 900', art:`<rect y="660" width="1600" height="240" fill="#1b1916"/><g fill="#2c2119"><rect x="300" y="650" width="420" height="18"/><rect x="880" y="650" width="420" height="18"/><rect x="230" y="712" width="520" height="20"/><rect x="850" y="712" width="520" height="20"/></g><g fill="#21180f"><rect x="320" y="668" width="12" height="40"/><rect x="700" y="668" width="12" height="40"/><rect x="900" y="668" width="12" height="40"/><rect x="1280" y="668" width="12" height="40"/></g>`},
    {d:.85, pv:'553 0 414 900', art:`<rect x="-20" y="810" width="1640" height="30" fill="#140f0b"/><rect x="60" y="840" width="24" height="80" fill="#0e0a07"/><rect x="1516" y="840" width="24" height="80" fill="#0e0a07"/><g transform="rotate(-8 640 800)"><rect x="560" y="770" width="150" height="104" fill="#232b28" stroke="#4a3a2c" stroke-width="8"/><path d="M590 800 h40 M590 822 h70 M590 844 h30" stroke="#d8d4c6" stroke-width="2" opacity=".4"/></g>`}
  ],
  body:`<p class="ln tx" data-k="1"><b>Biñan, Laguna.</b> His first formal schooling, under Maestro <b>Justiniano Aquino Cruz</b>.</p>
        <p class="sm tx" data-k="1">Studying away from his family helped him become more independent.</p>`,
  quiz:{k:2, when:'1869 – 1871', title:'Which year?', q:'Sources differ on when he began in Biñan. Which year does the 1948 historical marker in Biñan give?', options:['1869', '1870', '1871'], answer:2,
        explain:'The marker says <b>1871</b>. Other accounts give <b>1869</b> or <b>1870</b> — sources differ, and the date is still debated.'},
  hs:[{l:1, at:[1150, 520], pat:[900, 520], k:2, when:'Biñan', title:'A teacher’s advice', label:'Maestro Cruz', fact:'According to the historical marker in Biñan, Maestro Cruz later advised him to study at a higher school in Manila.', src:'NHCP registry — Rizal in Biñan', img:'img/binan-marker.jpg', imgAlt:'The 1948 Philippines Historical Committee marker titled Rizal in Biñan.'},
      {l:1, at:[460, 240], pat:[620, 240], k:2, when:'1869', title:'A disputed poem', label:'a disputed poem', fact:'A Tagalog poem, “Sa Aking Mga Kabata,” is traditionally credited to him as a child around 1869 — but historians dispute that he wrote it.', src:'JoseRizal.com — A Complete Timeline'}],
  media:[{type:'thennow', k:1, pos:'rb', ratio:'1.58', thenSrc:'img/binan-justiniano-site.jpg', thenAlt:'Old photograph of the site of Maestro Justiniano’s house in Biñan.', thenTag:'Early 1900s', src:'img/binan-school-site-today.jpg', alt:'The gate of the School of Dr. Jose P. Rizal site and museum in Biñan today.',
          cap:'Where Maestro Justiniano taught — in an early photograph of the site (left) and the school site today (right).', credit:GUT + ' (left) · class research file (right)', when:'Today', title:'The Biñan school site today'}]
},
{ id:'return', dot:'Home again, 1870', bg:'#1a1a1f', origin:'50% 70%', pan:[20, 0], rot:0,
  cams:[{z:1}, {z:1.08, x:-.02}, {z:1.18, ox:46, oy:74, x:-.03}],
  date:'Dec. 17, 1870', dpos:'tr sm2', tpos:'l',
  layers:[
    {d:.03, pv:'593 0 414 900', art:`<defs><linearGradient id="kr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2230"/><stop offset=".55" stop-color="#5d4c52"/><stop offset=".7" stop-color="#c9a67a"/></linearGradient></defs><rect width="1600" height="900" fill="url(#kr)"/><circle cx="1100" cy="610" r="34" fill="#f3dcae"/>`},
    {d:.16, pv:'593 0 414 900', art:`<path d="${RIDGE}" fill="#2a2329"/>`},
    {d:.3, pv:'593 0 414 900', art:`<rect y="628" width="1600" height="272" fill="#3a3540"/>${Array.from({length:9}, (_, i) => `<line x1="${1100 - 70 + i * 6}" y1="${642 + i * 15}" x2="${1100 + 70 - i * 6}" y2="${642 + i * 15}" stroke="#f0d3a0" stroke-width="2" opacity="${.55 - i * .05}"/>`).join('')}<path d="M0 640 C400 632 900 636 1600 642 V660 H0Z" fill="#1d1b20" opacity=".7"/>`},
    {d:.55, pv:'593 0 414 900', art:`<g fill="#0d0e12"><path d="M560 730 L1000 730 L960 770 L600 770Z"/><path d="M640 730 V690 Q790 660 920 690 V730Z" fill="#15161b"/></g><line x1="980" y1="600" x2="1040" y2="790" stroke="#0d0e12" stroke-width="5"/>${figure(990, 730, 70, '#0d0e12')}<path d="M540 784 q60 -10 120 0 M760 790 q80 -8 160 0 M960 786 q50 -6 100 0" stroke="#d9c4a0" stroke-width="2" fill="none" opacity=".25"/>`},
    {d:.92, pv:'593 0 414 900', art:`${grass(0, 1600, 900, 120, '#08090b', 80)}<g class="lo">${palm(140, 940, 520, 40, '#07080a')}</g><g class="po">${palm(600, 940, 360, 24, '#07080a')}</g>`}
  ],
  body:`<p class="ln tx" data-k="1">After Biñan, he returns home to Calamba on <b>December 17, 1870</b>.</p>
        <p class="sm tx" data-k="2">He continues at the town school under Maestro <b>Lucas Padua</b>.</p>`,
  hs:[{l:2, at:[1100, 700], pat:[860, 700], k:2, when:'1871', title:'His mother’s ordeal', label:'1871', fact:'In 1871 his mother was accused of poisoning and imprisoned for about two to two and a half years before she was acquitted.', src:'JoseRizal.com — A Complete Timeline',
      img:'img/teodora-alonso.jpg', imgAlt:'Portrait photograph of Teodora Alonso.', imgCredit:GUT}],
  media:[{type:'print', k:1, pos:'rb', size:'sm', src:'img/laguna-shore-old.jpg', alt:'Old photograph of the Laguna de Bay shore at Calamba, with a small boat and mountains beyond.',
          cap:'The Laguna de Bay shore at Calamba, in an early photograph.', credit:GUT}]
},
{ id:'gomburza', dot:'GOMBURZA, 1872', bg:'#09090b', origin:'40% 62%', pan:[0, 0], rot:0,
  cams:[{z:1}, {z:1.12}, {z:1.2}, {z:1.28}],
  date:'1872', dpos:'tl', tpos:'r', dateTo:2,
  candles:{l:2, ll:2, k:2, at:[[540, 540], [640, 490], [740, 540]], label:[[540, 690], [640, 726], [740, 690]], lpat:[[540, 690], [640, 726], [740, 690]], names:['Mariano Gómez', 'José Burgos', 'Jacinto Zamora'],
           when:'February 17, 1872', title:'Three names'},
  layers:[
    {d:.05, pv:'433 0 414 900', art:`<defs><radialGradient id="k5" cx=".4" cy=".62" r=".5"><stop offset="0" stop-color="#4a3420" stop-opacity=".7"/><stop offset="1" stop-color="#09090b" stop-opacity="0"/></radialGradient></defs><rect width="1600" height="900" fill="#0b0b0e"/>${arches(80, 760, 9, 160, 520, '#111116')}<rect width="1600" height="900" fill="url(#k5)"/>`},
    {d:.25, pv:'433 0 414 900', art:`${[0, 1, 2].map(r => Array.from({length:14 - r * 3}, (_, i) => { const n = 14 - r * 3, x = 640 + (i - (n - 1) / 2) * (70 - r * 10), y = 640 - r * 34; return `<g opacity="${.75 - r * .2}"><rect x="${x - 5}" y="${y - 18}" width="10" height="18" fill="#bdb3a2"/>${flame(x, y - 18, .32, 'fl', (i * .37 + r) % 2)}</g>`; }).join('')).join('')}`},
    {d:.55, pv:'433 0 414 900', art:`${candleDefs('g')}${candle(540, 790, 250, 36, 0, 'g', 'cf0')}${candle(640, 790, 300, 40, .6, 'g', 'cf1')}${candle(740, 790, 250, 36, 1.1, 'g', 'cf2')}`},
    {d:.9, pv:'433 0 414 900', art:`<rect y="790" width="1600" height="110" fill="#050506"/><rect y="786" width="1600" height="6" fill="#3a2a1a" opacity=".6"/>`}
  ],
  body:`<p class="ln tx" data-k="1"><b>February 17, 1872.</b> Three Filipino priests are executed at <b>Bagumbayan</b>.</p>
        <p class="note tx" data-k="2">Light a candle for each of them.</p>
        <p class="sm tx" data-k="3">Their execution deeply affected reform-minded Filipinos, Rizal among them, and later influenced his writings. Historians caution against treating this one event as what alone shaped his later beliefs.</p>`,
  hs:[{l:3, at:[1240, 810], pat:[780, 810], k:3, when:'Today', title:'The execution site', label:'the execution site', fact:'The site at Bagumbayan is today part of Rizal Park in Manila, where the National Historical Commission of the Philippines has placed a marker.', src:'NHCP — GOMBURZA Execution Site',
      img:'img/gomburza-marker.jpg', imgAlt:'Historical marker at the GOMBURZA execution site in Rizal Park.', imgCredit:CC('Titopao', 'CC BY-SA 4.0')}],
  media:[{type:'print', k:3, pos:'l', size:'sm', src:'img/gomburza-portraits.jpg', alt:'Nineteenth-century portrait of Fathers Mariano Gómez, José Burgos and Jacinto Zamora.',
          cap:'Fathers Gómez, Burgos and Zamora, in a 19th-century portrait.', credit:'Unknown author · public domain · Wikimedia Commons'}]
},
{ id:'ateneo', dot:'Ateneo, 1872–1877', bg:'#1c1d22', origin:'50% 60%', pan:[0, 0], rot:0,
  cams:[{z:1}, {z:1.18}, {z:1.3}, {z:1.42}],
  date:'1872–1877', dpos:'tl sm2', tpos:'l',
  layers:[
    {d:.04, pv:'593 0 414 900', art:`<defs><linearGradient id="k6" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#25272e"/><stop offset="1" stop-color="#6a645a"/></linearGradient></defs><rect width="1600" height="900" fill="url(#k6)"/>`},
    {d:.24, pv:'593 0 414 900', art:`<rect x="380" y="340" width="840" height="400" fill="#3b3833"/><path d="M360 344 H1240 L1200 316 H400Z" fill="#2c2a27"/><path d="M720 316 L800 262 L880 316Z" fill="#2c2a27"/><line x1="800" y1="262" x2="800" y2="236" stroke="#2c2a27" stroke-width="4"/><line x1="790" y1="246" x2="810" y2="246" stroke="#2c2a27" stroke-width="4"/>${Array.from({length:12}, (_, i) => `<path d="M${410 + i * 68} 480 V420 A22 22 0 0 1 ${454 + i * 68} 420 V480Z" fill="${i % 4 === 1 ? '#c99d5e' : '#1b1a1d'}" opacity="${i % 4 === 1 ? .7 : 1}"/>`).join('')}${arches(400, 740, 12, 68, 190, '#1b1a1d')}`},
    {d:.5, pv:'593 0 414 900', art:`<rect y="740" width="1600" height="160" fill="#26252a"/>${Array.from({length:10}, (_, i) => `<line x1="0" y1="${752 + i * 16}" x2="1600" y2="${752 + i * 16}" stroke="#1b1a1f" stroke-width="2"/>`).join('')}`},
    {d:.88, pv:'593 0 414 900', art:`<path class="lo" fill-rule="evenodd" d="M-20 -20 H1620 V920 H-20Z M520 920 V430 A280 280 0 0 1 1080 430 V920Z" fill="#121216"/><path class="po" fill-rule="evenodd" d="M-20 -20 H1620 V920 H-20Z M636 920 V480 A164 164 0 0 1 964 480 V920Z" fill="#121216"/><g stroke="#1d1d23" stroke-width="2" fill="none">${Array.from({length:14}, (_, i) => `<line x1="0" y1="${i * 66}" x2="1600" y2="${i * 66}"/>`).join('')}</g>`}
  ],
  body:`<p class="ln tx" data-k="1"><b>June 1872.</b> He enters the Ateneo Municipal de Manila, a Jesuit-run school in Intramuros.</p>
        <p class="sm tx" data-k="3">He worked hard and became one of the outstanding students.</p>`,
  quiz:{k:2, when:'June 1872', title:'A new surname', q:'He did not enroll as “Mercado.” Which surname did he use?', options:['Rizal', 'Alonso', 'Mercado'], answer:0,
        explain:'<span class="names"><s>Mercado</s><span>Rizal</span></span>He enrolled under the surname <b>Rizal</b>, not Mercado.'},
  hs:[{l:1, at:[772, 450], k:3, when:'June 1872', title:'Entrance exams', label:'admission', fact:'He took his entrance examinations on June 10, 1872, at the College of San Juan de Letrán, and entered the Ateneo on June 26, aged eleven.', src:'JoseRizal.com — Rizal at the Ateneo Municipal',
      img:'img/manila-plan-1851.jpg', imgAlt:'Spanish plan of the walled city of Manila, 1851.', imgCredit:'Plano de Manila, 1851 · public domain · Wikimedia Commons'},
      {l:1, at:[1044, 450], pat:[900, 620], k:3, when:'1872–1877', title:'What he studied', label:'his studies', fact:'He studied subjects such as languages, mathematics and literature, and kept developing his talents in poetry and drawing.', src:'The Life of José Rizal from Childhood to College (class research)',
      img:'img/ateneo-carving.jpg', imgAlt:'A small carved religious figure made by Rizal while at the Ateneo.', imgCredit:'A carving Rizal made at the Ateneo · ' + GUT}],
  media:[{type:'print', k:1, pos:'r', size:'sm', src:'img/rizal-at-14.jpg', alt:'Photograph of José Rizal at about fourteen, standing beside a chair.',
          cap:'Rizal at about fourteen, during his Ateneo years.', credit:GUT}]
},
{ id:'graduation', dot:'Graduation, 1877', bg:'#211c16', origin:'38% 40%', pan:[0, -20], rot:0,
  cams:[{z:1}, {z:1.06}, {z:1.18, ox:38, oy:72}],
  date:'1877', dpos:'tr', tpos:'r',
  layers:[
    {d:.04, pv:'393 0 414 900', art:`<rect width="1600" height="900" fill="#352d24"/>`},
    {d:.16, pv:'393 0 414 900', art:`${[360, 600, 840].map(x => `<path d="M${x - 80} 600 V220 A80 80 0 0 1 ${x + 80} 220 V600Z" fill="#e9d6ab" opacity=".85"/><path d="M${x} 140 V600 M${x - 80} 300 H${x + 80} M${x - 80} 450 H${x + 80}" stroke="#2c241c" stroke-width="6"/>`).join('')}`},
    {d:.3, pv:'393 0 414 900', art:`${[360, 600, 840].map(x => `<polygon points="${x - 80},600 ${x + 80},600 ${x + 260},900 ${x - 120},900" fill="#f3e2b8" opacity=".07"/>`).join('')}<rect y="640" width="1600" height="260" fill="#241d16" opacity=".85"/>`},
    {d:.5, pv:'393 0 414 900', art:`<g stroke="#C6A36A" fill="none" stroke-width="2.5" opacity=".9"><path d="M520 770 A92 92 0 0 1 560 640"/><path d="M680 770 A92 92 0 0 0 640 640"/></g><g fill="#C6A36A" opacity=".85">${Array.from({length:7}, (_, i) => { const a = (200 + i * 14) * Math.PI / 180, b = (-20 - i * 14) * Math.PI / 180; return `<ellipse cx="${600 + Math.cos(a) * 92}" cy="${700 - Math.sin(a) * 92 + 0}" rx="14" ry="5" transform="rotate(${-(200 + i * 14) + 60} ${600 + Math.cos(a) * 92} ${700 - Math.sin(a) * 92})"/><ellipse cx="${600 + Math.cos(b) * 92}" cy="${700 - Math.sin(b) * 92}" rx="14" ry="5" transform="rotate(${-(-20 - i * 14) - 60} ${600 + Math.cos(b) * 92} ${700 - Math.sin(b) * 92})"/>`; }).join('')}</g>`},
    {d:.78, pv:'393 0 414 900', art:`<rect y="800" width="1600" height="100" fill="#120e0a"/>${Array.from({length:14}, (_, i) => `<path d="M${i * 120 + 20} 900 V790 Q${i * 120 + 50} 770 ${i * 120 + 80} 790 V900Z" fill="#0d0a07"/>`).join('')}`}
  ],
  body:`<p class="ln tx" data-k="1"><b>March 23, 1877.</b> Bachelor of Arts, Ateneo Municipal de Manila.</p>
        <p class="sob tx" data-k="2">sobresaliente</p>
        <p class="sm tx" data-k="2">The highest academic distinction. He is about fifteen years old.</p>`,
  hs:[{l:3, at:[600, 700], k:2, when:'March 23, 1877', title:'Set in iron', label:'the historical marker', fact:'An NHCP historical marker at the Ateneo de Manila records that José Rizal received the degree of Bachelor of Arts there on March 23, 1877.', src:'NHCP registry — Ateneo de Manila',
      img:'img/ateneo-marker.jpg', imgAlt:'The bronze NHCP historical marker for the Ateneo de Manila.', imgCredit:CC('Kej Andrés', 'CC BY-SA 3.0')},
      {l:1, at:[840, 260], pat:[600, 300], k:2, when:'1876 or 1877?', title:'Another date', label:'another date', fact:'Some early accounts give his graduation year as 1876, not 1877 — another place where sources differ.', src:'JoseRizal.com — Rizal at the Ateneo Municipal'}],
  media:[{type:'print', k:1, pos:'lb', src:'img/ateneo-original-site.jpg', alt:'A heritage sign marking the original site of the Ateneo de Manila in Intramuros.',
          cap:'A sign marking the Ateneo’s original site in Intramuros, where he studied.', credit:CC('Ryomaandres', 'CC BY-SA 3.0')}]
},
{ id:'route', dot:'Toward the university', bg:'#121318', origin:'45% 55%', pan:[40, 0], rot:2,
  cams:[{z:1}, {z:1.12, ox:48, oy:72, x:.04}, {z:1.12, ox:32, oy:40, x:.06}, {z:1.04, x:.02}],
  date:'1877', dpos:'br', tpos:'rt',
  layers:[
    {d:.04, pv:'250 -600 1080 1900', art:`<rect x="-400" y="-400" width="2400" height="1700" fill="#15161c"/><g stroke="#F0EADF" stroke-width="1" opacity=".05">${Array.from({length:17}, (_, i) => `<line x1="${i * 100}" y1="-300" x2="${i * 100}" y2="1200"/>`).join('')}${Array.from({length:15}, (_, i) => `<line x1="-300" y1="${i * 100 - 300}" x2="1900" y2="${i * 100 - 300}"/>`).join('')}</g>`},
    {d:.3, pv:'250 -600 1080 1900', art:`<path d="${BAY}" fill="#1d2731" stroke="#6d6a62" stroke-width="1.5"/><path d="${LAKE}" fill="#1d2731" stroke="#6d6a62" stroke-width="1.5"/><path d="M420 300 C500 330 560 360 620 380 S690 410 712 430" stroke="#2c3a46" stroke-width="7" fill="none"/>
      <g font-family="Cormorant Garamond,Georgia,serif" font-style="italic" fill="#8d8a82" font-size="26"><text x="150" y="420">Manila Bay</text><text x="900" y="530">Laguna de Bay</text></g>
      <path id="route" d="M880 752 C800 762 700 690 672 585 C650 500 690 452 700 430 C640 380 520 330 430 300" pathLength="1" stroke="#C6A36A" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="1"/>
      <g fill="#F0EADF"><circle cx="880" cy="752" r="7"/><circle cx="672" cy="585" r="6"/><circle cx="430" cy="300" r="8"/></g><circle cx="430" cy="300" r="16" fill="none" stroke="#C6A36A" stroke-width="1.5"/>
      <g font-family="Cormorant Garamond,Georgia,serif" fill="#F0EADF" font-size="34"><text x="900" y="800">Calamba</text><text x="560" y="600">Biñan</text><text x="452" y="272">Manila</text></g>
      <text x="1000" y="860" font-family="Manrope,sans-serif" font-size="14" letter-spacing="3" fill="#8d8a82">NOT TO SCALE</text>`},
    {d:.7, pv:'250 -600 1080 1900', art:`<g transform="translate(760 170)" stroke="#C6A36A" fill="none" opacity=".75" class="lo"><circle r="54"/><circle r="40" stroke-dasharray="3 6"/><path d="M0 -70 L10 0 L0 70 L-10 0Z M-70 0 L0 10 L70 0 L0 -10Z" fill="#C6A36A" fill-opacity=".25"/><text y="-80" text-anchor="middle" font-family="Manrope,sans-serif" font-size="14" fill="#C6A36A" stroke="none">N</text></g><g transform="translate(860 1100)" stroke="#C6A36A" fill="none" opacity=".75" class="po"><circle r="44"/><path d="M0 -58 L8 0 L0 58 L-8 0Z" fill="#C6A36A" fill-opacity=".25"/><text y="-66" text-anchor="middle" font-family="Manrope,sans-serif" font-size="14" fill="#C6A36A" stroke="none">N</text></g>`}
  ],
  body:`<p class="ln tx" data-k="1">From Calamba, by way of Biñan, to Manila.</p>
        <p class="ln tx" data-k="3"><b>April 1877.</b> He enrolls at the University of Santo Tomas, in Manila.</p>`,
  hs:[{l:1, at:[430, 300], k:3, when:'April 1877', title:'Higher studies', label:'Manila', fact:'His university education marked the beginning of his higher studies in Manila.', src:'Rizal’s Early Life (class research document)',
      img:'img/ust-intramuros-ruins.jpg', imgAlt:'Ruins of the old University of Santo Tomas building in Intramuros.', imgCredit:CC('GabDelRosario', 'CC BY-SA 4.0')}],
  media:[{type:'print', k:1, to:3, pos:'lb', size:'sm', src:'img/santa-rosa-gate.jpg', alt:'Old photograph of a stone arch gate on the road between Calamba and Biñan.',
          cap:'The Santa Rosa gate, on the old road from Calamba to Biñan.', credit:GUT}]
},
{ id:'ust', dot:'UST, 1877–1878', bg:'#0d0e13', origin:'50% 55%', pan:[0, 0], rot:0,
  cams:[{z:1}, {z:1.06}, {z:1.14, ox:50, oy:50}, {z:1.06}, {z:.96}],
  date:'1877–1878', dpos:'tl sm2', tpos:'l', dateTo:4,
  layers:[
    {d:.04, pv:'593 0 414 900', art:`<defs><linearGradient id="k9" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0b10"/><stop offset="1" stop-color="#22242e"/></linearGradient></defs><rect width="1600" height="900" fill="url(#k9)"/>${stars(70, 0, 1600, 380, 3)}<path d="M1262 160 A34 34 0 1 0 1290 214 A28 28 0 1 1 1262 160Z" fill="#e9dcc0" opacity=".8"/>`},
    {d:.22, pv:'593 0 414 900', art:`<rect x="300" y="400" width="1000" height="360" fill="#1b1b21"/><path d="M280 404 H1320 L1290 380 H310Z" fill="#141419"/><rect x="740" y="300" width="120" height="104" fill="#1b1b21"/><path d="M730 304 L800 262 L870 304Z" fill="#141419"/><line x1="800" y1="262" x2="800" y2="236" stroke="#141419" stroke-width="4"/><line x1="790" y1="246" x2="810" y2="246" stroke="#141419" stroke-width="4"/>${Array.from({length:14}, (_, i) => `<rect x="${330 + i * 69}" y="440" width="34" height="62" fill="${[3, 8, 11].includes(i) ? '#d9b97a' : '#0e0e12'}" opacity="${[3, 8, 11].includes(i) ? .85 : 1}"/>`).join('')}${arches(310, 760, 14, 70, 180, '#0e0e12')}`},
    {d:.5, pv:'593 0 414 900', art:`<defs><radialGradient id="k9l"><stop offset="0" stop-color="#f3d48e" stop-opacity=".45"/><stop offset="1" stop-color="#f3d48e" stop-opacity="0"/></radialGradient></defs><rect y="760" width="1600" height="140" fill="#121318"/>${[220, 1380].map(x => `<circle cx="${x}" cy="560" r="110" fill="url(#k9l)"/><rect x="${x - 4}" y="560" width="8" height="240" fill="#08090C"/><rect x="${x - 14}" y="536" width="28" height="34" fill="#e8c98a" stroke="#08090C" stroke-width="4"/>`).join('')}`},
    {d:.88, pv:'593 0 414 900', art:`<g fill="#050608"><g class="lo"><path d="M0 0 H520 C420 40 300 30 220 90 C150 140 80 120 0 180Z"/><path d="M1600 0 H1120 C1220 50 1320 40 1400 100 C1470 150 1530 130 1600 200Z"/></g><g class="po"><path d="M560 0 H900 C820 40 740 30 680 80 C640 110 600 100 560 130Z"/></g></g>`}
  ],
  body:`<!--quiz--><p class="ln tx" data-k="2"><b>1878.</b> He shifts to Medicine.</p>
        <p class="sm tx" data-k="2">Some accounts link this, in part, to his mother’s deteriorating eyesight.</p>`,
  quiz:{k:1, when:'April 1877', title:'His first course', q:'Medicine came later. What did he study first at the university?', options:['Philosophy and Letters', 'Law', 'Medicine'], answer:0,
        explain:'<b>April 1877:</b> he began in <b>Philosophy and Letters</b>.'},
  hs:[],
  media:[{type:'print', k:2, to:3, pos:'r', src:'img/ust-marker.jpg', alt:'Historical marker reading: Jose Rizal, 1861–1896, alumno de la Real y Pontificia Universidad de Santo Tomas de Manila, Filipinas, 1877–1882.',
          cap:'The marker at the University of Santo Tomas names him an alumnus. His studies there ran past 1878 — where this journey stops.'},
         {type:'develop', k:3, pos:'r', src:'img/rizal-student-1879.jpg', alt:'Photograph of the young José Rizal, captioned “a student in Manila, 1879”.',
          cap:'Rizal as a student in Manila, 1879 — one year after this journey ends.', when:'1879', title:'A face, developed'}],
  end:`<div class="end tx" data-k="4"><p class="endline">This journey ends here · 1878</p><div class="end-btns"><button type="button" class="again-btn">Be your own hero<span aria-hidden="true">↺</span></button><button type="button" class="found-btn">Moments uncovered · <span class="found-n">0</span></button></div></div>`
}
];
return SCENES;
})();
