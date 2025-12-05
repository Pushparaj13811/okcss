'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Separator } from '@/src/components/ui/Separator';
import {
  GithubIcon,
  LinkedinIcon,
  XIcon,
  InstagramIcon,
} from '@/src/components/icons';

// ─── Social link data ─────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/pushparaj13811',
    icon: GithubIcon,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/pushparaj1381-',
    icon: LinkedinIcon,
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/Pushparaj1381_',
    icon: XIcon,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/Pushparaj1381',
    icon: InstagramIcon,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function Footer() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.footer
      className="w-full"
      style={{ borderTop: '1px solid var(--border-subtle)' }}
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.5,
        delay: prefersReducedMotion ? 0 : 0.25,
        ease: 'easeOut',
      }}
    >
      <div className="mx-auto max-w-5xl px-6 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* Left — branding */}
        <p
          className="font-mono text-xs tracking-tight"
          style={{ color: 'var(--text-3)' }}
        >
          <span style={{ color: 'var(--text-2)' }}>ok.css</span>
          <Separator />
          A visual CSS generator
          <Separator />
          v0.1
        </p>

        {/* Right — developer + socials */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Built by */}
          <span className="font-mono text-[11px]" style={{ color: 'var(--text-3)' }}>
            Built by{' '}
            <a
              href="https://hpm.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors duration-100 hover:underline underline-offset-2"
              style={{ color: 'var(--text-2)' }}
            >
              Hompushparaj Mehta
            </a>
          </span>

          {/* Divider */}
          <span aria-hidden="true" style={{ color: 'var(--border)', fontSize: '10px' }}>|</span>

          {/* Social icons */}
          <div className="flex items-center gap-1">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="flex items-center justify-center w-7 h-7 rounded-md transition-colors duration-100"
                style={{ color: 'var(--text-3)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-3)';
                }}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
