import React, { useState, useEffect } from "react";
import { MOCK_HOME_DATA, CyberCard } from "../../../data/mockData";
import { ForgeDialog } from "./ForgeDialog";
import { usePlayerProfile } from "../../../hooks/usePlayerProfile";
import { useCards } from "../../../hooks/useCards";
import { getRarityColor } from "../../../utils/cardStyles";

export const ConstructionPedestal: React.FC = () => {
  // Local state to allow updating the card displayed
  // Initialize with mock data as fallback
  const [activeCard, setActiveCard] = useState<CyberCard>(
    MOCK_HOME_DATA.activeConstruction as CyberCard,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { profile } = usePlayerProfile();
  const { cards, fetchCards } = useCards();

  // Load latest card from profile
  useEffect(() => {
    if (profile?.allCards && profile.allCards.length > 0) {
      // Get the last card ID (assuming appended to end)
      const lastCardId = profile.allCards[profile.allCards.length - 1];

      // Fetch data for this card if not available
      if (!cards[lastCardId]) {
        fetchCards([lastCardId]);
      } else {
        setActiveCard(cards[lastCardId]);
      }
    }
  }, [profile, cards, fetchCards]);

  const handleOpenForge = () => {
    setIsDialogOpen(true);
  };

  const handleForgeComplete = (newCard: CyberCard) => {
    // When forge completes, we might want to refresh profile or just set the new card locally
    // For now, setting locally gives instant feedback
    setActiveCard(newCard);
    setIsDialogOpen(false);
  };

  const rarityStyle = getRarityColor(activeCard.rarity);

  return (
    <section className="col-span-6 h-full relative flex flex-col items-center justify-center perspective-container z-20">
      {/* Holographic Emitter Base */}
      <div className="absolute bottom-[10%] w-[300px] h-[100px] bg-linear-to-t from-primary/10 to-transparent blur-xl animate-pulse pointer-events-none"></div>

      {/* Dynamic Background Rings */}
      <div className="absolute w-[700px] h-[700px] rounded-full border border-primary/5 pointer-events-none animate-[spin_60s_linear_infinite] opacity-30"></div>
      <div className="absolute w-[550px] h-[550px] rounded-full border border-dashed border-primary/10 pointer-events-none animate-[spin_40s_linear_infinite_reverse] opacity-40"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full border border-primary/20 pointer-events-none animate-[spin_20s_linear_infinite] opacity-20 shadow-[0_0_30px_rgba(0,229,255,0.1)]"></div>

      {/* Central Card Container */}
      <div className="relative z-10 w-[360px] h-[460px] tilt-center transition-all duration-700 hover:scale-105 group">
        {/* Floating Shadow */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-primary/20 blur-2xl rounded-full"></div>

        <div
          className={`w-full h-full bg-black/60 backdrop-blur-md rounded-2xl border ${rarityStyle.split(" ")[0]} shadow-[0_0_40px_rgba(0,229,255,0.15)] flex flex-col p-5 relative overflow-hidden transition-all duration-300`}
        >
          {/* Glossy Overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none z-20"></div>

          {/* Status Badge */}
          <div className="absolute top-4 right-4 z-30">
            <div className="bg-black/80 border border-primary/50 text-primary font-mono font-bold text-[10px] px-3 py-1 uppercase tracking-[0.2em] shadow-[0_0_10px_rgba(0,229,255,0.4)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
              {activeCard.status || "READY"}
            </div>
          </div>

          {/* Card Image Area */}
          <div className="flex-1 bg-black/80 rounded-xl overflow-hidden relative mb-5 border border-white/5 group-hover:border-primary/40 transition-colors shadow-inner">
            <div className="absolute inset-0 bg-linear-to-t from-primary/10 to-transparent opacity-60 z-10"></div>
            <img
              src={activeCard.img || activeCard.image} // Handle potentially different field names
              alt={activeCard.title || activeCard.name}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-110"
            />

            {/* Laser Scanning Effect */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/80 shadow-[0_0_20px_#00E5FF] animate-[scan_4s_ease-in-out_infinite] z-20"></div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay z-10"></div>
          </div>

          {/* Card Info */}
          <div className="space-y-3 relative z-20">
            <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-none truncate">
              {activeCard.title || activeCard.name}
            </h2>
            <div className="h-px w-full bg-linear-to-r from-primary/50 to-transparent"></div>

            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-primary/60 uppercase tracking-[0.2em]">
                  Rarity
                </span>
                <span
                  className={`text-sm font-bold uppercase ${rarityStyle.split(" ")[1]}`}
                >
                  {activeCard.rarity}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold text-primary/60 uppercase tracking-[0.2em] block mb-0.5">
                  ATK / DEF
                </span>
                <span className="text-2xl font-mono font-bold text-white tracking-widest leading-none">
                  {activeCard.atk || 0} / {activeCard.def || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pedestal Base & Actions */}
      <div className="flex flex-col items-center gap-6 mt-12 relative z-30">
        <button
          onClick={handleOpenForge}
          className="w-80 py-4 clip-path-polygon-[10%_0,100%_0,90%_100%,0%_100%] bg-primary hover:bg-white text-background-dark font-black tracking-[0.3em] uppercase transition-all duration-300 relative overflow-hidden group shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:shadow-[0_0_50px_rgba(255,255,255,0.6)] skew-x-[-10deg] hover:skew-x-[-5deg] hover:scale-105"
        >
          <div className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-x-[10deg]"></div>
          <span className="relative z-10 flex items-center justify-center gap-3 skew-x-[10deg]">
            <span className="material-symbols-outlined text-xl">token</span>
            START NEW FORGE
          </span>
        </button>

        <div className="flex items-center gap-4 text-[10px] text-primary/40 font-mono tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#00ff00]"></span>
          SYSTEM <span className="text-white font-bold">ONLINE</span>
          <span>::</span>
          <span>
            LATEST MINT{" "}
            <span className="text-white font-bold">
              {activeCard.id ? `#${activeCard.id.substring(0, 4)}` : "N/A"}
            </span>
          </span>
        </div>
      </div>

      <ForgeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onForgeComplete={handleForgeComplete}
      />
    </section>
  );
};
