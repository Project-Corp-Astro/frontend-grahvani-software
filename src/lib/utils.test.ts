import { describe, it, expect } from "vitest";
import { cn, parseDMS, formatPlanetDegree } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("deduplicates tailwind classes", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });
});

describe("parseDMS", () => {
  it("returns null for null/undefined", () => {
    expect(parseDMS(null)).toBeNull();
    expect(parseDMS(undefined)).toBeNull();
  });

  it("returns number as-is", () => {
    expect(parseDMS(45.5)).toBe(45.5);
  });

  it("returns null for NaN number", () => {
    expect(parseDMS(NaN)).toBeNull();
  });

  it("parses DMS string", () => {
    const result = parseDMS(`8° 21' 6.44"`);
    expect(result).toBeCloseTo(8.3518, 3);
  });

  it("parses decimal string", () => {
    expect(parseDMS("45.5")).toBe(45.5);
  });

  it("returns null for invalid string", () => {
    expect(parseDMS("invalid")).toBeNull();
  });
});

describe("formatPlanetDegree", () => {
  it("formats decimal to DD:MM", () => {
    expect(formatPlanetDegree(45.5)).toBe("45:30");
  });

  it("returns empty for null", () => {
    expect(formatPlanetDegree(null)).toBe("");
  });

  it("formats DMS string to DD:MM", () => {
    expect(formatPlanetDegree(`8° 21' 6.44"`)).toBe("08:21");
  });

  it("pads single digits", () => {
    expect(formatPlanetDegree(5.0)).toBe("05:00");
  });
});
