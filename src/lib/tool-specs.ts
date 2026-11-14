/**
 * The calculators of the site, rendered by components/calc/SpecTool.tsx (full tool) and MiniSim.tsx (mini-simulator).
 * Every figure comes from the engine (lib/engine/appliances.ts): the ENERGY STAR certified model lists of
 * 12 November 2026 and the EIA residential price of each state for August 2026. No wattage is assumed anywhere:
 * a running cost always starts from the measured yearly kWh of real certified models.
 * `arg` overrides the default of any field by its id. This file ships to the browser.
 */
import type { ToolSpec, V, Input, ToolOut } from './tool-types';
import { formatMoney, formatNumber } from './format';
import {
  fridges, widthClass, styleOf, STYLES, stats, median, costYear, stateBySlug, STATES, US, PRICE_MONTH, washerFit, dryerFit, stackFit,
  dishFit, acClass, acKwhPerHour, AC_SIZES, FREEZERS, DEHUS, dehuKwhPerHour, washers, dryers, DISHES, type Fridge, type Load, type Fuel,
} from './engine/appliances';

export const usd = (x: number) => formatMoney(Math.round(x), 0);
/** $41.50: monthly and per-hour costs keep their cents. */
export const usd2 = (x: number) => formatMoney(x, 2);
export const num = (x: number, d = 0) => formatNumber(x, d);
export const inch = (x: number) => `${formatNumber(x, Number.isInteger(x) ? 0 : 2)} in`;
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k]);

/* Fields shared by several calculators. */
const STATE_OPTIONS = [{ value: 'us', label: `U.S. average (${num(US.now, 2)}¢ per kWh)` }, ...STATES.map((x) => ({ value: x.slug, label: `${x.name} (${num(x.now, 2)}¢)` }))];
const STATE = (def = 'us'): Input => ({ kind: 'select', id: 'st', label: 'Your state (sets the price per kWh)', short: 'State', def, options: STATE_OPTIONS, help: `Average price homes paid in ${PRICE_MONTH} (U.S. Energy Information Administration)` });
const INCH = (id: string, label: string, def: number, help?: string, adv = false): Input => ({ id, label, def, unit: 'in', max: 120, decimals: 2, help, adv });
const stName = (v: V) => stateBySlug(s(v, 'st')).name;
const where = (v: V) => (s(v, 'st') === 'us' ? 'at the U.S. average price' : `in ${stName(v)}`);

/* ------------------------------------------------------------------ refrigerator: will it fit */
/** What a style is called in a sentence ("of 2,700 full-size refrigerators"), plural and singular. */
const NOUN: Record<string, [string, string]> = {
  full: ['full-size refrigerators', 'full-size refrigerator'], bottom: ['bottom-freezer refrigerators', 'bottom-freezer refrigerator'],
  top: ['top-freezer refrigerators', 'top-freezer refrigerator'], side: ['side-by-side refrigerators', 'side-by-side refrigerator'],
  single: ['refrigerators without a freezer', 'refrigerator without a freezer'], compact: ['compact refrigerators', 'compact refrigerator'],
  any: ['refrigerators, compact ones included', 'refrigerator'],
};
const noun = (style: string, one = false) => (NOUN[style] ?? NOUN.full)[one ? 1 : 0];
/** A size as the reader typed it: 30.5, not 31 (naive testers 2026-11-14: "the box says 30.50, the banner 31"). */
export const dim = (x: number) => formatNumber(x, Number.isInteger(x) ? 0 : Math.abs(x * 10 - Math.round(x * 10)) < 1e-9 ? 1 : 2);
/** The width class a page is about (24, 28, 30, 33, 36), 0 = every width up to the opening. Naive testers 2026-11-14:
 *  on the width pages the tool counted every narrower model too, so "How many 33 inch models fit" said 994 where
 *  the page counted 310 models of that width. With a class, the tool counts the models of that class only. */
