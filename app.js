/* ENCY Core — unified machining workspace prototype.
   Static data + clickable interactions. No backend. */

const icon = (id) => `<svg><use href="#${id}"/></svg>`;
const $ = (sel, root = document) => root.querySelector(sel);

/* --------------------------------------------------------- operation data */
// Cutting params are representative values for the design prototype.
function op(id, name, type, tool, part, time, p) {
  return { id, name, type, tool, part, time, params: p };
}
const OPS = {
  faceMill1:  op('faceMill1',  'Face Milling 1',     'Face Milling',    '40mm End Mill', 'Part 1', '0:52', { n: 3200, vf: 1280, fz: 0.20, ap: 1.5, ae: 30, plunge: 400 }),
  hole1:      op('hole1',      'Hole machining 1',   'Hole machining',  '8mm Drill',     'Part 1', '0:24', { n: 4200, vf: 320,  fz: 0.04, ap: 8.0, ae: 8,  plunge: 160 }),
  rough1:     op('rough1',     'Roughing waterline 1','Roughing waterline','16mm End Mill','Part 1', '2:41', { n: 3600, vf: 1450, fz: 0.10, ap: 2.0, ae: 11, plunge: 500 }),
  rough2:     op('rough2',     'Roughing waterline 2','Roughing waterline','16mm End Mill','Part 1', '1:58', { n: 3600, vf: 1450, fz: 0.10, ap: 2.0, ae: 11, plunge: 500 }),
  cont25:     op('cont25',     '2.5D contouring 1',  '2.5D contouring', '8mm End Mill',  'Part 1', '0:47', { n: 5000, vf: 900,  fz: 0.06, ap: 4.0, ae: 6,  plunge: 300 }),
  p2rough0:   op('p2rough0',   'Roughing waterline', 'Roughing waterline','40mm End Mill','Part 2', '3:12', { n: 2400, vf: 1600, fz: 0.22, ap: 2.5, ae: 28, plunge: 500 }),
  p2rough1:   op('p2rough1',   'Roughing waterline 1','Roughing waterline','16mm End Mill','Part 2', '2:05', { n: 3600, vf: 1450, fz: 0.10, ap: 2.0, ae: 11, plunge: 500 }),
  p2cont:     op('p2cont',     '2D contouring 1',    '2D contouring',   '8mm End Mill',  'Part 2', '0:39', { n: 5000, vf: 900,  fz: 0.06, ap: 5.0, ae: 6,  plunge: 300 }),
  p3hole:     op('p3hole',     'Hole machining 1',   'Hole machining',  '8mm Drill',     'Part 3', '0:22', { n: 4200, vf: 320,  fz: 0.04, ap: 8.0, ae: 8,  plunge: 160 }),
  p3cont1:    op('p3cont1',    '2D contouring 1',    '2D contouring',   '8mm End Mill',  'Part 3', '0:35', { n: 5000, vf: 900,  fz: 0.06, ap: 5.0, ae: 6,  plunge: 300 }),
  p3cont2:    op('p3cont2',    '2D contouring 2',    '2D contouring',   '65mm Slot mill','Part 3', '0:29', { n: 1200, vf: 480,  fz: 0.10, ap: 3.0, ae: 4,  plunge: 200 }),
};

/* --------------------------------------------------------- operations tree */
const TREE = [
  { label: 'HAAS DT-2', icon: 'op-machine', open: true, children: [
    { label: 'Setup 1', icon: 'op-setup', open: true, children: [
      { label: 'Part 1', icon: 'op-part', open: true, children: [
        { tool: 'T10',  label: 'T#10: 40mm End Mill' },
        { op: 'faceMill1', label: 'Face Milling 1', sub: '40mm End Mill' },
        { tool: 'T137', label: 'T#137: 8mm Drill' },
        { op: 'hole1', label: 'Hole machining 1', sub: '8mm Drill' },
        { tool: 'T63',  label: 'T#63: 16mm End Mill' },
        { op: 'rough1', label: 'Roughing waterline 1', sub: '16mm End Mill' },
        { op: 'rough2', label: 'Roughing waterline 2', sub: '16mm End Mill' },
        { tool: 'T62',  label: 'T#62: 8mm End Mill' },
        { op: 'cont25', label: '2.5D contouring 1', sub: '8mm End Mill' },
        { tool: 'T138', label: 'T#138: 65mm Slot mill' },
      ]},
      { label: 'Part 2', icon: 'op-part', open: true, children: [
        { op: 'p2rough0', label: 'Roughing waterline', sub: '40mm End Mill' },
        { op: 'p2rough1', label: 'Roughing waterline 1', sub: '16mm End Mill' },
        { op: 'p2cont', label: '2D contouring 1', sub: '8mm End Mill' },
      ]},
      { label: 'Part 3', icon: 'op-part', open: true, children: [
        { op: 'p3hole', label: 'Hole machining 1', sub: '8mm Drill' },
        { op: 'p3cont1', label: '2D contouring 1', sub: '8mm End Mill' },
        { op: 'p3cont2', label: '2D contouring 2', sub: '65mm Slot mill' },
      ]},
    ]},
  ]},
];

