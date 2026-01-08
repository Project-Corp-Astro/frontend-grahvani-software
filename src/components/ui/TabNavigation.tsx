"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Tab {
    name: string;
    href: string;
    isActive: boolean;
}

interface TabNavigationProps {
    basePath: string;
}

export default function TabNavigation({ basePath }: TabNavigationProps) {
    const pathname = usePathname();

    // Define tabs
    const tabs = [
        { name: 'Charts', path: '/charts' },
        { name: 'Dashas', path: '/dashas' },
        { name: 'Planets', path: '/planets' },
        { name: 'Reports', path: '/reports' },
    ];

    return (
        <div className="w-full border-b border-[#DCC9A6] bg-[#FEFAEA]/50 backdrop-blur-md sticky top-[88px] z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center gap-8 -mb-[1px]">
                    {tabs.map((tab) => {
                        const fullPath = `${basePath}${tab.path}`;
                        // Check if current path starts with this tab's path (active state)
                        // Special handling for default 'charts' if pathname is just basepath (though redirect usually handles this)
                        const isActive = pathname.startsWith(fullPath);

                        return (
                            <Link
                                key={tab.name}
                                href={fullPath}
                                className={`
                                    py-4 px-2 font-serif text-lg tracking-wide border-b-2 transition-all duration-300
                                    ${isActive
                                        ? 'border-[#C9A24D] text-[#3E2A1F] font-bold'
                                        : 'border-transparent text-[#7A5A43] hover:text-[#9C7A2F] hover:border-[#E7D6B8]'
                                    }
                                `}
                            >
                                {tab.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
