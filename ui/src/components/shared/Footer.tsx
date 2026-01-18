import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="hidden md:flex bg-matrix-black px-6 h-8 border-t border-white/10 items-center justify-between text-[10px] font-bold tracking-widest text-white/20">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-8 uppercase font-mono tracking-widest text-white/40 text-[9px]">
                    <span>COORD_X: 144.22</span>
                    <span>COORD_Y: 902.11</span>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_#00E5FF]"></span>
                    <span className="text-primary font-mono text-[9px] tracking-widest">NEURAL SYNC: STABLE</span>
                </div>
                <div className="flex items-center gap-2 text-white/20 text-[9px] uppercase tracking-widest">
                    <span>CYPHER_KERNEL V4.2.0</span>
                </div>
            </div>
        </footer>
    );
};
