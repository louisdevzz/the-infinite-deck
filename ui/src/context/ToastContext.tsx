import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

type ToastType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

interface ToastMessage {
    id: string;
    type: ToastType;
    title: string;
    message: string;
}

interface ToastContextBounds {
    showToast: (type: ToastType, title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextBounds | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const toastIdCounter = useRef(0);

    const showToast = useCallback((type: ToastType, title: string, message: string) => {
        const id = `toast-${Date.now()}-${toastIdCounter.current++}`;
        const newToast: ToastMessage = { id, type, title, message };

        setToasts((prev) => [...prev, newToast]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const getToastStyles = (type: ToastType) => {
        switch (type) {
            case 'SUCCESS':
                return 'border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]';
            case 'WARNING':
                return 'border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]';
            case 'ERROR':
                return 'border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
            default: // INFO
                return 'border-primary text-primary shadow-[0_0_15px_rgba(0,229,255,0.3)]';
        }
    };

    const getToastIcon = (type: ToastType) => {
        switch (type) {
            case 'SUCCESS': return 'check_circle';
            case 'WARNING': return 'warning';
            case 'ERROR': return 'error';
            default: return 'info';
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-4 w-full max-w-md px-4 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`bg-matrix-black/90 backdrop-blur-md border px-6 py-4 flex items-center gap-4 animate-[fadeInUp_0.3s_ease-out] pointer-events-auto ${getToastStyles(toast.type)}`}
                    >
                        <span className="material-symbols-outlined text-2xl animate-pulse">{getToastIcon(toast.type)}</span>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{toast.title}</span>
                            <span className="text-sm font-bold uppercase tracking-widest">{toast.message}</span>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
