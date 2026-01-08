'use client';

import React from 'react';

interface PremiumButtonProps {
    topText: string;
    bottomText: string;
    onClick?: () => void;
    className?: string; // Added
    disabled?: boolean; // Added
    type?: "button" | "submit" | "reset"; // Added
}

/**
 * PremiumButton Component
 * 
 * A luxury astrology button with:
 * - Chamfered/angled corners on left and right
 * - Gold border all around
 * - Gold dots at the 4 corner junctions
 * - Dark bronze gradient background
 * - Two lines of text
 */
export default function PremiumButton({
    topText,
    bottomText,
    onClick,
    className = '',
    disabled = false,
    type = 'button',
}: PremiumButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`relative group ${className} ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
            }}
        >
            {/* Main button container with clip-path for chamfered corners */}
            <div
                className="relative"
                style={{
                    padding: '2px',
                    background: 'linear-gradient(135deg, #E8C872 0%, #C9A24C 50%, #8B6B2E 100%)',
                    clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0 50%)',
                }}
            >
                {/* Inner button with Header background gradient */}
                <div
                    style={{
                        background: 'linear-gradient(180deg, #98522F 0%, #763A1F 40%, #55250F 100%)',
                        clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0 50%)',
                        padding: '10px 28px',
                        minWidth: '200px',
                        textAlign: 'center', // Ensure text is centered
                    }}
                >
                    {/* Top text */}
                    <div
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            color: '#FFFFFF',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                            lineHeight: '1.2',
                        }}
                    >
                        {topText}
                    </div>
                    {/* Bottom text */}
                    <div
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '0.6rem',
                            fontWeight: 500,
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            color: '#FFDEB3',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                            lineHeight: '1.2',
                            marginTop: '2px',
                        }}
                    >
                        {bottomText}
                    </div>
                </div>
            </div>

            {/* Gold dots at left and right pointed tips */}
            {/* Left tip dot */}
            <div
                className="absolute"
                style={{
                    width: '7px',
                    height: '7px',
                    background: 'radial-gradient(circle, #F0D878 0%, #C9A24C 60%, #8B6B2E 100%)',
                    borderRadius: '50%',
                    top: '50%',
                    left: '-3px',
                    transform: 'translateY(-50%)',
                    boxShadow: '0 0 4px rgba(200, 160, 60, 0.8)',
                }}
            />
            {/* Right tip dot */}
            <div
                className="absolute"
                style={{
                    width: '7px',
                    height: '7px',
                    background: 'radial-gradient(circle, #F0D878 0%, #C9A24C 60%, #8B6B2E 100%)',
                    borderRadius: '50%',
                    top: '50%',
                    right: '-3px',
                    transform: 'translateY(-50%)',
                    boxShadow: '0 0 4px rgba(200, 160, 60, 0.8)',
                }}
            />
        </button>
    );
}
