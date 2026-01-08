"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export default function NavItem({ href, children, className = "" }: NavItemProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`relative px-4 py-2 font-serif text-[13px] font-medium uppercase tracking-[2px] transition-all duration-300 text-[#F4E8D8] hover:text-[#FFD27D] group ${className}`}
            aria-current={isActive ? "page" : undefined}
        >
            {children}

            {/* Underline Effect */}
            <span
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300 bg-gradient-to-r from-transparent via-[#FFD27D] to-transparent ${isActive
                    ? "w-full opacity-100 shadow-[0_0_10px_2px_rgba(255,210,125,0.5)]"
                    : "w-0 opacity-0 group-hover:w-full group-hover:opacity-70"
                    }`}
            />

            {/* Glow Effect for Active */}
            {isActive && (
                <span
                    className="absolute inset-0 -z-10 rounded-lg opacity-20 blur-md"
                    style={{ background: 'radial-gradient(ellipse at center, #FFD27D 0%, transparent 70%)' }}
                />
            )}
        </Link>
    );
}
