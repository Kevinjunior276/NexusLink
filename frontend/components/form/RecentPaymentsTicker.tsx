'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const activityFeed = [
    { country: "Cameroun", method: "Orange Money", time: "à l'instant" },
    { country: "Côte d'Ivoire", method: "Wave", time: "il y a 2 min" },
    { country: "Sénégal", method: "Orange Money", time: "il y a 3 min" },
    { country: "RD Congo", method: "MTN Mobile Money", time: "il y a 5 min" },
    { country: "Bénin", method: "MTN Mobile Money", time: "il y a 7 min" },
    { country: "Gabon", method: "Virement Bancaire", time: "il y a 9 min" },
];

export default function RecentPaymentsTicker() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % activityFeed.length);
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    const current = activityFeed[currentIndex];

    return (
        <div className="w-full bg-slate-900/60 border-y border-white/[0.06] py-2 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center justify-center gap-2.5 px-4 text-xs text-slate-300"
                >
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-slate-400">Transaction sécurisée traitée :</span>
                    <span className="font-medium text-white">{current.method}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{current.country}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({current.time})</span>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
