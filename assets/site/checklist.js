/*
 * The evidence checklist becomes usable during the lab: each item can be ticked, the state is kept
 * in this browser only, and the wording never lets a tick stand in for a command that ran.
 * Without JavaScript the list stays exactly as the Markdown rendered it: readable, disabled boxes.
 */
const ANCHORS = ['evidence-checklist', 'verify-your-work'];

export function enhanceChecklist(labels, storageKey) {
  const heading = ANCHORS.map(id => document.getElementById(id)).find(Boolean);
  if (!heading) return;
  let list = heading.nextElementSibling;
  while (list && !list.classList?.contains('contains-task-list')) {
    if (/^H[1-6]$/.test(list.tagName)) return;
    list = list.nextElementSibling;
  }
  const boxes = [...(list?.querySelectorAll('input[type="checkbox"][disabled]') || [])];
  if (!boxes.length) return;

  let state = new Set();
  let storageAvailable = true;
  const read = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return new Set(Array.isArray(saved) ? saved.filter(value => Number.isInteger(value)) : []);
    } catch (error) {
      if (!(error instanceof DOMException || error instanceof SyntaxError)) throw error;
      storageAvailable = false;
      return new Set();
    }
  };
  state = read();

  list.classList.add('evidence-list');
  const status = document.createElement('p');
  status.className = 'evidence-progress';
  const count = document.createElement('strong');
  const note = document.createElement('span');
  note.className = 'evidence-note';
  note.textContent = labels.note;
  const clear = document.createElement('button');
  clear.type = 'button';
  clear.className = 'quiet-button';
  clear.textContent = labels.clear;
  status.append(count, clear, note);
  const live = document.createElement('p');
  live.className = 'sr-only';
  live.setAttribute('role', 'status');
  list.before(status);
  status.after(live);

  const render = announce => {
    const done = boxes.filter(box => box.checked).length;
    count.textContent = labels.progress.replace('{done}', String(done)).replace('{total}', String(boxes.length));
    clear.disabled = done === 0;
    if (announce) live.textContent = count.textContent;
  };
  const save = () => {
    if (!storageAvailable) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(boxes.map((box, index) => box.checked ? index : -1).filter(index => index >= 0)));
    } catch (error) {
      if (!(error instanceof DOMException)) throw error;
      storageAvailable = false;
      note.textContent = labels.note;
    }
  };
  boxes.forEach((box, index) => {
    box.disabled = false;
    box.checked = state.has(index);
    box.addEventListener('change', () => { save(); render(true); });
  });
  clear.addEventListener('click', () => {
    for (const box of boxes) box.checked = false;
    save();
    render(true);
    boxes[0].focus();
  });
  render(false);
}
