"use client";

import Link from "next/link";
import NavItem from "./NavItem";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-[88px]">
            {/* Main Header Container */}
            <div
                className="relative h-full w-full flex items-center justify-center"
                style={{
                    background: 'linear-gradient(180deg, #98522F 0%, #763A1F 40%, #55250F 100%)',
                    boxShadow: 'inset 0 2px 4px rgba(255,210,125,0.15), inset 0 -2px 4px rgba(0,0,0,0.3)',
                }}
            >
                {/* Top Gold Border */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D08C60] to-transparent" />

                {/* Bottom Gold Border */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D08C60] to-transparent" />

                {/* Left Ornamental End */}
                <div className="absolute left-0 top-0 h-full w-[120px] pointer-events-none">
                    <svg viewBox="0 0 120 88" className="h-full w-full" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="leftOrnamentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#D08C60" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#D08C60" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M0 0 L80 0 Q100 44 80 88 L0 88 Z"
                            fill="url(#leftOrnamentGrad)"
                            opacity="0.3"
                        />
                        <path
                            d="M0 10 Q30 44 0 78"
                            stroke="#D08C60"
                            strokeWidth="1.5"
                            fill="none"
                            opacity="0.6"
                        />
                        {/* Decorative Star */}
                        <g transform="translate(30, 44)">
                            <path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" fill="#D08C60" opacity="0.7" />
                        </g>
                        {/* Crescent Moon */}
                        <g transform="translate(55, 44)">
                            <path
                                d="M5 -10 Q-5 0 5 10 Q0 0 5 -10 Z"
                                fill="#D08C60"
                                opacity="0.6"
                            />
                        </g>
                    </svg>
                </div>

                {/* Right Ornamental End */}
                <div className="absolute right-0 top-0 h-full w-[120px] pointer-events-none">
                    <svg viewBox="0 0 120 88" className="h-full w-full" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="rightOrnamentGrad" x1="100%" y1="0%" x2="0%" y2="0%">
                                <stop offset="0%" stopColor="#D08C60" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#D08C60" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M120 0 L40 0 Q20 44 40 88 L120 88 Z"
                            fill="url(#rightOrnamentGrad)"
                            opacity="0.3"
                        />
                        <path
                            d="M120 10 Q90 44 120 78"
                            stroke="#D08C60"
                            strokeWidth="1.5"
                            fill="none"
                            opacity="0.6"
                        />
                        {/* Decorative Star */}
                        <g transform="translate(90, 44)">
                            <path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" fill="#D08C60" opacity="0.7" />
                        </g>
                        {/* Sun Symbol */}
                        <g transform="translate(65, 44)">
                            <circle r="5" fill="#D08C60" opacity="0.5" />
                            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                                <line
                                    key={angle}
                                    x1="0" y1="-7" x2="0" y2="-10"
                                    stroke="#D08C60"
                                    strokeWidth="1"
                                    transform={`rotate(${angle})`}
                                    opacity="0.5"
                                />
                            ))}
                        </g>
                    </svg>
                </div>

                {/* Navigation Container - Unified without Logo */}
                <div className="flex items-center justify-between w-full max-w-[1400px] px-8 lg:px-16">

                    {/* Main Navigation Links */}
                    <nav className="flex items-center gap-6" aria-label="Primary navigation">
                        <NavItem href="/">Home</NavItem>
                        <NavItem href="/services">Services</NavItem>
                        <NavItem href="/astrologers">Astrologers</NavItem>
                        <NavItem href="/about">About Us</NavItem>
                        <NavItem href="/resources">Resources</NavItem>
                    </nav>
                </div>
            </div>
        </header>
    );
}
