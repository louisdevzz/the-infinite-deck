import React from 'react';
import { CARDS_DATA } from '../../data/mockData';
import { getRarityColor, getElementIcon, getElementColor } from '../../utils/cardStyles';

interface BackpackProps {
    items: string[];
    selectedCardId: string | null;
    onCardSelect: (id: string, source: 'deck' | 'backpack') => void;
}

export const Backpack: React.FC<BackpackProps> = ({ items, selectedCardId, onCardSelect }) => {
    return (
        <aside className="w-[30%] min-w-[250px] max-w-[350px] lg:w-[400px] xl:w-[450px] bg-dark-charcoal/40 backdrop-blur-xl border-l border-white/10 flex flex-col overflow-hidden transition-all duration-300">
            <div className="p-8 border-b border-white/5 bg-black/20">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 bg-primary/10 border-l-4 border-primary px-4 py-2">
                        <span className="material-symbols-outlined text-xl text-primary">inventory_2</span>
                        <span className="text-[12px] font-black uppercase tracking-[0.2em]">BACKPACK</span>
                    </div>
                    <div className="bg-secondary/20 border border-secondary text-secondary text-[8px] px-3 py-1 font-bold uppercase tracking-widest animate-pulse">Event Active</div>
                </div>

                <div className="relative mb-4">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-lg">search</span>
                    <input
                        className="w-full bg-black/60 border border-white/10 rounded-none pl-12 pr-4 py-3 text-[11px] font-mono text-white placeholder:text-white/20 focus:border-primary focus:ring-0 uppercase tracking-widest transition-colors outline-none"
                        placeholder="SEARCH ENCRYPTED NODES..."
                        type="text"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button className="h-10 bg-white/5 border border-white/10 text-[9px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                        <span className="material-symbols-outlined text-sm">filter_list</span> FILTER: ELEMENT
                    </button>
                    <button className="h-10 bg-white/5 border border-white/10 text-[9px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                        <span className="material-symbols-outlined text-sm">sort</span> SORT: RARITY
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 card-grid-container bg-black/10">
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                        <span className="material-symbols-outlined text-5xl mb-4 text-white/20">inventory_2</span>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Storage Empty</p>
                        <p className="text-[9px] font-mono text-white/40 max-w-[200px]">Acquire new nodes from the Market or Forge to expand your arsenal.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-5">
                        {items.map((cardId, idx) => {
                            const item = CARDS_DATA[cardId];
                            if (!item) return null;

                            const isSelected = selectedCardId === item.id;
                            const rarityStyle = getRarityColor(item.rarity);
                            const elementIcon = getElementIcon(item.element);
                            const elementColor = getElementColor(item.element);

                            return (
                                <div
                                    key={idx}
                                    onClick={() => onCardSelect(item.id, 'backpack')}
                                    className={`aspect-[3/4] bg-matrix-black border-2 rounded-sm relative group cursor-pointer overflow-hidden transition-all duration-300
                                        ${rarityStyle}
                                        ${isSelected ? 'scale-105 z-10 brightness-110' : 'hover:scale-105 hover:z-10'}
                                    `}
                                >


                                    {/* Element Icon */}
                                    <div className="absolute top-2 right-2 z-20 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                                        <span className={`material-symbols-outlined text-[14px] ${elementColor}`}>{elementIcon}</span>
                                    </div>

                                    {/* Image */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />
                                    <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90" src={item.img} alt={item.title} />

                                    {/* Bottom Info */}
                                    <div className="absolute bottom-0 inset-x-0 p-3 z-20 bg-gradient-to-t from-black via-black/90 to-transparent">
                                        <h5 className={`text-[9px] font-black uppercase tracking-wider mb-1 truncate ${isSelected ? 'text-white' : 'text-inherit'}`}>{item.title}</h5>
                                        <div className="flex justify-between items-end border-t border-white/10 pt-1.5 mt-1">
                                            <div className="flex flex-col">
                                                <span className="text-[6px] font-bold uppercase tracking-widest text-white/40">RARITY</span>
                                                <span className="text-[7px] font-bold uppercase text-white/70">{item.rarity}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[7px] font-mono text-white/30">#{item.id.substring(0, 3)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Empty placeholder slots to fill grid */}
                        {[...Array(6)].map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-[3/4] bg-white/5 border border-white/5 rounded-sm"></div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-8 border-t border-white/10 bg-black/40">
                <button className="w-full h-14 bg-primary text-matrix-black font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all flex items-center justify-center gap-3 cyan-glow">
                    <span className="material-symbols-outlined text-xl">add_circle</span> INITIALIZE SUMMON
                </button>
            </div>
        </aside>
    );
};
