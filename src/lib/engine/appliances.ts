/**
 * Engine: the ENERGY STAR certified model lists (src/data/appliances.json) crossed with the EIA residential price of
 * each state (src/data/eia.json). Pure functions, no figure typed by hand. Ships to the browser (calculators).
 */
import A from '../../data/appliances.json';
import EIA from '../../data/eia.json';
import P from '../../data/params-2026.json';

type Row = Array<number | string>;
interface Cat { id: string; fields: string[]; brands: string[]; types?: string[]; rows: Row[]; updated: string; excluded: number }
const C = (A as unknown as { cats: Record<string, Cat> }).cats;
export const RETRIEVED = (A as { retrieved: string }).retrieved;
export const TEST = P.test;
export const DATASET_UPDATED = C.fridge.updated;

/* ------------------------------------------------------------------ prices */
const ST = (EIA as unknown as { states: Record<string, { now: number; year_ago: number }> }).states;
export const PRICE_MONTH = (EIA as { month: string }).month;
export const PRICE_PREV = (EIA as { prev: string }).prev;
export const US_NAME = 'U.S. Total';
export interface StatePrice { name: string; slug: string; now: number; prev: number }
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
export const STATES: StatePrice[] = Object.entries(ST).filter(([n]) => n !== US_NAME)
  .map(([name, v]) => ({ name, slug: slugify(name), now: v.now, prev: v.year_ago })).sort((a, b) => a.name.localeCompare(b.name));
export const US: StatePrice = { name: 'U.S. average', slug: 'us', now: ST[US_NAME].now, prev: ST[US_NAME].year_ago };
export const stateBySlug = (s: string): StatePrice => (s === 'us' ? US : STATES.find((x) => x.slug === s) ?? US);
/** Dollars a year for `kwh` at the state's price (cents per kWh). */
export const costYear = (kwh: number, st: string | StatePrice = 'us') => (kwh * (typeof st === 'string' ? stateBySlug(st) : st).now) / 100;

/* ------------------------------------------------------------------ helpers */
export const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b), m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
export const minOf = (xs: number[]) => (xs.length ? Math.min(...xs) : 0);
export const maxOf = (xs: number[]) => (xs.length ? Math.max(...xs) : 0);
export interface Stats { n: number; med: number; min: number; max: number }
export const stats = (xs: number[]): Stats => ({ n: xs.length, med: median(xs), min: minOf(xs), max: maxOf(xs) });

