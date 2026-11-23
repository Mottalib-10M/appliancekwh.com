import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

// Campagne 2027 (2026-11-23): the only official 2027 price is the EIA forecast (STEO, November 2026), a U.S.
// annual average. Appliance use is the same; the page prices the five median certified appliances at it.
const F = K.P.steo;
const t = K.typical();
const total = t.reduce((a, x) => a + x.kwh, 0);
const at = (kwh: number, cents: number) => (kwh * cents) / 100;
// Change of the rounded dollar amounts, so a table row adds up as read.
const up = (kwh: number) => Math.round(at(kwh, F.us2027)) - Math.round(at(kwh, F.us2026));
const rise = (F.us2027 - F.us2026) / F.us2026;
const S = [...K.STATES].sort((a, b) => b.now - a.now);

export default definePage({
  id: 'appliance-electricity-cost-2027', group: 'cooling', order: 405, slug: 'appliance-electricity-cost-2027',
  nav: 'Running costs in 2027', card: 'The EIA forecast for the home price of electricity in 2027 and what five certified appliances would cost to run at it.',
  title: 'Appliance Electricity Cost 2027: EIA Forecast vs 2026',
  description: `Appliance electricity cost 2027: the EIA forecasts ${K.dec(F.us2027, 1)}¢ per kWh for homes, against ${K.dec(F.us2026, 1)}¢ in 2026. What a fridge, washer, dryer and more cost to run a year.`,
  h1: 'Appliance electricity cost in 2027: the forecast price and your running costs',
  intro: `Appliance electricity cost in 2027: the Energy Information Administration forecasts a home price of ${K.dec(F.us2027, 1)}¢ per kWh for 2027. Pick your state: the tool prices five certified appliances at today's state price; the tables below show the national 2027 forecast.`,
  resume: `Nobody measures 2027 electricity prices yet, but the Energy Information Administration (EIA), the statistics agency of the Department of Energy, publishes a forecast every month in its Short-Term Energy Outlook. The November 2026 edition puts the average residential price at ${K.dec(F.us2026, 1)} cents per kWh for 2026 and ${K.dec(F.us2027, 1)} cents for 2027, a rise of ${K.pct(rise)}. An appliance uses the same energy whatever the year, so its running cost moves with the price. The five median certified appliances of this site, a full-size refrigerator, an upright freezer, a clothes washer, an electric dryer and a dishwasher, use ${K.num(total)} kWh a year together. At the 2027 forecast that is ${K.usd(at(total, F.us2027))} a year, ${K.usd(up(total))} more than at the 2026 average. The forecast is national: the price in your state was ${K.dec(S[S.length - 1].now, 2)}¢ to ${K.dec(S[0].now, 2)}¢ in ${K.MONTH}, and that gap matters far more than the change from one year to the next.`,
  faqs: [
    { q: 'How much will electricity cost per kWh in 2027?', a: `About ${K.dec(F.us2027, 1)} cents per kWh for homes on average across the country, according to the EIA forecast of November 2026, against ${K.dec(F.us2026, 1)} cents for 2026. It is a forecast, revised every month, and a national average: each state, utility and plan has its own price, which your bill shows.` },
    { q: 'Will my refrigerator cost more to run in 2027?', a: `Only by the change in price. A median certified full-size refrigerator uses ${K.num(t[0].kwh)} kWh a year: ${K.usd(at(t[0].kwh, F.us2026))} at the 2026 average price and ${K.usd(at(t[0].kwh, F.us2027))} at the 2027 forecast. Its use does not grow with the calendar, though an old model, a full freezer or a warm kitchen use more.` },
    { q: 'Should I replace an appliance before 2027 prices rise?', a: `The rise forecast for 2027 is small next to the gap between models. On this site's lists, the most efficient certified refrigerators of a size use far less than the least efficient ones; the refrigerator page shows both. A replacement pays off through that gap over many years, not through one year of higher prices.` },
  ],
  body: (h) => `
<h2>Appliance electricity cost 2027, appliance by appliance</h2>
<p>The yearly kWh are the medians of the ENERGY STAR lists used across the site. The prices are the ${h.src('eia_steo', 'EIA Short-Term Energy Outlook')} of November 2026: the 2026 average, nearly complete, and the 2027 forecast.</p>
${h.table(['Appliance', 'kWh a year', `2026, ${K.dec(F.us2026, 1)}¢`, `2027, ${K.dec(F.us2027, 1)}¢ forecast`, 'Change'], [
    ...t.map((x) => [x.label, K.num(x.kwh), K.usd(at(x.kwh, F.us2026)), K.usd(at(x.kwh, F.us2027)), K.usd(up(x.kwh))]),
    ['All five', K.num(total), K.usd(at(total, F.us2026)), K.usd(at(total, F.us2027)), K.usd(up(total))],
  ], `U.S. average residential price, EIA STEO released ${K.day(F.release)}. Washer, dryer and dishwasher at the cycles of the federal test.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The refrigerator and the freezer run all year, so their figures are close to real use. The washer, dryer and dishwasher figures assume the number of cycles of the federal test procedure; a large family runs more. A gas dryer moves most of its cost to the gas bill.</p>
${h.mini('state', { t: 'Five appliances priced in your state today', p: ['st'], d: { st: 'us' } })}
<h2>The forecast and your state</h2>
<p>The forecast is a national annual average. The measured prices by state come from ${h.src('eia_56a', 'EIA table 5.6.A')}: in ${K.MONTH}, homes paid ${K.dec(K.US.now, 2)}¢ per kWh on average, from ${K.dec(S[S.length - 1].now, 2)}¢ in ${S[S.length - 1].name} to ${K.dec(S[0].now, 2)}¢ in ${S[0].name}. A single month runs above or below the yearly average with the season, which is why it differs from the ${K.dec(F.us2026, 1)}¢ of the forecast table. The EIA does not forecast each state; applying the national ${K.pct(rise)} to a state price would be an estimate of this site, and the page does not do it.</p>
<p>The ${h.a('electricity-cost-by-state', 'state page')} ranks every state for the latest month with the price a year earlier. For a single appliance, the ${h.a('refrigerator-electricity-use', 'refrigerator')}, ${h.a('dryer-electricity-use', 'dryer')} and ${h.a('washing-machine-electricity-use', 'washer')} pages give the yearly use of every certified model.</p>
<h2>How far to trust a price forecast</h2>
<p>The Short-Term Energy Outlook is revised every month, so the 2027 figure can move before and during the year; the page shows the edition it uses. For an appliance decision, the price you pay today, read on your bill, and the kWh of the model you are looking at give a better answer than any forecast. The forecast is useful for a household budget: multiply the yearly kWh of your appliances by it to see roughly what next year looks like</p>
`,
  tool: 'state',
  related: ['electricity-cost-by-state', 'refrigerator-electricity-use', 'dryer-electricity-use', 'washing-machine-electricity-use'],
  sources: ['eia_steo', 'eia_56a', 'es_fridge'],
});