const clsOf = (v: V) => Number(v.cls ?? 0) || 0;
/** Same size, same energy, same brand: one line in the model table, with the number of variants. */
function distinct(list: Fridge[]): Array<{ f: Fridge; n: number }> {
  const out = new Map<string, { f: Fridge; n: number }>();
  for (const f of list) { const k = [f.brand, f.w, f.h, f.vol, f.kwh, f.ice].join('|'); const g = out.get(k); if (g) g.n += 1; else out.set(k, { f, n: 1 }); }
  return [...out.values()];
}
/** The width classes of the site. The class of an opening is the widest one it can take (30 for 30 in, 28 for 29.5 in). */
const CLASSES = [24, 28, 30, 33, 36];
const classOf = (W: number) => [...CLASSES].reverse().find((c) => W > c - 1) ?? 0;
/** Naive testers 2026-11-14, round 2: the 30 inch page said "364 fit" and "narrower models that also fit 364" while the
 *  home page said 728 for the same opening. One row now gives the total and its split, the same on every page. */
function widthSplit(anyWidth: Fridge[], c: number): [string, string] | undefined {
  if (!c) return undefined;
  const inC = anyWidth.filter((f) => f.w > c - 1 && f.w <= c + 0.5).length, nar = anyWidth.filter((f) => f.w <= c - 1).length;
  const wid = anyWidth.length - inC - nar;
  return ['Every width that fits', `${num(anyWidth.length)} in all: ${num(inC)} are ${c} inch, ${num(nar)} are narrower${wid ? `, ${num(wid)} are wider than ${dim(c + 0.5)} in` : ''}`];
}
const SORTS = [{ value: 'vol', label: 'Most storage' }, { value: 'cost', label: 'Lowest yearly cost' }];
function fridgeFitRun(v: V): ToolOut {
  const gap = n(v, 'gap');
  const W = n(v, 'w') - gap, H = n(v, 'h') - gap;
  const style = styleOf(s(v, 'style'));
  const cd = s(v, 'cd') === 'yes' ? 'yes' : 'any';
  const cls = clsOf(v);
  const all = cls ? widthClass(cls, style.value, { cd }) : fridges({ style: style.value, cd });
  const anyWidth = fridges({ style: style.value, cd, maxW: W, maxH: H });
  const fit = cls ? widthClass(cls, style.value, { cd, maxW: Math.min(W, cls + 0.5), maxH: H }) : anyWidth;
  const st = stateBySlug(s(v, 'st'));
  const what = `${cd === 'yes' ? 'counter-depth ' : ''}${noun(style.value)}`;
  const sub = cls ? `of ${num(all.length)} certified ${cls} inch ${what}` : `of ${num(all.length)} certified ${what}, every width up to yours`;
  const example = cls ? `Example for ${cls} inch models and ${dim(n(v, 'h'))} inches of height` : `Example for a ${dim(n(v, 'w'))} × ${dim(n(v, 'h'))} inch opening`;
  const c = cls || classOf(W);
  const split = widthSplit(anyWidth, c);
  const total: Array<[string, string]> = split && anyWidth.length ? [split] : [];
  if (!fit.length) {
    const narrow = stats(all.map((f) => f.w)).min, low = stats(all.map((f) => f.h)).min;
    return {
      label: 'Certified models that fit', value: '0', sub,
      rows: [['Narrowest model counted', inch(narrow)], ['Lowest model counted', inch(low)], ...total],
      note: 'Measure again at the narrowest point of the opening (trim, cabinet doors, baseboard), or try another style.',
      example,
    };
  }
  const k = stats(fit.map((f) => f.kwh)), vol = stats(fit.map((f) => f.vol));
  const byCost = s(v, 'sort') === 'cost';
  const order = byCost ? (a: Fridge, b: Fridge) => a.kwh - b.kwh || b.vol - a.vol : (a: Fridge, b: Fridge) => b.vol - a.vol || a.kwh - b.kwh;
  const shown = distinct([...fit].sort(order)).slice(0, 5);
  /* Naive testers 2026-11-14, round 2: on the home page the most frugal model was an 18.5 inch unit for a 30 inch
     opening. Without a class, the most frugal is taken among the models of the opening's own width when there are some. */
  const near = cls || !c ? fit : fit.filter((f) => f.w > c - 1);
  const lean = [...(near.length ? near : fit)].sort((a, b) => a.kwh - b.kwh)[0];
  return {
    label: cls ? `Certified ${cls} inch models that fit` : 'Certified models that fit', value: num(fit.length), sub,
    rows: [
      ...total,
      ['Typical capacity (the middle model)', `${num(vol.med, 1)} cubic feet`],
      ['Typical energy use', `${num(k.med)} kWh a year`],
      [`Typical running cost ${where(v)}`, `${usd(costYear(k.med, st))} a year`],
      [!cls && c && near.length ? `Lowest use at about ${c} inches wide` : 'Lowest use among them', `${num(lean.kwh)} kWh (${lean.brand} ${lean.model}, ${inch(lean.w)} wide)`],
    ],
    table: { caption: `${byCost ? 'The models that fit, cheapest to run first.' : 'The largest models that fit, most storage first. Set “Order of the list” to Lowest yearly cost to see the cheapest to run first.'} A * or # in a model number stands for any letter or digit, usually the color or finish.`, headers: ['Model', 'Width × height', 'Capacity', 'kWh a year', 'Cost a year'], align: ['l', 'r', 'r', 'r', 'r'],
      rows: shown.map(({ f, n: c2 }) => [`${f.brand} ${f.model}${f.ice ? ', ice maker' : ''}${c2 > 1 ? ` (${c2} versions, same size and use)` : ''}`, `${inch(f.w)} × ${inch(f.h)}`, `${num(f.vol, 1)} cu ft`, num(f.kwh), usd(costYear(f.kwh, st))]) },
    note: 'kWh (kilowatt-hour) is the unit on your power bill. The ENERGY STAR list gives no depth for refrigerators: check the depth, door swing and hinge clearance on the model’s own sheet.',
    example,
  };
}
const fridgeFit = (a: Record<string, number | string> = {}): ToolSpec => {
  const cls = Number(a.cls ?? 0) || 0;
  const base: Input[] = [
    INCH('w', 'Width of the opening', 30, 'Narrowest point, wall to wall or cabinet to cabinet'),
    INCH('h', 'Height of the opening', 67, 'Floor to the underside of the cabinet above'),
    { kind: 'select', id: 'style', label: 'Style', def: 'full', options: STYLES.map((x) => ({ value: x.value, label: x.label })) },
    { kind: 'choice', id: 'cd', label: 'Counter-depth only? (front in line with the counter)', def: 'any', options: [{ value: 'any', label: 'No, any depth' }, { value: 'yes', label: 'Yes' }], help: 'The ENERGY STAR list gives no refrigerator depth, only a counter-depth mark: check the depth on the model’s sheet.' },
    STATE(),
    { kind: 'choice', id: 'sort', label: 'Order of the list', def: 'vol', options: SORTS, wide: true },
    INCH('gap', 'Space to leave free around it (taken off width and height)', 0, '0 counts the bare opening. The model’s installation guide gives the space it needs: enter it here.', true),
  ].map((i) => (a[i.id] !== undefined && i.id !== 'cls' ? { ...i, def: a[i.id] } as Input : i));
  const which: Input[] = cls ? [{ kind: 'choice', id: 'cls', label: 'Models to count', def: String(cls), options: [{ value: String(cls), label: `${cls} inch models` }, { value: '0', label: 'Any width that fits' }] }] : [];
  return { inputs: [...base.slice(0, 2), ...which, ...base.slice(2)], run: fridgeFitRun };
};

