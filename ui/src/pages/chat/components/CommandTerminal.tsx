import React, { useState, useRef, useEffect } from 'react';
import { SystemLog } from '../../../data/mockData';

interface CommandTerminalProps {
    logs: SystemLog[];
    onSendMessage: (message: string) => void;
    isTyping: boolean;
}

export const CommandTerminal: React.FC<CommandTerminalProps> = ({ logs, onSendMessage, isTyping }) => {
    const [input, setInput] = useState('');
    const logsEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom directly
    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, isTyping]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
                onSendMessage(input);
                setInput('');
            }
        }
    };

    const handleForgeClick = () => {
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <aside className="w-[400px] terminal-bg border-r border-white/10 flex flex-col p-6 relative">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">terminal</span>
                    <div>
                        <h3 className="text-white text-xs font-black tracking-widest uppercase">COMMAND TERMINAL</h3>
                        <p className="text-[8px] text-primary/40 font-mono uppercase">ENCRYPTED_SESSION_ID: 8842-XF</p>
                    </div>
                </div>
            </div>

            {/* Logs Area */}
            <div className="flex-1 font-mono text-[11px] text-primary/80 space-y-2 overflow-y-auto pr-2 scrollbar-hide">
                {logs.map((log, index) => (
                    <div key={index} className="flex gap-2">
                        <span className="text-white/20 shrink-0">{log.timestamp}</span>
                        <p className="break-words" dangerouslySetInnerHTML={{ __html: log.message.replace(/"([^"]+)"/g, '<span class="text-primary font-bold">"$1"</span>').replace(/\n/g, '<br/>') }}></p>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-2">
                        <span className="text-white/20 shrink-0">{new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
                        <span className="text-primary animate-pulse">System Identifying...</span>
                    </div>
                )}
                <div ref={logsEndRef} />
                <div className="w-2 h-4 bg-primary animate-pulse inline-block mt-2 shadow-[0_0_8px_#00E5FF]"></div>
            </div>

            {/* Input Area */}
            <div className="mt-8 space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">PROMPT INPUT</label>
                        <span className="text-[9px] font-mono text-white/20">TOKENS: {input.length}/1024</span>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full h-32 bg-black/40 border border-primary/20 p-3 text-xs font-mono text-primary/60 focus:border-primary focus:ring-0 resize-none outline-none transition-colors"
                        placeholder="Enter synthesis parameters or chat with AI... (Press Enter to Send)"
                    ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[8px] font-bold text-white/40 uppercase">MODEL VERSION</label>
                        <div className="bg-black/40 border border-primary/20 px-3 py-2 text-[10px] flex justify-between items-center text-primary/80 cursor-pointer hover:border-primary/50 transition-colors">
                            AETHER-ENGINE V4.2
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-bold text-white/40 uppercase">COMPLEXITY</label>
                        <div className="h-8 flex items-center cursor-pointer group">
                            <div className="w-full h-1 bg-white/10 relative rounded-full group-hover:bg-white/20 transition-colors">
                                <div className="absolute h-full w-[65%] bg-primary shadow-[0_0_8px_rgba(0,229,255,0.4)]"></div>
                                <div className="absolute h-3 w-3 bg-primary rounded-full top-1/2 -translate-y-1/2 left-[65%] shadow-[0_0_10px_#00E5FF] group-hover:scale-125 transition-transform"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleForgeClick}
                    className="w-full h-14 bg-primary text-matrix-black font-black tracking-[0.3em] uppercase flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transition-all cursor-pointer"
                >
                    <span className="material-symbols-outlined font-bold">bolt</span>
                    SEND COMMAND
                </button>
            </div>
        </aside>
    );
};
