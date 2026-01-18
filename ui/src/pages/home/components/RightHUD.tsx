import React from 'react';

export const RightHUD: React.FC = () => {
    return (
        <aside className="col-span-12 lg:col-span-3 h-auto lg:h-full flex flex-col justify-start lg:justify-center gap-4 lg:gap-6 lg:tilt-right origin-right transition-transform order-3 lg:order-3">
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

            {/* Network Activity Panel */}
            <div className="glass-panel p-6 rounded-xl border border-white/5 relative overflow-hidden flex flex-col gap-3">
                <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] font-display">Network Traffic</h4>
                <div className="flex items-end gap-1 h-12 w-full">
                    {[30, 50, 20, 60, 40, 80, 50, 30, 70, 40, 60, 90, 50, 30, 60, 40].map((h, i) => (
                        <div key={i} className="flex-1 bg-primary/20 hover:bg-primary/50 transition-colors rounded-sm relative group" style={{ height: `${h}%` }}>
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary/50 group-hover:bg-primary"></div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-[8px] font-mono text-primary/50">
                    <span>UPLOAD: 4.2 MB/s</span>
                    <span>DOWNLOAD: 12.5 MB/s</span>
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
