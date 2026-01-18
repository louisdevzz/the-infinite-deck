import React from 'react';
import { Link } from 'react-router-dom';

export const Sidebar: React.FC = () => {
    return (
        <aside className="col-span-3 h-full flex flex-col justify-center gap-4 md:gap-6 tilt-left origin-left scale-[0.7] md:scale-100 transition-transform">
            <div className="glass-panel p-2 rounded-xl flex flex-col gap-2 overflow-hidden relative border border-white/5">
                {/* Decorative Side Bar */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 via-primary to-primary/50 glow-teal"></div>



                {/* Inactive Buttons */}
                <div className="flex flex-col gap-3">
                    {['Storefront', 'Inventory'].map((item, idx) => {
                        const icons = ['storefront', 'inventory_2'];
                        const routes = ['/market', '/inventory'];
                        return (
                            <Link to={routes[idx]} key={item} className="group flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 transition-all rounded-lg backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded bg-white/5 group-hover:bg-primary/20 transition-colors">
                                        <span className="material-symbols-outlined text-white/50 group-hover:text-primary transition-colors text-xl">{icons[idx]}</span>
                                    </div>
                                    <span className="text-sm font-bold tracking-widest text-white/70 uppercase group-hover:text-white transition-colors font-display">{item}</span>
                                </div>
                                <span className="material-symbols-outlined text-white/10 group-hover:text-primary/50 text-sm transform group-hover:translate-x-1 transition-all">chevron_right</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Play Button - Enhanced */}
            <Link to="/duel" className="relative group flex items-center justify-center gap-3 py-6 rounded-xl bg-primary text-background-dark font-black tracking-[0.2em] uppercase hover:brightness-110 transition-all glow-teal overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 transform skew-y-12"></div>
                <span className="material-symbols-outlined z-10">sports_esports</span>
                <span className="z-10 text-lg">GAME PLAY</span>
            </Link>
        </aside>
    );
};
