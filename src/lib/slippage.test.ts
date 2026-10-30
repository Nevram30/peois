import { describe, expect, it } from "vitest";
import { computeEntrySlippage, getSlippageStage } from "./slippage";

describe("computeEntrySlippage", () => {
  it("measures the first entry against its target", () => {
    expect(computeEntrySlippage({ target: 50, revisedTarget: 40, actual: 45 }, true)).toBe(-5);
  });

  it("measures later entries against the revised target, ignoring target", () => {
    expect(computeEntrySlippage({ target: 70, revisedTarget: 60, actual: 55 }, false)).toBe(-5);
  });

  it("is positive when ahead of the revised target", () => {
    expect(computeEntrySlippage({ target: 70, revisedTarget: 60, actual: 62.5 }, false)).toBe(2.5);
  });

  it("falls back to target for later rows without a revised target", () => {
    expect(computeEntrySlippage({ target: 50, revisedTarget: null, actual: 40 }, false)).toBe(-10);
    expect(computeEntrySlippage({ target: 50, actual: 40 }, false)).toBe(-10);
  });

  it("keeps negative-is-behind so the stage bands still apply", () => {
    const slippage = computeEntrySlippage({ target: 70, revisedTarget: 60, actual: 55 }, false);
    expect(getSlippageStage(slippage)).toBe("WARNING");
  });
});
