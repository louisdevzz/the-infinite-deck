import React from 'react';
import { Header } from '../../components/shared/Header';
import { Footer } from '../../components/shared/Footer';
import { EventStream } from '../../components/duel/EventStream';
import { StatsPanel } from '../../components/duel/StatsPanel';
import { GameBoard } from '../../components/duel/GameBoard';

export const DuelPage: React.FC = () => {
    return (
        <div className="bg-background-dark text-white overflow-hidden h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex overflow-hidden relative justify-center">
                <div className="hidden xl:block h-full">
                    <EventStream />
                </div>

                {/* Game Board Scaled for Mobile Landscape */}
                <div className="flex-1 flex justify-center origin-center scale-[0.6] md:scale-[0.8] xl:scale-100 transition-transform h-full">
                    <GameBoard />
                </div>

                <div className="hidden xl:block h-full">
                    <StatsPanel />
                </div>
            </main>
            <Footer />
        </div>
    );
};
