import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6e3] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">&#9790;</div>
        <h1 className="text-2xl font-serif text-amber-900">Page Not Found</h1>
        <p className="text-amber-800/70">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-2.5 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors font-medium"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
