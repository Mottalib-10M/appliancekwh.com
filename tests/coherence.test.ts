/** Coherence: the home page and the tool at its top give the same count for the same opening. */
import { describe, expect, it } from 'vitest';
import * as E from '../src/lib/engine/appliances';
import { getTool } from '../src/lib/tool-specs';
import { HOME } from '../src/content/home';
import { formatNumber } from '../src/lib/format';

describe('home', () => {
  it('the answer quotes the count the tool shows for 30 × 67 inches', () => {
    const spec = getTool('fridgeFit');
    const v = Object.fromEntries(spec.inputs.map((i) => [i.id, i.def]));
    const out = spec.run(v);
    expect(v.w).toBe(30); expect(v.h).toBe(67);
    expect(HOME.answer).toContain(out.value);
    expect(out.value).toBe(formatNumber(E.fridges({ style: 'full', maxW: 30, maxH: 67 }).length, 0));
  });
});

/** Naive testers 2026-11-14: "How many 33 inch models fit your height" said 994 where the page counted 310 models of
 *  that width. On a width page the tool counts the models of that width class only, as the page and its tables do. */
describe('width pages', () => {
  const v = (spec: ReturnType<typeof getTool>) => Object.fromEntries(spec.inputs.map((i) => [i.id, i.def]));
  for (const n of [24, 28, 30, 33, 36]) {
    it(`${n} inch: the tool never counts more models than the class holds`, () => {
      const spec = getTool('fridgeFit', { w: n + 0.5, h: 99, cls: n });
      const out = spec.run(v(spec));
      expect(out.value).toBe(formatNumber(E.widthClass(n).length, 0));
      expect(out.sub).toContain(formatNumber(E.widthClass(n).length, 0));
    });
  }
  it('30 inch: the tool at 67 inches gives the count of the heights table', () => {
    const spec = getTool('fridgeFit', { w: 30.5, h: 67, cls: 30 });
    expect(spec.run(v(spec)).value).toBe(formatNumber(E.widthClass(30).filter((f) => f.h <= 67).length, 0));
  });
  it('24 inch dishwasher: the tool at 24 × 24 gives the count of the depth table', () => {
    const spec = getTool('dish', { w: 24, d: 24, cls: 24 });
    expect(spec.run(v(spec)).value).toBe(formatNumber(E.dishClass(24).filter((x) => x.d <= 24).length, 0));
  });
  it('the example banner repeats the size typed, 30.5 and not 31', () => {
    const spec = getTool('fridgeFit', { w: 30.5, h: 67 });
    expect(spec.run(v(spec)).example).toContain('30.5 × 67');
  });
});
