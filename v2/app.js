/* ENCY Core — workspace v2. Interactions are added as blocks are designed. */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const icon = (id) => `<svg><use href="#${id}"/></svg>`;

/* ----------------------------------------------------------- project data */
function op(id, name, type, tool, time, p) { return { id, name, type, tool, time, params: p }; }
const OPS = {
  faceMill1: op('faceMill1','Face Milling 1','Face Milling','40mm End Mill','0:52',{n:3200,vf:1280,fz:0.20,ap:1.5,ae:30,plunge:400}),
  hole1:     op('hole1','Hole machining 1','Hole machining','8mm Drill','0:24',{n:4200,vf:320,fz:0.04,ap:8.0,ae:8,plunge:160}),
  rough1:    op('rough1','Roughing waterline 1','Roughing waterline','16mm End Mill','2:41',{n:3600,vf:1450,fz:0.10,ap:2.0,ae:11,plunge:500}),
  rough2:    op('rough2','Roughing waterline 2','Roughing waterline','16mm End Mill','1:58',{n:3600,vf:1450,fz:0.10,ap:2.0,ae:11,plunge:500}),
  cont25:    op('cont25','2.5D contouring 1','2.5D contouring','8mm End Mill','0:47',{n:5000,vf:900,fz:0.06,ap:4.0,ae:6,plunge:300}),
  p2rough0:  op('p2rough0','Roughing waterline','Roughing waterline','40mm End Mill','3:12',{n:2400,vf:1600,fz:0.22,ap:2.5,ae:28,plunge:500}),
  p2rough1:  op('p2rough1','Roughing waterline 1','Roughing waterline','16mm End Mill','2:05',{n:3600,vf:1450,fz:0.10,ap:2.0,ae:11,plunge:500}),
  p2cont:    op('p2cont','2D contouring 1','2D contouring','8mm End Mill','0:39',{n:5000,vf:900,fz:0.06,ap:5.0,ae:6,plunge:300}),
  p3hole:    op('p3hole','Hole machining 1','Hole machining','8mm Drill','0:22',{n:4200,vf:320,fz:0.04,ap:8.0,ae:8,plunge:160}),
  p3cont1:   op('p3cont1','2D contouring 1','2D contouring','8mm End Mill','0:35',{n:5000,vf:900,fz:0.06,ap:5.0,ae:6,plunge:300}),
  p3cont2:   op('p3cont2','2D contouring 2','2D contouring','65mm Slot mill','0:29',{n:1200,vf:480,fz:0.10,ap:3.0,ae:4,plunge:200}),
  s2face:    op('s2face','Face Milling 2','Face Milling','40mm End Mill','0:48',{n:3200,vf:1280,fz:0.20,ap:1.5,ae:30,plunge:400}),
  s2rough:   op('s2rough','Roughing waterline 1','Roughing waterline','16mm End Mill','1:52',{n:3600,vf:1450,fz:0.10,ap:2.0,ae:11,plunge:500}),
  s2cont:    op('s2cont','2D contouring 1','2D contouring','8mm End Mill','0:41',{n:5000,vf:900,fz:0.06,ap:5.0,ae:6,plunge:300}),
  s2chamf:   op('s2chamf','Chamfering 1','Chamfering','8mm End Mill','0:18',{n:6000,vf:700,fz:0.05,ap:0.6,ae:4,plunge:250}),
  s2hole:    op('s2hole','Hole machining 1','Hole machining','8mm Drill','0:26',{n:4200,vf:320,fz:0.04,ap:8.0,ae:8,plunge:160}),
};
const SETUPS = [
  { id:'setup1', name:'Setup 1',
    wp:{ x:'34.8', y:'436.7', z:'949.4', stock:'42.0 × 168.0 × 52.0 mm', fixture:'Workpiece' },
    parts:[ {name:'Part 1',ops:['faceMill1','hole1','rough1','rough2','cont25']},
            {name:'Part 2',ops:['p2rough0','p2rough1','p2cont']},
            {name:'Part 3',ops:['p3hole','p3cont1','p3cont2']} ] },
  { id:'setup2', name:'Setup 2', collapsed:true,
    wp:{ x:'34.8', y:'436.7', z:'78.0', stock:'42.0 × 168.0 × 52.0 mm', fixture:'Workpiece' },
    parts:[ {name:'Part 1',ops:['s2face','s2rough','s2cont']},
            {name:'Part 2',ops:['s2chamf','s2hole']} ] },
];
/* hreg/dreg: NC register numbers (H#/D#); null = not assigned yet */
const TOOLS = [
  { tno:'T10',  name:'40mm End Mill',  kind:'End mill',      dia:40.0, shank:40, flutes:2, fluteLen:10.0, lenBelowH:55.0, oal:100.0, cornerRad:null, hreg:10,   dreg:10 },
  { tno:'T62',  name:'8mm End Mill',   kind:'End mill',      dia:8.0,  shank:8,  flutes:2, fluteLen:22.0, lenBelowH:50.0, oal:63.0,  cornerRad:null, hreg:62,   dreg:62 },
  { tno:'T63',  name:'16mm End Mill',  kind:'End mill',      dia:16.0, shank:16, flutes:2, fluteLen:32.0, lenBelowH:80.0, oal:92.0,  cornerRad:null, hreg:63,   dreg:63 },
  { tno:'T137', name:'8mm Drill',      kind:'Drill',         dia:8.0,  shank:8,  flutes:2, fluteLen:40.0, lenBelowH:70.0, oal:117.0, cornerRad:null, hreg:null, dreg:null },
  { tno:'T138', name:'65mm Slot mill', kind:'Undercut tool', dia:65.0, shank:27, flutes:4, fluteLen:6.0,  lenBelowH:90.0, oal:135.0, cornerRad:10.0, hreg:138,  dreg:138 },
];

