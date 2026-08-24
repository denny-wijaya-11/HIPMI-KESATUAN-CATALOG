import PublicHeader from "@/components/public/PublicHeader";
import ProductSkeleton from "@/components/public/ProductSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-800 font-sans">
      <PublicHeader user={null} />
      <main className="relative z-10">
        {/* Hero Section Skeleton */}
        <section className="relative pt-12 pb-16 md:pt-20 md:pb-28 overflow-hidden animate-pulse">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="flex-1 text-center md:text-left w-full">
                <div className="h-10 sm:h-12 md:h-14 lg:h-16 bg-gray-200 rounded-lg w-3/4 mx-auto md:mx-0 mb-4"></div>
                <div className="h-10 sm:h-12 md:h-14 lg:h-16 bg-gray-200 rounded-lg w-1/2 mx-auto md:mx-0 mb-6"></div>
                <div className="h-4 md:h-5 bg-gray-200 rounded w-full max-w-lg mx-auto md:mx-0 mb-3"></div>
                <div className="h-4 md:h-5 bg-gray-200 rounded w-4/5 max-w-lg mx-auto md:mx-0 mb-8"></div>
                
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3">
                  <div className="h-12 bg-gray-200 rounded-xl w-40"></div>
                  <div className="h-12 bg-gray-200 rounded-xl w-48"></div>
                </div>
              </div>
              
              <div className="flex-1 w-full flex justify-center items-center mt-10 md:mt-0">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Skeleton */}
        <section className="py-16 md:py-24 relative border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-4 animate-pulse">
              <div>
                <div className="h-8 md:h-10 bg-gray-200 rounded w-48 mb-3"></div>
                <div className="h-4 md:h-5 bg-gray-200 rounded w-64"></div>
              </div>
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