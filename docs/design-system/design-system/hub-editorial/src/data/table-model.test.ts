import { describe, expect, it } from "vitest";
import { filterAndSortRows, pageRows, sampleRows } from "./table-model";

describe("table model", () => {
  it("matches accents and casing without changing source data", () => {
    const before = [...sampleRows];
    expect(filterAndSortRows(sampleRows, " ICOnES ", "name", "asc").map(row => row.id)).toEqual(["demo-03"]);
    expect(sampleRows).toEqual(before);
  });
  it("sorts numeric values numerically, retaining zero", () => {
    const values = filterAndSortRows(sampleRows, "", "items", "desc").map(row => row.items);
    expect(values).toEqual([12, 10, 8, 6, 5, 4, 3, 0]);
  });
  it("returns an empty collection for a nonmatching query", () => {
    expect(filterAndSortRows(sampleRows, "not-present", "name", "asc")).toEqual([]);
  });
  it("clamps a page after filtering and handles an empty dataset", () => {
    expect(pageRows(sampleRows, 20, 5)).toMatchObject({ currentPage: 2, pages: 2 });
    expect(pageRows([], 3, 5)).toEqual({ rows: [], currentPage: 1, pages: 1 });
  });
  it("rejects invalid pagination rather than returning misleading results", () => {
    expect(() => pageRows(sampleRows, 1, 0)).toThrow(RangeError);
    expect(() => pageRows(sampleRows, -1, 5)).toThrow(RangeError);
  });
});