const parseTime = (t) => { const p = t.split(':').map(Number); return p.length === 3 ? p[0]*3600+p[1]*60+p[2] : p[0]*60+p[1]; };
const fmtTime = (s) => { const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),ss=s%60,pad=(n)=>String(n).padStart(2,'0'); return h>0?`${h}:${pad(m)}:${pad(ss)}`:`${m}:${pad(ss)}`; };

/* ----------------------------------------------------- view: Operations */
/* the tool is always visible next to the operation name; the stats below
   are configurable via the sliders button */
const OP_STATS = [
  { key:'n',    label:'S'    },
  { key:'vf',   label:'F'    },
  { key:'ap',   label:'ap'   },
  { key:'ae',   label:'ae'   },
  { key:'time', label:'Time' },
];
const OP_PRESETS = [
  { id:'compact',    label:'Compact',      icon:'i-minimize', stats:[] },
  { id:'timefeeds',  label:'Time & feeds', icon:'i-clock',    stats:['n','vf','time'] },
  { id:'everything', label:'Everything',   icon:'i-sliders',  stats:OP_STATS.map((s) => s.key) },
];
let opStatsSet = new Set(OP_PRESETS.find((p) => p.id === 'compact').stats); // default: Compact
let selectedOp = null;

/* narrow panel → stats move under the name; wide → aligned columns */
function opsNeededWidth() {
  const numeric = ['n','vf','ap','ae'].filter((k) => opStatsSet.has(k)).length;
  return 240 + 100 /* tool */ + numeric * 60 + (opStatsSet.has('time') ? 44 : 0);
}
function opRowHTML(id, stacked) {
  const o = OPS[id];
  const has = (k) => opStatsSet.has(k);
  const sel = id === selectedOp ? ' is-selected' : '';
  if (!stacked) {
    const cells = [`<span class="op-cell op-cell--tool">${o.tool}</span>`];
    if (has('n'))    cells.push(`<span class="op-cell"><i>S</i>${o.params.n}</span>`);
    if (has('vf'))   cells.push(`<span class="op-cell"><i>F</i>${o.params.vf}</span>`);
    if (has('ap'))   cells.push(`<span class="op-cell"><i>ap</i>${o.params.ap}</span>`);
    if (has('ae'))   cells.push(`<span class="op-cell"><i>ae</i>${o.params.ae}</span>`);
    if (has('time')) cells.push(`<span class="op-row__time">${o.time}</span>`);
    return `
        <div class="op-row${sel}" data-op="${id}" title="${o.type} · ${o.tool}">
          <svg class="op-row__ico"><use href="#op-operation"/></svg>
          <span class="op-row__name">${o.name}</span>
          ${cells.join('')}
        </div>`;
  }
  const bits = [];
  if (has('n'))    bits.push(`S ${o.params.n}`);
  if (has('vf'))   bits.push(`F ${o.params.vf}`);
  if (has('ap'))   bits.push(`ap ${o.params.ap}`);
  if (has('ae'))   bits.push(`ae ${o.params.ae}`);
  if (has('time')) bits.push(o.time);
  if (!bits.length) return `
        <div class="op-row${sel}" data-op="${id}" title="${o.type} · ${o.tool}">
          <svg class="op-row__ico"><use href="#op-operation"/></svg>
          <span class="op-row__name">${o.name}</span>
          <span class="op-row__tool">${o.tool}</span>
        </div>`;
  return `
        <div class="op-row op-row--stack${sel}" data-op="${id}" title="${o.type} · ${o.tool}">
          <svg class="op-row__ico"><use href="#op-operation"/></svg>
          <div class="op-row__text">
            <div class="op-row__line1"><span class="op-row__name">${o.name}</span><span class="op-row__tool">${o.tool}</span></div>
            <div class="op-row__sub">${bits.join(' · ')}</div>
          </div>
        </div>`;
}
function renderOperations(panel) {
  const stacked = $('.panel__body', panel).clientWidth < opsNeededWidth();
  panel.dataset.opsStacked = stacked;
  return `<div class="optree">${SETUPS.map((s) => {
    const all = s.parts.flatMap((p) => p.ops);
    const total = fmtTime(all.reduce((a, id) => a + parseTime(OPS[id].time), 0));
    return `
    <div class="setup${s.collapsed ? ' is-collapsed' : ''}" data-setup="${s.id}">
      <div class="setup-row">
        <span class="setup-row__chev">${icon('i-chevdown')}</span>
        <svg class="setup-row__ico"><use href="#op-setup"/></svg>
        <span class="setup-row__name">${s.name}</span>
        <span class="setup-row__meta">${all.length} ops · ${total}</span>
      </div>
      <div class="setup__body">
        ${s.parts.map((p) => `
        <div class="part-row"><svg><use href="#op-part"/></svg>${p.name}</div>
        ${p.ops.map((id) => opRowHTML(id, stacked)).join('')}`).join('')}
      </div>
    </div>`; }).join('')}</div>`;
}