/* ------------------------------------------------------------------ refrigerator: what it costs to run */
const BANDS: Array<{ value: string; label: string; lo: number; hi: number }> = [
  { value: 'all', label: 'Any size', lo: 0, hi: 99 },
  { value: 'u5', label: 'Under 5 cu ft (mini fridge)', lo: 0, hi: 5 },
  { value: '5-15', label: '5 to 15 cu ft', lo: 5, hi: 15 },
  { value: '15-20', label: '15 to 20 cu ft', lo: 15, hi: 20 },
  { value: '20-25', label: '20 to 25 cu ft', lo: 20, hi: 25 },
  { value: '25+', label: '25 cu ft or more', lo: 25, hi: 99 },
];
function fridgeCostRun(v: V): ToolOut {
  const band = BANDS.find((b) => b.value === s(v, 'band')) ?? BANDS[0];
  const style = styleOf(s(v, 'style'));
  const cls = clsOf(v);
  const list = cls ? widthClass(cls, style.value, { minVol: band.lo, maxVol: band.hi }) : fridges({ style: style.value, minVol: band.lo, maxVol: band.hi });
  const st = stateBySlug(s(v, 'st'));
  const own = n(v, 'label');
  const what = `${cls ? `${cls} inch ` : ''}${noun(style.value, true)}${band.value === 'all' ? '' : `, ${band.label.toLowerCase()}`}`;
  const k = stats(list.map((f) => f.kwh));
  const kwh = own > 0 ? own : k.med;
  if (!list.length && own <= 0) return { label: 'Running cost a year', value: 'no model', rows: [['Certified models of that style and size', '0']], note: 'Try another size band.', example: `Example: the middle ${what} ${where(v)}` };
  const fed = median(list.map((f) => f.fed).filter((x) => x > 0));
  return {
    label: own > 0 ? 'Your model, running cost a year' : `Typical certified ${cls ? `${cls} inch ` : ''}model, cost a year`, value: usd(costYear(kwh, st)),
    sub: `${num(kwh)} kWh a year ${where(v)}, ${num(st.now, 2)}¢ per kWh in ${PRICE_MONTH}`,
    rows: [
      ['Per month', usd2(costYear(kwh, st) / 12)],
      ['Average power draw, day and night', `${num((kwh / 8760) * 1000)} watts`],
      [`Certified ${cls ? `${cls} inch ` : ''}models compared`, `${num(k.n)}, from ${num(k.min)} to ${num(k.max)} kWh`],
      ['Cost range among them', `${usd(costYear(k.min, st))} to ${usd(costYear(k.max, st))} a year`],
      ...(fed ? [['Federal maximum for the middle model', `${num(fed)} kWh a year`] as [string, string]] : []),
    ],
    note: 'kWh from the Department of Energy test (closed doors, set temperatures). Your kitchen, settings and door openings change it.',
    example: own > 0 ? undefined : `Example: the middle ${what} ${where(v)}`,
  };
}
const fridgeCost = (a: Record<string, number | string> = {}): ToolSpec => ({
  inputs: [
    { kind: 'select', id: 'style', label: 'Style', def: 'top', options: STYLES.map((x) => ({ value: x.value, label: x.label })) },
    { kind: 'select', id: 'band', label: 'Capacity (cubic feet of storage)', def: '15-20', options: BANDS.map((b) => ({ value: b.value, label: b.label })) },
    STATE(),
    { id: 'label', label: 'kWh a year on your EnergyGuide label (0 = use the typical model)', short: 'Label kWh', def: 0, unit: 'kWh', max: 3000, help: 'The yellow label, or the model’s sheet', adv: true },
  ].map((i) => (a[i.id] !== undefined ? { ...i, def: a[i.id] } as Input : i)).concat(Number(a.cls) ? [{ kind: 'choice', id: 'cls', label: 'Models compared', def: String(a.cls), options: [{ value: String(a.cls), label: `${a.cls} inch models` }, { value: '0', label: 'All widths' }], adv: true } as Input] : []),
  run: fridgeCostRun,
});

