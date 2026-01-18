import React from "react";
import { PageTransition } from "../shared/PageTransition";

interface GameOverScreenProps {
  winner: string;
  isWinner: boolean;
  onReturnToLobby: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  winner,
  isWinner,
  onReturnToLobby,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <PageTransition className="max-w-md w-full mx-4">
        <div
          className={`
                    relative overflow-hidden rounded-lg border-2 p-8 text-center
                    ${isWinner ? "border-primary bg-primary/10" : "border-red-500 bg-red-900/20"}
                `}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 z-0">
            <div
              className={`absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b ${isWinner ? "from-primary/20" : "from-red-500/20"} to-transparent`}
            />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Icon */}
            <div
              className={`
                            w-24 h-24 rounded-full flex items-center justify-center border-4 mb-2
                            ${isWinner ? "border-primary text-primary shadow-[0_0_30px_rgba(0,255,255,0.3)]" : "border-red-500 text-red-500"}
                        `}
            >
              <span className="material-symbols-outlined text-5xl">
                {isWinner ? "trophy" : "sentiment_very_dissatisfied"}
              </span>
            </div>

            {/* Title */}
            <div>
              <h2
                className={`text-4xl font-black uppercase tracking-widest mb-2 ${isWinner ? "text-white" : "text-red-100"}`}
              >
                {isWinner ? "VICTORY" : "DEFEAT"}
              </h2>
              <p className="text-xs font-mono uppercase tracking-widest opacity-60">
                {isWinner
                  ? "Enemy Protocol Eliminated"
                  : "System Critical Failure"}
              </p>
            </div>

            {/* Divider */}
            <div
              className={`w-16 h-1 ${isWinner ? "bg-primary" : "bg-red-500"}`}
            />

            {/* Rewards (Mock) */}
            <div className="w-full bg-black/40 rounded p-4 border border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 text-left">
                Battle Report
              </p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white/70">XP Gained</span>
                <span className="text-sm font-mono font-bold text-white">
                  {isWinner ? "+150" : "+25"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/70">Rating Change</span>
                <span
                  className={`text-sm font-mono font-bold ${isWinner ? "text-primary" : "text-red-400"}`}
                >
                  {isWinner ? "+24" : "-18"}
                </span>
              </div>
            </div>

            {/* Action Loop */}
            <button
              onClick={onReturnToLobby}
              className={`
                                w-full py-4 mt-2 font-black uppercase tracking-[0.2em] text-sm transition-all
                                hover:scale-105 active:scale-95
                                ${
                                  isWinner
                                    ? "bg-primary text-matrix-black hover:bg-primary-light hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                                }
                            `}
            >
              Return to Base
            </button>
          </div>
        </div>
      </PageTransition>
    </div>
  );
};
