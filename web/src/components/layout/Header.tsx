'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import type { NavigationItem } from '@/lib/types';

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5 .2-.5.5-1 .8-1.5C5.5 13 8.5 11 12 11c3 0 5.5 1.5 7 3.5.5.7.8 1.3 1 1.8.6-1.4 1-3 1-4.7 0-1.8-.5-3.5-1.3-5C17 9 14.5 10 12 10c-3 0-5.5-1.5-7-3.5C6 5 8.8 4 12 4c2.5 0 4.8.8 6.5 2"
        stroke="currentColor"
        strokeWidth="0"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M17.8 2.8C16 4.6 13.2 6 12 6c-2.5 0-5-2-5-2s1 5 5 7c0 0-4 1-7 5 0 0 2.5 2 6 2 4 0 7-3 8-6 .7-2.2.8-4.5 0-6.5L17.8 2.8z"
        fill="currentColor"
      />
      <path
        d="M12 13c0 4-2 7-2 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

interface HeaderProps {
  navigation: NavigationItem[];
}

export default function Header({ navigation }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/90 backdrop-blur-lg shadow-[var(--shadow-header-scrolled)]'
            : 'bg-white shadow-[var(--shadow-header)]'
        )}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[4.5rem]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <LeafIcon className="w-8 h-8 text-accent transition-transform duration-300 group-hover:rotate-12" />
              <div className="flex flex-col leading-tight">
                <span className="text-lg lg:text-xl font-extrabold text-primary tracking-tight">
                  MŠ Čeladná
                </span>
                <span className="text-[0.6rem] font-medium text-text-muted tracking-wider uppercase hidden sm:block">
                  Mateřská škola
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav ref={dropdownRef} className="hidden lg:flex items-center gap-0.5">
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
                          'flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-[var(--radius-button)] transition-all duration-200',
                          isActive
                            ? 'text-primary bg-teal-tint'
                            : 'text-text-muted hover:text-primary hover:bg-surface'
                        )}
                      >
                        {item.title}
                        <ChevronDown className={clsx('w-3.5 h-3.5 transition-transform duration-200', isDropdownOpen && 'rotate-180')} />
                      </button>

                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="absolute left-0 top-full mt-2 min-w-[13rem] bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card-hover)] border border-border/50 py-1.5 z-50"
                          >
                            <Link
                              href={item.href}
                              onClick={closeMenus}
                              className={clsx(
                                'block px-4 py-2.5 text-sm transition-colors rounded-lg mx-1.5',
                                pathname === item.href
                                  ? 'text-primary font-semibold bg-teal-tint'
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
                                  'block px-4 py-2.5 text-sm transition-colors rounded-lg mx-1.5',
                                  !child.external && pathname === child.href
                                    ? 'text-primary font-semibold bg-teal-tint'
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
                      'px-3.5 py-2 text-sm font-medium rounded-[var(--radius-button)] transition-all duration-200',
                      isActive
                        ? 'text-primary bg-teal-tint'
                        : 'text-text-muted hover:text-primary hover:bg-surface'
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
              className="lg:hidden w-10 h-10 rounded-[var(--radius-button)] border border-border flex items-center justify-center transition-colors text-primary hover:bg-surface"
              aria-label="Otevřít menu"
            >
              <Menu className="w-5 h-5" />
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
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={closeMenus}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2">
                  <LeafIcon className="w-7 h-7 text-accent" />
                  <span className="text-lg font-extrabold text-primary">MŠ Čeladná</span>
                </div>
                <button
                  onClick={closeMenus}
                  className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-text-muted hover:text-primary hover:bg-teal-tint transition-colors"
                  aria-label="Zavřít menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navigation.map((item, index) => (
                  <div key={`${index}-${item.href}`}>
                    <Link
                      href={item.href}
                      onClick={closeMenus}
                      {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className={clsx(
                        'block py-3 px-3 text-lg font-semibold rounded-[var(--radius-button)] transition-colors',
                        !item.external && (pathname === item.href || pathname.startsWith(item.href + '/'))
                          ? 'text-primary bg-teal-tint'
                          : 'text-text hover:text-primary hover:bg-surface'
                      )}
                    >
                      {item.title}
                    </Link>
                    {item.children.length > 0 && (
                      <div className="ml-4 pl-3 border-l-2 border-accent/30 space-y-0.5 mb-2">
                        {item.children.map((child, ci) => (
                          <Link
                            key={ci}
                            href={child.href}
                            onClick={closeMenus}
                            {...(child.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            className={clsx(
                              'block py-2 px-3 text-sm rounded-[var(--radius-button)] transition-colors',
                              !child.external && pathname === child.href
                                ? 'text-primary font-medium bg-teal-tint'
                                : 'text-text-muted hover:text-primary hover:bg-surface'
                            )}
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
