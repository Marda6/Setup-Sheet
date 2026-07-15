/* ENCY Core — machining workspace (v3). Static data + interactions. No backend. */

const icon = (id) => `<svg><use href="#${id}"/></svg>`;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ------------------------------------------------------------- operations */
function op(id, name, type, tool, part, time, p) { return { id, name, type, tool, part, time, params: p }; }
const OPS = {
  faceMill1: op('faceMill1','Face Milling 1','Face Milling','40mm End Mill','Part 1','0:52',{n:3200,vf:1280,fz:0.20,ap:1.5,ae:30,plunge:400}),
  hole1:     op('hole1','Hole machining 1','Hole machining','8mm Drill','Part 1','0:24',{n:4200,vf:320,fz:0.04,ap:8.0,ae:8,plunge:160}),
  rough1:    op('rough1','Roughing waterline 1','Roughing waterline','16mm End Mill','Part 1','2:41',{n:3600,vf:1450,fz:0.10,ap:2.0,ae:11,plunge:500}),
  rough2:    op('rough2','Roughing waterline 2','Roughing waterline','16mm End Mill','Part 1','1:58',{n:3600,vf:1450,fz:0.10,ap:2.0,ae:11,plunge:500}),
  cont25:    op('cont25','2.5D contouring 1','2.5D contouring','8mm End Mill','Part 1','0:47',{n:5000,vf:900,fz:0.06,ap:4.0,ae:6,plunge:300}),
  p2rough0:  op('p2rough0','Roughing waterline','Roughing waterline','40mm End Mill','Part 2','3:12',{n:2400,vf:1600,fz:0.22,ap:2.5,ae:28,plunge:500}),
  p2rough1:  op('p2rough1','Roughing waterline 1','Roughing waterline','16mm End Mill','Part 2','2:05',{n:3600,vf:1450,fz:0.10,ap:2.0,ae:11,plunge:500}),
  p2cont:    op('p2cont','2D contouring 1','2D contouring','8mm End Mill','Part 2','0:39',{n:5000,vf:900,fz:0.06,ap:5.0,ae:6,plunge:300}),
  p3hole:    op('p3hole','Hole machining 1','Hole machining','8mm Drill','Part 3','0:22',{n:4200,vf:320,fz:0.04,ap:8.0,ae:8,plunge:160}),
  p3cont1:   op('p3cont1','2D contouring 1','2D contouring','8mm End Mill','Part 3','0:35',{n:5000,vf:900,fz:0.06,ap:5.0,ae:6,plunge:300}),
  p3cont2:   op('p3cont2','2D contouring 2','2D contouring','65mm Slot mill','Part 3','0:29',{n:1200,vf:480,fz:0.10,ap:3.0,ae:4,plunge:200}),
  s2face:    op('s2face','Face Milling 2','Face Milling','40mm End Mill','Part 1','0:48',{n:3200,vf:1280,fz:0.20,ap:1.5,ae:30,plunge:400}),
  s2rough:   op('s2rough','Roughing waterline 1','Roughing waterline','16mm End Mill','Part 1','1:52',{n:3600,vf:1450,fz:0.10,ap:2.0,ae:11,plunge:500}),
  s2cont:    op('s2cont','2D contouring 1','2D contouring','8mm End Mill','Part 1','0:41',{n:5000,vf:900,fz:0.06,ap:5.0,ae:6,plunge:300}),
  s2chamf:   op('s2chamf','Chamfering 1','Chamfering','8mm End Mill','Part 2','0:18',{n:6000,vf:700,fz:0.05,ap:0.6,ae:4,plunge:250}),
  s2hole:    op('s2hole','Hole machining 1','Hole machining','8mm Drill','Part 2','0:26',{n:4200,vf:320,fz:0.04,ap:8.0,ae:8,plunge:160}),
};
const FEATS = {
  'Face Milling': [['Face #1','0:26'],['Face #2','0:22']],
  'Roughing waterline': [['Open pocket #1','1:02'],['Open pocket #2','0:48'],['Profile #1','0:31']],
  'Hole machining': [['Hole #1','0:08'],['Hole #2','0:08'],['Hole #3','0:08']],
  '2.5D contouring': [['Profile #1','0:27'],['Profile #2','0:20']],
  '2D contouring': [['Profile #1','0:21'],['Profile #2','0:18']],
  'Chamfering': [['Chamfer #1','0:18']],
};

