import { iconHtml } from './icons';
import { levelLabel } from './levels';
import type { DocumentInfo, Labels } from './catalog';

/*
 * The lesson ends with a bare link to the next one. This turns that link into a card carrying the
 * next lesson's cover, its level and its capability, so the path continues instead of stopping.
 * The lookup is by rendered URL, so it follows whatever the Markdown actually links to.
 */
function esc(value: string): string {
  return value.replace(/[&<>"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character] as string);
}

const ANCHORS = ['next-adventure', 'next-lab', 'next-steps'];

export function injectNextLesson(html: string, catalog: DocumentInfo[], ui: Labels): string {
  for (const anchor of ANCHORS) {
    const heading = html.indexOf(`<h2 id="${anchor}"`);
    if (heading < 0) continue;
    const rest = html.slice(heading);
    const paragraph = rest.match(/<p>\s*<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/p>/);
    if (!paragraph || paragraph.index === undefined) return html;
    const target = catalog.find(document => document.url === paragraph[1]);
    if (!target) return html;
    const level = target.navigationSection ? levelLabel(ui, target.navigationSection) : '';
    const cover = target.image
      ? `<img src="${esc(target.image)}" alt="" width="1456" height="832" loading="lazy" decoding="async" />`
      : '';
    const card = `<a class="next-lesson" href="${esc(target.url)}">`
      + cover
      + `<span class="next-lesson__body"><span class="eyebrow">${iconHtml('arrow', 13)}${esc(ui.nextLesson)}</span>`
      + `<strong>${esc(target.title)}</strong>`
      + (level ? `<span class="next-lesson__level">${esc(level)}</span>` : '')
      + `</span></a>`;
    const start = heading + paragraph.index;
    return html.slice(0, start) + card + html.slice(start + paragraph[0].length);
  }
  return html;
}