/* ------------------------------------------------------------------ washer and dryer */
const LOADS = [{ value: 'any', label: 'Front or top' }, { value: 'front', label: 'Front load' }, { value: 'top', label: 'Top load' }];
function washerRun(v: V): ToolOut {
  const r = washerFit(n(v, 'w'), n(v, 'h'), n(v, 'd'), s(v, 'load') as Load);
  const st = stateBySlug(s(v, 'st'));
  const pool = r.fit.length ? r.fit : r.all;
  const k = stats(pool.map((x) => x.kwh)), wa = median(pool.map((x) => x.water)), vol = median(pool.map((x) => x.vol));
  const big = [...r.fit].sort((a, b) => b.vol - a.vol).slice(0, 5);
  return {
    label: 'Washers that fit (all three sizes published)', value: num(r.fit.length),
    sub: `of ${num(r.dims.length)} with height and depth on the list; ${num(r.widthOnly.length)} more fit the width but publish no height or depth`,
    rows: [
      [r.fit.length ? 'Typical energy use of those that fit' : 'Typical energy use, all certified', `${num(k.med)} kWh a year`],
      [`Running cost ${where(v)}`, `${usd(costYear(k.med, st))} a year`],
      ['Typical water use', `${num(wa)} gallons a year`],
      ['Typical drum capacity', `${num(vol, 1)} cu ft`],
    ],
    table: big.length ? { caption: 'Largest drums that fit', headers: ['Model', 'W × H × D', 'Drum', 'kWh a year'], align: ['l', 'r', 'r', 'r'], rows: big.map((x) => [`${x.brand} ${x.model}`, `${num(x.w, 1)} × ${num(x.h, 1)} × ${num(x.d, 1)} in`, `${num(x.vol, 1)} cu ft`, num(x.kwh)]) } : undefined,
    note: 'Depth on the list is the cabinet; add the door and the hoses behind (several inches) before you buy.',
    example: `Example for a ${dim(n(v, 'w'))} in wide, ${dim(n(v, 'd'))} in deep space`,
  };
}
const washer = (a: Record<string, number | string> = {}): ToolSpec => ({
  inputs: [INCH('w', 'Width of the space', 28), INCH('h', 'Height available', 40), INCH('d', 'Depth available', 32, 'Wall to the front edge you want to keep'),
    { kind: 'select', id: 'load', label: 'Washer type', def: 'any', options: LOADS }, STATE()]
    .map((i) => (a[i.id] !== undefined ? { ...i, def: a[i.id] } as Input : i)),
  run: washerRun,
});
const FUELS = [{ value: 'any', label: 'Electric or gas' }, { value: 'electric', label: 'Electric' }, { value: 'gas', label: 'Gas' }];
function dryerRun(v: V): ToolOut {
  const fuel = s(v, 'fuel') as Fuel;
  const fit = dryerFit(n(v, 'w'), n(v, 'h'), n(v, 'd'), fuel), all = dryers(fuel);
  const st = stateBySlug(s(v, 'st'));
  const elec = (fit.length ? fit : all).filter((x) => !x.gas);
  const k = stats(elec.map((x) => x.kwh));
  const big = [...fit].sort((a, b) => b.cap - a.cap).slice(0, 5);
  return {
    label: 'Dryers that fit', value: num(fit.length), sub: `of ${num(all.length)} certified ${fuel === 'any' ? '' : `${fuel} `}dryers with their sizes on the list`,
    rows: [
      ['Typical capacity of those that fit', `${num(median((fit.length ? fit : all).map((x) => x.cap)), 1)} cu ft`],
      ...(elec.length ? [
        ['Electric models: typical energy use', `${num(k.med)} kWh a year`] as [string, string],
        [`Electric models: cost ${where(v)}`, `${usd(costYear(k.med, st))} a year`] as [string, string],
      ] : []),
      ['Ventless among those that fit', num(fit.filter((x) => x.ventless).length)],
    ],
    table: big.length ? { caption: 'Largest drums that fit', headers: ['Model', 'W × H × D', 'Drum', 'Fuel'], align: ['l', 'r', 'r', 'l'], rows: big.map((x) => [`${x.brand} ${x.model}`, `${num(x.w, 1)} × ${num(x.h, 1)} × ${num(x.d, 1)} in`, `${num(x.cap, 1)} cu ft`, x.gas ? 'Gas' : 'Electric']) } : undefined,
    note: 'Gas dryers burn gas for heat; their kWh is not comparable and no cost is shown for them.',
    example: `Example for a ${dim(n(v, 'w'))} × ${dim(n(v, 'h'))} × ${dim(n(v, 'd'))} inch space`,
  };
}
const dryer = (a: Record<string, number | string> = {}): ToolSpec => ({
  inputs: [INCH('w', 'Width of the space', 28), INCH('h', 'Height available', 40), INCH('d', 'Depth available', 32), { kind: 'select', id: 'fuel', label: 'Fuel', def: 'electric', options: FUELS }, STATE()]
    .map((i) => (a[i.id] !== undefined ? { ...i, def: a[i.id] } as Input : i)),
  run: dryerRun,
});
function stackRun(v: V): ToolOut {
  const fit = stackFit(n(v, 'w'), n(v, 'h'), n(v, 'd'));
  const all = stackFit(99, 999, 99);
  const st = stateBySlug(s(v, 'st'));
  const elec = fit.filter((p) => !p.dryer.gas);
  const tall = (p: (typeof fit)[number]) => p.washer.h + p.dryer.h;
  const rows = [...fit].sort((a, b) => tall(a) - tall(b)).slice(0, 6);
  const lowest = stats(all.map(tall)).min;
  return {
    label: 'Certified washer and dryer pairs that fit stacked', value: num(fit.length), sub: `of ${num(all.length)} front-load pairs that ENERGY STAR lists together`,
    rows: [
      ['Lowest stacked height on the list', inch(lowest)],
      ...(elec.length ? [[`Pair with electric dryer, typical cost ${where(v)}`, `${usd(costYear(median(elec.map((p) => p.washer.kwh + p.dryer.kwh)), st))} a year`] as [string, string]] : []),
      ['Widest of the pairs that fit', fit.length ? inch(Math.max(...fit.map((p) => Math.max(p.washer.w, p.dryer.w)))) : 'none'],
    ],
    table: rows.length ? { caption: 'Pairs that fit, lowest stack first', headers: ['Washer', 'Dryer', 'Stacked height', 'Width'], align: ['l', 'l', 'r', 'r'], rows: rows.map((p) => [`${p.washer.brand} ${p.washer.model}`, p.dryer.model, inch(Math.round(tall(p) * 100) / 100), inch(Math.max(p.washer.w, p.dryer.w))]) } : undefined,
    note: 'Height adds the two cabinets only: the stacking kit and the feet add a little. Check the kit on the maker’s sheet.',
    example: `Example for a closet ${dim(n(v, 'w'))} in wide and ${dim(n(v, 'h'))} in high`,
  };
}
const stack = (a: Record<string, number | string> = {}): ToolSpec => ({
  inputs: [INCH('w', 'Width of the closet', 28), INCH('h', 'Height of the closet', 80), INCH('d', 'Depth of the closet', 34), STATE()]
    .map((i) => (a[i.id] !== undefined ? { ...i, def: a[i.id] } as Input : i)),
  run: stackRun,
});

