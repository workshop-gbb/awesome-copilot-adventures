"""Engineering diagrams and reference architectures for the master showcase.
Each function returns the SVG of one diagram, built with diagram_kit.Diagram."""
from diagram_kit import Diagram, COLORS

GH = '#24292F'; AZ = '#0078D4'
def gh(i): return (i, GH)
def az(i): return (i, None)
def li(i, c='var(--ps-color-ink-3)'): return (f'i-{i}', c)

# ============ IV · engineering ============
def flowchart():
    d = Diagram('dgf', 1120, 470, kind='flowchart')
    d.startstop(60, 235)
    d.node(110, 205, 190, 60, 'Receive request', 'POST /orders', icon=li('send', COLORS['blue']))
    d.conn([(70, 235), (110, 235)], 'thin', 'ar')
    d.diamond(400, 235, 170, 90, 'valid?', 'schema + auth')
    d.conn([(300, 235), (315, 235)], 'thin', 'ar')
    d.node(560, 90, 220, 60, 'Reject 400', 'reason in body', icon=li('x', 'var(--ps-text-red)'), color='red', kind='soft')
    d.conn([(400, 190), (400, 120), (560, 120)], 'thin', 'ar-red'); d.label(420, 150, 'no', 'start', color='red')
    d.diamond(640, 235, 170, 90, 'in stock?', 'inventory svc')
    d.conn([(485, 235), (555, 235)], 'thin', 'ar'); d.label(520, 226, 'yes', 'middle', color='green')
    d.node(800, 205, 220, 60, 'Reserve + charge', 'saga step 1, 2', icon=li('money', COLORS['green']), color='green', kind='soft')
    d.conn([(725, 235), (800, 235)], 'thin', 'ar'); d.label(762, 226, 'yes', 'middle', color='green')
    d.node(560, 380, 220, 60, 'Backorder', 'notify customer', icon=li('clock', COLORS['yellow']), color='yellow', kind='soft')
    d.conn([(640, 280), (640, 380)], 'thin', 'ar'); d.label(660, 335, 'no', 'start', color='red')
    d.startstop(1080, 235, end=True)
    d.conn([(1020, 235), (1066, 235)], 'acc', 'ar-acc')
    d.conn([(780, 410), (1080, 410), (1080, 250)], 'dashed', 'ar')
    d.dot([(70, 235), (315, 235), (485, 235), (555, 235), (725, 235), (1020, 235), (1066, 235)], 5)
    d.legend(462, [('sw', 'yellow', 'decision'), ('sw', 'green', 'happy path'), ('sw', 'red', 'rejection'), ('dl', 'ink3', 'asynchronous')])
    return d.render()

def sequence():
    d = Diagram('dgs', 1120, 470, kind='sequence')
    xs = [120, 370, 620, 870]; names = [('Developer', li('users', COLORS['blue'])), ('GitHub Copilot CLI', gh('gh-cli')), ('preToolUse hook', gh('gh-security')), ('Shell', li('terminal', COLORS['ink3']))]
    for x, (n, ic) in zip(xs, names): d.lifeline(x, 10, 440, n, ic)
    d.activation(370, 100, 400); d.activation(620, 150, 260); d.activation(870, 310, 370)
    d.message(120, 364, 100, '> "run the tests and push"')
    d.message(376, 614, 150, 'stdin: toolName, toolArgs', 'acc', 'ar-acc')
    d.selfmsg(626, 180, 'parse twice · deny list')
    d.message(614, 376, 260, 'stdout: decision allow', 'thin', 'ar', dashed=True)
    d.message(376, 864, 310, 'npm test && git push', 'acc', 'ar-acc')
    d.message(864, 376, 370, 'exit 0 · 42 passed', 'thin', 'ar', dashed=True)
    d.message(364, 126, 400, 'summary + PR link', 'thin', 'ar', dashed=True)
    d.note(640, 62, 300, 56, ['fail-closed here: a crash denies,', 'a timeout lets the tool run'])
    d.legend(462, [('ln', 'accent', 'synchronous call'), ('dl', 'ink3', 'reply'), ('sw', 'yellow', 'note')])
    return d.render()

def state_machine():
    d = Diagram('dgm', 1120, 470, kind='state-machine')
    d.startstop(60, 120)
    d.state(200, 120, 170, 'Draft', 'author edits')
    d.conn([(70, 120), (115, 120)], 'thin', 'ar')
    d.state(480, 120, 190, 'In review', 'reviewers assigned')
    d.conn([(285, 120), (385, 120)], 'thin', 'ar'); d.label(335, 110, 'open PR')
    d.state(780, 120, 190, 'Approved', '2 approvals + checks', kind='soft'); d.parts[-1] = d.parts[-1].replace('n--soft', 'n--soft" style="--nc:var(--ps-color-ms-green-500)')
    d.conn([(575, 120), (685, 120)], 'thin', 'ar'); d.label(630, 110, 'approve')
    d.state(780, 320, 190, 'Merged', 'squash to main', kind='dark')
    d.conn([(780, 149), (780, 291)], 'acc', 'ar-acc'); d.label(800, 224, 'merge', 'start')
    d.state(480, 320, 190, 'Changes requested', 'back to author')
    d.conn([(520, 149), (520, 291)], 'thin', 'ar-red'); d.label(540, 224, 'request changes', 'start', color='red')
    d.conn([(385, 320), (200, 320), (200, 149)], 'thin', 'ar'); d.label(300, 310, 'push fix')
    d.state(200, 420, 170, 'Closed', 'no merge')
    d.conn([(200, 149), (200, 397)], 'dashed', 'ar'); d.label(120, 280, 'abandon', 'start')
    d.conn([(500, 91), (500, 62), (560, 62), (560, 91)], 'thin', 'ar'); d.label(530, 54, 're-request review')
    d.startstop(1040, 320, end=True); d.conn([(875, 320), (1026, 320)], 'thin', 'ar')
    d.legend(462, [('sw', 'green', 'gate passed'), ('sw', 'red', 'rework'), ('dl', 'ink3', 'exceptional transition')])
    return d.render()

