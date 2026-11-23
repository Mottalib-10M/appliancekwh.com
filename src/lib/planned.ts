/** Every page id the site is meant to have. Content tests accept links to these ids while pages are being
 *  written; the "all planned pages exist" test fails until each has its file. */
export const PLANNED_GUIDES = [
  'counter-depth-refrigerator-dimensions', '24-inch-refrigerator', '28-inch-wide-refrigerator',
  '30-inch-wide-refrigerator', '33-inch-wide-refrigerator', '36-inch-refrigerator', 'mini-fridge-dimensions',
  'apartment-size-refrigerator', 'refrigerator-electricity-use', 'how-to-measure-for-a-refrigerator',
  'washer-and-dryer-dimensions', 'stackable-washer-and-dryer-dimensions', 'front-load-washer-dimensions', 'top-load-washer-dimensions',
  'dryer-dimensions', 'washing-machine-electricity-use', 'dryer-electricity-use',
  'dishwasher-dimensions', '24-inch-dishwasher', '18-inch-dishwasher', 'dishwasher-electricity-use',
  'window-air-conditioner-electricity-use', 'dehumidifier-electricity-use', 'freezer-electricity-use', 'electricity-cost-by-state', 'appliance-electricity-cost-2027',
];
export const PLANNED_IDS = new Set<string>(PLANNED_GUIDES);
