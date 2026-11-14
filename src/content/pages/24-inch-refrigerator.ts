import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const L = E.widthClass(24);
const k = K.s(L.map((f) => f.kwh)), hgt = K.s(L.map((f) => f.h)), vol = K.s(L.map((f) => f.vol));
const by = (t: string) => L.filter((f) => f.type === t);
const top = by('Top Freezer'), bot = by('Bottom Freezer'), single = by('Freezerless and Single Door');
const cd = L.filter((f) => f.cd), bi = L.filter((f) => f.builtin);
const under66 = L.filter((f) => f.h <= 66);
const brands = new Set(L.map((f) => f.brand)).size;
const biggest = [...L].sort((a, b) => b.vol - a.vol)[0];

export default definePage({
  id: '24-inch-refrigerator', group: 'fridge', order: 102, slug: '24-inch-refrigerator',
  nav: '24 inch refrigerator', card: 'Full-size refrigerators about 24 inches wide: how many exist, how tall, how much they hold and use.',
  title: '24 Inch Refrigerator 2026: Sizes, Capacity and kWh',
  description: `24 inch refrigerator choices in 2026: ${K.num(L.length)} certified full-size models about 24 inches wide, their heights, capacity, yearly kWh and running cost by state.`,
  h1: '24 inch refrigerator: every certified full-size model',
  intro: `${K.num(L.length)} full-size refrigerators on the ENERGY STAR list are about 24 inches wide. Enter your opening: the tool keeps the ones that fit.`,
  resume: `A 24 inch refrigerator is the narrowest full-size format sold in the United States, made for apartments and galley kitchens. The ENERGY STAR list of ${K.day(K.UPDATED)} holds ${K.num(L.length)} full-size models wider than 23 and up to 24.5 inches, from ${K.num(brands)} brands. They hold a median ${K.dec(vol.med)} cubic feet, from ${K.dec(vol.min)} to ${K.dec(vol.max)}, against ${K.dec(K.s(E.widthClass(30).map((f) => f.vol)).med)} for a 30 inch model. Heights run from ${K.inch(hgt.min)} to ${K.inch(hgt.max)}, with a median of ${K.inch(hgt.med)}; ${K.num(under66.length)} of them stand 66 inches or less. Top-freezer designs lead with ${K.num(top.length)} models, then bottom-freezer with ${K.num(bot.length)} and refrigerators without a freezer with ${K.num(single.length)}. Energy use is low because the box is small: a median ${K.num(k.med)} kWh a year, which is ${K.usd(K.cost(k.med))} a year at the U.S. average price of ${K.MONTH}. The list does not say how deep each model is; ${K.num(cd.length)} of them carry the counter-depth flag.`,
  faqs: [
    { q: 'How many cubic feet is a 24 inch refrigerator?', a: `On the ENERGY STAR list, the median full-size model about 24 inches wide holds ${K.dec(vol.med)} cubic feet. The smallest holds ${K.dec(vol.min)} and the largest ${K.dec(vol.max)}, the ${biggest.brand} ${biggest.model}. Taller models hold more: the height is where a narrow refrigerator finds its space.` },
    { q: 'Is a 24 inch refrigerator the same as an apartment size refrigerator?', a: `Often, but not always. Apartment size is a sales term with no fixed width, and the ENERGY STAR list does not use it. The 24 inch class is the narrowest full-size format; the 28 inch class holds a median ${K.dec(K.s(E.widthClass(28).map((f) => f.vol)).med)} cubic feet against ${K.dec(vol.med)} here. A model listed a little under 24 inches is built for a 24 inch space with some air at the sides.` },
    { q: 'How much electricity does a 24 inch refrigerator use?', a: `The median certified model of that width uses ${K.num(k.med)} kWh a year, between ${K.num(k.min)} and ${K.num(k.max)} kWh across the list. That is about ${K.usd2(K.cost(k.med) / 12)} a month at the U.S. average price. Change the state in the tool to see the figure where you live.` },
  ],
  body: (h) => `
<h2>What fits a 24 inch refrigerator space</h2>
<p>Narrow kitchens are usually narrow in height as well, with a cabinet low over the refrigerator. That is why height matters most on this page: among the ${K.num(L.length)} certified 24 inch models, height decides more than width. Only ${K.num(under66.length)} stand 66 inches or less, and the tallest reach ${K.inch(hgt.max)}, which only a kitchen with no cabinet above can take. Measure from the floor to the underside of that cabinet, at the front and at the back.</p>
${h.table(['Style', 'Models', 'Median height', 'Median capacity', 'Median kWh a year'], [[top, 'Top freezer'], [bot, 'Bottom freezer'], [single, 'No freezer']].filter(([x]) => (x as typeof L).length).map(([x, l]) => { const a = x as typeof L; return [l as string, K.num(a.length), K.inch(K.s(a.map((f) => f.h)).med), `${K.dec(K.s(a.map((f) => f.vol)).med)} cu ft`, K.num(K.s(a.map((f) => f.kwh)).med)]; }), `Full-size certified models wider than 23 and up to 24.5 inches, list of ${K.day(K.UPDATED)}.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Top freezer, bottom freezer or no freezer</h2>
<p>At this width the classic top-freezer layout gives the most food space for the least money and energy. Bottom-freezer models put the fresh food at eye level, which suits people who rarely use the freezer, and are usually taller. Refrigerators with no freezer at all are often paired with a separate freezer column in custom kitchens; ${K.num(bi.length)} of the 24 inch models are built-in units meant for cabinetry. If a small freezer is enough, the energy difference is worth a look in the table above.</p>
${h.mini('fridgeCost', { t: 'Running cost of a 24 inch refrigerator in your state', p: ['st'], d: { style: 'full', band: 'all', cls: 24 } })}
<h2>Before you order a narrow model</h2>
<p>Three checks avoid most returns. First, the door: a 24 inch door swings in a small arc, but next to a wall it needs room to open past 90 degrees so the crisper drawers slide out; the model sheet gives that clearance. Second, the way in: a narrow refrigerator is still more than 60 inches tall, and stairs or a tight turn in a hallway can stop it before the kitchen. Third, the depth, which the ENERGY STAR list does not publish. ${K.num(cd.length)} models of this width are flagged as counter-depth; for the others, read the depth with and without doors on the maker's sheet.</p>
<p>If your space is slightly wider than 24 inches, the ${h.a('28-inch-wide-refrigerator', '28 inch class')} gains several cubic feet for four more inches. If it is narrower, the choice moves to the ${h.a('mini-fridge-dimensions', 'compact refrigerators')}, which top out well below this capacity. For small rentals, the ${h.a('apartment-size-refrigerator', 'apartment size page')} compares the narrow formats side by side.</p>
<h2>Running cost of a 24 inch refrigerator</h2>
<p>A small box loses less cold, so a narrow refrigerator is among the cheapest appliances to run. At ${K.num(k.med)} kWh a year, the median 24 inch model costs ${K.usd(K.cost(k.med))} a year at the U.S. average price, ${K.usd(K.cost(k.med, K.st('hawaii')))} in Hawaii, where power costs the most, and ${K.usd(K.cost(k.med, K.st('nevada')))} in Nevada. The most frugal certified model of this width uses ${K.num(k.min)} kWh, the hungriest ${K.num(k.max)}.</p>
`,
  tool: 'fridgeFit', toolArg: { w: 24.5, h: 70, cls: 24 },
  related: ['28-inch-wide-refrigerator', 'apartment-size-refrigerator', 'mini-fridge-dimensions', 'how-to-measure-for-a-refrigerator'],
  sources: ['es_fridge', 'eia_56a'],
});
