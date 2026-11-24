import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 text-center">
    <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold-light">404 · Not Found</p>
    <h1 className="mt-3 font-display text-4xl font-bold text-ivory sm:text-5xl">Page does not exist</h1>
    <p className="mt-3 max-w-md text-sm text-slateMuted">
      The page you are looking for may have been moved or removed.
    </p>
    <Link
      to="/"
      className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-obsidian"
    >
      <ArrowLeft className="h-4 w-4" />
      Return Home
    </Link>
  </div>
);
