/* make_btg_pptx.js: native, editable PT-BR PPTX of the BTG deck (40 slides) */
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const D = JSON.parse(fs.readFileSync("deck_pt.json", "utf8")); const XN = JSON.parse(fs.readFileSync("extra_notes.json", "utf8"));
const OUT = process.argv[2] || "VibeCodingEngenharia_BTG_Deck_v2_2_0_2026-09-01_pt-BR.pptx";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.author = "Paula Silva"; pres.company = "Microsoft";
pres.title = "Vibe coding é um estilo. Engenharia é uma disciplina.";

const C = { red: "F25022", green: "7FBA00", yellow: "FFB900", blue: "00A4EF",
  red7: "B33816", green7: "5A8500", yellow7: "B88500", blue7: "0076AC",
  redL: "FCE9E3", greenL: "F1F8E3", yellowL: "FFF7E0", blueL: "DDF3FD",
  ink: "1A1A19", ink2: "5C5A52", ink3: "82807A", paper: "FFFFFF", bg: "F7F7F4", rule: "E4E3DD", rule2: "CECEC7",
  dark: "141414", darkCard: "1E1E1E", darkInk: "F0F0EB", darkInk2: "B8B6AE", darkInk3: "82807A", code: "0F0F0E" };
const SANS = "Segoe UI", MONO = "Cascadia Mono";
const W = 13.333, H = 7.5, ML = 0.55, CW = W - 2 * ML;
const shadow = () => ({ type: "outer", blur: 8, offset: 2, angle: 90, color: "000000", opacity: 0.08 });
const strip = (s) => String(s || "").replace(/<span class="sub">/g, "\n").replace(/<br\s*\/?>/g, "\n").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\u00a0/g, " ");
const note = (n) => strip(D.notes["s" + n] || "").replace(/\*\*/g, "");

// ---------------- helpers ----------------
function header(s, dark) {
  const sq = [["F25022", 0.55, 0.28], ["7FBA00", 0.66, 0.28], ["00A4EF", 0.55, 0.39], ["FFB900", 0.66, 0.39]];
  sq.forEach(([c, x, y]) => s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.1, h: 0.1, fill: { color: c }, line: { type: "none" } }));
  s.background = { color: dark ? C.dark : C.bg };
}
function eyebrow(s, text, color, y = 0.75, dark = false, w = 11) {
  s.addText(strip(text).toUpperCase(), { x: ML, y, w, h: 0.3, fontFace: MONO, fontSize: 10.5, color: color || C.blue, charSpacing: 4, bold: true, valign: "middle", isTextBox: true, margin: 0 });
}
function title(s, text, y = 1.1, size = 30, dark = false, w = 11.5, h = 1.1) {
  s.addText(strip(text), { x: ML, y, w, h, fontFace: SANS, fontSize: size, bold: false, color: dark ? C.darkInk : C.ink, valign: "top", isTextBox: true, margin: 0, lineSpacingMultiple: 1.05 });
}
function caption(s, text, y = 6.65, dark = false, w = CW, size = 11) {
  s.addText(strip(text), { x: ML, y, w, h: 0.55, fontFace: SANS, fontSize: size, italic: true, color: dark ? C.darkInk2 : C.ink2, valign: "top", isTextBox: true, margin: 0 });
}
function card(s, x, y, w, h, opts = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: opts.fill || C.paper }, line: { color: opts.line || C.rule, width: 0.75 }, shadow: opts.noShadow ? undefined : shadow() });
  if (opts.top) s.addShape(pres.shapes.RECTANGLE, { x: x + 0.08, y, w: w - 0.16, h: 0.06, fill: { color: opts.top }, line: { type: "none" } });
}
function txt(s, text, x, y, w, h, o = {}) {
  s.addText(strip(text), Object.assign({ x, y, w, h, fontFace: o.mono ? MONO : SANS, fontSize: o.size || 12, color: o.color || C.ink, bold: !!o.bold, italic: !!o.italic, valign: o.valign || "top", align: o.align || "left", isTextBox: true, margin: 0, charSpacing: o.spacing, lineSpacingMultiple: o.lh || 1.15 }, o.extra || {}));
}
function label(s, text, x, y, w, color) { txt(s, String(text).toUpperCase(), x, y, w, 0.22, { mono: true, size: 8.5, color: color || C.ink3, spacing: 2, bold: true }); }
function chip(s, text, x, y, w, color, bg, mono = true) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.28, rectRadius: 0.05, fill: { color: bg || C.greenL }, line: { type: "none" } });
  txt(s, text, x + 0.08, y, w - 0.16, 0.28, { mono, size: 8.5, color: color || C.green7, valign: "middle", bold: true });
}
function pngSize(p) { const b = fs.readFileSync(p); return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) }; }
function img(s, name, x, y, w, h, align = "center") { const d = pngSize(`img_${name}.png`); const r = d.width / d.height; let ww = w, hh = w / r; if (hh > h) { hh = h; ww = h * r; } const xx = align === "left" ? x : align === "right" ? x + w - ww : x + (w - ww) / 2; s.addImage({ path: `img_${name}.png`, x: xx, y: y + (h - hh) / 2, w: ww, h: hh }); }
function divider(n, roman, key, color) {
  const s = pres.addSlide(); header(s, true);
  s.addText(roman, { x: ML, y: 1.3, w: 6, h: 2.4, fontFace: SANS, fontSize: 150, bold: true, color, isTextBox: true, margin: 0, valign: "top", charSpacing: -6 });
  txt(s, D[key].title, ML, 4.1, 12, 0.9, { size: 44, color: C.darkInk });
  txt(s, D[key].sub, ML, 5.05, 12.2, 0.6, { size: 16, color: C.darkInk2 });
  s.addShape(pres.shapes.OVAL, { x: ML, y: 5.92, w: 0.12, h: 0.12, fill: { color }, line: { type: "none" } });
  txt(s, D.labels["chapter" + (n)].toUpperCase(), ML + 0.22, 5.85, 1.6, 0.26, { mono: true, size: 9.5, color, bold: true, spacing: 2 });
  txt(s, D[key].story, ML + 1.8, 5.85, 10, 0.26, { mono: true, size: 9.5, color: C.darkInk2, italic: true });
  return s;
}
function bigCode(s, x, y, w, h, headerText, lines) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: C.code }, line: { type: "none" }, shadow: shadow() });
  if (headerText) txt(s, headerText.toUpperCase(), x + 0.25, y + 0.18, w - 0.5, 0.25, { mono: true, size: 8.5, color: C.darkInk3, spacing: 2 });
  s.addText(lines, { x: x + 0.25, y: y + (headerText ? 0.55 : 0.2), w: w - 0.5, h: h - (headerText ? 0.7 : 0.35), fontFace: MONO, fontSize: 10, color: C.darkInk, valign: "top", isTextBox: true, margin: 0, paraSpaceAfter: 0, lineSpacingMultiple: 1.0 });
}
const run = (text, o = {}) => ({ text, options: Object.assign({ fontFace: MONO, fontSize: 8, color: C.darkInk, breakLine: false }, o) });
const br = () => ({ text: "\n", options: { breakLine: true } });

// ================= 1 COVER =================
{ const s = pres.addSlide(); header(s);
  s.addText([{ text: strip(D.cover.part1), options: { color: C.ink, breakLine: true } }, { text: strip(D.cover.keyword1), options: { color: C.blue } }],
    { x: ML, y: 2.35, w: 12.3, h: 2.6, fontFace: SANS, fontSize: 60, bold: false, valign: "middle", isTextBox: true, margin: 0, lineSpacingMultiple: 1.0 });
  s.addNotes(note(1)); }

// ================= 2 ABOUT =================
{ const s = pres.addSlide(); header(s);
  s.addShape(pres.shapes.OVAL, { x: 0.75, y: 2.35, w: 3.0, h: 3.0, fill: { color: "FFFFFF" }, line: { type: "none" }, shadow: shadow() });
  s.addImage({ path: "paula-sq.jpg", x: 0.87, y: 2.47, w: 2.76, h: 2.76, rounding: true });
  txt(s, "SOBRE", 4.3, 1.05, 4, 0.3, { mono: true, size: 10.5, color: C.blue, spacing: 4, bold: true });
  txt(s, D.who.title, 4.3, 1.4, 8.5, 0.7, { size: 34 });
  s.addShape(pres.shapes.RECTANGLE, { x: 4.3, y: 2.25, w: 0.05, h: 1.55, fill: { color: C.blue }, line: { type: "none" } });
  txt(s, D.who.intro, 4.5, 2.25, 8.2, 1.55, { size: 13.5, color: C.ink });
  txt(s, D.who.p1, 4.3, 3.95, 8.4, 1.05, { size: 11.5, color: C.ink2 });
  txt(s, D.who.p2, 4.3, 5.05, 8.4, 0.7, { size: 11.5, color: C.ink2 });
  s.addShape(pres.shapes.LINE, { x: 4.3, y: 5.9, w: 8.4, h: 0, line: { color: C.rule, width: 0.75 } });
  label(s, D.who.ck, 4.3, 6.02, 1.2); txt(s, "paulasilva@microsoft.com", 5.3, 6.0, 4, 0.26, { mono: true, size: 11, color: C.blue7, bold: true });
  s.addNotes(note(2)); }
// remove the duplicated eyebrow call effect: (pptxgenjs writes both; harmless but avoid) -> handled by not calling twice in future edits

