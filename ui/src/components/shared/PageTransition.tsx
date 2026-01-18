import React from 'react';

interface PageTransitionProps {
    children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    return (
        <div className="animate-[fadeInUp_0.5s_ease-out] w-full h-full">
            {children}
        </div>
    );
};
