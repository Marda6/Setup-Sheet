/* ENCY Core — Setup Sheet prototype: static data + clickable interactions.
   No backend, no data fetching — everything is frozen from the reference. */

const icon = (id) => `<svg><use href="#${id}"/></svg>`;

/* ------------------------------------------------ operations tree (3D view) */
const TREE = [
  { label: 'HAAS DT-2', icon: 'op-machine', open: true, children: [
    { label: 'Setup 1', icon: 'op-setup', open: true, children: [
      { label: 'Part 1', icon: 'op-part', open: true, children: [
        { tool: true, label: 'T#10: 40mm End Mill', selected: true },
        { label: 'Face Milling 1', sub: '40mm End Mill' },
        { tool: true, label: 'T#137: 8mm Drill' },
        { label: 'Hole machining 1', sub: '8mm Drill' },
        { tool: true, label: 'T#63: 16mm End Mill' },
        { label: 'Roughing waterline 1', sub: '16mm End Mill' },
        { label: 'Roughing waterline 2', sub: '16mm End Mill' },
        { tool: true, label: 'T#62: 8mm End Mill' },
        { label: '2.5D contouring 1', sub: '8mm End Mill' },
        { tool: true, label: 'T#138: 65mm Slot mill' },
      ]},
      { label: 'Part 2', icon: 'op-part', open: true, children: [
        { label: 'Roughing waterline', sub: '40mm End Mill' },
        { label: 'Roughing waterline 1', sub: '16mm End Mill' },
        { label: '2D contouring 1', sub: '8mm End Mill' },
      ]},
      { label: 'Part 3', icon: 'op-part', open: true, children: [
        { label: 'Hole machining 1', sub: '8mm Drill' },
        { label: '2D contouring 1', sub: '8mm End Mill' },
        { label: '2D contouring 2', sub: '65mm Slot mill' },
      ]},
    ]},
  ]},
];

function renderTree(nodes, depth = 0) {
  const ul = document.createElement('ul');
  ul.className = depth === 0 ? 'tree' : 'tree-children';
  for (const node of nodes) {
    const li = document.createElement('li');
    const hasKids = !!(node.children && node.children.length);
    const row = document.createElement('div');
    row.className = 'tree-row' + (node.selected ? ' is-selected' : '');

    const caret = hasKids
      ? `<span class="tree-row__caret">${icon('i-chevdown')}</span>`
      : `<span class="tree-row__caret is-empty"></span>`;

    const glyph = node.tool
      ? `<span class="tree-row__icon tool">${icon('i-toolbit')}</span>`
      : `<span class="tree-row__icon">${icon(node.icon || 'op-operation')}</span>`;

    const label = node.sub
      ? `${node.label}<span class="sub">${node.sub}</span>`
      : node.label;

    const dot = depth >= 3 ? `<span class="tree-row__dot" style="background:var(--ec-blue-soft)"></span>` : '';

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
        document.querySelectorAll('#tree .tree-row.is-selected').forEach((r) => r.classList.remove('is-selected'));
        row.classList.add('is-selected');
      });
    }
    ul.appendChild(li);
  }
  return ul;
}

/* ------------------------------------------- operations list (setup sheet) */
const SHEET_OPS = [
  { name: 'T#10: 40mm End Mill', sub: 'Tomb group', selected: true },
  { name: 'Face Milling 1', sub: 'Face Milling · 40mm End Mill' },
  { name: 'Roughing waterline', sub: 'Roughing waterline · 40mm End Mill' },
  { name: 'T#137: 8mm Drill', sub: 'Tomb group' },
  { name: 'Hole machining 1', sub: 'Hole machining · 8mm Drill' },
  { name: 'Hole machining 1', sub: 'Hole machining · 8mm Drill' },
  { name: 'T#63: 16mm End Mill', sub: 'Tomb group' },
  { name: 'Roughing waterline 1', sub: 'Roughing waterline · 16mm End Mill' },
  { name: 'Roughing waterline 2', sub: 'Roughing waterline · 16mm End Mill' },
  { name: 'Roughing waterline 1', sub: 'Roughing waterline · 16mm End Mill' },
  { name: 'T#62: 8mm End Mill', sub: 'Tomb group' },
  { name: '2.5D contouring 1', sub: '2.5D contouring · 8mm End Mill' },
  { name: '2D contouring 1', sub: '2D contouring · 8mm End Mill' },
  { name: '2D contouring 1', sub: '2D contouring · 8mm End Mill' },
  { name: 'T#138: 65mm Slot mill', sub: 'Tomb group' },
  { name: '2D contouring 2', sub: '2D contouring · 65mm Slot mill' },
];