const SETUPS = [
  { id:'setup1', name:'Setup 1', wp:{x:'34.8',y:'436.7',z:'949.4',stock:'42.0 × 168.0 × 52.0 mm',fixture:'Workpiece'},
    parts:[ {name:'Part 1',ops:['faceMill1','hole1','rough1','rough2','cont25']},
            {name:'Part 2',ops:['p2rough0','p2rough1','p2cont']},
            {name:'Part 3',ops:['p3hole','p3cont1','p3cont2']} ] },
  { id:'setup2', name:'Setup 2', wp:{x:'34.8',y:'436.7',z:'78.0',stock:'42.0 × 168.0 × 52.0 mm',fixture:'Workpiece'},
    parts:[ {name:'Part 1',ops:['s2face','s2rough','s2cont']},
            {name:'Part 2',ops:['s2chamf','s2hole']} ] },
];

const TOOLS = [
  { tno:'T10', name:'40mm End Mill', kind:'End mill', dia:'40.0', flutes:2, fluteLen:'10.0', lenBelowH:'55.0', cornerRad:'—', source:'ENCY Aluminium' },
  { tno:'T62', name:'8mm End Mill', kind:'End mill', dia:'8.0', flutes:2, fluteLen:'22.0', lenBelowH:'50.0', cornerRad:'—', source:'ENCY Aluminium' },
  { tno:'T63', name:'16mm End Mill', kind:'End mill', dia:'16.0', flutes:2, fluteLen:'32.0', lenBelowH:'80.0', cornerRad:'—', source:'ENCY Aluminium' },
  { tno:'T137', name:'8mm Drill', kind:'Drill', dia:'8.0', flutes:2, fluteLen:'40.0', lenBelowH:'70.0', cornerRad:'—', source:'ENCY Drills' },
  { tno:'T138', name:'65mm Slot mill', kind:'Undercut', dia:'65.0', flutes:4, fluteLen:'6.0', lenBelowH:'90.0', cornerRad:'0.4', source:'ENCY Special' },
];
const TOOL_BY_NAME = Object.fromEntries(TOOLS.map((t) => [t.name, t]));

const CHECK = ['Machine & post configured','Work offset (G54) probed','Stock loaded & squared','Fixture / vise verified','Tools measured & loaded','Tool offsets set'];

const parseTime = (t) => { const p = t.split(':').map(Number); return p.length === 3 ? p[0]*3600+p[1]*60+p[2] : p[0]*60+p[1]; };
const fmtTime = (s) => { const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),ss=s%60,pad=(n)=>String(n).padStart(2,'0'); return h>0?`${h}:${pad(m)}:${pad(ss)}`:`${m}:${pad(ss)}`; };

/* ------------------------------------------------- shared building blocks */
const CUT_FIELDS = [
  { key:'n', label:'Spindle speed', unit:'rpm' }, { key:'vf', label:'Feed (vf)', unit:'mm/min', accent:true },
  { key:'fz', label:'Feed per tooth', unit:'mm' }, { key:'plunge', label:'Plunge feed', unit:'mm/min' },
  { key:'ap', label:'Stepdown (ap)', unit:'mm' }, { key:'ae', label:'Stepover (ae)', unit:'mm' },
];
const cutGridHTML = (p) => `<div class="cut-grid">${CUT_FIELDS.map((f) => `
  <div class="cut-field"><span class="cut-field__label">${f.label}</span>
    <div class="cut-input${f.accent?' is-accent':''}"><input value="${p[f.key]}" /><span class="unit">${f.unit}</span></div>
  </div>`).join('')}</div>`;

