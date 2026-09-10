import { createWorkflow, transitionWorkflow, evaluateContext, contextBudget, patches, verifyPatch, evidenceLines } from './simulation.mjs';

export function enhanceStudios() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  for (const root of document.querySelectorAll('[data-studio]')) {
    const { text, stages, locale } = JSON.parse(root.querySelector('[data-studio-config]').textContent);
    const number = new Intl.NumberFormat(locale);
    let workflow = createWorkflow();
    let timer;
    const play = root.querySelector('[data-play]');
    const step = root.querySelector('[data-step]');
    const scenario = root.querySelector('[data-scenario]');
    const speed = root.querySelector('[data-speed]');
    const retry = root.querySelector('[data-workflow-retry]');
    const nodes = [...root.querySelectorAll('[data-stage]')];
    const details = [...root.querySelectorAll('[data-stage-detail]')];

    const stopTimer = () => { clearTimeout(timer); timer = undefined; };
    const renderWorkflow = () => {
      const playing = workflow.status === 'running';
      const terminal = workflow.status === 'blocked' || workflow.status === 'complete';
      play.disabled = terminal;
      step.disabled = playing || terminal;
      play.setAttribute('aria-pressed', String(playing));
      root.querySelector('[data-play-label]').textContent = playing ? text.pause : text.play;
      root.querySelector('[data-play-icon]').hidden = playing;
      root.querySelector('[data-pause-icon]').hidden = !playing;
      root.querySelector('[data-workflow-status]').textContent = text[workflow.status];
      const output = root.querySelector('[data-workflow-output]');
      output.dataset.status = workflow.status;
      root.querySelector('[data-workflow-message]').textContent = workflow.status === 'blocked' ? text.traceBlocked
        : workflow.cursor < 0 ? text.traceEmpty : stages[workflow.cursor].trace;
      root.querySelector('[data-workflow-progress]').value = workflow.cursor + 1;
      root.querySelector('[data-workflow-count]').textContent = `${number.format(workflow.cursor + 1)} / ${number.format(stages.length)}`;
      nodes.forEach((node, index) => {
        const current = index === workflow.cursor;
        const state = current ? 'current' : index < workflow.cursor ? 'visited' : 'pending';
        // Re-entering a state replays its arrival, so a step forward is visible as an event.
        if (node.dataset.state !== state && state !== 'pending') {
          // Restarting the animation requires the attribute to leave and re-enter the selector.
          node.dataset.state = 'pending';
          void node.offsetWidth;
        }
        node.dataset.state = state;
        if (current) node.setAttribute('aria-current', 'step');
        else node.removeAttribute('aria-current');
        node.querySelector('[data-stage-state]').textContent = text[node.dataset.state];
      });
      // The map itself carries the outcome, so a blocked review can show the handoff being refused.
      root.querySelector('[data-workflow-map]').dataset.outcome = workflow.status;
      details.forEach((detail, index) => { detail.hidden = index !== Math.max(0, workflow.cursor); });
      retry.hidden = workflow.status !== 'blocked';
    };
    const schedule = () => {
      stopTimer();
      if (workflow.status !== 'running') return;
      timer = setTimeout(() => {
        workflow = transitionWorkflow(workflow, 'next');
        renderWorkflow();
        schedule();
      }, Number(speed.value));
    };
    const pause = () => {
      stopTimer();
      workflow = transitionWorkflow(workflow, 'pause');
      renderWorkflow();
    };
    const resetWorkflow = () => {
      stopTimer();
      workflow = createWorkflow(scenario.value);
      renderWorkflow();
    };
    play.addEventListener('click', () => {
      if (workflow.status === 'running') return pause();
      workflow = transitionWorkflow(workflow, 'play');
      if (workflow.cursor < 0) workflow = transitionWorkflow(workflow, 'next');
      renderWorkflow();
      schedule();
    });
    step.addEventListener('click', () => {
      workflow = transitionWorkflow(workflow, 'next');
      renderWorkflow();
    });
    scenario.addEventListener('change', resetWorkflow);
    speed.addEventListener('change', schedule);
    root.querySelector('[data-workflow-reset]').addEventListener('click', resetWorkflow);
    retry.addEventListener('click', () => { scenario.value = 'passing'; resetWorkflow(); play.focus(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) { pause(); stopTerminal(); } });
    addEventListener('pagehide', () => { pause(); stopTerminal(); });
    root.querySelector('[data-workflow-controls]').hidden = false;
    root.querySelector('[data-workflow-output]').hidden = false;
    renderWorkflow();

    const inputs = [...root.querySelectorAll('[data-context-file]')];
    const renderContext = () => {
      const result = evaluateContext(inputs.filter(input => input.checked).map(input => input.value));
      root.querySelector('[data-context-used]').textContent = number.format(result.units);
      root.querySelector('[data-context-meter]').value = Math.min(contextBudget, result.units);
      const message = root.querySelector('[data-context-message]');
      message.textContent = { over: text.contextOver, missing: text.contextMissing, noisy: text.contextNoisy, ready: text.contextReady }[result.status];
      message.dataset.status = result.status;
      root.querySelector('.he-context-meter').dataset.status = result.status;
    };
    inputs.forEach(input => { input.disabled = false; input.addEventListener('change', renderContext); });
    const resetContext = root.querySelector('[data-context-reset]');
    resetContext.hidden = false;
    resetContext.addEventListener('click', () => {
      inputs.forEach(input => { input.checked = ['task', 'code'].includes(input.value); });
      renderContext();
    });
    renderContext();

    const patch = root.querySelector('[data-patch]');
    const rows = [...root.querySelectorAll('[data-check-row]')];
    const checksMessage = root.querySelector('[data-checks-message]');
    const resetChecks = message => {
      root.querySelector('[data-patch-code]').textContent = patches[patch.value];
      for (const row of rows) {
        row.querySelector('[data-check-actual]').textContent = '—';
        row.querySelector('[data-check-result]').textContent = text.notRun;
        delete row.dataset.result;
      }
      checksMessage.textContent = message;
      delete checksMessage.dataset.status;
    };
    patch.addEventListener('change', () => resetChecks(text.checksChanged));
    root.querySelector('[data-run-checks]').addEventListener('click', () => {
      const results = verifyPatch(patch.value);
      const passed = results.filter(result => result.passed).length;
      results.forEach((result, index) => {
        rows[index].querySelector('[data-check-actual]').textContent = result.actual;
        rows[index].querySelector('[data-check-result]').textContent = result.passed ? text.pass : text.fail;
        rows[index].dataset.result = result.passed ? 'pass' : 'fail';
      });
      checksMessage.dataset.status = passed === results.length ? 'complete' : 'blocked';
      checksMessage.textContent = `${number.format(passed)} / ${number.format(results.length)} ${text.checksPassed}. ${passed === results.length ? text.checksComplete : text.checksFailed}`;
    });
    root.querySelector('[data-checks-reset]').addEventListener('click', () => {
      patch.value = 'incomplete';
      resetChecks(text.checksReady);
    });
    root.querySelector('[data-verification-controls]').hidden = false;

    // Evidence trail: a typed transcript of the same bounded fixture, never a shell.
    const terminalOutput = root.querySelector('[data-terminal-output]');
    const terminalPatch = root.querySelector('[data-terminal-patch]');
    const terminalStatus = root.querySelector('[data-terminal-status]');
    const prefixes = { command: '$ ', comment: '# ', pass: '\u2713 ', fail: '\u2715 ', warn: '\u26a0 ', output: '' };
    let terminalTimer;
    let terminalRun = 0;
    const stopTerminal = () => { clearTimeout(terminalTimer); terminalTimer = undefined; terminalRun += 1; };
    // Screen readers hear the outcome once, not every typed character.
    const announce = lines => {
      const summary = lines.filter(line => ['output', 'pass', 'warn', 'fail'].includes(line.kind)).slice(-2);
      terminalStatus.textContent = summary.map(line => line.text).join('. ');
    };
    const printTerminal = lines => {
      terminalOutput.replaceChildren();
      for (const line of lines) {
        const node = document.createElement('span');
        node.dataset.line = line.kind;
        node.textContent = `${prefixes[line.kind] ?? ''}${line.text}`;
        terminalOutput.append(node);
      }
      announce(lines);
    };
    const typeTerminal = () => {
      stopTerminal();
      const run = terminalRun;
      const lines = evidenceLines(terminalPatch.value);
      if (reducedMotion.matches) { printTerminal(lines); return; }
      terminalOutput.replaceChildren();
      terminalStatus.textContent = '';
      const caret = document.createElement('span');
      caret.className = 'he-terminal__cursor';
      caret.setAttribute('aria-hidden', 'true');
      let index = 0;
      const next = () => {
        if (run !== terminalRun) return;
        if (index >= lines.length) { caret.remove(); announce(lines); return; }
        const line = lines[index];
        const node = document.createElement('span');
        node.dataset.line = line.kind;
        terminalOutput.insertBefore(node, caret);
        const full = `${prefixes[line.kind] ?? ''}${line.text}`;
        index += 1;
        if (line.kind !== 'command') {
          node.textContent = full;
          terminalOutput.scrollTop = terminalOutput.scrollHeight;
          terminalTimer = setTimeout(next, 260);
          return;
        }
        let position = 0;
        const typeCharacter = () => {
          if (run !== terminalRun) return;
          node.textContent = full.slice(0, position);
          terminalOutput.scrollTop = terminalOutput.scrollHeight;
          position += 1;
          terminalTimer = setTimeout(position <= full.length ? typeCharacter : next, position <= full.length ? 22 : 320);
        };
        typeCharacter();
      };
      terminalOutput.append(caret);
      terminalTimer = setTimeout(next, 260);
    };
    root.querySelector('[data-terminal-run]').addEventListener('click', typeTerminal);
    root.querySelector('[data-terminal-reset]').addEventListener('click', () => {
      stopTerminal();
      terminalPatch.value = 'incomplete';
      printTerminal(evidenceLines('incomplete'));
    });
    terminalPatch.addEventListener('change', () => { stopTerminal(); printTerminal(evidenceLines(terminalPatch.value)); });
    reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) { stopTerminal(); printTerminal(evidenceLines(terminalPatch.value)); } });
    root.querySelector('[data-terminal-controls]').hidden = false;

    const tabs = [...root.querySelectorAll('[data-studio-tab]')];
    const panels = [...root.querySelectorAll('[data-studio-panel]')];
    const tablist = root.querySelector('[data-studio-tabs]');
    const selectTab = (id, updateAddress = false) => {
      const selected = tabs.find(tab => tab.dataset.studioTab === id) || tabs[0];
      if (selected.dataset.studioTab !== 'workflow') pause();
      if (selected.dataset.studioTab !== 'evidence') stopTerminal();
      for (const tab of tabs) {
        const active = tab === selected;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      }
      for (const panel of panels) panel.hidden = panel.dataset.studioPanel !== selected.dataset.studioTab;
      if (updateAddress) {
        history.replaceState(null, '', `${location.pathname}${location.search}#${selected.dataset.studioTab}`);
        dispatchEvent(new Event('hashchange'));
      }
    };
    tablist.setAttribute('role', 'tablist');
    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', tab.dataset.studioTab);
      tab.addEventListener('click', () => selectTab(tab.dataset.studioTab, true));
      tab.addEventListener('keydown', event => {
        const target = event.key === 'ArrowRight' ? (index + 1) % tabs.length
          : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length
            : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
        if (target < 0) return;
        event.preventDefault();
        tabs[target].focus();
        selectTab(tabs[target].dataset.studioTab, true);
      });
    });
    panels.forEach(panel => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `tab-${panel.dataset.studioPanel}`);
      panel.tabIndex = 0;
    });
    tablist.hidden = false;
    selectTab(location.hash.slice(1));
    addEventListener('hashchange', () => selectTab(location.hash.slice(1)));
  }
}
