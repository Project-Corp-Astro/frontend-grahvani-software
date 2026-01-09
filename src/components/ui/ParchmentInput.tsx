import React from 'react';
import { Search } from 'lucide-react';

interface ParchmentInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

export default function ParchmentInput({ className = '', icon, ...props }: ParchmentInputProps) {
    return (
        <div className={`relative group ${className}`}>
            {/* Input Element */}
            <input
                {...props}
                className={`
                    w-full h-full bg-transparent 
                    text-ink font-serif text-lg tracking-wide
                    placeholder-muted placeholder-opacity-70
                    focus:outline-none
                    transition-colors duration-300
                    pl-2 rounded-xl
                    ${icon ? 'pl-11' : ''}
                `}
            />

            {/* Icon */}
            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-dark group-focus-within:text-gold-primary transition-colors duration-300">
                    {icon}
                </div>
            )}

            {/* Bottom Glow on Focus */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A24D] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        </div>
    );
}