const TOOL_INDEX = { T10: 0, T62: 1, T63: 2, T137: 3, T138: 4 };

function renderTree(nodes, depth = 0) {
  const ul = document.createElement('ul');
  ul.className = depth === 0 ? 'tree' : 'tree-children';
  for (const node of nodes) {
    const li = document.createElement('li');
    const hasKids = !!(node.children && node.children.length);
    const row = document.createElement('div');
    row.className = 'tree-row';
    if (node.op) row.dataset.op = node.op;

    const caret = hasKids
      ? `<span class="tree-row__caret">${icon('i-chevdown')}</span>`
      : `<span class="tree-row__caret is-empty"></span>`;
    const glyph = node.tool
      ? `<span class="tree-row__icon tool">${icon('i-toolbit')}</span>`
      : `<span class="tree-row__icon">${icon(node.icon || 'op-operation')}</span>`;
    const label = node.sub ? `${node.label}<span class="sub">${node.sub}</span>` : node.label;
    const dot = (node.op || node.tool) ? `<span class="tree-row__dot" style="background:var(--ec-blue-soft)"></span>` : '';
    row.innerHTML = `${caret}${glyph}<span class="tree-row__label">${label}</span>${dot}`;
    li.appendChild(row);

    if (hasKids) {
      const kids = renderTree(node.children, depth + 1);
      if (!node.open) { row.classList.add('is-collapsed'); kids.classList.add('is-collapsed'); }
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        row.classList.toggle('is-collapsed');
        kids.classList.toggle('is-collapsed');
      });
      li.appendChild(kids);
    } else {
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        if (node.op) selectOperation(node.op, row);
        else if (node.tool) openTool(TOOL_INDEX[node.tool]);
      });
    }
    ul.appendChild(li);
  }
  return ul;
}

/* ----------------------------------------------- selection ↔ inspector ↔ 3D */
function selectOperation(opId, rowEl) {
  const o = OPS[opId];
  if (!o) return;
  document.querySelectorAll('#tree .tree-row.is-selected').forEach((r) => r.classList.remove('is-selected'));
  (rowEl || document.querySelector(`#tree .tree-row[data-op="${opId}"]`))?.classList.add('is-selected');

  // op banner
  $('#opName').textContent = o.name;
  $('#opSub').textContent = `${o.type} · ${o.tool} · ${o.part}`;

  // cutting params
  renderCutGrid(o.params);

  // floating details card over 3D
  $('#dcTitle').textContent = o.name;
  $('#dcBody').innerHTML = `
    <div class="details-card__row"><span class="k">Tool</span><span class="v">${o.tool}</span></div>
    <div class="details-card__row"><span class="k">Spindle</span><span class="v">${o.params.n} rpm</span></div>
    <div class="details-card__row"><span class="k">Feed</span><span class="v">${o.params.vf} mm/min</span></div>
    <div class="details-card__row"><span class="k">Cut time</span><span class="v">${o.time}</span></div>`;
  $('#detailsCard').hidden = false;

  // make sure the Setup tab is showing and inspector open on tablet
  switchTab('setup');
  if (document.body.classList.contains('mobile')) openDrawer('insp');
}

const CUT_FIELDS = [
  { key: 'n',      label: 'Spindle speed', unit: 'rpm',    accent: false },
  { key: 'vf',     label: 'Feed (vf)',     unit: 'mm/min', accent: true },
  { key: 'fz',     label: 'Feed per tooth',unit: 'mm',     accent: false },
  { key: 'plunge', label: 'Plunge feed',   unit: 'mm/min', accent: false },
  { key: 'ap',     label: 'Stepdown (ap)', unit: 'mm',     accent: false },
  { key: 'ae',     label: 'Stepover (ae)', unit: 'mm',     accent: false },
];
function renderCutGrid(p) {
  $('#cutGrid').innerHTML = CUT_FIELDS.map((f) => `
    <div class="cut-field">
      <span class="cut-field__label">${f.label}</span>
      <div class="cut-input${f.accent ? ' is-accent' : ''}">
        <input value="${p[f.key]}" />
        <span class="unit">${f.unit}</span>
      </div>
    </div>`).join('');
}

