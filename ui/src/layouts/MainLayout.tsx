import React from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="bg-background-dark text-white select-none h-screen w-full relative overflow-hidden">
            {/* Background Data Well Effect */}
            {/* Background Data Well Effect */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="data-well"></div>
                {/* Scanline is now global and handles its own size, but we keep the container here if needed */}
                <div className="scanline"></div>
            </div>

            {/* Main Layout Container */}
            <div className="relative flex h-screen w-full flex-col overflow-hidden p-6 perspective-container">
                {children}
            </div>

            {/* Screen Edge Decor / Obsidian Frame elements */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
            <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

            {/* Subtle Corner Scratches (Diegetic UI) */}
            <div className="fixed bottom-4 left-4 text-[10px] font-mono text-white/10 uppercase tracking-widest pointer-events-none">
                [ HUD_VER_4.2.0 ] [ AUTH_OK ] [ LOC: BRIDGE_MAIN ]
            </div>
        </div>
    );
};
