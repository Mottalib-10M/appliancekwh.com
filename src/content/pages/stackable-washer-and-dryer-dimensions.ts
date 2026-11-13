import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const all = E.stackFit(99, 999, 99);
const tall = (p: (typeof all)[number]) => p.washer.h + p.dryer.h;
const t = K.s(all.map(tall));
const wid = K.s(all.map((p) => Math.max(p.washer.w, p.dryer.w)));
const dep = K.s(all.map((p) => Math.max(p.washer.d, p.dryer.d)));
const in72 = E.stackFit(99, 72, 99).length, in76 = E.stackFit(99, 76, 99).length, in80 = E.stackFit(99, 80, 99).length;
const n24 = all.filter((p) => Math.max(p.washer.w, p.dryer.w) <= 24.5).length;
const centers = E.LAUNDRY_CENTERS;
const elec = all.filter((p) => !p.dryer.gas);
const kPair = K.s(elec.map((p) => p.washer.kwh + p.dryer.kwh));

export default definePage({
  id: 'stackable-washer-and-dryer-dimensions', group: 'laundry', order: 202, slug: 'stackable-washer-and-dryer-dimensions',
  nav: 'Stackable washer and dryer dimensions', card: 'Stacked height of the washer and dryer pairs ENERGY STAR certifies together, and which fit your closet.',
  title: 'Stackable Washer and Dryer Dimensions 2026: Stacked Heights',
  description: `Stackable washer and dryer dimensions in 2026: stacked height, width and depth of ${K.num(all.length)} certified pairs, which fit a closet of your size, and yearly energy.`,
  h1: 'Stackable washer and dryer dimensions: the stacked height',
  intro: `Stackable washer and dryer dimensions: ENERGY STAR lists ${K.num(all.length)} front-load pairs with every size published. Enter your closet: the tool adds the two heights and counts the pairs that fit.`,
  resume: `Stackable washer and dryer dimensions come down to one figure the makers rarely print: the stacked height, which is the washer's height plus the dryer's. The ENERGY STAR washer list names, for some models, the certified dryer sold as its pair. On the lists of ${K.day(K.UPDATED)}, ${K.num(all.length)} front-load pairs have every size published. Stacked, they stand from ${K.inch(t.min)} to ${K.inch(t.max)}, with a median of ${K.inch(t.med)}, before the stacking kit and the feet. They are ${K.inch(wid.med)} wide at the median and ${K.inch(dep.med)} deep. A closet 72 inches high takes ${K.num(in72)} of the pairs, 76 inches takes ${K.num(in76)} and 80 inches ${K.num(in80)}. ${K.num(n24)} pairs are compact, 24 inches wide or less. Only front-load washers stack, because a top-load lid needs to open upward. Laundry centers, a washer and dryer built in one frame, are a separate option: the list holds ${K.num(centers.length)} certified ones. A pair with an electric dryer uses a median ${K.num(kPair.med)} kWh a year together, ${K.usd(K.cost(kPair.med))} at the U.S. average price of ${K.MONTH}.`,
  faqs: [
    { q: 'How tall is a stacked washer and dryer?', a: `For the certified pairs with every size published, the two cabinets add up to a median ${K.inch(t.med)}, from ${K.inch(t.min)} to ${K.inch(t.max)}. The stacking kit and the leveling feet add a little more, given on the kit's sheet. Leave room above for air and for reaching the dryer controls.` },
    { q: 'Can any washer and dryer be stacked?', a: 'No. The washer must be a front-load model, and the maker must offer a stacking kit for that washer and dryer, usually of the same brand and width. A top-load washer cannot carry a dryer. The pairs counted on this page are the ones the ENERGY STAR list names as pairs.' },
    { q: 'What size closet do I need for a stackable washer and dryer?', a: `Width and depth of the larger machine plus the gaps in the installation guide, and the stacked height plus the kit. Among the certified pairs, the median is ${K.inch(wid.med)} wide and ${K.inch(dep.med)} deep before the door and duct; a closet 76 inches high takes ${K.num(in76)} of the ${K.num(all.length)} pairs.` },
  ],
  body: (h) => `
<h2>Stackable washer and dryer dimensions, pair by pair</h2>
<p>A stack is only as small as its two machines together. The count below takes every certified front-load washer whose pair dryer is on the ENERGY STAR dryer list, with height, width and depth published for both, and adds the two heights. It does not include the stacking kit, which every maker sells for its own pair.</p>
${h.table(['Closet height', 'Pairs that fit'], [68, 70, 72, 74, 76, 78, 80].map((x) => [`${x} inches`, K.num(E.stackFit(99, x, 99).length)]), `Front-load pairs on the ENERGY STAR washer and dryer lists of ${K.day(K.UPDATED)}, all widths and depths.`, ['l', 'r'])}
<h2>Width and depth in a closet</h2>
<p>Closet laundries are tight in depth. A front-load washer of ${K.inch(dep.med)} at the median needs space behind for the hoses and the drain, and a vented dryer needs room for the duct to leave the back without crushing. Then the door of the closet must close in front of both. Ventless dryers, heat pump or condenser, need no duct and are common in stacked compact pairs. Measure the closet's depth from the back wall to the inside of the door frame, and compare with the depth on the model sheets plus the gaps they ask for.</p>
${h.mini('stack', { t: 'Stacked pairs that fit a closet of your height', p: ['h'], d: { w: 28, h: 76, d: 34 } })}
<h2>Compact 24 inch stacks</h2>
<p>${K.num(n24)} of the certified pairs are 24 inches wide or less. Compact machines hold less: their drums are smaller and a full-size family load may need two cycles. In return, the stack fits a closet or a bathroom where a 27 inch pair would not. The ${h.a('washer-and-dryer-dimensions', 'washer and dryer page')} gives the sizes of single machines, including the many washers whose height and depth are not on the list.</p>
<h2>Energy of a stacked pair</h2>
<p>The dryer uses far more than the washer. A certified pair with an electric dryer uses a median ${K.num(kPair.med)} kWh a year, which costs ${K.usd(K.cost(kPair.med, K.st('california')))} in California and ${K.usd(K.cost(kPair.med, K.st('texas')))} in Texas at the prices of ${K.MONTH}. The ${h.a('dryer-electricity-use', 'dryer electricity page')} compares vented and ventless models.</p>
`,
  tool: 'stack',
  related: ['washer-and-dryer-dimensions', 'front-load-washer-dimensions', 'dryer-dimensions', 'dryer-electricity-use'],
  sources: ['es_washer', 'es_dryer', 'eia_56a'],
});
