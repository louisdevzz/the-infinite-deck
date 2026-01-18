import React from 'react';

export const MarketSkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-panel-dark border border-white/5 rounded-sm overflow-hidden h-[380px] animate-pulse relative">
                    {/* Image Skeleton */}
                    <div className="h-[60%] bg-white/5 relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="p-4 space-y-3">
                        <div className="h-4 bg-white/10 rounded w-3/4"></div>
                        <div className="flex gap-2">
                            <div className="h-3 bg-white/5 rounded w-12"></div>
                            <div className="h-3 bg-white/5 rounded w-12"></div>
                        </div>
                        <div className="pt-4 flex justify-between items-center">
                            <div className="h-6 bg-white/10 rounded w-20"></div>
                            <div className="h-8 bg-white/5 rounded w-8"></div>
                        </div>
                    </div>

                    {/* Corner accents */}
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/5"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/5"></div>
                </div>
            ))}
        </div>
    );
};
