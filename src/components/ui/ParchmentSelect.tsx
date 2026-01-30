import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ParchmentSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[];
}

export default function ParchmentSelect({ className = '', label, options, ...props }: ParchmentSelectProps) {
    return (
        <div className={`relative group ${className}`}>
            {label && (
                <label className="block text-[11px] font-bold font-serif text-[#6B4F1D] uppercase tracking-widest mb-1">
                    {label}
                </label>
            )}

            <div className="relative">
                <select
                    {...props}
                    className={`
                        w-full appearance-none bg-transparent 
                        border-b border-[#C9A24D]/50 
                        text-[#2A1810] font-serif text-base tracking-wide
                        focus:outline-none focus:border-[#9C7A2F]
                        transition-colors duration-300
                        py-2 pl-2 pr-8 cursor-pointer
                    `}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C7A2F] pointer-events-none" />

                {/* Bottom Glow */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A24D] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            </div>
        </div>
    );
}
