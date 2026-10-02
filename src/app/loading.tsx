export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
      <div className="relative flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-emerald-100 border-t-emerald-800 animate-spin" />
      </div>
      <p className="mt-4 text-xs font-semibold text-slate-500 animate-pulse">
        Loading Royal V Properties...
      </p>
    </div>
  );
}
