import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const full = E.fridges({ style: 'full' });
const k = K.s(full.map((f) => f.kwh));
const watts = (kwh: number) => (kwh / 8760) * 1000;
const styles = [['top', 'Top freezer'], ['bottom', 'Bottom freezer and French door'], ['side', 'Side-by-side'], ['single', 'No freezer'], ['compact', 'Compact']] as const;
const withFed = full.filter((f) => f.fed > 0);
const below = K.med(withFed.map((f) => 1 - f.kwh / f.fed));
const ice = full.filter((f) => f.ice), noIce = full.filter((f) => !f.ice);
const HI = [...K.STATES].sort((a, b) => b.now - a.now)[0], LO = [...K.STATES].sort((a, b) => a.now - b.now)[0];

export default definePage({
  id: 'refrigerator-electricity-use', group: 'fridge', order: 109, slug: 'refrigerator-electricity-use',
  nav: 'Refrigerator electricity use', card: 'How many kWh and watts a refrigerator uses by style, and what it costs a month in your state.',
  title: 'Refrigerator Electricity Use 2026: kWh, Watts and Cost',
  description: `Refrigerator electricity use in 2026: kWh a year and average watts of ${K.num(full.length)} certified models by style, and the cost a month at your state's August 2026 price.`,
  h1: 'Refrigerator electricity use: kWh, watts and cost by style',
  intro: `The median certified full-size refrigerator uses ${K.num(k.med)} kWh a year. Pick a style and a size: the tool gives the median, the range and the cost in your state.`,
  resume: `Refrigerator electricity use is published model by model: every certified refrigerator on the ENERGY STAR list has a yearly kWh measured under the Department of Energy test, the same figure printed on the yellow EnergyGuide label. Across ${K.num(full.length)} full-size certified models on the list of ${K.day(K.UPDATED)}, the median is ${K.num(k.med)} kWh a year, from ${K.num(k.min)} to ${K.num(k.max)}. Spread over the 8,760 hours of a year, the median is an average draw of ${K.num(watts(k.med))} watts. That answers the question of how many watts a refrigerator uses better than a nameplate, because the compressor cycles on and off. Style matters most. A top-freezer model uses a median ${K.num(K.s(E.fridges({ style: 'top' }).map((f) => f.kwh)).med)} kWh and a side-by-side ${K.num(K.s(E.fridges({ style: 'side' }).map((f) => f.kwh)).med)}. At the U.S. average home price of ${K.num(K.US.now, 2)} cents per kWh in ${K.MONTH}, the median full-size model costs ${K.usd(K.cost(k.med))} a year, about ${K.usd2(K.cost(k.med) / 12)} a month. The same model costs ${K.usd(K.cost(k.med, HI))} a year in ${HI.name} and ${K.usd(K.cost(k.med, LO))} in ${LO.name}.`,
  faqs: [
    { q: 'How many watts does a refrigerator use?', a: `Averaged over a year, the median certified full-size refrigerator draws ${K.num(watts(k.med))} watts: ${K.num(k.med)} kWh divided by 8,760 hours. While the compressor runs it draws more, and nothing while it rests. For cost, the yearly kWh is the figure that counts, not the peak.` },
    { q: 'How much electricity does a refrigerator use per month?', a: `The median certified full-size model uses about ${K.num(k.med / 12)} kWh a month, which costs ${K.usd2(K.cost(k.med) / 12)} at the U.S. average price of ${K.MONTH}. A compact model uses about ${K.num(K.s(E.fridges({ style: 'compact' }).map((f) => f.kwh)).med / 12)} kWh a month, a side-by-side about ${K.num(K.s(E.fridges({ style: 'side' }).map((f) => f.kwh)).med / 12)}. Multiply by your own price per kWh for your bill.` },
    { q: 'What does the EnergyGuide label number mean?', a: 'It is the yearly kWh measured under the federal test procedure for that model, the same figure the ENERGY STAR list publishes. The label also shows an estimated yearly cost at a national price set for labeling, which may be older than this month\'s price. Multiply the kWh by your own rate for a current figure.' },
    { q: 'Does an ice maker increase a refrigerator\'s electricity use?', a: `On the list, models with an automatic ice maker use a median ${K.num(K.s(ice.map((f) => f.kwh)).med)} kWh a year against ${K.num(K.s(noIce.map((f) => f.kwh)).med)} for models without one. Part of that gap is size: ice makers are more common on large models. The federal rules put models with an ice maker in separate product classes, each with its own maximum.` },
  ],
  body: (h) => `
<h2>Refrigerator electricity use by style</h2>
<p>The table gives the median yearly kWh, the average watts and the yearly cost at the U.S. average price for each style on the certified list. The spread inside a style is wide, which is why the tool asks for the size as well.</p>
${h.table(['Style', 'Models', 'Typical kWh a year', 'Average watts', 'Cost a year', 'Cost a month'], styles.map(([st, l]) => { const a = E.fridges({ style: st }); const m = K.s(a.map((f) => f.kwh)).med; return [l, K.num(a.length), K.num(m), K.num(watts(m)), K.usd(K.cost(m)), K.usd2(K.cost(m) / 12)]; }), `ENERGY STAR certified refrigerators, list of ${K.day(K.UPDATED)}; EIA U.S. average residential price, ${K.MONTH}.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Certified against the federal maximum</h2>
<p>Every refrigerator sold in the United States must stay under a federal maximum for its product class, set by an equation in its adjusted volume (${h.src('cfr_430', 'Department of Energy rules')}). ENERGY STAR certification requires going further. For the certified full-size models on the list, the median model uses ${K.pct(below)} less than its federal maximum. A refrigerator that only meets the minimum, which is not on this list, uses more than the figures on this page; an old refrigerator built before the current standards uses more still.</p>
${h.mini('fridgeCost', { t: 'Your refrigerator: enter the kWh on its label', p: ['label', 'st'], d: { label: 400 } })}
<h2>Why your real use can differ from the label</h2>
<p>The test runs the refrigerator in a room held at a fixed temperature, with the doors closed and the controls at set positions. At home, the room may be warmer, the doors open dozens of times a day, warm food goes in, and the thermostat may be colder than needed. A refrigerator in a hot garage works much harder than in a kitchen. Leave space behind it for air, keep the door gaskets clean and closing, and the real figure stays close to the label.</p>
<h2>The price of a kWh decides the bill</h2>
<p>The same refrigerator costs ${K.dec(HI.now / LO.now)} times more to run in the dearest state than in the cheapest. In ${K.MONTH} homes paid ${K.num(HI.now, 2)} cents per kWh in ${HI.name} and ${K.num(LO.now, 2)} cents in ${LO.name}, according to ${h.src('eia_56a', 'the EIA')}. The ${h.a('electricity-cost-by-state', 'state comparison')} lists all of them. To compare models before buying, multiply the difference in yearly kWh by your price: 100 kWh a year is worth ${K.usd(K.cost(100))} at the U.S. average. Sizes and fit are on the width pages, starting with the ${h.a('30-inch-wide-refrigerator', '30 inch class')}.</p>
<h2>Refrigerator running cost in 2027</h2>
<p>A refrigerator uses the same kWh in 2027 as in 2026; only the price changes. The one official 2027 figure is a forecast: the ${h.src('eia_steo', 'EIA Short-Term Energy Outlook')} of ${K.day(K.P.steo.release)} puts the U.S. home price at ${K.dec(K.P.steo.us2027, 1)}¢ per kWh for 2027, which would make the median certified full-size model cost ${K.usd((k.med * K.P.steo.us2027) / 100)} a year. Measured 2027 prices by state come from the EIA's Electric Power Monthly about two months after each month ends, so January 2027 is expected in late March 2027. The tool on this page switches to 2027 prices as soon as the EIA publishes them; the ${h.a('appliance-electricity-cost-2027', '2027 running cost page')} follows the forecast until then.</p>
`,
  tool: 'fridgeCost',
  related: ['electricity-cost-by-state', 'freezer-electricity-use', 'mini-fridge-dimensions', '36-inch-refrigerator'],
  sources: ['es_fridge', 'eia_56a', 'cfr_430', 'eia_steo'],
});
