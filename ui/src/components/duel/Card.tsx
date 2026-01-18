import React from 'react';
import { getRarityColor, getElementIcon, getElementColor } from '../../utils/cardStyles';

interface CardProps {
    name: string;
    imageUrl: string;
    hp?: number;
    atk?: number;
    def?: number;
    element?: string;
    rarity?: string;
    selected?: boolean;
    onClick?: () => void;
    variant?: 'simple' | 'detailed';
}

export const Card: React.FC<CardProps> = ({
    name,
    imageUrl,
    hp,
    atk,
    def,
    element,
    rarity,
    selected = false,
    onClick,
    variant = 'simple'
}) => {
    const baseClasses = "bg-matrix-black rounded-sm cursor-pointer relative overflow-hidden transition-all duration-300";

    if (variant === 'simple') {
        const rarityStyle = rarity ? getRarityColor(rarity) : 'border-white/20';
        const elementIcon = element ? getElementIcon(element) : null;
        const elementColor = element ? getElementColor(element) : '';

        return (
            <div
                className={`${baseClasses} w-24 h-36 border-2 hover:-translate-y-2 group bg-black ${rarityStyle}`}
                onClick={onClick}
            >
                {/* Element Icon */}
                {elementIcon && (
                    <div className="absolute top-1 right-1 z-20 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                        <span className={`material-symbols-outlined text-[12px] ${elementColor}`}>{elementIcon}</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 z-10" />
                <img
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    src={imageUrl}
                    alt={name}
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 z-20">
                    <p className="text-[10px] font-black text-primary truncate uppercase tracking-wider drop-shadow-md">{name}</p>
                </div>
            </div>
        );
    }

    // Detailed variant - shows full stats on hover
    const rarityStyle = rarity ? getRarityColor(rarity) : 'border-white/10';
    const elementIcon = element ? getElementIcon(element) : null;
    const elementColor = element ? getElementColor(element) : '';

    return (
        <div
            className={`${baseClasses} w-32 h-48 border-2 ${rarityStyle} ${selected ? 'shadow-xl' : ''}`}
            onClick={onClick}
        >
            <div className="p-2 h-full flex flex-col bg-matrix-black/90">
                {/* Card Image */}
                <div className="h-2/5 bg-zinc-900 rounded-sm mb-2 border border-primary/20 overflow-hidden relative">
                    {elementIcon && (
                        <div className="absolute top-1 right-1 z-20 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                            <span className={`material-symbols-outlined text-[12px] ${elementColor}`}>{elementIcon}</span>
                        </div>
                    )}
                    <img className="w-full h-full object-cover" src={imageUrl} alt={name} />
                </div>

                {/* Card Name */}
                <p className="text-[10px] font-black uppercase mb-2 text-primary truncate">{name}</p>

                {/* Rarity */}
                {rarity && (
                    <div className="flex items-center gap-1 mb-2">
                        <span className={`text-[7px] px-1.5 py-0.5 rounded font-bold uppercase ${rarityStyle}`}>{rarity}</span>
                    </div>
                )}

                {/* Stats */}
                <div className="mt-auto space-y-1">
                    {hp !== undefined && (
                        <div className="flex justify-between text-[8px] font-bold bg-red-500/10 border border-red-500/30 px-1.5 py-0.5 rounded">
                            <span className="text-white/60">HP</span>
                            <span className="text-red-400">{hp}</span>
                        </div>
                    )}
                    {atk !== undefined && (
                        <div className="flex justify-between text-[8px] font-bold bg-primary/10 border border-primary/30 px-1.5 py-0.5 rounded">
                            <span className="text-white/60">ATK</span>
                            <span className="text-primary">{atk}</span>
                        </div>
                    )}
                    {def !== undefined && (
                        <div className="flex justify-between text-[8px] font-bold bg-secondary/10 border border-secondary/30 px-1.5 py-0.5 rounded">
                            <span className="text-white/60">DEF</span>
                            <span className="text-secondary">{def}</span>
                        </div>
                    )}
                </div>
            </div>

            {selected && (
                <div className="absolute top-1 left-1 bg-primary text-matrix-black text-[7px] font-black px-1.5 py-0.5 rounded animate-pulse">
                    SELECTED
                </div>
            )}
        </div>
    );
};
