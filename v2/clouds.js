/* ============================================================================
   ENCY Core — v2 Clouds (projects listing): demo data + rendering + filters.
   ========================================================================= */
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ================================================================ DATA === */
/* vis: public | my; shared marks "Shared with me"; upd/created drive sorting;
   cols lists the collections the project belongs to (feeds the in-collection page) */
const PROJECTS = [
  { name: 'Swarf_AutoSyncLine',                vis: 'public', upd: '2026-07-24T10:14', created: '2026-07-20', thumb: 'block', cols: ['5x milling'] },
  { name: 'Swarf_SyncByMech',                  vis: 'public', upd: '2026-07-24T10:14', created: '2026-07-19', thumb: 'ball', cols: ['5x milling'] },
  { name: 'Copy of Sequential machining (WIP)', vis: 'my',    upd: '2026-07-10T11:24', created: '2026-07-10', thumb: 'lever', p3d: true, cols: ['ENCY 3'] },
  { name: 'Sequential machining (WIP)',        vis: 'public', upd: '2026-06-29T14:06', created: '2026-06-04', thumb: 'lever', starred: true, open: true, p3d: true, cols: ['ENCY 3'] },
  { name: '5D Roughing waterline',             vis: 'public', upd: '2026-06-23T10:50', created: '2026-06-20', thumb: 'tray', p3d: true, cols: ['ENCY 3', '3x milling'] },
  { name: 'Tabs',                              vis: 'public', upd: '2026-06-22T14:07', created: '2026-06-18', thumb: 'bracket', cols: ['ENCY 3', 'Woodworking'] },
  { name: 'Mounting Plate_tuner',              vis: 'public', upd: '2026-06-16T14:44', created: '2026-06-12', thumb: 'plate', starred: true, cols: ['Tuner 3x milling', '3x milling'] },
  { name: '2D contouring_tuner',               vis: 'public', upd: '2026-06-16T14:38', created: '2026-06-12', thumb: 'block', cols: ['Tuner 3x milling', '3x milling'] },
  { name: 'Optimize_Feed_in_Cross_Holes_tuner', vis: 'public', upd: '2026-06-16T14:19', created: '2026-06-11', thumb: 'plate', cols: ['Tuner 3x milling', 'FBM Examples'] },
  { name: 'Corner_control_tuner',              vis: 'public', upd: '2026-06-16T13:38', created: '2026-06-11', thumb: 'bracket', cols: ['Tuner 3x milling', '3x milling'] },
  { name: 'Through_point_tuner',               vis: 'public', upd: '2026-06-16T12:05', created: '2026-06-10', thumb: 'fork', cols: ['Tuner 5x milling'] },
  { name: 'Contact Points_tuner',              vis: 'public', upd: '2026-06-16T11:57', created: '2026-06-10', thumb: 'lever', cols: ['Tuner 5x milling'] },
  { name: 'Extend surface_tuner',              vis: 'public', upd: '2026-06-15T12:09', created: '2026-06-09', thumb: 'tray', cols: ['Tuner 5x milling', '5x milling'] },
  { name: 'impeller_5ax_tuner',                vis: 'public', upd: '2026-06-15T12:09', created: '2026-06-09', thumb: 'impeller', starred: true, p3d: true, cols: ['Tuner 5x milling', '5x milling'] },
  { name: 'Swarf_strategy',                    vis: 'public', upd: '2026-06-12T14:54', created: '2026-06-05', thumb: 'tray', p3d: true, cols: ['5x milling', 'ENCY 3'] },
  { name: 'Bushing_bore_tuner',                vis: 'public', upd: '2026-06-10T09:41', created: '2026-06-02', thumb: 'cyl', cols: ['FBM Examples', '3x milling'] },
  { name: 'Flange_adapter',                    vis: 'my',     upd: '2026-06-08T16:20', created: '2026-05-28', thumb: 'cyl', cols: ['FBM Examples', 'Robot Welding'] },
  { name: 'Vise_soft_jaws',                    vis: 'my',     upd: '2026-06-05T11:02', created: '2026-05-22', thumb: 'block', cols: ['Woodworking'] },
  { name: 'Fixture_test_setup',                vis: 'my',     upd: '2026-06-03T09:15', created: '2026-05-20', thumb: 'plate', cols: ['Probing collection', 'Robot Welding'] },
  { name: 'Cover_plate_rev2',                  vis: 'my',     upd: '2026-06-02T17:40', created: '2026-05-19', thumb: 'bracket', cols: ['Probing collection', 'Woodworking'] },
  { name: 'Turbine_blade_demo',                vis: 'public', shared: true, upd: '2026-06-02T13:15', created: '2026-05-18', thumb: 'impeller', cols: ['5x milling', 'ENCY 3'] },
];
const colProjects = (name) => PROJECTS.filter((p) => p.cols?.includes(name));

/* collections: color is the identity; the project count and the preview
   circles are derived live from PROJECTS.cols membership */
/* bright reference palette (Ruslan's colors) — the cards are the one
   deliberately vivid spot of the dark UI */
const COLLECTIONS = [
  { name: 'Tuner 3x milling',   color: '#eb84e0', upd: '2026-06-16T14:44', created: '2026-04-02', owner: 'Ilnar Galiullin' },
  { name: 'Tuner 5x milling',   color: '#8fe57e', upd: '2026-06-16T12:09', created: '2026-04-02', owner: 'Ilnar Galiullin' },
  { name: 'ENCY 3',             color: '#d9eb84', upd: '2026-06-05T16:34', created: '2026-03-18', owner: 'ENCY Team' },
  { name: 'Woodworking',        color: '#ebda84', upd: '2026-04-27T18:03', created: '2026-03-02', owner: 'ENCY Team' },
  { name: 'Probing collection', color: '#84ebb8', upd: '2026-04-24T11:32', created: '2026-02-24', owner: 'ENCY Team' },
  { name: '5x milling',         color: '#eb84b4', upd: '2026-04-17T12:44', created: '2026-02-10', owner: 'ENCY Team' },
  { name: '3x milling',         color: '#ff7072', upd: '2026-04-17T12:43', created: '2026-02-10', owner: 'ENCY Team' },
  { name: 'Robot Welding',      color: '#84e5eb', upd: '2026-04-17T12:14', created: '2026-02-08', owner: 'Ilnar Galiullin' },
  { name: 'FBM Examples',       color: '#84c9eb', upd: '2026-04-17T12:01', created: '2026-02-08' },
];

/* inbox: demo notifications tied to the project-page cast + one live invite */
const INBOX = {
  ntf: [
    { av: 'RT', color: '#9584eb', html: '<b>Ravil Test</b> updated <b>Sequential machining (WIP)</b>', time: 'Jun 29, 2026 · 14:32', unread: true },
    { av: 'AK', color: '#ff7072', html: '<b>Andrei Kharatsidi</b> commented in the chat of <b>Sequential machining (WIP)</b>', time: 'Jun 28, 2026 · 09:12', unread: true },
    { av: 'KE', color: '#ebda84', html: '<b>Kate Esseeva</b> duplicated <b>Mounting Plate_tuner</b>', time: 'Jun 16, 2026 · 15:02', unread: false },
  ],
  inv: [
    { av: 'KB', color: '#84c9eb', html: '<b>Kirill Belousov</b> invited you to <b>Tabs</b>', time: 'Jun 22, 2026 · 14:10', kind: 'project', unread: true },
    { av: 'IG', color: '#84ebb8', html: '<b>Ilnar Galiullin</b> invited you to the collection <b>5x milling</b>', time: 'Jun 20, 2026 · 09:48', kind: 'collection', unread: true },
  ],
};

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function fmtUpd(iso) {
  const [d, t] = iso.split('T');
  const [y, m, day] = d.split('-').map(Number);
  return `${MON[m - 1]} ${day}, ${y}${t ? ` · ${t}` : ''}`;
}

/* ---- parametric part thumbnails (flat shading, fixed artwork tones) ---- */
const PT = { top: '#c2c7c9', mid: '#969c9f', dark: '#5f6568', ext: '#6d7376',
  cav: '#3a3f42', floor: '#2c3133', hole: '#191c1d' };