function editBodyHTML(o) {
  const feats = FEATS[o.type] || [];
  return `
    <div class="edit-sub">Features</div>
    <div class="feat-list">${feats.map(([n,t]) => `
      <div class="feat-row"><span class="feat-row__dot"></span><span class="feat-row__name">${n}</span><span class="feat-row__time">${t}</span><span class="feat-row__eye">${icon('i-eye')}</span></div>`).join('')}</div>
    <div class="edit-sub">Tool</div>
    <div class="tool-chip"><span class="tool-chip__dot"></span>${TOOL_BY_NAME[o.tool] ? `${TOOL_BY_NAME[o.tool].tno} · ` : ''}${o.tool}<span class="tool-chip__swap">${icon('i-undo')}</span></div>
    <div class="edit-sub">Cutting parameters</div>
    ${cutGridHTML(o.params)}
    <div class="form-foot">
      <div class="form-foot__links"><a>Show all parameters</a><a>Use existing preset</a></div>
      <div class="form-foot__btns"><button class="btn-ghost" title="Reset">${icon('i-undo')}</button><button class="btn-green">Save changes</button></div>
    </div>`;
}
function opItemHTML(id) {
  const o = OPS[id];
  return `
  <div class="op-item" data-op="${id}">
    <div class="op-item__head">
      <span class="op-item__status"></span>
      <span class="op-item__icon">${icon('op-operation')}</span>
      <div class="op-item__text"><div class="op-item__name">${o.name}</div><div class="op-item__sub">${o.type} · ${o.tool}</div></div>
      <span class="op-item__time">${o.time}</span>
      <button class="op-item__play" title="Operation parameters">${icon('i-play')}</button>
    </div>
  </div>`;
}

/* ------------------------------------------------------------- Overview */
function renderOverview() {
  $('#lp-overview').innerHTML = `
    <div class="acc"><div class="acc__head">General<span class="chev">${icon('i-chevdown')}</span></div>
      <div class="acc__body">
        <div class="kv"><span class="kv__label">Machine</span><span class="kv__value"><button class="selectish">HAAS DT-2 ${icon('i-chevdown')}</button></span></div>
        <div class="kv"><span class="kv__label">Machine type</span><span class="kv__value"><button class="selectish">3 Axis ${icon('i-chevdown')}</button></span></div>
        <div class="kv"><span class="kv__label">Machinable</span><span class="kv__value"><span class="val"><span class="dot-ok">●</span> 100%</span></span></div>
      </div></div>
    <div class="acc"><div class="acc__head">Material<span class="chev">${icon('i-chevdown')}</span></div>
      <div class="acc__body">
        <div class="kv"><span class="kv__label">Stock mode</span><span class="kv__value"><button class="selectish">Automatic ${icon('i-chevdown')}</button></span></div>
        <div class="kv"><span class="kv__label">Stock preset</span><span class="kv__value"><button class="selectish">Default stock ${icon('i-chevdown')}</button></span></div>
        <div class="kv"><span class="kv__label">Stock size</span><span class="kv__value"><span class="value-tag">42.0 × 168.0 × 52.0 mm</span></span></div>
        <div class="kv"><span class="kv__label">Part dims</span><span class="kv__value"><span class="value-tag">112 × 28 × 23 mm</span></span></div>
      </div></div>
    <div class="acc"><div class="acc__head">Workpiece setup<span class="chev">${icon('i-chevdown')}</span></div>
      <div class="acc__body">
        ${SETUPS.map((s) => `
          <div class="wp-setup">
            <div class="wp-setup__name">${s.name}</div>
            <div class="kv"><span class="kv__label">Material</span><span class="kv__value"><input class="field" placeholder="Material" /></span></div>
            <div class="kv"><span class="kv__label">Part zero</span><span class="kv__value"><span class="coord"><b>X</b>${s.wp.x}</span><span class="coord"><b>Y</b>${s.wp.y}</span><span class="coord"><b>Z</b>${s.wp.z}</span></span></div>
            <div class="kv"><span class="kv__label">Stock</span><span class="kv__value"><span class="value-tag">${s.wp.stock}</span></span></div>
            <div class="kv"><span class="kv__label">Fixture</span><span class="kv__value"><button class="linklike">${s.wp.fixture}</button></span></div>
            <div class="preview"><img src="assets/workpiece-preview.png" alt="preview" onerror="this.style.display='none'"/></div>
          </div>`).join('')}
      </div></div>
    <div class="acc"><div class="acc__head">Holes<span class="chev">${icon('i-chevdown')}</span></div>
      <div class="acc__body">
        <div class="kv"><span class="kv__label">3× ⌀8.0</span><span class="kv__value"><button class="selectish">No thread ${icon('i-chevdown')}</button></span></div>
        <div class="kv"><span class="kv__label">1× ⌀9.5</span><span class="kv__value"><button class="selectish">M10 × 1.5 ${icon('i-chevdown')}</button></span></div>
      </div></div>
    <div class="acc"><div class="acc__head">Machinability<span class="chev">${icon('i-chevdown')}</span></div>
      <div class="acc__body">
        <div class="issue">${icon('i-warn')}<div class="issue__text"><div class="issue__title">Modified blind hole #1</div><div class="issue__sub">Tip angle changed 118° → 135°</div></div></div>
      </div></div>`;
}

