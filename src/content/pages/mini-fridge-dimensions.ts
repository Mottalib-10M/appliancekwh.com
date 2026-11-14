import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const C = E.fridges({ style: 'compact' });
const k = K.s(C.map((f) => f.kwh)), hgt = K.s(C.map((f) => f.h)), wid = K.s(C.map((f) => f.w)), vol = K.s(C.map((f) => f.vol));
const band = (lo: number, hi: number) => C.filter((f) => f.vol >= lo && f.vol < hi);
const B = [[0, 2, 'Under 2 cu ft'], [2, 3.5, '2 to 3.5 cu ft'], [3.5, 5, '3.5 to 5 cu ft'], [5, 99, '5 cu ft or more']] as const;
const under = C.filter((f) => f.h <= 34 && f.w <= 20);
const bi = C.filter((f) => f.builtin);

export default definePage({
  id: 'mini-fridge-dimensions', group: 'fridge', order: 107, slug: 'mini-fridge-dimensions',
  nav: 'Mini fridge dimensions', card: 'Compact refrigerators by capacity: width, height, what fits under a counter and what one costs to run.',
  title: 'Mini Fridge Dimensions 2026: Compact Sizes and Running Cost',
  description: `Mini fridge dimensions in 2026: ${K.num(C.length)} certified compact refrigerators by capacity, their width and height, which fit under a counter, and yearly running cost.`,
  h1: 'Mini fridge dimensions: compact models by capacity',
  intro: `Mini fridge dimensions vary: the ENERGY STAR list holds ${K.num(C.length)} certified compact refrigerators. Enter the space under your desk or counter: the tool counts the ones that fit.`,
  resume: `Mini fridge dimensions depend on capacity, and the ENERGY STAR list of ${K.day(K.UPDATED)} shows the whole range: ${K.num(C.length)} certified compact refrigerators sold in the United States, from ${K.dec(vol.min)} to ${K.dec(vol.max)} cubic feet. The median model is ${K.inch(wid.med)} wide and ${K.inch(hgt.med)} tall and holds ${K.dec(vol.med)} cubic feet, the classic dorm size. Heights go from ${K.inch(hgt.min)} for a cube to ${K.inch(hgt.max)} for the tallest compact units. ${K.num(under.length)} models are at most 20 inches wide and 34 inches tall, the space under a standard counter or a desk. Compact refrigerators use little energy in absolute terms: a median ${K.num(k.med)} kWh a year, which costs ${K.usd(K.cost(k.med))} at the U.S. average price of ${K.MONTH}, or about ${K.usd2(K.cost(k.med) / 12)} a month. Per cubic foot, though, they use more than a full-size refrigerator. ${K.num(bi.length)} of them are built-in undercounter units with a front vent. Depth is not on the list.`,
  faqs: [
    { q: 'What are the dimensions of a standard mini fridge?', a: `There is no standard, but the middle of the list is ${K.inch(wid.med)} wide and ${K.inch(hgt.med)} tall for ${K.dec(vol.med)} cubic feet. Cube models under 2 cubic feet are much lower; models of 4 to 5 cubic feet stand around counter height. The table on this page gives the medians by capacity.` },
    { q: 'How many watts does a mini fridge use?', a: `The median certified compact refrigerator uses ${K.num(k.med)} kWh a year, an average draw of ${K.num((k.med / 8760) * 1000)} watts around the clock. The compressor draws more while it runs and nothing while it rests; the yearly kWh already averages that cycle. At the U.S. average price that is ${K.usd(K.cost(k.med))} a year.` },
    { q: 'Can a mini fridge go under a kitchen counter?', a: `A freestanding one can if it fits with air around it, since most vent at the back or the sides; ${K.num(under.length)} certified models are at most 20 inches wide and 34 inches tall. A built-in undercounter model vents at the front and can be enclosed. The list marks ${K.num(bi.length)} compact models as built-in.` },
  ],
  body: (h) => `
<h2>Mini fridge dimensions by capacity</h2>
<p>Compact refrigerators are sold by cubic feet, but the space you have is measured in inches. The table turns one into the other with the medians of the certified models in each capacity band. Use it to see what size to look for, then the tool above for the exact count.</p>
${h.table(['Capacity', 'Models', 'Typical width', 'Typical height', 'Typical kWh a year', 'Cost a year'], B.map(([lo, hi, l]) => { const a = band(lo, hi); const m = K.s(a.map((f) => f.kwh)).med; return [l, K.num(a.length), a.length ? K.inch(K.s(a.map((f) => f.w)).med) : 'none', a.length ? K.inch(K.s(a.map((f) => f.h)).med) : 'none', a.length ? K.num(m) : 'none', a.length ? K.usd(K.cost(m)) : 'none']; }), `Certified compact refrigerators, ENERGY STAR list of ${K.day(K.UPDATED)}; EIA U.S. average, ${K.MONTH}.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Under a desk, a counter or a bar</h2>
<p>Measure the height from the floor to the underside of the counter or desk, the width between the cabinet sides or the desk legs, and the depth you can give up. A freestanding mini fridge needs some air at the back and sides to shed heat; pushing it into a tight niche makes the compressor run longer and raises the real energy use above the label. Undercounter built-in units are designed for the niche, with the vent at the front.</p>
${h.mini('fridgeFit', { t: 'Compact models that fit under your counter', p: ['w', 'h'], d: { w: 20, h: 34, style: 'compact' } })}
<h2>What a mini fridge costs to run</h2>
<p>At ${K.num(k.med)} kWh a year, the median certified compact model costs ${K.usd(K.cost(k.med))} a year at the U.S. average price, ${K.usd(K.cost(k.med, K.st('hawaii')))} in Hawaii and ${K.usd(K.cost(k.med, K.st('louisiana')))} in Louisiana. The range on the list goes from ${K.num(k.min)} to ${K.num(k.max)} kWh. Models with a separate freezer door sit in other federal classes than single-door models, with their own maximum. A second refrigerator in a garage or basement is a different case: the ${h.a('refrigerator-electricity-use', 'refrigerator electricity page')} explains why a room's temperature changes the figure.</p>
<h2>Compact or a narrow full-size model</h2>
<p>Above about 5 cubic feet, a compact refrigerator competes with narrow full-size models. If the space is 24 inches wide and free to the ceiling, a ${h.a('24-inch-refrigerator', '24 inch refrigerator')} holds two to three times as much for a little more energy. For a studio or a rental kitchen, the ${h.a('apartment-size-refrigerator', 'apartment size page')} compares both formats.</p>
`,
  tool: 'fridgeFit', toolArg: { w: 20, h: 34, style: 'compact' },
  related: ['apartment-size-refrigerator', '24-inch-refrigerator', 'refrigerator-electricity-use', 'freezer-electricity-use'],
  sources: ['es_fridge', 'eia_56a'],
});
