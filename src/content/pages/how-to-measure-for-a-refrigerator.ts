import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.E;
const at = (w: number, hh: number) => E.fridges({ style: 'full', maxW: w, maxH: hh }).length;
const base = at(30, 67), minusW = at(29.5, 67), minusH = at(30, 66), plusH = at(30, 68);
const gap1 = at(29, 66);

export default definePage({
  id: 'how-to-measure-for-a-refrigerator', group: 'fridge', order: 110, slug: 'how-to-measure-for-a-refrigerator',
  nav: 'How to measure for a refrigerator', card: 'The measurements that decide a fit, the gaps to keep, and how one inch changes the number of models.',
  title: 'Measuring for a Refrigerator 2026: Fit Without Returns',
  description: `Measuring for a refrigerator in 2026: width, height, depth, door swing and the delivery path, and how one inch changes the count of certified models that fit.`,
  h1: 'Measuring for a refrigerator, and why one inch matters',
  intro: `Measuring for a refrigerator decides what fits: a 30 by 67 inch opening takes ${K.num(base)} certified full-size models; one inch less height leaves ${K.num(minusH)}. Measure carefully, then enter your figures and gap.`,
  resume: `To measure for a refrigerator, take three dimensions of the opening and three of the way in. In the kitchen: the width at the narrowest point, the height from the floor to the underside of the cabinet above, and the depth from the wall to the front edge of the counter. On the delivery path: the narrowest door, the tightest turn and any stair or elevator. Small errors cost a lot of choice. On the ENERGY STAR list of ${K.day(K.UPDATED)}, a 30 by 67 inch opening takes ${K.num(base)} full-size certified models. Half an inch less width leaves ${K.num(minusW)}. One inch less height leaves ${K.num(minusH)}, while one inch more allows ${K.num(plusH)}. The installation guide of each model asks for a gap at the sides, top and back for air and for the doors. With one inch taken off both width and height, the same opening takes ${K.num(gap1)} models. The tool above lets you enter that gap as an optional field. The list gives no refrigerator depth, so depth is a check you make on the model sheet.`,
  faqs: [
    { q: 'How much space do you need around a refrigerator?', a: 'The installation guide of each model gives it, and it varies by maker and by model. Many ask for a small gap at the sides and the top and more at the back for air and the water line. Enter the gap your chosen model needs in the tool: it takes it off the width and the height of the opening before counting.' },
    { q: 'Do you measure with or without the doors?', a: 'Both, for different checks. The opening is compared with the case and the doors closed. The delivery path is compared with the case without doors and handles, which is how installers usually pass a large refrigerator through a narrow doorway. The depth without doors is on the model sheet, not on the ENERGY STAR list.' },
    { q: 'What if my floor or cabinet is not level?', a: 'Measure the height at the front and at the back of the opening and use the smaller figure. Refrigerators have leveling feet that add or remove a fraction of an inch, and they are often set to tilt slightly back so the doors close on their own. Leave that margin before you shop.' },
  ],
  body: (h) => `
<h2>Measuring for a refrigerator, step by step</h2>
<p>Use a metal tape and write the figures to the eighth of an inch. A refrigerator listed at 29.75 inches fits a 30 inch opening; at 30.1 inches it does not.</p>
<p><strong>Width.</strong> Measure from wall to wall or cabinet side to cabinet side at three heights: near the floor, at counter height and near the top. Keep the smallest. Baseboards, trim and a counter that overhangs into the space are the usual culprits.</p>
<p><strong>Height.</strong> Measure from the floor to the underside of the cabinet or soffit above, at the front and at the back. If you are installing new flooring, measure from the new floor level.</p>
<p><strong>Depth.</strong> Measure from the wall behind the refrigerator to the front edge of the countertop, then to the front of the cabinet doors beside it. Note where the outlet and the water valve sit: a plug or a valve behind the refrigerator takes depth too.</p>
<p><strong>Door swing.</strong> If a side of the refrigerator is against a wall, the door must open past 90 degrees for the drawers to slide out. Measure from the opening to the wall, then compare with the clearance on the model sheet.</p>
<h2>The way in: doors, halls and stairs</h2>
<p>Most failed deliveries fail before the kitchen. Measure every door on the path, with the door open, from the stop to the frame; measure the width of halls and any turn; on stairs, measure the headroom. Compare with the depth of the refrigerator without doors and its height, because it travels upright on a dolly. Removing a door from its hinges usually gains an inch or two.</p>
${h.mini('fridgeFit', { t: 'Try your measurements with a gap', p: ['w', 'h', 'gap'], d: { w: 30, h: 67, gap: 1 } })}
<h2>How one inch changes the choice</h2>
<p>The table shows what an inch does on the certified list. Every line is a count of real full-size models that fit at most that width and height.</p>
${h.table(['Opening', 'Models that fit'], [[29, 66], [29.5, 67], [30, 66], [30, 67], [30, 68], [33, 68], [36, 70]].map(([w, hh]) => [`${K.dec(w)} × ${hh} inches`, K.num(at(w, hh))]), `Full-size certified refrigerators, ENERGY STAR list of ${K.day(K.UPDATED)}.`, ['l', 'r'])}
<p>Height is the most sensitive figure for 30 inch openings, because many models are built between 66 and 68 inches. If your cabinet above can be raised or removed, the gain is often larger than any change in width. When you have your numbers, the width pages list the models of each class: ${h.a('30-inch-wide-refrigerator', '30 inch')}, ${h.a('33-inch-wide-refrigerator', '33 inch')} and ${h.a('36-inch-refrigerator', '36 inch')}, and the ${h.a('counter-depth-refrigerator-dimensions', 'counter-depth page')} for a shallow fit.</p>
`,
  tool: 'fridgeFit', toolArg: { gap: 1 },
  related: ['30-inch-wide-refrigerator', 'counter-depth-refrigerator-dimensions', '36-inch-refrigerator', 'apartment-size-refrigerator'],
  sources: ['es_fridge'],
});
