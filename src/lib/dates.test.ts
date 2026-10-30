import { describe, expect, it } from "vitest";
import { daysBetween } from "./dates";

describe("daysBetween", () => {
  it("counts the days from start to end", () => {
    expect(daysBetween("2026-01-01", "2026-01-31")).toBe(30);
    expect(daysBetween("2026-01-01", "2026-03-01")).toBe(59);
  });

  it("handles leap years", () => {
    expect(daysBetween("2024-02-01", "2024-03-01")).toBe(29);
    expect(daysBetween("2026-02-01", "2026-03-01")).toBe(28);
  });

  it("counts across a year boundary", () => {
    expect(daysBetween("2026-12-31", "2027-01-01")).toBe(1);
    expect(daysBetween("2026-01-01", "2027-01-01")).toBe(365);
  });

  it("is 0 on the same day", () => {
    expect(daysBetween("2026-05-10", "2026-05-10")).toBe(0);
  });

  it("is 0 when the end comes before the start", () => {
    expect(daysBetween("2026-03-01", "2026-01-01")).toBe(0);
  });

  it("is 0 when either date is missing", () => {
    expect(daysBetween("", "2026-01-01")).toBe(0);
    expect(daysBetween("2026-01-01", "")).toBe(0);
    expect(daysBetween("", "")).toBe(0);
  });
});
