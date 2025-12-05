import Link from 'next/link';

export const metadata = {
  title: '404 — ok.css',
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24 flex flex-col items-center text-center">
      <p className="font-mono text-[11px] tracking-widest uppercase mb-4" style={{ color: 'var(--text-3)' }}>
        404
      </p>
      <h1 className="font-mono text-2xl font-medium tracking-tight mb-3" style={{ color: 'var(--text-1)' }}>
        Page not found.
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-3)', maxWidth: '360px' }}>
        The URL you visited doesn&apos;t exist. It may have been moved or deleted.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs px-4 py-2 rounded-lg transition-colors"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
      >
        ← Back to all tools
      </Link>
    </div>
  );
}
