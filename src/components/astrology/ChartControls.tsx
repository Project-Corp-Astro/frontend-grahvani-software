import React from 'react';
import { Eye, Settings } from 'lucide-react';
import ParchmentSelect from "@/components/ui/ParchmentSelect";


export default function ChartControls() {
    return (
        <div className="space-y-6">
            <h3 className="font-serif text-[#9C7A2F] text-sm font-bold uppercase tracking-widest border-b border-[#E7D6B8] pb-2">
                Chart Controls
            </h3>



            {/* Divisional Charts Select */}
            <div>
                <ParchmentSelect
                    label="Divisional Chart"
                    defaultValue="D1"
                    options={[
                        { value: 'D1', label: 'Rashi (D1)' },
                        { value: 'D9', label: 'Navamsa (D9)' },
                        { value: 'D10', label: 'Dasamsa (D10)' },
                        { value: 'D4', label: 'Chaturthamsa (D4)' },
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

        </div>
    );
}
