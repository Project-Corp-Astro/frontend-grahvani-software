"use client";

import { useEffect } from "react";

export default function ClientsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Clients error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-5xl">&#128100;</div>
        <h2 className="text-xl font-serif text-amber-900">
          Client Data Error
        </h2>
        <p className="text-amber-800/70 text-sm">
          Unable to load client information. Please check your connection and
          try again.
        </p>
        <button
          onClick={reset}
          className="px-5 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors text-sm font-medium"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
