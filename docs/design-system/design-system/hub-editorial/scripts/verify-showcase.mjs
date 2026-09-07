import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve, sep } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { XMLValidator } from "fast-xml-parser";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const build = join(root, "dist");
const results = join(root, "test-results");
const selectedFamily = process.argv.find(value => value.startsWith("--family="))?.slice("--family=".length);
assert(existsSync(join(build, "index.html")), "Execute npm run build:all antes da verificação.");
mkdirSync(results, { recursive: true });
const report = { status: "incomplete", started: new Date().toISOString(), family: selectedFamily ?? "all", catalog: [], checks: [], screenshots: [], downloads: [], browserErrors: [], externalRequests: [] };
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png", ".txt": "text/plain" };
const server = createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
  } catch (error) {
    if (!(error instanceof URIError)) throw error;
    response.writeHead(400).end("Invalid URL");
    return;
  }
  let target = resolve(build, `.${pathname}`);
  if (target !== build && !target.startsWith(`${build}${sep}`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  if (existsSync(target) && statSync(target).isDirectory()) target = join(target, "index.html");
  if (!existsSync(target) || !statSync(target).isFile()) {
    response.writeHead(404).end("Not found");
    return;
  }
  response.setHeader("Content-Type", mime[extname(target)] ?? "application/octet-stream");
  createReadStream(target).on("error", error => response.destroy(error)).pipe(response);
});

