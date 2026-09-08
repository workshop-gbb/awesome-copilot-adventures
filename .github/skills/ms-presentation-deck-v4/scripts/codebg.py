"""codebg v3.0.0: the decorative background of every content slide. Instead of a color glow, a faint
block of code and system-design fragments (algorithms, bash + jq, JSON, Pascal, SQL, ASCII boxes)
sits in the top-right corner and fades out diagonally. Very low contrast (7%), never touches the
content, varies per slide so it never repeats on two consecutive slides."""
import random

POOL = [
    ["function binarySearch(a, x) {", "  let lo = 0, hi = a.length - 1;", "  while (lo <= hi) {", "    const mid = (lo + hi) >> 1;", "    if (a[mid] === x) return mid;", "    a[mid] < x ? lo = mid + 1 : hi = mid - 1;", "  }", "  return -1;", "}"],
    ["$ cat payload.json | jq -r '.toolArgs'", "$ echo \"$CMD\" | grep -E 'rm -rf|force'", "$ exit 2   # deny, stderr shown", "$ copilot -p \"run the tests\" --allow-tool bash"],
    ["{", "  \"event\": \"preToolUse\",", "  \"toolName\": \"bash\",", "  \"decision\": \"allow\",", "  \"latencyMs\": 42", "}"],
    ["procedure Reconcile(const Batch: TBatch);", "var i: Integer;", "begin", "  for i := 0 to Batch.Count - 1 do", "    if not Batch[i].Settled then", "      Post(Batch[i]);", "end;"],
    ["SELECT tenant_id, count(*) AS runs,", "       percentile_cont(0.95)", "         WITHIN GROUP (ORDER BY latency_ms)", "FROM hook_events", "WHERE fired_at > now() - interval '7 days'", "GROUP BY tenant_id;"],
    ["┌──────────┐    ┌──────────┐    ┌──────────┐", "│  client  │───▶│ gateway  │───▶│ service  │", "└──────────┘    └──────────┘    └────┬─────┘", "                                     │", "                                ┌────▼─────┐", "                                │  queue   │", "                                └──────────┘"],
    ["def dijkstra(graph, src):", "    dist = {v: inf for v in graph}", "    dist[src] = 0", "    heap = [(0, src)]", "    while heap:", "        d, u = heappop(heap)", "        for v, w in graph[u]:", "            if d + w < dist[v]:", "                dist[v] = d + w", "                heappush(heap, (dist[v], v))"],
    ["state: Draft ──open──▶ InReview", "InReview ──approve──▶ Approved", "InReview ──changes──▶ Draft", "Approved ──merge──▶ Merged", "invariant: approvals >= 2 && checks == green"],
    ["type Decision = 'allow' | 'deny' | 'ask';", "interface Hook {", "  event: HookEvent;", "  matcher?: RegExp;", "  run(payload: Payload): Promise<Decision>;", "}"],
    ["O(1)  hash lookup", "O(log n)  balanced tree, binary search", "O(n)  linear scan", "O(n log n)  merge sort, heap sort", "O(n²)  nested loops, bubble sort"],
    ["p95 latency  ≤ 100 ms", "error budget  0.1% / 30d", "availability  99.9%", "throughput  1 200 req/s", "queue depth  < 500"],
    ["#!/usr/bin/env bash", "set -euo pipefail", "INPUT=$(cat)", "TOOL=$(echo \"$INPUT\" | jq -r '.toolName')", "[ \"$TOOL\" = bash ] || exit 0", "case \"$CMD\" in *sudo*) deny \"no privilege escalation\";; esac"],
    ["   retry(n) := if n = 0 then fail", "               else try(op) or retry(n-1)", "   backoff(k) := min(cap, base · 2^k) + jitter"],
    ["GET /orders/{id}  →  200 · 404", "POST /orders      →  201 · 400 · 409", "PATCH /orders/{id} →  200 · 412", "idempotency-key: required on POST"],
    ["  ┌─ load balancer ─┐", "  │  ┌──┐ ┌──┐ ┌──┐ │", "  │  │a │ │b │ │c │ │   replicas: 3", "  │  └──┘ └──┘ └──┘ │   hpa: cpu > 70%", "  └──────────────────┘"],
    ["fn merge(a: &[i32], b: &[i32]) -> Vec<i32> {", "    let (mut i, mut j) = (0, 0);", "    let mut out = Vec::with_capacity(a.len() + b.len());", "    while i < a.len() && j < b.len() {", "        if a[i] <= b[j] { out.push(a[i]); i += 1 }", "        else { out.push(b[j]); j += 1 }", "    }", "    out", "}"],
    ["CAP: pick two · consistency · availability · partition tolerance", "PACELC: else latency vs consistency", "saga: T1 → T2 → T3 · compensations C3 → C2 → C1"],
    ["git switch -c feature/guardrails", "git commit -m \"hooks: deny force push with reason\"", "gh pr create --fill --reviewer security-team", "gh pr checks --watch"],
]

def deco(seed=0, dark=False):
    """One <div class='deco'> with a faint code block. seed picks and shuffles fragments."""
    rnd = random.Random(seed * 7919 + 13)
    blocks = rnd.sample(POOL, 3)
    lines = []
    for b in blocks:
        lines += b + ['']
    lines = lines[:16]
    txt = '\n'.join(lines).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    return f'<div class="deco" aria-hidden="true"><pre class="cbg{" cbg--dark" if dark else ""}">{txt}</pre></div>'

CSS = r"""
/* --- fundo de codigo: fragmentos de algoritmo, shell, JSON, Pascal, SQL e caixas ASCII, 7%, fundindo na diagonal --- */
.deco { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.deco ~ * { position: relative; }
.cbg { position: absolute; right: 44px; top: 16px; width: 540px; margin: 0; font-family: var(--ps-font-mono); font-size: 11.5px; line-height: 1.65; color: var(--ps-color-ink); opacity: .10; white-space: pre; text-align: left; user-select: none;
  -webkit-mask-image: linear-gradient(222deg, #000 0%, rgba(0,0,0,.75) 32%, rgba(0,0,0,.25) 60%, transparent 82%); mask-image: linear-gradient(222deg, #000 0%, rgba(0,0,0,.75) 32%, rgba(0,0,0,.25) 60%, transparent 82%); }
.cbg--dark, .slide--dark .cbg { color: #FFFFFF; opacity: .075; }
.slide[data-active="true"] .cbg { animation: cbgIn 1.6s var(--ps-ease) both; }
@keyframes cbgIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: .10; transform: none; } }
.slide--dark[data-active="true"] .cbg { animation-name: cbgInDark; }
@keyframes cbgInDark { from { opacity: 0; transform: translateY(-6px); } to { opacity: .075; transform: none; } }
"""
