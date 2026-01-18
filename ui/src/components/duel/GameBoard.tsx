import React from 'react';
import { Hand } from './Hand';

export const GameBoard: React.FC = () => {
    return (
        <section className="flex-1 flex flex-col relative overflow-hidden px-12 py-8 bg-gradient-to-b from-matrix-black to-background-dark">
            {/* Remote Uplink Node (Opponent Field) */}
            <div className="flex-1 flex flex-col items-center justify-start pt-4">
                <div className="text-[10px] font-black uppercase text-white/30 tracking-[0.5em] mb-4">Remote Uplink Node</div>
                <div className="w-48 h-64 holo-border rounded-sm bg-matrix-black/80 flex items-center justify-center relative group overflow-hidden">
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-matrix-black/40">
                        <img
                            className="w-full h-full object-cover opacity-10 grayscale scale-110 blur-[1px]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8RKtBZwa_iOuANwQq1SIa3UuuSfV_FWNxvO-If5Hos_QCrQ0v-mXYBpweG65HPl6cpi-O1sdhPtjRtd8civ5SK77F-uOxDv2DzU5r-nf6qNF7kiKIPdAP9tjzjAx7bUCu6XWbKGf66pCZPgiSN_3rGCJ7A5MWGC54wn9gH6i5ZECB6uwx5DymMoDhLK5glJ-opXdXcmCyb-mT0rZXHdBpDcGDVuvDe9TlJOpmYlSh2fZcVcV9QQ3RWd1jwulEi5F225lEcy2lhw"
                            alt="Opponent Node"
                        />
                        <div className="absolute inset-0 glitch-overlay opacity-30"></div>
                        <span className="absolute text-7xl font-black text-primary/40 glitch-text">?</span>
                        <div className="absolute bottom-4 animate-pulse flex flex-col items-center">
                            <span className="text-[9px] text-primary tracking-widest font-black uppercase">Encrypted Data</span>
                            <div className="w-24 h-0.5 bg-primary/20 mt-1">
                                <div className="w-1/3 h-full bg-primary shadow-[0_0_8px_#00E5FF]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Center Divider/Field Marker */}
            <div className="flex items-center justify-center gap-12 my-6">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary/20 to-primary/40"></div>
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary/60">grid_guides</span>
                    <span className="text-xs font-black tracking-[1em] text-primary/80 uppercase">Duel Field</span>
                    <span className="material-symbols-outlined text-primary/60">grid_guides</span>
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-primary/20 to-primary/40"></div>
            </div>

            {/* Local Root Core (Player Active Spot) */}
            <div className="flex-1 flex flex-col items-center justify-end pb-12">
                <div className="w-48 h-64 border-2 border-dashed border-primary/40 rounded-sm bg-primary/[0.05] flex items-center justify-center relative shadow-[0_0_20px_rgba(0,229,255,0.1)]">
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-primary/30">add_circle</span>
                        <span className="text-[10px] font-bold text-primary/40 mt-2 uppercase tracking-widest">Active Slot</span>
                    </div>
                </div>
                <div className="text-[10px] font-black uppercase text-primary tracking-[0.5em] mt-4">Local Root Core</div>
            </div>

            {/* Player Hand */}
            <Hand />
        </section>
    );
};
