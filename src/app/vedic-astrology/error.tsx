"use client";

import { useEffect } from "react";

export default function VedicAstrologyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Vedic astrology error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-5xl">&#9788;</div>
        <h2 className="text-xl font-serif text-amber-900">
          Chart Calculation Error
        </h2>
        <p className="text-amber-800/70 text-sm">
          Unable to load astrology data. This may be a temporary issue with the
          calculation engine.
        </p>
        <button
          onClick={reset}
          className="px-5 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors text-sm font-medium"
        >
          Retry Calculation
        </button>
      </div>
    </div>
  );
}