const THUMBS = {
  block: `
    <polygon points="80,14 138,43 80,72 22,43" fill="${PT.top}"/>
    <polygon points="22,43 80,72 80,92 22,63" fill="${PT.mid}"/>
    <polygon points="138,43 80,72 80,92 138,63" fill="${PT.dark}"/>
    <polygon points="80,26 116,44 80,62 44,44" fill="${PT.cav}"/>
    <polygon points="80,32 104,44 80,56 56,44" fill="${PT.floor}"/>
    <ellipse cx="80" cy="44" rx="10" ry="5" fill="${PT.hole}"/>`,
  ball: `
    <defs><radialGradient id="gball" cx="38%" cy="30%" r="78%">
      <stop offset="0" stop-color="#cdd2d4"/><stop offset=".65" stop-color="#8f9598"/>
      <stop offset="1" stop-color="#63696c"/></radialGradient></defs>
    <circle cx="80" cy="52" r="37" fill="url(#gball)"/>
    <ellipse cx="80" cy="22.5" rx="16" ry="6.5" fill="${PT.cav}"/>
    <ellipse cx="80" cy="23.5" rx="11" ry="4.4" fill="${PT.hole}"/>`,
  lever: `
    <g fill="${PT.ext}" transform="translate(0,7)">
      <circle cx="46" cy="50" r="20"/><circle cx="122" cy="42" r="11"/>
      <polygon points="56,33 120,32 126,50 54,68"/>
    </g>
    <g fill="${PT.top}">
      <circle cx="46" cy="50" r="20"/><circle cx="122" cy="42" r="11"/>
      <polygon points="56,33 120,32 126,50 54,68"/>
    </g>
    <circle cx="46" cy="50" r="9" fill="${PT.hole}"/>
    <circle cx="122" cy="42" r="4.5" fill="${PT.hole}"/>`,
  plate: `
    <rect x="28" y="37" width="104" height="36" rx="8" fill="${PT.ext}"/>
    <rect x="28" y="30" width="104" height="36" rx="8" fill="${PT.top}"/>
    <circle cx="52" cy="48" r="6" fill="${PT.hole}"/>
    <circle cx="80" cy="48" r="6" fill="${PT.hole}"/>
    <circle cx="108" cy="48" r="6" fill="${PT.hole}"/>`,
  cyl: `
    <defs><linearGradient id="gcyl" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7e8487"/><stop offset=".4" stop-color="#c9ced0"/>
      <stop offset=".8" stop-color="#8f9598"/><stop offset="1" stop-color="#63696c"/></linearGradient></defs>
    <rect x="56" y="28" width="48" height="46" fill="url(#gcyl)"/>
    <ellipse cx="80" cy="74" rx="24" ry="9" fill="url(#gcyl)"/>
    <ellipse cx="80" cy="28" rx="24" ry="9" fill="${PT.top}"/>
    <ellipse cx="80" cy="28" rx="13" ry="5" fill="${PT.hole}"/>`,
  impeller: `
    <g>
      ${[0, 60, 120, 180, 240, 300].map((a, i) => `
      <path d="M80,50 Q86,24 106,17 Q110,33 95,46 Z"
        fill="${i % 2 ? PT.mid : '#b6bcbe'}" transform="rotate(${a} 80 50)"/>`).join('')}
      <circle cx="80" cy="50" r="14" fill="#ccd1d3"/>
      <circle cx="80" cy="50" r="5" fill="${PT.hole}"/>
    </g>`,
  tray: `
    <polygon points="80,12 140,42 80,72 20,42" fill="${PT.top}"/>
    <polygon points="80,22 122,42 80,62 38,42" fill="${PT.cav}"/>
    <polygon points="80,30 106,42 80,54 54,42" fill="${PT.floor}"/>
    <polygon points="20,42 80,72 80,90 20,60" fill="${PT.mid}"/>
    <polygon points="140,42 80,72 80,90 140,60" fill="${PT.dark}"/>`,
  fork: `
    <rect x="64" y="40" width="32" height="42" rx="4" fill="${PT.mid}"/>
    <rect x="52" y="12" width="56" height="32" rx="8" fill="${PT.top}"/>
    <rect x="72" y="12" width="16" height="28" rx="4" fill="${PT.hole}"/>
    <circle cx="61" cy="28" r="5" fill="${PT.hole}"/>
    <circle cx="99" cy="28" r="5" fill="${PT.hole}"/>`,
  bracket: `
    <path d="M34,24 h34 v28 h50 v26 h-84 Z" fill="${PT.ext}" transform="translate(0,7)"/>
    <path d="M34,24 h34 v28 h50 v26 h-84 Z" fill="${PT.top}"/>
    <circle cx="51" cy="40" r="5" fill="${PT.hole}"/>
    <circle cx="100" cy="65" r="5" fill="${PT.hole}"/>`,
};
const partSVG = (kind) => `<svg class="part" viewBox="0 0 160 100">${THUMBS[kind] || THUMBS.block}</svg>`;

/* ================================================================ STATE === */
const SCOPES = {
  all:     { title: 'All projects',        filter: () => true },
  my:      { title: 'My projects',         filter: (p) => p.vis === 'my' },
  shared:  { title: 'Shared with me',      filter: (p) => p.shared },
  archive: { title: 'Archive',             filter: () => false },
  starred: { title: 'Starred projects',    filter: (p) => p.starred },
  chats:       { title: 'Chats',               chats: true },
  'col-all':     { title: 'Collections',         collections: () => true },
  'col-my':      { title: 'My collections',      collections: (c) => c.mine },
  'col-starred': { title: 'Starred collections', collections: (c) => c.starred },
  incol:   { title: '', filter: (p) => p.cols?.includes(state.col) },
  mobile:  { title: 'Mobile app',          qr: true },
  settings: { title: 'Account settings',   settings: true },
};
const state = { scope: 'all', q: '', mode: 'grid', sort: 'updated',
  chat: 1, chatTag: null, c3dFull: false, c3dOn: true, chatPane: 'list',
  composerAtts: [], col: null, colFrom: 'col-all' };

/* project-page cast, shared by chats and the inbox */
const MEMBERS = {
  KB: { name: 'Kirill Belousov', color: '#84c9eb' },
  AK: { name: 'Andrei Kharatsidi', color: '#ff7072' },
  RT: { name: 'Ravil Test', color: '#9584eb' },
  KE: { name: 'Kate Esseeva', color: '#ebda84' },
  me: { name: 'Ruslan M', color: '#84ebb8' },
};

/* chats live on projects; unread counters are per chat */
const CHATS = [
  { id: 1, project: 'Sequential machining (WIP)', thumb: 'lever', members: 5, unread: 2, msgs: [
    { from: 'RT', text: 'Updated the fixture offsets for Setup 2, please re-check the part zero.', time: '14:32',
      tags: ['setup'], att: { kind: 'file', name: 'setup2_offsets.pdf', size: '84 KB' } },
    { from: 'me', text: 'Looks right now, thanks.', time: '14:40' },
    { from: 'KB', text: 'Roughing waterline 2 leaves marks near the boss — maybe tighten the stepover?', time: '15:05',
      tags: ['feeds'], att: { kind: 'image', name: 'roughing_marks.png', size: '1.2 MB', art: 'tray' } },
    { from: 'KB', text: 'And T63 could take a bit more feed on the finishing pass.', time: '15:06', tags: ['feeds'] },
  ] },
  { id: 2, project: 'Copy of Sequential machining (WIP)', thumb: 'lever', members: 2, unread: 0, msgs: [
    { from: 'me', text: 'Keeping this copy for the feeds experiment.', time: 'Jul 10' },
  ] },
  { id: 3, project: 'Tabs', thumb: 'bracket', members: 3, unread: 1, msgs: [
    { from: 'AK', text: 'Can we hold the tabs at 0.8 mm? 1.2 is a pain to file off.', time: 'Jun 22' },
  ] },
  { id: 4, project: 'Mounting Plate_tuner', thumb: 'plate', members: 4, unread: 0, msgs: [
    { from: 'KE', text: 'Cross holes are within tolerance on the second run.', time: 'Jun 16' },
    { from: 'me', text: 'Great, freezing the parameters then.', time: 'Jun 16' },
  ] },
  { id: 5, project: 'impeller_5ax_tuner', thumb: 'impeller', members: 3, unread: 0, msgs: [
    { from: 'AK', text: 'Swarf pass gouges at the root fillet, sending a screenshot to the chat.', time: 'Jun 15',
      att: { kind: 'image', name: 'root_fillet.png', size: '940 KB', art: 'impeller' } },
    { from: 'me', text: 'Try the lead angle at 8 degrees, worked on the demo blade.', time: 'Jun 15' },
  ] },
];

/* filters are a showcase of the control set: chips update, cards stay (the
   demo data has no machine/operation attributes to filter by) */
const FILTERS = [
  { id: 'mtype', label: 'Machine type', def: 'Any', single: ['Any', 'Milling', 'Turning', 'Mill-turn', 'Wire EDM'] },
  { id: 'model', input: 'Machine model' },
  { id: 'dealer', label: 'Provided by', def: 'Any dealer', single: ['Any dealer', 'ENCY', 'HAAS Factory Outlet', 'DMG MORI', 'Hermle Service'] },
  { id: 'ops', label: 'Operations', multi: ['2D contouring', 'Drilling', 'Pocketing', 'Swarf machining', '5-axis roughing', 'Waterline finishing'] },
  { id: 'tools', label: 'Tools', multi: ['Flat end mill', 'Ball end mill', 'Chamfer mill', 'Drill', 'Tap'] },
  { id: 'axes', label: 'Axes', multi: ['3-axis', '4-axis', '5-axis'] },
  { id: 'tags', label: 'Tags', multi: ['tuner', 'strategy', 'demo', 'wip'] },
];
const fstate = {}; // id -> string (single) | Set (multi)
FILTERS.forEach((f) => { fstate[f.id] = f.multi ? new Set() : (f.def || ''); });

const SORTS = [
  { id: 'updated', label: 'Last updated' },
  { id: 'name',    label: 'Name' },
  { id: 'created', label: 'Date created' },
];