/* ------------------------------------------------------------------ dishwasher */
function dishRun(v: V): ToolOut {
  const cls = clsOf(v);
  const inCls = (x: { w: number }) => !cls || (x.w > cls - 1.5 && x.w <= cls + 0.5);
  const all = DISHES.filter(inCls);
  const fit = dishFit(n(v, 'w'), n(v, 'd')).filter(inCls);
  const st = stateBySlug(s(v, 'st'));
  const pool = fit.length ? fit : all;
  const k = stats(pool.map((x) => x.kwh));
  const best = [...fit].sort((a, b) => b.place - a.place || a.kwh - b.kwh).slice(0, 5);
  return {
    label: cls ? `Certified ${cls} inch dishwashers that fit` : 'Certified dishwashers that fit', value: num(fit.length),
    sub: cls ? `of ${num(all.length)} certified ${cls} inch dishwashers` : `of ${num(all.length)} certified dishwashers, every width up to yours`,
    rows: [
      ['Typical place settings (sets of dishes)', num(median(pool.map((x) => x.place)))],
      ['Typical energy use', `${num(k.med)} kWh a year`],
      [`Typical running cost ${where(v)}`, `${usd(costYear(k.med, st))} a year`],
      ['Typical water per cycle', `${num(median(pool.map((x) => x.gal)), 1)} gallons`],
      ...(fit.length < all.length ? [['Left out: deeper or wider than your space', num(all.length - fit.length)] as [string, string]] : []),
    ],
    table: best.length ? { caption: 'Most place settings among those that fit. A * in a model number stands for any letter or digit, usually the color or panel.', headers: ['Model', 'Width × depth', 'Settings', 'kWh a year', 'Cost a year'], align: ['l', 'r', 'r', 'r', 'r'], rows: best.map((x) => [`${x.brand} ${x.model}`, `${num(x.w, 2)} × ${num(x.d, 2)} in`, num(x.place), num(x.kwh), usd(costYear(x.kwh, st))]) } : undefined,
    note: 'kWh (kilowatt-hour) is the unit on your power bill. The list gives no height: standard built-in units are made for the opening under a 36 inch counter. Check the model’s sheet.',
    example: cls ? `Example for ${cls} inch models and a cabinet ${dim(n(v, 'd'))} in deep` : `Example for an opening ${dim(n(v, 'w'))} in wide and ${dim(n(v, 'd'))} in deep`,
  };
}
const dish = (a: Record<string, number | string> = {}): ToolSpec => ({
  inputs: [INCH('w', 'Width of the opening', 24), INCH('d', 'Depth of the cabinet', 24), STATE()].map((i) => (a[i.id] !== undefined ? { ...i, def: a[i.id] } as Input : i))
    .concat(Number(a.cls) ? [{ kind: 'choice', id: 'cls', label: 'Models to count', def: String(a.cls), options: [{ value: String(a.cls), label: `${a.cls} inch models` }, { value: '0', label: 'Any width that fits' }], adv: true } as Input] : []),
  run: dishRun,
});

