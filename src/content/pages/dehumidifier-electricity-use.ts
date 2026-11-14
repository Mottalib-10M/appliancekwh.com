import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const H = K.P.test.dehuHours;
const port = E.DEHUS.filter((x) => !x.whole);
const whole = E.DEHUS.filter((x) => x.whole);
const cls = [[0, 25, 'Up to 25 pints a day'], [25, 40, '25 to 40 pints'], [40, 999, 'Over 40 pints']] as const;
const inCls = (lo: number, hi: number) => port.filter((x) => x.pints > lo && x.pints <= hi);
const kAll = K.s(port.map((x) => x.kwh));
const kMid = K.s(inCls(25, 40).map((x) => x.kwh));
const perH = (kwh: number) => E.dehuKwhPerHour(kwh);
const month = (kwh: number, hrs: number, st = K.US) => perH(kwh) * hrs * 30 * st.now / 100;
const HI = [...K.STATES].sort((a, b) => b.now - a.now)[0];

export default definePage({
  id: 'dehumidifier-electricity-use', group: 'cooling', order: 402, slug: 'dehumidifier-electricity-use',
  nav: 'Dehumidifier electricity use', card: 'kWh per hour of certified portable dehumidifiers by pint size, and the cost of a month of drying in your state.',
  title: 'Dehumidifier Electricity Use 2026: kWh per Hour and Month',
  description: `Dehumidifier electricity use in 2026: kWh per hour of ${K.num(port.length)} certified portable dehumidifiers by pints a day, and what a month of drying costs in each state.`,
  h1: 'Dehumidifier electricity use: per hour, per month',
  intro: `A median certified 25 to 40 pint dehumidifier uses ${K.dec(perH(kMid.med), 2)} kWh per hour of drying. Enter your hours and state: the tool prices your month.`,
  resume: `Dehumidifier electricity use is set by the capacity of the unit, in pints of water removed a day, and by the hours it runs. The ENERGY STAR list of ${K.day(K.UPDATED)} holds ${K.num(port.length)} certified portable dehumidifiers and ${K.num(whole.length)} whole-home units. Its yearly kWh comes from the federal test, which counts ${K.num(H)} hours of operation a year (10 CFR 430, appendix X1); divided by those hours, it gives the energy per hour of running. A median certified portable unit uses ${K.num(kAll.med)} kWh in the test, ${K.dec(perH(kAll.med), 2)} kWh an hour. In the 25 to 40 pint class, the median is ${K.dec(perH(kMid.med), 2)} kWh an hour, about ${K.num(perH(kMid.med) * 1000)} watts. Running 12 hours a day for 30 days, that class costs ${K.usd(month(kMid.med, 12))} at the U.S. average home price of ${K.MONTH} and ${K.usd(month(kMid.med, 12, HI))} in ${HI.name}. A damp basement in summer can keep a unit running far longer than the test assumes, which is why the tool asks for your own hours. The list gives no dimensions for dehumidifiers.`,
  faqs: [
    { q: 'How much does it cost to run a dehumidifier per month?', a: `For a median certified 25 to 40 pint unit running 12 hours a day, ${K.usd(month(kMid.med, 12))} for 30 days at the U.S. average price of ${K.MONTH}. Running it around the clock doubles that. The tool takes your hours, your size and your state.` },
    { q: 'How many watts does a dehumidifier use?', a: `Averaged over the ${K.num(H)} hours of the federal test, a median certified portable unit draws about ${K.num(perH(kAll.med) * 1000)} watts, and a 25 to 40 pint unit about ${K.num(perH(kMid.med) * 1000)}. The fan alone draws less once the compressor stops. The tool turns that draw into dollars for your hours.` },
    { q: 'Is a bigger dehumidifier more expensive to run?', a: 'Per hour, yes, but it removes more water per hour, so in a very damp space it may reach the set humidity and stop sooner than a small unit that runs all day. Size it to the space and the dampness, then compare certified models of that size.' },
  ],
  body: (h) => `
<h2>Dehumidifier electricity use by size</h2>
<p>The table groups the certified portable units by their capacity in pints a day, with the median energy in the test, the energy per hour and the cost of a month at 12 hours a day.</p>
${h.table(['Size', 'Models', 'Typical kWh in the test', 'kWh per hour', 'Month, 12 h a day, U.S. average', `Same month, ${HI.name}`], cls.map(([lo, hi, l]) => { const s = K.s(inCls(lo, hi).map((x) => x.kwh)); return [l, K.num(s.n), K.num(s.med), K.dec(perH(s.med), 2), K.usd(month(s.med, 12)), K.usd(month(s.med, 12, HI))]; }), `Certified portable dehumidifiers, ENERGY STAR list of ${K.day(K.UPDATED)}; ${K.num(H)} hours a year in the test; EIA prices, ${K.MONTH}.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Your hours, not the test's</h2>
<p>The yearly figure is the energy of ${K.num(H)} hours at the test conditions set by ${h.src('cfr_430', 'the federal test procedure (10 CFR 430)')}. It is a fair basis for comparing units, not a forecast. A unit set to a low humidity target in a basement that stays wet runs most of the day; a unit in a dry month barely starts. Count the hours it is actually on, or read them from a plug-in meter.</p>
${h.mini('dehu', { t: 'Your hours of drying, priced in your state', p: ['hrs', 'st'], d: { pints: '25-40', hrs: 12, days: 30 } })}
<h2>Whole-home units</h2>
<p>The ${K.num(whole.length)} whole-home dehumidifiers on the list connect to the ducts of a home and are rated under another part of the test. They are left out of the table and the tool, which compare portable units only.</p>
<h2>Cooling and the bill</h2>
<p>A window air conditioner also removes moisture while it cools; its running cost is on the ${h.a('window-air-conditioner-electricity-use', 'window air conditioner page')}. The ${h.a('electricity-cost-by-state', 'state comparison')} gives the price per kWh that multiplies every figure here.</p>
<h2>Reading the size</h2>
<p>The capacity in pints a day on the list is the water a unit removes in a day under the test conditions, set by the current federal test. Ratings printed on older units may come from an earlier method, so compare certified models on the same list, as the table does. A cool basement slows any unit down.</p>
`,
  tool: 'dehu',
  related: ['window-air-conditioner-electricity-use', 'electricity-cost-by-state', 'freezer-electricity-use', 'dryer-electricity-use'],
  sources: ['es_dehu', 'cfr_430', 'eia_56a'],
});
