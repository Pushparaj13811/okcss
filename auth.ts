/*
 * NextAuth v5 configuration.
 *
 * Environment variables required (set in .env.local):
 *   AUTH_SECRET          — any random string (generate with: openssl rand -base64 32)
 *   AUTH_GITHUB_ID       — GitHub OAuth App Client ID
 *   AUTH_GITHUB_SECRET   — GitHub OAuth App Client Secret
 *
 * GitHub OAuth App setup:
 *   1. Go to github.com/settings/applications/new
 *   2. Application name: ok.css (or similar)
 *   3. Homepage URL: http://localhost:3000 (update for production)
 *   4. Authorization callback URL: http://localhost:3000/api/auth/callback/github
 */

import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  pages: {
    // Use the default NextAuth sign-in page
    signIn: '/api/auth/signin',
  },
  callbacks: {
    // Include the user's GitHub username in the session for display
    session({ session, token }) {
      if (token.login && session.user) {
        (session.user as typeof session.user & { login: string }).login = token.login as string;
      }
      return session;
    },
    jwt({ token, profile }) {
      if (profile) {
        token.login = (profile as { login?: string }).login;
      }
      return token;
    },
  },
});
