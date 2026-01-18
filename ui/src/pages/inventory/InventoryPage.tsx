import React, { useState, useEffect } from "react";
import { BackButton } from "../../components/shared/BackButton";
import { CardDetailPanel } from "../../components/inventory/CardDetailPanel";
import { ActiveDeck } from "../../components/inventory/ActiveDeck";
import { Backpack } from "../../components/inventory/Backpack";
import { useToast } from "../../context/ToastContext";
import { PageTransition } from "../../components/shared/PageTransition";
import { usePlayerProfile } from "../../hooks/usePlayerProfile";
import { useCards } from "../../hooks/useCards";

export const InventoryPage: React.FC = () => {
  // Selection State
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Profile Hook
  const {
    profile,
    loading: profileLoading,
    selectBattleDeck,
    syncCards,
  } = usePlayerProfile();

  // Cards Hook
  const { cards, fetchCards } = useCards();

  // Deck State (5 slots)
  const [deck, setDeck] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);

  // Global Toast Hook
  const { showToast } = useToast();

  // Load backend data into local state
  useEffect(() => {
    if (profile) {
      // Fetch all cards mentioned in profile
      const allIds = [
        ...(profile.allCards || []),
        ...(profile.selectedDeck || []),
      ];
      if (allIds.length > 0) {
        fetchCards(allIds);
      }

      // Set deck from profile (ensure exactly 5 slots)
      if (profile.selectedDeck && profile.selectedDeck.length > 0) {
        const newDeck = [...profile.selectedDeck];
        while (newDeck.length < 5) newDeck.push(null as any);
        setDeck(newDeck);
      }
    }
  }, [profile, fetchCards]);

  console.log("deck", deck);

  const handleCardSelect = (id: string) => {
    setSelectedCardId(id);
  };

  const handleEquip = () => {
    if (!selectedCardId) return;

    // Check if card is already in deck
    if (deck.includes(selectedCardId)) return;

    // Find first empty slot
    const emptySlotIndex = deck.findIndex((slot) => slot === null);
    if (emptySlotIndex === -1) {
      showToast(
        "WARNING",
        "SYSTEM ALERT",
        "ACTIVE DECK IS FULL! REMOVE A NODE FIRST.",
      );
      return;
    }

    const newDeck = [...deck];
    newDeck[emptySlotIndex] = selectedCardId;
    setDeck(newDeck);

    showToast("SUCCESS", "SYSTEM UPDATE", `NODE EQUIPPED`);
  };

  const handleUnequip = () => {
    if (!selectedCardId) return;

    setDeck((prev) => prev.map((id) => (id === selectedCardId ? null : id)));
    showToast("INFO", "SYSTEM UPDATE", `NODE RETURNED TO STORAGE`);
  };

  const handleClearDeck = () => {
    setSelectedCardId(null);
    setDeck([null, null, null, null, null]);
    showToast("SUCCESS", "OPERATION COMPLETE", "ACTIVE DECK CLEARED.");
  };

  const handleSaveDeck = async () => {
    const validCards = deck.filter((id) => id !== null) as string[];
    if (validCards.length !== 5) {
      showToast("WARNING", "ERROR", "DECK MUST HAVE 5 CARDS");
      return;
    }
    try {
      await selectBattleDeck(validCards);
      showToast("SUCCESS", "SAVED", "BATTLE DECK UPDATED ON-CHAIN");
    } catch (e: any) {
      showToast("WARNING", "ERROR", e.message || "FAILED TO SAVE");
    }
  };

  const handleSync = async () => {
    try {
      showToast("INFO", "SYNCING", "SCANNING FOR NEW NODES...");
      await syncCards();
      showToast("SUCCESS", "SYNCED", "COLLECTION UPDATED");
    } catch (e: any) {
      showToast("WARNING", "ERROR", "SYNC FAILED: " + e.message);
    }
  };

  const selectedCardData = selectedCardId ? cards[selectedCardId] : null;

  // Determine if the selected card is currently equipped
  const isEquipped = selectedCardId ? deck.includes(selectedCardId) : false;

  // Backpack items are allCards excluding those in the current deck
  const backpackItems = (profile?.allCards || []).filter(
    (id: string) => !deck.includes(id),
  );

  return (
    <div className="bg-background-dark text-white overflow-hidden h-screen flex flex-col relative">
      <BackButton />

      {/* Top Right Controls */}
      <div className="absolute top-4 right-8 z-50 flex gap-4">
        <button
          onClick={handleSync}
          className="px-4 py-2 bg-zinc-800 text-primary border border-primary/30 rounded hover:bg-zinc-700 text-xs font-bold tracking-widest"
        >
          SYNC COLLECTION
        </button>
        <button
          onClick={handleSaveDeck}
          className="px-6 py-2 bg-primary text-black font-bold rounded hover:bg-primary/80 text-xs tracking-widest"
        >
          SAVE DECK
        </button>
      </div>

      <main className="flex-1 flex overflow-hidden">
        <PageTransition>
          <div className="flex w-full h-full">
            <CardDetailPanel
              selectedCard={selectedCardData}
              isEquipped={isEquipped}
              onEquip={handleEquip}
              onUnequip={handleUnequip}
            />
            <ActiveDeck
              deck={deck}
              cards={cards}
              selectedCardId={selectedCardId}
              onCardSelect={handleCardSelect}
              onClearDeck={handleClearDeck}
            />
            <Backpack
              items={backpackItems} // This expects string[]
              cards={cards}
              selectedCardId={selectedCardId}
              onCardSelect={handleCardSelect}
            />
          </div>
        </PageTransition>
      </main>
    </div>
  );
};
