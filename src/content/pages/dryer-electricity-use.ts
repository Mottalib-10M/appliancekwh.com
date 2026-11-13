import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const el = E.dryers('electric');
const vented = el.filter((x) => !x.ventless), vless = el.filter((x) => x.ventless);
const k = K.s(el.map((x) => x.kwh)), kv = K.s(vented.map((x) => x.kwh)), kl = K.s(vless.map((x) => x.kwh));
const atMax = vented.filter((x) => x.kwh === kv.max).length;
const leanest = [...el].sort((a, b) => a.kwh - b.kwh)[0];
const wash = K.s(E.WASHERS.map((x) => x.kwh)).med;
const HI = [...K.STATES].sort((a, b) => b.now - a.now)[0], LO = [...K.STATES].sort((a, b) => a.now - b.now)[0];

export default definePage({
  id: 'dryer-electricity-use', group: 'laundry', order: 207, slug: 'dryer-electricity-use',
  nav: 'Dryer electricity use', card: 'kWh a year of certified electric dryers, vented against ventless, and the yearly cost in your state.',
  title: 'Dryer Electricity Use 2026: Vented, Ventless and Cost',
  description: `Dryer electricity use in 2026: estimated kWh a year of ${K.num(el.length)} certified electric dryers, vented against ventless heat pump models, and the cost in your state.`,
  h1: 'Dryer electricity use: vented against ventless models',
  intro: `Dryer electricity use: certified electric dryers are estimated at a median ${K.num(k.med)} kWh a year. Enter your space and state: the tool counts the dryers that fit and prices their energy.`,
  resume: `Dryer electricity use is the largest laundry cost, and the ENERGY STAR list gives an estimated yearly kWh for each certified dryer. Among ${K.num(el.length)} certified electric dryers on the list of ${K.day(K.UPDATED)}, the median estimate is ${K.num(k.med)} kWh a year, against ${K.num(wash)} kWh for the median certified washer. The list splits clearly by venting. Vented electric dryers sit at a median ${K.num(kv.med)} kWh, and ${K.num(atMax)} of the ${K.num(vented.length)} share the same top estimate of ${K.num(kv.max)} kWh, so the list barely separates them. Ventless models, which include heat pump dryers, use a median ${K.num(kl.med)} kWh. The most frugal certified dryer, the ${leanest.brand} ${leanest.model}, is estimated at ${K.num(leanest.kwh)} kWh. At the U.S. average home price of ${K.MONTH}, a vented dryer at the median costs ${K.usd(K.cost(kv.med))} a year and a ventless one ${K.usd(K.cost(kl.med))}. In ${HI.name}, where power costs the most, the vented median costs ${K.usd(K.cost(kv.med, HI))}; in ${LO.name}, ${K.usd(K.cost(kv.med, LO))}. Gas dryers heat with gas, so their figures are left out.`,
  faqs: [
    { q: 'How much electricity does a clothes dryer use?', a: `The median certified electric dryer is estimated at ${K.num(k.med)} kWh a year on the ENERGY STAR list. Vented models sit around ${K.num(kv.med)} kWh, ventless models around ${K.num(kl.med)}. The estimate assumes a fixed number of loads set by the federal test; more loads mean more kWh.` },
    { q: 'Are heat pump dryers worth it?', a: `On energy, the list says yes: ventless electric dryers, heat pump models among them, use a median ${K.num(kl.med)} kWh a year against ${K.num(kv.med)} for vented ones. The gap is worth ${K.usd(K.cost(kv.med - kl.med))} a year at the U.S. average price and ${K.usd(K.cost(kv.med - kl.med, HI))} in ${HI.name}. Compare it with the price difference of the two models you are considering.` },
    { q: 'Does a gas dryer cost less to run?', a: 'It depends on your gas and electricity prices, and this site has no gas prices. A gas dryer burns gas for heat and uses electricity only for the drum and the controls, so its electric bill is small. The ENERGY STAR estimate for gas models is not comparable with electric kWh, so the tool shows no cost for them.' },
  ],
  body: (h) => `
<h2>Dryer electricity use, vented and ventless</h2>
<p>The table compares the two kinds of electric dryer on the certified list. The estimate is the yearly kWh the maker certified; the cost uses the average home price of ${K.MONTH}.</p>
${h.table(['Electric dryer', 'Models', 'Median kWh a year', 'Range', 'Cost a year, U.S. average', `Cost a year, ${HI.name}`], [['Vented', vented, kv], ['Ventless (heat pump, condenser)', vless, kl]].map(([l, a, s]) => { const x = s as ReturnType<typeof K.s>; return [l as string, K.num((a as typeof el).length), K.num(x.med), `${K.num(x.min)} to ${K.num(x.max)}`, K.usd(K.cost(x.med)), K.usd(K.cost(x.med, HI))]; }), `Certified electric dryers, ENERGY STAR list of ${K.day(K.UPDATED)}; EIA prices, ${K.MONTH}.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Why so many vented dryers show the same figure</h2>
<p>${K.num(atMax)} vented electric dryers on the list carry exactly ${K.num(kv.max)} kWh a year. The figure is an estimate, and the list gives this same value to most vented models, which it therefore does not separate. It is a fair comparison between vented and ventless models, but not between two vented models: for those, compare the combined energy factor on the model sheet, where a higher figure means less energy per pound of laundry.</p>
${h.mini('dryer', { t: 'Electric dryers that fit, and their cost in your state', p: ['w', 'st'], d: { w: 28, h: 40, d: 32, fuel: 'electric' } })}
<h2>Cutting the dryer's share of the bill</h2>
<p>Three things move the real figure. The washer's spin: the drier the clothes come out, the shorter the drying cycle. The sensor: cycles that stop when the clothes are dry avoid running a fixed time. And the lint filter and the duct: a clogged filter or a long, crushed duct makes a vented dryer run longer. The ${h.a('washing-machine-electricity-use', 'washer page')} gives the washer's own share.</p>
<h2>Sizes before energy</h2>
<p>Ventless dryers are often compact, about 24 inches wide, and are made to stack on a compact washer. If you are fitting a closet, start with the ${h.a('dryer-dimensions', 'dryer sizes')} and the ${h.a('stackable-washer-and-dryer-dimensions', 'stacked pairs')}, then compare energy among the models that fit.</p>
<p>Drying fuller loads means fewer cycles for the same laundry. The list measures each model at the test load and cannot say how your habits change its figure, so the yearly kWh stays the basis for comparing models.</p>
`,
  tool: 'dryer', toolArg: { fuel: 'electric' },
  related: ['dryer-dimensions', 'washing-machine-electricity-use', 'stackable-washer-and-dryer-dimensions', 'electricity-cost-by-state'],
  sources: ['es_dryer', 'eia_56a', 'cfr_430'],
});
