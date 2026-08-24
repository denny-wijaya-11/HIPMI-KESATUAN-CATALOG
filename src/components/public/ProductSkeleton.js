import { SimpleCard } from "@/components/public/Web3Components";

export default function ProductSkeleton() {
  return (
    <SimpleCard className="flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-32 sm:h-40 md:h-64 w-full bg-gray-200" />
      
      {/* Content Skeleton */}
      <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
        <div className="flex-1">
          {/* Owner/Region Skeleton */}
          <div className="flex items-center gap-2 mb-2">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
          
          {/* Title Skeleton */}
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
          
          {/* Description Skeleton */}
          <div className="h-2.5 sm:h-3 bg-gray-200 rounded w-full mb-1 hidden sm:block"></div>
          <div className="h-2.5 sm:h-3 bg-gray-200 rounded w-4/5 hidden sm:block"></div>
        </div>
        
        {/* Footer: Price and Button Skeleton */}
        <div className="mt-2 md:mt-4 flex items-center justify-between">
          <div className="h-4 sm:h-5 md:h-6 bg-gray-200 rounded w-24"></div>
          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </SimpleCard>
  );
}
