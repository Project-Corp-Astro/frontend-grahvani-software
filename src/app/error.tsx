"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6e3] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">&#9788;</div>
        <h1 className="text-2xl font-serif text-amber-900">
          Something went wrong
        </h1>
        <p className="text-amber-800/70">
          An unexpected error occurred. Please try again or contact support if
          the issue persists.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