/* ------------------------------------------------------------------ window air conditioner */
function acRun(v: V): ToolOut {
  const btu = n(v, 'btu');
  const list = acClass(btu);
  const st = stateBySlug(s(v, 'st'));
  const k = stats(list.map((x) => x.kwh));
  const perH = acKwhPerHour(k.med);
  const hours = n(v, 'hrs') * n(v, 'days');
  return {
    label: 'Cooling cost for the hours you enter', value: usd(perH * hours * st.now / 100),
    sub: `${num(n(v, 'hrs'))} hours a day for ${num(n(v, 'days'))} days, median certified ${num(btu)} BTU window unit, ${where(v)}`,
    rows: [
      ['Per hour of cooling', usd2(perH * st.now / 100)],
      ['Energy per hour', `${num(perH, 2)} kWh (about ${num(perH * 1000)} watts)`],
      ['Certified models of that size', `${num(k.n)}, ${num(k.min)} to ${num(k.max)} kWh in the 750-hour test`],
      ['Most frugal of them, same hours', usd(acKwhPerHour(k.min) * hours * st.now / 100)],
    ],
    note: 'The DOE test counts 750 hours of cooling a year. A hotter room or a higher setting runs the compressor longer.',
    example: `Example for an 8,000 BTU unit, 8 hours a day for 30 days`,
  };
}
const ac = (a: Record<string, number | string> = {}): ToolSpec => ({
  inputs: [
    { kind: 'select', id: 'btu', label: 'Cooling capacity', def: '8000', options: AC_SIZES.filter((b) => acClass(b).length).map((b) => ({ value: String(b), label: `${num(b)} BTU` })) },
    { id: 'hrs', label: 'Hours a day it runs', def: 8, unit: 'h', max: 24 },
    { id: 'days', label: 'Days', def: 30, unit: 'days', max: 366 },
    STATE(),
  ].map((i) => (a[i.id] !== undefined ? { ...i, def: a[i.id] } as Input : i)),
  run: acRun,
});

