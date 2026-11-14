import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const H = K.P.test.acCoolingHours;
const rows = E.AC_SIZES.map((b) => ({ b, list: E.acClass(b) })).filter((x) => x.list.length);
const m = (b: number) => K.s(E.acClass(b).map((x) => x.kwh));
const k8 = m(8000), k12 = m(12000);
const perH = (kwh: number) => E.acKwhPerHour(kwh);
const month = (kwh: number, st = K.US) => perH(kwh) * 8 * 30 * st.now / 100;
const win = E.ACS.filter((x) => !x.wall);
const HI = [...K.STATES].sort((a, b) => b.now - a.now)[0];

export default definePage({
  id: 'window-air-conditioner-electricity-use', group: 'cooling', order: 401, slug: 'window-air-conditioner-electricity-use',
  nav: 'Window air conditioner cost', card: 'kWh per hour of certified window units by BTU, and what a month of cooling costs in your state.',
  title: 'Window Air Conditioner Electricity Use 2026: Cost per Month',
  description: `Window air conditioner electricity use in 2026: kWh per hour of ${K.num(win.length)} certified window units by BTU size, and what your hours of cooling cost in your state.`,
  h1: 'Window air conditioner electricity use: cost per hour and month',
  intro: `Window air conditioner electricity use: a median certified 8,000 BTU unit uses ${K.dec(perH(k8.med), 2)} kWh per hour of cooling. Enter your hours and state: the tool gives the cost of your month.`,
  resume: `Window air conditioner electricity use depends on the size of the unit, its efficiency and the hours it runs. The ENERGY STAR list of ${K.day(K.UPDATED)} gives a yearly kWh for each of ${K.num(win.length)} certified window units, measured under the federal test, which counts ${K.num(H)} hours of cooling a year (10 CFR 430, appendix F). Divided by those hours, the yearly figure gives the energy per hour of cooling. A median certified 8,000 BTU unit uses ${K.dec(perH(k8.med), 2)} kWh an hour, about ${K.num(perH(k8.med) * 1000)} watts, and a median 12,000 BTU unit ${K.dec(perH(k12.med), 2)} kWh. At the U.S. average home price of ${K.MONTH}, eight hours a day for 30 days costs ${K.usd(month(k8.med))} for the 8,000 BTU unit and ${K.usd(month(k12.med))} for the 12,000 BTU unit. In ${HI.name}, the most expensive state, the same month with the smaller unit costs ${K.usd(month(k8.med, HI))}. Within one size, the most frugal certified model uses less than the median; the tool shows that gap for your hours. Real use depends on the heat outside, the room and the thermostat.`,
  faqs: [
    { q: 'How much does it cost to run a window air conditioner per month?', a: `For a median certified 8,000 BTU unit running 8 hours a day for 30 days, ${K.usd(month(k8.med))} at the U.S. average price of ${K.MONTH}. A 12,000 BTU unit costs ${K.usd(month(k12.med))} for the same hours. Enter your own hours and state in the tool; a hotter month makes the compressor run more of each hour.` },
    { q: 'How many watts does a window air conditioner use?', a: `Averaged over the federal test's ${K.num(H)} cooling hours, a median certified 8,000 BTU unit draws about ${K.num(perH(k8.med) * 1000)} watts and a 12,000 BTU unit about ${K.num(perH(k12.med) * 1000)}. The nameplate wattage is the draw at full load and is higher. Use the per-hour figure for cost.` },
    { q: 'Does a bigger window unit cost more to run?', a: 'Per hour of running, yes: a larger unit draws more power. But an undersized unit may run all day without cooling the room, while a correctly sized one cycles off. Size the unit to the room first, then compare certified models of that size by their yearly kWh, which is what the tool does.' },
  ],
  body: (h) => `
<h2>Window air conditioner electricity use by size</h2>
<p>The table gives, for each common size, the number of certified window units within 5% of that rating, their median yearly kWh in the test, the energy per hour of cooling and the cost of a month at eight hours a day.</p>
${h.table(['Size', 'Models', 'Typical kWh in the test', 'kWh per hour', 'Month, 8 h a day, U.S. average', `Same month, ${HI.name}`], rows.map((x) => { const s = K.s(x.list.map((y) => y.kwh)); return [`${K.num(x.b)} BTU`, K.num(x.list.length), K.num(s.med), K.dec(perH(s.med), 2), K.usd(month(s.med)), K.usd(month(s.med, HI))]; }), `Certified window units, ENERGY STAR list of ${K.day(K.UPDATED)}; ${K.num(H)} cooling hours per year (${'appendix F'}); EIA prices, ${K.MONTH}.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>From yearly test figure to your bill</h2>
<p>The yearly kWh on the list is not a forecast of your use: it is the energy of ${K.num(H)} hours of cooling at test conditions, set by ${h.src('cfr_430_f', 'appendix F to the federal test procedure')}. Dividing it by those hours gives a fair per-hour figure for comparing units and for estimating your own hours. A unit in a sunny west window on a hot afternoon runs its compressor more than in the test; in mild weather it cycles off and uses less. Count the hours the unit is actually switched on and cooling.</p>
${h.mini('ac', { t: 'Your hours of cooling, priced in your state', p: ['hrs', 'st'], d: { btu: '10000', hrs: 6, days: 30 } })}
<h2>Efficiency: what the list rates</h2>
<p>The list gives each unit a combined energy efficiency ratio, cooling delivered per unit of power including standby. A higher ratio means less energy for the same cooling. Units with a variable speed compressor, which the list flags, can slow down instead of stopping and restarting. In the tool, the line "most frugal of them" shows what the best certified unit of your size would cost for the same hours.</p>
<h2>Other cooling and drying costs</h2>
<p>A humid basement or a room that stays damp after cooling often needs a dehumidifier, whose running cost is on the ${h.a('dehumidifier-electricity-use', 'dehumidifier page')}. The ${h.a('electricity-cost-by-state', 'state comparison')} gives the price per kWh in every state, the figure that multiplies every result on this page.</p>
`,
  tool: 'ac',
  related: ['dehumidifier-electricity-use', 'electricity-cost-by-state', 'freezer-electricity-use', 'refrigerator-electricity-use'],
  sources: ['es_ac', 'cfr_430_f', 'eia_56a'],
});
