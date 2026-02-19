"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { NotebookPen, Save, Loader2, Tag, Plus } from 'lucide-react';

interface KpPredictionNotesProps {
    notes?: string;
    onSaveNotes?: (notes: string) => void;
    isSaving?: boolean;
    predictionCategories?: string[];
    className?: string;
}

const DEFAULT_CATEGORIES = ['Career', 'Marriage', 'Health', 'Finance', 'Education', 'Travel', 'Legal', 'Property'];

/**
 * KP Prediction Notes Panel
 * Astrologer's interpretation area with categories and save
 */
export default function KpPredictionNotes({
    notes: initialNotes = '',
    onSaveNotes,
    isSaving = false,
    predictionCategories = DEFAULT_CATEGORIES,
    className,
}: KpPredictionNotesProps) {
    const [notes, setNotes] = useState(initialNotes);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const toggleCategory = (cat: string) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const handleSave = () => {
        if (onSaveNotes) {
            onSaveNotes(notes);
        }
    };

    return (
        <div className={cn("bg-softwhite border border-antique rounded-2xl p-5", className)}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-serif text-primary flex items-center gap-2 font-semibold">
                    <div className="p-1.5 bg-parchment rounded-lg border border-antique">
                        <NotebookPen className="w-3.5 h-3.5 text-gold-dark" />
                    </div>
                    Prediction Notes
                </h3>
                {onSaveNotes && (
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-3 py-1.5 bg-gold-primary text-white rounded-lg text-xs font-semibold hover:bg-gold-dark transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                )}
            </div>

            {/* Category Tags */}
            <div className="mb-3">
                <p className="text-[9px] uppercase tracking-widest text-muted-refined font-bold mb-2 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Analysis Categories
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {predictionCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => toggleCategory(cat)}
                            className={cn(
                                "px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border",
                                selectedCategories.includes(cat)
                                    ? "bg-gold-primary/20 border-gold-primary/50 text-gold-dark"
                                    : "bg-parchment border-antique text-muted-refined hover:text-secondary hover:border-gold-primary/30"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notes Textarea */}
            <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Write your KP analysis, predictions, and interpretations here...

Example:
• Sub Lord of 7th cusp is Venus, signifying houses 2, 7, 11 → Marriage promised
• Current DBA: Saturn/Saturn/Mercury → Saturn signifies 7, 11 → favorable period
• Ruling planets: Venus, Saturn, Mercury → confirm timing in their sub periods"
                className="w-full h-48 bg-parchment border border-antique rounded-xl p-4 resize-none focus:outline-none focus:border-gold-primary/50 font-serif text-sm text-primary leading-relaxed placeholder:text-muted-refined/50 placeholder:text-xs"
            />

            {/* Auto-save indicator */}
            <p className="text-[9px] text-muted-refined mt-2 text-right">
                {selectedCategories.length > 0 && (
                    <span className="mr-2">
                        Tags: {selectedCategories.join(', ')}
                    </span>
                )}
                Last saved: —
            </p>
        </div>
    );
}
