import React from 'react';
import { CyberCard } from '../../../data/mockData';

interface TradeExecutionPanelProps {
    selectedCard: CyberCard | null;
    protocolFee: number;
    isProcessing: boolean;
    onConfirmBuy: () => void;
}

export const TradeExecutionPanel: React.FC<TradeExecutionPanelProps> = ({
    selectedCard,
    protocolFee,
    isProcessing,
    onConfirmBuy
}) => {
    // If no card is selected, show empty state
    if (!selectedCard) {
        return (
            <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6 opacity-50 pointer-events-none grayscale">
                <div className="terminal-border bg-surface/30 p-6 rounded-sm sticky top-24 h-[400px] flex items-center justify-center border-dashed border-primary/30">
                    <div className="text-center">
                        <span className="material-symbols-outlined text-4xl text-primary/20 mb-2">touch_app</span>
                        <p className="text-[10px] uppercase tracking-widest text-primary/40 font-bold">Select an Asset initiate trade</p>
                    </div>
                </div>
            </aside>
        )
    }

    const price = selectedCard.price || 0;
    const total = price + protocolFee;
    const usdPrice = total * 1.68; // Mock USD conversion rate

    return (
        <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="terminal-border bg-surface/30 p-6 rounded-sm sticky top-24">
                <div className="flex items-center gap-2 mb-6 border-b border-primary/20 pb-4">
                    <span className="material-symbols-outlined text-primary text-sm">settings_input_component</span>
                    <h2 className="text-primary text-sm font-bold tracking-[0.25em] uppercase">Trade Execution</h2>
                </div>
                <div className="flex flex-col gap-3 mb-8">
                    <div className="flex justify-between items-center py-2 border-b border-primary/5">
                        <span className="text-primary/50 text-[10px] font-bold uppercase tracking-widest">Asset</span>
                        <span className="text-white text-xs font-bold uppercase tracking-tighter">{selectedCard.name} <span className="text-primary/40">{selectedCard.id}</span></span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-primary/5">
                        <span className="text-primary/50 text-[10px] font-bold uppercase tracking-widest">Seller ID</span>
                        <span className="text-primary text-[10px] font-mono">0x4a2e...8f9d</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-primary/5">
                        <span className="text-primary/50 text-[10px] font-bold uppercase tracking-widest">Protocol Fee</span>
                        <span className="text-white text-[10px] font-bold tabular-nums">{protocolFee.toFixed(3)} SUI</span>
                    </div>
                    <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-sm">
                        <div className="flex justify-between items-end">
                            <span className="text-primary/70 text-[10px] font-bold uppercase tracking-widest">Total Settlement</span>
                            <div className="text-right">
                                <div className="text-xl font-bold text-primary cyan-glow tabular-nums">{total.toLocaleString('en-US', { minimumFractionDigits: 3 })} SUI</div>
                                <div className="text-[9px] text-primary/40 uppercase font-mono tracking-tighter">≈ ${usdPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })} USD</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onConfirmBuy}
                        disabled={isProcessing}
                        className={`w-full py-3 bg-primary text-background-dark text-xs font-black tracking-[0.4em] uppercase hover:bg-white transition-all rounded-sm shadow-[0_0_20px_rgba(0,255,255,0.3)] flex items-center justify-center gap-2 ${isProcessing ? 'opacity-80 cursor-wait' : ''}`}
                    >
                        {isProcessing && <span className="material-symbols-outlined text-sm animate-spin">refresh</span>}
                        {isProcessing ? 'Processing Transaction...' : 'Confirm Acquisition'}
                    </button>
                    <button className="w-full py-2 border border-primary/20 text-primary/40 text-[10px] font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all">
                        Abort Transaction
                    </button>
                </div>
                <div className="mt-8 flex items-start gap-3 p-3 bg-accent-magenta/5 border border-accent-magenta/10">
                    <span className="material-symbols-outlined text-accent-magenta text-sm">warning</span>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-accent-magenta uppercase tracking-widest">Network Alert</span>
                        <p className="text-[9px] text-accent-magenta/70 leading-relaxed mt-0.5 uppercase">MODERATE NETWORK CONGESTION. EXPECT 5-10S VALIDATION DELAY.</p>
                    </div>
                </div>
            </div>
            <div className="border border-white/10 bg-white/5 p-4 rounded-sm">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Live Feed</span>
                    </div>
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-tighter">Sync: OK</span>
                </div>
                <div className="space-y-2 font-mono">
                    <div className="flex justify-between text-[10px]">
                        <span className="text-primary/40">SALE: #1101_SHDW</span>
                        <span className="text-accent-magenta">1,200 SUI</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                        <span className="text-primary/40">LIST: #9903_SAMR</span>
                        <span className="text-primary">85 SUI</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};