/* ------------------------------------------------------------------ freezer, dehumidifier */
const FTYPES = [{ value: 'Upright Freezer', label: 'Upright' }, { value: 'Chest Freezer', label: 'Chest' }, { value: 'Compact', label: 'Compact' }];
function freezerRun(v: V): ToolOut {
  const list = FREEZERS.filter((x) => x.type === s(v, 'type') && x.vol >= n(v, 'vmin') && x.vol <= n(v, 'vmax'));
  const pool = list.length ? list : FREEZERS.filter((x) => x.type === s(v, 'type'));
  const st = stateBySlug(s(v, 'st'));
  const k = stats(pool.map((x) => x.kwh));
  return {
    label: 'Typical certified freezer, cost a year', value: usd(costYear(k.med, st)), sub: `${num(k.med)} kWh a year ${where(v)}`,
    rows: [
      ['Per month', usd2(costYear(k.med, st) / 12)],
      ['Average power draw', `${num((k.med / 8760) * 1000)} watts`],
      ['Models compared', `${num(k.n)}${list.length ? '' : ' (no model in that size: all sizes shown)'}`],
      ['Range among them', `${usd(costYear(k.min, st))} to ${usd(costYear(k.max, st))} a year`],
    ],
    note: 'The freezer list gives capacity and energy only, no dimensions.',
    example: 'Example for an upright freezer of 10 to 20 cu ft',
  };
}
const freezer = (a: Record<string, number | string> = {}): ToolSpec => ({
  inputs: [{ kind: 'select', id: 'type', label: 'Type', def: 'Upright Freezer', options: FTYPES }, { id: 'vmin', label: 'Capacity from', def: 10, unit: 'cu ft', max: 40, decimals: 1 }, { id: 'vmax', label: 'Capacity up to', def: 20, unit: 'cu ft', max: 40, decimals: 1 }, STATE()]
    .map((i) => (a[i.id] !== undefined ? { ...i, def: a[i.id] } as Input : i)),
  run: freezerRun,
});
const PINTS = [{ value: '0-25', label: 'Up to 25 pints a day' }, { value: '25-40', label: '25 to 40 pints' }, { value: '40-999', label: 'Over 40 pints' }];
function dehuRun(v: V): ToolOut {
  const [lo, hi] = s(v, 'pints').split('-').map(Number);
  const list = DEHUS.filter((x) => !x.whole && x.pints > lo && x.pints <= hi);
  const st = stateBySlug(s(v, 'st'));
  const k = stats(list.map((x) => x.kwh));
  const perH = dehuKwhPerHour(k.med), hours = n(v, 'hrs') * n(v, 'days');
  return {
    label: 'Running cost for the hours you enter', value: usd(perH * hours * st.now / 100), sub: `${num(n(v, 'hrs'))} hours a day for ${num(n(v, 'days'))} days ${where(v)}`,
    rows: [
      ['Per hour', usd2(perH * st.now / 100)],
      ['Energy per hour', `${num(perH, 2)} kWh (about ${num(perH * 1000)} watts)`],
      ['Certified portable models in that class', num(k.n)],
      ['Most frugal of them, same hours', usd(dehuKwhPerHour(k.min) * hours * st.now / 100)],
    ],
    note: 'The DOE test counts 1,095 hours of drying a year; a damp basement can run longer.',
    example: 'Example for a 25 to 40 pint unit, 12 hours a day for 30 days',
  };
}
const dehu = (a: Record<string, number | string> = {}): ToolSpec => ({
  inputs: [{ kind: 'select', id: 'pints', label: 'Size', def: '25-40', options: PINTS }, { id: 'hrs', label: 'Hours a day it runs', def: 12, unit: 'h', max: 24 }, { id: 'days', label: 'Days', def: 30, unit: 'days', max: 366 }, STATE()]
    .map((i) => (a[i.id] !== undefined ? { ...i, def: a[i.id] } as Input : i)),
  run: dehuRun,
});

