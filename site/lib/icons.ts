/*
 * Shared line-icon vocabulary (24px grid, 1.7px round stroke). Used by Icon.astro for HTML and by
 * scenes.ts / diagrams to inline the same glyphs inside authored SVG, so one concept keeps one icon.
 */
export type IconName =
  | 'search' | 'menu' | 'theme' | 'close' | 'play' | 'pause' | 'step' | 'reset' | 'arrow'
  | 'workflow' | 'context' | 'check' | 'file' | 'expand' | 'book' | 'terminal'
  | 'compass' | 'spark' | 'steps' | 'download' | 'map' | 'repository' | 'layers'
  | 'code' | 'network' | 'cloud' | 'bolt' | 'grid' | 'shield' | 'target' | 'globe' | 'toolkit'
  | 'lock' | 'json' | 'bell' | 'clock' | 'branch' | 'loop' | 'check-circle' | 'x-circle' | 'eye'
  | 'plug' | 'ladder' | 'flag' | 'gear' | 'wrench' | 'folder' | 'radar' | 'send' | 'users' | 'ban'
  | 'tag' | 'money' | 'puzzle' | 'note' | 'laptop' | 'server' | 'test' | 'docs' | 'key' | 'alert'
  | 'stopwatch' | 'pr' | 'sandbox' | 'chart' | 'people' | 'pipeline' | 'meter'
  | 'hook' | 'agent' | 'worktree' | 'evidence' | 'chat' | 'timer';

export const ICON_PATHS: Record<string, string[]> = {
  search: ['M21 21l-5-5', 'M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0'],
  menu: ['M4 6h16M4 12h16M4 18h16'],
  theme: ['M12 3a9 9 0 1 0 9 9A9 9 0 0 1 12 3Z'],
  close: ['M6 6l12 12M18 6 6 18'],
  play: ['M7 4l13 8-13 8Z'],
  pause: ['M8 4v16M16 4v16'],
  step: ['M5 4l11 8-11 8ZM20 4v16'],
  reset: ['M3 10a9 9 0 1 1 1 7M3 4v6h6'],
  arrow: ['M4 12h16M14 6l6 6-6 6'],
  workflow: ['M3 3h6v6H3ZM15 15h6v6h-6ZM9 6h5a4 4 0 0 1 4 4v5M15 12l3 3 3-3'],
  context: ['M4 3h12v14H4ZM8 7h4M8 11h4M8 21h12V7'],
  check: ['M4 12l5 5L20 6'],
  file: ['M5 3h9l5 5v13H5ZM14 3v6h5M9 13h6M9 17h6'],
  expand: ['M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5'],
  book: ['M12 5v16M3 3h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5v16h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3Z'],
  terminal: ['M3 4h18v16H3ZM7 8l4 4-4 4M13 16h4'],
  compass: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20', 'M15.8 8.2l-2.1 5.5-5.5 2.1 2.1-5.5Z'],
  spark: ['M12 3l2.4 6.1L20.5 11l-6.1 1.9L12 19l-2.4-6.1L3.5 11l6.1-1.9Z', 'M18.5 3.5v3M20 5h-3'],
  steps: ['M4 20h4v-5H4Z', 'M10 20h4V9h-4Z', 'M16 20h4V4h-4Z'],
  download: ['M12 3v12', 'M7 11l5 5 5-5', 'M4 20h16'],
  map: ['M9 4 3 6v14l6-2 6 2 6-2V4l-6 2Z', 'M9 4v14', 'M15 6v14'],
  repository: ['M5 4h13a1 1 0 0 1 1 1v15H6a1 1 0 0 1-1-1Z', 'M5 17h14', 'M9 8h6'],
  layers: ['M12 3 3 8l9 5 9-5Z', 'M3 13l9 5 9-5', 'M3 17.5 12 22l9-4.5'],
  code: ['M8 6 3 12l5 6', 'M16 6l5 6-5 6', 'M13.5 3.5l-3 17'],
  network: [
    'M6 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5', 'M6 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5',
    'M18 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5', 'M6 8v8', 'M8.5 18.5h7', 'M8.4 6.6H16a2 2 0 0 1 2 2v7'
  ],
  cloud: ['M7 19h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6 10.6 4.2 4.2 0 0 0 7 19Z'],
  bolt: ['M13 3 5 13.5h5.5L10 21l8-10.5h-5.5Z'],
  grid: ['M4 4h7v7H4ZM13 4h7v7h-7ZM4 13h7v7H4ZM13 13h7v7h-7Z'],
  shield: ['M12 3l8 3v6c0 4.9-3.4 8-8 9-4.6-1-8-4.1-8-9V6Z', 'M9 12l2.2 2.2L15.5 10'],
  target: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18', 'M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9', 'M12 12h.01'],
  globe: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18', 'M3.5 9.5h17M3.5 14.5h17', 'M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18'],
  toolkit: ['M4 8h16v12H4Z', 'M9 8V5h6v3', 'M4 13.5h16', 'M10.5 13.5h3']
};

