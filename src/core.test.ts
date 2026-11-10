import { describe, expect, it } from "vitest";
import {
  answer,
  bank,
  compare,
  eligible,
  importData,
  initial,
  rate,
  start,
  submitAnswer,
  type Config,
} from "./core";

const config: Config = {
  profile: "primary",
  mode: "input",
  filter: "all",
  category: "",
  tag: "",
  order: "source",
  length: 1,
};

describe("mechanics training", () => {
  it("keeps all 13 source IDs and both chain solutions", () => {
    expect(bank.questions.map((q) => q.id)).toEqual([
      "2.1",
      "2.3",
      "2.5",
      "2.8",
      "2.13",
      "2.16",
      "3.1",
      "3.2",
      "3.4",
      "3.5",
      "3.9",
      "3.10",
      "3.30",
    ]);
    const chain = bank.questions.find((q) => q.id === "2.13")!;
    expect(answer(chain, "primary").solution).toContain("沿链切向列动力学方程");
    expect(answer(chain, "alternate").solution).toContain("机械能守恒");
    expect(
      bank.questions
        .flatMap((q) => q.variants)
        .every((v) => !/\\(?:mathbf|boldsymbol|bm)\b/.test(v.solution)),
    ).toBe(true);
    expect(answer(bank.questions.at(-1)!, "primary").solution).toContain(
      "\\vec{\\Omega}",
    );
  });

  it("accepts typographic variants without erasing symbol boundaries", () => {
    expect(compare(" 4 × a ÷ (3 × π) ", "4*a/(3*pi)")).toBe(true);
    expect(compare("m × a² / 2", "m*a^2/2")).toBe(true);
    expect(compare("G 1", "G1")).toBe(false);
    expect(compare("4 × a", "4*a", true)).toBe(false);
  });

  it("records a match once and leaves a differing expression for self-assessment", () => {
    const started = start(initial(), config, "2.8");
    const matched = submitAnswer({
      ...started,
      session: { ...started.session!, draft: "０" },
    });
    expect(matched.attempts).toHaveLength(1);
    expect(matched.session?.finished).toBe(true);
    expect(submitAnswer(matched)).toBe(matched);
    const unmatched = submitAnswer({
      ...started,
      session: { ...started.session!, draft: "1" },
    });
    expect(unmatched.attempts).toHaveLength(0);
    expect(unmatched.session?.revealed).toBe(true);
    const wrong = rate(unmatched, "wrong", new Date(2026, 10, 10, 12));
    expect(
      eligible(wrong, { ...config, filter: "wrong" }).map((q) => q.id),
    ).toEqual(["2.8"]);
    expect(wrong.progress["2.8:common"].due).toBe("2026-11-10");
  });

  it("preserves unfinished drafts and rejects unrelated backups", () => {
    const started = start(initial(), config, "3.30");
    const draft = { ...started, session: { ...started.session!, draft: "2" } };
    expect(importData(JSON.stringify(draft))).toEqual({
      type: "backup",
      data: draft,
    });
    expect(() =>
      importData(JSON.stringify({ ...draft, app: "PhysDrill" })),
    ).toThrow();
  });
});
