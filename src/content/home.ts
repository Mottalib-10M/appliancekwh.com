/** Text of the home page (the pillar). Every figure comes from the kit. */
import { KIT as K } from '../lib/kit';
import type { FAQ, Helpers } from '../lib/page-types';

const E = K.E;
const full = E.fridges({ style: 'full' });
/* The example opening, through the same function as the tool: every width that fits, and the 30 inch models among them. */
const ex = K.fitSets(30, 67), fitEx = ex.anyWidth, tEx = K.typFridge(ex.near);
const kAll = K.s(full.map((f) => f.kwh));
const byType = (t: string) => K.s(E.fridges({ style: t }).map((f) => f.kwh));
const top = byType('top'), bottom = byType('bottom'), side = byType('side'), single = byType('single'), compact = byType('compact');
const w = (n: number) => E.widthClass(n);
const W = [24, 28, 30, 33, 36].map((n) => ({ n, list: w(n) }));
const hi = [...K.STATES].sort((a, b) => b.now - a.now), lo = [...K.STATES].sort((a, b) => a.now - b.now);
const HI = hi[0], LO = lo[0], CA = K.st('california'), TX = K.st('texas');
const t = K.typical();
const fridgeMed = t[0].kwh;
const cdFull = E.fridges({ style: 'full', cd: 'yes' });
const dish24 = E.dishClass(24), dish18 = E.dishClass(18);

/** The value sentence (RECETTE §2.4), shown on the home page, the About page and the method page. */
export const VALUE = `Most pages about appliance sizes and power use reason with an average wattage and a price per kWh that is years old. Every appliance sold with an ENERGY STAR label has its height, width, capacity and yearly kWh measured and published, model by model, on a public list that the EPA (the Environmental Protection Agency) updates almost every day; and the EIA (the Energy Information Administration) publishes what a kWh costs in each state every month. This site joins the two: it counts the real models that fit your space and prices the energy they use where you live, and sells nothing.`;

