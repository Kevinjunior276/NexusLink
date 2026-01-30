'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Candle {
    id: number;
    o: number; // open
    h: number; // high
    l: number; // low
    c: number; // close
}

export default function HeroChart() {
    const [candles, setCandles] = useState<Candle[]>([]);
    const [mounted, setMounted] = useState(false);

    // Initial realistic data generation
    useEffect(() => {
        setMounted(true);
        let currentPrice = 220;
        const initialCandles = Array.from({ length: 45 }, (_, i) => {
            const open = currentPrice;
            const volatility = 40;
            const change = (Math.random() - 0.5) * volatility;
            const close = open + change;
            const high = Math.max(open, close) + Math.random() * 15;
            const low = Math.min(open, close) - Math.random() * 15;
            currentPrice = close;
            return { id: i, o: open, h: high, l: low, c: close };
        });
        setCandles(initialCandles);

        const interval = setInterval(() => {
            setCandles(prev => {
                const last = prev[prev.length - 1];
                const open = last.c;
                const change = (Math.random() - 0.5) * 25;
                const close = open + change;
                const high = Math.max(open, close) + Math.random() * 10;
                const low = Math.min(open, close) - Math.random() * 10;

                const nextId = last.id + 1;
                return [...prev.slice(1), { id: nextId, o: open, h: high, l: low, c: close }];
            });
        }, 1200);

        return () => clearInterval(interval);
    }, []);

    // Generate Moving Average line points
    const maPoints = useMemo(() => {
        if (candles.length < 5) return "";
        const step = 1000 / (candles.length - 1);
        return candles.map((c, i) => {
            const x = i * step;
            const y = 400 - (c.o + c.c + c.h + c.l) / 4; // Average price
            return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
        }).join(" ");
    }, [candles]);

    if (!mounted) return null;

    const candleWidth = 1000 / candles.length;

    return (
        <div className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none -z-10 bg-[#020308]">
            {/* Cinematic Background Gradients */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-brand-primary/10 to-transparent opacity-50" />
            <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-[#020308] via-transparent to-transparent z-10" />

            {/* Trading Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            <svg
                viewBox="0 0 1000 400"
                preserveAspectRatio="none"
                className="w-full h-full opacity-30"
            >
                <defs>
                    <filter id="bloom-strong">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id="maGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0070f3" stopOpacity="0" />
                        <stop offset="100%" stopColor="#0070f3" stopOpacity="0.8" />
                    </linearGradient>
                </defs>

                {/* Indicators: Moving Average */}
                <motion.path
                    d={maPoints}
                    fill="transparent"
                    stroke="url(#maGradient)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    animate={{ d: maPoints }}
                    transition={{ duration: 1.2, ease: "linear" }}
                />

                {/* Candles Rendering */}
                {candles.map((candle, i) => {
                    const isUp = candle.c >= candle.o;
                    const color = isUp ? "#22c55e" : "#ef4444";
                    const x = i * candleWidth + candleWidth / 2;

                    const bodyTop = 400 - Math.max(candle.o, candle.c);
                    const bodyBottom = 400 - Math.min(candle.o, candle.c);
                    const bodyHeight = Math.max(2, bodyBottom - bodyTop);

                    const wickTop = 400 - candle.h;
                    const wickBottom = 400 - candle.l;

                    return (
                        <g key={candle.id}>
                            {/* Wick */}
                            <motion.line
                                x1={x} y1={wickTop} x2={x} y2={wickBottom}
                                stroke={color} strokeWidth="1"
                                opacity="0.6"
                                initial={false}
                                animate={{ x1: x, x2: x, y1: wickTop, y2: wickBottom }}
                            />
                            {/* Candle Body */}
                            <motion.rect
                                x={x - candleWidth / 4}
                                y={bodyTop}
                                width={candleWidth / 2}
                                height={bodyHeight}
                                fill={color}
                                rx="1"
                                filter={isUp ? "url(#bloom-strong)" : ""}
                                opacity={isUp ? 0.8 : 0.6}
                                initial={false}
                                animate={{ x: x - candleWidth / 4, y: bodyTop, height: bodyHeight }}
                                transition={{ duration: 1.2, ease: "linear" }}
                            />
                            {/* Sub-Volume bars */}
                            <rect
                                x={x - candleWidth / 4}
                                y={400 - (Math.random() * 40 + 10)}
                                width={candleWidth / 2}
                                height="100"
                                fill={color}
                                opacity="0.05"
                            />
                        </g>
                    );
                })}
            </svg>

            {/* Price Tracker Line (Horizontal) */}
            <motion.div
                className="absolute left-0 w-full h-[1px] bg-brand-primary/20 z-20"
                style={{ top: '60%' }}
                animate={{ top: `${400 - (candles[candles.length - 1]?.c || 200)}px` }}
                transition={{ duration: 1.2, ease: "linear" }}
            >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-brand-primary/80 px-2 py-1 rounded-l-md text-[8px] font-black text-white">
                    LIVE
                </div>
            </motion.div>
        </div>
    );
}