// ================= 3 RECEIPT =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.rc.eyebrow, C.red); title(s, D.rc.title, 1.1, 30, false, 11, 1.0);
  const rows = (x, y, w, hcol, head, sub, list, total, foot, headC, totC) => {
    card(s, x, y, w, 3.7);
    txt(s, head, x, y + 0.22, w, 0.3, { mono: true, size: 12, bold: true, color: headC, align: "center" });
    txt(s, sub, x, y + 0.5, w, 0.22, { mono: true, size: 8, color: C.ink3, align: "center" });
    s.addShape(pres.shapes.LINE, { x: x + 0.25, y: y + 0.82, w: w - 0.5, h: 0, line: { color: C.rule2, width: 0.75, dashType: "dash" } });
    list.forEach(([l, v], i) => { const yy = y + 0.95 + i * 0.27;
      txt(s, l, x + 0.25, yy, w * 0.6, 0.25, { mono: true, size: 9.5, color: C.ink2 });
      txt(s, v, x + w * 0.55, yy, w * 0.45 - 0.25, 0.25, { mono: true, size: 9.5, color: totC, bold: true, align: "right" }); });
    s.addShape(pres.shapes.LINE, { x: x + 0.25, y: y + 2.62, w: w - 0.5, h: 0, line: { color: C.rule2, width: 0.75, dashType: "dash" } });
    txt(s, D.rc.tot.toUpperCase(), x + 0.25, y + 2.78, 2, 0.4, { mono: true, size: 9, color: C.ink3, spacing: 2, valign: "middle" });
    txt(s, total, x + w - 2.9, y + 2.68, 2.65, 0.55, { mono: true, size: 26, color: totC, bold: true, align: "right", valign: "middle" });
    txt(s, foot.toUpperCase(), x, y + 3.32, w, 0.22, { mono: true, size: 7.5, color: C.ink3, align: "center", spacing: 1 }); };
  rows(ML, 2.2, 5.2, 0, "VIBE CODING", "um prompt, um agente, torcer", [[D.rc.r1, "19"], [D.rc.r2, "40"], [D.rc.r3, "84%"], [D.rc.r4, "0"], [D.rc.r5, "0"], [D.rc.r6, "nenhum"]], "190 mil", D.rc.f1, C.red7, C.red7);
  rows(7.58, 2.2, 5.2, 0, "ENGENHARIA", "spec, testes, harness, grafo", [[D.rc.s1, "3"], [D.rc.s2, "4"], [D.rc.s3, "31%"], [D.rc.s4, "1 · FR-012"], [D.rc.s5, "4 / 4 verdes"], [D.rc.s6, "#412 · 4 checks"]], "35 mil", D.rc.f2, C.green7, C.green7);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.95, y: 2.85, w: 1.45, h: 1.0, rectRadius: 0.08, fill: { color: C.code }, line: { type: "none" } });
  txt(s, strip(D.rc.same).toUpperCase(), 6.0, 2.9, 1.35, 0.55, { mono: true, size: 7, color: C.darkInk, align: "center", valign: "middle", bold: true });
  txt(s, D.rc.same2, 6.0, 3.45, 1.35, 0.35, { mono: true, size: 7.5, color: C.yellow, align: "center", valign: "middle", bold: true });
  txt(s, "5x", 5.95, 4.0, 1.45, 0.55, { mono: true, size: 30, bold: true, color: C.green7, align: "center" });
  txt(s, strip(D.rc.ratio).toUpperCase(), 5.9, 4.55, 1.55, 0.5, { mono: true, size: 7, color: C.ink3, align: "center" });
  caption(s, D.rc.cap, 6.05); s.addNotes(note(3)); }

// ================= 4 CHANGE TABLE =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.chg.eyebrow, C.blue); title(s, D.chg.title, 1.1, 28, false, 11, 0.95);
  const hdr = [{ text: "", options: { fill: { color: "EEEEE9" } } }, { text: strip(D.chg.hOld).toUpperCase(), options: { fontFace: MONO, fontSize: 8, color: C.ink3, bold: true, fill: { color: "EEEEE9" } } }, { text: strip(D.chg.hNew).toUpperCase(), options: { fontFace: MONO, fontSize: 8, color: C.blue7, bold: true, fill: { color: C.blueL } } }];
  const body = [1, 2, 3, 4, 5, 6].map(i => {
    const n = D.chg["n" + i]; const m = n.match(/^<b>(.*?)<\/b>\s*(.*)$/);
    const newCell = m ? [{ text: strip(m[1]) + " ", options: { bold: true, color: C.blue7 } }, { text: strip(m[2]), options: { color: C.ink } }] : [{ text: strip(n).replace(/\s+/g, " "), options: { color: C.ink } }];
    return [{ text: D.chg["k" + i], options: { bold: true, fontSize: 11 } }, { text: strip(D.chg["o" + i]), options: { color: C.ink3 } }, { text: newCell, options: { fill: { color: "F3F9FD" } } }]; });
  s.addTable([hdr, ...body], { x: ML, y: 2.2, w: CW, colW: [1.7, 4.4, 6.13], fontFace: SANS, fontSize: 10.5, color: C.ink, border: { type: "solid", color: C.rule, pt: 0.75 }, rowH: [0.36, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6], valign: "middle", margin: 0.08 });
  caption(s, D.chg.cap, 6.55); s.addNotes(note(4)); }

// ================= 5 AGENDA =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.agenda.eyebrow, C.blue); title(s, D.agenda.title, 1.1, 32, false, 12, 0.8);
  const cols = [C.red, C.blue, C.green, C.yellow, C.red, C.green]; const mins = [5, 4, 8, 8, 11, 5]; const rom = ["I", "II", "III", "IV", "V", "VI"];
  for (let i = 0; i < 6; i++) { const y = 2.1 + i * 0.74;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: ML, y: y + 0.06, w: 0.62, h: 0.46, rectRadius: 0.08, fill: { color: [C.redL, C.blueL, C.greenL, C.yellowL, C.redL, C.greenL][i] }, line: { type: "none" } });
    txt(s, rom[i], ML, y + 0.06, 0.62, 0.46, { mono: true, size: 13, bold: true, color: cols[i], valign: "middle", align: "center" });
    txt(s, D.agenda["item" + (i + 1)], 1.4, y + 0.02, 9.9, 0.34, { size: 12.5, valign: "middle" });
    const tg = D.agenda["tag" + (i + 1)]; const tcol = [C.green7, C.ink3, C.blue7, C.blue7, C.green7, C.green7][i]; const tbg = [C.greenL, "ECECE8", C.blueL, C.blueL, C.greenL, C.greenL][i];
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.4, y: y + 0.38, w: Math.min(6.5, 0.085 * tg.length + 0.3), h: 0.22, rectRadius: 0.04, fill: { color: tbg }, line: { type: "none" } });
    txt(s, tg.toUpperCase(), 1.48, y + 0.38, 6.4, 0.22, { mono: true, size: 6.5, color: tcol, bold: true, valign: "middle", spacing: 1 });
    txt(s, mins[i] + " min", 11.6, y + 0.1, 1.2, 0.4, { mono: true, size: 9, color: C.ink3, align: "right", valign: "middle", bold: true });
    s.addShape(pres.shapes.LINE, { x: ML, y: y + 0.66, w: CW, h: 0, line: { color: C.rule, width: 0.75 } }); }
  s.addNotes(note(5)); }

// ================= 6 DIVIDER I =================
divider(1, "I", "part1", C.red).addNotes(note(6));

// ================= 7 MODEL VS SYSTEM =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.ms.eyebrow, C.red); title(s, D.ms.title, 1.1, 28, false, 11.5, 1.0);
  const cardBA = (x, k, t, b, n, sub, col) => { card(s, x, 2.3, 4.9, 3.05, { top: col });
    label(s, k, x + 0.3, 2.55, 4.3); txt(s, t, x + 0.3, 2.8, 4.3, 0.4, { size: 17, bold: true });
    txt(s, b, x + 0.3, 3.22, 4.3, 1.4, { size: 10.5, color: C.ink2 });
    txt(s, n, x + 0.3, 4.45, 4.3, 0.45, { mono: true, size: 24, bold: true, color: col === C.green ? C.green7 : C.ink3 });
    txt(s, sub.toUpperCase(), x + 0.3, 4.95, 4.3, 0.3, { mono: true, size: 7, color: C.ink3, spacing: 1 }); };
  cardBA(ML, D.ms.k1, D.ms.t1, D.ms.b1, "+20%", D.ms.n1, "82807A");
  cardBA(7.88, D.ms.k2, D.ms.t2, D.ms.b2, "5 a 10x", D.ms.n2, C.green);
  txt(s, "=", 5.55, 3.2, 2.2, 0.8, { mono: true, size: 40, bold: true, color: C.ink, align: "center" });
  txt(s, strip(D.ms.date).toUpperCase(), 5.5, 4.0, 2.3, 0.6, { mono: true, size: 8, color: C.ink3, align: "center", spacing: 1 });
  [["c1k", "c1", "82807A"], ["c2k", "c2", C.blue7], ["c3k", "c3", C.green7]].forEach(([k, v, col], i) => { const x = ML + i * 4.13;
    card(s, x, 5.6, 3.95, 0.95, { noShadow: true });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 5.72, w: 0.05, h: 0.7, fill: { color: col }, line: { type: "none" } });
    txt(s, D.ms[k], x + 0.22, 5.7, 3.6, 0.3, { size: 11, bold: true }); txt(s, D.ms[v], x + 0.22, 5.98, 3.6, 0.5, { size: 10, color: C.ink2 }); });
  s.addNotes(note(7)); }

// ================= 8 ICEBERG =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.ic.eyebrow, C.red); title(s, D.ic.title, 1.1, 27, false, 12, 0.7);
  const cva = (y, k, t, b, big, u, col, pct) => { card(s, ML, y, 5.9, 1.85); s.addShape(pres.shapes.RECTANGLE, { x: ML, y: y + 0.1, w: 0.06, h: 1.65, fill: { color: col }, line: { type: "none" } });
    label(s, k, ML + 0.3, y + 0.16, 5, col); txt(s, t, ML + 0.3, y + 0.36, 5.4, 0.42, { size: 10.5, bold: true, lh: 1.05 }); txt(s, b, ML + 0.3, y + 0.8, 5.4, 0.48, { size: 8.5, color: C.ink2 });
    s.addShape(pres.shapes.RECTANGLE, { x: ML + 0.3, y: y + 1.3, w: 5.3, h: 0.08, fill: { color: "ECECE8" }, line: { type: "none" } });
    s.addShape(pres.shapes.RECTANGLE, { x: ML + 0.3, y: y + 1.3, w: 5.3 * pct, h: 0.08, fill: { color: col }, line: { type: "none" } });
    txt(s, big, ML + 0.3, y + 1.42, 2.2, 0.35, { mono: true, size: 17, bold: true, color: col }); txt(s, u.toUpperCase(), ML + 2.2, y + 1.5, 3.4, 0.25, { mono: true, size: 7.5, color: C.ink3, spacing: 1 }); };
  cva(2.05, D.ic.k1, D.ic.t1, D.ic.b1, "~8 mil", D.ic.u, C.blue, 0.06);
  cva(4.05, D.ic.k2, D.ic.t2, D.ic.b2, "80 a 200 mil", D.ic.u2, C.red, 1.0);
  img(s, "iceberg", 6.9, 2.05, 5.7, 3.35);
  caption(s, D.ic.cap, 6.05, false, CW, 10); s.addNotes(note(8)); }

// ================= 9 INTENT DEBT =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.debt.eyebrow, C.yellow7); title(s, D.debt.title, 1.1, 27, false, 12, 1.0);
  img(s, "calc", ML, 2.25, 12.23, 3.95);
  caption(s, D.debt.caption, 6.35, false, CW, 10); s.addNotes(note(9)); }

// ================= 10 DIVIDER II =================
divider(2, "II", "part2", C.blue).addNotes(note(10));

