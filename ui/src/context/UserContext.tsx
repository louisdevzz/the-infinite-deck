import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_USER } from '../data/mockData';

interface UserContextType {
    userBalance: number;
    backpack: string[]; // List of Card IDs
    addToBackpack: (cardId: string) => void;
    removeFromBackpack: (cardId: string) => void;
    deductBalance: (amount: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize with mock data values
    const [userBalance, setUserBalance] = useState<number>(MOCK_USER.currency.sui);

    // Default starting inventory
    const [backpack, setBackpack] = useState<string[]>(['PULSE_LANCER', 'D_SYNC', 'ROOTKIT', 'LOGIC_B', 'SHREDDER', 'VOID_EYE']);

    const addToBackpack = (cardId: string) => {
        setBackpack(prev => [...prev, cardId]);
    };

    const removeFromBackpack = (cardId: string) => {
        setBackpack(prev => {
            const index = prev.indexOf(cardId);
            if (index > -1) {
                const newBackpack = [...prev];
                newBackpack.splice(index, 1);
                return newBackpack;
            }
            return prev;
        });
    };

    const deductBalance = (amount: number) => {
        setUserBalance(prev => Math.max(0, prev - amount));
    };

    return (
        <UserContext.Provider value={{ userBalance, backpack, addToBackpack, removeFromBackpack, deductBalance }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