def er_diagram():
    d = Diagram('dge', 1120, 470, kind='er')
    d.entity(40, 40, 250, 'Customer', [('customer_id', 'pk'), ('email', ''), ('tenant_id', 'fk'), ('created_at', '')])
    d.entity(420, 40, 250, 'Order', [('order_id', 'pk'), ('customer_id', 'fk'), ('status', ''), ('total_cents', ''), ('placed_at', '')])
    d.entity(800, 40, 260, 'OrderItem', [('order_id', 'fk'), ('sku', 'fk'), ('qty', ''), ('unit_price_cents', '')])
    d.entity(420, 290, 250, 'Product', [('sku', 'pk'), ('name', ''), ('price_cents', ''), ('active', '')])
    d.entity(40, 290, 250, 'Tenant', [('tenant_id', 'pk'), ('name', ''), ('region', '')])
    d.conn([(290, 92), (420, 92)], 'thin', 'crow', start='none'); d.label(355, 82, '1 ⟶ n')
    d.conn([(670, 92), (800, 92)], 'thin', 'crow'); d.label(735, 82, '1 ⟶ n')
    d.conn([(930, 152), (930, 320), (670, 320)], 'thin', 'crow'); d.label(800, 310, 'n ⟶ 1')
    d.conn([(165, 152), (165, 290)], 'thin', 'crow', start='none'); d.label(190, 224, 'n ⟶ 1', 'start')
    d.note(760, 340, 300, 74, ['OrderItem is the join table:', 'composite key (order_id, sku),', 'price frozen at purchase time'])
    d.legend(462, [('ln', 'ink3', 'crow foot = many side'), ('sw', 'ink', 'primary key row (🔑)'), ('sw', 'ink3', 'foreign key (↗)')])
    return d.render()

def class_diagram():
    d = Diagram('dgc', 1120, 470, kind='class')
    d.classbox(40, 60, 260, 'Hook', ['+ event: HookEvent', '+ matcher: RegExp', '+ timeoutSec: number'], ['+ run(payload): Decision'], 'abstract')
    d.classbox(400, 40, 280, 'CommandHook', ['+ bash: string', '+ cwd: string'], ['+ run(payload): Decision', '- parseStdout(): Decision'])
    d.classbox(400, 270, 280, 'HttpHook', ['+ url: URL', '+ allowedEnvVars: string[]'], ['+ run(payload): Decision'])
    d.classbox(780, 60, 280, 'Decision', ['+ permissionDecision: allow|deny|ask', '+ reason?: string', '+ modifiedArgs?: object'], ['+ isBlocking(): boolean'], 'value object')
    d.classbox(780, 300, 280, 'Runtime', ['- hooks: Hook[]', '- policy: PolicySource'], ['+ fire(event, payload)', '+ load(sources[])'])
    d.conn([(400, 110), (300, 110)], 'thin', 'tri'); d.conn([(400, 320), (350, 320), (350, 110)], 'thin', 'none')
    d.label(350, 90, 'extends', 'middle')
    d.conn([(680, 120), (780, 120)], 'thin', 'ar'); d.label(730, 110, 'returns')
    d.conn([(680, 340), (720, 340), (720, 120)], 'dashed', 'none')
    d.conn([(780, 395), (170, 395), (170, 178)], 'thin', 'dia'); d.label(470, 386, 'aggregates 0..*')
    d.legend(462, [('ln', 'ink3', 'hollow triangle = inheritance'), ('ln', 'ink3', 'hollow diamond = aggregation'), ('dl', 'ink3', 'dependency')])
    return d.render()

def c4_context():
    d = Diagram('dg4a', 1120, 470, kind='c4-context')
    d.actor(120, 120, 'Developer'); d.actor(120, 330, 'Security admin')
    d.zone(330, 40, 430, 390, 'blue', 'Guardrails platform (this system)')
    d.node(370, 110, 350, 92, 'Hooks runtime', 'evaluates policy on every tool call', icon=gh('gh-security'), kind='soft', color='blue', sub2='fourteen events, one JSON contract')
    d.node(370, 260, 350, 92, 'Evidence pipeline', 'ships decisions, spans, session ids', icon=li('send', COLORS['blue']), kind='soft', color='blue', sub2='http hook + OpenTelemetry')
    d.node(880, 60, 210, 70, 'GitHub', 'repos, PRs, audit log', icon=gh('gh-mark'))
    d.node(880, 200, 210, 70, 'SIEM', 'Sentinel or Splunk', icon=az('ic-sentinel'))
    d.node(880, 340, 210, 70, 'MDM', 'managed settings', icon=az('ic-intune'))
    d.conn([(160, 120), (370, 140)], 'thin', 'ar'); d.label(250, 118, 'runs the agent')
    d.conn([(160, 330), (370, 306)], 'thin', 'ar'); d.label(250, 308, 'defines policy')
    d.conn([(720, 140), (880, 95)], 'thin', 'ar'); d.label(820, 138, 'hooks', 'middle')
    d.conn([(720, 306), (880, 235)], 'acc', 'ar-acc'); d.label(820, 290, 'events', 'middle')
    d.conn([(880, 375), (560, 375), (560, 352)], 'dashed', 'ar'); d.label(640, 366, 'policy pushed hourly')
    d.legend(462, [('sw', 'blue', 'system in scope'), ('sw', 'ink3', 'external system'), ('ln', 'ink3', 'person')])
    return d.render()

def c4_container():
    d = Diagram('dg4b', 1120, 470, kind='c4-container')
    d.zone(0, 0, 700, 440, 'blue', 'Developer laptop')
    d.node(30, 60, 300, 76, 'GitHub Copilot CLI', 'Node.js · agent loop', icon=gh('gh-cli'), sub2='reads .github/hooks + policy.d')
    d.node(380, 60, 290, 76, 'Hook scripts', 'bash · jq · < 1 s', icon=li('terminal', COLORS['ink3']), sub2='stdin JSON → stdout decision')
    d.cylinder(180, 300, 200, 96, 'logs/', 'tool-results.jsonl')
    d.node(380, 250, 290, 76, 'OTel exporter', 'OTLP over https', icon=az('ic-monitor'), sub2='hook.start · hook.end · error')
    d.zone(780, 0, 340, 440, 'green', 'Cloud')
    d.node(810, 60, 290, 76, 'Log Analytics', 'Sentinel workspace', icon=az('ic-sentinel'))
    d.node(810, 250, 290, 76, 'Application Insights', 'traces by session id', icon=az('ic-monitor'))
    d.conn([(330, 98), (380, 98)], 'acc', 'ar-acc'); d.conn([(380, 110), (350, 110), (350, 300), (280, 300)], 'thin', 'ar'); d.label(362, 210, 'append', 'start')
    d.conn([(525, 136), (525, 250)], 'thin', 'ar'); d.label(537, 200, 'spans', 'start')
    d.conn([(670, 98), (810, 98)], 'acc', 'ar-acc'); d.label(740, 88, 'http hook')
    d.conn([(670, 288), (810, 288)], 'acc', 'ar-acc'); d.label(740, 278, 'OTLP')
    d.legend(462, [('sw', 'blue', 'local containers'), ('sw', 'green', 'cloud containers'), ('ln', 'accent', 'network call')])
    return d.render()

