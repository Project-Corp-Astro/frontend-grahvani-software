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
        <div className="fixed inset-0 z-[1000] bg-ink/70 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 md:p-8 pt-32 sm:pt-40 md:pt-56 lg:pt-30">
                <div
                    className={cn(
                        "relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-antique animate-in zoom-in-95 duration-200",
                        className
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 bg-white text-secondary hover:text-primary hover:bg-gold-primary transition-all rounded-full border border-antique shadow-sm z-50 ring-1 ring-black/5"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Content */}
                    <div className="p-0">
                        {children}
                    </div>
                </div>

                {/* Backdrop click to close */}
                <div className="absolute inset-0 -z-10" onClick={onClose} />
            </div>
        </div>
    );
};
