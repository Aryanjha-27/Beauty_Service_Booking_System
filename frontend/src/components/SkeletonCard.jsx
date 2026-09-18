function SkeletonCard() {
  return (
    <div className="gn-card overflow-hidden">
      <div className="gn-skeleton aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="gn-skeleton h-3 w-24" />
        <div className="gn-skeleton h-5 w-3/4" />
        <div className="gn-skeleton h-3 w-1/2" />
        <div className="gn-skeleton h-9 w-full" />
      </div>
    </div>
  );
}
function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
function SkeletonRows({ count = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="gn-card gn-skeleton h-20 w-full" />
      ))}
    </div>
  );
}
function SkeletonStats({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="gn-skeleton h-24 w-full" />
      ))}
    </div>
  );
}
export { SkeletonCard, SkeletonGrid, SkeletonRows, SkeletonStats };
