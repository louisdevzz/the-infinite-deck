import React from 'react';
import { Card } from './Card';
import { CARDS_DATA } from '../../data/mockData';

const MOCK_HAND_IDS = ['D_SYNC', 'ROOTKIT', 'PULSE_LANCER', 'LOGIC_B', 'SHREDDER'];

interface HandProps {
    onDragStart: (cardId: string) => void;
    placedCards: string[]; // Cards already placed on battlefield
}

export const Hand: React.FC<HandProps> = ({ onDragStart, placedCards }) => {
    const [hoveredId, setHoveredId] = React.useState<string | null>(null);

    const handleCardHover = (id: string | null) => {
        setHoveredId(id);
    };

    // Filter out cards that are already placed on battlefield
    const availableCards = MOCK_HAND_IDS.filter(id => !placedCards.includes(id));

    return (
        <div className="w-full flex justify-center">
            <div className="flex gap-2 md:gap-4 items-end">
                {availableCards.map((cardId) => {
                    const card = CARDS_DATA[cardId];
                    if (!card) return null;

                    const isHovered = hoveredId === cardId;

                    return (
                        <div
                            key={cardId}
                            draggable="true"
                            onDragStart={() => onDragStart(cardId)}
                            onMouseEnter={() => handleCardHover(cardId)}
                            onMouseLeave={() => handleCardHover(null)}
                            className="cursor-grab active:cursor-grabbing"
                        >
                            <div className={`transition-all duration-200 ${isHovered ? 'scale-105 -translate-y-2' : ''}`}>
                                <Card
                                    name={card.title}
                                    imageUrl={card.img}
                                    variant={isHovered ? 'detailed' : 'simple'}
                                    hp={card.hp}
                                    atk={card.atk}
                                    def={card.def}
                                    element={card.element}
                                    rarity={card.rarity}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {availableCards.length === 0 && (
                <div className="text-white/20 text-xs uppercase tracking-widest font-black">
                    Deck Empty
                </div>
            )}
        </div>
    );
};
