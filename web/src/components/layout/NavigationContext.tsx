'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { NavigationItem } from '@/lib/types';

interface NavigationContextValue {
  navigation: NavigationItem[];
  setNavigation: (items: NavigationItem[]) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
}

export function NavigationProvider({
  defaultNavigation,
  children,
}: {
  defaultNavigation: NavigationItem[];
  children: React.ReactNode;
}) {
  const [navigation, setNavigationState] = useState(defaultNavigation);

  const setNavigation = useCallback((items: NavigationItem[]) => {
    setNavigationState(items);
  }, []);

  return (
    <NavigationContext.Provider value={{ navigation, setNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
}
