export default function BookCardSkeleton() {
  return (
    <div className="bg-[#FAF5EC] rounded-[1px] border border-[#D4C4A8]/65 p-2 flex flex-col animate-pulse">
      <div className="aspect-[3/4] bg-[#D4C4A8]/40 border border-[#D4C4A8]/30" />
      <div className="p-3 pt-4 flex flex-col gap-2 flex-1">
        <div className="h-4 bg-[#D4C4A8]/50 rounded-[1px] w-full" />
        <div className="h-3 bg-[#D4C4A8]/35 rounded-[1px] w-2/3" />
        <div className="mt-auto pt-3 border-t border-[#D4C4A8]/30 flex justify-between items-center">
          <div className="h-4 bg-[#D4C4A8]/45 rounded-[1px] w-20" />
          <div className="h-8 bg-[#D4C4A8]/40 rounded-[1px] w-16" />
        </div>
      </div>
    </div>
  );
}

export function BookCardSkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
      {Array.from({ length: count }, (_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}
