import React from 'react';
import { CyberCard } from '../../data/mockData';
import { getRarityColor, getElementIcon, getElementColor } from '../../utils/cardStyles';

interface CardDetailPanelProps {
    selectedCard: CyberCard | null;
    isEquipped: boolean;
    onEquip: () => void;
    onUnequip: () => void;
}

export const CardDetailPanel: React.FC<CardDetailPanelProps> = ({ selectedCard, isEquipped, onEquip, onUnequip }) => {
    if (!selectedCard) {
        return (
            <aside className="w-[30%] min-w-[250px] max-w-[400px] bg-dark-charcoal/40 backdrop-blur-xl border-r border-white/10 flex flex-col p-4 md:p-8 items-center justify-center text-white/30">
                <span className="material-symbols-outlined text-4xl mb-2">touch_app</span>
                <p className="text-sm font-bold uppercase tracking-widest">Select a node to inspect</p>
            </aside>
        );
    }

    const rarityStyle = getRarityColor(selectedCard.rarity);
    const elementIcon = getElementIcon(selectedCard.element);
    const elementColor = getElementColor(selectedCard.element);

    return (
        <aside className="w-[30%] min-w-[250px] max-w-[400px] bg-dark-charcoal/40 backdrop-blur-xl border-r border-white/10 flex flex-col p-4 md:p-8 overflow-y-auto card-grid-container">
            {/* Card Preview */}
            <div className="relative group mb-8">
                <div className={`aspect-[3/4] w-full bg-black border-2 rounded-sm overflow-hidden relative ${rarityStyle}`}>


                    {/* Element Icon */}
                    <div className="absolute top-3 right-3 z-20 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                        <span className={`material-symbols-outlined text-[18px] ${elementColor}`}>{elementIcon}</span>
                    </div>

                    {/* Image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    <img className="w-full h-full object-cover" src={selectedCard.img} alt={selectedCard.title} />


                </div>
            </div>

            {/* Card Details */}
            <div className="space-y-6">
                {/* Title & Type */}
                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                    <div>
                        <h3 className={`text-2xl font-black text-white uppercase italic tracking-tighter ${rarityStyle}`}>
                            {selectedCard.title}
                        </h3>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] mt-1 text-white/60">
                            {selectedCard.type} | {selectedCard.element}
                        </p>
                    </div>
                    <div className="flex flex-col items-end opacity-60">
                        <span className={`material-symbols-outlined ${elementColor}`}>{elementIcon}</span>
                        <span className={`text-[9px] font-black ${elementColor}`}>#{selectedCard.id.substring(0, 4)}</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-red-500/10 border border-red-500/30 p-3 flex flex-col items-center rounded">
                        <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest mb-1">HP</span>
                        <span className="text-2xl font-black text-red-400 tabular-nums">{selectedCard.hp}</span>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 p-3 flex flex-col items-center rounded">
                        <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest mb-1">ATK</span>
                        <span className="text-2xl font-black text-primary tabular-nums">{selectedCard.atk}</span>
                    </div>
                    <div className="bg-secondary/5 border border-secondary/20 p-3 flex flex-col items-center rounded">
                        <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest mb-1">DEF</span>
                        <span className="text-2xl font-black text-secondary tabular-nums">{selectedCard.def}</span>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-black/40 border border-white/10 p-5 rounded">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                        <span className="material-symbols-outlined text-primary text-sm">description</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Card Effect</span>
                    </div>
                    <p className="text-[12px] text-white/70 leading-relaxed">
                        {selectedCard.description}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 gap-4 pt-4">
                    {isEquipped ? (
                        <button
                            onClick={onUnequip}
                            className="h-12 border border-secondary/40 text-secondary text-[11px] font-black uppercase tracking-[0.2em] hover:bg-secondary/10 transition-all flex items-center justify-center gap-2 rounded"
                        >
                            <span className="material-symbols-outlined text-lg">remove_circle</span> REMOVE FROM DECK
                        </button>
                    ) : (
                        <button
                            onClick={onEquip}
                            className="h-12 bg-primary text-matrix-black text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-2 cyan-glow rounded"
                        >
                            <span className="material-symbols-outlined text-lg">bolt</span> EQUIP TO DECK
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
};