// ================= 11 PHASES: one slide per rung =================
{ const cols = [C.ink3, C.blue, C.green, C.yellow, C.red]; const colsD = [C.ink3, C.blue7, C.green7, C.yellow7, C.red7];
  for (let ph = 1; ph <= 5; ph++) { const s = pres.addSlide(); header(s); const p = D.ph["p" + ph];
    eyebrow(s, D.ph.eyebrow + "  ·  " + ph + " / 5", cols[ph - 1] === C.ink3 ? C.blue : colsD[ph - 1]); title(s, D.ph.title, 1.1, 26, false, 12, 1.0);
    for (let i = 1; i <= 5; i++) { const y = 2.2 + (i - 1) * 0.86; const on = i === ph; const q = D.ph["p" + i];
      card(s, ML, y, 3.2, 0.74, { noShadow: !on, line: on ? C.ink : C.rule, fill: on ? "FFFFFF" : C.paper });
      txt(s, String(i), ML + 0.15, y + 0.1, 0.4, 0.5, { mono: true, size: 16, bold: true, color: cols[i - 1], valign: "middle" });
      txt(s, q.n, ML + 0.6, y + 0.1, 2.5, 0.3, { size: 12, bold: true, color: on ? C.ink : C.ink2 }); txt(s, q.q, ML + 0.6, y + 0.38, 2.5, 0.3, { size: 8.5, color: C.ink3 }); }
    card(s, 3.95, 2.2, 8.83, 4.5);
    img(s, "phase" + ph, 4.1, 2.35, 4.4, 4.2, "center");
    label(s, p.k, 8.7, 2.45, 3.95, colsD[ph - 1] === C.ink3 ? C.blue7 : colsD[ph - 1]);
    txt(s, p.def, 8.7, 2.72, 3.9, 1.35, { size: 9.5, color: C.ink });
    s.addShape(pres.shapes.RECTANGLE, { x: 8.7, y: 4.12, w: 3.9, h: 1.05, fill: { color: C.greenL }, line: { type: "none" } }); s.addShape(pres.shapes.RECTANGLE, { x: 8.7, y: 4.12, w: 0.05, h: 1.05, fill: { color: C.green }, line: { type: "none" } });
    label(s, D.ph.saveLabel, 8.85, 4.18, 3.6, C.green7); txt(s, p.save, 8.85, 4.38, 3.65, 0.78, { size: 8, color: C.ink });
    s.addShape(pres.shapes.RECTANGLE, { x: 8.7, y: 5.25, w: 3.9, h: 0.75, fill: { color: C.redL }, line: { type: "none" } }); s.addShape(pres.shapes.RECTANGLE, { x: 8.7, y: 5.25, w: 0.05, h: 0.75, fill: { color: C.red }, line: { type: "none" } });
    label(s, D.ph.errLabel, 8.85, 5.31, 3.6, C.red7); txt(s, p.err, 8.85, 5.51, 3.65, 0.48, { size: 8, color: C.ink });
    s.addShape(pres.shapes.LINE, { x: 8.7, y: 6.1, w: 3.9, h: 0, line: { color: C.rule2, width: 0.75, dashType: "dash" } });
    txt(s, strip(p.turn), 8.7, 6.17, 3.9, 0.45, { mono: true, size: 8, bold: true, color: C.green7 });
    s.addNotes((ph === 1 ? "[COMO USAR] No HTML este slide é um explorador com cinco abas; no PowerPoint são cinco slides, um por degrau. " : "") + XN.phases[String(ph)]); }
}

// ================= 12 ONE LINE =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.ol.eyebrow, C.green); title(s, D.ol.title, 1.1, 27, false, 12, 1.0);
  const cols = ["82807A", C.blue, C.green, C.yellow, C.red];
  for (let i = 1; i <= 5; i++) { const y = 2.3 + (i - 1) * 0.66; card(s, ML, y, 8.3, 0.56, { noShadow: true }); s.addShape(pres.shapes.RECTANGLE, { x: ML, y: y + 0.06, w: 0.07, h: 0.44, fill: { color: cols[i - 1] }, line: { type: "none" } });
    txt(s, String(i), ML + 0.25, y + 0.08, 0.4, 0.4, { mono: true, size: 15, bold: true, color: cols[i - 1], valign: "middle" });
    txt(s, D.ol["w" + i], ML + 0.75, y + 0.08, 1.6, 0.4, { size: 14, bold: true, valign: "middle" }); txt(s, D.ol["t" + i], ML + 2.4, y + 0.08, 5.7, 0.4, { size: 13, color: C.ink2, valign: "middle" }); }
  txt(s, D.ol.foot, ML, 5.7, 8.3, 0.7, { mono: true, size: 9.5, color: C.ink3, bold: true });
  txt(s, D.ol.top, 9.4, 2.3, 3.4, 0.25, { mono: true, size: 8, color: C.ink3, spacing: 2, align: "center" });
  const stack = [["graph", C.red, "FFFFFF", 1.6], ["loop", C.yellow, C.ink, 1.95], ["harness", C.green, "FFFFFF", 2.3], ["contexto", C.blue, "FFFFFF", 2.65], ["prompt", "82807A", "FFFFFF", 3.0]];
  stack.forEach(([t, bg, fg, w], i) => { const x = 11.1 - w / 2; const y = 2.75 + i * 0.66; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.55, rectRadius: 0.08, fill: { color: bg }, line: { type: "none" } }); txt(s, t, x, y, w, 0.55, { size: 12, bold: true, color: fg, align: "center", valign: "middle" }); });
  s.addNotes(note(12)); }

// ================= 13 DIVIDER III =================
divider(3, "III", "part3", C.green).addNotes(note(13));

// ================= 14 SPEC KIT CHAIN =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.chain.eyebrow, C.green); title(s, D.chain.title, 1.1, 24, false, 12.2, 0.9);
  const cols = [C.blue, C.green, C.yellow, C.red]; const cmds = ["/specify", "/plan", "/tasks", "/implement"];
  for (let i = 0; i < 4; i++) { const y = 2.1 + i * 1.08; card(s, ML, y, CW, 0.82, { noShadow: true }); s.addShape(pres.shapes.RECTANGLE, { x: ML, y: y + 0.06, w: 0.07, h: 0.7, fill: { color: cols[i] }, line: { type: "none" } });
    txt(s, "0" + (i + 1), ML + 0.25, y + 0.28, 0.5, 0.3, { mono: true, size: 9, bold: true, color: cols[i] });
    txt(s, D.chain["t" + (i + 1)], ML + 0.85, y + 0.1, 3.2, 0.32, { size: 14, bold: true }); txt(s, D.chain["s" + (i + 1)], ML + 0.85, y + 0.42, 3.4, 0.4, { size: 8.5, color: C.ink2 });
    txt(s, D.chain["q" + (i + 1)], 4.7, y + 0.2, 3.3, 0.5, { size: 9.5, italic: true, color: C.ink2, valign: "middle" });
    s.addShape(pres.shapes.RECTANGLE, { x: 8.15, y: y + 0.42, w: 3.55, h: 0.28, fill: { color: C.greenL }, line: { type: "none" } });
    txt(s, D.chain["k" + (i + 1)], 8.23, y + 0.14, 3.4, 0.56, { mono: true, size: 7.5, color: C.green7, bold: true, valign: "middle", lh: 1.2 });
    txt(s, cmds[i], 11.8, y + 0.2, 0.95, 0.5, { mono: true, size: 9, bold: true, color: cols[i], align: "right", valign: "middle" });
    if (i < 3) txt(s, ("gate " + strip(D.chain["g" + (i + 1)]).replace(/^gate:\s*/, "")).toUpperCase(), ML, y + 0.84, CW, 0.24, { mono: true, size: 7.5, color: C.ink3, align: "center", spacing: 1, valign: "middle" }); }
  caption(s, D.chain.cap, 6.5, false, CW, 9); s.addNotes(note(14)); }

// ================= 15 BRIDGE =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.bridge.eyebrow, C.yellow7); title(s, D.bridge.title, 1.1, 24, false, 12, 0.9);
  const spec = [run("## FR-012 Tarifa de custódia multi-moeda", { italic: true, color: C.darkInk3 }), br(), run("WHEN ", { color: C.blue }), run("uma conta tem posições em "), run("mais de uma moeda", { color: C.yellow }), run(","), br(),
    run("THE SYSTEM SHALL ", { color: C.blue }), run("calcular a tarifa por moeda em centavos inteiros"), br(), run("AND SHALL ", { color: C.blue }), run("arredondar uma única vez, no total."), br(),
    run("Critérios de aceitação:", { italic: true, color: C.darkInk3 }), br(), run("AC-1 ", { color: C.yellow, bold: true }), run("uma moeda: tarifa igual ao cálculo atual"), br(), run("AC-2 ", { color: C.yellow, bold: true }), run("duas moedas: soma dos centavos, sem drift"), br(),
    run("AC-3 ", { color: C.yellow, bold: true }), run("arredondamento acontece exatamente 1 vez"), br(), run("AC-4 ", { color: C.yellow, bold: true }), run("trilha de auditoria registra cada parcela")];
  const tests = [run("def ", { color: C.blue }), run("test_single_currency_matches_current():  "), run("# AC-1", { italic: true, color: C.darkInk3 }), br(), run("    assert ", { color: C.blue }), run("fee(acct(BRL=1_000_00)) == 2_50"), br(),
    run("def ", { color: C.blue }), run("test_two_currencies_sum_integer_cents():  "), run("# AC-2", { italic: true, color: C.darkInk3 }), br(), run("    assert ", { color: C.blue }), run("fee(acct(BRL=1_000_00, USD=200_00)) == 2_50 + 1_10"), br(),
    run("def ", { color: C.blue }), run("test_rounds_exactly_once():  "), run("# AC-3", { italic: true, color: C.darkInk3 }), br(), run("    assert ", { color: C.blue }), run("rounding_calls(fee, acct(BRL=333_33, USD=333_33)) == 1"), br(),
    run("def ", { color: C.blue }), run("test_audit_trail_one_line_per_currency():  "), run("# AC-4", { italic: true, color: C.darkInk3 }), br(), run("    assert ", { color: C.blue }), run("len(audit(fee, acct(BRL=1, USD=1))) == 2")];
  bigCode(s, ML, 2.15, 6.0, 3.75, D.bridge.h1, spec); bigCode(s, 6.78, 2.15, 6.0, 3.75, D.bridge.h2, tests);
  [["b1k", "b1", C.green], ["b2k", "b2", C.blue], ["b3k", "b3", C.yellow]].forEach(([k, v, col], i) => { const x = ML + i * 4.13; card(s, x, 6.0, 3.95, 0.85, { noShadow: true }); s.addShape(pres.shapes.RECTANGLE, { x, y: 6.1, w: 0.05, h: 0.65, fill: { color: col }, line: { type: "none" } });
    label(s, D.bridge[k], x + 0.2, 6.08, 3.5, col === C.yellow ? C.yellow7 : col === C.green ? C.green7 : C.blue7); txt(s, D.bridge[v], x + 0.2, 6.3, 3.6, 0.5, { size: 9.5, color: C.ink }); });
  s.addNotes(note(15)); }

