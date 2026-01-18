import React from 'react';
import { CyberCard } from '../../../data/mockData';

interface ForgeDisplayProps {
    activeCard: CyberCard | null;
    isForging: boolean;
}

export const ForgeDisplay: React.FC<ForgeDisplayProps> = ({ activeCard, isForging }) => {
    return (
        <section className="flex-1 flex items-center justify-center p-12 relative overflow-hidden bg-black/20 perspective-container">
            {/* Background Grid & Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

            <div className={`relative group z-10 transition-all duration-500 ${isForging ? 'scale-[0.98] opacity-80' : 'hover:scale-[1.02]'}`}>

                {/* Forging Overlay Effect */}
                {isForging && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm border border-primary/50 animate-pulse">
                        <div className="size-16 rounded-full border-2 border-t-primary border-r-primary border-b-transparent border-l-transparent animate-spin mb-4"></div>
                        <p className="text-primary font-black tracking-[0.3em] uppercase animate-pulse">Synthesizing...</p>
                        <p className="text-[10px] text-primary/60 font-mono mt-2">PROCESSING NEURAL DATA</p>
                    </div>
                )}

                {/* Empty / Idle State */}
                {!activeCard && !isForging && (
                    <div className="card-frame w-[360px] h-[480px] p-8 flex flex-col items-center justify-center bg-black/90 relative">
                        <div className="size-24 rounded-full border border-white/10 flex items-center justify-center mb-6 bg-white/5 animate-pulse">
                            <span className="material-symbols-outlined text-4xl text-white/20">memory</span>
                        </div>
                        <h2 className="text-xl font-black text-white/40 uppercase tracking-widest mb-2">System Idle</h2>
                        <p className="text-[10px] text-white/20 font-mono text-center max-w-[200px]">
                            AWAITING INPUT SEQUENCE...<br />
                            INITIATE PROTOCOL VIA TERMINAL
                        </p>
                        {/* Decor elements */}
                        <div className="absolute top-4 left-4 w-2 h-2 bg-white/10"></div>
                        <div className="absolute top-4 right-4 w-2 h-2 bg-white/10"></div>
                        <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/10"></div>
                        <div className="absolute bottom-4 right-4 w-2 h-2 bg-white/10"></div>
                    </div>
                )}

                {/* Active Card Display */}
                {activeCard && (
                    <div className={`card-frame w-[360px] h-[480px] p-4 flex flex-col group-hover:shadow-[0_0_40px_rgba(0,229,255,0.3)] transition-all duration-500 bg-black/90 relative ${isForging ? 'animate-[glitch-anim-1_0.2s_infinite_linear_alternate-reverse]' : ''}`}>
                        {/* Scanning Laser Line (Active when Forging) */}
                        {isForging && (
                            <div className="absolute left-0 w-full h-1 bg-primary z-50 shadow-[0_0_15px_#00E5FF] animate-[scan_1.5s_linear_infinite]"></div>
                        )}

                        <div className="flex-1 overflow-hidden relative rounded-sm group-hover:border-primary/30 border border-transparent transition-colors">
                            {/* Image Layer with Reveal Animation */}
                            <img
                                key={activeCard.id} // Trigger animation on new card
                                alt={activeCard.name}
                                className={`w-full h-full object-cover transition-transform duration-700 ${isForging ? 'opacity-20 grayscale scale-95' : 'opacity-100 group-hover:scale-110 animate-[revealTopBottom_1.5s_cubic-bezier(0.4,0,0.2,1)_forwards]'}`}
                                src={activeCard.image}
                            />

                            {/* Holographic Wireframe Overlay (When Forging) */}
                            {isForging && (
                                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,229,255,0.1)_50%)] bg-[size:100%_4px] animate-pulse pointer-events-none"></div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1015] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

                            {/* Status Badges */}
                            <div className={`absolute top-4 right-4 flex gap-2 items-center transition-opacity duration-1000 ${isForging ? 'opacity-0' : 'opacity-100'}`}>
                                <div className="bg-primary/20 border border-primary/40 px-2 py-1 backdrop-blur-md shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                                    <span className="text-[10px] font-black text-primary tracking-tighter uppercase animate-[decode-fade-in_0.5s_ease-out_0.5s_both]">{activeCard.rarity}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-bold text-white/40 leading-none">LVL {activeCard.stats.power}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 space-y-3 relative">
                            {/* Scanning Effect line over text on hover */}
                            {!isForging && <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/30 opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_linear_infinite]"></div>}

                            <h2 className="text-2xl font-black italic text-white tracking-tighter uppercase italic drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]">
                                {isForging ? <span className="animate-pulse bg-primary/20 text-transparent rounded">LOADING_NAME</span> : <span className="animate-[decode-fade-in_0.5s_ease-out_both]">{`ARCHETYPE: ${activeCard.name}`}</span>}
                            </h2>

                            <div className="space-y-1.5 font-mono text-[10px] text-primary/60">
                                <div className="flex items-center gap-2">
                                    <span>// CORE STABILITY:</span>
                                    <span className="text-white animate-[decode-fade-in_0.5s_ease-out_0.2s_both]">{isForging ? '???' : activeCard.stats.stability}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xs">swords</span>
                                    <span>WEAPONRY:</span>
                                    <span className="text-white animate-[decode-fade-in_0.5s_ease-out_0.3s_both]">{isForging ? 'CALCULATING...' : activeCard.metadata?.weaponry}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xs">database</span>
                                    <span>ORIGIN:</span>
                                    <span className="text-white uppercase animate-[decode-fade-in_0.5s_ease-out_0.4s_both]">{isForging ? 'UNKNOWN' : activeCard.metadata?.origin}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end pt-2 border-t border-primary/10">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[7px] font-bold text-primary/40 uppercase tracking-widest">Output Hash</span>
                                    <span className="text-[9px] font-mono text-primary/80">{isForging ? 'Generating...' : `0x${activeCard.id.split('-')[1]}...`}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[7px] font-bold text-white/30 uppercase tracking-[0.2em]">Integrity</span>
                                    <p className="text-lg font-black text-white leading-none text-cyan-glow animate-[decode-fade-in_0.5s_ease-out_0.6s_both]">{isForging ? '---' : activeCard.stats.integrity.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* Corner Markers - Enhanced Glow */}
                <div className="absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-primary/40 pointer-events-none group-hover:border-primary group-hover:shadow-[0_0_15px_#00E5FF] transition-all duration-300"></div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-primary/40 pointer-events-none group-hover:border-primary group-hover:shadow-[0_0_15px_#00E5FF] transition-all duration-300"></div>
            </div>

            <div className="absolute right-12 top-1/2 -translate-y-1/2 space-y-6 hidden 2xl:block">
                <div className="border border-white/5 bg-black/40 p-4 rounded-sm w-48">
                    <p className="text-[8px] font-bold text-white/40 mb-3 tracking-widest uppercase">Core Telemetry</p>
                    <div className="space-y-2 text-[10px]">
                        <div className="flex justify-between">
                            <span className="text-white/60">Server Latency</span>
                            <span className="text-primary font-mono">14ms</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Player Density</span>
                            <span className="text-primary">OPTIMAL</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Construction Queue</span>
                            <span className="text-secondary font-bold">3 ACTIVE</span>
                        </div>
                    </div>
                </div>
                <div className="border border-secondary/20 bg-black/40 p-4 rounded-sm w-48 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-secondary"></div>
                    <div className="absolute top-0 right-0 bg-secondary text-white text-[7px] px-1.5 py-0.5 font-bold uppercase">Limited Time</div>
                    <div className="flex flex-col items-center py-2 text-center">
                        <span className="material-symbols-outlined text-secondary text-2xl mb-2">auto_awesome</span>
                        <p className="text-[10px] font-black text-white uppercase tracking-wider">Neon Overdrive</p>
                        <p className="text-[8px] text-white/40 mt-1">Special boosters available in shop for limited time.</p>
                        <button className="mt-3 w-full py-1.5 border border-secondary/40 text-[9px] font-black text-secondary hover:bg-secondary/10 transition-colors uppercase cursor-pointer">View Details</button>
                    </div>
                </div>
            </div>
        </section>
    );
};
