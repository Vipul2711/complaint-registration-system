function StatsSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-3 w-32 bg-gray-200 rounded"></div>
        <div className="h-3 w-10 bg-gray-200 rounded"></div>
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2">
          <div className="h-3 w-28 bg-gray-200 rounded"></div>
          <div className="h-3 w-12 bg-gray-200 rounded"></div>
        </div>
      ))}
      <div className="pt-1">
        <div className="flex justify-between mb-1.5">
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
          <div className="h-3 w-8 bg-gray-200 rounded"></div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className="bg-gray-200 h-2 rounded-full w-3/4"></div>
        </div>
      </div>
    </div>
  );
}

export default StatsSkeleton;
