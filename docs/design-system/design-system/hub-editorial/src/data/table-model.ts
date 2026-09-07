export interface ResourceRow {
  id: string;
  name: string;
  format: string;
  status: "Rascunho" | "Em revisão" | "Pronto";
  items: number;
}
export type SortColumn = "name" | "format" | "status" | "items";
export type SortDirection = "asc" | "desc";

export const sampleRows: readonly ResourceRow[] = [
  { id: "demo-01", name: "Arquitetura de referência", format: "Diagrama", status: "Em revisão", items: 6 },
  { id: "demo-02", name: "Guia de componentes", format: "Artigo", status: "Pronto", items: 12 },
  { id: "demo-03", name: "Catálogo de ícones", format: "SVG", status: "Rascunho", items: 8 },
  { id: "demo-04", name: "Fluxo de publicação", format: "Diagrama", status: "Pronto", items: 4 },
  { id: "demo-05", name: "Padrões de formulário", format: "Artigo", status: "Em revisão", items: 10 },
  { id: "demo-06", name: "Cenário de demonstração", format: "Simulação", status: "Rascunho", items: 3 },
  { id: "demo-07", name: "Checklist de revisão", format: "Lista", status: "Pronto", items: 0 },
  { id: "demo-08", name: "Estados de interface", format: "Artigo", status: "Em revisão", items: 5 },
];

export function normalizeQuery(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("pt-BR").trim();
}

export function filterAndSortRows(rows: readonly ResourceRow[], query: string, column: SortColumn, direction: SortDirection) {
  const normalized = normalizeQuery(query);
  return rows.filter(row => normalizeQuery(`${row.name} ${row.format} ${row.status}`).includes(normalized))
    .sort((left, right) => {
      const a = left[column];
      const b = right[column];
      const compared = typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b), "pt-BR", { sensitivity: "base" });
      return direction === "asc" ? compared : -compared;
    });
}

export function pageRows<T>(rows: readonly T[], page: number, size: number) {
  if (!Number.isInteger(size) || size < 1 || !Number.isInteger(page) || page < 1) {
    throw new RangeError("Página e tamanho devem ser inteiros positivos.");
  }
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const currentPage = Math.min(page, pages);
  return { rows: rows.slice((currentPage - 1) * size, currentPage * size), currentPage, pages };
}