// ================= 16 THREE JUDGES =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.judge.eyebrow, C.green); title(s, D.judge.title, 1.1, 24, false, 12.2, 0.9);
  const J = [["k1", "t1", "c1", "d1", "a1", "s1", "v1", "82807A", [C.red7, C.yellow7, C.yellow7, C.red7], "40 min", "por PR, de gente cara", C.ink3],
    ["k2", "t2", "c2", "d2", "a2", "s2", "v2", C.yellow, [C.yellow7, C.red7, C.red7, C.yellow7], "~12 mil", "tokens por verificação", C.yellow7],
    ["k3", "t3", "c3", "d3", "a3", "s3", "v3", C.green, [C.green7, C.green7, C.green7, C.green7], "0 tokens", "por verificação, para sempre", C.green7]];
  J.forEach((j, i) => { const x = ML + i * 4.13; card(s, x, 2.2, 3.95, 4.5, { top: j[7], line: i === 2 ? C.green : C.rule });
    label(s, D.judge[j[0]], x + 0.25, 2.45, 3.5, j[7] === "82807A" ? C.ink3 : (i === 1 ? C.yellow7 : C.green7)); txt(s, D.judge[j[1]], x + 0.25, 2.68, 3.5, 0.6, { size: 13.5, bold: true });
    [["rCost", "c"], ["rDet", "d"], ["rAud", "a"], ["rScale", "s"]].forEach(([rk, ck], r) => { const y = 3.4 + r * 0.55; s.addShape(pres.shapes.LINE, { x: x + 0.25, y, w: 3.45, h: 0, line: { color: C.rule, width: 0.75 } });
      txt(s, D.judge[rk].toUpperCase(), x + 0.25, y + 0.08, 1.15, 0.4, { mono: true, size: 7, color: C.ink3, spacing: 1, valign: "middle" }); txt(s, D.judge[j[2 + r]], x + 1.4, y + 0.06, 2.3, 0.45, { size: 9.5, bold: true, color: j[8][r], valign: "middle" }); });
    txt(s, j[9], x + 0.25, 5.75, 3.5, 0.5, { mono: true, size: 24, bold: true, color: j[11] }); txt(s, j[10].toUpperCase(), x + 0.25, 6.27, 3.5, 0.3, { mono: true, size: 7.5, color: C.ink3, spacing: 1 }); });
  s.addNotes(note(16)); }

// ================= 17 DOUBLE LOOP =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.dloop.eyebrow, C.yellow7); title(s, D.dloop.title, 1.1, 27, false, 12, 1.0);
  img(s, "dloop", 0.9, 2.2, 11.5, 3.6);
  [["b1k", "b1", C.yellow], ["b2k", "b2", C.green], ["b3k", "b3", C.red]].forEach(([k, v, col], i) => { const x = ML + i * 4.13; card(s, x, 5.95, 3.95, 0.8, { noShadow: true }); s.addShape(pres.shapes.RECTANGLE, { x, y: 6.05, w: 0.05, h: 0.6, fill: { color: col }, line: { type: "none" } });
    label(s, D.dloop[k], x + 0.2, 6.03, 3.5, col === C.yellow ? C.yellow7 : col === C.green ? C.green7 : C.red7); txt(s, D.dloop[v], x + 0.2, 6.25, 3.6, 0.5, { size: 9.5 }); });
  caption(s, D.dloop.cap, 6.85, false, CW, 8.5); s.addNotes(note(17)); }

// ================= 18 TOKENS =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.tk.eyebrow, C.green); title(s, D.tk.title, 1.1, 27, false, 12, 1.0);
  const col = (x, head, total, rows, noteHtml, tc) => { card(s, x, 2.3, 5.95, 3.9); txt(s, head, x + 0.3, 2.5, 4.2, 0.35, { size: 13, bold: true }); txt(s, total, x + 4.2, 2.45, 1.5, 0.45, { mono: true, size: 20, bold: true, color: tc, align: "right" });
    rows.forEach(([l, pct, v, c], i) => { const y = 3.05 + i * 0.42; txt(s, l, x + 0.3, y, 1.6, 0.3, { mono: true, size: 8.5, color: C.ink2, valign: "middle" });
      s.addShape(pres.shapes.RECTANGLE, { x: x + 1.95, y: y + 0.09, w: 2.9, h: 0.12, fill: { color: "ECECE8" }, line: { type: "none" } });
      if (pct > 0) s.addShape(pres.shapes.RECTANGLE, { x: x + 1.95, y: y + 0.09, w: Math.max(0.05, 2.9 * pct), h: 0.12, fill: { color: c }, line: { type: "none" } });
      txt(s, v, x + 4.95, y, 0.75, 0.3, { mono: true, size: 9, bold: true, align: "right", valign: "middle" }); });
    txt(s, strip(noteHtml), x + 0.3, 5.2, 5.4, 0.9, { size: 9.5, color: C.ink2 }); };
  col(ML, D.tk.h1, "190 mil", [[D.tk.in, 1, "168 mil", C.red], [D.tk.out, .08, "14 mil", C.yellow], [D.tk.cache, .05, "8 mil", C.blue], [D.tk.reread, .42, "71 mil", "82807A"], [D.tk.raw, .33, "55 mil", "82807A"]], D.tk.n1, C.red7);
  col(6.83, D.tk.h2, "35 mil", [[D.tk.in, .13, "22 mil", C.red], [D.tk.out, .04, "6 mil", C.yellow], [D.tk.cache, .04, "7 mil", C.blue], [D.tk.reread, 0, "0", "82807A"], [D.tk.raw, .02, "4 mil", "82807A"]], D.tk.n2, C.green7);
  caption(s, D.tk.cap, 6.4, false, CW, 10); s.addNotes(note(18)); }

// ================= 19 DIVIDER IV =================
divider(4, "IV", "part4", C.yellow).addNotes(note(19));

// ================= 20 HARNESS RING =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.har.eyebrow, C.yellow7); title(s, D.har.title, 1.1, 24, false, 12.2, 0.9);
  const names = ["Instructions", "Constraints", "Feedback", "Memory", "Evaluation", "Governance"]; const cols = [C.blue, C.green, C.yellow, C.red, C.blue, C.green];
  names.forEach((n, i) => { const y = 2.15 + i * 0.72; card(s, ML, y, 6.6, 0.64, { noShadow: true }); s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: ML + 0.18, y: y + 0.24, w: 0.16, h: 0.16, rectRadius: 0.03, fill: { color: cols[i] }, line: { type: "none" } });
    txt(s, n, ML + 0.5, y + 0.05, 1.5, 0.55, { mono: true, size: 10.5, bold: true, valign: "middle" }); txt(s, D.har["l" + (i + 1)], ML + 2.0, y + 0.05, 2.9, 0.58, { size: 8.5, color: C.ink2, valign: "middle" });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: ML + 4.95, y: y + 0.12, w: 1.5, h: 0.42, rectRadius: 0.04, fill: { color: C.greenL }, line: { type: "none" } }); txt(s, D.har["k" + (i + 1)], ML + 5.0, y + 0.12, 1.42, 0.42, { mono: true, size: 6.5, color: C.green7, bold: true, valign: "middle" }); });
  img(s, "ring", 7.5, 2.15, 4.9, 4.33);
  caption(s, D.har.cap, 6.6, false, CW, 9); s.addNotes(note(20)); }

// ================= 21 HARNESS PICKER =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.hp.eyebrow, C.yellow7); title(s, D.hp.title, 1.1, 22, false, 12.2, 0.9);
  const cols = ["82807A", C.blue, "D97757", "1A1A19", C.green];
  const hdr = [D.hp.h0, D.hp.h1, D.hp.h2, D.hp.h3, D.hp.h4].map((h, i) => ({ text: strip(h).toUpperCase(), options: { fontFace: MONO, fontSize: 7.5, bold: true, color: i === 4 ? C.green7 : C.ink3, fill: { color: "EEEEE9" } } }));
  const rows = [1, 2, 3, 4, 5].map(i => [{ text: strip(D.hp["n" + i]), options: { fontFace: MONO, bold: true, fontSize: 10, color: C.ink, fill: { color: i === 2 ? C.blueL : C.paper } } }, { text: strip(D.hp["w" + i]), options: { fill: { color: i === 2 ? C.blueL : C.paper } } }, { text: strip(D.hp["a" + i]), options: { fill: { color: i === 2 ? C.blueL : C.paper } } }, { text: strip(D.hp["f" + i]), options: { fill: { color: i === 2 ? C.blueL : C.paper } } }, { text: strip(D.hp["t" + i]), options: { bold: true, color: C.ink, fill: { color: i === 2 ? C.blueL : C.paper } } }]);
  s.addTable([hdr, ...rows], { x: ML, y: 2.15, w: CW, colW: [1.25, 2.4, 2.1, 3.3, 3.18], fontFace: SANS, fontSize: 8.5, color: C.ink2, border: { type: "solid", color: C.rule, pt: 0.75 }, rowH: [0.3, 0.62, 0.62, 0.62, 0.62, 0.62], valign: "middle", margin: 0.06 });
  ["c1", "c2", "c3"].forEach((k, i) => { const w = [3.3, 3.5, 5.3][i]; const x = ML + [0, 3.4, 7.0][i]; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 5.75, w, h: 0.28, rectRadius: 0.05, fill: { color: C.greenL }, line: { type: "none" } }); txt(s, D.hp[k], x + 0.08, 5.75, w - 0.16, 0.28, { mono: true, size: 6.5, color: C.green7, bold: true, valign: "middle" }); });
  caption(s, D.hp.cap, 6.15, false, CW, 9); s.addNotes(note(21)); }

