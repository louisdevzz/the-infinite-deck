import React from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { Header } from '../../components/shared/Header';
import { Footer } from '../../components/shared/Footer';
import { Sidebar } from './components/Sidebar';
import { ConstructionPedestal } from './components/ConstructionPedestal';
import { RightHUD } from './components/RightHUD';

export const HomePage: React.FC = () => {
    return (
        <MainLayout>
            <Header />
            {/* Central Workspace */}
            <main className="flex-1 grid grid-cols-12 gap-2 md:gap-8 items-center mt-2 md:mt-4 overflow-hidden relative">
                <Sidebar />
                <ConstructionPedestal />
                <RightHUD />
            </main>
            <Footer />
        </MainLayout>
    );
};