function opsPanel() { return $$('.panel').find((p) => p.dataset.view === 'operations'); }
function refreshOps() {
  const panel = opsPanel();
  if (panel) $('.panel__body', panel).innerHTML = renderOperations(panel);
}

function selectOperation(opId) {
  selectedOp = opId;
  $$('.op-row').forEach((r) => r.classList.remove('is-selected'));
  const row = $(`.op-row[data-op="${opId}"]`);
  if (row) {
    row.classList.add('is-selected');
    const setup = row.closest('.setup');
    if (setup) {
      setup.classList.remove('is-collapsed');
      const s = SETUPS.find((x) => x.id === setup.dataset.setup);
      if (s) s.collapsed = false;
    }
  }
}

/* display-options popover (presets + stat chips), shared by the Operations
   and Tool table views — each brings its own stat model */
function renderStatsMenu(view) {
  const menu = $('#statsMenu');
  const isTools = view === 'tools';
  const STATS = isTools ? TOOL_STATS : OP_STATS;
  const PRESETS = isTools ? TOOL_PRESETS : OP_PRESETS;
  const set = isTools ? toolStatsSet : opStatsSet;
  const refresh = isTools ? refreshTools : refreshOps;
  const active = PRESETS.find((p) =>
    p.stats.length === set.size && p.stats.every((k) => set.has(k)))?.id;
  menu.innerHTML = `
    <div class="statsmenu__label">Preset</div>
    ${PRESETS.map((p) => `
    <button class="statsmenu__preset${p.id === active ? ' is-active' : ''}" data-preset="${p.id}">${icon(p.icon)}${p.label}${p.hint ? `<span class="statsmenu__sub">${p.hint}</span>` : ''}</button>`).join('')}
    <div class="hmenu__sep"></div>
    <div class="statsmenu__label">Customize</div>
    <div class="statsmenu__chips">${STATS.map((s) => `
      <button class="chip${set.has(s.key) ? ' is-active' : ''}" data-stat="${s.key}">${s.label}</button>`).join('')}</div>
    <div class="statsmenu__hint">${isTools
      ? 'H = tool length · Rc = cutter radius (⌀/2) · H#/D# = NC register numbers.'
      : 'Pick which stats appear on each operation.'}</div>`;
  $$('#statsMenu [data-preset]').forEach((b) => b.addEventListener('click', () => {
    const stats = new Set(PRESETS.find((p) => p.id === b.dataset.preset).stats);
    if (isTools) toolStatsSet = stats; else opStatsSet = stats;
    renderStatsMenu(view); refresh();
  }));
  $$('#statsMenu [data-stat]').forEach((b) => b.addEventListener('click', () => {
    const st = isTools ? toolStatsSet : opStatsSet;
    st.has(b.dataset.stat) ? st.delete(b.dataset.stat) : st.add(b.dataset.stat);
    renderStatsMenu(view); refresh();
  }));
}

/* -------------------------------------------------------- view: Overview */
const kvRow = (label, value) => `<div class="kv"><span class="kv__label">${label}</span><span class="kv__value">${value}</span></div>`;
const selectish = (v) => `<button class="selectish"><span>${v}</span>${icon('i-chevdown')}</button>`;
const valueTag = (v) => `<span class="value-tag">${v}</span>`;

function renderOverview() {
  return `<div class="overview">
    <div class="acc">
      <div class="acc__head">General<span class="chev">${icon('i-chevdown')}</span></div>
      <div class="acc__body">
        ${kvRow('Machine', selectish('HAAS DT-2'))}
        ${kvRow('Machine type', selectish('3 Axis'))}
        ${kvRow('Machinable', `<span class="val-ok">● 100%</span>`)}
      </div>
    </div>
    <div class="acc">
      <div class="acc__head">Material<span class="chev">${icon('i-chevdown')}</span></div>
      <div class="acc__body">
        ${kvRow('Stock mode', selectish('Automatic'))}
        ${kvRow('Stock preset', selectish('Default stock'))}
        ${kvRow('Stock size', valueTag('42.0 × 168.0 × 52.0 mm'))}
        ${kvRow('Part dims', valueTag('112 × 28 × 23 mm'))}
      </div>
    </div>
    <div class="acc">
      <div class="acc__head">Setups<span class="chev">${icon('i-chevdown')}</span></div>
      <div class="acc__body">
        ${SETUPS.map((s) => kvRow(s.name, selectish(s.wp.fixture))).join('')}
      </div>
    </div>
    <div class="acc">
      <div class="acc__head">Holes<span class="chev">${icon('i-chevdown')}</span></div>
      <div class="acc__body">
        ${kvRow('3× ⌀8.0', selectish('No thread'))}
        ${kvRow('1× ⌀9.5', selectish('M10 × 1.5'))}
      </div>
    </div>
    <div class="acc">
      <div class="acc__head">Machinability<span class="chev">${icon('i-chevdown')}</span></div>
      <div class="acc__body">
        <div class="issue">${icon('i-warn')}<div class="issue__text">
          <div class="issue__title">Modified blind hole #1</div>
          <div class="issue__sub">Tip angle changed 118° → 135°</div>
        </div></div>
      </div>
    </div>
  </div>`;
}

/* ------------------------------------------------------ view: Tool table */
/* two representations: a data table and Tool & Assembly blocks with a 2D/3D preview */
let toolsMode = 'table';
let selectedTool = null;
const toolPreviewMode = {};      // tno → '2d' | '3d' (default 2d)
const toolOpen = { T10: true };  // which assembly blocks are expanded

