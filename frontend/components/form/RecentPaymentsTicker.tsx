'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fakePayments = [
    { name: "Paul M.", amount: "450€", method: "Orange Money", time: "il y a 2 min" },
    { name: "Sarah K.", amount: "1,200€", method: "MTN Mobile", time: "il y a 5 min" },
    { name: "Jean-Claude D.", amount: "850€", method: "Wave", time: "il y a 8 min" },
    { name: "Marie L.", amount: "2,100€", method: "Virement", time: "il y a 12 min" },
    { name: "David N.", amount: "675€", method: "Orange Money", time: "il y a 15 min" },
    { name: "Aminata S.", amount: "1,500€", method: "MTN Mobile", time: "il y a 18 min" },
];

export default function RecentPaymentsTicker() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % fakePayments.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const current = fakePayments[currentIndex];

    return (
        <div className="w-full bg-gradient-to-r from-green-500/10 via-brand-primary/10 to-green-500/10 border-y border-green-500/20 py-3 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center justify-center gap-3 px-4"
                >
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="text-[11px] font-bold text-white">
                        <span className="text-green-400">{current.name}</span> a reçu{' '}
                        <span className="text-brand-primary font-black">{current.amount}</span> via{' '}
                        <span className="text-white/80">{current.method}</span>
                    </span>
                    <span className="text-[9px] font-medium text-white/40 uppercase tracking-wider shrink-0">
                        {current.time}
                    </span>
                    <TrendingUp className="w-3 h-3 text-green-500 shrink-0 animate-pulse" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
