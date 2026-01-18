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
                    <span>NEURAL_LINK ESTABLISHED</span>
                    <span className="w-12 h-px bg-gradient-to-l from-transparent to-primary/30"></span>
                </div>
            </div>

            {/* Central Workspace */}
            <main className="flex-1 grid grid-cols-12 gap-2 md:gap-8 items-center overflow-hidden relative z-10">
                <Sidebar />
                <ConstructionPedestal />
                <RightHUD />
            </main>
            <Footer />
        </MainLayout>
    );
};
