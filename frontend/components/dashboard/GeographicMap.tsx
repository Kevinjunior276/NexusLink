'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function GeographicMap() {
    const [activeLocation, setActiveLocation] = useState<number | null>(null);
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGeoData = async () => {
            try {
                const data = await api.get('/submissions/geo_stats/');
                if (data) setLocations(data);
            } catch (error) {
                console.error('Error fetching geo stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGeoData();
        const interval = setInterval(fetchGeoData, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading && locations.length === 0) {
        return (
            <div className="glass-card rounded-[32px] p-6 sm:p-8 border-white/5 min-h-[400px] flex items-center justify-center bg-white/[0.01]">
                <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="glass-card rounded-[32px] p-6 sm:p-8 border-white/5 min-h-[400px] relative overflow-hidden bg-white/[0.01]">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[3px] text-brand-primary flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Géolocalisation
                </h3>
                <span className="text-[8px] sm:text-[9px] font-bold text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                    {locations.reduce((sum, loc) => sum + loc.count, 0)} TOTAL
                </span>
            </div>

            {/* World Map Visual */}
            <div className="relative h-64 bg-gradient-to-br from-brand-primary/5 to-transparent rounded-2xl border border-white/5 mb-6 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full">
                        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {locations.map((loc, i) => {
                    const x = ((loc.lng + 180) / 360) * 100;
                    const y = ((90 - loc.lat) / 180) * 100;

                    return (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute cursor-pointer group"
                            style={{ left: `${x}%`, top: `${y}%` }}
                            onMouseEnter={() => setActiveLocation(i)}
                            onMouseLeave={() => setActiveLocation(null)}
                        >
                            <div className="relative">
                                <motion.div
                                    className="w-2.5 h-2.5 rounded-full bg-brand-primary shadow-[0_0_15px_rgba(0,112,243,0.5)]"
                                    animate={{
                                        scale: activeLocation === i ? 1.6 : 1,
                                        boxShadow: activeLocation === i ? '0 0 25px rgba(0,112,243,1)' : '0 0 15px rgba(0,112,243,0.5)'
                                    }}
                                />
                                {activeLocation === i && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-brand-bg/90 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 shadow-2xl z-50"
                                    >
                                        <div className="text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-2">
                                            <span>{loc.flag}</span> {loc.city}
                                        </div>
                                        <div className="text-[9px] text-brand-primary font-bold mt-0.5">
                                            {loc.count} CAPTURES
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Location List */}
            <div className="space-y-2 max-h-[250px] overflow-y-auto no-scrollbar pr-1">
                {locations.map((loc, i) => (
                    <motion.div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group cursor-pointer"
                        onMouseEnter={() => setActiveLocation(i)}
                        onMouseLeave={() => setActiveLocation(null)}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-lg">{loc.flag}</span>
                            <div>
                                <div className="text-[11px] font-bold text-white group-hover:text-brand-primary transition-colors">
                                    {loc.city}
                                </div>
                                <div className="text-[9px] text-white/40 uppercase tracking-widest leading-none mt-0.5">
                                    {loc.country}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-lg">
                            <span className="text-[10px] font-black text-brand-primary">
                                {loc.count}
                            </span>
                            <MapPin className="w-3 h-3 text-white/20" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
