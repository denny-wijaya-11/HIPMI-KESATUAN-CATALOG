import PublicHeader from "@/components/public/PublicHeader";
import ProductSkeleton from "@/components/public/ProductSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-800 font-sans">
      <PublicHeader user={null} />
      <main className="relative z-10">
        <section className="py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
              <div>
                <div className="h-8 md:h-10 bg-gray-200 rounded w-48 mb-3 animate-pulse"></div>
                <div className="h-4 md:h-5 bg-gray-200 rounded w-full max-w-xl animate-pulse"></div>
              </div>
            </div>
            
            {/* Filter Skeleton */}
            <div className="flex gap-2 mb-6 animate-pulse overflow-hidden">
              <div className="h-10 bg-gray-200 rounded-full w-24 shrink-0"></div>
              <div className="h-10 bg-gray-200 rounded-full w-24 shrink-0"></div>
              <div className="h-10 bg-gray-200 rounded-full w-24 shrink-0"></div>
            </div>

            <div className="grid gap-3 md:gap-6 grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}