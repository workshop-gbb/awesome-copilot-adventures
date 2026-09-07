"""mocks v3.0.0: faithful, LIGHT-theme product mocks (VS Code, Copilot Chat, Azure portal, GitHub PR,
browser, phone) and the dark terminal with typed lines. Typing runs through runtime.js ([data-type])."""
from visual_layer import ico

def terminal(title, lines, speed=16, height=None, *, comfortable=False):
    """lines: list of strings. '$ ' = typed command, '> ' = typed prompt to the agent, '# ' comment,
    '✓' ok, '✕' error, '⚠' warning; everything else prints as output."""
    body = '\n'.join(lines).replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;')
    st = f' style="min-height:{height}px;max-height:{height}px"' if height else ''
    return f'<div class="term{" term--comfortable" if comfortable else ""}"><div class="term__bar"><i></i><i></i><i></i><span>{title}</span></div><pre data-type="{body}" data-speed="{speed}"{st}></pre></div>'

def vscode(file_tabs, files, code_lines, chat_msgs, chat_title='GitHub Copilot Chat', mode='Agent', status='main · GitHub Copilot ready', sidebar_title='Explorer'):
    """file_tabs: [(name, on)]; files: [(name, kind)] kind: dir|sel|''; code_lines: html lines;
    chat_msgs: [(role 'u'|'a', html)]"""
    tabs = ''.join(f'<span class="{"on" if on else ""}">{n}</span>' for n, on in file_tabs)
    side = ''.join(f'<div class="{k}">{n}</div>' for n, k in files)
    code = ''.join(f'<span class="ln">{i+1}</span>{l}\n' for i, l in enumerate(code_lines))
    msgs = ''.join(f'<div class="msg msg--{r}" style="--i:{i}">{h}</div>' for i, (r, h) in enumerate(chat_msgs))
    return (f'<div class="vsc"><div class="vsc__title">{ico("code")}<b>{file_tabs[0][0] if file_tabs else "workspace"}</b> · Visual Studio Code</div>'
            f'<div class="vsc__body"><div class="vsc__act">{ico("file")}{ico("radar")}{ico("branch")}{ico("test")}<span class="on">{ico("spark")}</span></div>'
            f'<div class="vsc__side"><h6>{sidebar_title}</h6>{side}</div>'
            f'<div class="vsc__ed"><div class="vsc__tabs">{tabs}</div><pre class="vsc__code">{code}</pre></div>'
            f'<div class="vsc__chat"><div class="vsc__chath">{ico("spark")}{chat_title}<span class="pill pill--gray">{mode}</span></div><div class="vsc__msgs">{msgs}</div><div class="vsc__in">{ico("send")}Ask GitHub Copilot…<span class="pill pill--gray">{mode}</span></div></div></div>'
            f'<div class="vsc__status"><span>⎇ {status}</span></div></div>')

def chatwindow(title, msgs, placeholder='Ask a question…'):
    m = ''.join(f'<div class="msg msg--{r}" style="--i:{i}">{h}</div>' for i, (r, h) in enumerate(msgs))
    return f'<div class="chatwin"><div class="chatwin__h">{ico("spark")}{title}</div><div class="chatwin__b">{m}</div><div class="chatwin__in">{ico("send")}{placeholder}</div></div>'

def tool_line(text, ok=True): return f'<div class="tool"><i class="{"" if ok else "x"}"></i>{text}</div>'

def portal(title, subtitle, menu, cards, table_headers, table_rows, crumb=('Home', 'Resource groups', 'rg-agentic-prod')):
    """menu: [(label, icon, sel)]; cards: [(label, value, sparkvals, color)]; table_rows: [(name, status_ok, cells...)]"""
    m = ''.join(f'<div class="{"sel" if sel else ""}">{ico(i)}{l}</div>' if i else f'<h6>{l}</h6>' for l, i, sel in menu)
    def spark(vals, color):
        mx = max(vals) or 1; pts = ' '.join(f'{i*100/(len(vals)-1):.1f},{34-v/mx*30:.1f}' for i, v in enumerate(vals))
        return f'<svg viewBox="0 0 100 34" preserveAspectRatio="none"><polyline points="{pts}" fill="none" stroke="{color}" stroke-width="2"/></svg>'
    c = ''.join(f'<div class="azcard"><small>{l}</small><b>{v}</b>{spark(vals, col)}</div>' for l, v, vals, col in cards)
    th = ''.join(f'<th>{h}</th>' for h in table_headers)
    tr = ''.join('<tr>' + f'<td>{r[0]}</td><td><span class="st"><i class="{"" if r[1] else "warn"}"></i>{"Running" if r[1] else "Warning"}</span></td>' + ''.join(f'<td>{x}</td>' for x in r[2:]) + '</tr>' for r in table_rows)
    cr = ' <span>›</span> '.join(f'<b>{x}</b>' if i == len(crumb) - 1 else x for i, x in enumerate(crumb))
    return (f'<div class="portal"><div class="portal__top"><b>Microsoft Azure</b><div class="search">🔍 Search resources, services, and docs (G+/)</div><span style="margin-left:auto">paulasilva@microsoft.com</span></div>'
            f'<div class="portal__crumb">{cr}</div><div class="portal__body"><div class="portal__menu">{m}</div>'
            f'<div class="portal__main"><div class="portal__title">{ico("cloud")}{title}<small>{subtitle}</small></div><div class="portal__cards">{c}</div>'
            f'<div class="ptable"><table><thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table></div></div></div></div>')

def github_pr(repo, number, title, branch, checks, comment_author, comment_html, tabs=('Conversation', 'Commits', 'Checks', 'Files changed')):
    ch = f'<div><span>{ico("check")}</span><b>All checks have passed</b><span class="r">{len(checks)} successful checks</span></div>' + ''.join(f'<div><i class="{k}"></i>{n}<span class="r">{r}</span></div>' for n, k, r in checks)
    tb = ''.join(f'<span class="{"on" if i == 0 else ""}">{t}</span>' for i, t in enumerate(tabs))
    return (f'<div class="ghpr"><div class="ghpr__top">{ico("branch")}<b>{repo}</b><span>Pull requests</span><span>Actions</span><span>Security</span></div>'
            f'<div class="ghpr__head"><h4>{title} <small>#{number}</small></h4><div class="ghpr__meta"><span class="open">Open</span><span><b>copilot</b> wants to merge 3 commits into <code>main</code> from <code>{branch}</code></span></div><div class="ghpr__tabs">{tb}</div></div>'
            f'<div class="ghpr__body"><div class="ghpr__checks">{ch}</div><div class="ghpr__cmt"><div class="h"><b>{comment_author}</b> commented 2 minutes ago</div><div class="b">{comment_html}</div></div></div></div>')

def browser(url, page_html):
    return f'<div class="browser"><div class="browser__bar"><i></i><i></i><i></i><div class="browser__url">{url}</div></div><div class="browser__page">{page_html}</div></div>'

def phone(toasts):
    """toasts: [(icon, title, text)]"""
    t = ''.join(f'<div class="toast" style="--i:{i}">{ico(ic)}<div><b>{tt}</b><span>{tx}</span></div></div>' for i, (ic, tt, tx) in enumerate(toasts))
    return f'<div class="phone"><div class="phone__scr">{t}</div></div>'
