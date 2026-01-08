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
                <label className="block text-[10px] font-bold font-serif text-[#9C7A2F] uppercase tracking-widest mb-1.5">
                    {label}
                </label>
            )}

            <div className="relative">
                <select
                    {...props}
                    className={`
                        w-full appearance-none bg-transparent 
                        border-b-2 border-[#DCC9A6] 
                        text-[#3E2A1F] font-serif text-lg tracking-wide
                        focus:outline-none focus:border-[#C9A24D]
                        transition-colors duration-300
                        pb-2 pl-2 pr-8 cursor-pointer
                    `}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                <ChevronDown className="absolute right-0 bottom-3 w-4 h-4 text-[#C9A24D] pointer-events-none" />

                {/* Bottom Glow */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A24D] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            </div>
        </div>
    );
}
