import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const all = E.WASHERS, F = E.washers('front'), T = E.washers('top');
const k = K.s(all.map((x) => x.kwh)), kf = K.s(F.map((x) => x.kwh)), kt = K.s(T.map((x) => x.kwh));
const wf = K.s(F.map((x) => x.water)).med, wt = K.s(T.map((x) => x.water)).med;
const J = K.P.test.washerCyclesJ, J2 = K.P.test.washerCyclesJ2;
const perLoad = (kwh: number, n: number) => kwh / n;
const HI = [...K.STATES].sort((a, b) => b.now - a.now)[0];

export default definePage({
  id: 'washing-machine-electricity-use', group: 'laundry', order: 206, slug: 'washing-machine-electricity-use',
  nav: 'Washing machine electricity use', card: 'kWh a year of certified washers, front and top load, and what a year of washing costs in your state.',
  title: 'Washing Machine Electricity Use 2026: kWh by Washer Type',
  description: `Washing machine electricity use in 2026: yearly kWh and water of ${K.num(all.length)} certified washers, front load against top load, and the cost at your state's price.`,
  h1: 'Washing machine electricity use: front load against top load',
  intro: `Washing machine electricity use: the median certified washer uses ${K.num(k.med)} kWh a year. Enter your state: the tool shows the median for the washers that fit your space, and its cost.`,
  resume: `Washing machine electricity use is small next to a refrigerator or a dryer, and it depends mostly on the water a washer heats. The ENERGY STAR list of ${K.day(K.UPDATED)} gives a yearly kWh for each of ${K.num(all.length)} certified washers sold in the United States: a median ${K.num(k.med)} kWh, from ${K.num(k.min)} to ${K.num(k.max)}. The figure includes the energy to heat the water, as the federal test counts it, for a fixed number of loads a year. Front-load washers use a median ${K.num(kf.med)} kWh and ${K.num(wf)} gallons of water a year. Top-load washers use ${K.num(kt.med)} kWh and ${K.num(wt)} gallons. At the U.S. average home price of ${K.MONTH}, the median front-load washer's electricity costs ${K.usd(K.cost(kf.med))} a year and the median top-load washer's ${K.usd(K.cost(kt.med))}. If your water heater burns gas, part of that energy is gas on your bill rather than electricity. Per load, under the newer test's ${K.num(J)} loads a year, the median certified washer uses about ${K.dec(perLoad(k.med, J), 2)} kWh.`,
  faqs: [
    { q: 'How many watts does a washing machine use?', a: `A washer draws power in bursts: the motor, the pump and, in some models, an internal heater. The yearly kWh is the useful figure: ${K.num(k.med)} kWh at the median of certified washers, or about ${K.dec(perLoad(k.med, J), 2)} kWh per load under the ${K.num(J)} loads a year of the newer federal test.` },
    { q: 'How much does it cost to run a washing machine per year?', a: `For the median certified washer, ${K.usd(K.cost(k.med))} of electricity a year at the U.S. average price of ${K.MONTH}, and ${K.usd(K.cost(k.med, HI))} in ${HI.name}. Water and sewer charges come on top, set by your utility, and a gas water heater moves part of the energy to the gas bill.` },
    { q: 'Why does the yearly kWh assume a number of loads?', a: `Because the federal test turns a per-cycle measure into a yearly figure with a set number of cycles: ${K.num(J2)} a year in the older test version and ${K.num(J)} in the newer one (10 CFR 430). The list does not say which version each model used, so per-load figures here are approximate.` },
  ],
  body: (h) => `
<h2>Washing machine electricity use by type</h2>
<p>The table gives the median yearly kWh and water of each type, and the cost of that electricity at the U.S. average price. It counts every certified washer, including the many that publish only their width.</p>
${h.table(['Type', 'Models', 'Typical kWh a year', 'Range', 'Typical water a year', 'Cost a year'], [['Front load', F, kf], ['Top load', T, kt]].map(([l, a, s]) => { const x = s as ReturnType<typeof K.s>; return [l as string, K.num((a as typeof F).length), K.num(x.med), `${K.num(x.min)} to ${K.num(x.max)}`, `${K.num(K.s((a as typeof F).map((y) => y.water)).med)} gal`, K.usd(K.cost(x.med))]; }), `Certified clothes washers, ENERGY STAR list of ${K.day(K.UPDATED)}; EIA U.S. average, ${K.MONTH}.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Where the energy goes</h2>
<p>The federal test procedure (${h.src('cfr_430', '10 CFR 430, subpart B')}) adds the machine's own electricity to the energy needed to heat the water it draws, and both end up in the yearly kWh. That is why a washer that uses less water scores less energy. Washing in cold water cuts the heating part at home; the yearly figure on the label assumes the mix of temperatures of the test. A higher spin speed takes more water out of the clothes, which saves energy in the dryer, a much bigger user.</p>
${h.mini('washer', { t: 'Typical energy of the washers that fit your space', p: ['w', 'st'], d: { w: 28, h: 40, d: 32 } })}
<h2>The dryer is the larger bill</h2>
<p>The median certified electric dryer uses ${K.num(K.s(E.dryers('electric').map((x) => x.kwh)).med)} kWh a year according to its list, several times a washer. If you compare laundry costs, start there: the ${h.a('dryer-electricity-use', 'dryer electricity page')} compares vented and ventless models.</p>
<h2>Cost by state</h2>
<p>At the prices of ${K.MONTH}, the median front-load washer's electricity costs ${K.usd(K.cost(kf.med, K.st('california')))} a year in California and ${K.usd(K.cost(kf.med, K.st('missouri')))} in Missouri; the median top-load washer ${K.usd(K.cost(kt.med, K.st('california')))} and ${K.usd(K.cost(kt.med, K.st('missouri')))}. Sizes are on the ${h.a('front-load-washer-dimensions', 'front-load')} and ${h.a('top-load-washer-dimensions', 'top-load')} pages.</p>
<p>The figures on the list are measured, not estimated by this site, and they are published per model. Two washers of the same size can differ in energy and water, so comparing the yearly kWh and gallons of the models that fit your space is more useful than comparing types in general. The tool does this for the width, height and depth you enter.</p>
`,
  tool: 'washer',
  related: ['dryer-electricity-use', 'front-load-washer-dimensions', 'top-load-washer-dimensions', 'electricity-cost-by-state'],
  sources: ['es_washer', 'eia_56a', 'cfr_430'],
});
