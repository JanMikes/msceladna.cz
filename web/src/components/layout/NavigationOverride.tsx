'use client';

import { useEffect } from 'react';
import type { NavigationItem } from '@/lib/types';
import { useNavigation } from './NavigationContext';

export default function NavigationOverride({ navigation }: { navigation: NavigationItem[] }) {
  const { setNavigation, resetToDefault } = useNavigation();

  useEffect(() => {
    setNavigation(navigation);
    // When this page unmounts (client navigation to a page that does not
    // override the menu), restore the default set so a stale override does not
    // persist. React runs all cleanups before setups within a commit, so
    // navigating between two override pages still lands on the new override.
    return () => resetToDefault();
  }, [navigation, setNavigation, resetToDefault]);

  return null;
}
