import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const L = E.widthClass(28);
const k = K.s(L.map((f) => f.kwh)), hgt = K.s(L.map((f) => f.h)), vol = K.s(L.map((f) => f.vol));
const top = L.filter((f) => f.type === 'Top Freezer'), bot = L.filter((f) => f.type === 'Bottom Freezer'), single = L.filter((f) => f.type === 'Freezerless and Single Door');
const v24 = K.s(E.widthClass(24).map((f) => f.vol)).med, v30 = K.s(E.widthClass(30).map((f) => f.vol)).med;
const k24 = K.s(E.widthClass(24).map((f) => f.kwh)).med, k30 = K.s(E.widthClass(30).map((f) => f.kwh)).med;
const ice = L.filter((f) => f.ice);
const under = L.filter((f) => f.h <= 65);
const brands = [...new Set(L.map((f) => f.brand))].length;

export default definePage({
  id: '28-inch-wide-refrigerator', group: 'fridge', order: 103, slug: '28-inch-wide-refrigerator',
  nav: '28 inch wide refrigerator', card: 'The in-between width: what a 28 inch refrigerator holds against 24 and 30 inch ones, and its running cost.',
  title: '28 Inch Wide Refrigerator 2026: Models, Height and kWh',
  description: `28 inch wide refrigerator options in 2026: ${K.num(L.length)} ENERGY STAR certified models, their height and capacity, yearly kWh and the cost to run them in your state.`,
  h1: '28 inch wide refrigerator: the in-between size, model by model',
  intro: `The ENERGY STAR list holds ${K.num(L.length)} full-size refrigerators about 28 inches wide. Enter the height you have: the tool counts those that fit.`,
  resume: `A 28 inch wide refrigerator sits between the narrow 24 inch format and the common 30 inch one. On the ENERGY STAR list of ${K.day(K.UPDATED)}, ${K.num(L.length)} full-size models from ${K.num(brands)} brands are wider than 27 and up to 28.5 inches. Their median capacity is ${K.dec(vol.med)} cubic feet, against ${K.dec(v24)} for the 24 inch class and ${K.dec(v30)} for the 30 inch class. Height runs from ${K.inch(hgt.min)} to ${K.inch(hgt.max)}, median ${K.inch(hgt.med)}. Top-freezer models dominate with ${K.num(top.length)} entries; there are ${K.num(bot.length)} bottom-freezer models and ${K.num(single.length)} with no freezer. The median model uses ${K.num(k.med)} kWh a year, which costs ${K.usd(K.cost(k.med))} at the U.S. average price of ${K.MONTH}. That is ${K.usd(K.cost(k30 - k.med))} a year less than the median 30 inch model and ${K.usd(K.cost(k.med - k24))} more than the median 24 inch one.`,
  faqs: [
    { q: 'Will a 28 inch refrigerator fit in a 30 inch space?', a: 'Yes, with two inches to spare, which helps when the opening is framed by cabinets or a wall: the extra room lets the door open fully and leaves air around the case. You give up capacity, though. The tool shows how many 30 inch models fit if your space really measures 30 inches at its narrowest point.' },
    { q: 'How tall is a 28 inch wide refrigerator?', a: `On the ENERGY STAR list, the median full-size model of that width is ${K.inch(hgt.med)} tall. The lowest is ${K.inch(hgt.min)} and the tallest ${K.inch(hgt.max)}. ${K.num(under.length)} stand 65 inches or less, which matters under a low cabinet in older kitchens.` },
    { q: 'Do 28 inch refrigerators come with ice makers?', a: `Some do. ${K.num(ice.length)} of the ${K.num(L.length)} certified models of that width have an automatic ice maker, according to the list. An ice maker needs a water line behind the refrigerator and adds to the energy use, which the yearly kWh on the list already includes.` },
  ],
  body: (h) => `
<h2>Why a 28 inch wide refrigerator</h2>
<p>When the opening measures 28 to 29 inches, a 30 inch model will not go in, and a 24 inch one wastes space. The 28 inch class is the answer, and it is larger than people expect: a median ${K.dec(vol.med)} cubic feet, enough for a couple or a small family. Start the tool with your exact width and height; if the width is 28 and a fraction, enter the fraction, because many models in this class measure 27.5 to 28 inches.</p>
${h.table(['Width class', 'Models', 'Median capacity', 'Median kWh a year', 'Cost a year, U.S. average'], [[24, E.widthClass(24)], [28, L], [30, E.widthClass(30)]].map(([n, x]) => { const a = x as typeof L; const m = K.s(a.map((f) => f.kwh)).med; return [`${n} inches`, K.num(a.length), `${K.dec(K.s(a.map((f) => f.vol)).med)} cu ft`, K.num(m), K.usd(K.cost(m))]; }), `Full-size certified models, ENERGY STAR list of ${K.day(K.UPDATED)}; EIA price, ${K.MONTH}.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Height decides the capacity</h2>
<p>Within the 28 inch class, capacity grows with height almost one for one. A model under 65 inches suits a kitchen with a cabinet above the opening; a model near ${K.inch(hgt.max)} needs an open space or a high ceiling. Measure the height at the front and at the back, because floors slope and a refrigerator that clears at the front can hit the cabinet at the back as it is pushed in. The ${h.a('how-to-measure-for-a-refrigerator', 'measuring guide')} lists every check, including the path through the door.</p>
${h.mini('fridgeFit', { t: 'Models that fit a 28 inch opening of your height', p: ['h'], d: { w: 28.5, h: 66 } })}
<h2>Layouts at this width</h2>
<p>Top-freezer models are the bulk of the class and the most frugal: their median energy use is ${top.length ? K.num(K.s(top.map((f) => f.kwh)).med) : 'not available'} kWh a year. Bottom-freezer models, ${K.num(bot.length)} of them, raise the fresh food to eye level and usually stand taller. French door models are rare at this width because two doors and a drawer need more room; the list files them with bottom-freezer models and does not separate them.</p>
<h2>Running cost by state</h2>
<p>At the median ${K.num(k.med)} kWh a year, a 28 inch refrigerator costs ${K.usd(K.cost(k.med, K.st('massachusetts')))} a year in Massachusetts, ${K.usd(K.cost(k.med, K.st('florida')))} in Florida and ${K.usd(K.cost(k.med, K.st('washington')))} in Washington, at the prices homes paid in ${K.MONTH}. The tool above uses your state. For a few more cubic feet, compare the ${h.a('30-inch-wide-refrigerator', '30 inch class')}; for a tighter space, the ${h.a('24-inch-refrigerator', '24 inch class')}.</p>
`,
  tool: 'fridgeFit', toolArg: { w: 28.5, h: 67 },
  related: ['30-inch-wide-refrigerator', '24-inch-refrigerator', 'apartment-size-refrigerator', 'refrigerator-electricity-use'],
  sources: ['es_fridge', 'eia_56a'],
});
