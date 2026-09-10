import { iconHtml } from './icons';
import type { SceneLocale } from './scenes';

/*
 * A retrieval check placed before the evidence checklist: the learner commits to an answer and then
 * reads why each option holds or fails. Nothing is preselected, every option explains itself, and
 * the whole exercise is readable as static text when JavaScript does not run.
 */
type L3 = readonly [string, string, string];
export interface QuizSpec { question: L3; options: readonly { text: L3; correct?: boolean; why: L3 }[]; }
export interface QuizLabels { kicker: string; empty: string; correct: string; incorrect: string; }

const LOCALE_INDEX: Record<SceneLocale, 0 | 1 | 2> = { en: 0, 'pt-br': 1, es: 2 };

function esc(value: string): string {
  return value.replace(/[&<>"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character] as string);
}

export function renderQuiz(spec: QuizSpec, locale: SceneLocale, ui: QuizLabels, id: string): string {
  const index = LOCALE_INDEX[locale];
  const options = spec.options.map((option, position) => {
    const state = option.correct ? 'correct' : 'incorrect';
    return `<li><button type="button" class="quiz-option" data-quiz-option data-state="${state}"`
      + ` data-why="${esc(option.why[index])}" aria-describedby="${id}-result">`
      + `<span class="quiz-mark" aria-hidden="true">${String.fromCharCode(65 + position)}</span>`
      + `<span>${esc(option.text[index])}</span></button></li>`;
  }).join('');
  const answers = spec.options.map(option =>
    `<li data-state="${option.correct ? 'correct' : 'incorrect'}"><strong>${esc(option.text[index])}</strong> ${esc(option.why[index])}</li>`).join('');
  return `<section class="lesson-quiz" data-quiz aria-labelledby="${id}-question">`
    + `<p class="eyebrow">${iconHtml('target', 13)}${esc(ui.kicker)}</p>`
    + `<p class="quiz-question" id="${id}-question">${esc(spec.question[index])}</p>`
    + `<ul class="quiz-options" data-quiz-options hidden>${options}</ul>`
    + `<p class="quiz-result" id="${id}-result" role="status" aria-live="polite" data-quiz-result hidden>${esc(ui.empty)}</p>`
    + `<ul class="quiz-answers" data-quiz-answers>${answers}</ul>`
    + `</section>`;
}

/*
 * Place the check immediately before the section where the learner records what they proved.
 * Heading anchors are derived from the English source, so they are the same in every language:
 * adventures close with an evidence checklist, labs with a verification step.
 */
const EVIDENCE_ANCHORS = ['evidence-checklist', 'verify-your-work', 'independent-practice', 'independent-challenge'];

export function injectBeforeEvidence(html: string, insert: string): string {
  for (const anchor of EVIDENCE_ANCHORS) {
    const heading = html.indexOf(`<h2 id="${anchor}"`);
    if (heading >= 0) return `${html.slice(0, heading)}${insert}${html.slice(heading)}`;
  }
  return `${html}${insert}`;
}