function renderSheetOps() {
  const wrap = document.getElementById('sheetOps');
  wrap.innerHTML = SHEET_OPS.map((o) => `
    <div class="op-card${o.selected ? ' is-selected' : ''}">
      <span class="op-card__icon">${icon('op-operation')}</span>
      <div class="op-card__text">
        <div class="op-card__name">${o.name}</div>
        <div class="op-card__sub">${o.sub}</div>
      </div>
      <span class="op-card__dot"></span>
    </div>`).join('');
  wrap.querySelectorAll('.op-card').forEach((card) => {
    card.addEventListener('click', () => {
      wrap.querySelectorAll('.op-card.is-selected').forEach((c) => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
    });
  });
}

/* --------------------------------------------------- tools & assemblies */
const P_D = 'diameter', P = 'plain';
const TOOLS = [
  { name: '40mm End Mill', kind: 'End mill', tno: 'T10', open: true,
    params: [['⌀', '40.00'], ['OAL', '55.0'], ['LOC', '10.0'], ['', 'Z2']], time: '8:37',
    draw: { d: 40, oal: 55, loc: 10, caption: 'H 55.0 · Rc 20.00', sub: 'T10 · Z2 · End mill' } },
  { name: '8mm End Mill', kind: 'End mill', tno: 'T62',
    params: [['⌀', '8.00'], ['OAL', '50.0'], ['', 'Z2']], time: '42:58' },
  { name: '16mm End Mill', kind: 'End mill', tno: 'T63',
    params: [['⌀', '16.00'], ['OAL', '80.0'], ['', 'Z2']], time: '4:36:14' },
  { name: '8mm Drill', kind: 'Drill', tno: 'T137',
    params: [['⌀', '8.00'], ['OAL', '70.0'], ['', 'Z2']], time: '0:58' },
  { name: '65mm Slot mill', kind: 'Undercut tool', tno: 'T138',
    params: [['⌀', '65.00'], ['OAL', '90.0'], ['', 'Z2']], time: '0:51' },
];

function toolDrawing(dw) {
  // simple stepped end-mill technical sketch with dimension lines
  return `
  <svg viewBox="0 0 220 200" width="200" height="182">
    <g stroke="var(--ec-fg-24)" stroke-width="1" fill="none">
      <!-- flute + shank body -->
      <rect x="86" y="40" width="48" height="120" fill="var(--ec-fg-8)" stroke="var(--ec-fg-56)"/>
      <line x1="86" y1="120" x2="134" y2="120" stroke="var(--ec-fg-24)" stroke-dasharray="3 3"/>
    </g>
    <!-- ⌀ dimension (top) -->
    <g stroke="var(--ec-fg-48)" stroke-width="1">
      <line x1="86" y1="28" x2="134" y2="28"/>
      <path d="M86 24l-4 4 4 4M134 24l4 4-4 4" fill="none"/>
    </g>
    <text x="110" y="20" text-anchor="middle" fill="var(--ec-fg-72)" font-size="11" font-family="Inter">⌀ ${dw.d}</text>
    <!-- OAL dimension (right) -->
    <g stroke="var(--ec-fg-48)" stroke-width="1">
      <line x1="150" y1="40" x2="150" y2="160"/>
      <path d="M146 40l4-4 4 4M146 160l4 4 4-4" fill="none"/>
    </g>
    <text x="164" y="104" fill="var(--ec-fg-72)" font-size="11" font-family="Inter" transform="rotate(90 164 104)" text-anchor="middle">OAL ${dw.oal}</text>
    <!-- LOC dimension (right, lower) -->
    <g stroke="var(--ec-green)" stroke-width="1">
      <line x1="138" y1="120" x2="138" y2="160"/>
    </g>
    <text x="128" y="180" fill="var(--ec-green)" font-size="10" font-family="Inter" text-anchor="middle">LOC ${dw.loc}</text>
  </svg>`;
}

function renderTools() {
  const list = document.getElementById('toolList');
  list.innerHTML = TOOLS.map((t) => {
    const params = t.params.map(([k, v]) =>
      `<span class="param">${k ? `<span style="opacity:.6">${k}</span>` : ''}${v}</span>`).join('');
    const body = t.draw ? `
      <div class="tool-card__body">
        <div class="tool-tabs">
          <button class="is-active">2D</button>
          <button>3D</button>
          <button>Holder</button>
          <button class="icon-only" title="Expand">${icon('i-expand')}</button>
        </div>
        <div class="tool-draw">
          ${toolDrawing(t.draw)}
        </div>
        <div class="tool-draw__caption">
          <div class="big">${t.draw.caption}</div>
          <div class="small">${t.draw.sub}</div>
        </div>
      </div>` : `
      <div class="tool-card__body">
        <div class="tool-tabs">
          <button class="is-active">2D</button>
          <button>3D</button>
          <button>Holder</button>
          <button class="icon-only" title="Expand">${icon('i-expand')}</button>
        </div>
        <div class="tool-draw" style="min-height:150px;color:var(--ec-fg-24);align-items:center">2D preview</div>`;
    return `
    <div class="tool-card${t.open ? ' is-open' : ''}">
      <div class="tool-card__head">
        <span class="tool-card__glyph">${icon('i-toolbit')}</span>
        <div class="tool-card__main">
          <div class="tool-card__name">${t.name}<span class="kind">${t.kind}</span></div>
          <div class="tool-card__params">
            <span class="tno">${t.tno}</span>
            ${params}
            <span class="param time">${icon('i-clock')}${t.time}</span>
          </div>
        </div>
        <span class="tool-card__chev">${icon('i-chevdown')}</span>
      </div>
      ${body}
    </div>`;
  }).join('');

  list.querySelectorAll('.tool-card').forEach((card) => {
    card.querySelector('.tool-card__head').addEventListener('click', () => card.classList.toggle('is-open'));
    card.querySelectorAll('.tool-tabs button:not(.icon-only)').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.querySelectorAll('.tool-tabs button:not(.icon-only)').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });
  });
}