// ================= 22 HARNESS BY STAGE =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.hd.eyebrow, C.yellow7); title(s, D.hd.title, 1.1, 24, false, 12.2, 0.9);
  const cols = [C.blue, C.green, C.green, C.yellow, C.red];
  const hdr = ["", D.hd.c1, D.hd.c2, D.hd.c3, D.hd.c4].map(h => ({ text: strip(h).toUpperCase(), options: { fontFace: MONO, fontSize: 7.5, bold: true, color: C.ink3, fill: { color: "EEEEE9" } } }));
  const rows = [1, 2, 3, 4, 5].map(i => [{ text: String(i), options: { fontFace: MONO, bold: true, fontSize: 11, color: cols[i - 1], align: "center" } }, { text: strip(D.hd["s" + i]), options: { bold: true, color: C.ink } }, { text: strip(D.hd["h" + i]), options: { fontFace: MONO, fontSize: 8, bold: true, color: cols[i - 1] === C.yellow ? C.yellow7 : cols[i - 1] === C.green ? C.green7 : cols[i - 1] === C.red ? C.red7 : C.blue7 } }, { text: strip(D.hd["i" + i]) }, { text: strip(D.hd["w" + i]) }]);
  s.addTable([hdr, ...rows], { x: ML, y: 2.15, w: CW, colW: [0.4, 2.6, 2.4, 2.6, 4.23], fontFace: SANS, fontSize: 8.5, color: C.ink2, border: { type: "solid", color: C.rule, pt: 0.75 }, rowH: [0.3, 0.6, 0.6, 0.6, 0.6, 0.6], valign: "middle", margin: 0.06 });
  ["f1", "f2", "f3", "f4"].forEach((k, i) => { const w = [3.3, 3.2, 3.3, 2.2][i]; const x = ML + [0, 3.4, 6.7, 10.1][i]; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 5.65, w, h: 0.28, rectRadius: 0.05, fill: { color: C.greenL }, line: { type: "none" } }); txt(s, D.hd[k], x + 0.08, 5.65, w - 0.16, 0.28, { mono: true, size: 6.3, color: C.green7, bold: true, valign: "middle" }); });
  caption(s, D.hd.cap, 6.05, false, CW, 9); s.addNotes(note(22)); }

// ================= 21 VS CODE =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.vsc.eyebrow, C.blue); title(s, D.vsc.title, 1.1, 24, false, 12.2, 0.9);
  img(s, "vsc", ML, 2.1, 11.6, 4.75); s.addNotes(note(23)); }

// ================= 22 HOOKS =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.hooks.eyebrow, C.blue); title(s, D.hooks.title, 1.1, 27, false, 12, 1.0);
  img(s, "hooks", ML, 2.2, 12.23, 1.35);
  const hk = [["preToolUse", "l1", "k1", C.blue], ["postToolUse", "l2", "k2", C.green], ["subagentStop", "l3", "k3", C.yellow], ["errorOccurred", "l4", "k4", C.red]];
  hk.forEach(([n, l, k, col], i) => { const x = ML + i * 3.1; card(s, x, 3.75, 2.95, 1.75, { top: col }); txt(s, n, x + 0.2, 3.95, 2.6, 0.3, { mono: true, size: 11, bold: true, color: col === C.yellow ? C.yellow7 : col === C.green ? C.green7 : col === C.red ? C.red7 : C.blue7 }); txt(s, D.hooks[l], x + 0.2, 4.25, 2.6, 0.75, { size: 8.5, color: C.ink2 });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.2, y: 5.05, w: 2.55, h: 0.36, fill: { color: C.greenL }, line: { type: "none" } }); txt(s, D.hooks[k], x + 0.26, 5.05, 2.45, 0.36, { mono: true, size: 6.5, color: C.green7, bold: true, valign: "middle" }); });
  img(s, "hooksterm", ML, 5.7, 12.23, 1.15); s.addNotes(note(24)); }

// ================= 23 CATALOG: one slide per primitive =================
{ const SN = JSON.parse(fs.readFileSync("snippets.json", "utf8"));
  const keys = ["instructions", "prompts", "agents", "skills", "hooks", "specs", "mcp", "workflows"]; const cols = [C.blue, C.green, C.yellow, C.red, C.blue, C.green, C.yellow, C.red]; const colsL = [C.blueL, C.greenL, C.yellowL, C.redL, C.blueL, C.greenL, C.yellowL, C.redL]; const colsD = [C.blue7, C.green7, C.yellow7, C.red7, C.blue7, C.green7, C.yellow7, C.red7];
  const pats = ["AGENTS.md · *.instructions.md", "*.prompt.md", "*.agent.md", "SKILL.md", "hooks.json", "spec-template.md · constitution.md", "mcp.json", ".github/workflows/*.yml"];
  keys.forEach((cur, ci) => { const s = pres.addSlide(); header(s);
    eyebrow(s, D.cat.eyebrow + "  ·  " + (ci + 1) + " / 8", C.green); title(s, D.cat.title, 1.1, 26, false, 12, 1.0);
    keys.forEach((k, i) => { const x = ML + (i % 4) * 2.0, y = 2.3 + Math.floor(i / 4) * 2.0; const on = i === ci; card(s, x, y, 1.85, 1.85, { noShadow: !on, line: on ? cols[i] : C.rule, fill: on ? "FFFFFF" : C.paper });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.15, y: y + 0.15, w: 0.32, h: 0.32, rectRadius: 0.06, fill: { color: colsL[i] }, line: { type: "none" } });
      txt(s, D.cat[k].t, x + 0.15, y + 0.55, 1.6, 0.3, { size: 11, bold: true, color: on ? C.ink : C.ink2 }); txt(s, pats[i], x + 0.15, y + 0.85, 1.6, 0.3, { mono: true, size: 6.5, color: C.ink3 }); txt(s, D.cat[k].d, x + 0.15, y + 1.12, 1.6, 0.65, { size: 8, color: C.ink2 }); });
    const p = D.cat[cur];
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.85, y: 2.3, w: 3.93, h: 3.85, rectRadius: 0.1, fill: { color: C.code }, line: { type: "none" }, shadow: shadow() });
    label(s, cur, 9.1, 2.5, 3, cols[ci]); txt(s, p.p, 9.1, 2.75, 3.5, 0.45, { size: 12, bold: true, color: C.darkInk });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 9.1, y: 3.25, w: 3.45, h: 1.95, rectRadius: 0.06, fill: { color: "1A1A1A" }, line: { color: "2E2E2A", width: 0.75 } });
    const lines = SN[cur].split("\n").filter(l => l.trim().length); const runs = []; lines.forEach((l, li) => { runs.push(run(l, { fontSize: 7.5, color: li === 0 ? "6A9955" : C.darkInk })); if (li < lines.length - 1) runs.push(br()); });
    s.addText(runs, { x: 9.22, y: 3.35, w: 3.25, h: 1.8, fontFace: MONO, valign: "top", isTextBox: true, margin: 0, paraSpaceAfter: 3 });
    [["where", "w"], ["saves", "s"]].forEach(([lk, vk], i) => { const x = 9.1 + i * 1.78; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 5.32, w: 1.67, h: 0.75, rectRadius: 0.05, fill: { color: "1C1C1A" }, line: { type: "none" } }); txt(s, String(D.cat[lk]).toUpperCase(), x + 0.1, 5.38, 1.55, 0.2, { mono: true, size: 6.5, color: C.darkInk3, spacing: 1, bold: true }); txt(s, p[vk], x + 0.1, 5.58, 1.5, 0.48, { size: 7.5, color: C.darkInk2 }); });
    s.addNotes((ci === 0 ? "[COMO USAR] No HTML este slide é um catálogo clicável; no PowerPoint são oito slides, um por primitivo. " : "") + XN.catalog[cur]); });
}

// ================= 24 REUSE (stack) =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.stk.eyebrow, C.green); title(s, D.stk.title, 1.1, 26, false, 12, 1.0);
  img(s, "reuse", ML, 2.25, 12.23, 4.6);
  s.addNotes(note(26)); }

// ================= 25 DIVIDER V =================
divider(5, "V", "part5", C.red).addNotes(note(27));

// ================= 26 LOOP CEILING =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.loop.eyebrow, C.red); title(s, D.loop.title, 1.1, 27, false, 6.2, 1.2);
  [["b1", C.red], ["b2", C.yellow], ["b3", C.blue]].forEach(([k, col], i) => { const y = 2.5 + i * 0.85; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: ML, y: y + 0.05, w: 0.34, h: 0.34, rectRadius: 0.06, fill: { color: col }, line: { type: "none" } }); txt(s, D.loop[k], ML + 0.55, y, 5.5, 0.75, { size: 11, color: C.ink2 }); });
  [["40", D.loop.tTotal, C.red], ["1", D.loop.s1l, C.ink], ["0", D.loop.s2l, C.ink]].forEach(([v, l, col], i) => { const x = ML + i * 1.9; txt(s, v, x, 5.2, 1.7, 0.8, { mono: true, size: 36, bold: true, color: col }); txt(s, l.toUpperCase(), x, 6.0, 1.7, 0.5, { mono: true, size: 7, color: C.ink3, spacing: 1 }); });
  img(s, "loop", 7.0, 2.3, 5.78, 4.3); s.addNotes(note(28)); }

// ================= 27 LOG PATTERNS =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.lp.eyebrow, C.red); title(s, D.lp.title, 1.1, 27, false, 12, 1.0);
  const run2 = (t, o = {}) => run(t, Object.assign({ fontSize: 7.5 }, o));
  const terms = [
    [run2("turn 04  ", { color: C.darkInk3, fontSize: 6.2 }), run2("grep ", { color: C.blue }), run2("\"round\"     → 2.1k tokens"), br(), run2("turn 05  ", { color: C.darkInk3 }), run2("grep ", { color: C.blue }), run2("\"rounding\"  → 2.4k"), br(), run2("turn 06  ", { color: C.darkInk3 }), run2("grep ", { color: C.blue }), run2("\"round_\"    → 2.2k"), br(), run2("turn 07  ", { color: C.darkInk3 }), run2("grep ", { color: C.blue }), run2("\"Round\"     → 2.1k"), br(), run2("turn 08  ", { color: C.darkInk3 }), run2("grep ", { color: C.blue }), run2("\"rounded\"   "), run2("→ 5x a mesma busca", { color: C.red })],
    [run2("turn 02  ", { color: C.darkInk3 }), run2("read ", { color: C.blue }), run2("fee.py       → 6.8k tokens"), br(), run2("turn 05  ", { color: C.darkInk3 }), run2("read ", { color: C.blue }), run2("fee.py       → 6.8k"), br(), run2("turn 09  ", { color: C.darkInk3 }), run2("read ", { color: C.blue }), run2("fee.py       → 6.8k"), br(), run2("turn 12  ", { color: C.darkInk3 }), run2("compaction   "), run2("histórico resumido", { color: C.yellow }), br(), run2("turn 13  ", { color: C.darkInk3 }), run2("read ", { color: C.blue }), run2("fee.py       "), run2("→ 27k só de releitura", { color: C.red })],
    [run2("turn 14  ", { color: C.darkInk3 }), run2("\"vou tentar float\""), br(), run2("turn 15  ", { color: C.darkInk3 }), run2("\"não, centavos\""), br(), run2("turn 16  ", { color: C.darkInk3 }), run2("\"talvez arredondar por parcela\""), br(), run2("turn 17  ", { color: C.darkInk3 }), run2("\"reverti\""), br(), run2("turn 18  ", { color: C.darkInk3 }), run2("\"vou tentar float\"  "), run2("← círculo", { color: C.red })]];
  [C.blue, C.yellow, C.red].forEach((col, i) => { const x = ML + i * 4.13; card(s, x, 2.25, 3.95, 4.3, { noShadow: true });
    label(s, D.lp["k" + (i + 1)], x + 0.2, 2.42, 3.5, col === C.yellow ? C.yellow7 : col === C.red ? C.red7 : C.blue7); txt(s, D.lp["n" + (i + 1)], x + 0.2, 2.65, 3.6, 0.35, { size: 12, bold: true });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 3.1, w: 3.95, h: 1.75, fill: { color: "141414" }, line: { type: "none" } });
    s.addText(terms[i], { x: x + 0.18, y: 3.22, w: 3.65, h: 1.55, fontFace: MONO, fontSize: 7.5, color: "C7C7C2", valign: "top", isTextBox: true, margin: 0, lineSpacingMultiple: 1.35 });
    label(s, D.lp.fix, x + 0.2, 5.0, 3.5, C.green7); txt(s, D.lp["f" + (i + 1)], x + 0.2, 5.22, 3.6, 1.25, { size: 9, color: C.ink2 }); });
  caption(s, D.lp.cap, 6.7, false, CW, 9); s.addNotes(note(29)); }

