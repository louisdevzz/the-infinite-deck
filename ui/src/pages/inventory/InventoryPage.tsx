import React, { useState } from 'react';
import { Header } from '../../components/shared/Header';
import { Footer } from '../../components/shared/Footer';
import { CardDetailPanel } from '../../components/inventory/CardDetailPanel';
import { ActiveDeck } from '../../components/inventory/ActiveDeck';
import { Backpack } from '../../components/inventory/Backpack';
import { CARDS_DATA } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import { PageTransition } from '../../components/shared/PageTransition';

import { useUser } from '../../context/UserContext';

export const InventoryPage: React.FC = () => {
    // Selection State
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

    // Deck is an array of size 5, containing card IDs or null
    const [deck, setDeck] = useState<(string | null)[]>([null, null, null, null, null]);

    // Use Global Backpack State
    const { backpack, addToBackpack, removeFromBackpack } = useUser();

    // Global Toast Hook
    const { showToast } = useToast();

    const handleCardSelect = (id: string) => {
        setSelectedCardId(id);
    };

    const handleEquip = () => {
        if (!selectedCardId) return;

        // Check if card is already in deck (shouldn't be if triggered from backpack, but safe check)
        if (deck.includes(selectedCardId)) return;

        // Find first empty slot
        const emptySlotIndex = deck.findIndex(slot => slot === null);
        if (emptySlotIndex === -1) {
            showToast('WARNING', 'SYSTEM ALERT', "ACTIVE DECK IS FULL! REMOVE A NODE FIRST.");
            return;
        }

        const newDeck = [...deck];
        newDeck[emptySlotIndex] = selectedCardId;
        setDeck(newDeck);

        removeFromBackpack(selectedCardId);
        showToast('SUCCESS', 'SYSTEM UPDATE', `NODE EQUIPPED: ${selectedCardId}`);
    };

    const handleUnequip = () => {
        if (!selectedCardId) return;

        setDeck(prev => prev.map(id => id === selectedCardId ? null : id));
        addToBackpack(selectedCardId);
        showToast('INFO', 'SYSTEM UPDATE', `NODE RETURNED TO STORAGE: ${selectedCardId}`);
    };

    const handleClearDeck = () => {
        // Always clear selected view when clicking Clear All
        setSelectedCardId(null);

        // Get all cards currently in the deck
        const cardsToReturn = deck.filter((id): id is string => id !== null);

        if (cardsToReturn.length === 0) {
            showToast('INFO', 'SYSTEM MSG', "ACTIVE DECK IS ALREADY EMPTY.");
            return;
        }

        // Reset deck to all nulls
        setDeck([null, null, null, null, null]);

        // return cards to backpack
        cardsToReturn.forEach(id => addToBackpack(id));

        // Clear selected card view
        setSelectedCardId(null);

        showToast('SUCCESS', 'OPERATION COMPLETE', "ACTIVE DECK CLEARED. NODES RETURNED TO STORAGE.");
    };

    const selectedCardData = selectedCardId ? CARDS_DATA[selectedCardId] : null;

    // Determine if the selected card is currently equipped
    const isEquipped = selectedCardId ? deck.includes(selectedCardId) : false;

    return (
        <div className="bg-background-dark text-white overflow-hidden h-screen flex flex-col relative">
            <Header />
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
                            selectedCardId={selectedCardId}
                            onCardSelect={handleCardSelect}
                            onClearDeck={handleClearDeck}
                        />
                        <Backpack
                            items={backpack}
                            selectedCardId={selectedCardId}
                            onCardSelect={handleCardSelect}
                        />
                    </div>
                </PageTransition>
            </main>
            <Footer />
        </div>
    );
};