/* ---------------------------------------------------------------- wiring */
function initViewToggle() {
  document.querySelectorAll('.seg__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      document.querySelectorAll('.seg__btn').forEach((b) => b.classList.toggle('is-active', b === btn));
      document.getElementById('view-3d').classList.toggle('is-active', view === '3d');
      document.getElementById('view-sheet').classList.toggle('is-active', view === 'sheet');
    });
  });
}

function initPanelCollapse() {
  const panel = document.getElementById('opsPanel');
  document.getElementById('collapsePanel').addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.add('is-collapsed');
  });
  panel.addEventListener('click', () => {
    if (panel.classList.contains('is-collapsed')) panel.classList.remove('is-collapsed');
  });
}

function initToggleGroups() {
  // generic single-active toggles: viewbar, layout-toggle
  document.querySelectorAll('.layout-toggle').forEach((group) => {
    group.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });
  });
  document.querySelectorAll('.viewbar__btn').forEach((btn) => {
    btn.addEventListener('click', () => btn.classList.toggle('is-active'));
  });
  document.querySelectorAll('.checkbox-row').forEach((row) => {
    row.addEventListener('click', () => {
      const box = row.querySelector('.box');
      const on = box.style.background === '';
      // toggle
      if (box.dataset.on === '1') { box.dataset.on = '0'; box.style.background = ''; box.innerHTML = ''; }
      else { box.dataset.on = '1'; box.style.background = 'var(--ec-green)'; box.style.borderColor = 'var(--ec-green)';
             box.innerHTML = '<svg style="width:11px;height:11px;color:#04150e"><use href="#i-check"/></svg>';
             box.style.display = 'grid'; box.style.placeItems = 'center'; }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const tree = renderTree(TREE);
  tree.id = 'tree';
  document.getElementById('tree').replaceWith(tree);
  renderSheetOps();
  renderTools();
  initViewToggle();
  initPanelCollapse();
  initToggleGroups();
});
