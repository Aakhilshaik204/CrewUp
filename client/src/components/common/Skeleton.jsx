const Shimmer = ({ className = '' }) => (
  <div className={`bg-slate-100 rounded-xl animate-pulse ${className}`} />
);

export const ActivityCardSkeleton = () => (
  <div className="card p-0 overflow-hidden h-full">
    <Shimmer className="w-full h-36 rounded-none rounded-t-2xl" />
    <div className="p-4 space-y-3">
      <Shimmer className="w-3/4 h-4" />
      <Shimmer className="w-1/2 h-3" />
      <Shimmer className="w-full h-1.5" />
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <Shimmer className="w-6 h-6 rounded-full" />
        <Shimmer className="w-20 h-3" />
      </div>
    </div>
  </div>
);

export const FeedSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => <ActivityCardSkeleton key={i} />)}
  </div>
);

export const ActivityDetailSkeleton = () => (
  <div className="page-container max-w-5xl">
    <Shimmer className="w-24 h-4 mb-6" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-5">
        <div className="card overflow-hidden">
          <Shimmer className="w-full h-48 rounded-none" />
          <div className="p-6 space-y-3">
            <Shimmer className="w-2/3 h-6" />
            <Shimmer className="w-1/3 h-4" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[...Array(4)].map((_, i) => <Shimmer key={i} className="h-4" />)}
            </div>
          </div>
        </div>
        <div className="card p-5 space-y-4">
          <Shimmer className="w-40 h-5" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Shimmer className="w-10 h-10 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Shimmer className="w-32 h-4" />
                <Shimmer className="w-20 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="card p-5 space-y-3">
          <Shimmer className="w-16 h-3" />
          <div className="flex items-center gap-3">
            <Shimmer className="w-12 h-12 rounded-xl" />
            <div className="space-y-1.5"><Shimmer className="w-28 h-4" /><Shimmer className="w-16 h-3" /></div>
          </div>
        </div>
        <div className="card p-5 space-y-3">
          <Shimmer className="w-full h-10 rounded-xl" />
          <Shimmer className="w-full h-10 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="page-container max-w-4xl">
    <div className="card p-8 mb-6">
      <div className="flex gap-6">
        <Shimmer className="w-24 h-24 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Shimmer className="w-48 h-6" />
          <Shimmer className="w-64 h-4" />
          <div className="flex gap-2"><Shimmer className="w-24 h-6 rounded-full" /><Shimmer className="w-20 h-6 rounded-full" /></div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => <ActivityCardSkeleton key={i} />)}
    </div>
  </div>
);

export const NotificationSkeleton = ({ count = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card p-4 flex gap-3">
        <Shimmer className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Shimmer className="w-4/5 h-4" />
          <Shimmer className="w-1/4 h-3" />
        </div>
      </div>
    ))}
  </div>
);

export const AdminTableSkeleton = ({ rows = 6 }) => (
  <div className="card overflow-hidden">
    <div className="flex gap-4 px-4 py-3 border-b border-slate-100 bg-slate-50">
      {[...Array(5)].map((_, i) => <Shimmer key={i} className="h-3 flex-1" />)}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-slate-50">
        <div className="flex items-center gap-2 flex-1">
          <Shimmer className="w-8 h-8 rounded-full" />
          <div className="space-y-1.5"><Shimmer className="w-28 h-3.5" /><Shimmer className="w-36 h-3" /></div>
        </div>
        <Shimmer className="w-20 h-3 flex-1" />
        <Shimmer className="w-14 h-5 rounded-full" />
        <Shimmer className="w-12 h-3" />
        <Shimmer className="w-14 h-7 rounded-lg" />
      </div>
    ))}
  </div>
);
