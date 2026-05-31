'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { NavigationItem } from '@/lib/types';

interface NavigationContextValue {
  navigation: NavigationItem[];
  setNavigation: (items: NavigationItem[]) => void;
  resetToDefault: () => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
}

export function NavigationProvider({
  defaultNavigation,
  initialNavigation,
  children,
}: {
  /** The default menu set — restored when no page overrides the navbar. */
  defaultNavigation: NavigationItem[];
  /** The set resolved for the first-rendered route, to avoid a hydration flash. */
  initialNavigation?: NavigationItem[];
  children: React.ReactNode;
}) {
  const [navigation, setNavigationState] = useState(initialNavigation ?? defaultNavigation);

  const setNavigation = useCallback((items: NavigationItem[]) => {
    setNavigationState(items);
  }, []);

  // The provider lives in the root layout, so `defaultNavigation` is stable for
  // the whole client session (it only changes on a full reload, which remounts
  // everything). That keeps `resetToDefault` identity-stable for effect deps.
  const resetToDefault = useCallback(() => {
    setNavigationState(defaultNavigation);
  }, [defaultNavigation]);

  return (
    <NavigationContext.Provider value={{ navigation, setNavigation, resetToDefault }}>
      {children}
    </NavigationContext.Provider>
  );
}