// ================= 28 HEALTHY LOOP =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.hl.eyebrow, C.yellow7); title(s, D.hl.title, 1.1, 27, false, 12, 1.0);
  const cols = [C.blue, C.green, C.yellow, C.red, C.blue, C.green];
  for (let i = 0; i < 6; i++) { const x = ML + (i % 3) * 4.13, y = 2.25 + Math.floor(i / 3) * 2.05; card(s, x, y, 3.95, 1.9, { top: cols[i], noShadow: true });
    txt(s, D.hl["t" + (i + 1)], x + 0.2, y + 0.2, 3.6, 0.3, { size: 11.5, bold: true }); txt(s, D.hl["d" + (i + 1)], x + 0.2, y + 0.52, 3.6, 0.6, { size: 9, color: C.ink2 });
    s.addShape(pres.shapes.LINE, { x: x + 0.2, y: y + 1.2, w: 3.55, h: 0, line: { color: C.rule2, width: 0.75, dashType: "dash" } });
    label(s, D.hl.wo, x + 0.2, y + 1.27, 2, C.ink3); txt(s, D.hl["w" + (i + 1)], x + 0.2, y + 1.47, 3.6, 0.42, { size: 8.5, color: C.red7 }); }
  caption(s, D.hl.cap, 6.45, false, CW, 9.5); s.addNotes(note(30)); }

// ================= 29 HEALTHY LOOP IN FILES =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.lf.eyebrow, C.green7); title(s, D.lf.title, 1.1, 24, false, 12.2, 0.9);
  const r7 = (t, o = {}) => run(t, Object.assign({ fontSize: 7 }, o)); const j = [r7('{ "version": 1, "hooks": {', {}), br(), r7('  "preToolUse":  [{ "type": "command", "bash": "scripts/hooks/step-budget.sh", "timeoutSec": 5 }],'), br(), r7('  "postToolUse": [{ "matcher": "edit|create", "bash": "pytest -q tests/", "timeoutSec": 120 }],'), br(), r7('  "agentStop":   [{ "bash": "scripts/hooks/must-be-green.sh" }],'), br(), r7('  "preCompact":  [{ "bash": "scripts/hooks/save-state.sh" }]'), br(), r7('} }'), br(), br(),
    r7('# must-be-green.sh (agentStop)', { color: C.darkInk3, italic: true }), br(), r7('# vermelho e stop_hook_active=false → {"decision":"block","reason":"rode pytest e corrija"}', { color: C.darkInk3, italic: true }), br(), r7('# vermelho e stop_hook_active=true  → deixa parar e pergunta (falhar barato)', { color: C.darkInk3, italic: true })];
  const y = [r7('---', { color: C.darkInk3 }), br(), r7('name: ', { color: "9CDCFE" }), r7('fee-implementer'), br(), r7('description: ', { color: "9CDCFE" }), r7(strip(D.lf.desc), { color: "CE9178" }), br(), r7('model: ', { color: "9CDCFE" }), r7("['Claude Haiku 4.5 (copilot)', 'Gemini 3 Flash (Preview) (copilot)']", { color: "CE9178" }), br(),
    r7('tools: ', { color: "9CDCFE" }), r7("['edit', 'read', 'search', 'execute']", { color: "CE9178" }), br(), r7('agents: ', { color: "9CDCFE" }), r7('[]'), br(), r7('hooks:', { color: "9CDCFE" }), br(), r7('  Stop:', { color: "9CDCFE" }), br(), r7('    - type: command'), br(), r7('      command: scripts/hooks/must-be-green.sh'), br(), r7('--- ' + strip(D.lf.body), { color: C.darkInk2 })];
  bigCode(s, ML, 2.05, 6.4, 3.45, "hooks/loop.json · camelCase no GitHub Copilot CLI e cloud agent · PascalCase no VS Code", j); bigCode(s, 7.15, 2.05, 5.63, 3.45, ".github/agents/fee-implementer.agent.md · VS Code · hooks por agente", y);
  const cols = [C.blue, C.green, C.yellow, C.red, C.blue, C.green];
  for (let i = 1; i <= 6; i++) { const x = ML + (i - 1) * 2.06; card(s, x, 5.62, 1.96, 0.88, { top: cols[i - 1], noShadow: true }); txt(s, String(i) + "  " + strip(D.lf["m" + i]), x + 0.12, 5.74, 1.78, 0.25, { size: 8.5, bold: true }); txt(s, D.lf["f" + i], x + 0.12, 6.0, 1.78, 0.42, { mono: true, size: 6.3, color: C.ink3 }); }
  caption(s, D.lf.cap, 6.62, false, CW, 8.5); s.addNotes(note(31)); }

// ================= 29 PRIMITIVES =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.prim.eyebrow, C.blue); title(s, D.prim.title, 1.1, 26, false, 12, 0.7);
  img(s, "metro", ML, 2.0, 12.23, 1.0);
  [["n1", "p1t", "p1b", "tokn", C.blue], ["n2", "p2t", "p2b", "toke", C.green], ["n3", "p3t", "p3b", "toks", C.yellow]].forEach(([n, t, b, k, col], i) => { const x = ML + i * 4.13; card(s, x, 3.2, 3.95, 3.6, { top: col });
    label(s, D.prim[n], x + 0.25, 3.42, 3, col === C.yellow ? C.yellow7 : col === C.green ? C.green7 : C.blue7); txt(s, D.prim[t], x + 0.25, 3.65, 3.5, 0.6, { size: 14, bold: true }); txt(s, D.prim[b], x + 0.25, 4.28, 3.5, 1.15, { size: 9, color: C.ink2 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.25, y: 5.5, w: 3.45, h: 1.1, rectRadius: 0.05, fill: { color: C.greenL }, line: { type: "none" } }); s.addShape(pres.shapes.RECTANGLE, { x: x + 0.25, y: 5.5, w: 0.05, h: 1.1, fill: { color: C.green }, line: { type: "none" } });
    label(s, D.prim.tokLabel, x + 0.42, 5.58, 3, C.green7); txt(s, D.prim[k], x + 0.42, 5.8, 3.2, 0.78, { size: 8.5 }); });
  s.addNotes(note(32)); }

// ================= 30 CLI =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.cli.eyebrow, C.red); title(s, D.cli.title, 1.1, 27, false, 12, 1.0);
  img(s, "cli", ML, 2.25, 8.75, 4.4);
  card(s, 9.55, 2.25, 3.23, 4.4); label(s, D.cli.stateH, 9.75, 2.42, 2.8, C.ink3);
  const nodes = [["orchestrator", D.cli.n0, 0, C.green], ["pre / postToolUse", D.cli.n4, 0, C.red], ["test-writer", "mini", 0.15, C.green], ["fee-implementer", D.cli.n2, 0.15, C.green], ["compliance-auditor", "premium", 0.15, C.green], ["PR #412", D.cli.n5, 0, C.green]];
  nodes.forEach(([n, l, ind, col], i) => { const y = 2.72 + i * 0.44; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 9.75 + ind, y, w: 2.85 - ind, h: 0.36, rectRadius: 0.05, fill: { color: col === C.red ? C.redL : C.greenL }, line: { color: col, width: 0.75 } });
    s.addShape(pres.shapes.OVAL, { x: 9.87 + ind, y: y + 0.12, w: 0.12, h: 0.12, fill: { color: col }, line: { type: "none" } }); txt(s, n, 10.05 + ind, y, 1.6, 0.36, { mono: true, size: 7.5, bold: true, valign: "middle" }); txt(s, String(l).toUpperCase(), 11.2, y, 1.3, 0.36, { mono: true, size: 6.5, color: C.ink3, align: "right", valign: "middle" }); });
  s.addShape(pres.shapes.LINE, { x: 9.75, y: 5.5, w: 2.85, h: 0, line: { color: C.rule2, width: 0.75, dashType: "dash" } }); txt(s, D.cli.foot, 9.75, 5.6, 2.85, 1.0, { size: 8, color: C.ink2 });
  s.addNotes(note(33)); }

