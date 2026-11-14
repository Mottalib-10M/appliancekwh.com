/** Where the button of a mini-simulator leads: the page itself when it carries the full calculator of that kind
 *  (naive testers 2026-11-14: the height mini of the 28 inch page sent readers to the counter-depth page), otherwise
 *  the first page carrying it. */
import { ROUTES, route } from '../i18n/routes';
import { PAGES, pageOfTool } from './pages';
export const miniHref = (kind: string, fallback: string) => {
  if (PAGES.some((p) => p.tool === kind && ROUTES.some((r) => r.id === p.id) && route(p.id, 'en') === fallback)) return fallback;
  const id = pageOfTool(kind);
  return id && ROUTES.some((r) => r.id === id) ? route(id, 'en') : fallback;
};
