import React, { useState, useEffect } from "react";
import { BackButton } from "../../components/shared/BackButton";
import { EventStream } from "../../components/duel/EventStream";
import { StatsPanel } from "../../components/duel/StatsPanel";
import { GameBoard } from "../../components/duel/GameBoard";
import { usePlayerProfile } from "../../hooks/usePlayerProfile";
import { useGame } from "../../hooks/useGame";
import { useCards } from "../../hooks/useCards";
import { useCurrentAccount } from "@mysten/dapp-kit";

import { GameOverScreen } from "../../components/duel/GameOverScreen";
import { Link } from "react-router-dom";

export const DuelPage: React.FC = () => {
  const account = useCurrentAccount();
  const { profile, loading, hasProfile, createProfile } = usePlayerProfile();

  // Default to first 5 cards if available, or empty
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([]);
  const { cards, fetchCards } = useCards();

  // Auto-select deck if profile loaded
  useEffect(() => {
    if (profile?.selectedDeck && profile.selectedDeck.length === 5) {
      setSelectedDeckIds(profile.selectedDeck);
      fetchCards(profile.selectedDeck);
    } else if (profile?.allCards && profile.allCards.length >= 5) {
      const defaultDeck = profile.allCards.slice(0, 5);
      setSelectedDeckIds(defaultDeck);
      fetchCards(defaultDeck);
    }
  }, [profile, fetchCards]);

  const {
    joinLobby,
    gameState,
    error,
    summonCard,
    surrender,
    gameOver,
    cancelMatchmaking,
  } = useGame(profile?.id || null, selectedDeckIds);

  const handCards = selectedDeckIds.map((id) => cards[id]).filter(Boolean);

  const handleCardClick = (cardId: string) => {
    // Only allow summon if in correct state
    if (gameState === "MATCH_FOUND") {
      summonCard(cardId);
    }
  };

  const handleReturnToLobby = () => {
    // For now, reloading or navigating away is the simplest way to reset local state
    // Ideally useGame should expose a reset function
    window.location.reload();
  };

  if (!account) {
    return (
      <div className="text-white flex items-center justify-center h-screen bg-background-dark">
        Please connect wallet
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-white flex items-center justify-center h-screen bg-background-dark">
        Loading profile...
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="text-white flex flex-col items-center justify-center h-screen bg-background-dark">
        <p className="mb-4">No Profile Found</p>
        <button
          onClick={() => createProfile("Player")}
          className="px-6 py-2 bg-primary text-black rounded hover:bg-primary/80"
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background-dark text-white overflow-hidden h-screen flex flex-col">
      <div className="absolute top-4 left-4 z-50">
        <BackButton />
      </div>

      {/* Surrender Button - Only show during battle */}
      {(gameState === "MATCH_FOUND" ||
        gameState === "PLAYING" ||
        gameState === "BATTLE_START") && (
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={surrender}
            className="px-4 py-2 bg-red-500/10 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest rounded-sm"
          >
            Surrender
          </button>
        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <GameOverScreen
          winner={gameOver.winner}
          isWinner={gameOver.isWinner}
          onReturnToLobby={handleReturnToLobby}
        />
      )}

      {/* Matchmaking Overlay */}
      {gameState === "IDLE" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="p-8 bg-zinc-900 border border-primary/30 rounded flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Ready to Battle?
            </h2>
            <p className="mb-6 text-gray-400">
              Selected Deck: {selectedDeckIds.length}/5 cards
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button
              onClick={() => joinLobby()}
              disabled={selectedDeckIds.length !== 5}
              className="px-8 py-3 bg-primary text-black font-bold rounded hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              FIND MATCH
            </button>
          </div>
        </div>
      )}

      {gameState === "QUEUING" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="flex flex-col items-center animate-pulse">
            <div className="text-4xl text-primary font-black tracking-widest mb-4">
              SEARCHING
            </div>
            <div className="text-sm text-primary/60">
              Scanning Neural Network...
            </div>
            <button
              className="mt-8 text-xs text-red-500 hover:text-red-400"
              onClick={() => cancelMatchmaking()}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 flex overflow-hidden relative justify-center">
        <div className="hidden xl:block h-full">
          <EventStream />
        </div>

        {/* Game Board Scaled for Mobile Landscape */}
        <div
          className={`flex-1 flex justify-center origin-center scale-[0.6] md:scale-[0.8] xl:scale-100 transition-transform h-full ${gameState === "IDLE" ? "blur-sm" : ""}`}
        >
          <GameBoard
            hand={handCards}
            onCardClick={handleCardClick}
            // For now passing null as we don't have battle state synced yet
            playerActiveCard={null}
            opponentActiveCard={false}
          />
        </div>

        <div className="hidden xl:block h-full">
          <StatsPanel />
        </div>
      </main>
    </div>
  );
};
