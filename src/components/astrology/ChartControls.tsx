import React from 'react';
import { Eye, Settings } from 'lucide-react';
import ParchmentSelect from "@/components/ui/ParchmentSelect";
import GoldenButton from "@/components/GoldenButton";


export default function ChartControls() {
    return (
        <div className="space-y-6">
            <h3 className="font-serif text-[#9C7A2F] text-sm font-bold uppercase tracking-widest border-b border-[#E7D6B8] pb-2">
                Chart Controls
            </h3>

            {/* Ayanamsa Selection */}
            <div>
                <ParchmentSelect
                    label="Ayanamsa"
                    defaultValue="lahiri"
                    options={[
                        { value: 'lahiri', label: 'Lahiri (Chitrapaksha)' },
                        { value: 'raman', label: 'Raman' },
                        { value: 'kp', label: 'KP' },

                    ]}
                />
            </div>

            {/* Divisional Charts Select */}
            <div>
                <ParchmentSelect
                    label="Divisional Chart"
                    defaultValue="D1"
                    options={[
                        { value: 'D1', label: 'Rashi (D1)' },
                        { value: 'D2', label: 'Hora (D2)' },
                        { value: 'D3', label: 'Drekkana (D3)' },
                        { value: 'D4', label: 'Chaturthamsa (D4)' },
                        { value: 'D7', label: 'Saptamsa (D7)' },
                        { value: 'D9', label: 'Navamsa (D9)' },
                        { value: 'D10', label: 'Dasamsa (D10)' },
                        { value: 'D12', label: 'Dwadasamsa (D12)' },
                        { value: 'D16', label: 'Shodasamsa (D16)' },
                        { value: 'D20', label: 'Vimsamsa (D20)' },
                        { value: 'D24', label: 'Chaturvimsamsa (D24)' },
                        { value: 'D27', label: 'Saptavimsamsa (D27)' },
                        { value: 'D30', label: 'Trimsamsa (D30)' },
                        { value: 'D40', label: 'Khavedamsa (D40)' },
                        { value: 'D45', label: 'Akshavedamsa (D45)' },
                        { value: 'D60', label: 'Shashtiamsa (D60)' },
                    ]}
                />
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 border border-[#C9A24D] rounded bg-[#FEFAEA] group-hover:bg-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#9C7A2F]" />
                    </div>
                    <span className="text-sm font-serif text-[#3E2A1F]">Show Degrees</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 border border-[#C9A24D] rounded bg-[#FEFAEA] group-hover:bg-white flex items-center justify-center">
                        {/* Unchecked */}
                    </div>
                    <span className="text-sm font-serif text-[#7A5A43]">Show Arudhas</span>
                </label>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-[#E7D6B8] flex justify-center">
                <GoldenButton
                    topText="Generate"
                    bottomText="Chart"
                    className="w-full max-w-[220px]"
                />
            </div>

        </div>
    );
}
