'use client';

import { useEffect } from 'react';
import type { NavigationItem } from '@/lib/types';
import { useNavigation } from './NavigationContext';

export default function NavigationOverride({ navigation }: { navigation: NavigationItem[] }) {
  const { setNavigation } = useNavigation();

  useEffect(() => {
    setNavigation(navigation);
  }, [navigation, setNavigation]);

  return null;
}
