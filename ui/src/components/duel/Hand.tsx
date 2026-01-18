import React from "react";
import { Card } from "./Card";
import { CyberCard } from "../../data/mockData";

interface HandProps {
  cards: CyberCard[];
  onCardClick: (cardId: string) => void;
  disabled?: boolean;
}

export const Hand: React.FC<HandProps> = ({ cards, onCardClick, disabled }) => {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const handleCardHover = (id: string | null) => {
    setHoveredId(id);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-44 bg-matrix-black/80 backdrop-blur-md border-t border-primary/30 flex items-center justify-center px-12 z-20">
      <div className="flex gap-4 items-end -translate-y-4">
        {cards.map((card) => {
          const isHovered = hoveredId === card.id;
          return (
            <div
              key={card.id}
              onMouseEnter={() => handleCardHover(card.id)}
              onMouseLeave={() => handleCardHover(null)}
              onClick={() => !disabled && onCardClick(card.id)}
              className={`cursor-pointer transition-all duration-200 ${disabled ? "opacity-50 grayscale cursor-not-allowed" : "hover:-translate-y-4"}`}
            >
              <Card
                name={card.title}
                imageUrl={card.img}
                variant={isHovered ? "detailed" : "simple"}
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