const toolTime = (name) =>
  fmtTime(Object.values(OPS).filter((o) => o.tool === name).reduce((a, o) => a + parseTime(o.time), 0));
const num = (n) => String(+n.toFixed(1)); // 40 → "40", 0.4 → "0.4"

/* one stat model drives both representations: the spec grid on the assembly
   blocks and columns of the table */
const TOOL_STATS = [
  { key:'dia',  label:'⌀',    val:(t) => t.dia.toFixed(2),        cell:(t) => `${t.dia.toFixed(2)} mm` },
  { key:'oal',  label:'OAL',  val:(t) => t.oal.toFixed(1),        cell:(t) => `${t.oal.toFixed(1)} mm` },
  { key:'loc',  label:'LOC',  val:(t) => t.fluteLen.toFixed(1),   cell:(t) => `${t.fluteLen.toFixed(1)} mm` },
  { key:'z',    label:'Z',    val:(t) => t.flutes,                cell:(t) => t.flutes },
  { key:'time', label:'Time', val:(t) => toolTime(t.name),        cell:(t) => toolTime(t.name) },
  { key:'h',    label:'H',    val:(t) => num(t.oal),              cell:(t) => `${t.oal.toFixed(1)} mm` },
  { key:'rc',   label:'Rc',   val:(t) => (t.dia / 2).toFixed(2),  cell:(t) => `${(t.dia / 2).toFixed(2)} mm` },
  { key:'hreg', label:'H#',   val:(t) => t.hreg ?? '—',           cell:(t) => t.hreg ?? '—' },
  { key:'dreg', label:'D#',   val:(t) => t.dreg ?? '—',           cell:(t) => t.dreg ?? '—' },
];
const TOOL_PRESETS = [
  { id:'presetting', label:'Tool presetting', hint:'on the machine', icon:'i-bolt',    stats:['dia','oal','z','h'] },
  { id:'offsets',    label:'Control offsets', hint:'into the CNC',   icon:'i-hash',    stats:['h','rc','hreg','dreg'] },
  { id:'everything', label:'Everything',      hint:'',               icon:'i-sliders', stats:TOOL_STATS.map((s) => s.key) },
];
let toolStatsSet = new Set(TOOL_PRESETS.find((p) => p.id === 'presetting').stats);

/* 2D: engineering drawing of the tool itself (no holder) with ⌀ / OAL
   dimensions and an R leader, all driven by the real numbers */
function tool2D(t) {
  const isDrill = t.kind.includes('Drill'), isSlot = t.kind.includes('Undercut');
  const W = 132, H = 120, cx = 78;
  const s = 86 / t.oal, yA = 24, yB = yA + t.oal * s;
  const dw = Math.max(t.dia * s, 6), sw = Math.max(t.shank * s, 5);
  const fl = Math.min(Math.max(t.fluteLen * s, 4), yB - yA - 4);
  const tip = isDrill ? dw * 0.3 : 0;
  const xL = cx - dw / 2, xR = cx + dw / 2;
  const yFeat = isSlot ? yB - fl : yA;                       // top of the measured (widest) feature
  const yDim = 13;                                           // ⌀ dimension line
  const xDim = cx - Math.max(dw, sw) / 2 - 12;               // OAL dimension line
  const uid = `d${t.tno}`;

  const cut = isDrill
    ? `<rect x="${xL.toFixed(1)}" y="${(yB - fl).toFixed(1)}" width="${dw.toFixed(1)}" height="${(fl - tip).toFixed(1)}" class="s3"/>
       <path d="M${xL.toFixed(1)},${(yB - tip).toFixed(1)} L${xR.toFixed(1)},${(yB - tip).toFixed(1)} L${cx},${yB.toFixed(1)} Z" class="s3"/>`
    : `<rect x="${xL.toFixed(1)}" y="${(yB - fl).toFixed(1)}" width="${dw.toFixed(1)}" height="${fl.toFixed(1)}" class="s3"/>`;

  const rlead = t.cornerRad ? `
    <line x1="${(xR - 1).toFixed(1)}" y1="${(yB - 1).toFixed(1)}" x2="${(xR + 12).toFixed(1)}" y2="${(yB - 13).toFixed(1)}" class="dim"/>
    <text x="${(xR + 14).toFixed(1)}" y="${(yB - 15).toFixed(1)}" class="dimt">R ${num(t.cornerRad)}</text>` : '';

  return `<svg class="toolpv toolpv--2d" viewBox="0 0 ${W} ${H}">
    <defs><marker id="${uid}a" viewBox="0 0 8 8" refX="1" refY="4" markerWidth="7" markerHeight="7"
      orient="auto-start-reverse"><path d="M1 4l6.5-2.6v5.2z" style="fill:var(--ec-fg-64)"/></marker></defs>
    <line x1="${cx}" y1="${yA - 5}" x2="${cx}" y2="${(yB + 5).toFixed(1)}" style="stroke:var(--ec-fg-16)" stroke-dasharray="7 3 1.5 3"/>
    <rect x="${(cx - sw / 2).toFixed(1)}" y="${yA}" width="${sw.toFixed(1)}" height="${(yB - yA - fl).toFixed(1)}" class="s2"/>
    ${cut}
    <line x1="${xL.toFixed(1)}" y1="${(yFeat - 2).toFixed(1)}" x2="${xL.toFixed(1)}" y2="${yDim - 3}" class="dim"/>
    <line x1="${xR.toFixed(1)}" y1="${(yFeat - 2).toFixed(1)}" x2="${xR.toFixed(1)}" y2="${yDim - 3}" class="dim"/>
    <line x1="${xL.toFixed(1)}" y1="${yDim}" x2="${xR.toFixed(1)}" y2="${yDim}" class="dim"
      marker-start="url(#${uid}a)" marker-end="url(#${uid}a)"/>
    <text x="${cx}" y="${yDim - 4}" text-anchor="middle" class="dimt">⌀ ${num(t.dia)}</text>
    <line x1="${(xDim - 4).toFixed(1)}" y1="${yA}" x2="${(cx - sw / 2 - 2).toFixed(1)}" y2="${yA}" class="dim"/>
    <line x1="${(xDim - 4).toFixed(1)}" y1="${yB.toFixed(1)}" x2="${(xL - 2).toFixed(1)}" y2="${yB.toFixed(1)}" class="dim"/>
    <line x1="${xDim.toFixed(1)}" y1="${yA}" x2="${xDim.toFixed(1)}" y2="${yB.toFixed(1)}" class="dim"
      marker-start="url(#${uid}a)" marker-end="url(#${uid}a)"/>
    <text transform="rotate(-90 ${(xDim - 5).toFixed(1)} ${((yA + yB) / 2).toFixed(1)})"
      x="${(xDim - 5).toFixed(1)}" y="${((yA + yB) / 2).toFixed(1)}" text-anchor="middle" class="dimt">OAL ${num(t.oal)}</text>
    ${rlead}
  </svg>`;
}

