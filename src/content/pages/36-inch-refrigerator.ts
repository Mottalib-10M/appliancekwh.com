import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const L = E.widthClass(36);
const k = K.s(L.map((f) => f.kwh)), hgt = K.s(L.map((f) => f.h)), vol = K.s(L.map((f) => f.vol));
const grp = (t: string) => L.filter((f) => f.type === t);
const bot = grp('Bottom Freezer'), side = grp('Side-by-Side'), single = grp('Freezerless and Single Door');
const kb = K.s(bot.map((f) => f.kwh)), ks = K.s(side.map((f) => f.kwh));
const cd = L.filter((f) => f.cd), bi = L.filter((f) => f.builtin);
const at70 = L.filter((f) => f.h <= 70);
const lean = [...L].sort((a, b) => a.kwh - b.kwh)[0];
const ORD = ['the largest', 'the second largest', 'the third largest', 'the fourth largest', 'the fifth largest'];
const rank = (n: number) => ORD[[24, 28, 30, 33, 36].map((x) => ({ x, c: E.widthClass(x).length })).sort((a, b) => b.c - a.c).findIndex((r) => r.x === n)];

export default definePage({
  id: '36-inch-refrigerator', group: 'fridge', order: 106, slug: '36-inch-refrigerator',
  nav: '36 inch refrigerator', card: 'The widest common format: French door, side-by-side and built-in models, their heights and energy use.',
  title: '36 Inch Refrigerator 2026: French Door, Side-by-Side, kWh',
  description: `36 inch refrigerator options in 2026: ${K.num(L.length)} certified models, bottom-freezer and French door versus side-by-side energy, heights, capacity and cost by state.`,
  h1: '36 inch refrigerator: what the widest common size uses',
  intro: `${K.num(L.length)} certified full-size refrigerators are about 36 inches wide, ${rank(36)} width class on the list. Enter your height: the tool counts the ones that fit.`,
  resume: `The 36 inch refrigerator is the large-kitchen format, and the ENERGY STAR list of ${K.day(K.UPDATED)} holds ${K.num(L.length)} full-size models wider than 35 and up to 36.5 inches. Almost all are bottom-freezer models, a group that includes French door designs (${K.num(bot.length)}), followed by side-by-side models (${K.num(side.length)}) and refrigerators without a freezer (${K.num(single.length)}). They hold a median ${K.dec(vol.med)} cubic feet and stand a median ${K.inch(hgt.med)} tall, from ${K.inch(hgt.min)} to ${K.inch(hgt.max)}. This is also where energy use peaks: the median model uses ${K.num(k.med)} kWh a year, ${K.usd(K.cost(k.med))} at the U.S. average price of ${K.MONTH}. Side-by-side models use a median ${K.num(ks.med)} kWh against ${K.num(kb.med)} for bottom-freezer ones. ${K.num(cd.length)} models of this width are counter-depth and ${K.num(bi.length)} are built-in. The most frugal certified 36 inch model, the ${lean.brand} ${lean.model}, uses ${K.num(lean.kwh)} kWh a year.`,
  faqs: [
    { q: 'How tall is a 36 inch refrigerator?', a: `The median certified model of that width is ${K.inch(hgt.med)} tall. ${K.num(at70.length)} of the ${K.num(L.length)} models stand 70 inches or less, which matters under a cabinet. Built-in models are often taller, up to ${K.inch(hgt.max)}, and need a cutout made for them.` },
    { q: 'Does a French door refrigerator use more electricity than a side-by-side?', a: `On the list, less. The ENERGY STAR file puts French door models with bottom-freezer ones, whose median at this width is ${K.num(kb.med)} kWh a year; the median side-by-side uses ${K.num(ks.med)}. At the U.S. average price that gap is ${K.usd(K.cost(ks.med - kb.med))} a year.` },
    { q: 'Will a 36 inch refrigerator fit through my door?', a: 'Width is rarely the problem, depth is. Doors and handles can usually be removed, and the case then passes on its depth, which the ENERGY STAR list does not give. Read the depth without doors on the model sheet and compare it with the narrowest doorway on the delivery path.' },
  ],
  body: (h) => `
<h2>36 inch refrigerator layouts compared</h2>
<p>At this width the choice is between three layouts, and the list shows a clear difference in energy. The table gives the count, height, capacity and yearly use of each. French door models, two doors over a freezer drawer, are filed with bottom-freezer models; the list does not separate them.</p>
${h.table(['Layout', 'Models', 'Median height', 'Median capacity', 'Median kWh a year', 'Cost a year'], [[bot, 'Bottom freezer and French door'], [side, 'Side-by-side'], [single, 'No freezer']].filter(([x]) => (x as typeof L).length).map(([x, l]) => { const a = x as typeof L; const m = K.s(a.map((f) => f.kwh)).med; return [l as string, K.num(a.length), K.inch(K.s(a.map((f) => f.h)).med), `${K.dec(K.s(a.map((f) => f.vol)).med)} cu ft`, K.num(m), K.usd(K.cost(m))]; }), `Certified full-size models wider than 35 and up to 36.5 inches, list of ${K.day(K.UPDATED)}; EIA U.S. average, ${K.MONTH}.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Why wide models use more</h2>
<p>A larger box has more wall to lose cold through, and wide models carry the features that cost energy: through-the-door ice and water and automatic ice makers. The federal maximum grows with the adjusted volume of the refrigerator, so a certified 36 inch model can use more than a certified 30 inch one and still beat its own standard. When you compare two wide models, the yearly kWh on the yellow label is the figure to read; the ${h.a('refrigerator-electricity-use', 'electricity page')} explains it.</p>
${h.mini('fridgeCost', { t: 'Yearly cost of a 36 inch refrigerator in your state', p: ['style', 'st'], d: { style: 'side', band: 'all', cls: 36 } })}
<h2>Height and depth in a 36 inch opening</h2>
<p>Most kitchens with a 36 inch opening also have a cabinet above it. With a median height of ${K.inch(hgt.med)}, many models clear a 70 inch space, but not all: ${K.num(at70.length)} do. Depth is the other limit. A standard-depth 36 inch model stands out past the counter, sometimes by several inches with the handles; the ${h.a('counter-depth-refrigerator-dimensions', 'counter-depth page')} lists the ${K.num(cd.length)} shallower models of this width. Built-in models (${K.num(bi.length)}) sit flush with the cabinets but need their own cutout.</p>
<h2>Running cost by state</h2>
<p>The median 36 inch model, at ${K.num(k.med)} kWh a year, costs ${K.usd(K.cost(k.med, K.st('california')))} in California, ${K.usd(K.cost(k.med, K.st('illinois')))} in Illinois and ${K.usd(K.cost(k.med, K.st('north-carolina')))} in North Carolina at the prices of ${K.MONTH}. Over the life of a refrigerator the gap between the most frugal and the hungriest model of this width adds up: ${K.num(k.min)} kWh against ${K.num(k.max)} a year. For a slightly narrower opening, see the ${h.a('33-inch-wide-refrigerator', '33 inch class')}.</p>
`,
  tool: 'fridgeFit', toolArg: { w: 36.5, h: 70, cls: 36 },
  related: ['counter-depth-refrigerator-dimensions', '33-inch-wide-refrigerator', 'refrigerator-electricity-use', 'how-to-measure-for-a-refrigerator'],
  sources: ['es_fridge', 'eia_56a', 'cfr_430'],
});
