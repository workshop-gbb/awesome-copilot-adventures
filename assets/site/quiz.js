/* Retrieval check: nothing is preselected, the first click explains the chosen option, and the full
   answer list stays visible for anyone without JavaScript or using a screen reader from the top. */
export function enhanceQuiz(labels) {
  for (const quiz of document.querySelectorAll('[data-quiz]')) {
    const options = [...quiz.querySelectorAll('[data-quiz-option]')];
    const result = quiz.querySelector('[data-quiz-result]');
    const answers = quiz.querySelector('[data-quiz-answers]');
    if (!options.length || !result) continue;
    quiz.querySelector('[data-quiz-options]').hidden = false;
    result.hidden = false;
    answers.hidden = true;
    for (const option of options) {
      option.addEventListener('click', () => {
        const correct = option.dataset.state === 'correct';
        for (const other of options) {
          delete other.dataset.chosen;
          other.setAttribute('aria-pressed', 'false');
        }
        option.dataset.chosen = 'true';
        option.setAttribute('aria-pressed', 'true');
        quiz.dataset.answered = option.dataset.state;
        result.textContent = `${correct ? labels.correct : labels.incorrect}. ${option.dataset.why}`;
      });
      option.setAttribute('aria-pressed', 'false');
    }
  }
}