/* 3D: shaded render with the holder stub */
function tool3D(t) {
  const isDrill = t.kind.includes('Drill'), isSlot = t.kind.includes('Undercut');
  const W = 96, H = 120, cx = W / 2, y0 = 8;
  const s = 96 / (22 + t.lenBelowH);                   // 22 mm holder stub
  const hh = 22 * s, below = t.lenBelowH * s;
  const dw = Math.max(t.dia * s, 6);
  const fl = Math.min(Math.max(t.fluteLen * s, 6), below - 4);
  const sw = isSlot ? Math.max(t.shank * s, 8) : dw;
  const tip = isDrill ? dw * 0.3 : 0;
  const yNeck = y0 + hh, yTip = yNeck + below, yF = yTip - fl;
  const uid = `tp${t.tno}`;
  const n = Math.min(t.flutes, 4);
  let helix = '';
  for (let i = 0; i < n; i++) {
    const yy = yF + ((i + 0.5) / n) * (fl - tip);
    helix += `<line x1="${(cx - dw / 2).toFixed(1)}" y1="${(yy + fl * 0.16).toFixed(1)}" x2="${(cx + dw / 2).toFixed(1)}" y2="${(yy - fl * 0.16).toFixed(1)}"/>`;
  }
  return `<svg class="toolpv" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="${uid}m" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#3f464a"/><stop offset=".3" stop-color="#b6c0c5"/>
        <stop offset=".55" stop-color="#7c868b"/><stop offset="1" stop-color="#2f3538"/>
      </linearGradient>
      <linearGradient id="${uid}h" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#23282a"/><stop offset=".35" stop-color="#5b6467"/><stop offset="1" stop-color="#1c2022"/>
      </linearGradient>
    </defs>
    <path d="M${cx - 22},${y0} L${cx + 22},${y0} L${cx + 15},${yNeck.toFixed(1)} L${cx - 15},${yNeck.toFixed(1)} Z" fill="url(#${uid}h)"/>
    <rect x="${(cx - sw / 2).toFixed(1)}" y="${yNeck.toFixed(1)}" width="${sw.toFixed(1)}" height="${(below - fl).toFixed(1)}" fill="url(#${uid}m)"/>
    <rect x="${(cx - dw / 2).toFixed(1)}" y="${yF.toFixed(1)}" width="${dw.toFixed(1)}" height="${(fl - tip).toFixed(1)}" fill="url(#${uid}m)"/>
    ${isDrill ? `<path d="M${(cx - dw / 2).toFixed(1)},${(yTip - tip).toFixed(1)} L${(cx + dw / 2).toFixed(1)},${(yTip - tip).toFixed(1)} L${cx},${yTip.toFixed(1)} Z" fill="url(#${uid}m)"/>` : ''}
    <g stroke="rgba(10,12,12,.45)" stroke-width="1.2">${helix}</g>
  </svg>`;
}

const toolSVG = (t, mode) => (mode === '3d' ? tool3D(t) : tool2D(t));
const toolCapHTML = (t) => `<div class="tool__cap">
  <b>H ${num(t.oal)} · Rc ${(t.dia / 2).toFixed(2)}</b>
  <span>${t.tno} · Z${t.flutes} · ${t.kind}</span></div>`;

