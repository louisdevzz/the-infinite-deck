import React, { useEffect, useState } from 'react';
import { CyberCard } from '../../../data/mockData';

interface TransactionSuccessModalProps {
    card: CyberCard;
    onClose: () => void;
}

export const TransactionSuccessModal: React.FC<TransactionSuccessModalProps> = ({ card, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for exit animation
    };

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}></div>

            {/* Modal Content */}
            <div className={`relative w-full max-w-md bg-background-dark border border-primary p-1 transition-transform duration-500 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}>
                {/* Holographic Border Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-50 blur-sm animate-pulse pointer-events-none"></div>

                <div className="relative bg-background-dark border border-primary/20 p-8 flex flex-col items-center text-center overflow-hidden">
                    {/* Background Grid */}
                    <div className="absolute inset-0 grid grid-cols-[1fr_1fr] bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                    {/* Success Icon */}
                    <div className="mb-6 relative">
                        <div className="size-20 rounded-full border-2 border-primary flex items-center justify-center animate-[spin_3s_linear_infinite_reverse]">
                            <div className="size-16 rounded-full border border-primary/50 border-dashed animate-[spin_10s_linear_infinite]"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-primary animate-[bounce_1s_infinite]">check_circle</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-1 relative z-10 text-cyan-glow">Acquisition Successful</h2>
                    <p className="text-[10px] text-primary/60 font-mono uppercase tracking-widest mb-8 relative z-10">Transaction Hash: 0x8a2...9f4b</p>

                    {/* Card Preview */}
                    <div className="relative w-48 aspect-[3/4] mb-8 group perspective-container">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-50 animate-pulse"></div>
                        <img
                            src={card.image}
                            alt={card.name}
                            className="w-full h-full object-cover rounded border border-primary/50 shadow-[0_0_30px_rgba(0,229,255,0.3)] relative z-10 transform transition-transform animate-[float_4s_ease-in-out_infinite]"
                        />
                        <div className="absolute bottom-2 left-0 right-0 z-20 text-center">
                            <span className="bg-black/80 backdrop-blur border border-primary/30 text-primary text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-full">{card.name}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-full py-3 bg-primary text-background-dark font-black tracking-[0.2em] uppercase hover:bg-white transition-all rounded-sm relative z-10 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]"
                    >
                        Confirm Receipt
                    </button>
                </div>

                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-primary"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-primary"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-primary"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-primary"></div>
            </div>
        </div>
    );
};
