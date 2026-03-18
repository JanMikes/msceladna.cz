'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import type { NavigationItem } from '@/lib/types';

interface HeaderProps {
  navigation: NavigationItem[];
}

export default function Header({ navigation }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
  }, [isMobileMenuOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!openDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openDropdown]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-lg">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <span className="text-xl lg:text-2xl font-bold text-white">
                MS Celadna
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav ref={dropdownRef} className="hidden lg:flex items-center gap-1">
              {navigation.map((item, index) => {
                const hasChildren = item.children.length > 0;
                const isActive = !item.external && (pathname === item.href || pathname.startsWith(item.href + '/'));
                const isDropdownOpen = openDropdown === item.title;

                if (hasChildren) {
                  return (
                    <div key={`${index}-${item.href}`} className="relative">
                      <button
                        onClick={() => setOpenDropdown(isDropdownOpen ? null : item.title)}
                        className={clsx(
                          'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-[var(--radius-button)] transition-colors',
                          isActive
                            ? 'text-accent'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        )}
                      >
                        {item.title}
                        <ChevronDown className={clsx('w-3.5 h-3.5 transition-transform', isDropdownOpen && 'rotate-180')} />
                      </button>

                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 top-full mt-1 min-w-[12rem] bg-white rounded-[var(--radius-card)] shadow-lg border border-border py-2 z-50"
                          >
                            <Link
                              href={item.href}
                              onClick={closeMenus}
                              className={clsx(
                                'block px-4 py-2 text-sm transition-colors',
                                pathname === item.href
                                  ? 'text-primary font-semibold bg-surface'
                                  : 'text-text hover:text-primary hover:bg-surface'
                              )}
                            >
                              {item.title}
                            </Link>
                            {item.children.map((child, ci) => (
                              <Link
                                key={ci}
                                href={child.href}
                                onClick={closeMenus}
                                {...(child.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                className={clsx(
                                  'block px-4 py-2 text-sm transition-colors',
                                  !child.external && pathname === child.href
                                    ? 'text-primary font-semibold bg-surface'
                                    : 'text-text hover:text-primary hover:bg-surface'
                                )}
                              >
                                {child.title}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                const linkProps = item.external
                  ? { target: '_blank' as const, rel: 'noopener noreferrer' }
                  : {};

                return (
                  <Link
                    key={`${index}-${item.href}`}
                    href={item.href}
                    {...linkProps}
                    className={clsx(
                      'px-4 py-2 text-sm font-medium rounded-[var(--radius-button)] transition-colors',
                      isActive
                        ? 'text-accent'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-[var(--radius-button)] border border-white/30 flex items-center justify-center transition-colors text-white hover:bg-white/10"
              aria-label="Otevrit menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/95 backdrop-blur-lg"
              onClick={closeMenus}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-primary p-6 overflow-y-auto"
            >
              <div className="flex justify-end mb-8">
                <button
                  onClick={closeMenus}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  aria-label="Zavrit menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-1">
                {navigation.map((item, index) => (
                  <div key={`${index}-${item.href}`}>
                    <Link
                      href={item.href}
                      onClick={closeMenus}
                      {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="block py-3 text-xl font-semibold text-white hover:text-accent transition-colors"
                    >
                      {item.title}
                    </Link>
                    {item.children.length > 0 && (
                      <div className="pl-4 space-y-1 mb-2">
                        {item.children.map((child, ci) => (
                          <Link
                            key={ci}
                            href={child.href}
                            onClick={closeMenus}
                            {...(child.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            className="block py-2 text-base text-white/70 hover:text-accent transition-colors"
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