// ================= 31 ROUTING =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.rt.eyebrow, C.red); title(s, D.rt.title, 1.1, 27, false, 12, 1.0);
  const segs = [[C.green, C.blue], [C.blue, C.yellow], [C.yellow, C.red]];
  [["7FBA00", 0], ["00A4EF", 1], ["FFB900", 2], ["F25022", 3]].forEach(([c, i]) => s.addShape(pres.shapes.RECTANGLE, { x: ML + i * (CW / 4), y: 2.7, w: CW / 4, h: 0.16, fill: { color: c }, line: { type: "none" } }));
  [["1x", D.rt.t1, C.green7, 0.02], ["13x", D.rt.t2, C.blue7, 0.38], ["42x", D.rt.t3, C.yellow7, 0.70], ["125x", D.rt.t4, C.red7, 0.98]].forEach(([v, l, col, p], i) => { const x = ML + CW * p; s.addShape(pres.shapes.OVAL, { x: x - 0.09, y: 2.67, w: 0.22, h: 0.22, fill: { color: "FFFFFF" }, line: { color: col, width: 2 } });
    const al = i === 0 ? "left" : i === 3 ? "right" : "center"; const bx = i === 0 ? x - 0.1 : i === 3 ? x - 1.9 : x - 1.0;
    txt(s, v, bx, 2.95, 2.0, 0.4, { mono: true, size: 18, bold: true, color: col, align: al }); txt(s, l, bx, 3.33, 2.0, 0.3, { size: 8.5, color: C.ink2, align: al }); });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.2, y: 2.22, w: 0.95, h: 0.36, rectRadius: 0.06, fill: { color: "FFFFFF" }, line: { color: C.rule2, width: 0.75 } }); txt(s, "125x", 6.2, 2.22, 0.95, 0.36, { mono: true, size: 12, bold: true, align: "center", valign: "middle" });

  [["ak", "at", "ab", "an", C.green], ["bk", "bt", "bb", "bn", C.blue], ["ck", "ct", "cb", "cn", C.yellow], ["dk", "dt", "db", "dn", C.red]].forEach(([k, t, b, n, col], i) => { const x = ML + i * 3.1; card(s, x, 3.8, 2.95, 2.3, { top: col });
    label(s, D.rt[k], x + 0.2, 4.0, 2.6, col === C.yellow ? C.yellow7 : col === C.green ? C.green7 : col === C.red ? C.red7 : C.blue7); txt(s, D.rt[t], x + 0.2, 4.22, 2.6, 0.32, { size: 12.5, bold: true }); txt(s, D.rt[b], x + 0.2, 4.55, 2.6, 0.9, { size: 8.5, color: C.ink2 });
    chip(s, D.rt[n], x + 0.2, 5.65, 2.55, col === C.yellow ? C.yellow7 : col === C.green ? C.green7 : col === C.red ? C.red7 : C.blue7, col === C.yellow ? C.yellowL : col === C.green ? C.greenL : col === C.red ? C.redL : C.blueL); });
  caption(s, D.rt.cap, 6.3, false, CW, 9); s.addNotes(note(34)); }

// ================= 33 MODEL ROUTING IN PRACTICE =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.mr.eyebrow, C.blue); title(s, D.mr.title, 1.1, 26, false, 12, 1.0);
  const cols = [C.blue, C.green, C.yellow, C.red]; const colsD = [C.blue7, C.green7, C.yellow7, C.red7];
  for (let i = 1; i <= 4; i++) { const x = ML + (i - 1) * 3.1; card(s, x, 2.25, 2.95, 3.6, { top: cols[i - 1] });
    label(s, D.mr["k" + i], x + 0.2, 2.45, 2.6, colsD[i - 1]); txt(s, D.mr["t" + i], x + 0.2, 2.68, 2.6, 0.35, { size: 12.5, bold: true }); txt(s, D.mr["b" + i], x + 0.2, 3.05, 2.6, 1.6, { size: 8.5, color: C.ink2 });
    s.addShape(pres.shapes.LINE, { x: x + 0.2, y: 4.72, w: 2.55, h: 0, line: { color: C.rule2, width: 0.75, dashType: "dash" } }); label(s, D.mr.wl, x + 0.2, 4.8, 2, colsD[i - 1]); txt(s, D.mr["w" + i], x + 0.2, 5.0, 2.6, 0.8, { size: 8.5 }); }
  ["c1", "c2", "c3", "c4"].forEach((k, i) => { const w = [2.35, 3.05, 3.9, 2.85][i]; const x = ML + [0, 2.42, 5.55, 9.52][i]; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 6.0, w, h: 0.28, rectRadius: 0.05, fill: { color: C.greenL }, line: { type: "none" } }); txt(s, D.mr[k], x + 0.08, 6.0, w - 0.16, 0.28, { mono: true, size: 6.5, color: C.green7, bold: true, valign: "middle" }); });
  caption(s, D.mr.cap, 6.42, false, CW, 9); s.addNotes(note(35)); }

// ================= 32 PR =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.pr.eyebrow, C.green); title(s, D.pr.title, 1.1, 26, false, 4.6, 1.5);
  txt(s, D.pr.desc, ML, 2.75, 4.2, 1.4, { size: 10, color: C.ink2 });
  [["4 / 4", D.pr.s1, C.green7], ["4 min", D.pr.s2, C.blue7], ["35 mil", D.pr.s3, C.yellow7]].forEach(([v, l, col], i) => { const y = 4.25 + i * 0.85; s.addShape(pres.shapes.LINE, { x: ML, y, w: 4.2, h: 0, line: { color: C.rule, width: 0.75 } }); txt(s, v, ML, y + 0.08, 4.2, 0.4, { mono: true, size: 20, bold: true, color: col }); txt(s, l, ML, y + 0.48, 4.2, 0.3, { size: 8.5, color: C.ink2 }); });
  img(s, "pr", 5.15, 1.95, 7.65, 4.35); s.addNotes(note(36)); }

// ================= 33 OTEL =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.ot.eyebrow, C.blue); title(s, D.ot.title, 1.1, 27, false, 12, 1.0);
  const code = [run(strip(D.ot.c1), { italic: true, color: C.darkInk3, fontSize: 9 }), br(), run("\"github.copilot.telemetry.otel.enabled\"", { color: "9CDCFE", fontSize: 9 }), run(": ", { fontSize: 9 }), run("true", { color: C.blue, fontSize: 9 }), run(",", { fontSize: 9 }), br(),
    run("\"github.copilot.telemetry.otel.endpoint\"", { color: "9CDCFE", fontSize: 9 }), run(": ", { fontSize: 9 }), run("\"https://otel-collector.btg.internal\"", { color: "CE9178", fontSize: 9 }), run(",", { fontSize: 9 }), br(),
    run("\"github.copilot.telemetry.otel.captureContent\"", { color: "9CDCFE", fontSize: 9 }), run(": ", { fontSize: 9 }), run("false", { color: C.blue, fontSize: 9 }), br(), br(), run(strip(D.ot.c2), { italic: true, color: C.darkInk3, fontSize: 9 })];
  bigCode(s, ML, 2.25, 6.3, 2.75, "settings.json · VS Code", code);
  ["gen_ai.system", "gen_ai.request.model", "gen_ai.usage.input_tokens", "gen_ai.usage.output_tokens", "gen_ai.usage.cache_read_tokens", "gen_ai.tool.name", "gen_ai.agent.name"].forEach((a, i) => { const x = ML + (i % 3) * 2.1, y = 5.2 + Math.floor(i / 3) * 0.36; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 2.0, h: 0.28, rectRadius: 0.05, fill: { color: C.blueL }, line: { type: "none" } }); txt(s, a, x + 0.06, y, 1.9, 0.28, { mono: true, size: 7, color: C.blue7, valign: "middle", bold: true }); });
  [D.ot.dest, "Grafana", "Application Insights", "Langfuse"].forEach((d, i) => { const x = ML + [0, 1.45, 2.35, 4.15][i]; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 6.35, w: [1.35, 0.8, 1.7, 1.0][i], h: 0.28, rectRadius: 0.14, fill: { color: C.paper }, line: { color: C.rule2, width: 0.75 } }); txt(s, d, x, 6.35, [1.35, 0.8, 1.7, 1.0][i], 0.28, { mono: true, size: 7.5, align: "center", valign: "middle", color: C.ink2 }); });
  [["b1h", "b1"], ["b2h", "b2"]].forEach(([h, b], i) => { const y = 2.25 + i * 1.45; card(s, 7.1, y, 5.68, 1.3, { noShadow: true }); label(s, D.ot[h], 7.3, y + 0.15, 5.3); txt(s, D.ot[b], 7.3, y + 0.38, 5.3, 0.9, { size: 9.5, color: C.ink }); });
  [["p1k", "p1", C.green], ["p2k", "p2", C.red]].forEach(([k, b, col], i) => { const x = 7.1 + i * 2.9; card(s, x, 5.2, 2.78, 1.55, { top: col, noShadow: true }); label(s, D.ot[k], x + 0.18, 5.4, 2.5, col === C.green ? C.green7 : C.red7); txt(s, D.ot[b], x + 0.18, 5.62, 2.45, 1.1, { size: 8, color: C.ink2 }); });
  s.addNotes(note(37)); }

// ================= 34 DASHBOARD =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.ds.eyebrow, C.blue); title(s, D.ds.title, 1.1, 27, false, 12, 1.0);
  img(s, "dash", ML, 2.25, 6.75, 3.95);
  ["u1", "u2", "u3", "u4", "u5"].forEach((u, i) => { const y = 2.25 + i * 0.66; const hi = u === "u3"; card(s, 7.6, y, 5.18, 0.56, { noShadow: true, line: hi ? C.green : C.rule, fill: hi ? C.greenL : C.paper }); s.addShape(pres.shapes.RECTANGLE, { x: 7.6, y: y + 0.06, w: 0.05, h: 0.44, fill: { color: hi ? C.green : C.rule2 }, line: { type: "none" } });
    txt(s, String(i + 1), 7.78, y + 0.08, 0.35, 0.4, { mono: true, size: 12, bold: true, color: hi ? C.green7 : C.ink3, valign: "middle" }); label(s, D.unit[u + "k"], 8.15, y + 0.08, 4.5, hi ? C.green7 : C.ink3); txt(s, D.unit[u], 8.15, y + 0.27, 4.55, 0.28, { size: 9, valign: "middle" }); });
  s.addText(strip(D.ds.cap), { x: 7.6, y: 5.75, w: 5.18, h: 0.7, fontFace: SANS, fontSize: 9, italic: true, color: C.ink2, valign: "top", isTextBox: true, margin: 0 }); s.addNotes(note(38)); }
// fix caption x for dash slide (right column)
// (kept simple: caption spans left; acceptable)

// ================= 37 THE LIMITS =================
{ const s = pres.addSlide(); header(s); s.background = { color: C.paper };
  eyebrow(s, D.lim.eyebrow, C.red7); title(s, D.lim.title, 1.1, 26, false, 12, 1.0);
  const cols = [C.red, C.yellow, C.blue, C.green];
  for (let i = 1; i <= 4; i++) { const x = ML + (i - 1) * 3.1; card(s, x, 2.25, 2.95, 3.7, { fill: C.bg, noShadow: true }); s.addShape(pres.shapes.RECTANGLE, { x, y: 2.35, w: 0.06, h: 3.5, fill: { color: cols[i - 1] }, line: { type: "none" } });
    txt(s, D.lim["t" + i], x + 0.25, 2.5, 2.55, 0.5, { size: 13, bold: true }); txt(s, D.lim["b" + i], x + 0.25, 3.05, 2.55, 1.9, { size: 9, color: C.ink2 });
    s.addShape(pres.shapes.LINE, { x: x + 0.25, y: 5.05, w: 2.5, h: 0, line: { color: C.rule2, width: 0.75, dashType: "dash" } }); label(s, D.lim.sl, x + 0.25, 5.12, 2, C.ink3); txt(s, D.lim["s" + i], x + 0.25, 5.32, 2.55, 0.55, { size: 9.5, color: C.red7, bold: true }); }
  caption(s, D.lim.cap, 6.2, false, CW, 10); s.addNotes(note(39)); }

