// src/app/loading.jsx
export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-6">
      
      {/* Search skeleton */}
      <div className="bg-secondary border rounded-xl p-4 mb-6 animate-pulse">
        <div className="flex gap-2 mb-3">
          <div className="flex-1 h-10 bg-border rounded-lg" />
          <div className="w-32 h-10 bg-border rounded-lg" />
          <div className="w-28 h-10 bg-border rounded-lg" />
        </div>
        <div className="flex gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-7 w-20 bg-border rounded-full" />
          ))}
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="h-5 w-40 bg-border rounded mb-3 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="border rounded-xl overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-secondary" />
            <div className="p-3 space-y-2">
              <div className="h-3 w-16 bg-border rounded-full" />
              <div className="h-4 w-full bg-border rounded" />
              <div className="h-4 w-24 bg-border rounded" />
              <div className="flex justify-between">
                <div className="h-3 w-16 bg-border rounded" />
                <div className="h-3 w-8 bg-border rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}