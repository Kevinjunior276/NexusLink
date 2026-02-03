'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveStatsProps {
    stats: {
        total: number;
        today: number;
        month: number;
    };
}

export default function LiveStats({ stats }: LiveStatsProps) {
    const [prevStats, setPrevStats] = useState(stats);
    const [changes, setChanges] = useState({ total: 0, today: 0, month: 0 });

    useEffect(() => {
        setChanges({
            total: stats.total - prevStats.total,
            today: stats.today - prevStats.today,
            month: stats.month - prevStats.month
        });
        setPrevStats(stats);
    }, [stats]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
                { label: 'Total Captures', value: stats.total, change: changes.total, emoji: '📊', color: 'blue' },
                { label: "Aujourd'hui", value: stats.today, change: changes.today, emoji: '📅', color: 'orange' },
                { label: 'Total Mensuel', value: stats.month, change: changes.month, emoji: '📆', color: 'purple' },
            ].map((stat, i) => (
                <motion.div
                    key={i}
                    className="glass-card rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 border-white/5 relative overflow-hidden group bg-white/[0.01]"
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.03)' }}
                    whileTap={{ scale: 0.98 }}
                >
                    {/* Background Glow */}
                    <div className={cn(
                        "absolute -right-4 -top-4 w-24 h-24 blur-[40px] opacity-10 transition-opacity group-hover:opacity-20",
                        stat.color === 'blue' ? "bg-brand-primary" : stat.color === 'orange' ? "bg-orange-500" : "bg-purple-500"
                    )} />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3 sm:mb-6">
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[2px] sm:tracking-[4px] text-white/40 flex items-center gap-2">
                                <span className="opacity-100">{stat.emoji}</span> {stat.label}
                            </span>
                            {stat.change !== 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex items-center gap-1 px-2 py-1 rounded-full text-[8px] font-black",
                                        stat.change > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                    )}
                                >
                                    {stat.change > 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                                    {stat.change > 0 ? '+' : ''}{stat.change}
                                </motion.div>
                            )}
                        </div>

                        <div className="flex items-baseline gap-2">
                            <motion.span
                                key={stat.value}
                                initial={{ scale: 1.2, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-3xl sm:text-5xl font-display font-black text-white tracking-tighter"
                            >
                                {stat.value.toLocaleString()}
                            </motion.span>
                            <span className="text-[10px] sm:text-xs font-bold text-white/20 uppercase tracking-widest italic">Unités</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
