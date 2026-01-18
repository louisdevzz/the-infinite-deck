import React, { useState, useEffect } from 'react';
import { CyberCard, ElementType, RarityType } from '../../../../data/mockData';

// Generate Random Card (Reused from ChatPage)
const generateRandomCard = (): CyberCard => {
    const elements: ElementType[] = ['Light', 'Dark', 'Void', 'Neon'];
    const rarities: RarityType[] = ['Common', 'Rare', 'Legendary', 'Mythic'];
    const names = ['Quantum Breaker', 'Neon Samurai', 'Cyber Oracle', 'Void Stalker', 'Data Phantom'];
    const images = [
        "https://cdn.midjourney.com/7b44558e-0498-466d-8c4d-61922656917c/0_3.png",
        "https://cdn.midjourney.com/3c834645-037b-4026-9d29-07ace300e844/0_1.png",
        "https://cdn.midjourney.com/978287a3-e847-4933-9114-1e05d048d087/0_0.png",
        "https://cdn.midjourney.com/e29a8e0d-cd2a-43ec-8646-681b94236b28/0_0.png"
    ];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const power = Math.floor(Math.random() * 100);
    const integrity = Math.floor(Math.random() * 100);

    return {
        id: `GEN-${Math.floor(Math.random() * 9000) + 1000}`,
        name: randomName,
        title: randomName,
        type: "Construct",
        rarity: rarities[Math.floor(Math.random() * rarities.length)],
        element: elements[Math.floor(Math.random() * elements.length)],
        image: randomImage,
        img: randomImage,
        description: "A generated cyber construct from the void.",
        price: Math.floor(Math.random() * 500) + 50,
        status: 'READY',
        hp: integrity * 100,
        atk: power * 100,
        def: 5000,
        stats: {
            power: power,
            integrity: integrity * 100,
            stability: `${Math.floor(Math.random() * 1000)} T/s`
        },
        metadata: {
            origin: "AETHER_FORGE",
            weaponry: "N/A"
        }
    };
};

interface ForgeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onForgeComplete: (card: CyberCard) => void;
}

export const ForgeDialog: React.FC<ForgeDialogProps> = ({ isOpen, onClose, onForgeComplete }) => {
    const [prompt, setPrompt] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'FORGING' | 'COMPLETE'>('IDLE');
    const [progress, setProgress] = useState(0);

    // Reset when opened
    useEffect(() => {
        if (isOpen) {
            setStatus('IDLE');
            setPrompt('');
            setProgress(0);
        }
    }, [isOpen]);

    const handleForge = () => {
        if (!prompt.trim()) return;

        setStatus('FORGING');

        // Simulate forging progress
        let prog = 0;
        const interval = setInterval(() => {
            prog += 10;
            setProgress(prog);

            if (prog >= 100) {
                clearInterval(interval);
                setStatus('COMPLETE');
                const newCard = generateRandomCard();
                // Pass back the new card after a brief delay to show completion
                setTimeout(() => {
                    onForgeComplete(newCard); // Close and pass data
                }, 500);
            }
        }, 300);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm">
            <div className="w-full max-w-3xl min-h-[600px] bg-black/90 border border-primary/30 rounded-xl p-12 relative shadow-[0_0_50px_rgba(0,229,255,0.2)] overflow-hidden flex flex-col justify-center">

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
                    <span className="material-symbols-outlined">close</span>
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-3xl text-primary animate-pulse">rocket_launch</span>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-widest text-white">Neural Forge</h2>
                        <div className="h-0.5 w-full bg-gradient-to-r from-primary/50 to-transparent mt-1"></div>
                    </div>
                </div>

                {/* Content based on status */}
                {status === 'IDLE' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-primary/60 mb-2">Construction Parameters</label>
                            <div className="bg-transparent rounded-lg p-4 border border-primary/30 focus-within:border-primary/80 transition-colors">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe the entity you wish to synthesize..."
                                    className="w-full h-64 bg-transparent border-none appearance-none outline-none focus:outline-none focus:ring-0 text-lg font-mono text-white resize-none placeholder:text-white/20"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleForge}
                            disabled={!prompt.trim()}
                            className="w-full py-4 bg-primary text-background-dark font-black tracking-[0.2em] uppercase rounded hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">bolt</span>
                                Initialize Forge
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                        </button>
                    </div>
                )}

                {status === 'FORGING' && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-6">
                        <div className="relative size-32">
                            <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                            <div
                                className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"
                                style={{ clipPath: `inset(0 0 ${100 - progress}% 0)` }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-black text-primary">{progress}%</span>
                            </div>
                        </div>
                        <p className="text-primary/80 font-mono animate-pulse tracking-widest">SYNTHESIZING NEURAL PATTERNS...</p>

                        {/* Terminal output effect */}
                        <div className="w-full h-24 bg-black/50 rounded border border-white/5 p-2 font-mono text-[10px] text-green-500 overflow-hidden flex flex-col-reverse">
                            <div className="opacity-50"> &gt; Compiling physics engine...</div>
                            <div className="opacity-70"> &gt; Generating mesh geometry...</div>
                            <div> &gt; Allocating memory blocks...</div>
                        </div>
                    </div>
                )}

                {status === 'COMPLETE' && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <span className="material-symbols-outlined text-6xl text-primary mb-4 animate-[bounce_0.5s_ease-out]">check_circle</span>
                        <h3 className="text-2xl font-black text-white uppercase tracking-widest">Construction Complete</h3>
                    </div>
                )}

            </div>
        </div>
    );
};
