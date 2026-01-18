import React from 'react';
import { Link } from 'react-router-dom';

export const Sidebar: React.FC = () => {
    return (
        <aside className="col-span-3 h-full flex flex-col justify-center gap-4 md:gap-6 tilt-left origin-left scale-[0.7] md:scale-100 transition-transform">
            <div className="glass-panel p-2 rounded-xl flex flex-col gap-2 overflow-hidden relative border border-white/5">
                {/* Decorative Side Bar */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 via-primary to-primary/50 glow-teal"></div>

                {/* Active Button with specialized look */}
                <Link to="/duel" className="group relative flex items-center justify-between px-6 py-5 bg-gradient-to-r from-primary/20 to-transparent transition-all rounded-lg border border-primary/30">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform text-2xl">swords</span>
                        <span className="text-xl font-bold tracking-widest text-white uppercase group-hover:text-primary transition-colors font-display">Duel</span>
                    </div>
                    <span className="material-symbols-outlined text-primary/40 text-sm">chevron_right</span>
                </Link>

                {/* Inactive Buttons */}
                {['Storefront', 'Inventory', 'Profile'].map((item, idx) => {
                    const icons = ['storefront', 'inventory_2', 'account_circle'];
                    const routes = ['/market', '/inventory', '/profile'];
                    return (
                        <Link to={routes[idx]} key={item} className="group flex items-center justify-between px-6 py-5 hover:bg-white/5 transition-all rounded-lg border border-transparent hover:border-white/10">
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-white/50 group-hover:text-primary transition-colors text-2xl">{icons[idx]}</span>
                                <span className="text-xl font-bold tracking-widest text-white/50 uppercase group-hover:text-white transition-colors font-display">{item}</span>
                            </div>
                            <span className="material-symbols-outlined text-white/10 group-hover:text-white/30 text-sm">chevron_right</span>
                        </Link>
                    );
                })}
            </div>

            {/* Mission Button - Enhanced */}
            <Link to="/chat" className="relative group flex items-center justify-center gap-3 py-6 rounded-xl bg-primary text-background-dark font-black tracking-[0.2em] uppercase hover:brightness-110 transition-all glow-teal overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 transform skew-y-12"></div>
                <span className="material-symbols-outlined z-10">rocket_launch</span>
                <span className="z-10 text-lg">START MISSION</span>
            </Link>
        </aside>
    );
};
