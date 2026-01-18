
import React, { useEffect, useState } from 'react';

/**
 * LandscapePrompt Component
 * 
 * Enforces landscape mode for mobile devices.
 * Displays a full-screen blocking overlay if the user is on a mobile device (width < 768px)
 * and is in Portrait orientation (height > width).
 */
export const LandscapePrompt: React.FC = () => {
    const [isWrongOrientation, setIsWrongOrientation] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            const isMobile = window.innerWidth <= 932; // Covers up to iPhone 14 Pro Max in landscape width or standard tablets portrait
            const isPortrait = window.innerHeight > window.innerWidth;

            // We want to block IF it's a mobile-sized device AND it's in portrait mode
            if (isMobile && isPortrait) {
                setIsWrongOrientation(true);
            } else {
                setIsWrongOrientation(false);
            }
        };

        // Initial check
        checkOrientation();

        // Listen for resize and orientation changes
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    if (!isWrongOrientation) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-background-dark flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,229,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 animate-pulse"></div>

            <div className="relative z-10 max-w-sm w-full mx-auto">
                <div className="mb-8 relative">
                    {/* Animated Phone Icon */}
                    <div className="w-24 h-40 border-2 border-primary/50 mx-auto rounded-2xl relative animate-[spin_3s_ease-in-out_infinite] shadow-[0_0_30px_rgba(0,229,255,0.2)]">
                        {/* Screen Inner */}
                        <div className="absolute inset-2 border border-primary/20 rounded-lg bg-primary/5"></div>
                        {/* Rotate Arrow */}
                        <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-primary animate-pulse">
                            screen_rotation
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold font-display tracking-widest text-primary animate-pulse">
                        SYSTEM LOCKED
                    </h2>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 my-4" />

                    <p className="text-gray-400 font-mono text-sm leading-relaxed">
                        // ERROR: ORIENTATION_INVALID<br />
                        // REQUIRED: LANDSCAPE_MODE<br />
                        <span className="text-xs opacity-60 mt-2 block">
                            To proceed with the simulation, please rotate your device to landscape mode.
                        </span>
                    </p>

                    <div className="pt-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 border border-red-500/30 bg-red-500/10 rounded text-red-400 text-xs font-mono">
                            <span className="material-symbols-outlined text-sm">lock</span>
                            ACCESS DENIED
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Corners */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-primary/30"></div>
            <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-primary/30"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-primary/30"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-primary/30"></div>
        </div>
    );
};
