import React from 'react';
import { Card } from './Card';
import { CARDS_DATA } from '../../data/mockData';

const MOCK_HAND_IDS = ['D_SYNC', 'ROOTKIT', 'PULSE_LANCER', 'LOGIC_B', 'SHREDDER'];

export const Hand: React.FC = () => {
    const [hoveredId, setHoveredId] = React.useState<string | null>(null);

    const handleCardHover = (id: string | null) => {
        setHoveredId(id);
    };

    return (
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-matrix-black/80 backdrop-blur-md border-t border-primary/30 flex items-center justify-center px-12">
            <div className="flex gap-4 items-end -translate-y-4">
                {MOCK_HAND_IDS.map((cardId) => {
                    const card = CARDS_DATA[cardId];
                    if (!card) return null;

                    const isHovered = hoveredId === cardId;
                    return (
                        <div
                            key={cardId}
                            onMouseEnter={() => handleCardHover(cardId)}
                            onMouseLeave={() => handleCardHover(null)}
                        >
                            <Card
                                name={card.title}
                                imageUrl={card.img}
                                variant={isHovered ? 'detailed' : 'simple'}
                                hp={card.hp}
                                atk={card.atk}
                                def={card.def}
                                element={card.element}
                                rarity={card.rarity}
                                selected={isHovered}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