/* ------------------------------------------------------------- Operations */
function renderOperations() {
  $('#lp-operations').innerHTML = SETUPS.map((s) => {
    const allOps = s.parts.flatMap((p) => p.ops);
    const total = fmtTime(allOps.reduce((a,id) => a+parseTime(OPS[id].time), 0));
    const body = s.parts.map((p) => `
      <div class="sheet-part">${icon('op-part')}${p.name}</div>
      ${p.ops.map((id) => opItemHTML(id)).join('')}`).join('');
    return `
    <div class="setup-block" data-setup="${s.id}">
      <div class="setup-block__head">
        <span class="setup-block__status"></span><svg class="stg"><use href="#op-setup"/></svg>
        <span class="setup-block__name">${s.name}</span>
        <span class="setup-block__meta"><span>${allOps.length} ops</span><span>${icon('i-clock')}${total}</span></span>
        <span class="setup-block__chev">${icon('i-chevdown')}</span>
      </div>
      <div class="setup-block__body">${body}</div>
    </div>`;
  }).join('');
}

/* ------------------------------------------------------------- Tool table */
let tableView = 'tools';
function renderTable(view) {
  tableView = view;
  const host = $('#tableBody');
  if (view === 'tools') {
    host.innerHTML = `
    <table class="dtable">
      <thead><tr><th>T#</th><th>Name</th><th>Ø</th><th>Flutes</th><th>Flute len.</th><th>Len below H.</th><th>Corner rad.</th><th>Source library</th></tr></thead>
      <tbody>
        <tr class="dtable__group"><td colspan="8">Active tools (${TOOLS.length})</td></tr>
        ${TOOLS.map((t) => `
          <tr data-tool="${t.name}">
            <td><span class="tag-tno">${t.tno}</span></td>
            <td><span class="dtable__name">${icon('i-toolbit')}${t.name}</span></td>
            <td>${t.dia} mm</td><td>${t.flutes}</td><td>${t.fluteLen} mm</td><td>${t.lenBelowH} mm</td><td>${t.cornerRad}</td>
            <td><span class="src">${icon('i-warn')}${t.source}</span></td>
          </tr>`).join('')}
        <tr class="dtable__group"><td colspan="8">Unused tools (1074)</td></tr>
      </tbody>
    </table>`;
    $$('#tableBody tr[data-tool]').forEach((tr) => tr.addEventListener('click', () => {
      $$('#tableBody tr.is-selected').forEach((r) => r.classList.remove('is-selected'));
      tr.classList.add('is-selected');
    }));
  } else if (view === 'sheet') {
    const rows = SETUPS.flatMap((s) => s.parts.flatMap((p) => p.ops.map((id) => ({ id, o: OPS[id], setup: s.name }))));
    host.innerHTML = `
    <table class="dtable">
      <thead><tr><th>Operation</th><th>Setup</th><th>Tool</th><th>n, rpm</th><th>vf, mm/min</th><th>Time</th></tr></thead>
      <tbody>${rows.map((r) => `
        <tr data-op="${r.id}">
          <td><span class="dtable__name">${icon('op-operation')}${r.o.name}</span></td>
          <td>${r.setup}</td><td>${r.o.tool}</td><td>${r.o.params.n}</td><td>${r.o.params.vf}</td><td>${r.o.time}</td>
        </tr>`).join('')}</tbody>
    </table>`;
    $$('#tableBody tr[data-op]').forEach((tr) => tr.addEventListener('click', () => selectOperation(tr.dataset.op)));
  } else {
    const holes = [['⌀8.0 Hole #1','8.0 mm','12.4 mm','Through','—'],['⌀8.0 Hole #2','8.0 mm','12.4 mm','Through','—'],['⌀8.0 Hole #3','8.0 mm','12.4 mm','Through','—'],['⌀9.5 Hole #4','9.5 mm','18.0 mm','Blind','M10 × 1.5']];
    host.innerHTML = `
    <table class="dtable">
      <thead><tr><th>Feature</th><th>Ø</th><th>Depth</th><th>Type</th><th>Thread</th></tr></thead>
      <tbody>${holes.map((h) => `<tr><td><span class="dtable__name">${icon('i-target')}${h[0]}</span></td><td>${h[1]}</td><td>${h[2]}</td><td>${h[3]}</td><td>${h[4]}</td></tr>`).join('')}</tbody>
    </table>`;
  }
  $('#tableSwitchLabel').textContent = { tools:'Tool table', sheet:'Setup sheet', holes:'Holes' }[view];
  $$('#tableMenu button').forEach((b) => b.classList.toggle('is-active', b.dataset.view === view));
}