export const HOME = {
  title: 'Refrigerator Dimensions 2026: Which Models Fit and Cost',
  description: `Refrigerator dimensions in 2026: enter your opening and see how many of ${K.num(full.length)} ENERGY STAR certified fridges fit, their kWh and running cost in your state.`,
  h1: 'Refrigerator dimensions: which certified models fit your space',
  answer: `A 30 by 67 inch opening takes ${K.num(fitEx.length)} of ${K.num(full.length)} full-size ENERGY STAR refrigerators, ${K.num(tEx.n)} of them 30 inches wide. The typical 30 inch one uses ${K.num(tEx.kwh)} kWh (kilowatt-hours, on your bill): ${K.usd(tEx.cost)} a year at the U.S. average.`,
  intro: 'Enter the width and height of your opening to see your count. Not sure of your numbers? The tool starts from the common 30 inch space.',
  resume: `Refrigerator dimensions come in a few standard widths: about 24, 28, 30, 33 and 36 inches. Height runs from ${K.inch(K.s(full.map((f) => f.h)).min)} to ${K.inch(K.s(full.map((f) => f.h)).max)} for full-size models, with a median of ${K.inch(K.s(full.map((f) => f.h)).med)}. The ENERGY STAR list of ${K.day(K.UPDATED)} holds ${K.num(full.length)} full-size refrigerators sold in the United States and ${K.num(compact.n)} compact ones. A 30 by 67 inch opening takes ${K.num(fitEx.length)} of the full-size models; the ${K.num(tEx.n)} of them that are 30 inches wide have a median capacity of ${K.dec(tEx.vol)} cubic feet. Energy use follows style more than size. A top-freezer model uses a median ${K.num(top.med)} kWh a year, a bottom-freezer ${K.num(bottom.med)} and a side-by-side ${K.num(side.med)}. At the average home price of ${K.MONTH}, ${K.num(K.US.now, 2)} cents per kWh, the median full-size refrigerator costs ${K.usd(K.cost(kAll.med))} a year to run. The same model costs ${K.usd(K.cost(kAll.med, HI))} in ${HI.name} and ${K.usd(K.cost(kAll.med, LO))} in ${LO.name}. The list gives no depth for refrigerators, only a counter-depth flag, so depth stays a check on the maker's sheet.`,
  faqs: [
    { q: 'What are standard refrigerator dimensions?', a: `There is no single standard, but there are standard widths. On the ENERGY STAR list, full-size models cluster at about 24, 28, 30, 33 and 36 inches wide, with a median height of ${K.inch(K.s(full.map((f) => f.h)).med)}. A 30 inch model is ${K.inch(K.s(w(30).map((f) => f.h)).med)} high at the median and a 36 inch model ${K.inch(K.s(w(36).map((f) => f.h)).med)}. Depth is not on the list.` } as FAQ,
    { q: 'How much does it cost to run a refrigerator a year?', a: `The median full-size certified refrigerator uses ${K.num(kAll.med)} kWh a year. At the U.S. average home price of ${K.num(K.US.now, 2)} cents per kWh in ${K.MONTH}, that is ${K.usd(K.cost(kAll.med))} a year, or about ${K.usd2(K.cost(kAll.med) / 12)} a month. The same refrigerator costs ${K.usd(K.cost(kAll.med, HI))} in ${HI.name}, where power costs the most.` },
    { q: 'Does this site sell appliances or earn commissions?', a: 'No. Appliance kWh is an independent site published by Radif Partners. It sells nothing, has no store links and no affiliate program, and asks for no name, phone or e-mail. Model data comes from the public ENERGY STAR lists of the EPA, prices from the Energy Information Administration, each named with its date under Sources.' },
    { q: 'Why do some refrigerators I see in stores not appear?', a: `The tool counts only models certified by ENERGY STAR and listed for the U.S. market. Certified models use less energy than the federal maximum, so models that only meet the minimum are not on the list. Wine coolers (${K.num(E.COOLERS)} entries) are left out, and ${K.num(E.FRIDGE_EXCLUDED)} rows with sizes outside any plausible range in inches.` },
    { q: 'How tall is a standard full-size refrigerator?', a: `On the certified list, the median full-size model is ${K.inch(K.s(full.map((f) => f.h)).med)} tall, from ${K.inch(K.s(full.map((f) => f.h)).min)} to ${K.inch(K.s(full.map((f) => f.h)).max)}. Height matters most under a cabinet: enter the height of your opening in the tool and it keeps only the models that pass, with the gap you choose.` },
    { q: 'How much space should I leave around a refrigerator?', a: 'The ENERGY STAR list does not publish clearances. The installation sheet of each model gives the air gap it needs at the top, the sides and the back, and the room the doors need to open fully. The tool lets you subtract a gap of your choice from the opening before it counts the models.' },
    { q: 'How current are the figures on this site?', a: `The model lists were updated by ENERGY STAR on ${K.day(K.UPDATED)} and read on ${K.day(K.RETRIEVED)}; the electricity prices are the EIA figures for ${K.MONTH}. Nothing updates by itself: the date shown under each figure is the date of the data used.` },
  ],
  /** Right under the tool: how to measure, in three steps. */
  start: (h: Helpers) => `
<h2>Refrigerator dimensions start with three measurements</h2>
<p>Measure the opening, not the old refrigerator. Width goes from wall to wall or cabinet to cabinet at the narrowest point, which is often a strip of trim or a cabinet door frame. Height goes from the floor to the underside of the cabinet above, measured at the front and at the back because floors slope. Depth goes from the wall to the front edge of the counter, then again to the front of the cabinet doors. The ${h.a('how-to-measure-for-a-refrigerator', 'measuring guide')} adds the doorways and hallways on the way in, which stop more deliveries than the kitchen itself.</p>
<p>Enter width and height above. The count changes as you type, and the table lists the largest certified models that fit, with their yearly energy use and what that costs at your state's price. Choose counter-depth if you want the doors to sit roughly flush with the counter: ${K.num(cdFull.length)} full-size models are marked counter-depth on the list.</p>
`,
  guide: (h: Helpers) => `
<h2>Refrigerator dimensions by width</h2>
<p>Kitchens are built around a handful of widths, and refrigerators follow them. The table counts certified full-size models in each width class: a model counts as "30 inch" when its width is above 29 and up to 30.5 inches. Height and capacity are the medians of the class, every height together; energy is the median yearly kWh measured in the Department of Energy test. The tool above keeps only the models under your height, so its typical figures differ: for 30 inch models no taller than 67 inches, the typical one costs ${K.usd(tEx.cost)} a year, against ${K.usd(K.typFridge(w(30)).cost)} for the whole class.</p>
${h.table(['Width class', 'Models, every height', 'Typical height', 'Typical capacity', 'Typical kWh a year', 'Cost a year, U.S. average'], W.map((x) => { const t = K.typFridge(x.list); return [`${x.n} inches`, K.num(t.n), K.inch(K.s(x.list.map((f) => f.h)).med), `${K.dec(t.vol)} cu ft`, K.num(t.kwh), K.usd(t.cost)]; }), `ENERGY STAR certified residential refrigerators, list of ${K.day(K.UPDATED)}; price: EIA, ${K.MONTH}.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Each width has its own page with the styles it holds and the tallest and shortest models: ${h.a('24-inch-refrigerator', '24 inch')}, ${h.a('28-inch-wide-refrigerator', '28 inch')}, ${h.a('30-inch-wide-refrigerator', '30 inch')}, ${h.a('33-inch-wide-refrigerator', '33 inch')} and ${h.a('36-inch-refrigerator', '36 inch')}. Below 24 inches the list is mostly compact refrigerators, on the ${h.a('mini-fridge-dimensions', 'mini fridge page')}; narrow full-size models for small kitchens are on the ${h.a('apartment-size-refrigerator', 'apartment size page')}.</p>
<h2>What style does to energy use</h2>
<p>Two refrigerators of the same width can differ by hundreds of kWh a year because of the freezer. The median certified top-freezer model uses ${K.num(top.med)} kWh a year, the median bottom-freezer ${K.num(bottom.med)}, the median side-by-side ${K.num(side.med)}, and a refrigerator with no freezer at all ${K.num(single.med)}. Through-the-door ice and water and automatic ice makers add to it, which is one reason side-by-side models sit at the top. At ${K.num(K.US.now, 2)} cents per kWh the gap between the median top-freezer and the median side-by-side is ${K.usd(K.cost(side.med - top.med))} a year.</p>
${h.mini('fridgeCost', { t: 'What a refrigerator of your style and size costs to run', p: ['style', 'band', 'st'] })}
<p>The ${h.a('refrigerator-electricity-use', 'refrigerator electricity page')} turns kWh into watts, explains the yellow EnergyGuide label and compares a certified model with the federal maximum for its class.</p>
`,
  folds: [
    { title: 'Why the model list changes the answer', id: 'data', html: (h: Helpers) => `
<p>${VALUE}</p>
<p>The difference shows in the numbers. A page that says a refrigerator "uses about 150 watts" cannot tell you that the certified models of your size range from a few hundred to almost a thousand kWh a year, or that only a handful of them fit an opening one inch narrower than the usual one. The list can. It also moves: models enter and leave as makers certify them, and the version used here is dated ${K.day(K.UPDATED)}, read on ${K.day(K.RETRIEVED)}.</p>
<p>The ENERGY STAR data comes from the EPA's open data portal (${h.src('es_fridge', 'certified residential refrigerators')}), in the public domain under the ${h.src('epa_license', 'EPA data license')}. Prices come from ${h.src('eia_56a', 'table 5.6.A of the Electric Power Monthly')}, the average price paid by homes in each state in ${K.MONTH} and in ${K.PREV}. The ${h.a('method', 'method page')} lists every filter and every simplification.</p>
` },
    { title: 'Electricity prices: the same refrigerator in two states', id: 'states', html: (h: Helpers) => `
<p>The price of a kWh varies more between states than the energy use varies between most models. In ${K.MONTH} homes paid ${K.num(HI.now, 2)} cents per kWh in ${HI.name} and ${K.num(LO.now, 2)} cents in ${LO.name}. California paid ${K.num(CA.now, 2)} cents and Texas ${K.num(TX.now, 2)} cents. The median full-size refrigerator, at ${K.num(fridgeMed)} kWh a year, therefore costs ${K.usd(K.cost(fridgeMed, CA))} a year in California and ${K.usd(K.cost(fridgeMed, TX))} in Texas.</p>
<p>The ${h.a('electricity-cost-by-state', 'state comparison')} prices a full set of certified appliances in every state and shows how much the price moved since ${K.PREV}. Every tool on the site has a state selector set to the U.S. average until you change it.</p>
` },
    { title: 'Washers, dryers and dishwashers', id: 'laundry', html: (h: Helpers) => `
<p>The same lists cover laundry and kitchen appliances. Clothes washers are on the list with ${K.num(E.WASHERS.length)} certified models, but most publish only their width; ${K.num(E.WASHERS.filter(E.hasDims).length)} give all three dimensions. Dryers do better: ${K.num(E.DRYERS.length)} certified models with height, width and depth. The ${h.a('washer-and-dryer-dimensions', 'washer and dryer page')} counts the models that fit a laundry space, and the ${h.a('stackable-washer-and-dryer-dimensions', 'stackable page')} matches washers with the dryer ENERGY STAR lists as their pair.</p>
<p>Dishwashers publish width and depth but no height. The list holds ${K.num(dish24.length)} models in the 24 inch class and ${K.num(dish18.length)} in the 18 inch class: see the ${h.a('24-inch-dishwasher', '24 inch dishwasher')} and ${h.a('18-inch-dishwasher', '18 inch dishwasher')} pages.</p>
` },
    { title: 'Limits of the data', id: 'limits', html: (_h: Helpers) => `
<ul>
<li>Only certified models are counted. They use less energy than the federal maximum for their class, so the medians here are lower than the average of all refrigerators in American homes.</li>
<li>The yearly kWh comes from a laboratory test with closed doors and set temperatures. A warm garage, a full freezer or frequent door openings change the real figure.</li>
<li>The refrigerator list has no depth, the dishwasher list no height, the freezer list no dimensions, and most washer rows give the width only. The site says so on each page and never fills a gap with a guess.</li>
<li>The price is the state's average for homes in one month: what homes paid divided by the kWh they bought. Your own rate plan may differ.</li>
</ul>
` },
  ],
  sources: ['es_fridge', 'es_washer', 'es_dryer', 'es_dish', 'eia_56a', 'epa_license', 'cfr_430', 'es_finder'],
};