function toolBlockHTML(t) {
  const mode = toolPreviewMode[t.tno] || '2d';
  const open = !!toolOpen[t.tno];
  const sel = t.tno === selectedTool ? ' is-selected' : '';
  const specs = TOOL_STATS.filter((s) => toolStatsSet.has(s.key))
    .map((s) => `<span class="tspec"><i>${s.label}</i>${s.val(t)}</span>`).join('');
  return `
  <div class="tool${open ? '' : ' is-collapsed'}${sel}" data-tool="${t.tno}">
    <div class="tool__head">
      <div class="tool__idcol">${icon('i-toolbit')}<span>${t.tno}</span></div>
      <div class="tool__text">
        <div class="tool__line1"><span class="tool__name" title="${t.name}">${t.name}</span><span class="tool__kind">${t.kind}</span></div>
        ${specs ? `<div class="tool__specs">${specs}</div>` : ''}
      </div>
      <span class="tool__chev">${icon('i-chevdown')}</span>
    </div>
    <div class="tool__body">
      <div class="tool__modes">
        <div class="seg">
          <button class="${mode === '2d' ? 'is-active' : ''}" data-pmode="2d">2D</button>
          <button class="${mode === '3d' ? 'is-active' : ''}" data-pmode="3d">3D</button>
        </div>
        <button class="tool__holder" disabled title="No holder assigned">Holder</button>
        <button class="tool__expand" title="Expand preview">${icon('i-expand')}</button>
      </div>
      <div class="tool__preview">${toolSVG(t, mode)}${toolCapHTML(t)}</div>
    </div>
  </div>`;
}

function openToolZoom(tno) {
  const t = TOOLS.find((x) => x.tno === tno);
  const el = document.createElement('div');
  el.className = 'toolzoom';
  el.innerHTML = `<div class="toolzoom__card">${toolSVG(t, toolPreviewMode[tno] || '2d')}${toolCapHTML(t)}</div>`;
  el.addEventListener('click', () => el.remove());
  document.body.appendChild(el);
}

function renderTools() {
  if (toolsMode === 'cards') {
    return `<div class="toolsx">${TOOLS.map(toolBlockHTML).join('')}</div>`;
  }
  const cols = TOOL_STATS.filter((s) => toolStatsSet.has(s.key));
  return `<table class="dtable">
    <thead><tr><th>T#</th><th>Name</th>${cols.map((c) => `<th>${c.label}</th>`).join('')}</tr></thead>
    <tbody>
      ${TOOLS.map((t) => `
      <tr data-tool="${t.tno}"${t.tno === selectedTool ? ' class="is-selected"' : ''}>
        <td><span class="tag-tno">${t.tno}</span></td>
        <td><span class="dtable__name">${icon('i-toolbit')}${t.name}</span></td>
        ${cols.map((c) => `<td>${c.cell(t)}</td>`).join('')}
      </tr>`).join('')}
    </tbody>
  </table>`;
}

function refreshTools() {
  const panel = $$('.panel').find((p) => p.dataset.view === 'tools');
  if (panel) $('.panel__body', panel).innerHTML = renderTools();
}

function selectTool(tno) {
  selectedTool = tno;
  $$('[data-tool]').forEach((el) => el.classList.toggle('is-selected', el.dataset.tool === tno));
}

/* ----------------------------------------------------------- view: Setup */
/* workpiece setup per setup: material, part zero, stock, fixture + preview */
function renderSetupView() {
  return `<div class="overview">${SETUPS.map((s) => `
    <div class="acc">
      <div class="acc__head">${s.name}<span class="chev">${icon('i-chevdown')}</span></div>
      <div class="acc__body">
        ${kvRow('Part zero', `<span class="coord"><b>X</b>${s.wp.x}</span><span class="coord"><b>Y</b>${s.wp.y}</span><span class="coord"><b>Z</b>${s.wp.z}</span>`)}
        ${kvRow('Stock', valueTag(s.wp.stock))}
        ${kvRow('Fixture', `<button class="linklike">${s.wp.fixture}</button>`)}
        <div class="preview"><div class="ghost">3D view</div></div>
      </div>
    </div>`).join('')}</div>`;
}

/* ------------------------------------------------ panel views (combobox) */
const VIEWS = [
  { id: 'overview',   label: 'Overview',   icon: 'i-grid-view' },
  { id: 'setup',      label: 'Setup',      icon: 'op-setup' },
  { id: 'operations', label: 'Operations', icon: 'op-operation' },
  { id: 'tools',      label: 'Tool table', icon: 'i-toolbit' },
  { id: 'viewer',     label: '3D Viewer',  icon: 'i-cube' },
];
const viewById = (id) => VIEWS.find((v) => v.id === id);

const VIEW_RENDERERS = { operations: renderOperations, overview: renderOverview, tools: renderTools, setup: renderSetupView };

function setPanelView(panel, viewId) {
  const v = viewById(viewId);
  panel.dataset.view = viewId;
  $('.panel__switch', panel).innerHTML =
    `<span>${v.label}</span><svg class="caret">${icon('i-chevdown').slice(5)}`;
  $$('.panel__menu button', panel).forEach((b) => b.classList.toggle('is-active', b.dataset.view === viewId));
  const vlabel = $('.panel__vlabel', panel);
  if (vlabel) vlabel.textContent = v.label;
  const settings = $('.panel__settings', panel);
  if (settings) settings.hidden = viewId !== 'operations' && viewId !== 'tools';
  const mode = $('.panel__mode', panel);
  if (mode) {
    mode.hidden = viewId !== 'tools';
    $$('button', mode).forEach((b) => b.classList.toggle('is-active', b.dataset.tmode === toolsMode));
  }
  const render = VIEW_RENDERERS[viewId];
  $('.panel__body', panel).innerHTML = render ? render(panel) : `<div class="ghost">${v.label}</div>`;
}

