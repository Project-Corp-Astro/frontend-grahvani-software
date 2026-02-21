"use client";

interface ApiErrorFallbackProps {
  error: Error | null;
  onRetry?: () => void;
  title?: string;
  message?: string;
}

export function ApiErrorFallback({
  error,
  onRetry,
  title = "Failed to load data",
  message,
}: ApiErrorFallbackProps) {
  const displayMessage =
    message ||
    error?.message ||
    "An unexpected error occurred. Please try again.";

  return (
    <div className="flex items-center justify-center p-8">
      <div className="max-w-sm w-full text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
          <span className="text-red-600 text-xl">!</span>
        </div>
        <h3 className="text-lg font-serif text-amber-900">{title}</h3>
        <p className="text-sm text-amber-800/70">{displayMessage}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors text-sm font-medium"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
