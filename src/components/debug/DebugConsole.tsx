"use client";

import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { cn } from "@/lib/utils";

interface DebugConsoleProps {
    title: string;
    data: any;
    className?: string;
}

export default function DebugConsole({ title, data, className }: DebugConsoleProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!data) return null;

    return (
        <div className={cn("mt-8 border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50 shadow-sm", className)}>
            <div
                className="flex items-center justify-between p-3 bg-zinc-100 cursor-pointer hover:bg-zinc-200 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-zinc-600" />
                    <span className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-tight">
                        Debug: {title}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCopy();
                        }}
                        className="p-1 hover:bg-zinc-300 rounded transition-colors"
                        title="Copy JSON"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
                    </button>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                </div>
            </div>

            {isOpen && (
                <div className="p-4 bg-zinc-950 max-h-[400px] overflow-auto">
                    <pre className="text-[10px] leading-tight font-mono text-emerald-400">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
