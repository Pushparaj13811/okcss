import type { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardClient } from '@/src/components/dashboard/DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard — okcss',
  description: 'All your saved CSS presets in one place.',
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/api/auth/signin');

  return <DashboardClient />;
}
