export default function VedicAstrologyLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-3 border-amber-300 border-t-amber-700 rounded-full animate-spin mx-auto" />
        <p className="text-amber-800/70 text-sm font-medium">
          Loading astrology data...
        </p>
      </div>
    </div>
  );
}
