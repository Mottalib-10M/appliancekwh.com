/** Coherence: the home page and the tool at its top give the same count for the same opening. */
import { describe, expect, it } from 'vitest';
import * as E from '../src/lib/engine/appliances';
import { getTool, typicalFridge } from '../src/lib/tool-specs';
import { HOME } from '../src/content/home';
import { formatNumber, formatMoney } from '../src/lib/format';

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

/** Naive testers 2026-11-14, round 2: the 30 inch page said "364 fit" and "narrower models that also fit 364" while the
 *  home page said 728. Both now show the same total and the same split. */
describe('total of every width', () => {
  const v = (spec: ReturnType<typeof getTool>) => Object.fromEntries(spec.inputs.map((i) => [i.id, i.def]));
  const row = (out: ReturnType<ReturnType<typeof getTool>['run']>) => out.rows.find((r) => r[0] === 'Every width that fits')?.[1];
  it('home and 30 inch page give the same total, split the same way', () => {
    const home = getTool('fridgeFit'), page = getTool('fridgeFit', { w: 30.5, h: 67, cls: 30 });
    const a = home.run(v(home)), b = page.run({ ...v(page), w: 30 });
    const all = E.fridges({ style: 'full', maxW: 30, maxH: 67 });
    const in30 = all.filter((f) => f.w > 29).length;
    const expected = `${formatNumber(all.length, 0)} in all, of which ${formatNumber(in30, 0)} are 30 inch models and the rest are narrower`;
    expect(row(a)).toBe(expected);
    expect(row(b)).toBe(expected);
    expect(b.value).toBe(formatNumber(in30, 0));
    expect(HOME.answer).toContain(`, ${formatNumber(in30, 0)} of them 30 inches wide.`);
  });
  it('the list can be ordered by yearly cost, cheapest first', () => {
    const spec = getTool('fridgeFit');
    const rows = spec.run({ ...v(spec), sort: 'cost' }).table!.rows.map((r) => Number(r[3].replace(/,/g, '')));
    expect(rows).toEqual([...rows].sort((x, y) => x - y));
  });
});

/** Naive testers 2026-11-14, round 3: for the same 30 × 67 inch opening the home answer said 18.0 cu ft, 366 kWh, $66,
 *  the width table $81 and the 30 inch page 18.4 cu ft, 390 kWh, $71. One function (typicalFridge) now computes every
 *  "typical", on the 30 inch models that fit, and the table names its own set (every height). */
describe('one typical 30 inch refrigerator', () => {
  const v = (spec: ReturnType<typeof getTool>) => Object.fromEntries(spec.inputs.map((i) => [i.id, i.def]));
  const vals = (out: ReturnType<ReturnType<typeof getTool>['run']>) => out.rows.filter((r) => r[0].startsWith('Typical 30 inch model that fits')).map((r) => r[1]);
  const L = E.widthClass(30);
  const t67 = typicalFridge(L.filter((f) => f.h <= 67));
  it('home tool, 30 inch page tool, home answer and heights table agree', () => {
    const home = getTool('fridgeFit'), page = getTool('fridgeFit', { w: 30.5, h: 67, cls: 30 });
    const a = vals(home.run(v(home))), b = vals(page.run(v(page)));
    expect(a).toHaveLength(3);
    expect(a).toEqual(b);
    expect(a).toEqual([`${formatNumber(t67.vol, 1)} cubic feet`, `${formatNumber(t67.kwh, 0)} kWh a year`, `${formatMoney(Math.round(t67.cost), 0)} a year`]);
    expect(HOME.answer).toContain(`The typical 30 inch one uses ${formatNumber(t67.kwh, 0)} kWh`);
    expect(HOME.answer).toContain(`${formatMoney(Math.round(t67.cost), 0)} a year`);
  });
  it('the width table gives the whole class and says so, next to the 67 inch figure', () => {
    const html = HOME.guide({ a: (_: string, t: string) => t, table: (h: string[], rows: string[][]) => JSON.stringify([h, rows]), mini: () => '', src: () => '' } as never);
    const all = typicalFridge(L);
    expect(html).toContain('Models, every height');
    expect(html).toContain(JSON.stringify(['30 inches', formatNumber(L.length, 0)]).slice(1, -1));
    expect(html).toContain(`the typical one costs ${formatMoney(Math.round(t67.cost), 0)} a year, against ${formatMoney(Math.round(all.cost), 0)} for the whole class`);
  });
});
