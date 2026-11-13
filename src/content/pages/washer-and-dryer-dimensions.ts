import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const W = E.WASHERS.filter((x) => x.h < 60), Wd = W.filter(E.hasDims), D = E.DRYERS;
const ws = (f: (x: (typeof W)[number]) => number, a = Wd) => K.s(a.map(f));
const front = Wd.filter((x) => !x.top), top = Wd.filter((x) => x.top);
const dw = K.s(D.map((x) => x.w)), dh = K.s(D.map((x) => x.h)), dd = K.s(D.map((x) => x.d));
const fit = E.washerFit(28, 40, 32);
const dfit = E.dryerFit(28, 40, 32);
const narrowW = W.filter((x) => x.w <= 24.5), narrowD = D.filter((x) => x.w <= 24.5);

export default definePage({
  id: 'washer-and-dryer-dimensions', group: 'laundry', order: 201, slug: 'washer-and-dryer-dimensions',
  nav: 'Washer and dryer dimensions', card: 'Width, height and depth of certified washers and dryers, and how many fit your laundry space.',
  title: 'Washer and Dryer Dimensions 2026: Sizes of Certified Models',
  description: `Washer and dryer dimensions in 2026: width, height and depth of ${K.num(E.WASHERS.length)} certified washers and ${K.num(D.length)} dryers, how many fit your space, and the energy each uses a year.`,
  h1: 'Washer and dryer dimensions: what the certified models measure',
  intro: `Most full-size washers and dryers on the ENERGY STAR list are about 27 inches wide. Enter your space: the tool counts the washers that fit all three sizes.`,
  resume: `Washer and dryer dimensions cluster around one width: the median certified washer and the median certified dryer are both 27 inches wide. Compact models of about 24 inches are the other format: ${K.num(narrowW.length)} washers and ${K.num(narrowD.length)} dryers on the ENERGY STAR list of ${K.day(K.UPDATED)}. Height and depth depend on the type. Front-load washers with all three sizes published stand a median ${K.inch(ws((x) => x.h, front).med)} and reach ${K.inch(ws((x) => x.d, front).med)} deep. Top-load washers are taller, a median ${K.inch(ws((x) => x.h, top).med)} to the lid, and need room above to open it. Dryers stand a median ${K.inch(dh.med)} and are ${K.inch(dd.med)} deep. One gap in the data matters: only ${K.num(Wd.length)} of the ${K.num(W.length)} certified washers publish height and depth, the rest give only their width. A laundry space 28 inches wide, 40 high and 32 deep takes ${K.num(fit.fit.length)} washers with all three sizes known, ${K.num(fit.widthOnly.length)} more by width alone, and ${K.num(dfit.length)} dryers. The median certified washer uses ${K.num(K.s(E.WASHERS.map((x) => x.kwh)).med)} kWh a year.`,
  faqs: [
    { q: 'What are standard washer and dryer dimensions?', a: `The common full-size format is about 27 inches wide for both. On the certified list, front-load washers stand a median ${K.inch(ws((x) => x.h, front).med)} tall and dryers ${K.inch(dh.med)}, both a little over 30 inches deep before the door and the hoses. Compact models are about 24 inches wide.` },
    { q: 'How much space do you need behind a washer and dryer?', a: 'The installation guide of each model gives it. Behind a washer sit the water hoses and the drain; behind a vented dryer, the duct, which needs a few inches to bend without crushing. Ventless dryers need no duct, which is why they suit closets. Measure from the wall to the front edge you want to keep and subtract that space.' },
    { q: 'Why does the tool count washers with width only separately?', a: `Because the ENERGY STAR list gives height and depth for only ${K.num(Wd.length)} of its ${K.num(W.length)} washers. A washer with only its width published may fit your space, but the list cannot prove it. The tool counts those apart so you know to check them on the maker's sheet.` },
  ],
  body: (h) => `
<h2>Washer and dryer dimensions on the certified list</h2>
<p>The table gives the median and the range of each size for the certified models whose sizes are published. Width is almost always 27 or 24 inches; height and depth vary with the type and the drum.</p>
${h.table(['Type', 'Models with sizes', 'Width', 'Height', 'Depth'], [['Front-load washer', front], ['Top-load washer', top]].map(([l, a]) => { const x = a as typeof Wd; return [l as string, K.num(x.length), K.inch(K.s(x.map((y) => y.w)).med), K.inch(K.s(x.map((y) => y.h)).med), K.inch(K.s(x.map((y) => y.d)).med)]; }).concat([['Dryer', K.num(D.length), K.inch(dw.med), K.inch(dh.med), K.inch(dd.med)]]), `Medians of the certified models with all three sizes published, ENERGY STAR lists of ${K.day(K.UPDATED)}.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Side by side or stacked</h2>
<p>Side by side, a pair of full-size machines needs about 54 inches of width plus the gaps, and a top-load washer needs the height to open its lid. Stacked, the pair takes one width but needs a front-load washer and a stacking kit, and the height adds up; the ${h.a('stackable-washer-and-dryer-dimensions', 'stackable page')} adds the two heights for the pairs ENERGY STAR certifies together. For closets, depth is often the limit: the door of a front-load washer and the duct of a vented dryer both take room.</p>
${h.mini('dryer', { t: 'Dryers that fit your space', p: ['w', 'd'], d: { w: 28, h: 40, d: 30 } })}
<h2>Measure the laundry space</h2>
<p>Measure the width between walls or cabinets at the narrowest point, the height to any shelf or cabinet above, and the depth from the wall to the front edge you want to keep, such as a closet door frame. Then subtract the room the installation guide asks for: space behind for hoses and the dryer duct, a little at the sides, and the swing of the doors. A front-load washer door opens toward you and needs the same clearance in front as its width.</p>
<h2>Energy and water</h2>
<p>Washers on the list also give their yearly water use, from ${K.num(K.s(E.WASHERS.map((x) => x.water)).min)} to ${K.num(K.s(E.WASHERS.map((x) => x.water)).max)} gallons. Front-load washers use less of both: the ${h.a('washing-machine-electricity-use', 'washer electricity page')} compares them, and the ${h.a('dryer-electricity-use', 'dryer electricity page')} covers the larger part of the laundry bill. Sizes by type: ${h.a('front-load-washer-dimensions', 'front-load')}, ${h.a('top-load-washer-dimensions', 'top-load')} and ${h.a('dryer-dimensions', 'dryers')}.</p>
`,
  tool: 'washer',
  related: ['stackable-washer-and-dryer-dimensions', 'front-load-washer-dimensions', 'dryer-dimensions', 'washing-machine-electricity-use'],
  sources: ['es_washer', 'es_dryer', 'eia_56a'],
});
