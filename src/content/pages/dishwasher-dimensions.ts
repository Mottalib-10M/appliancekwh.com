import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const D = E.DISHES;
const w = K.s(D.map((x) => x.w)), d = K.s(D.map((x) => x.d)), p = K.s(D.map((x) => x.place)), k = K.s(D.map((x) => x.kwh));
const c24 = E.dishClass(24), c18 = E.dishClass(18);
const other = D.filter((x) => !c24.includes(x) && !c18.includes(x));
const fit2424 = E.dishFit(24, 24).length;
const deep = D.filter((x) => x.d > 24).length;

export default definePage({
  id: 'dishwasher-dimensions', group: 'kitchen', order: 301, slug: 'dishwasher-dimensions',
  nav: 'Dishwasher dimensions', card: 'Width and depth of certified dishwashers, 18 and 24 inch, place settings and running cost.',
  title: 'Dishwasher Dimensions 2026: Standard Size, Width and Depth',
  description: `Dishwasher dimensions in 2026: width and depth of ${K.num(D.length)} certified dishwashers, the 24 and 18 inch sizes, place settings, kWh a year and how many fit your cabinet.`,
  h1: 'Dishwasher dimensions: the standard size and the narrow one',
  intro: `${K.num(c24.length)} of the ${K.num(D.length)} certified dishwashers kept here are about 24 inches wide. Enter your opening: the tool counts the models that fit.`,
  resume: `Standard dishwasher dimensions are set by the cabinet: almost every built-in model is made for an opening about 24 inches wide under a counter. On the ENERGY STAR list of ${K.day(K.UPDATED)}, ${K.num(c24.length)} of the ${K.num(D.length)} certified dishwashers with plausible sizes sit in the 24 inch class and ${K.num(c18.length)} in the 18 inch class, the narrow format for small kitchens; ${K.num(other.length)} have other widths. The median model is ${K.inch(w.med)} wide and ${K.inch(d.med)} deep, and holds ${K.num(p.med)} place settings. The list gives no height, which is set by the opening under a standard counter. An opening 24 inches wide and 24 deep takes ${K.num(fit2424)} certified models; ${K.num(deep)} are deeper than 24 inches. Energy use is close across the list: a median ${K.num(k.med)} kWh a year, ${K.usd(K.cost(k.med))} at the U.S. average price of ${K.MONTH}. ${K.num(E.DISH_EXCLUDED)} rows whose sizes were entered in another unit are left out.`,
  faqs: [
    { q: 'What is the standard size of a dishwasher?', a: `About 24 inches wide for a built-in model: ${K.num(c24.length)} certified dishwashers are in that class. The median depth on the list is ${K.inch(d.med)}. Height is not on the list; built-in models are made to slide under a counter and adjust with their feet.` },
    { q: 'How deep is a dishwasher?', a: `The median certified dishwasher is ${K.inch(d.med)} deep, from ${K.inch(d.min)} to ${K.inch(d.max)}. That is the tub and the door closed. The door needs room in front to open flat, and a dishwasher next to a corner needs the door to clear the adjacent cabinet or drawer handles.` },
    { q: 'Can I replace a 24 inch dishwasher with an 18 inch one?', a: `You can, with a filler panel or a narrow cabinet to close the gap, but you lose capacity: a median ${K.num(K.s(c18.map((x) => x.place)).med)} place settings against ${K.num(K.s(c24.map((x) => x.place)).med)}. Going the other way needs six more inches of cabinet width. Plumbing and power usually stay where they are.` },
  ],
  body: (h) => `
<h2>Dishwasher dimensions by width class</h2>
<p>The list publishes the width and depth of each certified dishwasher, its capacity in place settings and its yearly energy. The table groups them by the two standard widths.</p>
${h.table(['Class', 'Models', 'Median width', 'Median depth', 'Median place settings', 'Median kWh a year'], [['24 inch', c24], ['18 inch', c18]].map(([l, a]) => { const x = a as typeof D; return [l as string, K.num(x.length), K.inch(K.s(x.map((y) => y.w)).med), K.inch(K.s(x.map((y) => y.d)).med), K.num(K.s(x.map((y) => y.place)).med), K.num(K.s(x.map((y) => y.kwh)).med)]; }), `Certified residential dishwashers, ENERGY STAR list of ${K.day(K.UPDATED)}.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Height: what the list leaves out</h2>
<p>The ENERGY STAR dishwasher list publishes no height. Built-in dishwashers are designed for the space under a counter and have leveling feet to adjust; the model sheet gives the range of heights it accepts. Measure from the floor to the underside of the counter, at the front and at the back, and compare with that range. A new floor laid over the old one raises the floor and can close the gap.</p>
${h.mini('dish', { t: 'Dishwashers that fit your cabinet', p: ['w', 'd'], d: { w: 24, d: 24 } })}
<h2>Measuring the opening</h2>
<p>Width: between the cabinet sides at the narrowest point. Depth: from the wall to the front of the cabinets, not the counter edge, so the door lines up with the cabinet doors. Then check what is behind: the water supply, the drain and the power, which often run through a cabinet next to the dishwasher. If the dishwasher sits next to a corner or a range, check that its door opens without hitting a handle.</p>
<h2>Energy across sizes</h2>
<p>Certified dishwashers use similar amounts of energy whatever their size, because the federal test sets the yearly figure for a fixed number of cycles (${K.num(K.P.test.dishCyclesC1)} or ${K.num(K.P.test.dishCyclesC2)} a year depending on the test version, ${h.src('cfr_430', '10 CFR 430')}). At the U.S. average price the median model costs ${K.usd(K.cost(k.med))} a year to run. The detail is on the ${h.a('dishwasher-electricity-use', 'dishwasher electricity page')}, and each width has its page: ${h.a('24-inch-dishwasher', '24 inch')} and ${h.a('18-inch-dishwasher', '18 inch')}.</p>
`,
  tool: 'dish',
  related: ['24-inch-dishwasher', '18-inch-dishwasher', 'dishwasher-electricity-use', 'refrigerator-electricity-use'],
  sources: ['es_dish', 'eia_56a', 'cfr_430'],
});
