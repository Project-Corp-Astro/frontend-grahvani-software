import React from 'react';
import { Eye, Settings } from 'lucide-react';
import ParchmentSelect from "@/components/ui/ParchmentSelect";
import GoldenButton from "@/components/GoldenButton";
import { useAstrologerSettings } from "@/context/AstrologerSettingsContext";
import { ChevronDown, Info } from 'lucide-react';


export default function ChartControls() {
    const { settings, updateAyanamsa } = useAstrologerSettings();
    const [showAdvanced, setShowAdvanced] = React.useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#E7D6B8] pb-2">
                <h3 className="font-serif text-[#9C7A2F] text-sm font-bold uppercase tracking-widest">
                    Chart Configuration
                </h3>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#FFD27D]/20 rounded-full border border-[#FFD27D]/30">
                    <span className="text-[10px] text-[#9C7A2F] font-serif font-bold uppercase tracking-tighter">{settings.ayanamsa}</span>
                </div>
            </div>

            {/* Ayanamsa Info / Toggle */}
            <div className="bg-[#FAF5E6] border border-[#E7D6B8] rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E7D6B8] flex items-center justify-center">
                        <Info className="w-4 h-4 text-[#9C7A2F]" />
                    </div>
                    <div>
                        <p className="text-[9px] text-[#7A5A43] uppercase tracking-widest font-bold">Current Ayanamsa</p>
                        <p className="text-xs font-serif text-[#3E2A1F] font-bold">{settings.ayanamsa} (Default)</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-[10px] text-[#9C7A2F] font-bold uppercase hover:underline"
                >
                    {showAdvanced ? "Hide" : "Change"}
                </button>
            </div>

            {/* Advanced Settings (Hidden by default) */}
            {showAdvanced && (
                <div className="bg-[#FEFAEA] border border-[#D08C60]/30 rounded-xl p-4 animate-in slide-in-from-top-2 duration-300">
                    <ParchmentSelect
                        label="Override Ayanamsa"
                        defaultValue={settings.ayanamsa.toLowerCase()}
                        onChange={(e) => updateAyanamsa(e.target.value as any)}
                        options={[
                            { value: 'lahiri', label: 'Lahiri (Chitrapaksha)' },
                            { value: 'raman', label: 'Raman' },
                            { value: 'kp', label: 'KP' },
                            { value: 'tropical', label: 'Tropical' },
                        ]}
                    />
                    <p className="text-[9px] text-[#9C7A2F]/60 mt-2 italic">* This updates your global astrologer preferences.</p>
                </div>
            )}

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