/* --------------------------------------------------- selection ↔ 3D ↔ panels */
function selectOperation(opId) {
  const o = OPS[opId];
  if (!o) return;
  $$('.op-item').forEach((r) => r.classList.remove('is-selected'));
  $$(`.op-item[data-op="${opId}"]`).forEach((r) => {
    r.classList.add('is-selected');
    r.closest('.setup-block')?.classList.remove('is-collapsed');
  });
  // details card
  $('#dcTitle').textContent = o.name;
  $('#dcBody').innerHTML = `
    <div class="details-card__row"><span class="k">Tool</span><span class="v">${o.tool}</span></div>
    <div class="details-card__row"><span class="k">Spindle</span><span class="v">${o.params.n} rpm</span></div>
    <div class="details-card__row"><span class="k">Feed</span><span class="v">${o.params.vf} mm/min</span></div>
    <div class="details-card__row"><span class="k">Cut time</span><span class="v">${o.time}</span></div>`;
  $('#detailsCard').hidden = false;
  // reflect in tool table if showing tools
  if (tableView === 'tools') {
    $$('#tableBody tr.is-selected').forEach((r) => r.classList.remove('is-selected'));
    $(`#tableBody tr[data-tool="${o.tool}"]`)?.classList.add('is-selected');
  }
  $$(`.op-item[data-op="${opId}"] .op-item__head`)[0]?.scrollIntoView({ block:'nearest' });
}

/* edit overlay: opens from the ▶ trigger on an operation row, floats next to it */
function openEdit(opId, anchorRect) {
  const o = OPS[opId];
  if (!o) return;
  selectOperation(opId);
  $('#editTitle').textContent = o.name;
  $('#editBody').innerHTML = editBodyHTML(o);
  const ep = $('#editpanel');
  ep.classList.add('is-open');
  const narrow = matchMedia('(max-width:900px)').matches;
  if (narrow) closeDrawer(); // the drawer would cover the overlay
  const lpRight = narrow ? 52 : $('#leftpanel').getBoundingClientRect().right;
  const left = Math.max(60, Math.min(lpRight + 8, innerWidth - ep.offsetWidth - 12));
  const top = Math.max(12, Math.min(anchorRect ? anchorRect.top : 80, innerHeight - ep.offsetHeight - 12));
  ep.style.left = `${left}px`;
  ep.style.top = `${top}px`;
}
function closeEdit() { $('#editpanel').classList.remove('is-open'); }

