import React, { useState } from 'react';
// Chat Interface built with Shared Components
import { Header } from '../../components/shared/Header';
import { Footer } from '../../components/shared/Footer';
import { CommandTerminal } from './components/CommandTerminal';
import { ForgeDisplay } from './components/ForgeDisplay';
import { MOCK_FORGE_DATA, SystemLog, CyberCard, ElementType, RarityType } from '../../data/mockData';

export const ChatPage: React.FC = () => {
    const [logs, setLogs] = useState<SystemLog[]>(MOCK_FORGE_DATA.logs);
    const [isTyping, setIsTyping] = useState(false);
    const [isForging, setIsForging] = useState(false);
    const [activeCard, setActiveCard] = useState<CyberCard | null>(null);

    // Mock Card Generator
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
            status: 'ON_SALE',
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

    const handleSendMessage = (message: string) => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });

        // Add User Message
        const userLog: SystemLog = {
            timestamp,
            message: `USER_CMD: "${message}"`
        };
        setLogs(prev => [...prev, userLog]);
        setIsTyping(true);
        setIsForging(true); // Start Forging Effect

        // Simulate AI Response & Forging Process
        setTimeout(() => {
            const newCard = generateRandomCard();

            const aiLog: SystemLog = {
                timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
                message: `SYSTEM_RESPONSE: Entity synthesized successfully. ID: ${newCard.id}.`
            };

            setLogs(prev => [...prev, aiLog]);
            setActiveCard(newCard); // Update Card Display
            setIsForging(false); // Stop Forging Effect
            setIsTyping(false);
        }, 2000);
    };

    return (
        <div className="bg-background-dark text-white overflow-hidden h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex overflow-hidden">
                <CommandTerminal
                    logs={logs}
                    onSendMessage={handleSendMessage}
                    isTyping={isTyping}
                />
                <ForgeDisplay
                    activeCard={activeCard}
                    isForging={isForging}
                />
            </main>
            <Footer />
        </div>
    );
};