def deployment():
    d = Diagram('dgd', 1120, 470, kind='deployment')
    Y = 30   # zones start below a free band where the https route runs
    d.zone(0, Y, 340, 410, 'blue', 'Region · Brazil South')
    d.zone(20, Y + 40, 300, 170, 'blue', 'AKS node pool · system'); d.node(40, Y + 80, 260, 56, 'ingress-nginx', '2 replicas', icon=az('ic-vnet')); d.node(40, Y + 146, 260, 56, 'cert-manager', '1 replica', icon=li('lock', COLORS['blue']))
    d.zone(20, Y + 230, 300, 170, 'blue', 'AKS node pool · apps'); d.node(40, Y + 270, 260, 56, 'orders-api', '3 replicas · HPA 3-10', icon=az('ic-aca')); d.node(40, Y + 336, 260, 56, 'worker', '2 replicas · KEDA', icon=az('ic-functions'))
    d.zone(380, Y, 340, 410, 'green', 'Data')
    d.cylinder(550, Y + 106, 220, 96, 'Azure SQL', 'zone redundant'); d.cylinder(550, Y + 246, 220, 96, 'Cosmos DB', 'session state'); d.node(410, Y + 336, 280, 56, 'Service Bus', 'orders topic', icon=az('ic-logicapps'))
    d.zone(760, Y, 360, 410, 'yellow', 'Edge and identity')
    d.node(790, Y + 56, 300, 56, 'Front Door', 'WAF · TLS', icon=az('ic-apim')); d.node(790, Y + 150, 300, 56, 'Entra ID', 'workload identity', icon=az('ic-entra')); d.node(790, Y + 244, 300, 56, 'Key Vault', 'secrets · certs', icon=az('ic-keyvault')); d.node(790, Y + 338, 300, 56, 'Container Registry', 'signed images', icon=az('ic-acr'))
    d.conn([(790, Y + 84), (745, Y + 84), (745, 14), (330, 14), (330, Y + 108), (300, Y + 108)], 'acc', 'ar-acc'); d.label(540, 8, 'https')
    d.conn([(300, Y + 298), (440, Y + 298), (440, Y + 154)], 'thin', 'ar'); d.conn([(300, Y + 364), (410, Y + 364)], 'thin', 'ar')
    d.conn([(170, Y + 326), (170, Y + 330), (350, Y + 330), (350, Y + 246), (440, Y + 246)], 'dashed', 'ar')
    d.legend(462, [('sw', 'blue', 'compute'), ('sw', 'green', 'data'), ('sw', 'yellow', 'edge and identity')])
    return d.render()

def event_driven():
    d = Diagram('dgv', 1120, 470, kind='event-driven')
    d.node(40, 190, 220, 70, 'Order service', 'publishes', icon=az('ic-aca'))
    d.node(420, 120, 280, 210, 'Event bus', '', icon=az('ic-logicapps'), kind='soft', color='blue')
    d.parts[-1] = d.parts[-1].replace('<text class="nl"', '<text class="nl" dy="-70"')
    for i, t in enumerate(['orders.created', 'orders.paid', 'orders.shipped']):
        d.pill(460, 165 + i * 44, 200, t, ['blue', 'green', 'yellow'][i])
    d.node(860, 60, 230, 60, 'Inventory', 'reserve stock', icon=li('layers', COLORS['blue']))
    d.node(860, 150, 230, 60, 'Billing', 'charge card', icon=li('money', COLORS['green']))
    d.node(860, 240, 230, 60, 'Notifications', 'email · push', icon=li('bell', COLORS['yellow']))
    d.node(860, 330, 230, 60, 'Analytics', 'lakehouse sink', icon=az('ic-databricks'))
    d.conn([(260, 225), (420, 225)], 'acc', 'ar-acc'); d.label(340, 215, 'publish')
    for i, y in enumerate([90, 180, 270, 360]):
        d.conn([(700, 225), (780, 225), (780, y), (860, y)], 'thin', 'ar', d=8 + i)
    d.label(820, 80, 'subscribe', 'middle')
    d.note(40, 320, 300, 74, ['at-least-once delivery:', 'consumers are idempotent,', 'dead-letter after 5 retries'])
    d.dot([(260, 225), (420, 225), (700, 225), (780, 225), (780, 180), (860, 180)], 4)
    d.legend(462, [('ln', 'accent', 'publish'), ('ln', 'ink3', 'subscription'), ('sw', 'blue', 'topic')])
    return d.render()

def data_pipeline():
    d = Diagram('dgp', 1120, 470, kind='data-pipeline')
    stages = [('Ingest', 'Event Hubs · CDC', az('ic-logicapps'), 'blue'), ('Land', 'ADLS bronze', az('ic-lake'), 'blue'), ('Clean', 'Databricks silver', az('ic-databricks'), 'green'), ('Model', 'gold · star schema', az('ic-databricks'), 'green'), ('Serve', 'Fabric · Power BI', az('ic-search'), 'yellow')]
    for i, (n, s, ic, c) in enumerate(stages):
        x = 20 + i * 220; d.node(x, 150, 190, 90, n, s, icon=ic, kind='soft', color=c)
        if i: d.conn([(x - 30, 195), (x, 195)], 'acc', 'ar-acc')
    for i, t in enumerate(['raw json', 'parquet', 'delta · dq checks', 'dims + facts', 'semantic model']):
        d.label(115 + i * 220, 270, t, 'middle')
    d.zone(20, 320, 1080, 100, 'red', 'Governance across every stage')
    for i, t in enumerate(['Purview lineage', 'Unity Catalog', 'PII masking', 'retention 7y']):
        d.pill(60 + i * 260, 370, 220, t, 'red')
    d.dot([(20, 195), (1090, 195)], 6)
    d.legend(462, [('sw', 'blue', 'ingest and land'), ('sw', 'green', 'transform'), ('sw', 'yellow', 'serve'), ('sw', 'red', 'governance')])
    return d.render()

