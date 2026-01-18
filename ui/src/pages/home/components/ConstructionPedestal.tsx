import React, { useState } from 'react';
import { MOCK_HOME_DATA } from '../../../data/mockData';

export const ConstructionPedestal: React.FC = () => {
    const card = MOCK_HOME_DATA.activeConstruction;
    const [isBoosting, setIsBoosting] = useState(false);

    const handleBoost = () => {
        setIsBoosting(true);
        setTimeout(() => setIsBoosting(false), 2000); // Reset after 2s
    };

    return (
        <section className="col-span-6 relative flex flex-col items-center justify-center -mt-8 md:-mt-12 perspective-container scale-[0.6] md:scale-90 lg:scale-100 origin-center transition-transform duration-500">
            {/* Background Circle */}
            <div className={`absolute w-[50vh] h-[50vh] md:w-[600px] md:h-[600px] rounded-full border border-primary/10 pointer-events-none transition-all duration-1000 ${isBoosting ? 'animate-[spin_10s_linear_infinite] border-primary/30 shadow-[0_0_50px_rgba(0,229,255,0.2)]' : 'animate-[spin_60s_linear_infinite]'}`}></div>
            <div className={`absolute w-[40vh] h-[40vh] md:w-[450px] md:h-[450px] rounded-full border-2 border-dashed border-primary/20 pointer-events-none transition-all duration-1000 ${isBoosting ? 'animate-[spin_5s_linear_infinite_reverse] border-primary/50' : 'animate-[spin_40s_linear_infinite_reverse]'}`}></div>

            {/* Central Card */}
            <div className="relative z-10 w-[320px] h-[480px] bg-black/40 rounded-xl border border-primary/30 shadow-[0_0_50px_rgba(0,229,255,0.15)] flex flex-col p-4 backdrop-blur-sm group hover:scale-105 transition-transform duration-500 tilt-center">
                {/* Status Badge */}
                <div className="absolute -top-3 -right-3 z-30">
                    <div className="bg-primary text-background-dark font-black text-[10px] px-3 py-1 uppercase tracking-[0.2em] shadow-[0_0_10px_rgba(0,229,255,0.6)] animate-pulse">
                        {card.status}
                    </div>
                </div>

                {/* Card Image Area */}
                <div className="flex-1 bg-black/60 rounded-lg overflow-hidden relative mb-4 border border-white/5 group-hover:border-primary/50 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-50"></div>
                    <img src={card.image} alt={card.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />

                    {/* Laser Scanning Effect */}
                    <div className={`absolute top-0 left-0 w-full h-1 bg-primary/50 shadow-[0_0_15px_#00E5FF] ${isBoosting ? 'animate-[scan_0.5s_ease-in-out_infinite]' : 'animate-[scan_3s_ease-in-out_infinite]'}`}></div>
                </div>

                {/* Card Info */}
                <div className="space-y-2 relative">
                    <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{card.name}</h2>
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-1">
                            <span className="text-[8px] font-bold text-primary/60 uppercase tracking-widest">Structural Integrity</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className={`w-1.5 h-3 rounded-sm ${i > 7 ? 'bg-primary/20' : 'bg-primary shadow-[0_0_5px_#00E5FF]'}`}></div>
                                ))}
                            </div>
                        </div>
                        <span className="text-xl font-mono font-bold text-white">{card.stats.integrity}</span>
                    </div>
                    {/* Corner Brackets */}
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-primary/50"></div>
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary/50"></div>
                </div>
            </div>

            {/* Pedestal Base & Actions */}
            <div className="flex flex-col items-center gap-4 mt-8 relative z-20">
                <button
                    onClick={handleBoost}
                    disabled={isBoosting}
                    className={`
                        w-64 py-3 rounded-sm font-black tracking-[0.2em] uppercase transition-all duration-300 relative overflow-hidden group
                        ${isBoosting ? 'bg-primary text-background-dark scale-105 shadow-[0_0_30px_rgba(0,255,255,0.5)]' : 'bg-black/60 border border-primary text-primary hover:bg-primary hover:text-background-dark'}
                    `}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-lg">{isBoosting ? 'bolt' : 'speed'}</span>
                        {isBoosting ? 'BOOSTING...' : 'ACCELERATE PRINT'}
                    </span>
                    {/* Progress Bar Background */}
                    <div className="absolute inset-0 bg-primary/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                </button>
                <div className="text-[10px] text-primary/40 font-mono tracking-widest uppercase">
                    EST. COMPLETION: <span className="text-white">04:12:59</span>
                </div>
            </div>
        </section>
    );
};