/* ------------------------------------------------------------------ every appliance in one state */
/** The median certified model of each kind, used by the state comparison. */
export function typicalKwh() {
  const med = (xs: number[]) => median(xs);
  return [
    { id: 'fridge', label: 'Full-size refrigerator', kwh: med(fridges({ style: 'full' }).map((f: Fridge) => f.kwh)) },
    { id: 'freezer', label: 'Upright freezer', kwh: med(FREEZERS.filter((x) => x.type === 'Upright Freezer').map((x) => x.kwh)) },
    { id: 'washer', label: 'Clothes washer', kwh: med(washers().map((x) => x.kwh)) },
    { id: 'dryer', label: 'Electric dryer', kwh: med(dryers('electric').map((x) => x.kwh)) },
    { id: 'dish', label: 'Dishwasher', kwh: med(DISHES.map((x) => x.kwh)) },
  ];
}
function stateRun(v: V): ToolOut {
  const st = stateBySlug(s(v, 'st'));
  const t = typicalKwh();
  const total = t.reduce((a, x) => a + x.kwh, 0);
  return {
    label: `Five certified appliances, a year ${where(v)}`, value: usd(costYear(total, st)), sub: `${num(total)} kWh at ${num(st.now, 2)}¢, ${PRICE_MONTH} (${num(st.prev, 2)}¢ a year earlier)`,
    rows: t.map((x) => [`${x.label} (${num(x.kwh)} kWh)`, usd(costYear(x.kwh, st)), costYear(x.kwh, st)]),
    note: `At last year’s price the same set cost ${usd(costYear(total, { ...st, now: st.prev }))}.`,
    example: 'Example at the U.S. average price',
  };
}
const state = (a: Record<string, number | string> = {}): ToolSpec => ({ inputs: [STATE(String(a.st ?? 'us'))], run: stateRun });

type Arg = Record<string, number | string> | undefined;
const SPECS: Record<string, (a?: Arg) => ToolSpec> = {
  fridgeFit: (a) => fridgeFit(a), fridgeCost: (a) => fridgeCost(a), washer: (a) => washer(a), dryer: (a) => dryer(a), stack: (a) => stack(a),
  dish: (a) => dish(a), ac: (a) => ac(a), freezer: (a) => freezer(a), dehu: (a) => dehu(a), state: (a) => state(a),
};
export function getTool(kind: string, arg?: Arg): ToolSpec {
  const f = SPECS[kind];
  if (!f) throw new Error(`Unknown tool ${kind}`);
  return f(arg);
}
export const TOOL_KINDS = Object.keys(SPECS);
