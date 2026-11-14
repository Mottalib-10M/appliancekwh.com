import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const F = E.FREEZERS;
const T = [['Upright Freezer', 'Upright'], ['Chest Freezer', 'Chest'], ['Compact', 'Compact']] as const;
const of = (t: string) => F.filter((x) => x.type === t);
const up = K.s(of('Upright Freezer').map((x) => x.kwh)), upV = K.s(of('Upright Freezer').map((x) => x.vol));
const ch = K.s(of('Chest Freezer').map((x) => x.kwh)), co = K.s(of('Compact').map((x) => x.kwh));
const fridge = K.typical()[0].kwh;
const HI = [...K.STATES].sort((a, b) => b.now - a.now)[0];
const bands = [[0, 10], [10, 15], [15, 20], [20, 40]] as const;

export default definePage({
  id: 'freezer-electricity-use', group: 'cooling', order: 403, slug: 'freezer-electricity-use',
  nav: 'Freezer electricity use', card: 'kWh a year of certified upright, chest and compact freezers by capacity, and the cost in your state.',
  title: 'Freezer Electricity Use 2026: Upright, Chest and Compact kWh',
  description: `Freezer electricity use in 2026: kWh a year of ${K.num(F.length)} certified upright, chest and compact freezers by capacity, with the yearly running cost in every state.`,
  h1: 'Freezer electricity use: upright, chest and compact',
  intro: `The median certified upright freezer uses ${K.num(up.med)} kWh a year, ${K.usd(K.cost(up.med))} at the U.S. average price. Pick a type and size: the tool prices it in your state.`,
  resume: `Freezer electricity use is easy to compare because a freezer runs all year: the yearly kWh on its label is close to what it uses at home, with a kitchen or garage temperature that changes it. The ENERGY STAR list of ${K.day(K.UPDATED)} holds ${K.num(F.length)} certified freezers: ${K.num(of('Upright Freezer').length)} upright models, ${K.num(of('Compact').length)} compact ones and only ${K.num(of('Chest Freezer').length)} chest freezers. The median upright freezer holds ${K.dec(upV.med)} cubic feet and uses ${K.num(up.med)} kWh a year, which costs ${K.usd(K.cost(up.med))} at the U.S. average home price of ${K.MONTH} and ${K.usd(K.cost(up.med, HI))} in ${HI.name}. The median certified chest freezer uses ${K.num(ch.med)} kWh and the median compact one ${K.num(co.med)}. For comparison, the median full-size refrigerator on the same list uses ${K.num(fridge)} kWh. The chest figure rests on few models, so read it as an indication. The freezer list gives capacity and energy only: no width, height or depth.`,
  faqs: [
    { q: 'How much electricity does a freezer use a year?', a: `The median certified upright freezer uses ${K.num(up.med)} kWh a year, the median chest freezer ${K.num(ch.med)} and the median compact one ${K.num(co.med)}. At the U.S. average price of ${K.MONTH}, the upright one costs ${K.usd(K.cost(up.med))} a year. Your state's price changes that figure; the tool applies it.` },
    { q: 'How many watts does a freezer use?', a: `Spread over the 8,760 hours of a year, the median certified upright freezer averages about ${K.num(up.med / 8760 * 1000)} watts. The compressor draws more while it runs and nothing while it rests; the yearly kWh already averages the two. Multiply by your price for a rough cost check.` },
    { q: 'Does a freezer in the garage use more?', a: 'A freezer in a hot garage runs its compressor longer, so it uses more than its label. In a cold garage some models struggle to run correctly; the model sheet gives the temperature range it is built for. The list figure assumes a room at test temperature.' },
  ],
  body: (h) => `
<h2>Freezer electricity use by type</h2>
<p>The table gives, for each type, the number of certified models, their median capacity, the median yearly kWh and the cost of a year at the U.S. average price and in ${HI.name}.</p>
${h.table(['Type', 'Models', 'Typical capacity', 'Typical kWh a year', 'Cost a year, U.S. average', `Cost a year, ${HI.name}`], T.map(([t, l]) => { const a = of(t); const k = K.s(a.map((x) => x.kwh)); return [l, K.num(a.length), `${K.dec(K.s(a.map((x) => x.vol)).med)} cu ft`, K.num(k.med), K.usd(K.cost(k.med)), K.usd(K.cost(k.med, HI))]; }), `Certified freezers, ENERGY STAR list of ${K.day(K.UPDATED)}; EIA prices, ${K.MONTH}.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Upright freezers by capacity</h2>
<p>Within the upright type, energy rises with capacity. The table splits the certified upright models into capacity bands.</p>
${h.table(['Capacity', 'Models', 'Typical kWh a year', 'Cost a year, U.S. average'], bands.map(([lo, hi]) => { const a = of('Upright Freezer').filter((x) => x.vol > lo && x.vol <= hi); const k = K.s(a.map((x) => x.kwh)); return [hi === 40 ? `Over ${lo} cu ft` : lo === 0 ? `Up to ${hi} cu ft` : `${lo} to ${hi} cu ft`, K.num(a.length), a.length ? K.num(k.med) : 'none', a.length ? K.usd(K.cost(k.med)) : 'none']; }), `Certified upright freezers, ENERGY STAR list of ${K.day(K.UPDATED)}.`, ['l', 'r', 'r', 'r'])}
${h.mini('freezer', { t: 'Running cost of the freezer type and size you want', p: ['type', 'st'], d: { type: 'Upright Freezer', vmin: 10, vmax: 20 } })}
<h2>Using less</h2>
<p>A freezer works less when its door stays shut, its seal is tight, it has space around its coils and it sits in a cool room. Setting it colder than the usual 0°F (minus 18°C) adds energy without keeping food better. The yearly figure on the list is measured under the ${h.src('cfr_430', 'federal test procedure (10 CFR 430)')}.</p>
<h2>Freezer and refrigerator together</h2>
<p>A separate freezer often sits next to a refrigerator. The ${h.a('refrigerator-electricity-use', 'refrigerator electricity page')} gives the other half of the cold-storage bill, and the ${h.a('electricity-cost-by-state', 'state comparison')} adds the main appliances of a home.</p>
<h2>Upright or chest</h2>
<p>Upright freezers dominate the certified list: ${K.num(of('Upright Freezer').length)} models against ${K.num(of('Chest Freezer').length)} chest freezers. With so few chest models, their median says little about the type as a whole. A chest freezer keeps its cold air in when the lid opens, while an upright one is easier to sort. If you buy a chest model that is not on the list, its yellow EnergyGuide label gives its yearly kWh, which you can multiply by your state's price from the ${h.a('electricity-cost-by-state', 'state table')}.</p>
<h2>Size against need</h2>
<p>A freezer that is mostly empty still cools its whole volume. Within the upright type, the table shows energy rising with capacity, so the right size is the one you fill.</p>
`,
  tool: 'freezer',
  related: ['refrigerator-electricity-use', 'electricity-cost-by-state', 'mini-fridge-dimensions', 'dehumidifier-electricity-use'],
  sources: ['es_freezer', 'cfr_430', 'eia_56a'],
});