/* ---------------------------------------------------------------- wiring */
function delegateAccordions(root) {
  root.addEventListener('click', (e) => {
    const accHead = e.target.closest('.acc__head');
    if (accHead) { accHead.parentElement.classList.toggle('is-collapsed'); return; }
    const setupHead = e.target.closest('.setup-block__head');
    if (setupHead) { setupHead.parentElement.classList.toggle('is-collapsed'); return; }
    const play = e.target.closest('.op-item__play');
    if (play) {
      e.stopPropagation();
      openEdit(play.closest('.op-item').dataset.op, play.getBoundingClientRect());
      return;
    }
    const opHead = e.target.closest('.op-item__head');
    if (opHead) { selectOperation(opHead.parentElement.dataset.op); return; }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderOverview();
  renderOperations();
  renderTable('tools');

  // left tabs
  $$('.ltab').forEach((t) => t.addEventListener('click', () => {
    $$('.ltab').forEach((x) => x.classList.toggle('is-active', x === t));
    $$('.ltab-pane').forEach((p) => p.classList.toggle('is-active', p.id === `lp-${t.dataset.tab}`));
    closeEdit();
  }));

  // accordions + op items (event delegation on the whole left panel)
  delegateAccordions($('#leftpanel'));

  // table switcher menu
  const menu = $('#tableMenu');
  $('#tableSwitch').addEventListener('click', (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; });
  $$('#tableMenu button').forEach((b) => b.addEventListener('click', () => { renderTable(b.dataset.view); menu.hidden = true; }));
  document.addEventListener('click', () => { menu.hidden = true; });

  // dock collapse (clear the inline flex left by divider drags, or it wins over .is-collapsed)
  $('#collapse3d').addEventListener('click', () => {
    const p = $('#pane3d');
    p.classList.toggle('is-collapsed');
    if (p.classList.contains('is-collapsed')) p.style.flex = '';
  });
  $('#collapseTable').addEventListener('click', () => $('#paneTable').classList.toggle('is-collapsed'));

  // dock divider drag
  const dock = $('#dock'), pane3d = $('#pane3d'), divider = $('#dockDivider');
  let drag = null;
  divider.addEventListener('pointerdown', (e) => {
    drag = { y: e.clientY, h: pane3d.getBoundingClientRect().height };
    divider.setPointerCapture(e.pointerId);
  });
  divider.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const total = dock.getBoundingClientRect().height;
    const h = Math.max(120, Math.min(total - 160, drag.h + (e.clientY - drag.y)));
    pane3d.style.flex = `0 0 ${h}px`;
  });
  divider.addEventListener('pointerup', () => { drag = null; });

  // edit overlay close: X, click outside, Esc (selection stays)
  $('#editClose').addEventListener('click', closeEdit);
  document.addEventListener('pointerdown', (e) => {
    if (!$('#editpanel').classList.contains('is-open')) return;
    if (e.target.closest('#editpanel') || e.target.closest('.op-item__play')) return;
    closeEdit();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeEdit(); });
  window.addEventListener('resize', closeEdit);

  // details close + timeline
  $('#dcClose').addEventListener('click', () => { $('#detailsCard').hidden = true; });
  let playing = false;
  $('#playBtn').addEventListener('click', () => {
    playing = !playing;
    $('#playBtn').querySelector('use').setAttribute('href', playing ? '#i-close' : '#i-play');
  });

  // left drawer (tablet portrait): explicit toggle button + rail "Project" icon
  const left = $('#leftpanel'), backdrop = $('#backdrop');
  const toggleDrawer = () => {
    left.classList.toggle('is-open');
    document.body.classList.toggle('left-open', left.classList.contains('is-open'));
  };
  $('#panelToggle').addEventListener('click', toggleDrawer);
  $$('.railnav__btn')[0].addEventListener('click', toggleDrawer);
  backdrop.addEventListener('click', closeDrawer);

  // default: keep Setup 1 open, collapse Setup 2, in both panes
  $$('.setup-block[data-setup="setup2"]').forEach((b) => b.classList.add('is-collapsed'));
  selectOperation('faceMill1');
});

function closeDrawer() {
  $('#leftpanel').classList.remove('is-open');
  document.body.classList.remove('left-open');
}
