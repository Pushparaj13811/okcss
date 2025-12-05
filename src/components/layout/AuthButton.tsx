'use client';

/*
 * AuthButton
 *
 * A compact sign-in/out button for the header, powered by NextAuth.
 *
 * States:
 * - Loading: invisible (no layout shift — same size as signed-in state)
 * - Signed out: "Sign in" text button with GitHub icon
 * - Signed in: avatar circle + username, click opens a mini popover with sign-out
 *
 * Uses signIn/signOut from next-auth/react for client-side auth actions.
 */

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// GitHub mark icon (inline)
function GitHubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

// Simple avatar fallback (first letter of name)
function AvatarFallback({ name }: { name: string }) {
  return (
    <div
      className="flex items-center justify-center w-6 h-6 rounded-full font-mono text-[10px] font-medium"
      style={{ background: 'var(--border)', color: 'var(--text-2)' }}
      aria-hidden="true"
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export function AuthButton() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Render nothing while loading to avoid layout shift
  if (status === 'loading') {
    return (
      <div
        className="w-8 h-8 rounded-lg flex-shrink-0"
        style={{ background: 'var(--border-subtle)' }}
        aria-hidden="true"
      />
    );
  }

  // Signed out
  if (!session) {
    return (
      <button
        onClick={() => signIn('github')}
        className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg font-mono text-xs cursor-pointer flex-shrink-0"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          color: 'var(--text-2)',
        }}
        aria-label="Sign in with GitHub"
      >
        <GitHubIcon size={13} />
        Sign in
      </button>
    );
  }

  // Signed in
  const user = session.user;
  const name = user?.name ?? 'User';
  const avatarUrl = user?.image;

  return (
    <div ref={wrapperRef} className="relative flex-shrink-0">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 px-2 h-8 rounded-lg cursor-pointer"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          color: 'var(--text-2)',
        }}
        aria-label="Account menu"
        aria-expanded={isOpen}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={name}
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <AvatarFallback name={name} />
        )}
        <span className="font-mono text-xs max-w-[80px] truncate hidden sm:block">
          {name}
        </span>
      </button>

      {/* Sign-out popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className="absolute right-0 mt-1.5 w-40 rounded-xl overflow-hidden z-50"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              top: '100%',
            }}
          >
            <div className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <p className="font-mono text-[10px] truncate" style={{ color: 'var(--text-3)' }}>
                {user?.email ?? name}
              </p>
            </div>
            <button
              onClick={() => { setIsOpen(false); signOut(); }}
              className="w-full text-left px-3 py-2 font-mono text-xs cursor-pointer transition-colors duration-100"
              style={{ color: 'var(--text-2)', background: 'none', border: 'none' }}
            >
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
