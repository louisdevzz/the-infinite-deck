import React from 'react';
import { CyberCard } from '../../../data/mockData';

interface MarketListingsProps {
    listings: CyberCard[];
    selectedCardId: string | null;
    onSelectCard: (card: CyberCard) => void;
}

export const MarketListings: React.FC<MarketListingsProps> = ({ listings, selectedCardId, onSelectCard }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {listings.map((item) => {
                const isSelected = item.id === selectedCardId;
                const isSold = item.status === "SOLD";

                // Conditional Styles based on state
                const containerClass = isSold
                    ? "bg-surface/10 group cursor-not-allowed opacity-60 overflow-hidden border border-accent-magenta/20 p-3 relative flex flex-col transition-all duration-300"
                    : isSelected
                        ? "bg-surface/40 group cursor-pointer overflow-hidden border border-primary p-3 relative flex flex-col ring-1 ring-primary/20 shadow-[0_0_20px_rgba(0,229,255,0.1)] transition-all duration-300"
                        : "bg-surface/20 group cursor-pointer overflow-hidden border border-primary/10 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(0,229,255,0.05)] hover:-translate-y-1 transition-all duration-300 p-3 relative flex flex-col";

                const accentColor = isSold ? "text-accent-magenta" : "text-primary";
                const accentBorder = isSold ? "border-accent-magenta/40" : "border-primary/40";
                const accentBg = isSold ? "bg-accent-magenta/20" : "bg-primary/20";
                const glowClass = isSold ? "magenta-glow" : "cyan-glow";

                return (
                    <div
                        key={item.id}
                        className={containerClass}
                        onClick={() => !isSold && onSelectCard(item)}
                    >
                        <div className="absolute top-4 left-4 z-10 flex gap-2">
                            {isSelected && (
                                <span className="bg-primary text-background-dark px-2 py-0.5 text-[9px] font-bold tracking-[0.2em] uppercase rounded-sm animate-pulse">Selected</span>
                            )}
                            <span className={`${accentBg} backdrop-blur-md ${accentColor} border ${accentBorder} px-2 py-0.5 text-[9px] font-bold tracking-[0.2em] uppercase rounded-sm`}>
                                {item.status === 'ON_SALE' ? 'On Sale' : 'Sold'}
                            </span>
                        </div>
                        <div className={`bg-cover bg-center rounded aspect-[4/5] relative mb-4 ${isSold ? 'grayscale' : ''}`} style={{ backgroundImage: `linear-gradient(0deg, rgba(6, 15, 15, 0.8) 0%, transparent 100%), url("${item.image}")` }}>
                            <div className="absolute bottom-4 right-4 text-right">
                                <div className={`text-[9px] ${isSold ? 'text-accent-magenta/60' : 'text-primary/60'} uppercase font-bold tracking-widest`}>Price</div>
                                <div className={`text-xl font-bold ${accentColor} ${glowClass} tabular-nums`}>{(item.price || 0).toLocaleString()} SUI</div>
                            </div>
                        </div>
                        <div className="px-1 pb-2">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-lg font-bold text-white uppercase tracking-tight">{item.name}</h3>
                                <span className="text-primary/40 text-[10px]">{item.id}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-[10px] text-primary/60 border border-primary/10 px-2 rounded-full">{item.element}</span>
                                <span className={`text-[10px] ${isSold ? 'text-accent-magenta/60 border-accent-magenta/10' : 'text-accent-magenta/60 border-accent-magenta/10'} border px-2 rounded-full`}>{item.rarity}</span>
                            </div>
                        </div>
                        {!isSold && <div className="scanline absolute inset-0 pointer-events-none opacity-20"></div>}
                    </div>
                );
            })}
        </div>
    );
};
