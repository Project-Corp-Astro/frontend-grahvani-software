"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { authApi } from "@/lib/api";
import PremiumButton from "@/components/GoldenButton";

import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Animation state
    const [isUnfurled, setIsUnfurled] = useState(false);

    useEffect(() => {
        // Start unfurling immediately for smoother percieved load
        const timer = setTimeout(() => setIsUnfurled(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login({ email, password });
            // AuthContext handles redirecting to /dashboard on success
        } catch (err: any) {
            console.error("Login failed:", err);
            setError(err.message || "Failed to enter the sanctum. Please verify your cosmic credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-luxury-radial flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle Texture Overlay */}
            <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                    backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')",
                    backgroundBlendMode: 'multiply'
                }}
            />

            {/* Main Stage */}
            <div className="relative z-10 w-full max-w-[440px] perspective-[1200px] flex flex-col items-center justify-center min-h-[600px]">

                {/* Top Cylinder (The Anchor) - Now Richer Wood/Gold */}
                <motion.div
                    initial={{ y: 220, opacity: 0 }}
                    animate={{ y: isUnfurled ? 0 : 220, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="relative z-30 w-full h-[48px]"
                    style={{
                        background: 'linear-gradient(180deg, #98522F 0%, #763A1F 40%, #55250F 100%)', // Header background gradient
                        borderRadius: '24px',
                        boxShadow: '0 8px 20px rgba(61, 38, 24, 0.4)',
                    }}
                >
                    {/* Ornate End Caps */}
                    <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-[24px] h-[36px] bg-[#3D2618] rounded-l-lg shadow-md border-r border-[#2B1510] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#D4A574]" />
                    </div>
                    <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-[24px] h-[36px] bg-[#3D2618] rounded-r-lg shadow-md border-l border-[#2B1510] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#D4A574]" />
                    </div>

                    {/* Shine */}
                    <div className="absolute inset-x-0 top-1/4 h-[25%] bg-white/30 blur-[2px] rounded-full" />
                </motion.div>

                {/* The Unfurling Paper Body */}
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: isUnfurled ? "auto" : 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }} // Matched timing precisely
                    className="relative z-20 w-[92%] bg-softwhite overflow-hidden origin-top"
                    style={{
                        backgroundImage: `url('https://www.transparenttextures.com/patterns/cream-paper.png')`,
                        boxShadow: '0 10px 40px -10px rgba(61, 38, 24, 0.3), inset 0 0 40px rgba(139,90,43,0.1)',
                        borderLeft: '1px solid rgba(139,90,43,0.1)',
                        borderRight: '1px solid rgba(139,90,43,0.1)'
                    }}
                >
                    <div className="px-8 py-10 flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isUnfurled ? 1 : 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full"
                        >
                            {/* Header - Ancient Emblem */}
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-20 h-20 relative mb-4 flex items-center justify-center">
                                    {/* Sun/Moon Emblem Simulation */}
                                    <div className="absolute inset-0 border-2 border-[#8B5A2B] rounded-full opacity-30 animate-spin-slow" style={{ borderStyle: 'dotted' }} />
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#D4A574] to-[#8B5A2B] rounded-full flex items-center justify-center shadow-inner">
                                        <div className="w-8 h-8 rounded-full bg-[#FFFDF7] relative overflow-hidden">
                                            <div className="absolute -right-2 -top-2 w-6 h-6 bg-[#D4A574] rounded-full" />
                                        </div>
                                    </div>
                                </div>
                                <h1 className="text-3xl font-serif font-bold tracking-[0.15em] text-ink uppercase">
                                    Grahvani
                                </h1>
                                <div className="flex items-center gap-2 mt-2 opacity-80">
                                    <div className="h-[1px] w-6 bg-gold-dark" />
                                    <span className="text-[10px] font-serif uppercase tracking-widest text-gold-dark">Wisdom of Stars</span>
                                    <div className="h-[1px] w-6 bg-gold-dark" />
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6 w-full">
                                <div className="space-y-5">
                                    {/* Inputs - Designed to look like lines on a ledger */}
                                    <div className="relative group">
                                        <label className="block text-[10px] font-bold font-serif text-gold-dark uppercase tracking-widest mb-1">
                                            Cosmic Identity
                                        </label>
                                        <div className="relative flex items-center">
                                            <Mail className="absolute left-0 w-4 h-4 text-gold-primary" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-8 pr-2 py-2 bg-transparent border-b-2 border-gold-primary/40 text-ink font-serif placeholder-muted focus:outline-none focus:border-gold-dark transition-colors"
                                                placeholder="seeker@cosmos.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <label className="block text-[10px] font-bold font-serif text-gold-dark uppercase tracking-widest mb-1">
                                            Password
                                        </label>
                                        <div className="relative flex items-center">
                                            <Lock className="absolute left-0 w-4 h-4 text-gold-primary" />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-8 pr-2 py-2 bg-transparent border-b-2 border-gold-primary/40 text-ink font-serif placeholder-muted focus:outline-none focus:border-gold-dark transition-colors"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className="w-3.5 h-3.5 border border-gold-dark rounded-[2px] flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-gold-dark opacity-0" />
                                        </div>
                                        <span className="text-[10px] font-serif text-body uppercase tracking-wide">Remember me</span>
                                    </label>
                                    <a href="#" className="text-[10px] font-serif text-gold-dark font-bold uppercase tracking-wide hover:underline">
                                        Forgot Password?
                                    </a>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: [0, -10, 10, -5, 5, 0] }}
                                        transition={{ duration: 0.4 }}
                                        className="text-red-900/80 text-xs font-serif bg-red-50/50 p-2 rounded border border-red-100/50 text-center mx-10 backdrop-blur-sm"
                                    >
                                        {(() => {
                                            const lowerError = error.toLowerCase();
                                            if (lowerError.includes('user not found') || lowerError.includes('invalid credentials')) return "The stars do not recognize this identity. Please check your credentials.";
                                            if (lowerError.includes('password')) return "The secret key is incorrect. The sanctum remains closed.";
                                            if (lowerError.includes('verify')) return "Your soul signature is pending verification. Please check your spirit owl (email).";
                                            return error;
                                        })()}
                                    </motion.div>
                                )}

                                {/* Premium Button using GoldenButton Component */}
                                <div className="w-full flex justify-center">
                                    <PremiumButton
                                        topText={loading ? 'Consulting' : 'Enter'}
                                        bottomText={loading ? 'Stars...' : 'Sanctum'}
                                        type="submit"
                                        disabled={loading}
                                    />
                                </div>
                            </form>

                            <div className="mt-8">
                                <p className="text-[10px] font-serif text-muted italic">
                                    New to Grahvani? <Link href="/register" className="font-bold text-gold-dark hover:underline">Create an account</Link>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Bottom Cylinder (The Moving Roll) */}
                <motion.div
                    initial={{ y: -220, opacity: 0 }}
                    animate={{ y: isUnfurled ? 0 : -220, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="relative z-30 w-full h-[54px] -mt-1"
                    style={{
                        background: 'linear-gradient(180deg, #98522F 0%, #763A1F 40%, #55250F 100%)', // Header background gradient
                        borderRadius: '27px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    }}
                >
                    {/* Ornate End Caps */}
                    <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-[28px] h-[40px] bg-[#3D2618] rounded-l-lg shadow-md border-r border-[#2B1510] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#D4A574]" />
                    </div>
                    <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-[28px] h-[40px] bg-[#3D2618] rounded-r-lg shadow-md border-l border-[#2B1510] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#D4A574]" />
                    </div>

                    {/* Reflection */}
                    <div className="absolute inset-x-0 bottom-1/4 h-[20%] bg-white/20 blur-[3px] rounded-full" />
                </motion.div>

            </div>
        </div>
    );
}
