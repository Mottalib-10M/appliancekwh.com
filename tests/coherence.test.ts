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
