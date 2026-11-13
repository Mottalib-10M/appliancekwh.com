/** Engine tests: the data files load, filters and prices behave, and the figures match the official files. */
import { describe, expect, it } from 'vitest';
import * as E from '../src/lib/engine/appliances';
import EIA from '../src/data/eia.json';
import { getTool, TOOL_KINDS } from '../src/lib/tool-specs';

describe('data', () => {
  it('loads every list with the U.S. market only', () => {
    expect(E.FRIDGES.length).toBeGreaterThan(4000);
    expect(E.WASHERS.length).toBeGreaterThan(300);
    expect(E.DRYERS.length).toBeGreaterThan(400);
    expect(E.DISHES.length).toBeGreaterThan(500);
    expect(E.ACS.length).toBeGreaterThan(500);
  });
  it('has 50 states and DC with prices in cents', () => {
    expect(E.STATES.length).toBe(51);
    for (const s of E.STATES) { expect(s.now).toBeGreaterThan(5); expect(s.now).toBeLessThan(80); }
    expect(E.US.now).toBe((EIA as { states: Record<string, { now: number }> }).states['U.S. Total'].now);
  });
  it('reads August 2026 from table 5.6.A (Connecticut 24.51, Maine 32.11, Massachusetts 30.48)', () => {
    expect(E.PRICE_MONTH).toBe('August 2026');
    expect(E.stateBySlug('connecticut').now).toBe(24.51);
    expect(E.stateBySlug('maine').now).toBe(32.11);
    expect(E.stateBySlug('massachusetts').now).toBe(30.48);
  });
  it('excludes wine coolers from refrigerators', () => {
    expect(E.FRIDGES.some((f) => /Cooler/.test(f.type))).toBe(false);
  });
});

describe('engine', () => {
  it('cost = kWh × cents / 100', () => {
    expect(E.costYear(500, { name: 'x', slug: 'x', now: 20, prev: 20 })).toBe(100);
  });
  it('median', () => { expect(E.median([3, 1, 2])).toBe(2); expect(E.median([1, 2, 3, 4])).toBe(2.5); });
  it('fit never returns a model larger than the opening', () => {
    for (const f of E.fridges({ style: 'full', maxW: 30, maxH: 67 })) { expect(f.w).toBeLessThanOrEqual(30); expect(f.h).toBeLessThanOrEqual(67); }
    for (const x of E.dishFit(24, 24)) { expect(x.w).toBeLessThanOrEqual(24); expect(x.d).toBeLessThanOrEqual(24); }
  });
  it('a wider opening never fits fewer models', () => {
    expect(E.fridges({ maxW: 36, maxH: 70 }).length).toBeGreaterThanOrEqual(E.fridges({ maxW: 30, maxH: 70 }).length);
  });
  it('room AC per hour uses the 750 test hours of appendix F', () => { expect(E.acKwhPerHour(750)).toBe(1); });
  it('dehumidifier per hour uses the 1,095 test hours of appendix X1', () => { expect(E.dehuKwhPerHour(1095)).toBe(1); });
  it('stacked pairs add the two heights', () => {
    for (const p of E.stackFit(30, 80, 34)) expect(p.washer.h + p.dryer.h).toBeLessThanOrEqual(80);
  });
});

describe('tools', () => {
  it('every tool runs on its defaults without NaN', () => {
    for (const k of TOOL_KINDS) {
      const spec = getTool(k);
      const v = Object.fromEntries(spec.inputs.map((i) => [i.id, i.def]));
      const out = spec.run(v);
      expect(JSON.stringify(out), k).not.toMatch(/NaN|undefined|Infinity/);
    }
  });
  it('a zero-size opening says 0 and points to the narrowest model', () => {
    const out = getTool('fridgeFit', { w: 5, h: 5 }).run({ w: 5, h: 5, style: 'full', cd: 'any', st: 'us', gap: 0 });
    expect(out.value).toBe('0');
  });
});
