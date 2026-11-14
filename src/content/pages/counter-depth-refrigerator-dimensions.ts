import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const cd = E.fridges({ style: 'full', cd: 'yes' });
const std = E.fridges({ style: 'full', cd: 'no' });
const kc = K.s(cd.map((f) => f.kwh)), ks = K.s(std.map((f) => f.kwh));
const vc = K.s(cd.map((f) => f.vol)), vs = K.s(std.map((f) => f.vol));
const builtin = cd.filter((f) => f.builtin);
const free = cd.filter((f) => !f.builtin);
const widths = [24, 30, 33, 36].map((n) => ({ n, list: cd.filter((f) => f.w > n - 1 && f.w <= n + 0.5) }));
const fit36 = E.fridges({ style: 'full', cd: 'yes', maxW: 36, maxH: 70 });

export default definePage({
  id: 'counter-depth-refrigerator-dimensions', group: 'fridge', order: 101, slug: 'counter-depth-refrigerator-dimensions',
  nav: 'Counter-depth refrigerator dimensions', card: 'Which counter-depth models fit your opening, how much space you give up, and what they cost to run.',
  title: 'Counter-Depth Refrigerator Dimensions 2026: Real Models',
  description: `Counter-depth refrigerator dimensions in 2026: ${K.num(cd.length)} certified full-size models, their widths, heights, capacity and kWh, and how many fit your opening.`,
  h1: 'Counter-depth refrigerator dimensions: the certified models',
  intro: `${K.num(cd.length)} full-size refrigerators on the ENERGY STAR list are counter-depth. Enter your opening: the tool keeps only those and counts the ones that fit.`,
  resume: `Counter-depth refrigerator dimensions differ from standard ones in depth, not width: the cabinet is shallow enough for the doors to sit close to the front of a 24 to 25 inch deep counter. The ENERGY STAR list of ${K.day(K.UPDATED)} flags ${K.num(cd.length)} full-size models as counter-depth, against ${K.num(std.length)} standard-depth ones. They are mostly wide: ${K.num(widths[3].list.length)} of them sit in the 36 inch class and ${K.num(widths[1].list.length)} in the 30 inch class. The price of the shallower box is capacity. The median counter-depth model holds ${K.dec(vc.med)} cubic feet, the median standard-depth one ${K.dec(vs.med)}. Energy use is similar: a median ${K.num(kc.med)} kWh a year for counter-depth and ${K.num(ks.med)} for standard depth, so ${K.usd(K.cost(kc.med))} and ${K.usd(K.cost(ks.med))} a year at the U.S. average price of ${K.MONTH}. ${K.num(builtin.length)} of the counter-depth models are built-in units made to be framed by cabinets. The list does not publish the depth itself, only the flag. Read the depth with and without doors on the maker's sheet before you order.`,
  faqs: [
    { q: 'What is the depth of a counter-depth refrigerator?', a: 'The ENERGY STAR list does not give it: it only marks a model as counter-depth or not. Makers use the term for cases shallow enough to line up roughly with standard 24 to 25 inch counters, with the doors and handles standing proud of them. Check the depth "without doors" and "with handles" on the model sheet, and measure your counter from the wall to its front edge.' },
    { q: 'Do counter-depth refrigerators use more electricity?', a: `Not on the list. The median certified counter-depth model uses ${K.num(kc.med)} kWh a year and the median standard-depth model ${K.num(ks.med)}. What drives energy is the style, the ice maker and the size. Counter-depth models are mostly wide bottom-freezer units with ice makers, which is why their median sits where it does.` },
    { q: 'Is a counter-depth refrigerator worth the lost capacity?', a: `It depends on the kitchen. A standard-depth model sticks out several inches past the counter, which matters in a narrow galley or next to a doorway. The trade on the list: a median ${K.dec(vc.med)} cubic feet for counter-depth against ${K.dec(vs.med)} for standard depth. If the walkway is wide, the extra cubic feet usually win.` },
  ],
  body: (h) => `
<h2>Counter-depth refrigerator dimensions by width</h2>
<p>Most counter-depth refrigerators are wide, because a shallow box has to grow sideways to hold a family's food. The table counts the certified counter-depth models in each width class, with the median height and capacity of the class and its median yearly energy use.</p>
${h.table(['Width class', 'Models', 'Typical height', 'Typical capacity', 'Typical kWh a year'], widths.map((x) => [`${x.n} inches`, K.num(x.list.length), x.list.length ? K.inch(K.s(x.list.map((f) => f.h)).med) : 'none', x.list.length ? `${K.dec(K.s(x.list.map((f) => f.vol)).med)} cu ft` : 'none', x.list.length ? K.num(K.s(x.list.map((f) => f.kwh)).med) : 'none']), `Counter-depth full-size models, ENERGY STAR list of ${K.day(K.UPDATED)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>A 36 inch opening with 70 inches of height takes ${K.num(fit36.length)} counter-depth models. Under 70 inches the choice narrows fast, because many wide counter-depth units are tall: the median height of the 36 inch class is ${widths[3].list.length ? K.inch(K.s(widths[3].list.map((f) => f.h)).med) : 'not published'}. Check the clearance under the cabinet above the refrigerator before anything else.</p>
<h2>Freestanding or built-in</h2>
<p>The list separates two families. Freestanding counter-depth models (${K.num(free.length)} here) are ordinary refrigerators with a shallower case; they need a little air at the sides and top, and their doors and handles project past the counter. Built-in models (${K.num(builtin.length)} here) are made to sit inside cabinetry with panels or a flush front, are often taller and are sold mostly through kitchen dealers. The tool counts both unless you change the style; a built-in model needs the exact cutout the maker prints, which is often a fraction of an inch from the case size.</p>
${h.mini('fridgeFit', { t: 'Counter-depth models for a 33 inch opening', p: ['w', 'h'], d: { w: 33, h: 70, cd: 'yes' } })}
<h2>Depth: the measurement the list leaves out</h2>
<p>ENERGY STAR publishes the height, width and capacity of each refrigerator but no depth. Counter-depth is a yes or no flag the maker declares. In practice, compare three figures from the model sheet: depth of the case without doors, depth with doors closed and depth with handles. Your counter depth is measured from the wall behind the refrigerator to the front edge of the countertop, not of the cabinet doors below it. Leave room at the back for the water line and the power cord, and if the refrigerator sits against a side wall, read the door-swing clearance on the sheet: a door that cannot open past 90 degrees may block a drawer.</p>
<h2>Energy and running cost</h2>
<p>Counter-depth does not change the energy rules. The federal maximum for each product class depends on its adjusted volume and features, and a certified model must stay below it. A median counter-depth model at ${K.num(kc.med)} kWh a year costs ${K.usd(K.cost(kc.med))} a year at the U.S. average price, ${K.usd(K.cost(kc.med, K.st('california')))} in California and ${K.usd(K.cost(kc.med, K.st('texas')))} in Texas. The ${h.a('refrigerator-electricity-use', 'electricity page')} explains how to read the figure on the yellow EnergyGuide label, and the ${h.a('36-inch-refrigerator', '36 inch page')} compares all wide models, counter-depth or not.</p>
`,
  tool: 'fridgeFit', toolArg: { w: 36, h: 70, cd: 'yes' },
  related: ['36-inch-refrigerator', '33-inch-wide-refrigerator', 'how-to-measure-for-a-refrigerator', 'refrigerator-electricity-use'],
  sources: ['es_fridge', 'eia_56a', 'cfr_430'],
});
