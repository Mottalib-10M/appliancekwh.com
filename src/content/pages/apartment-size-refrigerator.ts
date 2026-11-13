import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const N = E.fridges({ style: 'full', maxW: 28.5 });
const k = K.s(N.map((f) => f.kwh)), vol = K.s(N.map((f) => f.vol)), hgt = K.s(N.map((f) => f.h));
const v = (lo: number, hi: number) => N.filter((f) => f.vol >= lo && f.vol < hi);
const B = [[0, 10, 'Under 10 cu ft'], [10, 13, '10 to 13 cu ft'], [13, 16, '13 to 16 cu ft'], [16, 99, '16 cu ft or more']] as const;
const low = N.filter((f) => f.h <= 62);
const compact = E.fridges({ style: 'compact' });
const kc = K.s(compact.map((f) => f.kwh));
const perCu = (a: typeof N) => K.s(a.map((f) => f.kwh / f.vol)).med;

export default definePage({
  id: 'apartment-size-refrigerator', group: 'fridge', order: 108, slug: 'apartment-size-refrigerator',
  nav: 'Apartment size refrigerator', card: 'Narrow full-size refrigerators up to 28 inches wide: capacity, height and energy against a compact unit.',
  title: 'Apartment Size Refrigerator 2026: Narrow Models and kWh',
  description: `Apartment size refrigerator options in 2026: ${K.num(N.length)} certified full-size models up to 28.5 inches wide by capacity, height, kWh and running cost in your state.`,
  h1: 'Apartment size refrigerator: narrow full-size models compared',
  intro: `${K.num(N.length)} certified full-size refrigerators are 28.5 inches wide or less. Enter your opening to count the ones that fit your apartment kitchen.`,
  resume: `An apartment size refrigerator is a full-size refrigerator built narrow, usually 24 to 28 inches wide, for small kitchens where a 30 inch model does not go in. The term is a sales label, not a category on the ENERGY STAR list, so this page takes every certified full-size model up to 28.5 inches wide: ${K.num(N.length)} of them on the list of ${K.day(K.UPDATED)}. They hold a median ${K.dec(vol.med)} cubic feet, from ${K.dec(vol.min)} to ${K.dec(vol.max)}, and stand a median ${K.inch(hgt.med)} tall. ${K.num(low.length)} of them are 62 inches tall or less, for kitchens with a low cabinet above. A median narrow model uses ${K.num(k.med)} kWh a year, ${K.usd(K.cost(k.med))} at the U.S. average price of ${K.MONTH}. A compact refrigerator uses less in total, ${K.num(kc.med)} kWh at the median, but much more per cubic foot of space: ${K.dec(perCu(compact))} kWh a year per cubic foot against ${K.dec(perCu(N))} for the narrow full-size models. For anything beyond a studio, the narrow full-size model is the better use of the power you pay for.`,
  faqs: [
    { q: 'What size is an apartment size refrigerator?', a: `There is no official size. On the certified list, full-size models up to 28.5 inches wide hold a median ${K.dec(vol.med)} cubic feet and stand a median ${K.inch(hgt.med)} tall. A 24 inch model holds less, a 28 inch one more; the table on this page groups them by capacity.` },
    { q: 'Is an apartment size refrigerator cheaper to run than a regular one?', a: `Yes in total, because it is smaller. The median narrow certified model uses ${K.num(k.med)} kWh a year, against ${K.num(K.s(E.fridges({ style: 'full' }).map((f) => f.kwh)).med)} for the median full-size model of any width. Per cubic foot the difference is small: the box holds less food too.` },
    { q: 'Should a renter pick a compact refrigerator instead?', a: `Only for a studio, an office or a second fridge. A compact unit of ${K.dec(K.s(compact.map((f) => f.vol)).med)} cubic feet at the median holds a few days of food, and it uses ${K.dec(perCu(compact))} kWh a year per cubic foot, several times a narrow full-size model. The mini fridge page compares compact sizes.` },
  ],
  body: (h) => `
<h2>Apartment size refrigerator capacity, from small to large</h2>
<p>Narrow refrigerators are bought by capacity as much as by width. The table groups the certified models up to 28.5 inches wide by cubic feet, with the median width and height of each group and the energy it uses. The larger bands mean taller models, so the height you can free decides how far up the table you can go.</p>
${h.table(['Capacity', 'Models', 'Median width', 'Median height', 'Median kWh a year'], B.map(([lo, hi, l]) => { const a = v(lo, hi); return [l, K.num(a.length), a.length ? K.inch(K.s(a.map((f) => f.w)).med) : 'none', a.length ? K.inch(K.s(a.map((f) => f.h)).med) : 'none', a.length ? K.num(K.s(a.map((f) => f.kwh)).med) : 'none']; }), `Certified full-size refrigerators up to 28.5 inches wide, ENERGY STAR list of ${K.day(K.UPDATED)}.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Measure the kitchen and the way in</h2>
<p>In an apartment, the delivery path is as tight as the kitchen. Measure the entry door, any turn in the hallway, the elevator door and its depth, and the kitchen doorway; a refrigerator travels on its back or upright on a dolly, so compare its depth and height with each opening. Then measure the kitchen space itself: width at the narrowest point, height to the underside of the cabinet above, and depth to the front of the counter. The ${h.a('how-to-measure-for-a-refrigerator', 'measuring guide')} goes through each step.</p>
${h.mini('fridgeFit', { t: 'Narrow models that fit your apartment kitchen', p: ['w', 'h'], d: { w: 26, h: 64 } })}
<h2>Top freezer is the norm at this width</h2>
<p>Most narrow full-size models put the freezer on top. It is the most frugal layout on the list and the one that gives the most food space for the width. Bottom-freezer narrow models exist and suit people who use the freezer little; they are usually taller. Landlords replacing a unit should also check the electrical outlet position and whether the old model had a water line for an ice maker.</p>
<h2>Running cost for a renter</h2>
<p>Renters usually pay the electricity, so the yearly kWh matters even on a landlord's appliance. At ${K.num(k.med)} kWh a year, a median narrow model costs ${K.usd(K.cost(k.med, K.st('new-york')))} a year in New York, ${K.usd(K.cost(k.med, K.st('illinois')))} in Illinois and ${K.usd(K.cost(k.med, K.st('texas')))} in Texas at the prices of ${K.MONTH}. The width pages go further: ${h.a('24-inch-refrigerator', '24 inch')} and ${h.a('28-inch-wide-refrigerator', '28 inch')}; for a studio, the ${h.a('mini-fridge-dimensions', 'mini fridge sizes')}.</p>
`,
  tool: 'fridgeFit', toolArg: { w: 28.5, h: 66 },
  related: ['24-inch-refrigerator', '28-inch-wide-refrigerator', 'mini-fridge-dimensions', 'how-to-measure-for-a-refrigerator'],
  sources: ['es_fridge', 'eia_56a'],
});