def hexagonal():
    d = Diagram('dgh', 1120, 470, kind='hexagonal')
    d.zone(300, 40, 520, 390, 'blue', 'Application core')
    d.node(360, 100, 400, 80, 'Domain model', 'Order · Payment · Policy', icon=li('layers', COLORS['blue']), kind='soft', color='blue', sub2='no framework imports')
    d.node(360, 210, 400, 70, 'Use cases', 'PlaceOrder · RefundOrder', icon=li('gear', COLORS['blue']))
    d.node(360, 310, 190, 70, 'Port: OrderRepo', 'interface', icon=li('plug', COLORS['green']), color='green', kind='soft')
    d.node(570, 310, 190, 70, 'Port: Notifier', 'interface', icon=li('plug', COLORS['green']), color='green', kind='soft')
    d.node(40, 100, 220, 70, 'REST adapter', 'ASP.NET minimal API', icon=li('globe', COLORS['yellow']))
    d.node(40, 210, 220, 70, 'CLI adapter', 'GitHub Copilot CLI hook', icon=gh('gh-cli'))
    d.node(860, 310, 230, 70, 'SQL adapter', 'EF Core · Azure SQL', icon=li('server', COLORS['ink3']))
    d.node(860, 100, 230, 70, 'Email adapter', 'ACS · SendGrid', icon=li('send', COLORS['ink3']))
    d.conn([(260, 135), (360, 135)], 'thin', 'ar'); d.conn([(260, 245), (360, 245)], 'thin', 'ar')
    d.conn([(860, 345), (760, 345)], 'dashed', 'ar'); d.conn([(860, 135), (830, 135), (830, 345), (760, 345)], 'dashed', 'ar', d=12)
    d.parts[-1] = d.parts[-1].replace('L760 345', 'L790 345')  # keep arrows apart
    d.label(330, 125, 'drives', 'middle'); d.label(950, 300, 'implements port', 'middle')
    d.legend(462, [('sw', 'blue', 'core, framework-free'), ('sw', 'green', 'ports'), ('ln', 'ink3', 'driving adapter'), ('dl', 'ink3', 'driven adapter')])
    return d.render()

def request_path():
    d = Diagram('dgr', 1120, 470, kind='request-path')
    hops = [('Client', 'browser', li('laptop', COLORS['ink3']), ''), ('Front Door', 'WAF · cache', az('ic-apim'), '12 ms'), ('API Management', 'auth · rate limit', az('ic-apim'), '8 ms'), ('orders-api', 'AKS pod', az('ic-aca'), '35 ms'), ('Azure SQL', 'read replica', li('server', COLORS['blue']), '9 ms')]
    for i, (n, s, ic, lat) in enumerate(hops):
        x = 20 + i * 222; d.node(x, 120, 200, 76, n, s, icon=ic)
        if i:
            d.conn([(x - 22, 158), (x, 158)], 'acc', 'ar-acc')
    d.conn([(1020, 196), (1020, 260), (120, 260), (120, 196)], 'dashed', 'ar'); d.label(570, 250, 'response · p95 total 64 ms · budget 100 ms')
    for i, (y, w, col) in enumerate([(330, 12, 'yellow'), (330, 8, 'green'), (330, 35, 'red'), (330, 9, 'green')]):
        x = 242 + i * 222
        d.parts.append(f'<rect class="dn" x="{x}" y="{y}" width="{w*4}" height="16" rx="4" fill="{COLORS[col]}" style="--d:{10+i}"/>')
        d.text(x + w * 4 + 8, y + 12, f'{w} ms', 'cl', extra=f'style="--d:{10+i}"')
    d.text(20, 342, 'latency budget per hop', 'cl'); d.text(20, 400, 'the red hop is where the next sprint goes: 35 ms of 64', 'cl', extra='style="fill:var(--ps-text-red);font-weight:700"')
    d.dot([(220, 158), (1020, 158)], 3)
    d.legend(462, [('ln', 'accent', 'request'), ('dl', 'ink3', 'response'), ('sw', 'red', 'over budget')])
    return d.render()

def decision_tree():
    d = Diagram('dgt', 1120, 470, kind='decision-tree')
    d.diamond(560, 60, 260, 80, 'Can the developer edit it?', 'the control')
    d.diamond(300, 200, 240, 80, 'Does it need context?', 'payload, time')
    d.diamond(820, 200, 240, 80, 'Enterprise-wide?')
    d.conn([(430, 60), (300, 60), (300, 160)], 'thin', 'ar'); d.label(360, 50, 'yes')
    d.conn([(690, 60), (820, 60), (820, 160)], 'thin', 'ar'); d.label(760, 50, 'no')
    d.node(60, 330, 220, 70, 'Permission rule', 'declarative, no code', icon=li('shield', COLORS['yellow']), color='yellow', kind='soft')
    d.node(340, 330, 220, 70, 'Repository hook', '.github/hooks', icon=gh('gh-mark'), color='blue', kind='soft')
    d.node(620, 330, 220, 70, 'Policy hook', 'policy.d, root-owned', icon=li('lock', COLORS['red']), color='red', kind='soft')
    d.node(880, 330, 220, 70, 'Managed settings', 'MDM · deny rules', icon=az('ic-intune'), color='red', kind='soft')
    d.conn([(180, 200), (170, 200), (170, 330)], 'thin', 'ar'); d.label(190, 270, 'no', 'start')
    d.conn([(420, 200), (450, 200), (450, 330)], 'thin', 'ar'); d.label(465, 270, 'yes', 'start')
    d.conn([(700, 200), (730, 200), (730, 330)], 'thin', 'ar'); d.label(745, 270, 'no', 'start')
    d.conn([(940, 200), (990, 200), (990, 330)], 'thin', 'ar'); d.label(1005, 270, 'yes', 'start')
    d.legend(462, [('sw', 'yellow', 'convenience'), ('sw', 'blue', 'team control'), ('sw', 'red', 'governance')])
    return d.render()

