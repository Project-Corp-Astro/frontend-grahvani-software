"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, User, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { authApi } from "@/lib/api";
import PremiumButton from "@/components/GoldenButton";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Animation state
    const [isUnfurled, setIsUnfurled] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsUnfurled(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match. The cosmic harmony is disrupted.");
            setLoading(false);
            return;
        }

        try {
            await authApi.register({ name, email, password });

            // On success, redirect to login
            router.push("/login?registered=true");
        } catch (err: any) {
            console.error("Registration failed:", err);
            setError(err.message || "Failed to initiate registration. Please check your celestial alignment.");
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
            <div className="relative z-10 w-full max-w-[480px] perspective-[1200px] flex flex-col items-center justify-center min-h-[700px]">

                {/* Top Cylinder */}
                <motion.div
                    initial={{ y: 220, opacity: 0 }}
                    animate={{ y: isUnfurled ? 0 : 220, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="relative z-30 w-full h-[48px]"
                    style={{
                        background: 'linear-gradient(180deg, #98522F 0%, #763A1F 40%, #55250F 100%)',
                        borderRadius: '24px',
                        boxShadow: '0 8px 20px rgba(61, 38, 24, 0.4)',
                    }}
                >
                    <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-[24px] h-[36px] bg-[#3D2618] rounded-l-lg" />
                    <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-[24px] h-[36px] bg-[#3D2618] rounded-r-lg" />
                    <div className="absolute inset-x-0 top-1/4 h-[25%] bg-white/30 blur-[2px] rounded-full" />
                </motion.div>

                {/* The Unfurling Paper Body */}
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: isUnfurled ? "auto" : 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="relative z-20 w-[94%] bg-softwhite overflow-hidden origin-top"
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
                            <div className="flex flex-col items-center mb-8">
                                <h1 className="text-2xl font-serif font-bold tracking-[0.15em] text-ink uppercase">
                                    Join the Order
                                </h1>
                                <div className="flex items-center gap-2 mt-2 opacity-80">
                                    <div className="h-[1px] w-6 bg-gold-dark" />
                                    <span className="text-[9px] font-serif uppercase tracking-widest text-gold-dark">Initiate Your Celestial Account</span>
                                    <div className="h-[1px] w-6 bg-gold-dark" />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 w-full">
                                <div className="space-y-4">
                                    {/* Name */}
                                    <div className="relative group">
                                        <label className="block text-[10px] font-bold font-serif text-gold-dark uppercase tracking-widest mb-1">
                                            Full Name
                                        </label>
                                        <div className="relative flex items-center">
                                            <User className="absolute left-0 w-4 h-4 text-gold-primary" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-8 pr-2 py-1.5 bg-transparent border-b-2 border-gold-primary/40 text-ink font-serif placeholder-muted focus:outline-none focus:border-gold-dark transition-colors"
                                                placeholder="Astro Master"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="relative group">
                                        <label className="block text-[10px] font-bold font-serif text-gold-dark uppercase tracking-widest mb-1">
                                            Celestial Email
                                        </label>
                                        <div className="relative flex items-center">
                                            <Mail className="absolute left-0 w-4 h-4 text-gold-primary" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-8 pr-2 py-1.5 bg-transparent border-b-2 border-gold-primary/40 text-ink font-serif placeholder-muted focus:outline-none focus:border-gold-dark transition-colors"
                                                placeholder="seeker@cosmos.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative group">
                                            <label className="block text-[10px] font-bold font-serif text-gold-dark uppercase tracking-widest mb-1">
                                                Secret Key
                                            </label>
                                            <div className="relative flex items-center">
                                                <Lock className="absolute left-0 w-4 h-4 text-gold-primary" />
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full pl-8 pr-2 py-1.5 bg-transparent border-b-2 border-gold-primary/40 text-ink font-serif placeholder-muted focus:outline-none focus:border-gold-dark transition-colors"
                                                    placeholder="••••••••"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="relative group">
                                            <label className="block text-[10px] font-bold font-serif text-gold-dark uppercase tracking-widest mb-1">
                                                Confirm Key
                                            </label>
                                            <div className="relative flex items-center">
                                                <ShieldCheck className="absolute left-0 w-4 h-4 text-gold-primary" />
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full pl-8 pr-2 py-1.5 bg-transparent border-b-2 border-gold-primary/40 text-ink font-serif placeholder-muted focus:outline-none focus:border-gold-dark transition-colors"
                                                    placeholder="••••••••"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-[8px] text-muted italic leading-tight">
                                        Password must contain uppercase, lowercase, number, and special character.
                                    </p>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: [0, -10, 10, -5, 5, 0] }}
                                        className="text-red-900/80 text-[10px] font-serif bg-red-50/50 p-2 rounded border border-red-100/50 text-center"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <div className="w-full flex justify-center pt-4">
                                    <PremiumButton
                                        topText={loading ? 'Forging' : 'Register'}
                                        bottomText={loading ? 'Identity...' : 'Account'}
                                        type="submit"
                                        disabled={loading}
                                    />
                                </div>
                            </form>

                            <div className="mt-8">
                                <p className="text-[10px] font-serif text-muted italic">
                                    Already have an account? <Link href="/login" className="font-bold text-gold-dark hover:underline">Return to Login</Link>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Bottom Cylinder */}
                <motion.div
                    initial={{ y: -220, opacity: 0 }}
                    animate={{ y: isUnfurled ? 0 : -220, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="relative z-30 w-full h-[54px] -mt-1"
                    style={{
                        background: 'linear-gradient(180deg, #98522F 0%, #763A1F 40%, #55250F 100%)',
                        borderRadius: '27px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    }}
                >
                    <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-[28px] h-[40px] bg-[#3D2618] rounded-l-lg" />
                    <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-[28px] h-[40px] bg-[#3D2618] rounded-r-lg" />
                    <div className="absolute inset-x-0 bottom-1/4 h-[20%] bg-white/20 blur-[3px] rounded-full" />
                </motion.div>

            </div>
        </div>
    );
}
