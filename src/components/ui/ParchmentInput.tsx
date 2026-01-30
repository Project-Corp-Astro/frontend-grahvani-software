import React from 'react';

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
                    text-[#2A1810] font-serif text-base tracking-wide
                    placeholder:text-[#8B6914] placeholder:opacity-80
                    focus:outline-none
                    transition-colors duration-300
                    py-2 rounded-xl border-b border-[#C9A24D]/50 focus:border-[#9C7A2F]
                    ${icon ? 'pl-10' : 'pl-2'}
                `}
            />

            {/* Icon */}
            {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9C7A2F] group-focus-within:text-[#8B6914] transition-colors duration-300">
                    {icon}
                </div>
            )}

            {/* Bottom Glow on Focus */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A24D] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        </div>
    );
}