def mind_map():
    d = Diagram('dgmm', 1120, 470, kind='mind-map')
    d.node(430, 190, 260, 80, 'Agentic DevOps', 'the operating model', icon=gh('gh-copilot'), kind='dark')
    br = [('Platform', ['Foundry', 'GitHub Copilot', 'APIM'], 'blue', 40, 40), ('Guardrails', ['hooks', 'managed settings', 'policy.d'], 'red', 40, 260),
          ('Evidence', ['SIEM', 'OpenTelemetry', 'audit log'], 'green', 830, 40), ('People', ['champions', 'enablement', 'metrics'], 'yellow', 830, 260)]
    for i, (n, kids, col, x, y) in enumerate(br):
        d.node(x, y, 250, 56, n, '', icon=li(['layers', 'shield', 'radar', 'users'][i], COLORS[col]), kind='soft', color=col)
        left = x < 430
        d.curve(430 if left else 690, 230, x + 250 if left else x, y + 28, 'thin', 'none', bend=0.5)
        for j, k in enumerate(kids):
            ky = y + 70 + j * 36; kx = x + 30 if left else x + 40
            d.pill(kx, ky, 180, k, col)
            d.conn([(x + 20 if left else x + 230, y + 56), (x + 20 if left else x + 230, ky + 12), (kx if left else kx + 180, ky + 12)], 'thin', 'none', d=20 + i * 4 + j)
    return d.render()

def swimlane():
    d = Diagram('dgw', 1120, 470, kind='swimlane')
    lanes = [('Developer', 'blue', 0), ('GitHub Copilot', 'green', 145), ('CI · Actions', 'yellow', 290)]
    for n, c, y in lanes: d.lane(0, y, 1120, 135, c, n)
    d.node(60, 40, 230, 56, 'Describe the change', 'issue or prompt', icon=li('note', COLORS['blue']))
    d.node(320, 185, 200, 56, 'Plan + edit', 'agent mode', icon=gh('gh-copilot'))
    d.node(560, 185, 220, 56, 'Run tests locally', 'agentStop gate', icon=li('test', COLORS['green']))
    d.node(560, 330, 240, 56, 'Build, scan, deploy', 'workflow', icon=gh('gh-actions'))
    d.node(850, 40, 200, 56, 'Review PR', 'human approval', icon=li('pr', COLORS['blue']))
    d.node(850, 330, 200, 56, 'Release', 'canary 10%', icon=az('ic-aca'))
    d.conn([(175, 96), (175, 213), (320, 213)], 'thin', 'ar'); d.conn([(520, 213), (560, 213)], 'thin', 'ar'); d.conn([(670, 241), (670, 330)], 'thin', 'ar')
    d.conn([(800, 358), (850, 358)], 'thin', 'ar'); d.conn([(950, 330), (950, 96)], 'thin', 'ar'); d.label(965, 214, 'checks green', 'start')
    d.conn([(850, 68), (700, 68), (700, 185)], 'dashed', 'ar-red'); d.label(775, 58, 'changes requested', 'middle', color='red')
    d.dot([(175, 96), (175, 213), (560, 213), (670, 241), (670, 330), (850, 358), (950, 330), (950, 96)], 6)
    return d.render()

def network():
    d = Diagram('dgn', 1120, 470, kind='network')
    d.zone(0, 0, 1120, 440, 'blue', 'Virtual network 10.0.0.0/16')
    d.zone(30, 50, 330, 360, 'yellow', 'subnet · edge 10.0.1.0/24'); d.node(60, 100, 270, 60, 'Application Gateway', 'WAF v2', icon=az('ic-apim')); d.node(60, 200, 270, 60, 'Bastion', 'ops access only', icon=li('key', COLORS['yellow'])); d.node(60, 300, 270, 60, 'NAT gateway', 'egress IP', icon=az('ic-vnet'))
    d.zone(400, 50, 330, 360, 'green', 'subnet · apps 10.0.2.0/24'); d.node(430, 100, 270, 60, 'AKS nodes', 'private cluster', icon=az('ic-aca')); d.node(430, 200, 270, 60, 'Container Apps', 'internal ingress', icon=az('ic-aca')); d.node(430, 300, 270, 60, 'Private DNS', 'privatelink.*', icon=li('globe', COLORS['green']))
    d.zone(770, 50, 320, 360, 'red', 'subnet · data 10.0.3.0/24'); d.node(800, 100, 260, 60, 'Private endpoint', 'Azure SQL', icon=li('server', COLORS['red'])); d.node(800, 200, 260, 60, 'Private endpoint', 'Key Vault', icon=az('ic-keyvault')); d.node(800, 300, 260, 60, 'NSG', 'deny internet', icon=li('shield', COLORS['red']))
    d.conn([(330, 130), (430, 130)], 'acc', 'ar-acc'); d.conn([(700, 130), (800, 130)], 'thin', 'ar'); d.conn([(700, 230), (800, 230)], 'thin', 'ar')
    d.conn([(565, 260), (565, 300)], 'dashed', 'ar'); d.label(580, 285, 'resolves', 'start')
    d.legend(462, [('sw', 'yellow', 'edge'), ('sw', 'green', 'compute'), ('sw', 'red', 'data · no public IP')])
    return d.render()

def dag():
    d = Diagram('dgg', 1120, 470, kind='dag')
    nodes = {'a': (60, 200, 'extract', 'blue'), 'b': (300, 100, 'validate', 'blue'), 'c': (300, 300, 'enrich', 'blue'), 'd': (540, 200, 'join', 'green'), 'e': (780, 100, 'train', 'yellow'), 'f': (780, 300, 'report', 'yellow'), 'g': (1000, 200, 'publish', 'red')}
    for k, (x, y, n, c) in nodes.items(): d.state(x + 60, y, 150, n, '', 'soft'); d.parts[-1] = d.parts[-1].replace('n--soft', f'n--soft" style="--nc:{COLORS[c]}')
    edges = [('a', 'b'), ('a', 'c'), ('b', 'd'), ('c', 'd'), ('d', 'e'), ('d', 'f'), ('e', 'g'), ('f', 'g')]
    for i, (u, v) in enumerate(edges):
        x0, y0 = nodes[u][0] + 135, nodes[u][1]; x1, y1 = nodes[v][0] - 15, nodes[v][1]
        d.curve(x0, y0, x1, y1, 'thin', 'ar', d=8 + i)
    d.text(60, 400, 'topological order: extract → validate, enrich → join → train, report → publish', 'cl')
    d.text(60, 424, 'critical path in red: extract → validate → join → train → publish', 'cl', extra='style="fill:var(--ps-text-red)"')
    d.dot([(195, 200), (285, 100), (435, 100), (525, 200), (675, 200), (765, 100), (915, 100), (985, 200)], 5)
    return d.render()