/* --------------------------------------------------- tools & assemblies */
const TOOLS = [
  { name: '40mm End Mill', kind: 'End mill', tno: 'T10', open: true,
    params: [['⌀', '40.00'], ['OAL', '55.0'], ['LOC', '10.0'], ['', 'Z2']], time: '8:37',
    draw: { d: 40, oal: 55, loc: 10, caption: 'H 55.0 · Rc 20.00', sub: 'T10 · Z2 · End mill' },
    used: [['Face Milling 1', 'Setup 1']] },
  { name: '8mm End Mill', kind: 'End mill', tno: 'T62',
    params: [['⌀', '8.00'], ['OAL', '50.0'], ['', 'Z2']], time: '42:58',
    used: [['2.5D contouring 1', 'Setup 1'], ['2D contouring 1', 'Setup 1']] },
  { name: '16mm End Mill', kind: 'End mill', tno: 'T63',
    params: [['⌀', '16.00'], ['OAL', '80.0'], ['', 'Z2']], time: '4:36:14',
    used: [['Roughing waterline 1', 'Setup 1'], ['Roughing waterline 2', 'Setup 1']] },
  { name: '8mm Drill', kind: 'Drill', tno: 'T137',
    params: [['⌀', '8.00'], ['OAL', '70.0'], ['', 'Z2']], time: '0:58',
    used: [['Hole machining 1', 'Setup 1']] },
  { name: '65mm Slot mill', kind: 'Undercut tool', tno: 'T138',
    params: [['⌀', '65.00'], ['OAL', '90.0'], ['', 'Z2']], time: '0:51',
    used: [['2D contouring 2', 'Setup 1']] },
];

function toolDrawing(dw) {
  return `
  <svg viewBox="0 0 220 200" width="190" height="172">
    <rect x="86" y="40" width="48" height="120" fill="var(--ec-fg-8)" stroke="var(--ec-fg-56)"/>
    <line x1="86" y1="120" x2="134" y2="120" stroke="var(--ec-fg-24)" stroke-dasharray="3 3"/>
    <g stroke="var(--ec-fg-48)" stroke-width="1"><line x1="86" y1="28" x2="134" y2="28"/>
      <path d="M86 24l-4 4 4 4M134 24l4 4-4 4" fill="none"/></g>
    <text x="110" y="20" text-anchor="middle" fill="var(--ec-fg-72)" font-size="11" font-family="Inter">⌀ ${dw.d}</text>
    <g stroke="var(--ec-fg-48)" stroke-width="1"><line x1="150" y1="40" x2="150" y2="160"/>
      <path d="M146 40l4-4 4 4M146 160l4 4 4-4" fill="none"/></g>
    <text x="164" y="104" fill="var(--ec-fg-72)" font-size="11" font-family="Inter" transform="rotate(90 164 104)" text-anchor="middle">OAL ${dw.oal}</text>
    <line x1="138" y1="120" x2="138" y2="160" stroke="var(--ec-green)" stroke-width="1"/>
    <text x="126" y="180" fill="var(--ec-green)" font-size="10" font-family="Inter" text-anchor="middle">LOC ${dw.loc}</text>
  </svg>`;
}

function renderTools() {
  const list = $('#toolList');
  list.innerHTML = TOOLS.map((t, i) => {
    const params = t.params.map(([k, v]) =>
      `<span class="param">${k ? `<span style="opacity:.6">${k}</span>` : ''}${v}</span>`).join('');
    const used = (t.used || []).map(([n, s]) =>
      `<div class="where-used__row"><span class="dot"></span>${n}<span class="setup">${s}</span></div>`).join('');
    const drawBlock = t.draw
      ? `<div class="tool-draw">${toolDrawing(t.draw)}</div>
         <div class="tool-draw__caption"><div class="big">${t.draw.caption}</div><div class="small">${t.draw.sub}</div></div>`
      : `<div class="tool-draw" style="min-height:150px;color:var(--ec-fg-24);align-items:center">2D preview</div>`;
    return `
    <div class="tool-card${t.open ? ' is-open' : ''}" data-i="${i}">
      <div class="tool-card__head">
        <span class="tool-card__glyph">${icon('i-toolbit')}</span>
        <div class="tool-card__main">
          <div class="tool-card__name">${t.name}<span class="kind">${t.kind}</span></div>
          <div class="tool-card__params"><span class="tno">${t.tno}</span>${params}<span class="param time">${icon('i-clock')}${t.time}</span></div>
        </div>
        <span class="tool-card__chev">${icon('i-chevdown')}</span>
      </div>
      <div class="tool-card__body">
        <div class="tool-tabs">
          <button class="is-active">2D</button><button>3D</button><button>Holder</button>
          <button class="icon-only" title="Expand">${icon('i-expand')}</button>
        </div>
        ${drawBlock}
        <div class="section__title" style="margin-top:14px">Where used</div>
        <div class="where-used">${used}</div>
      </div>
    </div>`;
  }).join('');

  list.querySelectorAll('.tool-card').forEach((card) => {
    card.querySelector('.tool-card__head').addEventListener('click', () => card.classList.toggle('is-open'));
    card.querySelectorAll('.tool-tabs button:not(.icon-only)').forEach((btn) =>
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.querySelectorAll('.tool-tabs button:not(.icon-only)').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      }));
  });
}

