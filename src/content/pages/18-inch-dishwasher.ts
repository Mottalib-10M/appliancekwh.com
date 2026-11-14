import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const L = E.dishClass(18), W = E.dishClass(24);
const w = K.s(L.map((x) => x.w)), d = K.s(L.map((x) => x.d)), p = K.s(L.map((x) => x.place)), k = K.s(L.map((x) => x.kwh)), g = K.s(L.map((x) => x.gal));
const pw = K.s(W.map((x) => x.place)).med, kw = K.s(W.map((x) => x.kwh)).med, gw = K.s(W.map((x) => x.gal)).med;
const brands = [...new Set(L.map((x) => x.brand))].length;
const perSet = (kwh: number, n: number) => kwh / n;

export default definePage({
  id: '18-inch-dishwasher', group: 'kitchen', order: 303, slug: '18-inch-dishwasher',
  nav: '18 inch dishwasher', card: 'The narrow dishwasher: certified models, depth, place settings and energy per place setting against a 24 inch one.',
  title: '18 Inch Dishwasher 2026: Narrow Models, Capacity and kWh',
  description: `18 inch dishwasher choices in 2026: ${K.num(L.length)} certified narrow models, their width, depth and place settings, kWh a year against a 24 inch model, and cost by state.`,
  h1: '18 inch dishwasher: the narrow format, measured',
  intro: `${K.num(L.length)} certified dishwashers on the ENERGY STAR list are about 18 inches wide. Enter your opening: the tool counts the ones that fit and prices their energy.`,
  resume: `An 18 inch dishwasher is the narrow built-in format for small kitchens. The ENERGY STAR list of ${K.day(K.UPDATED)} holds ${K.num(L.length)} certified models from ${K.num(brands)} brands wider than 16.5 and up to 18.5 inches. They measure a median ${K.inch(w.med)} wide and ${K.inch(d.med)} deep and hold ${K.num(p.med)} place settings, against ${K.num(pw)} for the median 24 inch model. They do not save much energy: a median ${K.num(k.med)} kWh a year against ${K.num(kw)} for a 24 inch model, and ${K.dec(g.med)} gallons of water a cycle against ${K.dec(gw)}. Per place setting, the narrow model uses more: ${K.dec(perSet(k.med, p.med))} kWh a year for each setting it holds, against ${K.dec(perSet(kw, pw))} for the 24 inch model. At the U.S. average home price of ${K.MONTH}, the median 18 inch dishwasher costs ${K.usd(K.cost(k.med))} a year to run. Choose it for the space it saves, not for the energy. The list gives no height; like 24 inch models, these fit under a standard counter.`,
  faqs: [
    { q: 'How many place settings does an 18 inch dishwasher hold?', a: `A median of ${K.num(p.med)} on the certified list, from ${K.num(p.min)} to ${K.num(p.max)}. A 24 inch model holds a median ${K.num(pw)}. Fewer settings mean that a household with many dishes runs it more often, which adds cycles and energy across the year. The tool lists the models with the most settings among those that fit.` },
    { q: 'Does an 18 inch dishwasher use less electricity?', a: `Barely. The median certified 18 inch model uses ${K.num(k.med)} kWh a year, the median 24 inch model ${K.num(kw)}. Because it holds fewer dishes, the narrow model uses more energy per place setting; two half loads in it cost more than one full load in a wider machine.` },
    { q: 'How deep is an 18 inch dishwasher?', a: `The median certified model is ${K.inch(d.med)} deep, from ${K.inch(d.min)} to ${K.inch(d.max)}, close to the 24 inch models. The narrow format saves width, not depth, so it lines up with the same cabinets. The tool filters by depth as well as width.` },
  ],
  body: (h) => `
<h2>18 inch dishwasher against the 24 inch size</h2>
<p>The table sets the two built-in widths side by side, with the medians of the certified models. The capacity and energy columns show the trade: six inches less width costs about a third of the dishes and saves little energy.</p>
${h.table(['', '18 inch class', '24 inch class'], [['Certified models', K.num(L.length), K.num(W.length)], ['Typical width', K.inch(w.med), K.inch(K.s(W.map((x) => x.w)).med)], ['Typical depth', K.inch(d.med), K.inch(K.s(W.map((x) => x.d)).med)], ['Typical place settings', K.num(p.med), K.num(pw)], ['Typical kWh a year', K.num(k.med), K.num(kw)], ['Water per cycle', `${K.dec(g.med)} gal`, `${K.dec(gw)} gal`], ['kWh a year per place setting', K.dec(perSet(k.med, p.med)), K.dec(perSet(kw, pw))]], `ENERGY STAR certified dishwashers, list of ${K.day(K.UPDATED)}.`, ['l', 'r', 'r'])}
<h2>When the narrow model is the right choice</h2>
<p>An 18 inch dishwasher makes sense when the kitchen has no 24 inch space to give: a galley, a studio, a kitchen where a 24 inch base cabinet is more useful as storage. It also suits a household that runs it rarely with few dishes. A family that would run a narrow model twice a day is better served by a 24 inch one run once, which the per-setting figure in the table shows.</p>
${h.mini('dish', { t: 'If you can free 24 inches: 24 inch models for your depth', p: ['d'], d: { w: 24, d: 24, cls: 24 } })}
<h2>Fitting an 18 inch model</h2>
<p>Measure the opening between the cabinet sides at the narrowest point, the depth from the wall to the front of the cabinets and the height to the underside of the counter, which the list does not give and the model sheet does. Water, drain and power usually come through the cabinet beside it. Replacing a 24 inch dishwasher with an 18 inch one leaves a six inch gap that a filler panel or a narrow pull-out cabinet can close.</p>
<h2>Running cost</h2>
<p>At the prices homes paid in ${K.MONTH}, the median narrow model's ${K.num(k.med)} kWh a year cost ${K.usd(K.cost(k.med, K.st('hawaii')))} in Hawaii, ${K.usd(K.cost(k.med, K.st('pennsylvania')))} in Pennsylvania and ${K.usd(K.cost(k.med, K.st('nevada')))} in Nevada. The ${h.a('dishwasher-electricity-use', 'dishwasher electricity page')} explains the yearly figure; the ${h.a('24-inch-dishwasher', '24 inch page')} lists the wider models by depth.</p>
`,
  tool: 'dish', toolArg: { w: 18, d: 24, cls: 18 },
  related: ['24-inch-dishwasher', 'dishwasher-dimensions', 'dishwasher-electricity-use', 'apartment-size-refrigerator'],
  sources: ['es_dish', 'eia_56a'],
});
