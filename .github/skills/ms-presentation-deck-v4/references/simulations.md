# Simulations: terminal, VS Code, Copilot Chat, Azure portal, GitHub, browser, phone (v4.0.0)

`scripts/mocks.py` (import as `M`) draws faithful product surfaces in CSS: **light theme for every
product** (VS Code, GitHub Copilot Chat, the Azure portal, GitHub, the browser, the phone); the
terminal is the only dark surface. They are the hero slides of part VII of the showcase (82 to 89).
Product mocks keep fixed pixel heights (terminal 300 to 420, VS Code 470, chat 456, portal 500,
GitHub 500, browser 480, phone 500) and grow at most 1.18x under `fillCanvas`, so a mock slide is
usually `nofill=True` or paired with a ledger in `cols2`.

```python
M.terminal(title, lines, speed=16, height=None)
M.terminal(title, lines, height=310, comfortable=True)  # 16px transcript for a short explanatory sequence
# lines are typed live by runtime.js: '$ cmd' typed as a command, '> prompt' typed to the agent,
# '# comment' gray, '✓ …' green, '✕ …' red, '⚠ …' yellow, anything else prints as output.
# The simulation restarts every time the slide becomes active and stops when it leaves.

M.vscode(file_tabs=[('pre-tool-policy.sh', True), ('hooks.json', False)],
         files=[('payments-api', 'dir'), ('.github/', ''), ('pre-tool-policy.sh', 'sel')],
         code_lines=[html…],                       # use the .kw .fn .st .cm spans of C.codewin for colors, .hl for a highlighted line
         chat_msgs=[('u', html), ('a', html)],     # user / assistant, appear one by one; M.tool_line(text, ok) draws a tool call row
         chat_title='Copilot Chat', mode='Agent', status='main · 4 hooks · Agent')
M.chatwindow(title, msgs, placeholder='Ask a question…')     # standalone GitHub Copilot Chat window
M.portal(title, subtitle, menu=[(label, icon, selected)], cards=[(label, value, sparkvals, color)],
         table_headers=[…], table_rows=[(name, ok, cell, cell, …)], crumb=('Home', 'Resource groups', 'rg-x'))
M.github_pr(repo, number, title, branch, checks=[(name, 'ok'|'warn', right_text)], comment_author, comment_html)
M.browser(url, page_html)                          # any HTML page inside a browser frame (KPIs, a table, a button)
M.phone([(icon, title, text)])                     # notification toasts, appear one by one
```

## Rules

- **Faithful, not fancy.** The Azure portal is Azure blue on white, the GitHub PR uses the GitHub
  light palette and Open pill, VS Code shows activity bar, explorer, tabs, editor with line numbers,
  the chat panel with the Agent pill and the status bar. Never a dark editor: "nada de cor escura"
  except the terminal.
- **Real content.** Paste a real script, a real payload (redacted), real resource names; the hook
  file names of the deck must match the ones in the editor tab, the chat and the terminal.
- **Typing has a rhythm.** `speed` is ms per character (16 default); a terminal with more than
  fourteen lines should be two slides. Keep the still of the finished state on the next slide when
  the room may have no time to watch.
- **The chat shows tool calls**: `M.tool_line('read logs/tool-results.jsonl · 1 match')` rows in
  green, a failed one with `ok=False` in red, and a citation line in mono under the answer.
- **Hooks appear armed** in a terminal that demonstrates a guardrail: the "hooks: N loaded" line
  comes right after the banner, the deny with its reason at the end.
- Screenshots of these slides in QA need the typing to finish: `shots.py` waits 4200ms by default.
  A terminal that cannot finish by then is too long for one slide; split it or pass an explicitly
  justified longer wait for that capture.
