'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-24 flex flex-col items-center text-center">
      <p className="font-mono text-[11px] tracking-widest uppercase mb-4" style={{ color: 'var(--text-3)' }}>
        Error
      </p>
      <h1 className="font-mono text-2xl font-medium tracking-tight mb-3" style={{ color: 'var(--text-1)' }}>
        Something went wrong.
      </h1>
      <p className="text-sm mb-8 font-mono" style={{ color: 'var(--text-3)', maxWidth: '400px' }}>
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-1.5 font-mono text-xs px-4 py-2 rounded-lg transition-colors"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-1)', cursor: 'pointer' }}
      >
        Try again
      </button>
    </div>
  );
}
