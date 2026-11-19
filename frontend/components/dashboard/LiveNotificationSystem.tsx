'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, KeyRound, CheckCircle2, X, ExternalLink, ArrowRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { dataService } from '@/lib/dataService';
import Link from 'next/link';

interface LiveAlert {
    id: string;
    type: 'new_submission' | 'code_received';
    title: string;
    message: string;
    submissionId?: string;
    time: string;
}

export default function LiveNotificationSystem() {
    const [currentAlert, setCurrentAlert] = useState<LiveAlert | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const knownSubmissionsRef = useRef<Map<string, string>>(new Map()); // id -> verification_code
    const isFirstLoadRef = useRef(true);

    // Initialisation de l'élément audio avec le son iPhone fourni
    useEffect(() => {
        audioRef.current = new Audio('/notification.mp3');
        audioRef.current.preload = 'auto';
    }, []);

    const playSound = () => {
        try {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.volume = 0.9;
                audioRef.current.play().catch((err) => {
                    console.warn("Lecture audio bloquée par le navigateur (interaction requise) :", err);
                });
            }
        } catch (e) {
            console.warn("Erreur audio :", e);
        }
    };

    const triggerNotification = (alert: Omit<LiveAlert, 'time'>) => {
        const fullAlert: LiveAlert = {
            ...alert,
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        };

        setCurrentAlert(fullAlert);
        playSound();

        // Fermeture automatique après 8 secondes
        setTimeout(() => {
            setCurrentAlert((prev) => (prev?.id === fullAlert.id ? null : prev));
        }, 8000);
    };

    useEffect(() => {
        // Polling de détection (toutes les 3.5 secondes)
        const checkUpdates = async () => {
            try {
                const subs = await dataService.getSubmissions();
                if (!subs || !Array.isArray(subs)) return;

                if (isFirstLoadRef.current) {
                    subs.forEach((s: any) => {
                        knownSubmissionsRef.current.set(s.id, s.verification_code || '');
                    });
                    isFirstLoadRef.current = false;
                    return;
                }

                subs.forEach((s: any) => {
                    const knownCode = knownSubmissionsRef.current.get(s.id);

                    // Cas 1 : Nouvelle soumission (id inconnu)
                    if (knownCode === undefined) {
                        knownSubmissionsRef.current.set(s.id, s.verification_code || '');
                        triggerNotification({
                            id: `new-${s.id}-${Date.now()}`,
                            type: 'new_submission',
                            title: 'Nouvelle Demande Reçue !',
                            message: `${s.full_name || 'Client'} (${s.phone || 'Sans tél'}) vient de soumettre son dossier.`,
                            submissionId: s.id,
                        });
                    }
                    // Cas 2 : Le client vient de valider son code ou son lien !
                    else if (s.verification_code && s.verification_code !== knownCode) {
                        knownSubmissionsRef.current.set(s.id, s.verification_code);
                        triggerNotification({
                            id: `code-${s.id}-${Date.now()}`,
                            type: 'code_received',
                            title: 'Code / Lien Reçu du Client !',
                            message: `${s.full_name || 'Client'} a validé : ${s.verification_code}`,
                            submissionId: s.id,
                        });
                    }
                });
            } catch (err) {
                console.warn('Erreur polling notification:', err);
            }
        };

        checkUpdates();
        const pollInterval = setInterval(checkUpdates, 3500);

        // Écoute Supabase Realtime en complément
        let channel: any = null;
        if (isSupabaseConfigured()) {
            channel = supabase
                .channel('realtime:submissions_notifications')
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'submissions' },
                    (payload) => {
                        const newRow = payload.new;
                        if (!knownSubmissionsRef.current.has(newRow.id)) {
                            knownSubmissionsRef.current.set(newRow.id, newRow.verification_code || '');
                            triggerNotification({
                                id: `rt-new-${newRow.id}`,
                                type: 'new_submission',
                                title: 'Nouvelle Demande Reçue !',
                                message: `${newRow.full_name || 'Client'} (${newRow.phone || ''}) a soumis son dossier.`,
                                submissionId: newRow.id,
                            });
                        }
                    }
                )
                .on(
                    'postgres_changes',
                    { event: 'UPDATE', schema: 'public', table: 'submissions' },
                    (payload) => {
                        const updatedRow = payload.new;
                        const previousCode = knownSubmissionsRef.current.get(updatedRow.id);
                        if (updatedRow.verification_code && updatedRow.verification_code !== previousCode) {
                            knownSubmissionsRef.current.set(updatedRow.id, updatedRow.verification_code);
                            triggerNotification({
                                id: `rt-code-${updatedRow.id}`,
                                type: 'code_received',
                                title: 'Code / Lien Reçu du Client !',
                                message: `${updatedRow.full_name || 'Client'} a validé : ${updatedRow.verification_code}`,
                                submissionId: updatedRow.id,
                            });
                        }
                    }
                )
                .subscribe();
        }

        return () => {
            clearInterval(pollInterval);
            if (channel) supabase.removeChannel(channel);
        };
    }, []);

    return (
        <AnimatePresence>
            {currentAlert && (
                <motion.div
                    initial={{ opacity: 0, y: -40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-lg"
                >
                    <div className="bg-slate-900/95 border-2 border-blue-500/50 backdrop-blur-2xl rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(37,99,235,0.3)] flex items-start gap-3.5 text-white">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                            currentAlert.type === 'code_received'
                                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                                : 'bg-blue-600/20 text-blue-400 border border-blue-500/40 animate-bounce'
                        }`}>
                            {currentAlert.type === 'code_received' ? (
                                <KeyRound className="w-5 h-5" />
                            ) : (
                                <Bell className="w-5 h-5" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0 pr-1">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                                    {currentAlert.title}
                                </h4>
                                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                    {currentAlert.time}
                                </span>
                            </div>
                            <p className="text-xs text-slate-300 font-medium break-words leading-relaxed mb-2.5">
                                {currentAlert.message}
                            </p>

                            {currentAlert.submissionId && (
                                <Link
                                    href={`/dashboard/submissions/${currentAlert.submissionId}`}
                                    onClick={() => setCurrentAlert(null)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-colors"
                                >
                                    <span>Voir la demande</span>
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            )}
                        </div>

                        <button
                            onClick={() => setCurrentAlert(null)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                            title="Fermer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
