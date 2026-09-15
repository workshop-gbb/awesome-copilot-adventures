const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const script = fs.readFileSync(path.join(__dirname, '../assets/site/checklist.js'), 'utf8');

function setup(saved = '[]') {
  const created = [];
  function node(tagName, textContent = '') {
    const element = {
      tagName, textContent, childNodes: [], parentNode: null, listeners: {},
      classList: { add() {}, contains: value => value === 'contains-task-list' },
      setAttribute(name, value) { this[name] = value; },
      addEventListener(name, listener) { this.listeners[name] = listener; },
      focus() { this.focused = true; },
      before(child) {
        child.parentNode = this.parentNode;
        const siblings = this.parentNode.childNodes;
        siblings.splice(siblings.indexOf(this), 0, child);
      },
      get nextSibling() {
        const siblings = this.parentNode?.childNodes || [];
        return siblings[siblings.indexOf(this) + 1] || null;
      },
      append(...children) {
        for (const child of children) {
          if (child.parentNode) {
            const siblings = child.parentNode.childNodes;
            siblings.splice(siblings.indexOf(child), 1);
          }
          child.parentNode = this;
          this.childNodes.push(child);
        }
      },
      after(child) {
        child.parentNode = this.parentNode;
        const siblings = this.parentNode.childNodes;
        siblings.splice(siblings.indexOf(this) + 1, 0, child);
      }
    };
    created.push(element);
    return element;
  }
  const text = node('#text', ' Verifique ');
  const code = node('CODE', 'npm test');
  const boxes = [node('INPUT'), node('INPUT')];
  for (const box of boxes) box.disabled = true;
  const first = node('LI');
  first.append(boxes[0], text, code);
  const second = node('LI');
  second.append(boxes[1], node('#text', ' Revise o resultado.'));
  const list = node('UL');
  list.append(first, second);
  list.querySelectorAll = () => boxes.filter(box => box.disabled);
  const root = node('DIV');
  root.append(list);
  const storage = new Map([['evidence', saved], ['reading', 'unchanged']]);
  vm.runInNewContext(`${script.replace('export function', 'function')}\nenhanceChecklist(labels, 'evidence');`, {
    document: {
      getElementById: id => id === 'evidence-checklist' ? { nextElementSibling: list } : null,
      createElement: tag => node(tag.toUpperCase())
    },
    localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    labels: { progress: '{done} / {total}', clear: 'Clear', note: 'Local evidence only' },
    DOMException, SyntaxError
  });
  return { boxes, first, text, code, storage, created };
}

test('evidence checklist labels preserve inline content and restore existing marks', () => {
  const app = setup('[0]');
  const labels = app.created.filter(node => node.tagName === 'LABEL');
  assert.equal(labels.length, 2);
  for (const [index, label] of labels.entries()) {
    assert.equal(label.htmlFor, app.boxes[index].id);
    assert.equal(app.boxes[index].disabled, false);
  }
  assert.notEqual(labels[0].htmlFor, labels[1].htmlFor);
  assert.deepEqual(labels[0].childNodes, [app.text, app.code]);
  assert.deepEqual(app.first.childNodes, [app.boxes[0], labels[0]]);
  assert.equal(app.boxes[0].checked, true);
  assert.equal(app.boxes[1].checked, false);
});

test('labelled evidence checkboxes still persist changes and reset only their own marks', () => {
  const app = setup();
  app.boxes[1].checked = true;
  app.boxes[1].listeners.change();
  assert.equal(app.storage.get('evidence'), '[1]');
  const reset = app.created.find(node => node.tagName === 'BUTTON');
  assert.equal(reset.disabled, false);
  reset.listeners.click();
  assert.equal(app.storage.get('evidence'), '[]');
  assert.equal(app.storage.get('reading'), 'unchanged');
  assert.ok(app.boxes.every(box => !box.checked));
  assert.equal(reset.disabled, true);
  assert.equal(app.boxes[0].focused, true);
});