function togglePanel(panel) {
  const collapsed = panel.classList.toggle('is-collapsed');
  if (panel.classList.contains('panel--left')) {
    // keep the dragged width across collapse/expand
    if (collapsed) { panel._w = panel.style.width; panel.style.width = ''; }
    else panel.style.width = panel._w || '';
  } else {
    // clear inline flex from divider drags so the remaining panel fills the column
    const other = $$('.rightcol .panel').find((p) => p !== panel);
    if (collapsed) {
      // only one right panel may be collapsed: collapsing this one expands the other
      other.classList.remove('is-collapsed');
      panel.style.flex = ''; other.style.flex = '';
    } else {
      panel.style.flex = ''; other.style.flex = '';
    }
  }
}

function initPanelHead(panel) {
  const head = $('.panel__head', panel);
  head.innerHTML = `
    <button class="panel__collapse" title="Collapse panel"><svg class="ic-min"><use href="#i-minimize"/></svg><svg class="ic-exp"><use href="#i-maximize"/></svg></button>
    <span class="panel__sep"></span>
    <button class="panel__switch"></button>
    <div class="panel__menu" hidden>${VIEWS.map((v) => `
      <button data-view="${v.id}">${v.label}</button>`).join('')}</div>
    <span class="panel__hspacer"></span>
    <div class="panel__mode" hidden>
      <button data-tmode="table" title="Table view"><svg><use href="#i-rows"/></svg></button>
      <button data-tmode="cards" title="Card view"><svg><use href="#i-grid-view"/></svg></button>
    </div>
    <button class="panel__settings" title="List display options" hidden>${icon('i-sliders')}</button>`;
  $$('.panel__mode button', panel).forEach((b) => b.addEventListener('click', () => {
    if (toolsMode === b.dataset.tmode) return;
    toolsMode = b.dataset.tmode;
    $$('.panel__mode button', panel).forEach((x) => x.classList.toggle('is-active', x.dataset.tmode === toolsMode));
    refreshTools();
  }));
  $('.panel__settings', panel).addEventListener('click', (e) => {
    e.stopPropagation();
    const menu = $('#statsMenu');
    const open = menu.hidden;
    $$('.panel__menu').forEach((m) => { m.hidden = true; });
    if (open) {
      renderStatsMenu(panel.dataset.view);
      menu.hidden = false;
      const r = e.currentTarget.getBoundingClientRect();
      menu.style.left = `${Math.max(8, Math.min(r.left, innerWidth - menu.offsetWidth - 8))}px`;
      menu.style.top = `${r.bottom + 4}px`;
    } else menu.hidden = true;
  });
  $('.panel__collapse', panel).addEventListener('click', () => togglePanel(panel));
  $('.panel__vlabel', panel)?.addEventListener('click', () => togglePanel(panel));

  // operations tree + overview accordions (delegated — body re-renders on view switch)
  $('.panel__body', panel).addEventListener('click', (e) => {
    const acc = e.target.closest('.acc__head');
    if (acc) { acc.parentElement.classList.toggle('is-collapsed'); return; }
    const srow = e.target.closest('.setup-row');
    if (srow) {
      const el = srow.parentElement;
      el.classList.toggle('is-collapsed');
      const s = SETUPS.find((x) => x.id === el.dataset.setup);
      if (s) s.collapsed = el.classList.contains('is-collapsed');
      return;
    }
    const orow = e.target.closest('.op-row');
    if (orow) { selectOperation(orow.dataset.op); return; }
    // tool table / assembly blocks
    const pmode = e.target.closest('[data-pmode]');
    if (pmode) {
      toolPreviewMode[pmode.closest('.tool').dataset.tool] = pmode.dataset.pmode;
      refreshTools();
      return;
    }
    const exp = e.target.closest('.tool__expand');
    if (exp) { openToolZoom(exp.closest('.tool').dataset.tool); return; }
    const thead = e.target.closest('.tool__head');
    if (thead) {
      const block = thead.closest('.tool'), tno = block.dataset.tool;
      toolOpen[tno] = !toolOpen[tno];
      block.classList.toggle('is-collapsed', !toolOpen[tno]);
      selectTool(tno);
      return;
    }
    const trow = e.target.closest('[data-tool]');
    if (trow) selectTool(trow.dataset.tool);
  });
  const menu = $('.panel__menu', panel);
  $('.panel__switch', panel).addEventListener('click', (e) => {
    e.stopPropagation();
    const open = menu.hidden;
    $$('.panel__menu').forEach((m) => { m.hidden = true; });
    if (open) {
      menu.hidden = false; // show first so its height is measurable
      const r = e.currentTarget.getBoundingClientRect();
      const mh = menu.offsetHeight;
      // opens downward; flips up when it would run past the viewport
      const top = r.bottom + 4 + mh > innerHeight ? r.top - 4 - mh : r.bottom + 4;
      menu.style.left = `${Math.min(r.left, innerWidth - menu.offsetWidth - 8)}px`;
      menu.style.top = `${Math.max(8, top)}px`;
    }
  });
  $$('.panel__menu button', panel).forEach((b) => b.addEventListener('click', () => {
    const target = b.dataset.view, current = panel.dataset.view;
    if (target !== current) {
      // the view is already shown in another panel — swap the two panels
      const other = $$('.panel').find((p) => p !== panel && p.dataset.view === target);
      if (other) setPanelView(other, current);
      setPanelView(panel, target);
    }
    // picking a view in a collapsed panel means "show it" — expand
    if (panel.classList.contains('is-collapsed')) togglePanel(panel);
    menu.hidden = true;
  }));
  setPanelView(panel, panel.dataset.view);
}

