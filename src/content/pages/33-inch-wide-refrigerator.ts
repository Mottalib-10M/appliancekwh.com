import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const L = E.widthClass(33);
const k = K.s(L.map((f) => f.kwh)), hgt = K.s(L.map((f) => f.h)), vol = K.s(L.map((f) => f.vol));
const grp = (t: string) => L.filter((f) => f.type === t);
const top = grp('Top Freezer'), bot = grp('Bottom Freezer'), side = grp('Side-by-Side'), single = grp('Freezerless and Single Door');
const v30 = K.s(E.widthClass(30).map((f) => f.vol)).med, v36 = K.s(E.widthClass(36).map((f) => f.vol)).med;
const disp = L.filter((f) => f.ice).length;
const lean = [...L].sort((a, b) => a.kwh - b.kwh)[0];

export default definePage({
  id: '33-inch-wide-refrigerator', group: 'fridge', order: 105, slug: '33-inch-wide-refrigerator',
  nav: '33 inch wide refrigerator', card: 'Thirty-three inches: more room than a 30 inch model without the energy use of a 36 inch one.',
  title: '33 Inch Wide Refrigerator 2026: Capacity, Height and Cost',
  description: `33 inch wide refrigerator options in 2026: ${K.num(L.length)} certified models, how they compare with the 30 and 36 inch sizes in capacity, kWh and yearly running cost.`,
  h1: '33 inch wide refrigerator: the middle step between 30 and 36',
  intro: `The ENERGY STAR list holds ${K.num(L.length)} full-size refrigerators about 33 inches wide. Enter your height to see which ones your kitchen takes.`,
  resume: `A 33 inch wide refrigerator fills openings that are too wide for a 30 inch model and too narrow for a 36 inch one, a common case when a kitchen was laid out with a 33 inch space or when a bulky trim eats into a 36 inch opening. On the ENERGY STAR list of ${K.day(K.UPDATED)}, ${K.num(L.length)} full-size models are wider than 32 and up to 33.5 inches. Their median capacity is ${K.dec(vol.med)} cubic feet, between ${K.dec(v30)} for the 30 inch class and ${K.dec(v36)} for the 36 inch class. Heights run from ${K.inch(hgt.min)} to ${K.inch(hgt.max)}, median ${K.inch(hgt.med)}. All the common layouts exist at this width: ${K.num(bot.length)} bottom-freezer, ${K.num(top.length)} top-freezer, ${K.num(single.length)} without freezer and ${K.num(side.length)} side-by-side. The median model uses ${K.num(k.med)} kWh a year, ${K.usd(K.cost(k.med))} at the U.S. average price of ${K.MONTH}. The most frugal one, the ${lean.brand} ${lean.model}, uses ${K.num(lean.kwh)} kWh.`,
  faqs: [
    { q: 'Is 33 inches a standard refrigerator width?', a: `It is one of the five widths around which the list clusters, with ${K.num(L.length)} certified full-size models. It is less common than 30 or 36 inches, so the choice of colors and finishes is narrower, but every layout exists at this width, from top freezer to side-by-side.` },
    { q: 'Can I put a 33 inch refrigerator in a 36 inch space?', a: 'Yes. Three inches of play leave air at the sides and room for the doors to swing, and fillers or trim panels can close the gap visually. You give up capacity compared with a 36 inch model; the tool shows how many 36 inch models would fit the same height if you would rather fill the space.' },
    { q: 'How many cubic feet is a 33 inch refrigerator?', a: `The median certified model of that width holds ${K.dec(vol.med)} cubic feet, with a range from ${K.dec(vol.min)} to ${K.dec(vol.max)}. Bottom-freezer models are usually a little larger than top-freezer ones at the same width, because they are taller. The tool shows the capacity of the models that fit your opening.` },
  ],
  body: (h) => `
<h2>Where a 33 inch wide refrigerator makes sense</h2>
<p>Three situations bring buyers to this width. A kitchen designed with a 33 inch space, which some builders use to fit a larger refrigerator without the full 36 inches. A 36 inch opening narrowed by molding, a wall that is out of square or a cabinet side panel. And a 30 inch model that has become too small, in a space where a cabinet can be trimmed by three inches. In each case, measure the narrowest point first, then enter it in the tool.</p>
${h.table(['Layout', 'Models', 'Median height', 'Median capacity', 'Median kWh a year'], [[bot, 'Bottom freezer'], [top, 'Top freezer'], [single, 'No freezer'], [side, 'Side-by-side']].filter(([x]) => (x as typeof L).length).map(([x, l]) => { const a = x as typeof L; return [l as string, K.num(a.length), K.inch(K.s(a.map((f) => f.h)).med), `${K.dec(K.s(a.map((f) => f.vol)).med)} cu ft`, K.num(K.s(a.map((f) => f.kwh)).med)]; }), `Certified full-size models wider than 32 and up to 33.5 inches, list of ${K.day(K.UPDATED)}.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>The step up from 30 inches</h2>
<p>Three more inches buy about ${K.dec(vol.med - v30)} cubic feet at the median, a shelf and a door bin more. The energy cost of that step is modest: the median 33 inch model uses ${K.num(k.med)} kWh a year, against ${K.num(K.s(E.widthClass(30).map((f) => f.kwh)).med)} for the median 30 inch model. The jump to 36 inches is larger in both capacity and energy, because that class is dominated by bottom-freezer and side-by-side models with ice and water in the door; ${K.num(disp)} of the 33 inch models have an automatic ice maker.</p>
${h.mini('fridgeFit', { t: 'How many 33 inch models fit your height', p: ['h'], d: { w: 33.5, h: 68 } })}
<h2>Height and the cabinet above</h2>
<p>With a median of ${K.inch(hgt.med)}, models of this width are a little taller than 30 inch ones. If a cabinet sits above the opening, measure to its underside at the front and at the back. A bottom-freezer model also needs the drawer to pull out fully in front of it, which matters in a narrow kitchen with an island.</p>
<h2>Running cost by state</h2>
<p>At the prices homes paid in ${K.MONTH}, the median 33 inch model costs ${K.usd(K.cost(k.med, K.st('new-york')))} a year in New York, ${K.usd(K.cost(k.med, K.st('georgia')))} in Georgia and ${K.usd(K.cost(k.med, K.st('arizona')))} in Arizona. The state menu in the tool gives yours. For the wider format, see the ${h.a('36-inch-refrigerator', '36 inch refrigerator')} page; for the narrower one, the ${h.a('30-inch-wide-refrigerator', '30 inch page')}.</p>
`,
  tool: 'fridgeFit', toolArg: { w: 33.5, h: 70 },
  related: ['36-inch-refrigerator', '30-inch-wide-refrigerator', 'counter-depth-refrigerator-dimensions', 'how-to-measure-for-a-refrigerator'],
  sources: ['es_fridge', 'eia_56a'],
});