function openTool(i) {
  switchTab('tools');
  const card = document.querySelector(`.tool-card[data-i="${i}"]`);
  if (card) {
    document.querySelectorAll('.tool-card.is-open').forEach((c) => { if (c !== card) c.classList.remove('is-open'); });
    card.classList.add('is-open');
    card.scrollIntoView({ block: 'nearest' });
  }
  if (document.body.classList.contains('mobile')) openDrawer('insp');
}

/* ---------------------------------------------------------------- checklist */
const CHECKLIST = [
  'Machine & post configured', 'Work offset (G54) probed', 'Stock loaded & squared',
  'Fixture / vise verified', 'Tools measured & loaded', 'Tool offsets set',
  'First-article inspection', 'Program dry-run OK',
];
function renderChecklist() {
  $('#checkList').innerHTML = CHECKLIST.map((c) => `
    <div class="check-item is-done">
      <span class="check-item__box">${icon('i-check')}</span>
      <span class="check-item__text">${c}</span>
    </div>`).join('');
  $('#checkList').querySelectorAll('.check-item').forEach((it) =>
    it.addEventListener('click', () => it.classList.toggle('is-done')));
}

/* ---------------------------------------------------------------- tabs */
function switchTab(tab) {
  document.querySelectorAll('.insp__tab').forEach((t) => t.classList.toggle('is-active', t.dataset.tab === tab));
  document.querySelectorAll('.insp-pane').forEach((p) => p.classList.toggle('is-active', p.id === `pane-${tab}`));
}

/* ---------------------------------------------------------------- drawers */
function openDrawer(which) {
  document.body.classList.add(which === 'tree' ? 'tree-open' : 'insp-open');
  $('#treePanel').classList.toggle('is-open', which === 'tree');
}
function closeDrawers() {
  document.body.classList.remove('tree-open', 'insp-open');
  $('#treePanel').classList.remove('is-open');
}
function syncMobile() {
  document.body.classList.toggle('mobile', window.matchMedia('(max-width: 1180px)').matches);
}

/* ---------------------------------------------------------------- init */
document.addEventListener('DOMContentLoaded', () => {
  const tree = renderTree(TREE);
  tree.id = 'tree';
  $('#tree').replaceWith(tree);
  renderTools();
  renderChecklist();

  // inspector tabs
  document.querySelectorAll('.insp__tab').forEach((t) =>
    t.addEventListener('click', () => switchTab(t.dataset.tab)));

  // tree collapse (desktop) / rail expand
  const ws = $('#workspace');
  $('#collapseTree').addEventListener('click', () => ws.classList.add('tree-collapsed'));
  $('#expandTree').addEventListener('click', () => ws.classList.remove('tree-collapsed'));

  // drawer toggles (tablet)
  $('#openTree').addEventListener('click', () => openDrawer('tree'));
  $('#openInsp').addEventListener('click', () => openDrawer('insp'));
  $('#closeInsp').addEventListener('click', closeDrawers);
  $('#backdrop').addEventListener('click', closeDrawers);

  // details card close
  $('#dcClose').addEventListener('click', () => { $('#detailsCard').hidden = true; });

  // timeline play toggle (cosmetic)
  let playing = false;
  $('#playBtn').addEventListener('click', () => {
    playing = !playing;
    $('#playBtn').querySelector('use').setAttribute('href', playing ? '#i-close' : '#i-play');
  });

  // default selection
  selectOperation('faceMill1');

  syncMobile();
  window.addEventListener('resize', syncMobile);
});