/* ------------------------------------------------------ draggable dividers */
function makeDraggable(divider, onDrag) {
  let start = null, moved = false;
  divider.addEventListener('pointerdown', (e) => {
    start = { ...onDrag.start(e), x0: e.clientX, y0: e.clientY };
    moved = false;
    divider.classList.add('is-active');
    divider.setPointerCapture(e.pointerId);
  });
  divider.addEventListener('pointermove', (e) => {
    if (!start) return;
    if (Math.abs(e.clientX - start.x0) + Math.abs(e.clientY - start.y0) > 3) moved = true;
    if (moved) onDrag.move(e, start);
  });
  const end = () => {
    if (start && !moved) onDrag.click?.(); // plain click on the divider
    start = null;
    divider.classList.remove('is-active');
  };
  divider.addEventListener('pointerup', end);
  divider.addEventListener('pointercancel', end);
}

const MIN_W = 260;  // shared: left panel and right column can't go narrower
const MIN_H = 100;  // top/bottom panels can't go shorter

document.addEventListener('DOMContentLoaded', () => {
  $$('.panel').forEach(initPanelHead);
  document.addEventListener('click', () => {
    $$('.panel__menu').forEach((m) => { m.hidden = true; });
    $('#moreMenu').hidden = true;
    $('#membersPanel').hidden = true;
    $('#statsMenu').hidden = true;
  });
  $('#statsMenu').addEventListener('click', (e) => e.stopPropagation());

  // auto table ↔ stacked layout for the operations list on panel resize
  const ro = new ResizeObserver((entries) => {
    for (const en of entries) {
      const panel = en.target;
      if (panel.dataset.view !== 'operations' || panel.classList.contains('is-collapsed')) continue;
      const body = $('.panel__body', panel);
      const stacked = body.clientWidth < opsNeededWidth();
      if (String(stacked) !== panel.dataset.opsStacked) body.innerHTML = renderOperations(panel);
    }
  });
  $$('.panel').forEach((p) => ro.observe(p));

  // header "more" dropdown
  const moreBtn = $('#moreBtn'), moreMenu = $('#moreMenu');
  moreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = moreMenu.hidden;
    $$('.panel__menu').forEach((m) => { m.hidden = true; });
    if (open) {
      moreMenu.hidden = false;
      const r = moreBtn.getBoundingClientRect();
      moreMenu.style.left = `${r.right - moreMenu.offsetWidth}px`;
      moreMenu.style.top = `${r.bottom + 4}px`;
    } else moreMenu.hidden = true;
  });
  $$('#moreMenu button').forEach((b) => b.addEventListener('click', () => { moreMenu.hidden = true; }));

  // project details popover (members)
  const membersBtn = $('#membersBtn'), membersPanel = $('#membersPanel');
  membersBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = membersPanel.hidden;
    $$('.panel__menu').forEach((m) => { m.hidden = true; });
    moreMenu.hidden = true;
    if (open) {
      membersPanel.hidden = false;
      const r = membersBtn.getBoundingClientRect();
      membersPanel.style.left = `${Math.max(8, r.right - membersPanel.offsetWidth)}px`;
      membersPanel.style.top = `${r.bottom + 6}px`;
    } else membersPanel.hidden = true;
  });
  membersPanel.addEventListener('click', (e) => e.stopPropagation());
  $('#pdClose').addEventListener('click', () => { membersPanel.hidden = true; });
  $('#pdMore').addEventListener('click', (e) => {
    const hiddenBlock = $('.pdetails__hidden');
    const open = hiddenBlock.hidden;
    hiddenBlock.hidden = !open;
    e.currentTarget.classList.toggle('is-open', open);
    e.currentTarget.lastChild.textContent = open ? 'Show less' : '+2 more';
  });
  $$('.inforow__copy').forEach((b) => b.addEventListener('click', () => {
    navigator.clipboard?.writeText(b.dataset.copy);
    b.querySelector('use').setAttribute('href', '#i-check');
    setTimeout(() => b.querySelector('use').setAttribute('href', '#i-copy'), 1200);
  }));

  const left = $('#leftPanel'), topP = $('#topPanel'), main = $('.main');

  makeDraggable($('#dividerV'), {
    start: (e) => ({ x: e.clientX, w: left.getBoundingClientRect().width }),
    move: (e, s) => {
      left.classList.remove('is-collapsed'); // dragging re-opens a collapsed panel
      const content = main.clientWidth - 20;             // minus .main padding
      const max = content - 10 - MIN_W;                  // divider + right minimum
      left.style.width = `${Math.max(MIN_W, Math.min(max, s.w + (e.clientX - s.x)))}px`;
    },
    click: () => { if (left.classList.contains('is-collapsed')) togglePanel(left); },
  });

  const bottomP = $('#bottomPanel');
  makeDraggable($('#dividerH'), {
    start: (e) => ({ y: e.clientY, h: topP.getBoundingClientRect().height }),
    move: (e, s) => {
      // dragging re-opens whichever right panel is collapsed
      topP.classList.remove('is-collapsed');
      bottomP.classList.remove('is-collapsed');
      const total = topP.parentElement.getBoundingClientRect().height;
      const h = Math.max(MIN_H, Math.min(total - MIN_H - 10, s.h + (e.clientY - s.y)));
      topP.style.flex = `0 0 ${h}px`;
    },
    click: () => {
      if (topP.classList.contains('is-collapsed')) togglePanel(topP);
      else if (bottomP.classList.contains('is-collapsed')) togglePanel(bottomP);
    },
  });
});
