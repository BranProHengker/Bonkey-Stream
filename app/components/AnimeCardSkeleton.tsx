export default function AnimeCardSkeleton() {
  return (
    <div className="group relative flex flex-col bg-slate-900/50 rounded-xl overflow-hidden border border-slate-800/50 animate-pulse">
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-800" />
      <div className="p-4 flex-1 flex flex-col">
        <div className="h-4 bg-slate-800 rounded mb-2 w-3/4" />
        <div className="h-3 bg-slate-800 rounded mb-2 w-1/2" />
        <div className="mt-auto space-y-2">
          <div className="flex gap-1.5">
            <div className="h-4 bg-slate-800 rounded w-16" />
            <div className="h-4 bg-slate-800 rounded w-16" />
          </div>
          <div className="h-3 bg-slate-800 rounded w-24" />
        </div>
      </div>
    </div>
  )
}
