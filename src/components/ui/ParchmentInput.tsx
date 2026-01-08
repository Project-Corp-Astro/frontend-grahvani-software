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
                    w-full bg-transparent 
                    border-b-2 border-[#DCC9A6] 
                    text-[#3E2A1F] font-serif text-lg tracking-wide
                    placeholder-[#7A5A43] placeholder-opacity-70
                    focus:outline-none focus:border-[#C9A24D]
                    transition-colors duration-300
                    pb-2 pl-2
                    ${icon ? 'pl-10' : ''}
                `}
            />

            {/* Icon */}
            {icon && (
                <div className="absolute left-0 bottom-3 text-[#C9A24D] group-focus-within:text-[#9C7A2F] transition-colors duration-300">
                    {icon}
                </div>
            )}

            {/* Bottom Glow on Focus */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A24D] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        </div>
    );
}
