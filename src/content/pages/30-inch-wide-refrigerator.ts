import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const L = E.widthClass(30);
const k = K.s(L.map((f) => f.kwh)), hgt = K.s(L.map((f) => f.h)), vol = K.s(L.map((f) => f.vol));
const top = L.filter((f) => f.type === 'Top Freezer'), bot = L.filter((f) => f.type === 'Bottom Freezer');
const kt = K.s(top.map((f) => f.kwh)), kb = K.s(bot.map((f) => f.kwh));
const fit = (hh: number) => L.filter((f) => f.h <= hh).length;
const exact30 = L.filter((f) => f.w > 29.75).length;
const bi = L.filter((f) => f.builtin);
const brands = [...new Set(L.map((f) => f.brand))].length;
const share = L.length / E.fridges({ style: 'full' }).length;
const ORD = ['the largest', 'the second largest', 'the third largest', 'the fourth largest', 'the fifth largest'];
const rank = (n: number) => ORD[[24, 28, 30, 33, 36].map((x) => ({ x, c: E.widthClass(x).length })).sort((a, b) => b.c - a.c).findIndex((r) => r.x === n)];

export default definePage({
  id: '30-inch-wide-refrigerator', group: 'fridge', order: 104, slug: '30-inch-wide-refrigerator',
  nav: '30 inch refrigerator', card: 'A very common width: how many certified models, which heights, top or bottom freezer, and the running cost.',
  title: '30 Inch Wide Refrigerator 2026: Heights, Styles and kWh',
  description: `30 inch wide refrigerator guide for 2026: ${K.num(L.length)} certified models, how many fit under 66, 67 or 68 inches, top versus bottom freezer energy and cost by state.`,
  h1: '30 inch wide refrigerator: how many fit your height',
  intro: `${K.num(L.length)} certified full-size refrigerators are about 30 inches wide, ${rank(30)} width class on the list. Enter your height to narrow them down.`,
  resume: `The 30 inch wide refrigerator is ${rank(30)} width class on the list: ${K.num(L.length)} full-size certified models from ${K.num(brands)} brands are wider than 29 and up to 30.5 inches, ${K.pct(share)} of all full-size models on the ENERGY STAR list of ${K.day(K.UPDATED)}. Height is the real filter. ${K.num(fit(66))} of them stand 66 inches or less, ${K.num(fit(67))} at most 67 inches and ${K.num(fit(68))} at most 68 inches; the median is ${K.inch(hgt.med)}. Capacity runs from ${K.dec(vol.min)} to ${K.dec(vol.max)} cubic feet, median ${K.dec(vol.med)}. The class is split between top-freezer models (${K.num(top.length)}) and bottom-freezer ones (${K.num(bot.length)}), and the split shows in energy use. The median top-freezer model uses ${K.num(kt.med)} kWh a year and the median bottom-freezer model ${K.num(kb.med)}. At the U.S. average price of ${K.MONTH}, that is ${K.usd(K.cost(kt.med))} against ${K.usd(K.cost(kb.med))} a year.`,
  faqs: [
    { q: 'Will a 30 inch refrigerator fit in a 30 inch opening?', a: `Usually, because most models of this class measure a little under 30 inches; ${K.num(exact30)} of the ${K.num(L.length)} certified models are wider than 29.75 inches. Leave the side gap the installation guide asks for, and check the door swing if one side is against a wall. Enter that gap in the tool's optional field to see the count change.` },
    { q: 'What is the typical height of a 30 inch wide refrigerator?', a: `The median certified model is ${K.inch(hgt.med)} tall. Heights run from ${K.inch(hgt.min)} to ${K.inch(hgt.max)}. Top-freezer models are usually lower than bottom-freezer ones, so a low cabinet above the opening often points to a top-freezer model. Measure the opening before choosing a style.` },
    { q: 'Top freezer or bottom freezer: which costs less to run?', a: `On the list, top freezer. The median certified top-freezer model of this width uses ${K.num(kt.med)} kWh a year, the median bottom-freezer model ${K.num(kb.med)}. The gap is worth ${K.usd(K.cost(kb.med - kt.med))} a year at the U.S. average price, more in a state with costly power.` },
  ],
  body: (h) => `
<h2>30 inch wide refrigerator heights, counted</h2>
<p>With so many models in this width, the useful question is not whether a 30 inch refrigerator exists but how many fit under your cabinet. The table counts the certified models at each height limit. Pick the line that matches the clearance you measured, then use the tool above for the exact figure and the list of the largest models that fit.</p>
${h.table(['Height limit', 'Models that fit', 'Typical capacity of those', 'Typical kWh a year'], [64, 66, 67, 68, 70, 72].map((hh) => { const t = K.typFridge(L.filter((f) => f.h <= hh)); return [`${hh} inches`, K.num(t.n), t.n ? `${K.dec(t.vol)} cu ft` : 'none', t.n ? K.num(t.kwh) : 'none']; }), `Full-size certified models wider than 29 and up to 30.5 inches, list of ${K.day(K.UPDATED)}.`, ['l', 'r', 'r', 'r'])}
<p>Each inch of height you can free adds models and capacity. If the cabinet above the opening can be removed or raised, measure the new clearance before you shop; the count can double.</p>
<h2>Top freezer or bottom freezer at 30 inches</h2>
<p>The two layouts share the class almost evenly, but they do not cost the same to run. A top-freezer refrigerator is the most frugal layout on the list. A bottom-freezer model, French door models included, puts the fresh food at eye level and the freezer in a drawer; it usually adds an ice maker and a few inches of height. The tool's style menu filters either one.</p>
${h.mini('fridgeCost', { t: 'Yearly cost of a 30 inch model in your state', p: ['style', 'st'], d: { style: 'bottom', band: 'all', cls: 30 } })}
<h2>Built-in and panel-ready 30 inch models</h2>
<p>${K.num(bi.length)} models of this width are built-in, meant to sit flush in cabinetry. They need the exact cutout the maker prints, often taller than a freestanding opening, and are not interchangeable with freestanding units of the same width. If you are replacing a built-in model, measure the cutout, not the old refrigerator, and compare with the maker's sheet.</p>
<h2>What it costs to run where you live</h2>
<p>The median 30 inch model, every height together, uses ${K.num(k.med)} kWh a year and costs ${K.usd(K.cost(k.med))} a year at the U.S. average price (the tool above gives the typical model under your height), ${K.usd(K.cost(k.med, K.st('connecticut')))} in Connecticut and ${K.usd(K.cost(k.med, K.st('oklahoma')))} in Oklahoma, with the prices of ${K.MONTH}. For more room, the ${h.a('33-inch-wide-refrigerator', '33 inch class')} holds a median ${K.dec(K.s(E.widthClass(33).map((f) => f.vol)).med)} cubic feet; for a shallow fit, see the ${h.a('counter-depth-refrigerator-dimensions', 'counter-depth models')}.</p>
`,
  tool: 'fridgeFit', toolArg: { w: 30.5, h: 67, cls: 30 },
  related: ['33-inch-wide-refrigerator', '28-inch-wide-refrigerator', 'counter-depth-refrigerator-dimensions', 'refrigerator-electricity-use'],
  sources: ['es_fridge', 'eia_56a'],
});