def git_branching():
    d = Diagram('dgb', 1120, 470, kind='git-branching')
    lanes = [('main', 90, 'ink'), ('release/2.1', 200, 'yellow'), ('feature/hooks', 310, 'blue'), ('hotfix/otel', 420, 'red')]
    for n, y, c in lanes:
        d.parts.append(f'<line x1="140" y1="{y}" x2="1080" y2="{y}" stroke="{COLORS[c]}" stroke-width="3" opacity=".55"/>')
        d.text(120, y + 5, n, 'nl', anchor='end')
    commits = [(180, 90, 'ink'), (300, 90, 'ink'), (300, 310, 'blue'), (420, 310, 'blue'), (540, 310, 'blue'), (620, 90, 'ink'), (700, 200, 'yellow'), (820, 420, 'red'), (940, 420, 'red'), (1000, 90, 'ink'), (1000, 200, 'yellow')]
    for i, (x, y, c) in enumerate(commits):
        d.parts.append(f'<circle class="dn" cx="{x}" cy="{y}" r="11" fill="var(--ps-color-paper)" stroke="{COLORS[c]}" stroke-width="3.5" style="--d:{i+2}"/>')
    d.curve(300, 90, 300, 310, 'thin', 'none', bend=0.5); d.curve(540, 310, 620, 90, 'thin', 'ar', bend=0.5); d.label(578, 258, 'merge PR #42', 'start')
    d.curve(620, 90, 700, 200, 'thin', 'none', bend=0.5); d.label(690, 150, 'cut release', 'start')
    d.curve(700, 200, 820, 420, 'thin', 'none', bend=0.5); d.curve(940, 420, 1000, 90, 'thin', 'ar-red', bend=0.5); d.curve(940, 420, 1000, 200, 'thin', 'ar-red', bend=0.5); d.label(1040, 348, 'cherry-pick', 'middle', color='red')
    d.pill(160, 30, 120, 'v2.0.0', 'ink'); d.pill(980, 30, 120, 'v2.1.0', 'yellow')
    d.legend(462, [('ln', 'ink', 'main, protected'), ('ln', 'blue', 'feature'), ('ln', 'yellow', 'release'), ('ln', 'red', 'hotfix')])
    return d.render()

# ============ V · reference architectures ============
def arch_webapp():
    d = Diagram('dga1', 1120, 470, kind='architecture-webapp')
    d.node(40, 200, 180, 70, 'Users', 'browser · mobile', icon=li('users', COLORS['ink3']))
    d.node(280, 200, 220, 70, 'Front Door', 'CDN · WAF · TLS', icon=az('ic-apim'))
    d.zone(560, 40, 540, 390, 'blue', 'Region')
    d.node(600, 90, 220, 70, 'App Service', 'web app · slots', icon=az('ic-aca'))
    d.node(860, 90, 220, 70, 'Functions', 'background jobs', icon=az('ic-functions'))
    d.cylinder(710, 270, 200, 96, 'Azure SQL', 'geo-replica')
    d.node(860, 230, 220, 60, 'Key Vault', 'connection strings', icon=az('ic-keyvault'))
    d.node(860, 320, 220, 60, 'Monitor', 'App Insights', icon=az('ic-monitor'))
    d.conn([(220, 235), (280, 235)], 'acc', 'ar-acc'); d.conn([(500, 235), (540, 235), (540, 125), (600, 125)], 'acc', 'ar-acc')
    d.conn([(820, 125), (860, 125)], 'thin', 'ar'); d.conn([(710, 160), (710, 222)], 'thin', 'ar'); d.conn([(860, 260), (830, 260), (830, 125)], 'dashed', 'ar'); d.conn([(860, 350), (760, 350), (760, 318)], 'dashed', 'ar')
    d.dot([(220, 235), (540, 235), (540, 125), (600, 125)], 4)
    d.legend(462, [('ln', 'accent', 'user traffic'), ('ln', 'ink3', 'service call'), ('dl', 'ink3', 'config and telemetry')])
    return d.render()

def arch_aks():
    d = Diagram('dga2', 1120, 470, kind='architecture-aks')
    d.node(20, 200, 190, 70, 'Clients', 'web · mobile · API', icon=li('globe', COLORS['ink3']))
    d.node(260, 200, 200, 70, 'API Management', 'auth · quotas', icon=az('ic-apim'))
    d.zone(520, 30, 580, 400, 'blue', 'AKS cluster')
    d.node(550, 80, 240, 60, 'Ingress · gateway', 'nginx · TLS', icon=az('ic-vnet'))
    for i, (n, s) in enumerate([('orders', 'Node.js'), ('payments', '.NET'), ('catalog', 'Python')]):
        d.node(550 + i * 185, 180, 170, 60, n, s, icon=az('ic-aca'))
        d.conn([(670, 140), (670, 160), (635 + i * 185, 160), (635 + i * 185, 180)], 'thin', 'ar', d=6 + i)
    d.node(550, 280, 240, 60, 'Service Bus', 'async between services', icon=az('ic-logicapps'))
    d.node(830, 280, 240, 60, 'Redis', 'cache · sessions', icon=li('bolt', COLORS['red']))
    d.node(550, 360, 240, 56, 'Prometheus · Grafana', 'metrics', icon=az('ic-monitor'))
    d.node(830, 360, 240, 56, 'Container Registry', 'signed images', icon=az('ic-acr'))
    d.conn([(210, 235), (260, 235)], 'acc', 'ar-acc'); d.conn([(460, 235), (490, 235), (490, 110), (550, 110)], 'acc', 'ar-acc')
    d.conn([(635, 240), (635, 280)], 'dashed', 'ar'); d.conn([(1005, 240), (1005, 280)], 'dashed', 'ar')
    d.legend(462, [('ln', 'accent', 'north-south traffic'), ('ln', 'ink3', 'east-west'), ('dl', 'ink3', 'async and cache')])
    return d.render()

