import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const D = E.DRYERS;
const w = K.s(D.map((x) => x.w)), h = K.s(D.map((x) => x.h)), d = K.s(D.map((x) => x.d)), c = K.s(D.map((x) => x.cap));
const compact = D.filter((x) => x.compact), std = D.filter((x) => !x.compact);
const gas = D.filter((x) => x.gas), vless = D.filter((x) => x.ventless);
const fit = E.dryerFit(28, 40, 30, 'any');

export default definePage({
  id: 'dryer-dimensions', group: 'laundry', order: 205, slug: 'dryer-dimensions',
  nav: 'Dryer dimensions', card: 'Width, height, depth and drum of certified dryers, electric or gas, vented or ventless, and which fit your space.',
  title: 'Dryer Dimensions 2026: Standard and Compact Certified Models',
  description: `Dryer dimensions in 2026: height, width and depth of ${K.num(D.length)} certified dryers, standard and compact, gas or electric, vented or ventless, and how many fit.`,
  h1: 'Dryer dimensions: what certified dryers measure',
  intro: `All ${K.num(D.length)} certified dryers kept here publish their height, width and depth. Enter your space and fuel: the tool counts the ones that fit.`,
  resume: `Standard dryer dimensions on the ENERGY STAR list of ${K.day(K.UPDATED)} are close to one format: a median of ${K.inch(w.med)} wide, ${K.inch(h.med)} tall and ${K.inch(d.med)} deep, across ${K.num(D.length)} certified dryers sold in the United States. Unlike washers, every certified dryer on the list publishes its three sizes, so the count of models that fit is complete. Compact dryers, ${K.num(compact.length)} of them, are about 24 inches wide and made to stack on a compact washer. Drum capacity runs from ${K.dec(c.min)} to ${K.dec(c.max)} cubic feet, median ${K.dec(c.med)}. Fuel and venting split the list: ${K.num(gas.length)} gas dryers and ${K.num(D.length - gas.length)} electric ones, and ${K.num(vless.length)} ventless models that need no duct to the outside, which makes them the choice for closets and apartments without a vent. A space 28 inches wide, 40 high and 30 deep takes ${K.num(fit.length)} certified dryers. The depth on the list is the cabinet: the door, the duct and the plug or gas line add to it.`,
  faqs: [
    { q: 'What are the standard dimensions of a dryer?', a: `The median certified dryer is ${K.inch(w.med)} wide, ${K.inch(h.med)} tall and ${K.inch(d.med)} deep. Full-size dryers sit around 27 inches wide; compact ones around 24. Height is usually close to the matching washer, so a side-by-side pair lines up.` },
    { q: 'How much space does a dryer need behind it?', a: 'A vented dryer needs room for the duct to leave the back and turn without being crushed, often several inches; the installation guide gives the minimum. A ventless dryer needs no duct, only space for the power cord and air around it. A gas dryer also needs its gas connection.' },
    { q: 'Are compact dryers smaller inside?', a: `Yes. Certified compact dryers hold a median ${K.dec(K.s(compact.map((x) => x.cap)).med)} cubic feet against ${K.dec(K.s(std.map((x) => x.cap)).med)} for standard ones. A compact dryer matches a compact washer's load; paired with a full-size washer, it may need two cycles for one wash. Check the drum size on the model sheet.` },
  ],
  body: (h) => `
<h2>Dryer dimensions by type</h2>
<p>The list classifies each dryer by fuel, size and venting. The table gives the median sizes of each group. Gas and electric models of the same series usually share a cabinet, so the size differences come mostly from compact against standard.</p>
${h.table(['Type', 'Models', 'Width', 'Height', 'Depth', 'Drum'], [['Standard electric, vented', D.filter((x) => !x.gas && !x.compact && !x.ventless)], ['Standard electric, ventless', D.filter((x) => !x.gas && !x.compact && x.ventless)], ['Standard gas', D.filter((x) => x.gas && !x.compact)], ['Compact', compact]].filter(([, a]) => (a as typeof D).length).map(([l, a]) => { const x = a as typeof D; return [l as string, K.num(x.length), K.inch(K.s(x.map((y) => y.w)).med), K.inch(K.s(x.map((y) => y.h)).med), K.inch(K.s(x.map((y) => y.d)).med), `${K.dec(K.s(x.map((y) => y.cap)).med)} cu ft`]; }), `Certified dryers, ENERGY STAR list of ${K.day(K.UPDATED)}; medians.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Vented or ventless</h2>
<p>A vented dryer blows warm, moist air outside through a duct, so it needs an outside wall or a duct run and the depth for the connection behind it. A ventless dryer keeps the air inside and removes the water by condensing it, with a heat pump or a condenser, into a tank or a drain. Ventless models fit closets and apartments, and on the list they include the most frugal electric dryers.</p>
${h.mini('dryer', { t: 'Dryers that fit your closet', p: ['w', 'd'], d: { w: 24.5, h: 36, d: 26, fuel: 'any' } })}
<h2>Gas or electric</h2>
<p>A gas dryer needs a gas line, and it still uses some electricity for the drum and the controls. Its heat comes from gas, so the list's energy figure for gas models is not comparable with an electric one and the tool shows no electricity cost for them. An electric dryer usually needs a dedicated 240 volt outlet; compact 120 volt models exist and the list marks them. The ${h.a('dryer-electricity-use', 'dryer electricity page')} gives the running cost of electric models by state.</p>
<h2>Next to the washer or on top of it</h2>
<p>Side by side, check that the two machines plus the gaps fit the width, and that the doors open away from each other if you can choose the hinge side. Stacked, the dryer sits on a front-load washer with the maker's kit; the ${h.a('stackable-washer-and-dryer-dimensions', 'stackable page')} adds the heights for the certified pairs. Washer sizes are on the ${h.a('washer-and-dryer-dimensions', 'washer and dryer page')}.</p>
`,
  tool: 'dryer', toolArg: { fuel: 'any', d: 30 },
  related: ['dryer-electricity-use', 'stackable-washer-and-dryer-dimensions', 'washer-and-dryer-dimensions', 'front-load-washer-dimensions'],
  sources: ['es_dryer', 'eia_56a'],
});
