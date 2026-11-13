import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const D = E.DISHES;
const k = K.s(D.map((x) => x.kwh)), g = K.s(D.map((x) => x.gal));
const C1 = K.P.test.dishCyclesC1, C2 = K.P.test.dishCyclesC2;
const atTop = D.filter((x) => x.kwh === k.max).length;
const lean = [...D].sort((a, b) => a.kwh - b.kwh)[0];
const HI = [...K.STATES].sort((a, b) => b.now - a.now)[0];
const fridge = K.typical()[0].kwh;

export default definePage({
  id: 'dishwasher-electricity-use', group: 'kitchen', order: 304, slug: 'dishwasher-electricity-use',
  nav: 'Dishwasher electricity use', card: 'kWh a year and per cycle of certified dishwashers, water use, and the cost in your state.',
  title: 'Dishwasher Electricity Use 2026: kWh per Cycle and per Year',
  description: `Dishwasher electricity use in 2026: kWh a year of ${K.num(D.length)} certified dishwashers, about how much per cycle under the federal test, water use and cost by state.`,
  h1: 'Dishwasher electricity use: per year and per cycle',
  intro: `The median certified dishwasher uses ${K.num(k.med)} kWh a year. Enter your cabinet and state: the tool shows the models that fit and what they cost to run.`,
  resume: `Dishwasher electricity use is modest and very even across certified models. On the ENERGY STAR list of ${K.day(K.UPDATED)}, the ${K.num(D.length)} certified dishwashers with plausible sizes use a median ${K.num(k.med)} kWh a year, from ${K.num(k.min)} to ${K.num(k.max)}; ${K.num(atTop)} of them share the top figure. The yearly figure comes from the federal test, which counts a fixed number of cycles a year: ${K.num(C1)} in one version of the test and ${K.num(C2)} in the newer one. Per cycle, the median model therefore uses roughly ${K.dec(k.med / C1, 2)} to ${K.dec(k.med / C2, 2)} kWh, including the energy to heat the water inside the machine. Water use is a median ${K.dec(g.med)} gallons a cycle. At the U.S. average home price of ${K.MONTH}, the median dishwasher costs ${K.usd(K.cost(k.med))} a year to run, or about ${K.usd2(K.cost(k.med) / C2)} a cycle under the newer test count. That is less than a quarter of a median refrigerator, which uses ${K.num(fridge)} kWh a year. The most frugal certified model, the ${lean.brand} ${lean.model}, uses ${K.num(lean.kwh)} kWh.`,
  faqs: [
    { q: 'How much electricity does a dishwasher use per cycle?', a: `Roughly ${K.dec(k.med / C1, 2)} to ${K.dec(k.med / C2, 2)} kWh for the median certified model: its ${K.num(k.med)} kWh a year divided by the ${K.num(C1)} or ${K.num(C2)} cycles of the federal test. Heavy or sanitize cycles use more, eco cycles less. The list does not say which test version each model used.` },
    { q: 'How many watts does a dishwasher use?', a: 'The heating element draws the most, for the minutes it heats the water and the drying air; the pumps draw far less. The list does not publish wattage. For cost, the yearly kWh is the right figure, and it already includes every part of the cycle tested.' },
    { q: 'Is it cheaper to wash dishes by hand?', a: `This site does not measure hand washing, so it cannot say. What the list shows is that a certified dishwasher uses a median ${K.dec(g.med)} gallons of water a cycle and costs about ${K.usd2(K.cost(k.med) / C2)} of electricity per cycle at the U.S. average price, water heating inside the machine included.` },
  ],
  body: (h) => `
<h2>Dishwasher electricity use on the certified list</h2>
<p>The table sets the yearly kWh, the cost a year and the approximate cost per cycle for the median model and for the extremes of the list.</p>
${h.table(['Model', 'kWh a year', 'Cost a year, U.S. average', `Cost a year, ${HI.name}`, 'About per cycle'], [['Most frugal certified', k.min], ['Median certified', k.med], ['Highest certified', k.max]].map(([l, x]) => [l as string, K.num(x as number), K.usd(K.cost(x as number)), K.usd(K.cost(x as number, HI)), K.usd2(K.cost(x as number) / C2)]), `ENERGY STAR certified dishwashers, list of ${K.day(K.UPDATED)}; EIA prices, ${K.MONTH}; per cycle with the ${K.num(C2)} cycles a year of the newer federal test.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>What the yearly figure counts</h2>
<p>The federal test procedure (${h.src('cfr_430', '10 CFR 430, subpart B')}) measures the electricity of a test cycle, including heating the water inside the machine, and the power drawn while it waits, then multiplies by a fixed number of cycles. The list does not say which version each model was tested under, so small gaps between two models are not a reliable ranking.</p>
${h.mini('dish', { t: 'Running cost of the dishwashers that fit your cabinet', p: ['st'], d: { w: 24, d: 24 } })}
<h2>Using less at home</h2>
<p>The yearly figure counts cycles, not dishes, so running full loads gets the most out of each cycle. Air drying, where the model offers it, skips the heated dry. Scraping plates instead of rinsing them under a running tap saves the water of the rinse.</p>
<h2>Sizes</h2>
<p>Energy differs little between widths, but capacity does. The ${h.a('24-inch-dishwasher', '24 inch page')} lists the standard models by depth, the ${h.a('18-inch-dishwasher', '18 inch page')} the narrow ones, and the ${h.a('electricity-cost-by-state', 'state comparison')} puts the dishwasher next to the other appliances of a home.</p>
<h2>Reading the label</h2>
<p>The yellow EnergyGuide label on a new dishwasher shows an estimated yearly cost and the yearly kWh, set by the Federal Trade Commission rules for a fixed electricity price. That printed cost uses a national price, not yours, so it can be far from your bill. The kWh figure on the label is the one to keep: multiply it by the price per kWh in your state, which is what the tool does with the prices homes paid in ${K.MONTH}.</p>
`,
  tool: 'dish',
  related: ['24-inch-dishwasher', '18-inch-dishwasher', 'electricity-cost-by-state', 'washing-machine-electricity-use'],
  sources: ['es_dish', 'eia_56a', 'cfr_430'],
});
