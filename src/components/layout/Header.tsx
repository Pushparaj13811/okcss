'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { SunIcon, MoonIcon, ExternalLinkIcon } from '@/src/components/icons';
import { useTheme } from '@/src/components/providers/ThemeProvider';
import { TOOLS } from '@/src/lib/tools';
import { AuthButton } from './AuthButton';
import { useSession } from 'next-auth/react';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const { data: session } = useSession();
  const prefersReducedMotion = useReducedMotion();

  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 40], [0, 1]);

  const mountTransition = {
    duration: prefersReducedMotion ? 0 : 0.45,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
  };

  const iconTransition = {
    duration: prefersReducedMotion ? 0 : 0.18,
    ease: 'easeInOut' as const,
  };

  // If we're on a tool page, show its name as a breadcrumb
  const activeTool = TOOLS.find((t) => t.href === pathname);

  return (
    <motion.header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'var(--bg-overlay)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
      initial={{ y: prefersReducedMotion ? 0 : -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={mountTransition}
    >
      <div className="mx-auto max-w-5xl px-6 h-14 flex items-center gap-4">

        {/* ── Logo ── */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: prefersReducedMotion ? 0 : 0.08 }}
        >
          <Link
            href="/"
            className="flex items-baseline gap-0 font-mono text-[15px] tracking-tight select-none"
            style={{ color: 'var(--text-1)' }}
          >
            <span className="font-medium">ok</span>
            <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>.css</span>
          </Link>
        </motion.div>

        {/* ── Breadcrumb: current tool name (only on tool pages) ── */}
        <AnimatePresence mode="wait">
          {activeTool && (
            <motion.div
              key={activeTool.href}
              className="flex items-center gap-2 min-w-0"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            >
              <span style={{ color: 'var(--border)', fontSize: '14px', lineHeight: 1 }} aria-hidden="true">/</span>
              <span
                className="font-mono text-xs truncate"
                style={{ color: 'var(--text-2)' }}
              >
                {activeTool.label}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Portfolio link ── */}
        <motion.a
          href="https://hpm.com.np"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1 font-mono text-[11px] flex-shrink-0"
          style={{ color: 'var(--text-3)', textDecoration: 'none' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: prefersReducedMotion ? 0 : 0.1 }}
          whileHover={{ color: 'var(--text-1)' } as never}
          title="Hompushparaj Mehta — Portfolio"
        >
          hpm.com.np
          <ExternalLinkIcon size={9} />
        </motion.a>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Nav links ── */}
        <motion.nav
          className="flex items-center gap-1 flex-shrink-0"
          aria-label="Site navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: prefersReducedMotion ? 0 : 0.14 }}
        >
          {[
            { href: '/combine', label: 'Combine' },
            { href: '/explore', label: 'Explore' },
            ...(session ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
          ].map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center px-3 h-8 font-mono text-xs rounded-md transition-colors duration-100"
                style={{ color: isActive ? 'var(--text-1)' : 'var(--text-3)' }}
                aria-current={isActive ? 'page' : undefined}
              >
                {label}
              </Link>
            );
          })}
        </motion.nav>

        {/* ── Auth button ── */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: prefersReducedMotion ? 0 : 0.2 }}
        >
          <AuthButton />
        </motion.div>

        {/* ── Theme toggle ── */}
        <motion.button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="relative flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer flex-shrink-0"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-2)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: prefersReducedMotion ? 0 : 0.24 }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.06 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.88 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              className="flex items-center justify-center"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, rotate: -20, scale: 0.7 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, rotate: 20, scale: 0.7 }}
              transition={iconTransition}
            >
              {theme === 'dark' ? <SunIcon size={15} /> : <MoonIcon size={15} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Scroll-driven border */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-px"
        style={{ opacity: borderOpacity, background: 'var(--border)' }}
      />
    </motion.header>
  );
}