await new Promise((ready, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", ready); });
const address = server.address();
assert(address && typeof address === "object");
const origin = `http://127.0.0.1:${address.port}`;
assert.equal((await fetch(origin)).status, 200);
let browser;
let page;

function luminance(color) {
  let channels;
  if (color.trim().startsWith("#")) {
    channels = color.trim().slice(1).match(/.{2}/g).map(part => parseInt(part, 16) / 255);
  } else {
    channels = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => value / 255);
  }
  const linear = channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

async function assertLayout(label) {
  const layout = await page.evaluate(() => ({
    viewport: innerWidth,
    width: document.documentElement.scrollWidth,
    h1: document.querySelectorAll("main h1").length,
    invalidSvg: [...document.querySelectorAll(".he-preview-frame svg")].some(svg => /(?:NaN|Infinity)/.test(svg.outerHTML)),
  }));
  assert(layout.width <= layout.viewport + 1, `${label}: overflow ${layout.width}/${layout.viewport}`);
  assert.equal(layout.h1, 1, `${label}: expected one H1`);
  assert.equal(layout.invalidSvg, false, `${label}: invalid SVG geometry`);
}

async function visit(key) {
  await page.goto(`${origin}/#${key}`);
  await page.locator(`[data-entry-key="${key}"]`).waitFor();
  await page.evaluate(() => document.fonts.ready);
}

async function saveScreenshot(name) {
  await page.screenshot({ path: join(results, name), fullPage: true, animations: "disabled" });
  report.screenshots.push(name);
}

async function downloadFrom(button, label) {
  const pending = page.waitForEvent("download");
  await button.click();
  const download = await pending;
  const filename = download.suggestedFilename();
  const target = join(results, filename);
  await download.saveAs(target);
  report.downloads.push({ label, filename });
  return readFileSync(target, "utf8");
}

try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", acceptDownloads: true });
  await context.route("**/*", route => {
    const url = route.request().url();
    if (/^https?:/.test(url) && new URL(url).origin !== origin) {
      report.externalRequests.push(url);
      return route.abort();
    }
    return route.continue();
  });
  page = await context.newPage();
  page.setDefaultTimeout(8000);
  page.on("pageerror", error => report.browserErrors.push(error.message));
  page.on("console", message => { if (message.type() === "error") report.browserErrors.push(message.text()); });
  await page.goto(origin);
  await page.locator(".he-studio-hero").waitFor();
  await page.evaluate(() => document.fonts.ready);
  const fontStatus = await page.evaluate(() => [...document.fonts].filter(font => font.family.startsWith("HE ")).map(font => ({ family: font.family, status: font.status })));
  assert.equal(fontStatus.length, 2, "Both local font faces must be available");
  assert(fontStatus.every(font => font.status === "loaded"), "Both local fonts must load");
  report.checks.push({ name: "local-fonts", result: "pass", fonts: fontStatus });
  report.catalog = await page.locator(".he-studio-sidebar [data-catalog-key]").evaluateAll(links => links.map(link => ({ key: link.dataset.catalogKey, group: link.dataset.catalogGroup, label: link.textContent.trim() })));
  assert(new Set(report.catalog.map(entry => entry.key)).size === report.catalog.length, "Catalog keys must be unique");
  await assertLayout("overview");
  await saveScreenshot("showcase-desktop.png");

  const entries = report.catalog.filter(entry => !selectedFamily || entry.group === selectedFamily);
  assert(entries.length > 0, `No entries for family ${selectedFamily}`);
  for (const theme of ["light", "dark"]) {
    if (theme === "dark") await page.getByRole("button", { name: "Ativar tema escuro" }).click();
    for (const viewport of [1440, 375, 320]) {
      await page.setViewportSize({ width: viewport, height: 1000 });
      for (const entry of entries) {
        await visit(entry.key);
        await assertLayout(`${entry.key}/${theme}/${viewport}`);
      }
      report.checks.push({ name: "all-catalog-layouts", theme, viewport, entries: entries.length, result: "pass" });
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await visit("fundamentos/colors");
    const tokens = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return Object.fromEntries(["ink", "ink-2", "muted", "bg", "bg-alt", "paper", "red-ink", "green-ink", "blue-ink", "yellow-ink"].map(name => [name, style.getPropertyValue(`--he-${name}`).trim()]));
    });
    for (const foreground of ["ink", "ink-2", "muted", "red-ink", "green-ink", "blue-ink", "yellow-ink"]) {
      for (const background of ["bg", "bg-alt", "paper"]) {
        assert(contrast(tokens[foreground], tokens[background]) >= 4.5, `Contrast: ${foreground}/${background}/${theme}`);
      }
    }
    report.checks.push({ name: "semantic-text-contrast", theme, pairs: 21, result: "pass" });
  }
  await page.getByRole("button", { name: "Ativar tema claro" }).click();

  if (!selectedFamily || selectedFamily === "dados") {
    await visit("dados/table");
    const search = page.getByLabel("Buscar recursos", { exact: true });
    await search.fill("ICOnES");
    assert.equal(await page.locator(".he-table tbody tr").count(), 1);
    assert.match(await page.locator(".he-table tbody").innerText(), /Catálogo de ícones/);
    await search.fill("not-found-anywhere");
    await page.getByText("Nenhum recurso encontrado.", { exact: false }).waitFor();
    await page.getByRole("button", { name: "Limpar busca", exact: true }).click();
    await page.getByRole("button", { name: "Itens", exact: true }).click();
    assert.equal((await page.locator(".he-table tbody tr").first().innerText()).trim().endsWith("0"), true);
    await page.getByLabel("Selecionar todas as linhas visíveis").check();
    assert.match(await page.locator(".he-table-footer").innerText(), /5 selecionados/);
    await page.getByRole("button", { name: "Próxima", exact: true }).click();
    assert.match(await page.locator(".he-table-footer").innerText(), /Página 2 de 2/);
    report.checks.push({ name: "table-search-sort-selection-pagination", result: "pass" });
  }

  if (!selectedFamily || selectedFamily === "componentes") {
    await visit("componentes/tabs");
    const firstTab = page.getByRole("tab", { name: "Visão geral", exact: true });
    await firstTab.focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.getByRole("tab", { name: "Uso", exact: true }).getAttribute("aria-selected"), "true");
    await page.keyboard.press("End");
    assert.equal(await page.getByRole("tab", { name: "Acessibilidade", exact: true }).getAttribute("aria-selected"), "true");
    await visit("componentes/dialog");
    const opener = page.getByRole("button", { name: "Abrir dialog", exact: true });
    await opener.click();
    assert.equal(await page.getByRole("dialog", { name: "Confirmar exemplo" }).isVisible(), true);
    await page.keyboard.press("Escape");
    assert.equal(await opener.evaluate(element => element === document.activeElement), true);
    await visit("componentes/toast");
    await page.getByRole("button", { name: "Mostrar notificação" }).click();
    await page.getByRole("button", { name: "Dispensar notificação" }).click();
    assert.equal(await page.locator(".he-toast").count(), 0);
    report.checks.push({ name: "tabs-dialog-focus-toast", result: "pass" });
  }

  await page.setViewportSize({ width: 375, height: 900 });
  await page.getByRole("button", { name: "Abrir catálogo", exact: true }).click();
  const mobileNav = page.getByRole("dialog", { name: "Navegar no catálogo" });
  await mobileNav.getByRole("searchbox").fill("Diagrama");
  assert(await mobileNav.locator("[data-catalog-key]").count() > 0);
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("button", { name: "Abrir catálogo", exact: true }).evaluate(element => element === document.activeElement), true);
  await page.goto(`${origin}/#visao-geral`);
  await page.locator(".he-studio-hero").waitFor();
  await saveScreenshot("showcase-mobile.png");
  report.checks.push({ name: "mobile-navigation-search-escape", result: "pass" });

  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const family of ["graficos", "arquitetura", "ilustracoes"]) {
    if (selectedFamily && selectedFamily !== family) continue;
    const entry = report.catalog.find(item => item.group === family);
    assert(entry, `Missing ${family} family`);
    await visit(entry.key);
    const button = page.getByRole("button", { name: /(?:baixar|exportar).*svg/i }).first();
    const svg = await downloadFrom(button, family);
    assert.equal(XMLValidator.validate(svg), true, `${family}: valid SVG XML`);
    assert(svg.includes("<svg"), `${family}: SVG root`);
    assert(!/var\(--/.test(svg), `${family}: unresolved CSS custom property`);
    assert(!/(?:href|src)=["']https?:\/\//.test(svg), `${family}: external image dependency`);
    if (family === "arquitetura") {
      const drawio = await downloadFrom(page.getByRole("button", { name: /(?:baixar|exportar).*draw[.]?io/i }).first(), "drawio");
      assert.equal(XMLValidator.validate(drawio), true, "valid editable drawio XML");
      assert(drawio.includes("<mxGraphModel") && drawio.includes('<mxCell id="0"'), "editable drawio structure");
    }
    report.checks.push({ name: "vector-download", family, result: "pass" });
    await saveScreenshot(`${family}-desktop.png`);
  }

  const require = createRequire(import.meta.url);
  const addonRequire = createRequire(require.resolve("@storybook/addon-a11y/package.json"));
  const axePath = addonRequire.resolve("axe-core/axe.min.js");
  for (const key of ["fundamentos/colors", "componentes/fields", "componentes/tabs", "dados/table"]) {
    if (selectedFamily && !key.startsWith(`${selectedFamily}/`)) continue;
    await visit(key);
    await page.addScriptTag({ path: axePath });
    const violations = await page.evaluate(async () => {
      const result = await window.axe.run(document.querySelector(".he-studio-main"), { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] } });
      return result.violations.map(violation => ({ id: violation.id, impact: violation.impact, description: violation.description, nodes: violation.nodes.map(node => node.target) }));
    });
    assert.equal(violations.length, 0, `Accessibility ${key}: ${JSON.stringify(violations)}`);
    report.checks.push({ name: "axe-core", key, result: "pass" });
  }

  const storyIndexPath = join(build, "storybook", "index.json");
  assert(existsSync(storyIndexPath), "Build do Storybook ausente: execute npm run build-storybook.");
  const storyIndex = JSON.parse(readFileSync(storyIndexPath, "utf8"));
  const stories = Object.values(storyIndex.entries).filter(entry => entry.type === "story");
  assert(stories.length > 0, "Storybook must contain indexed stories");
  if (!selectedFamily) {
    for (const story of stories) {
      await page.goto(`${origin}/storybook/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`);
      await page.locator(".he-story-surface").waitFor();
      assert.equal(await page.locator(".sb-errordisplay").isVisible(), false, `Story failed: ${story.id}`);
    }
    report.checks.push({ name: "storybook-story-smoke", count: stories.length, result: "pass" });
  }

  assert.deepEqual(report.externalRequests, [], "Runtime must not depend on external HTTP services");
  assert.deepEqual(report.browserErrors, [], "Runtime must not produce browser errors");
  report.status = "passed";
  console.log(JSON.stringify({ status: report.status, entries: entries.length, stories: stories.length, checks: report.checks.length, downloads: report.downloads, results }, null, 2));
} finally {
  if (report.status !== "passed" && page && !page.isClosed()) {
    await page.screenshot({ path: join(results, "incomplete-check.png"), fullPage: true, animations: "disabled" });
  }
  report.finished = new Date().toISOString();
  writeFileSync(join(results, "verification.json"), `${JSON.stringify(report, null, 2)}\n`);
  if (browser) await browser.close();
  await new Promise(done => server.close(done));
}
