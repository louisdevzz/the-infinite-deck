import React from 'react';

export const EventStream: React.FC = () => {
    return (
        <aside className="w-72 bg-matrix-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col p-4 relative h-full">
            <div className="flex items-center gap-2 px-2 py-2 mb-4 bg-primary/5 border-l-2 border-primary rounded-r">
                <span className="material-symbols-outlined text-primary text-lg">terminal</span>
                <p className="text-white text-xs font-bold tracking-wider uppercase">Event Stream</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide text-[11px] font-medium font-mono">
                <div className="p-2 border-b border-white/5 opacity-50">
                    <span className="text-primary mr-1">&gt; 0.12s</span> Hand initialized: <span className="text-primary/70">5 nodes loaded</span>.
                </div>
                <div className="p-2 border-b border-white/5 bg-primary/5 rounded border-l border-primary/20">
                    <span className="text-primary mr-1">&gt; 0.45s</span> <span className="text-white font-bold">Awaiting Blind Summon...</span>
                </div>
                <div className="p-2 border-b border-white/5 opacity-80">
                    <span className="text-primary mr-1">&gt; 0.88s</span> Opponent integrity verified.
                </div>
                <div className="p-2 border-b border-white/5 opacity-80 italic text-white/40">
                    <span className="text-primary mr-1">&gt; 1.02s</span> Pulse Lancer strikes for <span className="text-primary font-bold">450 DMG</span>.
                </div>
            </div>

            <div className="mt-4 p-3 bg-black/40 border border-white/10 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-secondary text-white text-[7px] px-1.5 py-0.5 font-bold uppercase">Limited Time</div>
                <p className="text-[9px] uppercase font-bold text-white/30 mb-2 mt-1">Elemental Multipliers</p>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between text-[10px]">
                        <span className="text-primary">CYBER</span>
                        <span className="text-primary font-bold">x1.5</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                        <span className="text-secondary">VOID</span>
                        <span className="text-secondary font-bold">x0.8</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};
