import { getPageMenuSetId, getNavigation } from '@/lib/strapi/data';
import NavigationOverride from './NavigationOverride';

/**
 * Server component that looks up a menu_set for a given page slug
 * and overrides the navigation context if one is found.
 * Use in non-CMS routes (aktuality, projekty, etc.) to allow
 * editors to control which menu is shown.
 */
export default async function MenuSetOverride({ pageSlug }: { pageSlug: string }) {
  const menuSetId = await getPageMenuSetId(pageSlug);
  if (!menuSetId) return null;

  const navigation = await getNavigation(menuSetId);
  return <NavigationOverride navigation={navigation} />;
}
