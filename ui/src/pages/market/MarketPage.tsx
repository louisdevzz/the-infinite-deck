
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from '../../components/shared/Header';
import { Footer } from '../../components/shared/Footer';
import { MarketStatsBar, ViewMode, ElementType, RarityType } from './components/MarketStatsBar';
import { MarketListings } from './components/MarketListings';
import { TradeExecutionPanel } from './components/TradeExecutionPanel';
import { TransactionSuccessModal } from './components/TransactionSuccessModal';
import { MarketSkeleton } from './components/MarketSkeleton';
import { PageTransition } from '../../components/shared/PageTransition';
import { MOCK_MARKET_DATA, CyberCard } from '../../data/mockData';

import { useUser } from '../../context/UserContext';

export const MarketPage: React.FC = () => {
    // Data & Selection State
    const { userBalance, deductBalance, backpack, addToBackpack } = useUser();

    // Data & Selection State - Sync with Backpack
    const [listings, setListings] = useState<CyberCard[]>(() => {
        return MOCK_MARKET_DATA.listings.map(item => ({
            ...item,
            status: backpack.includes(item.id) ? 'SOLD' : item.status
        }));
    });
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successCard, setSuccessCard] = useState<CyberCard | null>(null);

    // Loading State
    const [isLoading, setIsLoading] = useState(true);

    // Filter & Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [activeView, setActiveView] = useState<ViewMode>('FEED');
    const [filterElement, setFilterElement] = useState<ElementType>('ALL');
    const [filterRarity, setFilterRarity] = useState<RarityType>('ALL');

    // Simulate Network Fetch
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Find the full card object based on the selected ID
    const selectedCard = listings.find(l => l.id === selectedCardId) || null;

    // --- Logic: Filtering ---
    const filteredListings = useMemo(() => {
        return listings.filter(item => {
            // 1. Search Filter
            const searchMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id.toLowerCase().includes(searchTerm.toLowerCase());
            if (!searchMatch) return false;

            // 2. View Mode Filter (Simple Mock: "My Listings" shows only bought items?)
            // For now, let's say "My Listings" are items where status is NOT 'ON_SALE' just as a demo
            if (activeView === 'MY_LISTINGS' && item.status === 'ON_SALE') return false;
            if (activeView === 'FEED' && item.status !== 'ON_SALE') return false;

            // 3. Element Filter
            if (filterElement !== 'ALL' && item.element !== filterElement) return false;

            // 4. Rarity Filter
            if (filterRarity !== 'ALL' && item.rarity !== filterRarity) return false;

            return true;
        });
    }, [listings, searchTerm, activeView, filterElement, filterRarity]);

    // --- Handlers ---

    const handleSelectCard = (card: CyberCard) => {
        setSelectedCardId(card.id);
    };

    const handleFilterChange = (type: 'ELEMENT' | 'RARITY', value: string) => {
        if (type === 'ELEMENT') setFilterElement(value as ElementType);
        if (type === 'RARITY') setFilterRarity(value as RarityType);
    };

    const handleBuyCard = () => {
        if (!selectedCardId || !selectedCard) return;

        // Check Balance
        const totalCost = (selectedCard.price || 0) + 0.002;
        if (userBalance < totalCost) {
            alert("INSUFFICIENT FUNDS"); // Adding a simple alert for now, could be a modal too
            return;
        }

        setIsProcessing(true);

        // Simulate network delay
        setTimeout(() => {
            // Deduct Balance
            deductBalance(totalCost);

            // Add to Inventory
            if (selectedCardId) {
                addToBackpack(selectedCardId);
            }

            // Update Listing Status
            setListings(prev => prev.map(item => {
                if (item.id === selectedCardId) {
                    return { ...item, status: "SOLD" };
                }
                return item;
            }));

            // Show Success
            setSuccessCard(selectedCard);
            setShowSuccessModal(true);

            setIsProcessing(false);
            setSelectedCardId(null);
        }, 2000);
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        setSuccessCard(null);
    };

    return (
        <div className="bg-background-dark font-display text-white selection:bg-primary/30 min-h-screen flex flex-col relative">
            {showSuccessModal && successCard && (
                <TransactionSuccessModal
                    card={successCard}
                    onClose={handleCloseSuccessModal}
                />
            )}

            <Header />

            <main className="flex-1 flex flex-col px-6 lg:px-12 py-6 max-w-[1600px] mx-auto w-full">
                <MarketStatsBar
                    activeView={activeView}
                    filterElement={filterElement}
                    filterRarity={filterRarity}
                    onViewChange={setActiveView}
                    onFilterChange={handleFilterChange}
                    onSearchChange={setSearchTerm}
                />
                <PageTransition>
                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-12 lg:col-span-8">
                            {isLoading ? (
                                <MarketSkeleton />
                            ) : (
                                <>
                                    <MarketListings
                                        listings={filteredListings}
                                        selectedCardId={selectedCardId}
                                        onSelectCard={handleSelectCard}
                                    />
                                    {filteredListings.length === 0 && (
                                        <div className="text-center py-20 opacity-40">
                                            <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                                            <p className="uppercase tracking-widest text-xs">No Assets Found</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <TradeExecutionPanel
                            selectedCard={selectedCard}
                            protocolFee={0.002}
                            isProcessing={isProcessing}
                            onConfirmBuy={handleBuyCard}
                        />
                    </div>
                </PageTransition>
            </main>
            <Footer />
        </div>
    );
};
