'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 mb-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
        <p className="text-muted-foreground mb-6">
          We encountered an error while loading this page. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-gradient-to-r from-nexus-500 to-nexus-600
                     hover:from-nexus-600 hover:to-nexus-700 text-white font-medium rounded-xl
                     transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