export const ICON_FRAGMENTS: Record<string, string> = {
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/><path d="M12 14.5v2.5"/>',
  json: '<path d="M8 4.5c-2 0-3 1-3 3v2c0 1.2-.8 2-2 2.5 1.2.5 2 1.3 2 2.5v2c0 2 1 3 3 3"/><path d="M16 4.5c2 0 3 1 3 3v2c0 1.2.8 2 2 2.5-1.2.5-2 1.3-2 2.5v2c0 2-1 3-3 3"/><path d="M12 9.5v.01M12 14.5v.01"/>',
  bell: '<path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 2h-14z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  branch: '<circle cx="6.5" cy="5.5" r="2.3"/><circle cx="6.5" cy="18.5" r="2.3"/><circle cx="17.5" cy="8.5" r="2.3"/><path d="M6.5 7.8v8.4"/><path d="M17.5 10.8c0 3-3 4.5-6 5-2 .4-4 1-4.8 2.5"/>',
  loop: '<path d="M4 12a8 8 0 0 1 13.5-5.8"/><path d="M20 12a8 8 0 0 1-13.5 5.8"/><path d="M17.5 3.5v3h-3M6.5 20.5v-3h3"/>',
  'check-circle': '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.2l2.4 2.4L15.8 9.5"/>',
  'x-circle': '<circle cx="12" cy="12" r="8.5"/><path d="M9 9l6 6M15 9l-6 6"/>',
  eye: '<path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  plug: '<path d="M9 3.5v4M15 3.5v4"/><path d="M6.5 7.5h11v3a5.5 5.5 0 0 1-11 0z"/><path d="M12 16v4.5"/>',
  ladder: '<path d="M7 3.5v17M17 3.5v17"/><path d="M7 7.5h10M7 12h10M7 16.5h10"/>',
  flag: '<path d="M5.5 21V4"/><path d="M5.5 4.5h12l-2.5 4 2.5 4h-12"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M6 18l1.6-1.6M16.4 7.6 18 6"/>',
  wrench: '<path d="M14.5 6.5a4 4 0 0 0 5 5L11 20a2 2 0 0 1-2.8-2.8l8.5-8.5"/><path d="M14.5 6.5 17 4l3 3-2.5 2.5"/>',
  folder: '<path d="M3.5 6.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
  radar: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><path d="M12 12 18 6"/>',
  send: '<path d="M4 12 20 4l-4 16-4-7z"/><path d="M12 13 20 4"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.5a4.5 4.5 0 0 1 5 4.5"/>',
  ban: '<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>',
  tag: '<path d="M3.5 12.5V4.5h8l9 9-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
  money: '<rect x="3" y="6.5" width="18" height="11" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5h.01M18 14.5h.01"/>',
  puzzle: '<path d="M9.5 4.5a1.8 1.8 0 0 1 3.6 0H16a1 1 0 0 1 1 1v3a1.8 1.8 0 0 1 0 3.6V15a1 1 0 0 1-1 1h-2.9a1.8 1.8 0 0 1-3.6 0H6.5a1 1 0 0 1-1-1v-2.9a1.8 1.8 0 0 1 0-3.6V5.5a1 1 0 0 1 1-1z"/>',
  note: '<path d="M5 4.5h14v15H5z"/><path d="M8.5 9h7M8.5 12.5h7M8.5 16h4"/>',
  laptop: '<rect x="4" y="5" width="16" height="10" rx="1.6"/><path d="M2.5 18.5h19"/>',
  server: '<rect x="3" y="4" width="18" height="6.5" rx="1.6"/><rect x="3" y="13.5" width="18" height="6.5" rx="1.6"/><path d="M6.5 7.2h.01M6.5 16.8h.01"/>',
  test: '<path d="M9.5 3.5v6L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3l-4.7-8.5v-6"/><path d="M8 3.5h8"/><path d="M7.4 14.5h9.2"/>',
  docs: '<path d="M5 4.5h9l5 5V21H5z"/><path d="M14 4.5v5h5"/><path d="M8.5 13h7M8.5 16.5h5"/>',
  key: '<circle cx="8" cy="14" r="4"/><path d="M11 11.5 20 4"/><path d="M17.5 6.5 19.5 8.5M15.5 8.5 17.5 10.5"/>',
  alert: '<path d="M12 4.5 21 19.5H3z"/><path d="M12 10v4"/><path d="M12 17h.01"/>',
  stopwatch: '<circle cx="12" cy="13.5" r="7"/><path d="M12 10v3.5l2.2 1.6"/><path d="M9.5 3.5h5M12 3.5v3"/>',
  pr: '<circle cx="6.5" cy="6" r="2.3"/><circle cx="6.5" cy="18" r="2.3"/><circle cx="17.5" cy="18" r="2.3"/><path d="M6.5 8.3v7.4"/><path d="M17.5 15.7V9.5a3 3 0 0 0-3-3h-2.6"/><path d="M14 4.2 11.6 6.5 14 8.8"/>',
  sandbox: '<rect x="3.5" y="6" width="17" height="14" rx="2" stroke-dasharray="3 2.5"/><path d="M8 6V4.5h8V6"/><path d="M9.5 13.5 12 16l4-4.5"/>',
  chart: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M7.5 15.5l3.5-4 3 2.5 4.5-6"/>',
  people: '<path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19"/><circle cx="10" cy="8" r="3.2"/><path d="M20 19v-1.5a3.5 3.5 0 0 0-2.6-3.4"/><path d="M15.5 5.2a3.2 3.2 0 0 1 0 5.6"/>',
  pipeline: '<path d="M3 8h5a3 3 0 0 1 3 3v2a3 3 0 0 0 3 3h5"/><circle cx="3" cy="8" r="1.6"/><circle cx="21" cy="16" r="1.6"/><path d="M11 8h3"/>',
  meter: '<path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17 16 11"/><circle cx="12" cy="17" r="1.3"/>',
  // Curriculum concepts that the deck set does not name.
  hook: '<path d="M14 3.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/><path d="M12 5.5v8.5a4 4 0 0 0 8 0V13"/><path d="M4 14.5a4 4 0 0 0 4 4"/>',
  agent: '<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V4.5M9.5 4.5h5"/><path d="M9 13.5h.01M15 13.5h.01"/><path d="M9.5 16.5h5"/>',
  worktree: '<path d="M12 3.5v17"/><path d="M12 9c-3 0-5-2-6-4.5M12 13c3 0 5-2 6-4.5M12 17c-3 0-5-2-6-4.5"/>',
  evidence: '<path d="M6 3.5h9l4 4V20.5H6z"/><path d="M15 3.5v4h4"/><path d="M9 14l2.2 2.2L15.5 12"/>',
  chat: '<path d="M4 5.5h16v10H10l-4 3.5v-3.5H4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  timer: '<circle cx="12" cy="13" r="7.5"/><path d="M12 8.5V13h3.5"/><path d="M12 3.5v2M4.5 6.5 6 8"/>'
};

export function hasIcon(name: string): name is IconName {
  return name in ICON_PATHS || name in ICON_FRAGMENTS;
}

/** Inner SVG markup for one icon (no outer <svg>). */
export function iconInner(name: IconName): string {
  const paths = ICON_PATHS[name];
  if (paths) return paths.map(d => `<path d="${d}"/>`).join('');
  const fragment = ICON_FRAGMENTS[name];
  if (!fragment) throw new Error(`Unknown icon: ${name}`);
  return fragment;
}

/** A complete nested <svg> for use inside another SVG (scenes, diagrams). Color inherits from `color`. */
export function iconSvg(name: IconName, x: number, y: number, size = 24, color = 'currentColor'): string {
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:${color}">${iconInner(name)}</svg>`;
}
