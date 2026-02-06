import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className={cn(
                    "relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-antique animate-in zoom-in-95 duration-200",
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-antique/20">
                    <h2 className="text-xl font-serif font-bold text-ink">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-muted hover:text-ink hover:bg-parchment rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>

            {/* Backdrop click to close */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    );
};
