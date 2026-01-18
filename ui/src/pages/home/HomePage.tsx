import React from 'react';
import { MainLayout } from '../../layouts/MainLayout';

import { Footer } from '../../components/shared/Footer';
import { Sidebar } from './components/Sidebar';
import { ConstructionPedestal } from './components/ConstructionPedestal';
import { RightHUD } from './components/RightHUD';

export const HomePage: React.FC = () => {
    return (
        <MainLayout>
            {/* Game Title - Architectural/Background Element */}
            <div className="absolute top-0 w-full flex flex-col items-center justify-center pt-6 md:pt-10 z-0 pointer-events-none select-none">
                <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/10 tracking-[0.1em] font-display drop-shadow-[0_0_15px_rgba(0,229,255,0.3)] animate-[fadeInUp_1s_ease-out]">
                    THE INFINITE DECK
                </h1>
                <div className="flex items-center gap-4 text-primary/40 font-mono text-[10px] tracking-[0.3em] mt-2 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
                    <span className="w-12 h-px bg-gradient-to-r from-transparent to-primary/30"></span>

                    <span className="w-12 h-px bg-gradient-to-l from-transparent to-primary/30"></span>
                </div>
            </div>

            {/* Ambient Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.03)_0%,transparent_60%)]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
            </div>

            {/* Central Workspace */}
            <main className="flex-1 grid grid-cols-12 gap-2 md:gap-8 items-center overflow-y-auto lg:overflow-hidden relative z-10 scrollbar-hide">
                <Sidebar />
                <ConstructionPedestal />
                <RightHUD />
            </main>
            <Footer />
        </MainLayout>
    );
};