// ================= 35 DIVIDER VI =================
divider(6, "VI", "part6", C.green).addNotes(note(40));

// ================= 36 REPRISE =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.again.eyebrow, C.green); title(s, D.again.title, 1.1, 28, false, 7, 1.2);
  txt(s, D.again.lead, ML, 2.55, 6.2, 1.5, { size: 12, color: C.ink });
  card(s, ML, 4.15, 6.2, 1.25, { noShadow: true }); s.addShape(pres.shapes.RECTANGLE, { x: ML, y: 4.25, w: 0.05, h: 1.05, fill: { color: C.green }, line: { type: "none" } }); txt(s, D.again.promise, ML + 0.25, 4.25, 5.8, 1.1, { size: 9.5, color: C.ink2 });
  const strip4 = [[D.again.b1, "19", D.again.b1n], [D.again.b2, "40", "4"], [D.again.b3, D.again.b3o, D.again.b3n], [D.again.b4, D.again.b4o, "#412"]];
  const sw = [1.25, 1.25, 1.85, 1.65]; const sx = [ML, ML + 1.35, ML + 2.7, ML + 4.65];
  strip4.forEach(([k, o, n], i) => { const x = sx[i]; card(s, x, 5.6, sw[i], 0.8, { noShadow: true }); label(s, k, x + 0.12, 5.68, sw[i] - 0.2);
    s.addText([{ text: o, options: { fontFace: MONO, fontSize: 10, color: C.red7, strike: "sngStrike" } }, { text: "  →  ", options: { fontFace: MONO, fontSize: 9, color: C.ink3 } }, { text: n, options: { fontFace: MONO, fontSize: 12, bold: true, color: C.green7 } }], { x: x + 0.12, y: 5.92, w: sw[i] - 0.2, h: 0.4, isTextBox: true, margin: 0, valign: "middle" }); });
  const tl = [["09:00", "t1", C.blue], ["09:01", "t2", C.yellow], ["09:02", "t3", C.red], ["09:04", "t4", C.green]];
  tl.forEach(([t, k, col], i) => { const y = 2.6 + i * 1.0; txt(s, t, 7.3, y, 0.7, 0.3, { mono: true, size: 9.5, color: C.ink3, valign: "middle" }); s.addShape(pres.shapes.OVAL, { x: 8.05, y: y + 0.08, w: 0.14, h: 0.14, fill: { color: col }, line: { type: "none" } });
    if (i < 3) s.addShape(pres.shapes.LINE, { x: 8.12, y: y + 0.28, w: 0, h: 0.6, line: { color: C.rule2, width: 0.75 } });
    const parts = strip(D.again[k]).split("\n"); txt(s, parts[0], 8.35, y - 0.02, 4.45, 0.36, { size: 10, bold: i === 3, color: i === 3 ? C.green7 : C.ink, valign: "top" }); if (parts[1]) txt(s, parts[1], 8.35, y + 0.4, 4.45, 0.3, { size: 8, color: C.ink3 }); });
  s.addNotes(note(41)); }

// ================= 37 ROADMAP =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.road.eyebrow, C.green); title(s, D.road.title, 1.1, 27, false, 12, 1.0);
  [D.road.d0, D.road.d30, D.road.d60, D.road.d90].forEach((d, i) => txt(s, d, i === 3 ? ML + CW - 1.2 : ML + i * 4.13, 2.35, 1.2, 0.25, { mono: true, size: 8, color: C.ink3, spacing: 1, align: i === 3 ? "right" : "left" }));
  [["p1", "t1", "a1", "m1", C.red], ["p2", "t2", "a2", "m2", C.yellow], ["p3", "t3", "a3", "m3", C.green]].forEach(([p, t, a, m, col], i) => { const x = ML + i * 4.13; card(s, x, 2.7, 3.95, 3.6, { top: col });
    label(s, D.road[p], x + 0.25, 2.95, 3, col === C.yellow ? C.yellow7 : col === C.green ? C.green7 : C.red7); txt(s, D.road[t], x + 0.25, 3.18, 3.5, 0.4, { size: 14, bold: true }); txt(s, D.road[a], x + 0.25, 3.62, 3.5, 1.9, { size: 10, color: C.ink2, lh: 1.3 });
    txt(s, D.road[m].toUpperCase(), x + 0.25, 5.55, 3.5, 0.3, { mono: true, size: 7, color: C.ink3, spacing: 1 }); s.addShape(pres.shapes.RECTANGLE, { x: x + 0.25, y: 5.95, w: 3.45, h: 0.1, fill: { color: "ECECE8" }, line: { type: "none" } }); s.addShape(pres.shapes.RECTANGLE, { x: x + 0.25, y: 5.95, w: 3.45 * (i + 1) / 3, h: 0.1, fill: { color: col }, line: { type: "none" } }); });
  s.addNotes(note(42)); }

// ================= 38 ASSESSMENT =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.asm.eyebrow, C.green); title(s, D.asm.title, 1.1, 27, false, 12, 1.0);
  const cols = [C.ink3, C.blue, C.green, C.yellow, C.red];
  for (let i = 1; i <= 5; i++) { const y = 2.3 + (i - 1) * 0.8; card(s, ML, y, 7.0, 0.68, { noShadow: true }); txt(s, String(i), ML + 0.2, y + 0.1, 0.4, 0.48, { mono: true, size: 14, bold: true, color: cols[i - 1], valign: "middle" }); txt(s, D.asm["q" + i], ML + 0.65, y + 0.08, 4.9, 0.52, { size: 9.5, valign: "middle" });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: ML + 5.7, y: y + 0.17, w: 1.1, h: 0.34, rectRadius: 0.17, fill: { color: "FFFFFF" }, line: { color: C.rule2, width: 0.75 } }); txt(s, D.asm.no.toUpperCase(), ML + 5.7, y + 0.17, 0.55, 0.34, { mono: true, size: 7.5, color: C.ink3, align: "center", valign: "middle", bold: true }); txt(s, D.asm.yes.toUpperCase(), ML + 6.25, y + 0.17, 0.55, 0.34, { mono: true, size: 7.5, color: C.ink3, align: "center", valign: "middle", bold: true }); }
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.85, y: 2.3, w: 4.93, h: 4.35, rectRadius: 0.1, fill: { color: C.code }, line: { type: "none" }, shadow: shadow() });
  label(s, D.asm.lvl, 8.1, 2.5, 4.5, C.darkInk3); txt(s, "Prompt → Contexto → Harness → Loop → Graph", 8.1, 2.75, 4.5, 0.3, { mono: true, size: 9, color: C.darkInk });
  [C.ink3, C.blue, C.green, C.yellow, C.red].forEach((c, i) => s.addShape(pres.shapes.RECTANGLE, { x: 8.1 + i * 0.9, y: 3.1, w: 0.82, h: 0.1, fill: { color: c }, line: { type: "none" } }));
  txt(s, strip(D.asm.wait).toUpperCase(), 8.1, 3.3, 4.5, 0.25, { mono: true, size: 7, color: C.darkInk3, spacing: 1 });
  label(s, D.asm.nextLabel + " · um NÃO por pergunta", 8.1, 3.65, 4.5, C.yellow);
  [D.asm.n0, D.asm.n1, D.asm.n2, D.asm.n3, D.asm.n4].forEach((n, i) => { const y = 3.9 + i * 0.5; txt(s, String(i + 1), 8.1, y, 0.3, 0.45, { mono: true, size: 10, bold: true, color: cols[i], valign: "top" }); txt(s, n, 8.4, y, 4.2, 0.48, { size: 7.5, color: C.darkInk2, lh: 1.15 }); });
  txt(s, D.asm.hint, 8.1, 6.35, 4.5, 0.3, { mono: true, size: 6.5, color: C.darkInk3 });
  s.addNotes(note(43)); }

// ================= 39 FIVE SENTENCES =================
{ const s = pres.addSlide(); header(s);
  eyebrow(s, D.plain.eyebrow, C.blue); title(s, D.plain.title, 1.1, 30, false, 12, 0.7);
  const cols = [C.red, C.yellow, C.green, C.blue, C.red];
  for (let i = 1; i <= 5; i++) { const y = 2.05 + (i - 1) * 0.72; txt(s, String(i), ML, y, 0.5, 0.6, { mono: true, size: 20, bold: true, color: cols[i - 1], valign: "middle" }); txt(s, D.plain["s" + i], ML + 0.75, y, 11.4, 0.62, { size: 12.5, valign: "middle" }); }
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: ML, y: 5.85, w: CW, h: 0.9, rectRadius: 0.06, fill: { color: C.code }, line: { type: "none" } });
  const m = strip(D.plain.marina); s.addText([{ text: m, options: { color: C.darkInk } }], { x: ML + 0.3, y: 5.85, w: CW - 0.6, h: 0.9, fontFace: SANS, fontSize: 12, valign: "middle", isTextBox: true, margin: 0 });
  s.addNotes(note(44)); }

// ================= 40 CLOSING =================
{ const s = pres.addSlide(); header(s, true);
  txt(s, D.closing.title, ML, 1.6, 12.2, 2.0, { size: 44, color: C.darkInk });
  txt(s, D.closing.tag, ML, 3.7, 12, 0.5, { size: 15, italic: true, color: C.darkInk2 });
  label(s, D.closing.contactLabel, ML, 4.55, 3, C.darkInk3); txt(s, "Paula Silva", ML, 4.8, 3, 0.35, { size: 15, bold: true, color: C.darkInk }); txt(s, "Developer Solutions Advisor · Data & AI, Latam Leader, Global Black Belt at Microsoft Americas", ML, 5.15, 3.2, 0.7, { size: 9.5, color: C.darkInk2 }); txt(s, "paulasilva@microsoft.com", ML, 5.9, 3, 0.3, { size: 10, color: C.blue });
  label(s, D.closing.nextLabel, 4.4, 4.55, 4, C.darkInk3); txt(s, D.closing.nextTitle, 4.4, 4.8, 8.3, 0.35, { size: 15, bold: true, color: C.darkInk }); txt(s, D.closing.nextSub, 4.4, 5.15, 8.3, 0.8, { size: 10, color: C.darkInk2 });
  s.addNotes(note(45)); }

pres.writeFile({ fileName: OUT }).then(() => console.log("written", OUT));
