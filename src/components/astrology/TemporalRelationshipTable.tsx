"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface TemporalRelationshipTableProps {
    data: any;
    className?: string;
}

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

export default function TemporalRelationshipTable({ data, className }: TemporalRelationshipTableProps) {
    if (!data) return null;

    // Handle both cases: data is the array, or data is an object containing the array
    const entries = Array.isArray(data) ? data : (data.tatkalik_maitri_chakra || []);

    return (
        <div className={cn("w-full bg-[#FFFCF6] border border-antique rounded-xl overflow-hidden shadow-sm", className)}>
            <div className="bg-[#EAD8B1] px-4 py-2 border-b border-antique">
                <h3 className="text-lg font-serif font-bold text-primary text-center">
                    Tatkalik Maitri Chakra <span className="text-sm font-normal text-secondary">(Temporal Relationship)</span>
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-parchment/30">
                            <th className="border border-antique/50 p-2 bg-parchment/50"></th>
                            {PLANETS.map(planet => (
                                <th key={planet} className="border border-antique/50 p-2 text-xs font-bold text-primary font-serif">
                                    {planet}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Friends Row */}
                        <tr>
                            <td className="border border-antique/50 p-3 text-sm font-bold text-primary bg-parchment/50 font-serif">
                                Friends
                            </td>
                            {PLANETS.map(planetName => {
                                // Find entry for this planet
                                const entry = entries.find((e: any) => e.planet === planetName);
                                let friends: string[] = [];

                                if (entry?.relations) {
                                    // Map from "relations" object format: { "Sun": "Self", "Ketu": "Friend", ... }
                                    friends = Object.entries(entry.relations)
                                        .filter(([p, rel]) => rel === "Friend" && p !== planetName)
                                        .map(([p]) => p);
                                } else if (entry) {
                                    // Fallback for old format
                                    friends = entry.friends || entry.Friends || [];
                                }

                                return (
                                    <td key={planetName} className="border border-antique/50 p-2 text-xs text-primary text-center align-top min-w-[80px]">
                                        <div className="flex flex-col gap-1">
                                            {friends.map((friend: string) => (
                                                <span key={friend}>{friend}</span>
                                            ))}
                                            {friends.length === 0 && <span className="text-secondary/50">—</span>}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                        {/* Enemies Row */}
                        <tr className="bg-antique/5">
                            <td className="border border-antique/50 p-3 text-sm font-bold text-primary bg-parchment/50 font-serif">
                                Enemies
                            </td>
                            {PLANETS.map(planetName => {
                                // Find entry for this planet
                                const entry = entries.find((e: any) => e.planet === planetName);
                                let enemies: string[] = [];

                                if (entry?.relations) {
                                    enemies = Object.entries(entry.relations)
                                        .filter(([p, rel]) => rel === "Enemy" && p !== planetName)
                                        .map(([p]) => p);
                                } else if (entry) {
                                    enemies = entry.enemies || entry.Enemies || [];
                                }

                                return (
                                    <td key={planetName} className="border border-antique/50 p-2 text-xs text-primary text-center align-top min-w-[80px]">
                                        <div className="flex flex-col gap-1">
                                            {enemies.map((enemy: string) => (
                                                <span key={enemy}>{enemy}</span>
                                            ))}
                                            {enemies.length === 0 && <span className="text-secondary/50">—</span>}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
