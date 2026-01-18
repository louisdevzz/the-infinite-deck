import React from 'react';
import { Link } from 'react-router-dom';

export const BackButton: React.FC = () => {
    return (
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50">
            <Link
                to="/"
                className="group flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-black/40 border border-white/10 rounded-sm hover:border-primary/50 hover:bg-primary/5 transition-all backdrop-blur-sm"
            >
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/5 border border-white/10 group-hover:border-primary group-hover:bg-primary/20 transition-all">
                    <span className="material-symbols-outlined text-white/60 group-hover:text-primary transition-colors text-[14px]">arrow_back</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[8px] text-white/30 uppercase tracking-widest leading-none mb-0.5 group-hover:text-primary/70">System</span>
                    <span className="text-[10px] font-bold tracking-widest text-white/80 group-hover:text-white uppercase transition-colors leading-none">Return Home</span>
                </div>
            </Link>
        </div>
    );
};
