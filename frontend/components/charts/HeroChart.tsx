'use client';

import { useEffect, useState } from 'react';

interface Candle {
    o: number; // open
    h: number; // high
    l: number; // low
    c: number; // close
    x: number;
}

export default function HeroChart() {
    const [candles, setCandles] = useState<Candle[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        let lastClose = 200;
        const initialCandles = Array.from({ length: 60 }, (_, i) => {
            const open = lastClose;
            const close = open + (Math.random() - 0.5) * 40;
            const high = Math.max(open, close) + Math.random() * 15;
            const low = Math.min(open, close) - Math.random() * 15;
            lastClose = close;
            return { o: open, h: high, l: low, c: close, x: i * 20 };
        });
        setCandles(initialCandles);

        const interval = setInterval(() => {
            setCandles(prev => {
                const last = prev[prev.length - 1];
                const open = last.c;
                const close = open + (Math.random() - 0.5) * 20;
                const high = Math.max(open, close) + Math.random() * 8;
                const low = Math.min(open, close) - Math.random() * 8;

                const newCandle = { o: open, h: high, l: low, c: close, x: last.x + 20 };
                const next = [...prev.slice(1), newCandle].map((c, i) => ({ ...c, x: i * 20 }));
                return next;
            });
        }, 400);

        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none -z-10 bg-[#03040b]">
            {/* Overlay dégradé pour concentrer le regard sur le texte */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#03040b] via-[#03040b]/40 to-transparent" />
            <div className="absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-[#03040b] to-transparent" />

            <svg
                viewBox="0 0 1000 400"
                preserveAspectRatio="none"
                className="w-full h-full opacity-30 blur-[0.5px]"
            >
                <defs>
                    <filter id="bloom">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Grille de Trading */}
                <rect width="100%" height="100%" fill="none" />
                {Array.from({ length: 10 }).map((_, i) => (
                    <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="400" stroke="white" strokeWidth="0.1" opacity="0.1" />
                ))}
                {Array.from({ length: 8 }).map((_, i) => (
                    <line key={`h-${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} stroke="white" strokeWidth="0.1" opacity="0.1" />
                ))}

                {/* Bougies */}
                {candles.map((candle, i) => {
                    const isUp = candle.c >= candle.o;
                    const color = isUp ? "#10b981" : "#ef4444";
                    const y = 400 - Math.max(candle.o, candle.c);
                    const height = Math.abs(candle.o - candle.c);
                    const wickY1 = 400 - candle.h;
                    const wickY2 = 400 - candle.l;

                    return (
                        <g key={i} filter="url(#bloom)">
                            <line
                                x1={candle.x} y1={wickY1}
                                x2={candle.x} y2={wickY2}
                                stroke={color} strokeWidth="1"
                                className="transition-all duration-300"
                            />
                            <rect
                                x={candle.x - 3} y={y}
                                width="6" height={Math.max(1, height)}
                                fill={color}
                                className="transition-all duration-300"
                            />
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