/* ------------------------------------------------------------------ refrigerators */
export interface Fridge { w: number; h: number; vol: number; kwh: number; fed: number; type: string; cd: boolean; builtin: boolean; ice: boolean; brand: string; model: string }
const FT = C.fridge.types!;
/** Wine coolers and the few upright freezers filed with refrigerators are not refrigerators: left out everywhere. */
const NOT_FRIDGE = new Set(['Cooler', 'Compact Cooler', 'Upright Freezer']);
export const FRIDGES: Fridge[] = C.fridge.rows.map((r) => ({
  w: r[0] as number, h: r[1] as number, vol: r[2] as number, kwh: r[3] as number, fed: r[4] as number, type: FT[r[5] as number],
  cd: r[6] === 1, builtin: r[7] === 1, ice: r[8] === 1, brand: C.fridge.brands[r[9] as number], model: r[10] as string,
})).filter((f) => !NOT_FRIDGE.has(f.type));
export const FRIDGE_EXCLUDED = C.fridge.excluded;
export const COOLERS = C.fridge.rows.filter((r) => NOT_FRIDGE.has(FT[r[5] as number])).length;
export type Style = 'any' | 'full' | 'top' | 'bottom' | 'side' | 'single' | 'compact';
export const STYLES: Array<{ value: Style; label: string; types: string[] }> = [
  { value: 'full', label: 'Any full-size refrigerator', types: ['Top Freezer', 'Bottom Freezer', 'Side-by-Side', 'Freezerless and Single Door'] },
  { value: 'bottom', label: 'Bottom freezer (includes French door)', types: ['Bottom Freezer'] },
  { value: 'top', label: 'Top freezer', types: ['Top Freezer'] },
  { value: 'side', label: 'Side-by-side', types: ['Side-by-Side'] },
  { value: 'single', label: 'Refrigerator only, no freezer', types: ['Freezerless and Single Door'] },
  { value: 'compact', label: 'Compact (mini fridge)', types: ['Compact Refrigerator'] },
  { value: 'any', label: 'Any, compact included', types: ['Top Freezer', 'Bottom Freezer', 'Side-by-Side', 'Freezerless and Single Door', 'Compact Refrigerator'] },
];
export const styleOf = (s: string) => STYLES.find((x) => x.value === s) ?? STYLES[0];
export interface FridgeQuery { style?: string; maxW?: number; maxH?: number; cd?: 'any' | 'yes' | 'no'; builtin?: 'any' | 'no' | 'yes'; minW?: number; minVol?: number; maxVol?: number }
export function fridges(q: FridgeQuery = {}): Fridge[] {
  const types = new Set(styleOf(q.style ?? 'full').types);
  return FRIDGES.filter((f) => types.has(f.type)
    && (q.maxW === undefined || f.w <= q.maxW) && (q.minW === undefined || f.w > q.minW)
    && (q.maxH === undefined || f.h <= q.maxH)
    && (q.cd === undefined || q.cd === 'any' || f.cd === (q.cd === 'yes'))
    && (q.builtin === undefined || q.builtin === 'any' || f.builtin === (q.builtin === 'yes'))
    && (q.minVol === undefined || f.vol >= q.minVol) && (q.maxVol === undefined || f.vol < q.maxVol));
}
/** Models sold as an "N-inch" refrigerator: width above N − 1 and up to N + 0.5 inches. */
export const widthClass = (n: number, style = 'full', extra: FridgeQuery = {}) => fridges({ style, minW: n - 1, maxW: n + 0.5, ...extra });

/* ------------------------------------------------------------------ washers and dryers */
export interface Washer { w: number; h: number; d: number; vol: number; kwh: number; water: number; top: boolean; brand: string; model: string; idx: number }
export const WASHERS: Washer[] = C.washer.rows.map((r, idx) => ({ w: r[0] as number, h: r[1] as number, d: r[2] as number, vol: r[3] as number, kwh: r[4] as number, water: r[5] as number, top: r[6] === 1, brand: C.washer.brands[r[7] as number], model: r[8] as string, idx }));
export interface Dryer { w: number; h: number; d: number; cap: number; kwh: number; gas: boolean; ventless: boolean; compact: boolean; brand: string; model: string; idx: number }
export const DRYERS: Dryer[] = C.dryer.rows.map((r, idx) => ({ w: r[0] as number, h: r[1] as number, d: r[2] as number, cap: r[3] as number, kwh: r[4] as number, gas: r[5] === 1, ventless: r[6] === 1, compact: r[7] === 1, brand: C.dryer.brands[r[8] as number], model: r[9] as string, idx }));
export const PAIRS = ((A as unknown as { pairs: number[][] }).pairs).map(([w, d]) => ({ washer: WASHERS[w], dryer: DRYERS[d] }));
export const hasDims = (x: { h: number; d: number }) => x.h > 0 && x.d > 0;
export type Load = 'any' | 'front' | 'top';
export const washers = (load: Load = 'any') => WASHERS.filter((x) => load === 'any' || x.top === (load === 'top'));
/** Washers whose three published dimensions fit the space; those with the width only are counted apart. */
export function washerFit(maxW: number, maxH: number, maxD: number, load: Load = 'any') {
  const all = washers(load).filter((x) => x.h < 60); // laundry centers (washer and dryer in one frame) apart
  const dims = all.filter(hasDims);
  const fit = dims.filter((x) => x.w <= maxW && x.h <= maxH && x.d <= maxD);
  const widthOnly = all.filter((x) => !hasDims(x) && x.w <= maxW);
  return { all, dims, fit, widthOnly };
}
export type Fuel = 'any' | 'electric' | 'gas';
export const dryers = (fuel: Fuel = 'any', compact: 'any' | 'yes' | 'no' = 'any') => DRYERS.filter((x) => (fuel === 'any' || x.gas === (fuel === 'gas')) && (compact === 'any' || x.compact === (compact === 'yes')));
export const dryerFit = (maxW: number, maxH: number, maxD: number, fuel: Fuel = 'any') => dryers(fuel).filter((x) => x.w <= maxW && x.h <= maxH && x.d <= maxD);
/** Washer and dryer certified as a pair, stacked: total height = washer + dryer. */
export const stackFit = (maxW: number, maxH: number, maxD: number) => PAIRS.filter((p) => !p.washer.top && hasDims(p.washer)
  && Math.max(p.washer.w, p.dryer.w) <= maxW && p.washer.h + p.dryer.h <= maxH && Math.max(p.washer.d, p.dryer.d) <= maxD);
