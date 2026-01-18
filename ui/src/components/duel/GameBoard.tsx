import React, { useState } from 'react';
import { Hand } from './Hand';
import { Card } from './Card';
import { CARDS_DATA } from '../../data/mockData';

export const GameBoard: React.FC = () => {
    // Battlefield state (1 slot only as requested)
    const [playerSlots, setPlayerSlots] = useState<(string | null)[]>([null]);
    const [opponentSlots, setOpponentSlots] = useState<(string | null)[]>(['VOID_EYE']);

    // Drag and Drop State
    const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

    // Handle drag start from Hand
    const handleDragStart = (cardId: string) => {
        setDraggedCardId(cardId);
    };

    // Handle removing card from player slot
    const handlePlayerCardRemove = (slotIndex: number) => {
        const newSlots = [...playerSlots];
        newSlots[slotIndex] = null;
        setPlayerSlots(newSlots);
    };

    // Handle Drop on Slot
    const handleDrop = (e: React.DragEvent, slotIndex: number) => {
        e.preventDefault();
        if (draggedCardId && playerSlots[slotIndex] === null) {
            const newSlots = [...playerSlots];
            newSlots[slotIndex] = draggedCardId;
            setPlayerSlots(newSlots);
            setDraggedCardId(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    // Handle Drop on Hand (Return to deck)
    const handleDropOnHand = (e: React.DragEvent) => {
        e.preventDefault();
        if (draggedCardId) {
            const slotIndex = playerSlots.indexOf(draggedCardId);
            if (slotIndex !== -1) {
                const newSlots = [...playerSlots];
                newSlots[slotIndex] = null;
                setPlayerSlots(newSlots);
                setDraggedCardId(null);
            }
        }
    };

    return (
        <section className="flex-1 flex flex-col relative overflow-visible px-4 py-2 bg-gradient-to-b from-matrix-black to-background-dark items-center justify-center max-h-full">

            {/* Remote Uplink Node (Opponent Field) */}
            <div className="flex flex-col items-center justify-start mb-2">
                <div className="text-[10px] font-black uppercase text-white/30 tracking-[0.5em] mb-2">Remote Uplink Node</div>

                {/* Opponent 1-Slot */}
                <div className="flex justify-center">
                    {opponentSlots.map((cardId, index) => (
                        <div
                            key={`opponent-${index}`}
                            className="w-24 h-36 relative"
                        >
                            {cardId ? (
                                <div className="w-full h-full">
                                    <div className="w-full h-full holo-border rounded-sm bg-matrix-black/80 flex items-center justify-center relative group overflow-hidden">
                                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-matrix-black/40">
                                            <img
                                                className="w-full h-full object-cover opacity-10 grayscale scale-110 blur-[1px]"
                                                src={CARDS_DATA[cardId]?.img || ''}
                                                alt="Opponent Card"
                                            />
                                            <div className="absolute inset-0 glitch-overlay opacity-30"></div>
                                            <span className="absolute text-5xl font-black text-primary/40 glitch-text">?</span>
                                            <div className="absolute bottom-2 animate-pulse flex flex-col items-center">
                                                <span className="text-[9px] text-primary tracking-widest font-black uppercase">Encrypted</span>
                                                <div className="w-16 h-0.5 bg-primary/20 mt-1">
                                                    <div className="w-1/3 h-full bg-primary shadow-[0_0_8px_#00E5FF]"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full holo-border rounded-sm bg-matrix-black/80 flex items-center justify-center relative group overflow-hidden">
                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-matrix-black/40">
                                        <span className="text-5xl font-black text-primary/40 glitch-text">?</span>
                                        <div className="absolute bottom-2 animate-pulse flex flex-col items-center">
                                            <span className="text-[9px] text-primary tracking-widest font-black uppercase">Encrypted</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Center Divider/Field Marker */}
            <div className="flex items-center justify-center gap-8 my-4 w-full max-w-lg">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary/20 to-primary/40"></div>
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary/60 text-sm">grid_guides</span>
                    <span className="text-xs font-black tracking-[0.5em] text-primary/80 uppercase">Duel Field</span>
                    <span className="material-symbols-outlined text-primary/60 text-sm">grid_guides</span>
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-primary/20 to-primary/40"></div>
            </div>

            {/* Local Root Core (Player Field) */}
            <div className="flex flex-col items-center justify-start mb-2">
                {/* Player 1-Slot */}
                <div className="flex justify-center mb-2">
                    {playerSlots.map((cardId, index) => (
                        <div
                            key={`player-${index}`}
                            className="w-24 h-36 relative"
                            onDrop={(e) => handleDrop(e, index)}
                            onDragOver={handleDragOver}
                        >
                            {cardId ? (
                                <div className="w-full h-full">
                                    <div
                                        className="relative group w-full h-full cursor-grab active:cursor-grabbing"
                                        title="Drag to return to hand"
                                        draggable="true"
                                        onDragStart={() => handleDragStart(cardId)}
                                    >
                                        <Card
                                            name={CARDS_DATA[cardId]?.title || ''}
                                            imageUrl={CARDS_DATA[cardId]?.img || ''}
                                            variant="simple"
                                            hp={CARDS_DATA[cardId]?.hp}
                                            atk={CARDS_DATA[cardId]?.atk}
                                            def={CARDS_DATA[cardId]?.def}
                                            element={CARDS_DATA[cardId]?.element}
                                            rarity={CARDS_DATA[cardId]?.rarity}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full border-2 border-dashed border-primary/40 rounded-sm bg-primary/[0.05] flex items-center justify-center relative shadow-[0_0_20px_rgba(0,229,255,0.1)] transition-all">
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl text-primary/30">add_circle</span>
                                        <span className="text-[10px] font-bold text-primary/40 mt-1 uppercase tracking-widest">Zone {index + 1}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="text-[10px] font-black uppercase text-primary tracking-[0.5em] mb-4"></div>

                {/* Player Hand - Fixed Container, Compact */}
                <div
                    className="w-full h-32 flex items-end justify-center rounded-t-xl transition-colors"
                    onDrop={handleDropOnHand}
                    onDragOver={handleDragOver}
                >
                    <Hand
                        onDragStart={handleDragStart}
                        placedCards={playerSlots.filter((id): id is string => id !== null)}
                    />
                </div>
            </div>
        </section>
    );
};
