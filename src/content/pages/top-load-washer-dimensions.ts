import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const T = E.washers('top');
const Td = T.filter(E.hasDims);
const h = K.s(Td.map((x) => x.h)), d = K.s(Td.map((x) => x.d)), w = K.s(T.map((x) => x.w)), v = K.s(T.map((x) => x.vol));
const k = K.s(T.map((x) => x.kwh)), wa = K.s(T.map((x) => x.water));
const F = E.washers('front');
const kf = K.s(F.map((x) => x.kwh)).med, waf = K.s(F.map((x) => x.water)).med;
const big = T.filter((x) => x.vol >= 5).length;

export default definePage({
  id: 'top-load-washer-dimensions', group: 'laundry', order: 204, slug: 'top-load-washer-dimensions',
  nav: 'Top load washer dimensions', card: 'Height to the lid, width and depth of certified top-load washers, and what they use against front-load ones.',
  title: 'Top Load Washer Dimensions 2026: Height, Lid and Capacity',
  description: `Top load washer dimensions in 2026: ${K.num(T.length)} certified top-load washers, height to the lid and open lid room, width, depth, drum size, kWh and water a year.`,
  h1: 'Top load washer dimensions: height, lid and drum',
  intro: `The ENERGY STAR list holds ${K.num(T.length)} top-load washers; ${K.num(Td.length)} publish height and depth. Enter your space: the tool keeps top-load models only.`,
  resume: `Top load washer dimensions differ from front-load ones in height: the lid sits on top, so the cabinet is taller and needs open space above. On the ENERGY STAR list of ${K.day(K.UPDATED)}, the ${K.num(Td.length)} certified top-load washers that publish all sizes stand a median ${K.inch(h.med)} tall, from ${K.inch(h.min)} to ${K.inch(h.max)}, to the top of the closed lid or the control panel. They are ${K.inch(w.med)} wide at the median across all ${K.num(T.length)} models, and ${K.inch(d.med)} deep. Drums are large: a median ${K.dec(v.med)} cubic feet, and ${K.num(big)} models hold 5 cubic feet or more. Certified top-load washers use more than front-load ones: a median ${K.num(k.med)} kWh and ${K.num(wa.med)} gallons of water a year, against ${K.num(kf)} kWh and ${K.num(waf)} gallons for front-load. At the U.S. average price of ${K.MONTH}, that is ${K.usd(K.cost(k.med))} of electricity a year. A top-load washer cannot carry a dryer on top, so it suits side-by-side layouts.`,
  faqs: [
    { q: 'How much clearance does a top load washer need above it?', a: 'Enough to open the lid fully and reach into the drum: the height of the washer plus the depth of the lid when raised. The installation guide gives the total height with the lid open. A shelf or cabinet above must clear that figure, not just the closed height on the list.' },
    { q: 'How tall is a top load washer?', a: `Among certified top-load washers with their height published, the median is ${K.inch(h.med)}, from ${K.inch(h.min)} to ${K.inch(h.max)}. This is the closed height. Measure the space above for the open lid before you buy. The tool keeps only models whose height is published.` },
    { q: 'Are top load washers bigger inside than front load?', a: `On the certified list their drums are larger at the median: ${K.dec(v.med)} cubic feet against ${K.dec(K.s(F.map((x) => x.vol)).med)} for front-load washers. They also use more energy and water per year according to the same list, because the federal test counts the water they heat.` },
  ],
  body: (h) => `
<h2>Top load washer dimensions and the open lid</h2>
<p>The list gives the closed height. In a laundry with a shelf or cabinet above, the useful figure is the height with the lid open, which the maker prints in the installation guide. The table gives the closed sizes of the certified models that publish them, by drum size.</p>
${h.table(['Drum', 'Models', 'Typical height', 'Typical depth', 'Typical kWh a year', 'Typical water a year'], [[0, 4.5, 'Under 4.5 cu ft'], [4.5, 5, '4.5 to 5 cu ft'], [5, 99, '5 cu ft or more']].map(([lo, hi, l]) => { const a = T.filter((x) => x.vol >= (lo as number) && x.vol < (hi as number)), ad = a.filter(E.hasDims); return [l as string, K.num(a.length), ad.length ? K.inch(K.s(ad.map((y) => y.h)).med) : 'none', ad.length ? K.inch(K.s(ad.map((y) => y.d)).med) : 'none', a.length ? K.num(K.s(a.map((y) => y.kwh)).med) : 'none', a.length ? `${K.num(K.s(a.map((y) => y.water)).med)} gal` : 'none']; }), `Certified top-load washers, ENERGY STAR list of ${K.day(K.UPDATED)}.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Agitator or impeller</h2>
<p>Certified top-load washers include both designs, with a central agitator or a low impeller plate, and the list does not separate them. What it does publish is the drum capacity and the integrated water factor, which relates the water used to the size of the drum. A lower water factor means less water for the same load, and the federal test counts the energy to heat that water.</p>
${h.mini('washer', { t: 'Top-load washers that fit your space', p: ['h', 'd'], d: { w: 28, h: 46, d: 30, load: 'top' } })}
<h2>Top load or front load</h2>
<p>A top-load washer is easier to load without bending and does not need room in front for a door. It needs room above for the lid, cannot be stacked, and on the certified list uses more energy and water. At the prices of ${K.MONTH}, the median gap in electricity alone is worth ${K.usd(K.cost(k.med - kf))} a year at the U.S. average and ${K.usd(K.cost(k.med - kf, K.st('hawaii')))} in Hawaii; the water saving comes on top. The ${h.a('front-load-washer-dimensions', 'front-load page')} gives the other side, and the ${h.a('washing-machine-electricity-use', 'washer electricity page')} the full comparison.</p>
<h2>Fitting the dryer beside it</h2>
<p>Side by side with a dryer, a top-load washer takes the width of both machines plus the gaps. Dryers are 27 inches wide at the median, like most washers; the ${h.a('dryer-dimensions', 'dryer sizes')} page counts those that fit next to it.</p>
`,
  tool: 'washer', toolArg: { load: 'top', h: 46 },
  related: ['front-load-washer-dimensions', 'washing-machine-electricity-use', 'dryer-dimensions', 'washer-and-dryer-dimensions'],
  sources: ['es_washer', 'eia_56a'],
});
