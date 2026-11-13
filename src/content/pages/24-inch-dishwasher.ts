import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const L = E.dishClass(24);
const w = K.s(L.map((x) => x.w)), d = K.s(L.map((x) => x.d)), p = K.s(L.map((x) => x.place)), k = K.s(L.map((x) => x.kwh)), g = K.s(L.map((x) => x.gal));
const brands = [...new Set(L.map((x) => x.brand))].length;
const shallow = L.filter((x) => x.d <= 23).length;
const big = L.filter((x) => x.place >= 16).length;
const top = [...new Map(L.map((x) => [x.brand, 0])).keys()].map((b) => ({ b, n: L.filter((x) => x.brand === b).length })).sort((a, b) => b.n - a.n).slice(0, 6);

export default definePage({
  id: '24-inch-dishwasher', group: 'kitchen', order: 302, slug: '24-inch-dishwasher',
  nav: '24 inch dishwasher', card: 'The standard built-in dishwasher: how many certified models, their depth, place settings, water and energy.',
  title: '24 Inch Dishwasher 2026: Certified Models, Depth and kWh',
  description: `24 inch dishwasher options in 2026: ${K.num(L.length)} certified models, their exact width and depth, place settings, water per cycle, kWh a year and running cost by state.`,
  h1: '24 inch dishwasher: every certified model by depth and capacity',
  intro: `The ENERGY STAR list holds ${K.num(L.length)} certified 24 inch dishwashers from ${K.num(brands)} brands. Enter your cabinet depth: the tool keeps the ones that fit.`,
  resume: `The 24 inch dishwasher is the most common size, and it dominates the ENERGY STAR list of ${K.day(K.UPDATED)}: ${K.num(L.length)} certified models from ${K.num(brands)} brands are wider than 22.5 and up to 24.5 inches. Their real width is a median ${K.inch(w.med)}, a little under the nominal size so they slide into a 24 inch opening. Depth decides the fit with the cabinets: the median model is ${K.inch(d.med)} deep, from ${K.inch(d.min)} to ${K.inch(d.max)}, and ${K.num(shallow)} models are 23 inches deep or less. Capacity is a median ${K.num(p.med)} place settings; ${K.num(big)} models hold 16 or more. Water use is low: a median ${K.dec(g.med)} gallons per cycle. Energy is a median ${K.num(k.med)} kWh a year, from ${K.num(k.min)} to ${K.num(k.max)}, which costs ${K.usd(K.cost(k.med))} at the U.S. average home price of ${K.MONTH} and ${K.usd(K.cost(k.med, K.st('california')))} in California. The list gives no height: built-in models adjust to the space under a counter with their feet, within a range printed on each model sheet.`,
  faqs: [
    { q: 'Will a 24 inch dishwasher fit a 24 inch opening?', a: `Yes, that is what it is made for: the median certified 24 inch model is ${K.inch(w.med)} wide, a little narrower than its opening. Check the depth too: the median is ${K.inch(d.med)}, and the door should line up with your cabinet doors, not the counter edge.` },
    { q: 'How many place settings does a 24 inch dishwasher hold?', a: `A median of ${K.num(p.med)} on the certified list, from ${K.num(p.min)} to ${K.num(p.max)}. ${K.num(big)} models hold 16 or more. A place setting is a standard set of dishes defined for the test, so compare models on the same measure. More settings mean fewer cycles for the same dishes.` },
    { q: 'How much does a 24 inch dishwasher cost to run?', a: `The median certified model uses ${K.num(k.med)} kWh a year: ${K.usd(K.cost(k.med))} at the U.S. average price of ${K.MONTH}. The yearly figure assumes the number of cycles set by the federal test; washing every day or using the hottest cycles raises it.` },
  ],
  body: (h) => `
<h2>24 inch dishwasher depth, counted</h2>
<p>With so many models in one width, depth is the useful filter. The table counts the certified 24 inch models at each depth limit, so you can see how many remain if your cabinets are shallow or your counter is deep.</p>
${h.table(['Depth limit', 'Models that fit', 'Median place settings', 'Median kWh a year'], [22, 23, 23.5, 24, 24.5, 25].map((x) => { const a = L.filter((y) => y.d <= x); return [K.inch(x), K.num(a.length), a.length ? K.num(K.s(a.map((y) => y.place)).med) : 'none', a.length ? K.num(K.s(a.map((y) => y.kwh)).med) : 'none']; }), `Certified dishwashers wider than 22.5 and up to 24.5 inches, ENERGY STAR list of ${K.day(K.UPDATED)}.`, ['l', 'r', 'r', 'r'])}
<h2>Brands on the list</h2>
<p>The brands with the most certified 24 inch models are ${top.map((x) => `${x.b} (${K.num(x.n)})`).join(', ')}. A count of certified models says how much choice a brand offers in this size, not which one is better; many entries are variants of the same machine in different colors or panels. The tool lists the models with the most place settings among those that fit.</p>
${h.mini('dish', { t: '24 inch dishwashers for your cabinet depth', p: ['d', 'st'], d: { w: 24, d: 24 } })}
<h2>Height and the counter</h2>
<p>The list has no height for dishwashers. A standard built-in model fits under a standard counter with its feet adjusted; the model sheet gives the minimum and maximum. In a kitchen with a thick stone counter, a raised floor or a counter lower than usual, measure the opening and check that range.</p>
<h2>Water, energy and cost</h2>
<p>Certified 24 inch models use a median ${K.dec(g.med)} gallons of water a cycle. Energy covers the heating of the water inside the machine and the drying. At the prices of ${K.MONTH}, the median model's ${K.num(k.med)} kWh a year cost ${K.usd(K.cost(k.med, K.st('new-jersey')))} in New Jersey and ${K.usd(K.cost(k.med, K.st('idaho')))} in Idaho. For a narrow kitchen, see the ${h.a('18-inch-dishwasher', '18 inch dishwasher')}; for all sizes, the ${h.a('dishwasher-dimensions', 'dishwasher dimensions page')}.</p>
<p>Compare models that fit your depth by place settings first, then by the kWh column: the gaps in energy between certified 24 inch models are small.</p>
`,
  tool: 'dish', toolArg: { w: 24, d: 24 },
  related: ['18-inch-dishwasher', 'dishwasher-dimensions', 'dishwasher-electricity-use', 'counter-depth-refrigerator-dimensions'],
  sources: ['es_dish', 'eia_56a'],
});