def arch_data():
    d = Diagram('dga3', 1120, 470, kind='architecture-data')
    d.zone(0, 40, 260, 390, 'yellow', 'Sources')
    for i, (n, s, ic) in enumerate([('SAP · ERP', 'CDC', li('server', COLORS['yellow'])), ('SaaS APIs', 'REST', li('globe', COLORS['yellow'])), ('IoT', 'MQTT', li('radar', COLORS['yellow']))]):
        d.node(30, 90 + i * 100, 200, 64, n, s, icon=ic)
    d.zone(320, 40, 480, 390, 'blue', 'Lakehouse')
    d.node(350, 90, 200, 64, 'Event Hubs', 'streaming', icon=az('ic-logicapps'))
    d.node(580, 90, 190, 64, 'Data Factory', 'batch', icon=az('ic-devops'))
    d.node(350, 200, 420, 64, 'ADLS Gen2 · Delta Lake', 'bronze · silver · gold', icon=az('ic-lake'))
    d.node(350, 300, 200, 64, 'Databricks', 'notebooks · jobs', icon=az('ic-databricks'))
    d.node(580, 300, 190, 64, 'Purview', 'catalog · lineage', icon=az('ic-compliance'))
    d.zone(860, 40, 260, 390, 'green', 'Consumption')
    d.node(890, 90, 200, 64, 'Power BI', 'semantic model', icon=li('chart', COLORS['green'])); d.node(890, 200, 200, 64, 'AI Search', 'RAG index', icon=az('ic-search')); d.node(890, 300, 200, 64, 'Foundry agents', 'grounded answers', icon=az('ic-foundry'))
    d.conn([(230, 122), (350, 122)], 'acc', 'ar-acc'); d.conn([(230, 222), (300, 222), (300, 176), (665, 176), (665, 154)], 'acc', 'ar-acc', d=9); d.conn([(230, 322), (350, 322)], 'acc', 'ar-acc', d=10)
    d.conn([(450, 154), (450, 200)], 'thin', 'ar'); d.conn([(720, 154), (720, 200)], 'thin', 'ar'); d.conn([(450, 264), (450, 300)], 'thin', 'ar', start='none')
    d.conn([(770, 232), (890, 122)], 'thin', 'ar'); d.conn([(770, 232), (890, 232)], 'thin', 'ar'); d.conn([(770, 232), (890, 332)], 'thin', 'ar')
    d.legend(462, [('sw', 'yellow', 'sources'), ('sw', 'blue', 'platform'), ('sw', 'green', 'consumers')])
    return d.render()

def arch_foundry():
    d = Diagram('dga4', 1120, 470, kind='architecture-foundry')
    d.node(40, 200, 200, 70, 'Channels', 'Teams · web · API', icon=li('users', COLORS['ink3']))
    d.node(290, 200, 200, 70, 'API Management', 'AI gateway · quotas', icon=az('ic-apim'))
    d.zone(540, 30, 560, 400, 'blue', 'Microsoft Foundry')
    d.node(570, 80, 240, 64, 'Agent Service', 'orchestration · threads', icon=az('ic-agentsvc'))
    d.node(840, 80, 230, 64, 'Models', 'GPT · Claude · Phi', icon=az('ic-foundry'))
    d.node(570, 180, 240, 64, 'Tools', 'MCP · OpenAPI · code', icon=li('wrench', COLORS['blue']))
    d.node(840, 180, 230, 64, 'AI Search', 'grounding index', icon=az('ic-search'))
    d.node(570, 280, 240, 64, 'Content Safety', 'input · output filters', icon=az('ic-defender'))
    d.node(840, 280, 230, 64, 'Entra Agent ID', 'identity per agent', icon=az('ic-agentid'))
    d.node(570, 366, 500, 50, 'Observability', 'traces · evaluations · cost', icon=az('ic-monitor'))
    d.conn([(240, 235), (290, 235)], 'acc', 'ar-acc'); d.conn([(490, 235), (520, 235), (520, 112), (570, 112)], 'acc', 'ar-acc')
    d.conn([(810, 112), (840, 112)], 'thin', 'ar'); d.conn([(690, 144), (690, 180)], 'thin', 'ar'); d.conn([(810, 212), (840, 212)], 'thin', 'ar'); d.conn([(690, 244), (690, 280)], 'thin', 'ar'); d.conn([(955, 244), (955, 280)], 'dashed', 'ar')
    d.legend(462, [('ln', 'accent', 'request'), ('ln', 'ink3', 'agent calls'), ('dl', 'ink3', 'identity')])
    return d.render()

def arch_copilot():
    d = Diagram('dga5', 1120, 470, kind='architecture-copilot')
    d.node(40, 200, 200, 70, 'Developer', 'IDE · CLI · web', icon=li('laptop', COLORS['ink3']))
    d.zone(300, 30, 800, 400, 'blue', 'GitHub')
    d.node(330, 80, 230, 64, 'GitHub Copilot', 'chat · agent mode', icon=gh('gh-copilot'))
    d.node(600, 80, 230, 64, 'Cloud agent', 'issue → PR', icon=gh('gh-actions'))
    d.node(840, 80, 250, 64, 'Codespaces', 'ephemeral env', icon=gh('gh-codespaces'))
    d.node(330, 180, 230, 64, 'Hooks · policy', 'guardrails as code', icon=gh('gh-security'))
    d.node(600, 180, 230, 64, 'Actions', 'CI · CD · workflows', icon=gh('gh-actions'))
    d.node(840, 180, 250, 64, 'Advanced Security', 'code · secret scanning', icon=gh('gh-security'))
    d.node(330, 280, 230, 64, 'Audit log', 'agent_session.*', icon=li('eye', COLORS['blue']))
    d.node(600, 280, 230, 64, 'MCP registry', 'allow-listed servers', icon=li('plug', COLORS['blue']))
    d.node(840, 280, 250, 64, 'GitHub Copilot metrics', 'API · adoption · acceptance', icon=li('chart', COLORS['blue']))
    d.node(330, 366, 750, 50, 'Enterprise policies', 'content exclusion · model allow-list · plugin control', icon=li('lock', COLORS['red']))
    d.conn([(240, 235), (280, 235), (280, 112), (330, 112)], 'acc', 'ar-acc'); d.conn([(560, 112), (600, 112)], 'thin', 'ar'); d.conn([(830, 112), (840, 112)], 'thin', 'ar')
    d.conn([(445, 144), (445, 180)], 'thin', 'ar'); d.conn([(715, 144), (715, 180)], 'thin', 'ar'); d.conn([(445, 244), (445, 280)], 'dashed', 'ar')
    d.legend(462, [('ln', 'accent', 'developer flow'), ('ln', 'ink3', 'platform'), ('dl', 'ink3', 'evidence')])
    return d.render()

