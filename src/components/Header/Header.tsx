import LeftOrnament from "./LeftOrnament";
import RightOrnament from "./RightOrnament";
import CenterOrnament from "./CenterOrnament";
import "./header.css";

export default function Header() {
    return (
        <header className="relative w-full max-w-7xl mx-auto mt-6 px-4">
            {/* Container for the continuous look */}
            <div className="relative flex items-center justify-center">

                {/* Left Scroll End */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-48 h-24 z-20 pointer-events-none">
                    <LeftOrnament />
                </div>

                {/* Main Continuous Bar */}
                <div className="header-main-bar relative w-full h-16 mx-12 flex items-center justify-between px-16 z-10 rounded-sm">

                    {/* Left Nav Links */}
                    <div className="flex items-center gap-8 text-[var(--gold-light)] font-serif tracking-wider text-sm">
                        <span className="cursor-pointer hover:text-white transition-colors">HOME</span>
                        <span className="cursor-pointer hover:text-white transition-colors">SERVICES</span>
                        <span className="cursor-pointer hover:text-white transition-colors">ASTROLOGERS</span>
                    </div>

                    {/* Right CTA */}
                    <div className="flex items-center gap-6">
                        <span className="text-[var(--gold-light)] font-serif tracking-wider text-sm cursor-pointer hover:text-white transition-colors">ABOUT US</span>
                        <button className="bg-gradient-to-b from-[var(--gold-main)] to-[var(--gold-dark)] text-[#3e2a1f] px-6 py-1.5 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] font-serif font-bold border border-[var(--gold-light)] hover:scale-105 transition-transform text-sm">
                            Book a Consultation
                        </button>
                    </div>
                </div>

                {/* Center Ornament & Logo (Overlays the bar) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-32 z-30 pointer-events-none flex items-center justify-center">
                    <CenterOrnament />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] flex flex-col items-center pt-2">
                        <div className="w-14 h-14 rounded-full border-2 border-[var(--gold-main)] flex items-center justify-center bg-[var(--bronze-dark)] shadow-xl mb-1">
                            <span className="text-2xl">✨</span>
                        </div>
                        <div className="text-xl font-serif text-[var(--gold-main)] tracking-[0.2em] font-bold drop-shadow-md">
                            GRAHVANI
                        </div>
                    </div>
                </div>

                {/* Right Scroll End */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-24 z-20 pointer-events-none">
                    <RightOrnament />
                </div>

            </div>
        </header>
    );
}
