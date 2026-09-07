import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Badge, Button, PrimitiveDemo, Tabs, primitiveCatalog } from "./Primitives";
import { FoundationDemo, foundationCatalog } from "../foundations/Foundations";
import { DataDemo, dataCatalog } from "../data/Data";

describe("editorial component contracts", () => {
  it("uses native disabled and busy states for a busy button", () => {
    const html = renderToStaticMarkup(<Button busy variant="primary">Amostra</Button>);
    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("he-button--primary");
  });
  it("retains readable text for semantic states", () => {
    expect(renderToStaticMarkup(<Badge tone="danger">Erro explícito</Badge>)).toContain("Erro explícito");
  });
  it("associates tabs and panels and exposes only the active tab in the tab order", () => {
    const html = renderToStaticMarkup(<Tabs items={[{ label: "Um", content: "Primeiro" }, { label: "Dois", content: "Segundo" }]} />);
    expect(html.match(/role="tab"/g)).toHaveLength(2);
    expect(html.match(/role="tabpanel"/g)).toHaveLength(2);
    expect(html.match(/aria-selected="true"/g)).toHaveLength(1);
    expect(html).toContain('tabindex="-1"');
    expect(html).toContain('aria-labelledby=');
  });
  it("renders every core catalog entry with a descriptive heading", () => {
    for (const item of primitiveCatalog) expect(renderToStaticMarkup(<PrimitiveDemo kind={item.id} />)).toContain(item.label);
    for (const item of foundationCatalog) expect(renderToStaticMarkup(<FoundationDemo kind={item.id} />)).toContain(item.label);
    for (const item of dataCatalog) expect(renderToStaticMarkup(<DataDemo kind={item.id} />)).toContain(item.label);
  });
  it("has stable unique identifiers within each family", () => {
    for (const items of [primitiveCatalog, foundationCatalog, dataCatalog]) {
      expect(new Set(items.map(item => item.id)).size).toBe(items.length);
    }
  });
});
