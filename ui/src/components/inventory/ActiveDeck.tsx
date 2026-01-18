import React from "react";
import {
  getRarityColor,
  getElementIcon,
  getElementColor,
} from "../../utils/cardStyles";
import { CyberCard } from "../../data/mockData";

interface ActiveDeckProps {
  deck: (string | null)[];
  cards: Record<string, CyberCard>;
  selectedCardId: string | null;
  onCardSelect: (id: string, source: "deck" | "backpack") => void;
  onClearDeck: () => void;
  onSaveDeck: () => void;
  onSyncCollection: () => void;
  stats: {
    wins: number;
    losses: number;
    totalCards: number;
    suiBalance: string;
  };
}

export const ActiveDeck: React.FC<ActiveDeckProps> = ({
  deck,
  cards,
  selectedCardId,
  onCardSelect,
  onClearDeck,
  onSaveDeck,
  onSyncCollection,
  stats,
}) => {
  return (
    <section className="flex-1 bg-background-dark/30 flex flex-col p-4 lg:p-8 overflow-visible lg:overflow-hidden order-2 lg:order-none min-h-[400px]">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 lg:mb-8 gap-4 lg:gap-0">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary text-3xl">
            layers
          </span>
          <div className="flex flex-col">
            <h4 className="text-sm font-black uppercase tracking-[0.4em] text-white">
              Active Deck
            </h4>
            <span className="text-[10px] font-bold text-primary/60">
              {deck.filter(Boolean).length} / 5 NODES REGISTERED
            </span>
          </div>
        </div>
        <div className="flex gap-2 lg:gap-3 w-full lg:w-auto">
          <button
            onClick={onSyncCollection}
            className="flex-1 lg:flex-none px-3 lg:px-4 py-2 bg-zinc-800 text-primary border border-primary/30 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[14px]">sync</span>
            SYNC
          </button>
          <button
            onClick={onClearDeck}
            className="flex-1 lg:flex-none px-3 lg:px-4 py-2 bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            Clear All
          </button>
          <button
            onClick={onSaveDeck}
            className="flex-1 lg:flex-none px-4 lg:px-6 py-2 bg-primary text-matrix-black text-[10px] font-black uppercase tracking-widest cyan-glow hover:bg-primary-light transition-all"
          >
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-8 lg:gap-12 justify-center">
        <div className="grid grid-cols-5 md:grid-cols-5 gap-2 lg:gap-6 max-w-4xl mx-auto w-full relative">
          {/* Empty Deck Guidance Overlay */}
          {deck.every((c) => c === null) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
              <div className="bg-black/80 backdrop-blur-sm border border-primary/50 px-8 py-4 rounded-lg flex flex-col items-center animate-pulse">
                <span className="material-symbols-outlined text-primary text-3xl mb-2">
                  settings_alert
                </span>
                <p className="text-primary font-black uppercase tracking-widest text-xs">
                  Deck Configuration Required
                </p>
                <p className="text-white/60 text-[9px] mt-1 font-mono">
                  SELECT NODES FROM BACKPACK TO EQUIP
                </p>
              </div>
            </div>
          )}

          {deck.map((cardId, idx) => {
            if (!cardId) {
              return (
                <div
                  key={idx}
                  className="aspect-[3/4] border-2 border-dashed border-white/5 rounded-sm flex items-center justify-center bg-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                >
                  <span className="material-symbols-outlined text-white/10 text-4xl group-hover:text-primary/40 transition-colors">
                    add
                  </span>
                </div>
              );
            }

            const card = cards[cardId];
            if (!card) return null;

            const isSelected = selectedCardId === card.id;
            const rarityStyle = getRarityColor(card.rarity);
            const elementIcon = getElementIcon(card.element);
            const elementColor = getElementColor(card.element);

            return (
              <div
                key={idx}
                onClick={() => onCardSelect(card.id, "deck")}
                className={`aspect-[3/4] bg-matrix-black border-2 rounded-sm relative group cursor-pointer overflow-hidden transition-all duration-300
                                    ${rarityStyle}
                                    ${isSelected ? "scale-110 z-10 brightness-110 shadow-xl -translate-y-4" : "hover:-translate-y-2"}
                                `}
              >
                {/* Element Icon */}
                <div className="absolute top-2 right-2 z-20 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <span
                    className={`material-symbols-outlined text-[14px] ${elementColor}`}
                  >
                    {elementIcon}
                  </span>
                </div>

                {/* Image */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90"
                  src={card.img}
                  alt={card.title}
                />

                {/* Bottom Info */}
                <div className="absolute bottom-0 inset-x-0 p-3 z-20 bg-gradient-to-t from-black via-black/90 to-transparent">
                  <h5
                    className={`text-[9px] font-black uppercase tracking-wider mb-1 truncate ${isSelected ? "text-white" : "text-inherit"}`}
                  >
                    {card.title}
                  </h5>
                  <div className="flex justify-between items-end border-t border-white/10 pt-1.5 mt-1">
                    <div className="flex flex-col">
                      <span className="text-[6px] font-bold uppercase tracking-widest text-white/40">
                        RARITY
                      </span>
                      <span className="text-[7px] font-bold uppercase text-white/70">
                        {card.rarity}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[7px] font-mono text-white/30">
                        #{card.id.substring(0, 3)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap lg:flex-nowrap justify-center gap-6 lg:gap-16 pt-8 lg:pt-12 border-t border-white/5 max-w-4xl mx-auto w-full">
          <div className="text-center w-full lg:w-auto">
            <p className="text-[10px] text-white/40 font-bold uppercase mb-2 tracking-widest">
              Battle Record
            </p>
            <p className="text-2xl font-black text-primary text-cyan-glow">
              {stats.wins}W - {stats.losses}L
            </p>
          </div>
          <div className="text-center w-[45%] lg:w-auto">
            <p className="text-[10px] text-white/40 font-bold uppercase mb-2 tracking-widest">
              Collection Size
            </p>
            <p className="text-2xl font-black text-secondary">
              {stats.totalCards} Nodes
            </p>
          </div>
          <div className="text-center w-[45%] lg:w-auto">
            <p className="text-[10px] text-white/40 font-bold uppercase mb-2 tracking-widest">
              Sui Balance
            </p>
            <p className="text-2xl font-black text-white">
              {stats.suiBalance} SUI
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
