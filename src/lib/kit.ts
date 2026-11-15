/**
 * Writing kit: every figure written in a page comes from here, never typed by hand.
 *   K.E          the engine (lib/engine/appliances.ts): model lists, prices, fit functions
 *   K.st(slug)   a state's price { name, now, prev } ; K.US the U.S. average
 *   K.cost(kwh, st)  dollars a year
 *   K.s(xs)      { n, med, min, max }
 *   formats      K.usd(1234.5) "$1,235", K.usd2(4.5) "$4.50", K.num(1234) "1,234", K.dec(12.34, 1) "12.3", K.inch(29.75) "29.75 in", K.day("2026-11-12")
 */
import * as E from './engine/appliances';
import P from '../data/params-2026.json';
import { usd, usd2, num, inch, typicalKwh, typicalFridge, fitSets } from './tool-specs';
import { formatDecimal } from './format';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const longDate = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${Number(iso.slice(8, 10))}, ${iso.slice(0, 4)}`;
export const KIT = {
  E, P, US: E.US, STATES: E.STATES, st: E.stateBySlug, cost: E.costYear, s: E.stats, med: E.median, typical: typicalKwh,
  /** One definition of a typical refrigerator (median capacity and kWh) and the sets an opening takes, as in the tool. */
  typFridge: typicalFridge, fitSets,
  MONTH: E.PRICE_MONTH, PREV: E.PRICE_PREV, UPDATED: E.DATASET_UPDATED, RETRIEVED: E.RETRIEVED,
  usd, usd2, num, inch, dec: (x: number, d = 1) => formatDecimal(x, d), day: longDate,
  /** Percent written by hand-safe rounding: 0.1234 → "12%". */
  pct: (x: number) => `${num(Math.round(x * 100))}%`,
};
export type Kit = typeof KIT;