/* ================================================================ RENDER === */
function visibleProjects() {
  const sc = SCOPES[state.scope];
  let list = PROJECTS.filter(sc.filter || (() => true));
  if (state.q) list = list.filter((p) => p.name.toLowerCase().includes(state.q));
  list = [...list];
  if (state.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  else if (state.sort === 'created') list.sort((a, b) => b.created.localeCompare(a.created));
  else list.sort((a, b) => b.upd.localeCompare(a.upd));
  return list;
}

function badge(p) {
  if (p.shared) return `<span class="pcard__badge"><svg><use href="#i-users"/></svg>Shared</span>`;
  if (p.vis === 'my') return `<span class="pcard__badge"><svg><use href="#i-user"/></svg>My project</span>`;
  return `<span class="pcard__badge"><svg><use href="#i-globe"/></svg>Public</span>`;
}
const starIco = (on) => `<svg><use href="#i-star${on ? '-fill' : ''}"/></svg>`;
const p3dIco = (p) => p.p3d
  ? `<span class="pcard__p3d" title="Partial preview"><svg><use href="#i-cube"/></svg></span>` : '';

/* live counts for the data-driven scopes; All stays the fake big library */
function renderCounts() {
  const live = {
    chats: CHATS.length,
    my: PROJECTS.filter((p) => p.vis === 'my').length,
    shared: PROJECTS.filter((p) => p.shared).length,
    starred: PROJECTS.filter((p) => p.starred).length,
    archive: 0,
    'col-all': COLLECTIONS.length,
    'col-my': COLLECTIONS.filter((c) => c.mine).length,
    'col-starred': COLLECTIONS.filter((c) => c.starred).length,
  };
  $$('.navitem').forEach((b) => {
    const n = live[b.dataset.scope];
    if (n !== undefined) $('.navitem__count', b).textContent = n;
  });
}

function renderCollections(body, sc) {
  let list = COLLECTIONS.filter(sc.collections);
  if (state.q) list = list.filter((c) => c.name.toLowerCase().includes(state.q));
  list = [...list];
  if (state.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  else if (state.sort === 'created') list.sort((a, b) => b.created.localeCompare(a.created));
  else list.sort((a, b) => b.upd.localeCompare(a.upd));

  if (!list.length) {
    body.innerHTML = `<div class="clouds__empty"><svg><use href="#i-folder"/></svg>
      <b>No collections here</b><span>${state.q ? 'Nothing matches your search' : 'Collections you add will show up here'}</span></div>`;
    return;
  }
  body.innerHTML = `<div class="colgrid">${list.map((c) => {
    const members = colProjects(c.name);
    const thumbs = [...new Set(members.map((p) => p.thumb))];
    const shown = members.length <= 4 ? thumbs.slice(0, 4) : thumbs.slice(0, 3);
    const extra = members.length - shown.length;
    return `
    <div class="ccard" style="--cc:${c.color}" data-opencol="${c.name}">
      <div class="ccard__head">
        <div class="ccard__name">${c.name}</div>
        <span class="ccard__upd"><svg><use href="#i-clock"/></svg>${fmtUpd(c.upd)}</span>
        <button class="ccard__star${c.starred ? ' is-on' : ''}" data-cstar="${c.name}"
          title="${c.starred ? 'Unstar' : 'Star'}">${starIco(c.starred)}</button>
      </div>
      <div class="ccard__meta">
        <span class="ccard__mitem" title="${c.private ? 'Private' : 'Public'}">
          <svg><use href="#i-${c.private ? 'user' : 'globe'}"/></svg>${c.owner || (c.private ? 'Private' : 'Public')}</span>
        <span class="ccard__msep"></span>
        <span class="ccard__mitem"><svg><use href="#i-folder"/></svg>${members.length} projects</span>
      </div>
      <div class="ccard__parts">
        ${shown.map((k) => `<span class="cpart">${partSVG(k)}</span>`).join('')}
        ${extra > 0 ? `<span class="cpart cpart--more">+${extra}</span>` : ''}
      </div>
    </div>`;
  }).join('')}</div>`;
}

function renderBody() {
  renderCounts();
  const body = $('#cloudsBody');
  const sc = SCOPES[state.scope];
  const isGhost = !!sc.ghost, isCol = !!sc.collections, isSet = !!sc.settings, isQR = !!sc.qr,
    isChats = !!sc.chats, isInCol = state.scope === 'incol';
  // in-collection head: back to collections + colored "Collection" tag + meta
  const col = isInCol ? COLLECTIONS.find((c) => c.name === state.col) : null;
  $('#cloudsTitle').textContent = isInCol ? state.col : sc.title;
  $('#colBack').hidden = !isInCol;
  const tag = $('#colTag');
  tag.hidden = !isInCol;
  if (col) tag.style.background = col.color;
  const sub = $('#cloudsSub');
  sub.hidden = !isInCol;
  $('#colInfoBtn').hidden = !isInCol;
  if (isInCol) {
    const n = colProjects(state.col).length;
    sub.innerHTML = [
      col?.owner ? `<span>${col.owner}</span>` : '',
      `<span>${n} project${n === 1 ? '' : 's'}</span>`,
      `<span>Updated ${fmtUpd(col.upd)}</span>`,
    ].filter(Boolean).join('<i class="clouds__msep"></i>');
  }
  // list/grid applies to projects only; ghost stubs, settings and QR need no controls
  $('#viewMode').hidden = isGhost || isCol || isSet || isQR || isChats;
  $('#sortBtn').hidden = isGhost || isSet || isQR || isChats;
  $('#filters').hidden = isGhost || isSet || isQR || isChats;
  $('.search').hidden = isSet || isQR;
  $('#searchField').placeholder = isChats ? 'Search a chat'
    : isCol ? 'Search a collection' : isInCol ? 'Search in the collection' : 'Search a project';
  layoutFilters();
  // the chats layout owns its scrolling — the panel body must not scroll;
  // its search also moves next to the title (the head's right side is empty)
  body.classList.toggle('clouds__body--chats', isChats);
  $('.clouds__head').classList.toggle('clouds__head--chats', isChats);
  if (isGhost) { body.innerHTML = `<div class="ghost">${sc.ghost}</div>`; return; }
  if (isChats) { renderChats(body); return; }
  if (isSet) { renderSettings(body); return; }
  if (isQR) { renderMobile(body); return; }
  if (isCol) { renderCollections(body, sc); return; }

  const list = visibleProjects();
  if (!list.length) {
    body.innerHTML = `<div class="clouds__empty"><svg><use href="#i-cube"/></svg>
      <b>No projects here</b><span>${state.q ? 'Nothing matches your search'
        : isInCol ? 'Projects added to this collection will show up here'
        : 'Projects you add will show up here'}</span></div>`;
    return;
  }

  if (state.mode === 'grid') {
    body.innerHTML = `<div class="projgrid">${list.map((p) => `
      <button class="pcard" data-open="${p.name}">
        <span class="pcard__thumb">${partSVG(p.thumb)}
          <span class="pcard__top">
            ${badge(p)}${p3dIco(p)}
            <span class="pcard__acts">
              <span class="pcard__act" data-more="${p.name}" title="More actions"><svg><use href="#i-more"/></svg></span>
              <span class="pcard__act${p.starred ? ' is-on' : ''}" data-star="${p.name}"
                title="${p.starred ? 'Unstar' : 'Star'}">${starIco(p.starred)}</span>
            </span>
          </span>
        </span>
        <span class="pcard__name">${p.name}</span>
        <span class="pcard__meta">Updated ${fmtUpd(p.upd)}</span>
      </button>`).join('')}</div>`;
  } else {
    body.innerHTML = `<div class="projlist">${list.map((p) => `
      <button class="prow" data-open="${p.name}">
        <span class="prow__thumb">${partSVG(p.thumb)}</span>
        <span class="prow__text">
          <span class="prow__name">${p.name}</span>
          <span class="prow__sub">Updated ${fmtUpd(p.upd)}</span>
        </span>
        ${p3dIco(p)}
        ${badge(p)}
        <span class="rowact${p.starred ? ' is-on' : ''}" data-star="${p.name}"
          title="${p.starred ? 'Unstar' : 'Star'}">${starIco(p.starred)}</span>
        <span class="rowact" data-more="${p.name}" title="More actions"><svg><use href="#i-more"/></svg></span>
      </button>`).join('')}</div>`;
  }
}

/* ---- filter chips row ---- */
function chipLabel(f) {
  const v = fstate[f.id];
  if (f.multi) return v.size ? `${f.label} · ${v.size}` : f.label;
  return `${f.label}: ${v}`;
}
function chipActive(f) {
  const v = fstate[f.id];
  return f.multi ? v.size > 0 : v !== f.def;
}
function renderFilters() {
  $('#filters').innerHTML = FILTERS.map((f) => {
    if (f.input) return `<input class="field" id="f-${f.id}" data-fitem="${f.id}" type="text" placeholder="${f.input}" />`;
    return `<button class="fchip${chipActive(f) ? ' is-active' : ''}" data-filter="${f.id}" data-fitem="${f.id}">
      ${chipLabel(f)}<svg><use href="#i-chevdown"/></svg></button>`;
  }).join('') + `<button class="fchip" id="fMore" hidden>
      More<svg><use href="#i-chevdown"/></svg></button>`;
  layoutFilters();
}

/* narrow panels: chips that don't fit fold into a "More · N" chip with a
   popover instead of wrapping to a second row */
function layoutFilters() {
  const wrap = $('#filters');
  const more = $('#fMore');
  if (!more) return;
  const items = $$('[data-fitem]', wrap);
  items.forEach((el) => { el.hidden = false; });
  more.hidden = true;
  if (wrap.hidden || wrap.scrollWidth <= wrap.clientWidth) { more.dataset.hidden = ''; return; }
  more.hidden = false;
  more.firstChild.textContent = `More · ${FILTERS.length}`; // widest label while measuring
  const folded = [];
  for (let i = items.length - 1; i >= 0 && wrap.scrollWidth > wrap.clientWidth; i--) {
    items[i].hidden = true;
    folded.unshift(items[i].dataset.fitem);
  }
  more.dataset.hidden = folded.join(',');
  const active = folded.some((id) => {
    const f = FILTERS.find((x) => x.id === id);
    return f && !f.input && chipActive(f);
  });
  more.classList.toggle('is-active', active);
  more.firstChild.textContent = `More · ${folded.length}`;
}

function openMoreFilters() {
  const menu = $('#morefMenu');
  const ids = ($('#fMore').dataset.hidden || '').split(',').filter(Boolean);
  menu.innerHTML = ids.map((id) => {
    const f = FILTERS.find((x) => x.id === id);
    if (f.input) return `<div class="hmenu__inp"><input class="field" type="text" placeholder="${f.input}"></div>`;
    return `<button class="${chipActive(f) ? 'is-checked' : ''}" data-mfilter="${id}">
      <svg class="ck"><use href="#i-check"/></svg>${chipLabel(f)}<svg class="chev"><use href="#i-chev"/></svg></button>`;
  }).join('');
  openMenuAt(menu, $('#fMore'));
}

/* ================================================================ CHATS === */
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function renderChats(body) {
  let list = CHATS;
  if (state.q) list = CHATS.filter((c) => c.project.toLowerCase().includes(state.q));
  if (!list.length) {
    body.innerHTML = `<div class="clouds__empty"><svg><use href="#i-chat"/></svg>
      <b>No chats found</b><span>Nothing matches your search</span></div>`;
    return;
  }
  if (!list.some((c) => c.id === state.chat)) state.chat = list[0].id;
  const cur = CHATS.find((c) => c.id === state.chat);
  cur.unread = 0; // the open conversation is read
  const shown = state.chatTag ? cur.msgs.filter((m) => m.tags?.includes(state.chatTag)) : cur.msgs;
  const attCount = cur.msgs.reduce((n, m) => n + (m.atts?.length || (m.att ? 1 : 0)), 0);

  const item = (c) => {
    const last = c.msgs[c.msgs.length - 1];
    return `<button class="chatitem${c.id === state.chat ? ' is-active' : ''}" data-chat="${c.id}">
      <span class="chatitem__thumb">${partSVG(c.thumb)}</span>
      <span class="chatitem__text">
        <span class="chatitem__name">${c.project}</span>
        <span class="chatitem__last">${last.from === 'me' ? 'You: ' : ''}${esc(last.text)}</span>
      </span>
      <span class="chatitem__meta">
        <span class="chatitem__time">${last.time}</span>
        ${c.unread ? `<span class="chatitem__unread">${c.unread}</span>` : ''}
      </span>
    </button>`;
  };
  const attHTML = (a) => a.kind === 'image'
    ? `<span class="att att--img"><span class="att__pic">${partSVG(a.art || 'plate')}</span>
        <span class="att__row"><svg><use href="#i-image"/></svg>${a.name}<i>${a.size}</i></span></span>`
    : `<span class="att att--file"><span class="att__ico"><svg><use href="#i-file"/></svg></span>
        <span class="att__txt"><b>${a.name}</b><i>${a.size}</i></span></span>`;
  const msg = (m) => {
    const mm = MEMBERS[m.from];
    const me = m.from === 'me';
    return `<div class="msg${me ? ' msg--me' : ''}">
      <span class="avatar" style="--av:${mm.color}">${me ? 'RM' : m.from}</span>
      <span class="msg__bubble">
        ${me ? '' : `<span class="msg__from" style="color:${mm.color}">${mm.name}</span>`}
        ${m.text ? `<span class="msg__text">${esc(m.text)}</span>` : ''}
        ${(m.atts || (m.att ? [m.att] : [])).map(attHTML).join('')}
        ${m.tags?.length ? `<span class="msg__tags">${m.tags.map((t) => `<span>#${t}</span>`).join('')}</span>` : ''}
        <span class="msg__time">${m.time}</span>
      </span>
    </div>`;
  };
  const rootCls = `chats${state.c3dFull ? ' chats--full' : ''}${state.c3dOn ? '' : ' chats--no3d'}${state.chatPane === 'conv' ? ' chats--conv' : ''}`;
  const c3dShown = state.c3dFull || (state.c3dOn && !matchMedia('(max-width:1200px)').matches);
  body.innerHTML = `<div class="${rootCls}">
    <div class="chatlist">${list.map(item).join('')}</div>
    <div class="chatview">
      <div class="chatview__head">
        <button class="header__iconbtn chatview__back" data-chatback title="Back to chats"><svg><use href="#i-back"/></svg></button>
        <span class="chatview__name">${cur.project}</span>
        <span class="chatview__cnt">${cur.members} members</span>
        <div class="panel__hspacer"></div>
        <button class="btn-secondary" data-open="${cur.project}"><svg><use href="#i-cube"/></svg>Open project</button>
        <button class="header__iconbtn${c3dShown ? ' is-active' : ''}" data-toggle3d title="3D view"><svg><use href="#i-panel-right"/></svg></button>
      </div>
      <div class="chatview__tools">
        <button class="fchip${state.chatTag ? ' is-active' : ''}" data-tagbtn>
          <svg><use href="#i-tag"/></svg>${state.chatTag ? `#${state.chatTag}` : 'Tags'}
          <svg><use href="#i-chevdown"/></svg></button>
        <button class="fchip" data-media><svg><use href="#i-image"/></svg>Media${attCount ? ` · ${attCount}` : ''}</button>
      </div>
      <div class="chatview__body" id="chatScroll">${shown.length ? shown.map(msg).join('')
        : `<div class="clouds__empty"><svg><use href="#i-tag"/></svg>
            <b>No messages with #${state.chatTag}</b><span>Try another tag or reset the filter</span></div>`}</div>
      <div class="chatinput">
        <div class="composer">
          <div class="composer__atts" id="composerAtts">${state.composerAtts.map(attChipHTML).join('')}</div>
          <textarea class="composer__field" id="chatField" rows="1" placeholder="Message ${cur.project}"></textarea>
          <div class="composer__row">
            <button class="chatclip" title="Attach files"><svg><use href="#i-clip"/></svg></button>
            <div class="panel__hspacer"></div>
            <button class="chatsend" id="chatSend" title="Send"><svg><use href="#i-send"/></svg></button>
          </div>
        </div>
      </div>
    </div>
    <div class="chat3d">
      <div class="viewer">
        <canvas class="viewer__canvas"></canvas>
        <div class="viewer__top">
          <div class="viewer__bar">
            <button data-vact="fit" title="Fit view">${icon('i-target')}</button>
            <button data-vact="dims" class="${c3d.dims ? 'is-active' : ''}" title="Dimensions">${icon('i-ruler')}</button>
            <button data-vact="measure" class="${c3d.measure ? 'is-active' : ''}" title="Measure">${icon('i-measure')}</button>
          </div>
          <div class="viewer__filters">${c3dFiltersHTML()}</div>
        </div>
      </div>
      <div class="chat3d__bar">
        <button class="glassbtn${state.c3dFull ? ' is-active' : ''}" data-c3d="full"><svg><use href="#i-expand"/></svg>Full</button>
      </div>
      <div class="chat3d__actions">
        <button class="btn-secondary"><svg><use href="#i-download"/></svg>Download</button>
        <button class="btn-primary" data-open="${cur.project}">Open in ENCY</button>
      </div>
    </div>
  </div>`;
  const sc2 = $('#chatScroll');
  sc2.scrollTop = sc2.scrollHeight;
  drawChat3D();
}

/* ---- chat 3D view: the project-page software renderer, minus playback ----
   (flat-shaded painter's algorithm on canvas, orbit + zoom + display filters;
   same demo scene as the workspace viewer) */
const icon = (id) => `<svg><use href="#${id}"/></svg>`;
const C3D_HOME = { yaw: -0.7, pitch: 0.6, zoom: 1.2, dist: 900 };
const c3d = { cam: { ...C3D_HOME }, dims: false, measure: false, compact: false,
  show: { part: true, stock: true, fixture: true, context: false, machine: false,
          tool: true, holder: true, path: true, normals: false, points: false, axes: true } };
const C3D_GROUPS = [
  [
    { key: 'part',    label: 'Part',          icon: 'i-part' },
    { key: 'stock',   label: 'Stock',         icon: 'i-box' },
    { key: 'fixture', label: 'Fixture',       icon: 'i-layers' },
    { key: 'context', label: 'Setup context', icon: 'i-context' },
    { key: 'machine', label: 'Full machine',  icon: 'i-machine' },
  ],
  [
    { key: 'tool',   label: 'Tool',   icon: 'i-toolbit' },
    { key: 'holder', label: 'Holder', icon: 'i-holder' },
  ],
  [
    { key: 'path',    label: 'Toolpath', icon: 'i-mesh' },
    { key: 'normals', label: 'Normals',  icon: 'i-normals' },
    { key: 'points',  label: 'Points',   icon: 'i-points' },
  ],
  [
    { key: 'axes', label: 'Axes', icon: 'i-axes' },
  ],
];

function faceNormal(pts) {
  const [a, b, c] = pts;
  const u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]], v = [c[0]-b[0], c[1]-b[1], c[2]-b[2]];
  const n = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
  const l = Math.hypot(...n) || 1;
  return n.map((x) => x / l);
}
/* sub > 1 slices the top face into strips: the painter's sort breaks when a
   small mesh stands on one huge coplanar face */
function boxMesh(cx, cyy, z0, z1, w, d, rgb, tag, sub = 1) {
  const x0 = cx-w/2, x1 = cx+w/2, y0 = cyy-d/2, y1 = cyy+d/2;
  const v = [[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]];
  const idx = [[0,3,2,1],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]];
  const faces = idx.map((f) => { const pts = f.map((i) => v[i]); return { pts, n: faceNormal(pts), edge: true }; });
  for (let i = 0; i < sub; i++) {
    const xa = x0 + (w * i) / sub, xb = x0 + (w * (i + 1)) / sub;
    faces.push({ pts: [[xa,y0,z1],[xb,y0,z1],[xb,y1,z1],[xa,y1,z1]], n: [0,0,1], edge: sub === 1 });
  }
  return { tag, rgb, faces };
}
function cylMesh(cx, cyy, z0, z1, r, n, rgb, tag) {
  const bot = [], top = [], faces = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    bot.push([cx + r*Math.cos(a), cyy + r*Math.sin(a), z0]);
    top.push([cx + r*Math.cos(a), cyy + r*Math.sin(a), z1]);
  }
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const pts = [bot[i], bot[j], top[j], top[i]];
    faces.push({ pts, n: faceNormal(pts), edge: false });
  }
  faces.push({ pts: top, n: [0,0,1], edge: true });
  faces.push({ pts: [...bot].reverse(), n: [0,0,-1], edge: true });
  return { tag, rgb, faces };
}
function diskMesh(cx, cyy, z, r, n, rgb, tag) {
  const pts = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; pts.push([cx + r*Math.cos(a), cyy + r*Math.sin(a), z]); }
  return { tag, rgb, faces: [{ pts, n: [0,0,1], edge: false }] };
}
const C3D_AL = [168,178,183], C3D_VIO = [122,112,192], C3D_HOLE = [15,17,19];
const C3D_SCENE = [
  boxMesh(0, 0, -6, 0, 150, 60, C3D_VIO, 'fixture', 6),
  boxMesh(0, 0, 0, 8, 112, 28, C3D_AL, 'part', 8),
  boxMesh(-38, 0, 8, 23, 36, 28, C3D_AL, 'part'),
  cylMesh(28, 0, 8, 20, 10, 20, C3D_AL, 'part'),
  diskMesh(28, 0, 20.05, 4.75, 20, C3D_HOLE, 'part'),
  diskMesh(2, 0, 8.05, 4, 16, C3D_HOLE, 'part'),
  diskMesh(48, 7, 8.05, 4, 16, C3D_HOLE, 'part'),
  diskMesh(48, -7, 8.05, 4, 16, C3D_HOLE, 'part'),
];

function drawChat3D() {
  const c = $('.chat3d .viewer__canvas'); if (!c) return;
  const r = c.getBoundingClientRect(); if (!r.width || !r.height) return;
  const dpr = window.devicePixelRatio || 1;
  const W = Math.round(r.width), H = Math.round(r.height);
  if (c.width !== W*dpr || c.height !== H*dpr) { c.width = W*dpr; c.height = H*dpr; }
  const ctx = c.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const { yaw, pitch, zoom, dist } = c3d.cam;
  const cy_ = Math.cos(yaw), sy_ = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const S = (Math.min(W, H) / 250) * zoom;
  const proj = (p) => {
    const x1 = p[0]*cy_ - p[1]*sy_, y1 = p[0]*sy_ + p[1]*cy_, z1 = p[2];
    const d = y1*cp + z1*sp;
    const u = z1*cp - y1*sp;
    const k = S * dist / (dist - d);
    return { x: W/2 + x1*k, y: H*0.54 - u*k, d };
  };
  const line = (a, b, color, wd = 1, dash = null) => {
    const A = proj(a), B = proj(b);
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y);
    ctx.strokeStyle = color; ctx.lineWidth = wd;
    ctx.setLineDash(dash || []); ctx.stroke(); ctx.setLineDash([]);
  };

  for (let g = -100; g <= 100; g += 25) {
    line([g, -100, -6], [g, 100, -6], 'rgba(245,245,245,.05)');
    line([-100, g, -6], [100, g, -6], 'rgba(245,245,245,.05)');
  }

  const faces = [];
  for (const m of C3D_SCENE) {
    if (m.tag && c3d.show[m.tag] === false) continue;
    for (const f of m.faces) {
      const P = f.pts.map(proj);
      let area = 0;
      for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i+1)%P.length]; area += a.x*b.y - b.x*a.y; }
      if (area <= 0) continue; // backface (front = positive with y-down)
      const nx1 = f.n[0]*cy_ - f.n[1]*sy_, ny1 = f.n[0]*sy_ + f.n[1]*cy_;
      const nd = ny1*cp + f.n[2]*sp, nu = f.n[2]*cp - ny1*sp;
      const b = 0.42 + 0.58 * Math.max(0, -0.35*nx1 + 0.5*nu + 0.78*nd);
      faces.push({ P, d: P.reduce((s, p) => s + p.d, 0) / P.length, rgb: m.rgb, b, edge: f.edge });
    }
  }
  faces.sort((a, b) => a.d - b.d);
  for (const f of faces) {
    ctx.beginPath();
    f.P.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    ctx.fillStyle = `rgb(${f.rgb.map((v) => Math.round(v * f.b)).join(',')})`;
    ctx.fill();
    if (f.edge) { ctx.strokeStyle = 'rgba(8,10,11,.45)'; ctx.lineWidth = .75; ctx.stroke(); }
  }

  if (c3d.show.stock) {
    const sx = 58, sy = 16, sz = 26, col = 'rgba(245,245,245,.3)', dash = [4, 3];
    for (const z of [0, sz]) {
      line([-sx,-sy,z],[sx,-sy,z],col,1,dash); line([sx,-sy,z],[sx,sy,z],col,1,dash);
      line([sx,sy,z],[-sx,sy,z],col,1,dash);   line([-sx,sy,z],[-sx,-sy,z],col,1,dash);
    }
    for (const [x, y] of [[-sx,-sy],[sx,-sy],[sx,sy],[-sx,sy]]) line([x,y,0],[x,y,sz],col,1,dash);
  }
  if (c3d.show.path) {
    const pts = [[-52, -10, 36], [-52, -10, 24.5]];
    for (let i = 0, y = -10; y <= 10; y += 5, i++) {
      pts.push([i % 2 ? -52 : -24, y, 24.5]);
      if (y + 5 <= 10) pts.push([i % 2 ? -52 : -24, y + 5, 24.5]);
    }
    ctx.beginPath();
    pts.forEach((p, i) => { const q = proj(p); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); });
    ctx.strokeStyle = 'rgba(70,172,255,.9)'; ctx.lineWidth = 1.2; ctx.stroke();
  }
  if (c3d.show.axes) {
    const O = [-60, -18, 0], L = 30;
    const ax = [[[O[0]+L, O[1], O[2]], '#ff7072', 'X'], [[O[0], O[1]+L, O[2]], '#84ebb8', 'Y'], [[O[0], O[1], O[2]+L], '#46acff', 'Z']];
    ctx.font = '9px Inter, sans-serif';
    for (const [end, col, lbl] of ax) {
      line(O, end, col, 1.2);
      const p = proj(end);
      ctx.fillStyle = col; ctx.fillText(lbl, p.x + 3, p.y - 3);
    }
  }

  const host = c.closest('.viewer');
  host.classList.toggle('viewer--slim', H < 120);
  c3dFiltersSync(host);
}

/* filters collapse into an i-eye popover when the pane gets narrow */
const C3D_FILTERS_MIN = 330;
function c3dFiltersHTML() {
  if (c3d.compact) return `<button data-vact="filters" title="Display filters">${icon('i-eye')}</button>`;
  return C3D_GROUPS.map((g) => g.map((l) =>
    `<button data-vshow="${l.key}" class="${c3d.show[l.key] ? 'is-on' : ''}" title="${l.label}">${icon(l.icon)}</button>`)
    .join('')).join('<span class="viewer__sep"></span>');
}
function c3dFiltersSync(v) {
  const top = $('.viewer__top', v), bar = $('.viewer__bar', v), f = $('.viewer__filters', v);
  if (!top || !f) return;
  const compact = top.clientWidth - bar.offsetWidth - 8 < C3D_FILTERS_MIN;
  if (compact !== c3d.compact) {
    c3d.compact = compact;
    f.innerHTML = c3dFiltersHTML();
  }
}
function openC3dMenu(anchor) {
  const menu = $('#c3dMenu');
  menu.innerHTML = C3D_GROUPS.map((g) => g.map((l) => `
    <button class="${c3d.show[l.key] ? 'is-checked' : ''}" data-c3dshow="${l.key}">
      <svg class="ck"><use href="#i-check"/></svg>${l.label}</button>`).join(''))
    .join('<div class="hmenu__sep"></div>');
  openMenuAt(menu, anchor);
}

/* tag filter + media quick view for the open chat */
function openTagMenu(anchor) {
  const cur = CHATS.find((c) => c.id === state.chat);
  const tags = [...new Set(cur.msgs.flatMap((m) => m.tags || []))];
  const menu = $('#tagMenu');
  menu.innerHTML = `
    <button class="${state.chatTag ? '' : 'is-checked'}" data-tag=""><svg class="ck"><use href="#i-check"/></svg>All messages</button>
    ${tags.map((t) => `<button class="${state.chatTag === t ? 'is-checked' : ''}" data-tag="${t}">
      <svg class="ck"><use href="#i-check"/></svg>#${t}</button>`).join('')}`;
  openMenuAt(menu, anchor);
}

let mediaTab = 'all';
function renderMedia() {
  const cur = CHATS.find((c) => c.id === state.chat);
  const atts = cur.msgs.flatMap((m) =>
    (m.atts || (m.att ? [m.att] : [])).map((a) => ({ ...a, time: m.time })));
  const shown = atts.filter((a) => mediaTab === 'all'
    || (mediaTab === 'photos' && a.kind === 'image')
    || (mediaTab === 'files' && a.kind === 'file')
    || (mediaTab === 'videos' && a.kind === 'video'));
  $('#mediaCnt').textContent = atts.length;
  $('#mediaTabs').innerHTML = [['all', 'All'], ['photos', 'Photos'], ['videos', 'Videos'], ['files', 'Files']]
    .map(([k, label]) => `<button class="ftab${mediaTab === k ? ' is-active' : ''}" data-mtab="${k}">${label}</button>`).join('');
  $('#mediaBody').innerHTML = shown.length ? shown.map((a) => a.kind === 'image'
    ? `<span class="mitem"><span class="mitem__pic">${partSVG(a.art || 'plate')}</span>
        <span class="mitem__name">${a.name}</span><span class="mitem__meta">${a.size} · ${a.time}</span></span>`
    : `<span class="att att--file"><span class="att__ico"><svg><use href="#i-file"/></svg></span>
        <span class="att__txt"><b>${a.name}</b><i>${a.size} · ${a.time}</i></span></span>`).join('')
    : `<div class="clouds__empty" style="width:100%"><svg><use href="#i-image"/></svg>
        <b>Nothing here yet</b><span>${mediaTab === 'videos' ? 'Videos' : 'Attachments'} from this chat will show up here</span></div>`;
}

/* attachments staged in the composer (prototype: the clip cycles demo files) */
const DEMO_ATTS = [
  { kind: 'file',  name: 'fixture_offsets_rev2.pdf', size: '96 KB' },
  { kind: 'image', name: 'toolpath_check.png', size: '840 KB', art: 'impeller' },
  { kind: 'file',  name: 'post_settings.json', size: '4 KB' },
];
function attChipHTML(a, i) {
  return `<span class="cchip">
    <span class="cchip__pic${a.kind === 'image' ? ' cchip__pic--img' : ''}">${a.kind === 'image'
      ? partSVG(a.art || 'plate') : `<svg><use href="#i-file"/></svg>`}</span>
    <span class="cchip__txt"><b>${a.name}</b><i>${a.size}</i></span>
    <button class="cchip__x" data-attrm="${i}" title="Remove"><svg><use href="#i-close"/></svg></button>
  </span>`;
}
function renderComposerAtts() {
  const box = $('#composerAtts');
  if (box) box.innerHTML = state.composerAtts.map(attChipHTML).join('');
}
function autosizeComposer() {
  const f = $('#chatField');
  if (!f) return;
  f.style.height = 'auto';
  f.style.height = Math.min(f.scrollHeight, 120) + 'px';
}
function sendChatMsg() {
  const f = $('#chatField');
  const text = (f?.value || '').trim();
  const atts = state.composerAtts;
  if (!text && !atts.length) return;
  CHATS.find((c) => c.id === state.chat).msgs.push({
    from: 'me', text, time: 'Just now', ...(atts.length ? { atts: [...atts] } : {}) });
  state.composerAtts = [];
  renderBody();
  $('#chatField')?.focus();
}

/* ================================================================ MOBILE APP === */
/* decorative deterministic QR (finder squares + seeded fill) — a real code
   needs the backend links anyway */
function qrSVG(seed) {
  const N = 25;
  let h = 0;
  for (const c of seed) h = ((h * 31 + c.charCodeAt(0)) >>> 0);
  const rnd = () => { h = ((h * 1103515245 + 12345) >>> 0); return h / 4294967296; };
  const ink = '#101314';
  let cells = '';
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const inFinder = (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
    if (!inFinder && rnd() < .45) cells += `<rect x="${x}" y="${y}" width="1" height="1" fill="${ink}"/>`;
  }
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" rx="1" fill="${ink}"/>
    <rect x="${x + 1}" y="${y + 1}" width="5" height="5" rx=".8" fill="#fff"/>
    <rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx=".5" fill="${ink}"/>`;
  return `<svg viewBox="0 0 ${N} ${N}" width="156" height="156" shape-rendering="crispEdges">
    ${cells}${finder(0, 0)}${finder(N - 7, 0)}${finder(0, N - 7)}</svg>`;
}

const APPLE_LOGO = `<svg class="storebtn__logo" viewBox="0 0 24 24"><path fill="currentColor"
  d="M16.7 12.9c0-2 1.63-3 1.7-3.05-.93-1.36-2.37-1.55-2.88-1.57-1.22-.12-2.39.72-3 .72-.62 0-1.58-.7-2.6-.68-1.34.02-2.57.78-3.26 1.98-1.39 2.41-.35 5.97 1 7.93.66.96 1.44 2.03 2.47 1.99 1-.04 1.37-.64 2.57-.64 1.2 0 1.54.64 2.59.62 1.07-.02 1.75-.97 2.4-1.93.76-1.1 1.07-2.17 1.09-2.23-.02-.01-2.06-.8-2.08-3.14zM14.7 6.75c.55-.66.92-1.58.82-2.5-.79.03-1.75.53-2.32 1.19-.51.59-.95 1.53-.83 2.43.88.07 1.78-.45 2.33-1.12z"/></svg>`;
const PLAY_LOGO = `<svg class="storebtn__logo" viewBox="0 0 24 24">
  <path d="M5 3.6v16.8l8.8-8.4z" fill="#4fc3f7"/>
  <path d="M5 3.6l11.7 6.5-2.9 2.3z" fill="#81c784"/>
  <path d="M5 20.4l11.7-6.5-2.9-2.3z" fill="#e57373"/>
  <path d="M16.7 10.1L13.8 12l2.9 1.9c1-.5 1-3.3 0-3.8z" fill="#ffd54f"/></svg>`;

function renderMobile(body) {
  const card = (os, name, logo, hint, store) => `
    <div class="qrcard">
      <div class="qrcard__os">${name}</div>
      <div class="qrcard__code">${qrSVG('ency-clouds-' + os)}</div>
      <div class="qrcard__hint"><svg><use href="#i-scan"/></svg>Scan with your phone camera</div>
      <button class="storebtn">${logo}<span class="storebtn__txt"><i>${hint}</i><b>${store}</b></span></button>
    </div>`;
  body.innerHTML = `<div class="qrwrap">
    ${card('ios', 'iOS', APPLE_LOGO, 'Download on the', 'App Store')}
    ${card('android', 'Android', PLAY_LOGO, 'Get it on', 'Google Play')}
  </div>`;
}

/* ================================================================ SETTINGS === */
const LANGS = { en: 'English', de: 'Deutsch', ru: 'Русский', zh: '中文' };
let curLang = 'en';

function themePref() { return localStorage.getItem('ency-theme') || 'dark'; }
function applyTheme() {
  const p = themePref();
  document.documentElement.dataset.theme = p === 'light' || p === 'dark' ? p
    : (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
}
matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
  if (themePref() === 'system') applyTheme();
});

function renderSettings(body) {
  const pref = themePref();
  const seg = [
    ['light', 'i-sun', 'Light'], ['dark', 'i-moon', 'Dark'], ['system', 'i-monitor', 'System'],
  ].map(([k, ico, label]) => `
    <button class="${pref === k ? 'is-active' : ''}" data-setheme="${k}">
      <svg><use href="#${ico}"/></svg>${label}</button>`).join('');
  body.innerHTML = `
  <div class="settings">
    <div class="setcard setcard--profile">
      <div class="setcard__banner"></div>
      <span class="avatar" style="--av:#84ebb8">RM</span>
      <div class="setcard__name">Ruslan Mardanshin</div>
      <div class="setcard__mail">ruslan.m@encycam.io</div>
    </div>
    <div class="setcard">
      <div class="setrow">
        <span class="setrow__ico"><svg><use href="#i-globe"/></svg></span>
        <div class="setrow__text"><b>Language</b><span>Interface language</span></div>
        <button class="selectish" id="langBtn">${LANGS[curLang]}<svg><use href="#i-chevdown"/></svg></button>
      </div>
    </div>
    <div class="setcard">
      <div class="setrow">
        <span class="setrow__ico"><svg><use href="#i-moon"/></svg></span>
        <div class="setrow__text"><b>Theme</b><span>How ENCY Clouds looks on this device</span></div>
      </div>
      <div class="seg setcard__seg">${seg}</div>
    </div>
    <div class="setcard">
      <button class="setrow" data-goto="mobile">
        <span class="setrow__ico"><svg><use href="#i-phone"/></svg></span>
        <div class="setrow__text"><b>Get the ENCY Clouds mobile app</b><span>Download for iOS and Android</span></div>
        <svg class="chev"><use href="#i-chev"/></svg>
      </button>
    </div>
    <div class="setcard">
      <div class="setcard__label">Danger zone</div>
      <button class="setrow setrow--danger">
        <span class="setrow__ico"><svg><use href="#i-logout"/></svg></span>
        <div class="setrow__text"><b>Log out</b></div>
      </button>
    </div>
  </div>`;
}

/* ================================================================ INBOX === */
let inboxTab = 'ntf';
let invFilter = 'all'; // all | project | collection

function renderInbox() {
  const body = $('#inboxBody');
  $$('#inbox [data-itab]').forEach((b) => b.classList.toggle('is-active', b.dataset.itab === inboxTab));
  const ntfRow = (n, i, extra = '') => `
    <div class="ntf${n.unread ? ' is-unread' : ''}" data-ntf="${i}">
      <span class="avatar" style="--av:${n.color}">${n.av}</span>
      <span class="ntf__text">${n.html}<span class="ntf__time">${n.time}</span>${extra}</span>
      <span class="ntf__dot"></span>
    </div>`;
  if (inboxTab === 'ntf') {
    body.innerHTML = INBOX.ntf.length
      ? INBOX.ntf.map((n, i) => ntfRow(n, i)).join('')
      : `<div class="clouds__empty"><svg><use href="#i-bell"/></svg>
          <b>Nothing new for now</b><span>You'll receive notifications about project updates and chat activity here</span></div>`;
  } else {
    // sub-filters: All / Projects / Collections (rows keep their original index)
    const rows = INBOX.inv
      .map((n, i) => ({ n, i }))
      .filter(({ n }) => invFilter === 'all' || n.kind === invFilter);
    const ftabs = `<div class="inbox__filters">${[
      ['all', 'All'], ['project', 'Projects'], ['collection', 'Collections'],
    ].map(([k, label]) => `<button class="ftab${invFilter === k ? ' is-active' : ''}" data-ifilter="${k}">${label}</button>`).join('')}</div>`;
    body.innerHTML = ftabs + (rows.length
      ? rows.map(({ n, i }) => `
        <div class="invite">${ntfRow(n, i)}
          <div class="invite__row">
            <button class="btn-primary" data-inv="accept" data-i="${i}">Accept</button>
            <button class="btn-secondary" data-inv="decline" data-i="${i}">Decline</button>
          </div>
        </div>`).join('')
      : `<div class="clouds__empty"><svg><use href="#i-users"/></svg>
          <b>No invites yet</b><span>${invFilter === 'collection' ? 'Collection' : 'Project'} invitations will show up here</span></div>`);
  }
  // unread counters on the tabs and the bell dot
  const unNtf = INBOX.ntf.filter((n) => n.unread).length;
  const unInv = INBOX.inv.filter((n) => n.unread).length;
  $('#cntNtf').textContent = unNtf || '';
  $('#cntInv').textContent = unInv || '';
  $('.nav__bell').classList.toggle('has-unread', unNtf + unInv > 0);
}

function toggleInbox(open) {
  const inbox = $('#inbox');
  const show = open ?? inbox.hidden;
  if (!show) { inbox.hidden = true; return; }
  closeMenus();
  renderInbox();
  inbox.hidden = false;
  inbox.style.left = `${$('#nav').getBoundingClientRect().right + 10}px`;
}

/* ================================================================ POPOVERS === */
function closeMenus() { $$('.hmenu').forEach((m) => { m.hidden = true; }); }
function openMenuAt(menu, anchor) {
  closeMenus();
  menu.hidden = false;
  const r = anchor.getBoundingClientRect();
  const left = Math.max(8, Math.min(r.left, innerWidth - menu.offsetWidth - 8));
  let top = r.bottom + 4;
  if (top + menu.offsetHeight > innerHeight - 8) top = Math.max(8, r.top - menu.offsetHeight - 4);
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
}

function openFilterMenu(id, anchor) {
  const f = FILTERS.find((x) => x.id === id);
  const menu = $('#filterMenu');
  const opts = f.single || f.multi;
  menu.innerHTML = opts.map((o) => {
    const on = f.multi ? fstate[id].has(o) : fstate[id] === o;
    return `<button class="${on ? 'is-checked' : ''}" data-opt="${o}">
      <svg class="ck"><use href="#i-check"/></svg>${o}</button>`;
  }).join('');
  menu.dataset.filter = id;
  openMenuAt(menu, anchor);
}

/* narrow screens: the collection meta folds into an info popover
   (mirrors the project page's "Last update" popover) */
function openColInfo() {
  const col = COLLECTIONS.find((c) => c.name === state.col);
  if (!col) return;
  const menu = $('#colInfoMenu');
  const n = colProjects(state.col).length;
  const initials = col.owner ? col.owner.split(' ').map((w) => w[0]).join('').slice(0, 2) : '';
  menu.innerHTML = `
    ${col.owner ? `<div class="colinfo__label">Owner</div>
    <div class="colinfo__member">
      <span class="avatar" style="--av:${col.color}">${initials}</span>
      <span>${col.owner}</span>
    </div>
    <div class="hmenu__sep"></div>` : ''}
    <div class="colinfo__row"><svg><use href="#i-folder"/></svg>${n} project${n === 1 ? '' : 's'}</div>
    <div class="colinfo__row"><svg><use href="#i-clock"/></svg>Updated ${fmtUpd(col.upd)}</div>
    <div class="colinfo__row"><svg><use href="#i-calendar"/></svg>Created ${fmtUpd(col.created)}</div>`;
  openMenuAt(menu, $('#colInfoBtn'));
}

/* card "more" menu mirrors the project-page header menu (reference: Share /
   Duplicate to My Projects / Collections) */
function openCardMenu(name, anchor) {
  const menu = $('#cardMenu');
  menu.dataset.project = name;
  menu.innerHTML = `
    <button data-act="share"><svg><use href="#i-share"/></svg>Share</button>
    <button data-act="duplicate"><svg><use href="#i-copy"/></svg>Duplicate to My Projects</button>
    <button data-act="collections"><svg><use href="#i-folder"/></svg>Collections<svg class="chev"><use href="#i-chev"/></svg></button>`;
  openMenuAt(menu, anchor);
}

function openLangMenu(anchor) {
  const menu = $('#langMenu');
  menu.innerHTML = Object.entries(LANGS).map(([k, name]) => `
    <button class="${curLang === k ? 'is-checked' : ''}" data-lang="${k}">
      <svg class="ck"><use href="#i-check"/></svg>${name}</button>`).join('');
  openMenuAt(menu, anchor);
}

function openSortMenu(anchor) {
  const menu = $('#sortMenu');
  menu.innerHTML = SORTS.map((s) => `
    <button class="${state.sort === s.id ? 'is-checked' : ''}" data-sort="${s.id}">
      <svg class="ck"><use href="#i-check"/></svg>${s.label}</button>`).join('');
  openMenuAt(menu, anchor);
}

/* ================================================================ WIRE === */
function init() {
  renderFilters();
  renderBody();

  // sidebar scopes
  $('#navBody').addEventListener('click', (e) => {
    const item = e.target.closest('.navitem');
    if (!item) return;
    $$('.navitem').forEach((b) => b.classList.toggle('is-active', b === item));
    state.scope = item.dataset.scope;
    renderBody();
  });

  // sidebar collapse (manual + auto under 900px)
  const nav = $('#nav');
  $('#navCollapse').addEventListener('click', () => {
    nav.classList.toggle('is-collapsed');
    if (!$('#inbox').hidden) toggleInbox(true); // keep the drawer glued to the rail
  });
  const mqNarrow = matchMedia('(max-width:900px)');
  const autoRail = () => nav.classList.toggle('is-collapsed', mqNarrow.matches);
  mqNarrow.addEventListener('change', autoRail);
  autoRail();

  // inbox (bell): drawer next to the sidebar
  $('.nav__bell').addEventListener('click', (e) => { e.stopPropagation(); toggleInbox(); });
  $('#inboxClose').addEventListener('click', () => toggleInbox(false));
  $('#inbox').addEventListener('click', (e) => {
    e.stopPropagation();
    const tab = e.target.closest('[data-itab]');
    if (tab) {
      inboxTab = tab.dataset.itab;
      // opening the invites tab means they've been seen
      if (inboxTab === 'inv') INBOX.inv.forEach((n) => { n.unread = false; });
      renderInbox();
      return;
    }
    const ftab = e.target.closest('[data-ifilter]');
    if (ftab) { invFilter = ftab.dataset.ifilter; renderInbox(); return; }
    const inv = e.target.closest('[data-inv]');
    if (inv) { INBOX.inv.splice(Number(inv.dataset.i), 1); renderInbox(); return; }
    const row = e.target.closest('[data-ntf]');
    if (row && inboxTab === 'ntf') { INBOX.ntf[Number(row.dataset.ntf)].unread = false; renderInbox(); }
  });
  document.addEventListener('click', () => { $('#inbox').hidden = true; });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeMenus();
    $('#inbox').hidden = true;
    $('#mediaModal').hidden = true;
  });
  renderInbox(); // seed the bell's unread dot

  // account menu
  $('#userBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    const menu = $('#userMenu');
    if (!menu.hidden) { menu.hidden = true; return; }
    closeMenus();
    menu.hidden = false;
    const r = $('#userBtn').getBoundingClientRect();
    menu.style.left = `${r.left}px`;
    menu.style.top = `${r.top - menu.offsetHeight - 6}px`;
  });

  // search
  $('#searchField').addEventListener('input', (e) => {
    state.q = e.target.value.trim().toLowerCase();
    renderBody();
  });

  // grid <-> list
  $$('#viewMode button').forEach((b) => b.addEventListener('click', () => {
    state.mode = b.dataset.mode;
    $$('#viewMode button').forEach((x) => x.classList.toggle('is-active', x === b));
    renderBody();
  }));

  // sort
  $('#sortBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    const menu = $('#sortMenu');
    if (!menu.hidden) { menu.hidden = true; return; }
    openSortMenu($('#sortBtn'));
  });
  $('#sortMenu').addEventListener('click', (e) => {
    const b = e.target.closest('[data-sort]');
    if (!b) return;
    state.sort = b.dataset.sort;
    closeMenus();
    renderBody();
  });

  // filter chips
  $('#filters').addEventListener('click', (e) => {
    if (e.target.closest('#fMore')) {
      e.stopPropagation();
      const menu = $('#morefMenu');
      if (!menu.hidden) { menu.hidden = true; return; }
      openMoreFilters();
      return;
    }
    const chip = e.target.closest('[data-filter]');
    if (!chip) return;
    e.stopPropagation();
    const menu = $('#filterMenu');
    if (!menu.hidden && menu.dataset.filter === chip.dataset.filter) { menu.hidden = true; return; }
    openFilterMenu(chip.dataset.filter, chip);
  });
  // folded filters: a row in the More popover opens that filter's options
  $('#morefMenu').addEventListener('click', (e) => {
    const b = e.target.closest('[data-mfilter]');
    if (!b) return;
    e.stopPropagation();
    openFilterMenu(b.dataset.mfilter, $('#fMore'));
  });
  // refold the chips when the panel changes width
  new ResizeObserver(() => layoutFilters()).observe($('#filters'));
  $('#filterMenu').addEventListener('click', (e) => {
    const b = e.target.closest('[data-opt]');
    if (!b) return;
    e.stopPropagation();
    const id = $('#filterMenu').dataset.filter;
    const f = FILTERS.find((x) => x.id === id);
    if (f.multi) {
      const set = fstate[id];
      set.has(b.dataset.opt) ? set.delete(b.dataset.opt) : set.add(b.dataset.opt);
      // re-render the menu in place; the chip may be folded under "More"
      const anchor = $(`#filters [data-filter="${id}"]:not([hidden])`) || $('#fMore') || $('#filters');
      openFilterMenu(id, anchor);
    } else {
      fstate[id] = b.dataset.opt;
      closeMenus();
    }
    renderFilters();
  });

  // cards / rows: open project, star toggles (projects + collections)
  $('#cloudsBody').addEventListener('click', (e) => {
    const star = e.target.closest('[data-star]');
    if (star) {
      e.stopPropagation();
      const p = PROJECTS.find((x) => x.name === star.dataset.star);
      p.starred = !p.starred;
      renderBody();
      return;
    }
    const cstar = e.target.closest('[data-cstar]');
    if (cstar) {
      e.stopPropagation();
      const c = COLLECTIONS.find((x) => x.name === cstar.dataset.cstar);
      c.starred = !c.starred;
      renderBody();
      return;
    }
    const chat = e.target.closest('[data-chat]');
    if (chat) {
      state.chat = Number(chat.dataset.chat);
      state.chatTag = null;
      if (matchMedia('(max-width:640px)').matches) state.chatPane = 'conv';
      renderBody();
      return;
    }
    if (e.target.closest('[data-chatback]')) { state.chatPane = 'list'; renderBody(); return; }
    const t3d = e.target.closest('[data-toggle3d]');
    if (t3d) {
      // narrow layouts have no side pane — the toggle goes straight to full 3D
      if (matchMedia('(max-width:1200px)').matches) state.c3dFull = !state.c3dFull;
      else state.c3dOn = !state.c3dOn;
      renderBody();
      return;
    }
    if (e.target.closest('#chatSend')) { sendChatMsg(); return; }
    if (e.target.closest('.chatclip')) {
      // prototype: stage the next demo file instead of a real file picker
      state.composerAtts.push(DEMO_ATTS[state.composerAtts.length % DEMO_ATTS.length]);
      renderComposerAtts();
      $('#chatField')?.focus();
      return;
    }
    const attrm = e.target.closest('[data-attrm]');
    if (attrm) {
      state.composerAtts.splice(Number(attrm.dataset.attrm), 1);
      renderComposerAtts();
      return;
    }
    const vsh = e.target.closest('[data-vshow]');
    if (vsh) {
      c3d.show[vsh.dataset.vshow] = !c3d.show[vsh.dataset.vshow];
      vsh.classList.toggle('is-on');
      drawChat3D();
      return;
    }
    const vact = e.target.closest('[data-vact]');
    if (vact) {
      const a = vact.dataset.vact;
      if (a === 'fit') { c3d.cam = { ...C3D_HOME }; drawChat3D(); }
      else if (a === 'dims') { c3d.dims = !c3d.dims; vact.classList.toggle('is-active'); }
      else if (a === 'measure') { c3d.measure = !c3d.measure; vact.classList.toggle('is-active'); }
      else if (a === 'filters') { e.stopPropagation(); openC3dMenu(vact); }
      return;
    }
    const tagbtn = e.target.closest('[data-tagbtn]');
    if (tagbtn) {
      e.stopPropagation();
      const menu = $('#tagMenu');
      if (!menu.hidden) { menu.hidden = true; return; }
      openTagMenu(tagbtn);
      return;
    }
    if (e.target.closest('[data-media]')) {
      e.stopPropagation();
      mediaTab = 'all';
      renderMedia();
      $('#mediaModal').hidden = false;
      return;
    }
    const c3dBtn = e.target.closest('[data-c3d]');
    if (c3dBtn) {
      if (c3dBtn.dataset.c3d === 'full') { state.c3dFull = !state.c3dFull; renderBody(); }
      return;
    }
    const goto = e.target.closest('[data-goto]');
    if (goto) {
      state.scope = goto.dataset.goto;
      $$('.navitem').forEach((n) => n.classList.toggle('is-active', n.dataset.scope === state.scope));
      renderBody();
      return;
    }
    const th = e.target.closest('[data-setheme]');
    if (th) {
      localStorage.setItem('ency-theme', th.dataset.setheme);
      applyTheme();
      renderBody(); // refresh the active state of the theme segment
      return;
    }
    const lang = e.target.closest('#langBtn');
    if (lang) {
      e.stopPropagation();
      const menu = $('#langMenu');
      if (!menu.hidden) { menu.hidden = true; return; }
      openLangMenu(lang);
      return;
    }
    const more = e.target.closest('[data-more]');
    if (more) {
      e.stopPropagation();
      const menu = $('#cardMenu');
      if (!menu.hidden && menu.dataset.project === more.dataset.more) { menu.hidden = true; return; }
      openCardMenu(more.dataset.more, more);
      return;
    }
    const card = e.target.closest('[data-open]');
    if (card) { location.href = 'index.html'; return; }
    // a collection card opens its projects (star clicks are handled above)
    const ccard = e.target.closest('[data-opencol]');
    if (ccard) {
      state.colFrom = state.scope;
      state.scope = 'incol';
      state.col = ccard.dataset.opencol;
      state.q = '';
      $('#searchField').value = '';
      renderBody();
    }
  });

  // in-collection head: the info button shows the folded meta on narrow screens
  $('#colInfoBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    const menu = $('#colInfoMenu');
    if (!menu.hidden) { menu.hidden = true; return; }
    openColInfo();
  });

  // in-collection head: back returns to the collections listing it came from
  $('#colBack').addEventListener('click', () => {
    state.scope = state.colFrom || 'col-all';
    state.q = '';
    $('#searchField').value = '';
    $$('.navitem').forEach((n) => n.classList.toggle('is-active', n.dataset.scope === state.scope));
    renderBody();
  });

  // card menu actions: Duplicate is live (adds a copy to My projects), the
  // rest are demo stubs
  $('#cardMenu').addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'duplicate') {
      const src = PROJECTS.find((x) => x.name === $('#cardMenu').dataset.project);
      let copy = `Copy of ${src.name}`;
      while (PROJECTS.some((x) => x.name === copy)) copy += ' (2)';
      PROJECTS.unshift({ ...src, name: copy, vis: 'my', shared: false, starred: false,
        upd: '2026-07-29T12:00', created: '2026-07-29' });
      renderBody();
    }
    closeMenus();
  });

  // account menu actions
  $('#userMenu').addEventListener('click', (e) => {
    const b = e.target.closest('[data-uact]');
    if (!b) return;
    closeMenus();
    if (b.dataset.uact === 'settings') {
      state.scope = 'settings';
      $$('.navitem').forEach((n) => n.classList.remove('is-active'));
      renderBody();
    }
  });

  // language picker (demo: only the label changes)
  $('#langMenu').addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]');
    if (!b) return;
    curLang = b.dataset.lang;
    closeMenus();
    renderBody();
  });

  // chat input: Enter sends, Shift+Enter — newline; the textarea auto-grows
  $('#cloudsBody').addEventListener('keydown', (e) => {
    if (e.target.id === 'chatField' && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMsg();
    }
  });
  $('#cloudsBody').addEventListener('input', (e) => {
    if (e.target.id === 'chatField') autosizeComposer();
  });

  // chat 3D: orbit (drag), zoom (wheel), display-filters popover, redraw on resize
  document.addEventListener('pointerdown', (e) => {
    const cv = e.target.closest('.chat3d .viewer__canvas');
    if (!cv) return;
    e.preventDefault();
    const s = { x: e.clientX, y: e.clientY, yaw: c3d.cam.yaw, pitch: c3d.cam.pitch };
    const move = (ev) => {
      c3d.cam.yaw = s.yaw + (ev.clientX - s.x) * 0.01;
      c3d.cam.pitch = Math.max(-1.45, Math.min(1.45, s.pitch + (ev.clientY - s.y) * 0.008));
      drawChat3D();
    };
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  });
  document.addEventListener('wheel', (e) => {
    if (!e.target.closest?.('.chat3d .viewer__canvas')) return;
    e.preventDefault();
    c3d.cam.zoom = Math.max(0.35, Math.min(3.5, c3d.cam.zoom * (e.deltaY < 0 ? 1.12 : 0.9)));
    drawChat3D();
  }, { passive: false });
  $('#c3dMenu').addEventListener('click', (e) => {
    const b = e.target.closest('[data-c3dshow]');
    if (!b) return;
    c3d.show[b.dataset.c3dshow] = !c3d.show[b.dataset.c3dshow];
    b.classList.toggle('is-checked');
    drawChat3D();
  });
  new ResizeObserver(() => drawChat3D()).observe($('#cloudsBody'));

  // tag filter menu
  $('#tagMenu').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tag]');
    if (!b) return;
    state.chatTag = b.dataset.tag || null;
    closeMenus();
    renderBody();
  });

  // media & files modal
  $('#mediaClose').addEventListener('click', () => { $('#mediaModal').hidden = true; });
  $('#mediaModal').addEventListener('click', (e) => {
    if (e.target === $('#mediaModal')) { $('#mediaModal').hidden = true; return; }
    const t = e.target.closest('[data-mtab]');
    if (t) { mediaTab = t.dataset.mtab; renderMedia(); }
  });

  // any outside click closes popovers
  document.addEventListener('click', closeMenus);
  $$('.hmenu').forEach((m) => m.addEventListener('click', (e) => e.stopPropagation()));
}

init();
