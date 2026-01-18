import React from 'react';

export const StatsPanel: React.FC = () => {
    return (
        <aside className="w-80 bg-matrix-black/40 backdrop-blur-xl border-l border-white/5 flex flex-col p-6 h-full">
            <div className="space-y-6 mb-auto">
                <div className="metallic-panel p-4 rounded-sm border-l-4 border-l-secondary/50">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Opponent Integrity</p>
                        <span className="text-[9px] font-mono text-white/20">DX-404</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black font-display tracking-tight text-white italic">7200</p>
                        <span className="text-secondary text-xs font-bold uppercase tracking-tighter">Ready</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 mt-2 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-[72%] shadow-[0_0_8px_rgba(255,0,255,0.4)]"></div>
                    </div>
                </div>

                <div className="metallic-panel p-4 rounded-sm border-l-4 border-l-primary shadow-[inset_0_0_20px_rgba(0,229,255,0.05)]">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-[10px] font-bold text-primary tracking-widest uppercase">User Integrity</p>
                        <span className="text-[9px] font-mono text-primary animate-pulse">STABLE</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black font-display tracking-tight text-white italic">4500</p>
                        <span className="text-primary text-sm font-bold animate-pulse">-500</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 mt-2 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[45%] shadow-[0_0_12px_rgba(0,229,255,0.6)]"></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
                <div className="bg-black/40 border border-white/5 p-3 rounded flex flex-col items-center">
                    <span className="text-[9px] uppercase font-bold text-white/40 mb-1">Resource Pool</span>
                    <span className="text-lg font-black text-primary">12 / 20</span>
                </div>
                <div className="bg-black/40 border border-white/5 p-3 rounded flex flex-col items-center">
                    <span className="text-[9px] uppercase font-bold text-white/40 mb-1">ROM Load</span>
                    <span className="text-lg font-black text-secondary">24 Nodes</span>
                </div>
            </div>

            <div className="mt-8">
                <button className="w-full h-16 bg-primary text-matrix-black font-black tracking-[0.2em] uppercase rounded-sm border-b-4 border-primary/60 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center justify-center gap-0 shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.5)]">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined font-bold">bolt</span>
                        <span className="text-sm">Initialize Summon</span>
                    </div>
                    <span className="text-[8px] tracking-[0.4em] opacity-70">Execute Blind_Protocol</span>
                </button>
                <div className="grid grid-cols-2 gap-2 mt-4">
                    <button className="h-10 bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-primary/60 hover:bg-primary/10 hover:text-primary transition-colors">Tactical Scan</button>
                    <button className="h-10 bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-secondary/60 hover:bg-secondary/10 hover:text-secondary transition-colors">Purge Loop</button>
                </div>
            </div>
        </aside>
    );
};
