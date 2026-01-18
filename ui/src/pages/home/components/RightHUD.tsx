import React from 'react';

export const RightHUD: React.FC = () => {
    return (
        <aside className="col-span-3 h-full flex flex-col justify-center gap-4 md:gap-6 tilt-right origin-right scale-[0.7] md:scale-100 transition-transform">
            {/* System Status Panel */}
            <div className="glass-panel p-6 rounded-xl relative overflow-hidden border border-white/5 group hover:border-primary/30 transition-colors">
                {/* Corner markers */}
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary opacity-50"></div>

                <div className="absolute top-0 right-0 p-2">
                    <div className="size-2 bg-primary rounded-full glow-teal animate-pulse"></div>
                </div>
                <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-4 font-display">Core Telemetry</h4>
                <div className="space-y-4 font-mono">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-white/60 font-medium">SERVER LATENCY</span>
                        <span className="text-xs text-primary font-bold">14ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-white/60 font-medium">PLAYER DENSITY</span>
                        <span className="text-xs text-primary font-bold">OPTIMAL</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-white/60 font-medium">CONSTRUCTION QUEUE</span>
                        <span className="text-xs text-accent-magenta font-bold animate-pulse">3 ACTIVE</span>
                    </div>
                </div>
            </div>

            {/* Event Notification */}
            <div className="glass-panel p-6 rounded-xl border border-accent-magenta/30 bg-accent-magenta/5 relative group hover:bg-accent-magenta/10 transition-all">
                {/* Glow Background */}
                <div className="absolute inset-0 bg-accent-magenta/5 blur-xl group-hover:bg-accent-magenta/10 transition-all"></div>

                <div className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-0.5 bg-accent-magenta text-[8px] font-bold text-white rounded-b-lg tracking-[0.2em] uppercase shadow-[0_0_10px_rgba(255,0,255,0.5)]">Limited Time</div>
                <div className="flex flex-col items-center text-center gap-3 mt-2 relative z-10">
                    <div className="p-3 bg-accent-magenta/10 rounded-full border border-accent-magenta/20">
                        <span className="material-symbols-outlined text-accent-magenta text-3xl">celebration</span>
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm font-display tracking-wide">NEON OVERDRIVE</p>
                        <p className="text-white/50 text-[10px] leading-tight mt-1">Special boosters available in shop for limited time.</p>
                    </div>
                    <button className="w-full py-2 bg-accent-magenta/20 hover:bg-accent-magenta/30 text-accent-magenta text-[10px] font-black tracking-widest uppercase rounded border border-accent-magenta/40 transition-all hover:scale-105 active:scale-95">
                        VIEW DETAILS
                    </button>
                </div>
            </div>

            {/* Bottom Right Action Icons */}
            <div className="flex justify-end gap-3 mt-4">
                {['mail', 'group', 'settings'].map((icon) => (
                    <button key={icon} className="size-10 flex items-center justify-center glass-panel rounded-lg hover:bg-white/10 hover:border-primary/50 transition-all group relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                        <span className="material-symbols-outlined text-white/60 group-hover:text-primary transition-colors relative z-10">{icon}</span>
                    </button>
                ))}
            </div>
        </aside>
    );
};
