import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const F = E.washers('front').filter((x) => x.h < 60);
const Fd = F.filter(E.hasDims);
const h = K.s(Fd.map((x) => x.h)), d = K.s(Fd.map((x) => x.d)), w = K.s(F.map((x) => x.w)), v = K.s(F.map((x) => x.vol));
const k = K.s(F.map((x) => x.kwh)), wa = K.s(F.map((x) => x.water));
const c24 = F.filter((x) => x.w <= 24.5), c27 = F.filter((x) => x.w > 24.5);
const T = E.washers('top');

export default definePage({
  id: 'front-load-washer-dimensions', group: 'laundry', order: 203, slug: 'front-load-washer-dimensions',
  nav: 'Front load washer dimensions', card: 'Sizes of certified front-load washers, 24 and 27 inch, drum capacity, kWh and water a year.',
  title: 'Front Load Washer Dimensions 2026: 24 and 27 Inch Models',
  description: `Front load washer dimensions in 2026: width, height and depth of certified 24 and 27 inch front-load washers, drum size, kWh and water a year, and how many fit.`,
  h1: 'Front load washer dimensions: 24 and 27 inch models',
  intro: `${K.num(F.length)} front-load washers are on the ENERGY STAR list, ${K.num(Fd.length)} with every size published. Enter your space: the tool keeps front-load models only.`,
  resume: `Front load washer dimensions come in two widths. On the ENERGY STAR list of ${K.day(K.UPDATED)}, ${K.num(c27.length)} certified front-load washers are full-size, about 27 inches wide, and ${K.num(c24.length)} are compact, about 24 inches. Among the ${K.num(Fd.length)} models that publish their height and depth, the median stands ${K.inch(h.med)} tall, from ${K.inch(h.min)} to ${K.inch(h.max)}, and reaches ${K.inch(d.med)} deep, before the door and the hoses. The drums hold a median ${K.dec(v.med)} cubic feet. Front-load washers are the frugal type on the list: a median ${K.num(k.med)} kWh and ${K.num(wa.med)} gallons of water a year. Top-load certified washers use a median ${K.num(K.s(T.map((x) => x.kwh)).med)} kWh and ${K.num(K.s(T.map((x) => x.water)).med)} gallons. At the U.S. average price of ${K.MONTH}, the median front-load washer's electricity costs ${K.usd(K.cost(k.med))} a year. Only front-load washers can carry a dryer stacked on top, which is why closet laundries use them.`,
  faqs: [
    { q: 'How deep is a front load washer?', a: `Among certified front-load washers with their depth published, the median is ${K.inch(d.med)}, from ${K.inch(d.min)} to ${K.inch(d.max)}. That is the cabinet; the door adds a few inches when closed and much more when open, and the hoses take room behind. Read the depth with the door on the model sheet.` },
    { q: 'What size is a compact front load washer?', a: `About 24 inches wide: ${K.num(c24.length)} certified front-load washers are 24.5 inches wide or less. They hold a median ${K.dec(K.s(c24.map((x) => x.vol)).med)} cubic feet against ${K.dec(K.s(c27.map((x) => x.vol)).med)} for the 27 inch models, and many can be stacked with a matching compact dryer. Check the door swing too.` },
    { q: 'Do front load washers use less electricity than top load?', a: `On the certified list, yes: a median ${K.num(k.med)} kWh a year for front-load against ${K.num(K.s(T.map((x) => x.kwh)).med)} for top-load, and less water too. The federal test counts the energy used to heat the water, so a model that uses less water also scores less energy.` },
  ],
  body: (h) => `
<h2>Front load washer dimensions by width</h2>
<p>Front-load washers are built to two widths. The table gives the count, drum and energy of each, and the median height and depth of the models that publish them.</p>
${h.table(['Width', 'Models', 'With all sizes', 'Typical height', 'Typical depth', 'Typical drum', 'Typical kWh a year'], [['About 24 inches', c24], ['About 27 inches', c27]].map(([l, a]) => { const x = a as typeof F, xd = x.filter(E.hasDims); return [l as string, K.num(x.length), K.num(xd.length), xd.length ? K.inch(K.s(xd.map((y) => y.h)).med) : 'none', xd.length ? K.inch(K.s(xd.map((y) => y.d)).med) : 'none', `${K.dec(K.s(x.map((y) => y.vol)).med)} cu ft`, K.num(K.s(x.map((y) => y.kwh)).med)]; }), `Certified front-load washers, ENERGY STAR list of ${K.day(K.UPDATED)}.`, ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<h2>The door and the pedestal</h2>
<p>A front-load washer needs room in front: the door swings toward you, and you need to stand and crouch to load it. Plan at least the width of the washer clear in front of it. Many makers sell a pedestal drawer that raises the washer for easier loading; it adds height, which matters under a counter or a shelf.</p>
${h.mini('washer', { t: 'Front-load washers that fit your space', p: ['w', 'd'], d: { w: 28, h: 40, d: 32, load: 'front' } })}
<h2>Width only: the gap in the list</h2>
<p>Most certified front-load washers publish their width and nothing else: ${K.num(F.length - Fd.length)} of the ${K.num(F.length)}. The tool counts them apart: they may fit your space, but the list cannot show it. Check those on the maker's sheet, which gives the height, the depth with the door, and the depth with the door open.</p>
<h2>Energy, water and cost</h2>
<p>At the prices homes paid in ${K.MONTH}, the median front-load washer's ${K.num(k.med)} kWh a year cost ${K.usd(K.cost(k.med, K.st('massachusetts')))} in Massachusetts and ${K.usd(K.cost(k.med, K.st('utah')))} in Utah. The yearly figure assumes a fixed number of loads set by the federal test (${K.P.test.washerCyclesJ} or ${K.P.test.washerCyclesJ2} a year depending on the test version, ${h.src('cfr_430', '10 CFR 430')}); a family that washes more uses more. The ${h.a('washing-machine-electricity-use', 'washer electricity page')} compares types; to stack a dryer on top, see the ${h.a('stackable-washer-and-dryer-dimensions', 'stackable pairs')}.</p>
<p>Before ordering, check the hoses and the plug behind the machine: they add a few inches to the depth on the list, and a door that opens toward a wall may need a reversible hinge, which the model sheet shows.</p>
`,
  tool: 'washer', toolArg: { load: 'front' },
  related: ['stackable-washer-and-dryer-dimensions', 'top-load-washer-dimensions', 'washing-machine-electricity-use', 'washer-and-dryer-dimensions'],
  sources: ['es_washer', 'eia_56a', 'cfr_430'],
});
