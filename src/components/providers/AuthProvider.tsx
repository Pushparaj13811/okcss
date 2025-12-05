'use client';

/*
 * AuthProvider
 *
 * Wraps the application with NextAuth's SessionProvider so client components
 * can call useSession() to access the current auth state.
 *
 * Must be a client component because SessionProvider uses React context
 * under the hood. Place it high in the component tree (layout.tsx) so all
 * child components can access session state.
 */

import { SessionProvider } from 'next-auth/react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
