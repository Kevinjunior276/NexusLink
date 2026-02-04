'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ServerStatus() {
    const [status, setStatus] = useState<'checking' | 'online' | 'starting' | 'offline'>('checking');
    const [latency, setLatency] = useState<number | null>(null);

    const checkServer = async () => {
        const start = Date.now();
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout for status check

            const res = await api.get('/health/');
            clearTimeout(timeoutId);

            setLatency(Date.now() - start);
            setStatus('online');
        } catch (err: any) {
            // Si l'erreur est un timeout ou une erreur réseau (mais pas un 404/500 applicatif)
            if (err.name === 'AbortError' || err.message?.includes('Impossible de contacter')) {
                setStatus('starting');
            } else {
                setStatus('offline');
            }
        }
    };

    useEffect(() => {
        checkServer();
        const interval = setInterval(checkServer, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={status}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={cn(
                        "flex items-center gap-2.5 px-4 py-2 rounded-2xl border transition-all duration-500",
                        status === 'online' ? "bg-green-500/10 border-green-500/20 text-green-400" :
                            status === 'starting' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                                status === 'offline' ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                    "bg-white/5 border-white/10 text-white/40"
                    )}
                >
                    {status === 'checking' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {status === 'online' && (
                        <>
                            <div className="relative">
                                <Activity className="w-3.5 h-3.5" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Serveur Opérationnel</span>
                            {latency && <span className="text-[8px] opacity-40">{latency}ms</span>}
                        </>
                    )}
                    {status === 'starting' && (
                        <>
                            <Zap className="w-3.5 h-3.5 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Réveil du Serveur en cours...</span>
                        </>
                    )}
                    {status === 'offline' && (
                        <>
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Serveur Inaccessible</span>
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
