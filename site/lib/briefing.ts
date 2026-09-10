import labCatalog from '../../mslearn-github-copilot/catalog.json';
import { iconHtml, type IconName } from './icons';
import { levelLabel } from './levels';
import type { Labels, PageInfo } from './catalog';

/*
 * The lesson briefing: what the learner will be able to do, at which level, with which stack and in
 * roughly how long. Every value comes from the lesson's own frontmatter, so the header cannot drift
 * from the page. The capability statement is translated like a title; the stack stays original.
 * Rendered as markup because it is injected directly after the lesson's first heading.
 */
function esc(value: string): string {
  return value.replace(/[&<>"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character] as string);
}

export function renderBriefing(page: PageInfo, ui: Labels, downloadsHref: string): string {
  const lab = page.source ? labCatalog.labs.find(entry => page.source?.endsWith(entry.file)) : undefined;
  const minutes = page.duration?.match(/^(\d+)/)?.[1];
  const statusLabels: Record<string, string> = { 'content-ready': ui.statusContentReady };
  const facts: { icon: IconName; label: string; value: string }[] = [];
  if (page.level) facts.push({ icon: 'steps', label: ui.briefingLevel, value: levelLabel(ui, page.level) });
  if (page.difficulty) facts.push({ icon: 'meter', label: ui.briefingLevel, value: page.difficulty });
  if (lab?.stack) facts.push({ icon: 'code', label: ui.briefingStack, value: lab.stack });
  if (minutes) facts.push({ icon: 'stopwatch', label: ui.briefingTime, value: `${minutes} ${ui.minutesLabel}` });
  if (page.status) facts.push({ icon: 'check-circle', label: ui.briefingStatus, value: statusLabels[page.status] || page.status });
  if (!page.capability && !facts.length) return '';
  const capability = page.capability
    ? `<p class="briefing-capability"><span class="eyebrow">${iconHtml('target', 13)}${esc(ui.briefingCapability)}</span>`
      + `<strong>${esc(page.capability)}</strong></p>`
    : '';
  const list = facts.length
    ? `<dl class="briefing-facts">${facts.map(fact =>
      `<div><dt>${iconHtml(fact.icon, 13)}${esc(fact.label)}</dt><dd>${esc(fact.value)}</dd></div>`).join('')}</dl>`
    : '';
  return `<aside class="lesson-briefing" aria-label="${esc(ui.briefingCapability)}">${capability}${list}`
    + `<p class="briefing-actions"><a class="text-link" href="${esc(downloadsHref)}">${iconHtml('download', 15)}${esc(ui.learnerKits)}</a></p></aside>`;
}

/** Place markup directly after the document's first heading, before the story begins. */
export function injectAfterTitle(html: string, insert: string): string {
  const heading = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/);
  if (!heading || heading.index === undefined) return `${insert}${html}`;
  const end = heading.index + heading[0].length;
  return `${html.slice(0, end)}${insert}${html.slice(end)}`;
}
