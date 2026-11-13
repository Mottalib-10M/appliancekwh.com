import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = [...K.STATES].sort((a, b) => b.now - a.now);
const HI = S[0], LO = S[S.length - 1];
const t = K.typical();
const total = t.reduce((a, x) => a + x.kwh, 0);
const up = K.STATES.filter((x) => x.now > x.prev).length;
const chg = (x: { now: number; prev: number }) => (x.now - x.prev) / x.prev;

export default definePage({
  id: 'electricity-cost-by-state', group: 'cooling', order: 404, slug: 'electricity-cost-by-state',
  nav: 'Electricity cost by state', card: 'The home price per kWh in every state, a year apart, and what five certified appliances cost to run there.',
  title: 'Electricity Cost by State 2026: Appliance Running Costs',
  description: `Electricity cost by state in 2026: home price per kWh in 50 states and DC for ${K.MONTH}, the change in a year, and what five appliances cost to run in each.`,
  h1: 'Electricity cost by state: what your appliances cost to run',
  intro: `Electricity cost by state: homes paid ${K.dec(K.US.now, 2)}¢ per kWh on average in ${K.MONTH}, from ${K.dec(LO.now, 2)}¢ in ${LO.name} to ${K.dec(HI.now, 2)}¢ in ${HI.name}. Pick your state: the tool prices five appliances.`,
  resume: `Electricity cost by state varies more than appliance efficiency does. In ${K.MONTH}, the average residential price was ${K.dec(K.US.now, 2)} cents per kWh across the country, against ${K.dec(K.US.prev, 2)} cents in ${K.PREV}, according to the Energy Information Administration (EIA), the statistics agency of the Department of Energy. ${HI.name} paid the most, ${K.dec(HI.now, 2)} cents, and ${LO.name} the least, ${K.dec(LO.now, 2)} cents. Prices rose in ${K.num(up)} of the 51 states and DC entries over the year. The tool applies those prices to five certified appliances at the median of the ENERGY STAR list of ${K.day(K.UPDATED)}: a full-size refrigerator, an upright freezer, a clothes washer, an electric dryer and a dishwasher, ${K.num(total)} kWh a year together. That set costs ${K.usd(K.cost(total))} a year at the U.S. average price, ${K.usd(K.cost(total, HI))} in ${HI.name} and ${K.usd(K.cost(total, LO))} in ${LO.name}. These are prices of one month; summer and winter months differ, and your own utility's rate and fixed charges are on your bill.`,
  faqs: [
    { q: 'Which state has the most expensive electricity?', a: `${HI.name}, at ${K.dec(HI.now, 2)} cents per kWh for homes in ${K.MONTH}. The next highest were ${S[1].name} and ${S[2].name}. The table on this page ranks every state for that month, with the price a year earlier. The tool prices five appliances at any state's figure.` },
    { q: 'Which state has the cheapest electricity?', a: `${LO.name}, at ${K.dec(LO.now, 2)} cents per kWh for homes in ${K.MONTH}, followed by ${S[S.length - 2].name} and ${S[S.length - 3].name}. At that price, the five certified appliances of the tool cost ${K.usd(K.cost(total, LO))} a year to run. The table on this page ranks every state for that month.` },
    { q: 'Is the price per kWh the same as my rate?', a: 'No. The EIA figure is the average revenue per kWh sold to homes in the state in one month, fixed charges and all utilities included. Your rate depends on your utility, your plan and the season; the bill shows it. Use the state figure for comparisons and estimates.' },
  ],
  body: (h) => `
<h2>Electricity cost by state, ${K.MONTH}</h2>
<p>The table ranks the states by the average price homes paid per kWh in ${K.MONTH}, with the price a year earlier, the change and the cost of running the five certified appliances of the tool for a year.</p>
${h.table(['State', `${K.MONTH}, ¢/kWh`, `${K.PREV}, ¢/kWh`, 'Change', 'Five appliances a year'], S.map((x) => [x.name, K.dec(x.now, 2), K.dec(x.prev, 2), `${chg(x) >= 0 ? '+' : ''}${K.pct(chg(x))}`, K.usd(K.cost(total, x))]), `EIA, Electric Power Monthly, table 5.6.A, residential sector; appliances at the median of the ENERGY STAR list of ${K.day(K.UPDATED)}.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>The five appliances</h2>
<p>The set is the median certified model of each kind: ${t.map((x) => `${x.label.toLowerCase()} ${K.num(x.kwh)} kWh`).join(', ')}. The refrigerator and the freezer run all year, so their figure is close to real use; the washer, dryer and dishwasher figures assume the number of cycles of the federal test. A gas dryer moves part of the dryer's cost to the gas bill.</p>
${h.mini('state', { t: 'Five appliances priced in your state', p: ['st'], d: { st: 'us' } })}
<h2>Where the prices come from</h2>
<p>The prices are the residential averages of ${h.src('eia_56a', 'EIA table 5.6.A')}, a public statistic of the Department of Energy. They are prices of a single month and are revised in later releases. They are not updated automatically here; the month used is shown on each figure.</p>
<h2>Each appliance in detail</h2>
<p>The ${h.a('refrigerator-electricity-use', 'refrigerator')}, ${h.a('dryer-electricity-use', 'dryer')} and ${h.a('window-air-conditioner-electricity-use', 'window air conditioner')} pages give the yearly or hourly use of every certified model of those kinds.</p>
<h2>Why prices differ</h2>
<p>The state average blends many utilities, cooperatives and municipal systems, each with its own rate. The mix of power plants, the cost of the grid and state policies all weigh on it, and the EIA table reports the outcome, not the causes. Within one state, two neighbors on different utilities can pay quite different prices; the bill gives yours.</p>
`,
  tool: 'state',
  related: ['refrigerator-electricity-use', 'dryer-electricity-use', 'window-air-conditioner-electricity-use', 'washing-machine-electricity-use'],
  sources: ['eia_56a', 'es_fridge', 'es_freezer'],
});