export const LAUNDRY_CENTERS = WASHERS.filter((x) => x.h >= 60);

/* ------------------------------------------------------------------ dishwashers */
export interface Dish { w: number; d: number; place: number; kwh: number; gal: number; compact: boolean; brand: string; model: string }
export const DISHES: Dish[] = C.dish.rows.map((r) => ({ w: r[0] as number, d: r[1] as number, place: r[2] as number, kwh: r[3] as number, gal: r[4] as number, compact: r[5] === 1, brand: C.dish.brands[r[6] as number], model: r[7] as string }));
export const DISH_EXCLUDED = C.dish.excluded;
/** "18-inch" and "24-inch" dishwashers: width above N − 1.5 and up to N + 0.5 inches. */
export const dishClass = (n: number) => DISHES.filter((x) => x.w > n - 1.5 && x.w <= n + 0.5);
export const dishFit = (maxW: number, maxD: number) => DISHES.filter((x) => x.w <= maxW && x.d <= maxD);

/* ------------------------------------------------------------------ room air conditioners, freezers, dehumidifiers */
export interface AC { w: number; h: number; d: number; btu: number; kwh: number; ceer: number; wall: boolean; brand: string; model: string }
export const ACS: AC[] = C.ac.rows.map((r) => ({ w: r[0] as number, h: r[1] as number, d: r[2] as number, btu: r[3] as number, kwh: r[4] as number, ceer: r[5] as number, wall: r[6] === 1, brand: C.ac.brands[r[7] as number], model: r[8] as string }));
export const AC_SIZES = [5000, 6000, 8000, 10000, 12000, 14000, 18000, 24000];
/** Window units of a nominal size: within 5% of the BTU figure. */
export const acClass = (btu: number) => ACS.filter((x) => !x.wall && Math.abs(x.btu - btu) <= btu * 0.05);
/** kWh per hour of cooling: the annual figure divided by the 750 cooling hours of the DOE test (10 CFR 430, appendix F). */
export const acKwhPerHour = (annual: number) => annual / TEST.acCoolingHours;
export interface Freezer { vol: number; kwh: number; type: string; brand: string; model: string }
export const FREEZERS: Freezer[] = C.freezer.rows.map((r) => ({ vol: r[0] as number, kwh: r[1] as number, type: C.freezer.types![r[2] as number], brand: C.freezer.brands[r[3] as number], model: r[4] as string }));
export interface Dehu { pints: number; kwh: number; whole: boolean; brand: string; model: string }
export const DEHUS: Dehu[] = C.dehu.rows.map((r) => ({ pints: r[0] as number, kwh: r[1] as number, whole: r[2] === 1, brand: C.dehu.brands[r[3] as number], model: r[4] as string }));
/** kWh per hour of drying: the annual figure divided by the 1,095 hours of the DOE test (10 CFR 430, appendix X1). */
export const dehuKwhPerHour = (annual: number) => annual / TEST.dehuHours;

export const COUNTS = { fridge: FRIDGES.length, washer: WASHERS.length, dryer: DRYERS.length, dish: DISHES.length, ac: ACS.length, freezer: FREEZERS.length, dehu: DEHUS.length };