def arch_devops():
    d = Diagram('dga6', 1120, 470, kind='architecture-devops')
    stages = [('Code', 'GitHub repo', 'rulesets, owners', gh('gh-mark')), ('Build', 'Actions · tests', 'matrix · cache', gh('gh-actions')), ('Scan', 'CodeQL', 'secret scanning', az('ic-defender')), ('Package', 'ACR · signed', 'SBOM attached', az('ic-acr')), ('Deploy', 'Container Apps', 'blue-green', az('ic-aca')), ('Observe', 'Monitor', 'alerts to issues', az('ic-monitor'))]
    cols = ['blue', 'blue', 'red', 'yellow', 'green', 'green']
    W, GAP, X0 = 164, 24, 6
    for i, (n, s, s2, ic) in enumerate(stages):
        x = X0 + i * (W + GAP); d.node(x, 150, W, 104, n, s, icon=ic, kind='soft', color=cols[i], sub2=s2)
        if i: d.conn([(x - GAP + 4, 202), (x - 3, 202)], 'acc', 'ar-acc')
    for i, t in enumerate(['PR + review', 'unit · lint', 'SAST · SBOM', 'cosign', 'canary 10%', 'SLO 99.9']):
        d.pill(X0 + i * (W + GAP), 86, W, t, cols[i])
    d.conn([(X0 + 5 * (W + GAP) + W / 2, 254), (X0 + 5 * (W + GAP) + W / 2, 366), (X0 + W / 2, 366), (X0 + W / 2, 254)], 'dashed', 'ar', radius=22)
    d.label(580, 356, 'feedback: alerts open issues, GitHub Copilot proposes the fix')
    d.dot([(X0, 202), (X0 + 6 * (W + GAP), 202)], 6)
    d.legend(462, [('sw', 'blue', 'inner loop'), ('sw', 'red', 'security gates'), ('sw', 'green', 'run')])
    return d.render()

def arch_zerotrust():
    d = Diagram('dga7', 1120, 470, kind='architecture-zero-trust')
    d.node(20, 200, 200, 70, 'Identity', 'user · device · agent', icon=li('users', COLORS['ink3']))
    d.node(270, 90, 200, 64, 'Entra ID', 'conditional access', icon=az('ic-entra'))
    d.node(270, 200, 200, 64, 'Intune', 'device compliance', icon=az('ic-intune'))
    d.node(270, 310, 200, 64, 'Agent ID', 'workload identity', icon=az('ic-agentid'))
    d.zone(600, 40, 500, 390, 'green', 'Protected resources')
    d.node(630, 90, 210, 64, 'Apps', 'App Service · AKS', icon=az('ic-aca')); d.node(860, 90, 210, 64, 'Data', 'SQL · Cosmos', icon=az('ic-cosmos'))
    d.node(630, 200, 210, 64, 'Defender', 'threat protection', icon=az('ic-defender')); d.node(860, 200, 210, 64, 'Sentinel', 'SIEM · SOAR', icon=az('ic-sentinel'))
    d.node(630, 310, 440, 64, 'Purview · Compliance', 'classification · DLP · retention', icon=az('ic-compliance'))
    for y in (122, 232, 342): d.conn([(220, 235), (245, 235), (245, y), (270, y)], 'thin', 'ar')
    d.conn([(470, 122), (630, 122)], 'acc', 'ar-acc'); d.label(540, 112, 'verify explicitly')
    d.conn([(470, 232), (630, 232)], 'acc', 'ar-acc'); d.label(540, 222, 'least privilege')
    d.conn([(470, 342), (630, 342)], 'acc', 'ar-acc'); d.label(540, 332, 'assume breach')
    d.legend(462, [('sw', 'ink3', 'signals'), ('ln', 'accent', 'policy decision'), ('sw', 'green', 'resources')])
    return d.render()

def arch_hubspoke():
    d = Diagram('dga8', 1120, 470, kind='architecture-hub-spoke')
    d.zone(380, 30, 360, 400, 'blue', 'Hub VNet')
    d.node(410, 80, 300, 64, 'Azure Firewall', 'egress · IDPS', icon=li('shield', COLORS['blue'])); d.node(410, 170, 300, 64, 'VPN · ExpressRoute', 'on-premises', icon=az('ic-vnet')); d.node(410, 260, 300, 64, 'Bastion', 'admin access', icon=li('key', COLORS['blue'])); d.node(410, 350, 300, 56, 'Private DNS · Monitor', 'shared services', icon=az('ic-monitor'))
    d.zone(20, 60, 300, 340, 'green', 'Spoke · production'); d.node(50, 110, 240, 60, 'AKS', 'workloads', icon=az('ic-aca')); d.node(50, 200, 240, 60, 'SQL', 'private endpoint', icon=li('server', COLORS['green'])); d.node(50, 290, 240, 60, 'Key Vault', '', icon=az('ic-keyvault'))
    d.zone(800, 60, 300, 340, 'yellow', 'Spoke · dev-test'); d.node(830, 110, 240, 60, 'Container Apps', 'sandbox', icon=az('ic-aca')); d.node(830, 200, 240, 60, 'Cosmos DB', 'serverless', icon=az('ic-cosmos')); d.node(830, 290, 240, 60, 'Foundry project', 'experiments', icon=az('ic-foundryproj'))
    d.conn([(290, 140), (410, 112)], 'acc', 'ar-acc'); d.conn([(830, 140), (710, 112)], 'acc', 'ar-acc'); d.label(560, 60, 'peering · forced tunneling', 'middle')
    d.conn([(410, 202), (200, 202), (200, 200)], 'dashed', 'none'); d.conn([(710, 202), (930, 202), (930, 200)], 'dashed', 'none')
    d.legend(462, [('sw', 'blue', 'hub · shared'), ('sw', 'green', 'prod spoke'), ('sw', 'yellow', 'dev spoke')])
    return d.render()
