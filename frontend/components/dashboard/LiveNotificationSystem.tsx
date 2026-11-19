'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, KeyRound, X, ArrowRight, Volume2, VolumeX, Sparkles } from 'lucide-react';
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

interface KnownEntry {
    code: string;
    status: string;
}

export default function LiveNotificationSystem() {
    const [currentAlert, setCurrentAlert] = useState<LiveAlert | null>(null);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [hasInteracted, setHasInteracted] = useState(false);
    
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const knownSubmissionsRef = useRef<Map<string, KnownEntry>>(new Map());
    const isFirstLoadRef = useRef(true);
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Initialisation du fichier audio & interaction utilisateur
    useEffect(() => {
        try {
            audioRef.current = new Audio('/notification.mp3');
            audioRef.current.preload = 'auto';
        } catch (e) {
            console.warn("Erreur chargement audio:", e);
        }

        // Déverrouillage automatique du son au premier clic / frappe
        const unlock = () => {
            setHasInteracted(true);
            if (audioRef.current) {
                audioRef.current.load();
            }
            if (!audioCtxRef.current) {
                const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioCtxClass) {
                    audioCtxRef.current = new AudioCtxClass();
                }
            }
            if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }
            window.removeEventListener('click', unlock);
            window.removeEventListener('keydown', unlock);
            window.removeEventListener('touchstart', unlock);
        };

        window.addEventListener('click', unlock);
        window.addEventListener('keydown', unlock);
        window.addEventListener('touchstart', unlock);

        // Demande de permission pour notifications de bureau
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().catch(() => {});
        }

        return () => {
            window.removeEventListener('click', unlock);
            window.removeEventListener('keydown', unlock);
            window.removeEventListener('touchstart', unlock);
        };
    }, []);

    // Synthèse sonore de secours (Beep Web Audio API) si le mp3 est bloqué
    const playFallbackChime = () => {
        try {
            const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioCtxClass) return;
            const ctx = audioCtxRef.current || new AudioCtxClass();
            audioCtxRef.current = ctx;

            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            // Arpège de notification agréable
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.setValueAtTime(880.00, now + 0.1); // A5
            osc.frequency.setValueAtTime(1174.66, now + 0.2); // D6

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.5);
        } catch (e) {
            console.warn("Erreur fallback son:", e);
        }
    };

    const playSound = () => {
        if (!soundEnabled) return;

        try {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.volume = 1.0;
                const promise = audioRef.current.play();
                if (promise !== undefined) {
                    promise.catch(() => {
                        // Si le navigateur bloque l'audio HTML5, lancer le synthétiseur
                        playFallbackChime();
                    });
                }
            } else {
                playFallbackChime();
            }
        } catch {
            playFallbackChime();
        }
    };

    const triggerNotification = (alert: Omit<LiveAlert, 'time'>) => {
        const fullAlert: LiveAlert = {
            ...alert,
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        };

        setCurrentAlert(fullAlert);
        playSound();

        // Notification de bureau et système mobile (Android / APK)
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.ready.then((reg) => {
                        reg.showNotification(fullAlert.title, {
                            body: fullAlert.message,
                            icon: '/logos/wave.png',
                            badge: '/favicon.ico',
                            vibrate: [300, 100, 300, 100, 300],
                            tag: fullAlert.id,
                            renotify: true,
                            data: {
                                url: fullAlert.submissionId ? `/dashboard/submissions/${fullAlert.submissionId}` : '/dashboard/submissions'
                            }
                        });
                    }).catch(() => {
                        new Notification(fullAlert.title, { body: fullAlert.message, icon: '/logos/wave.png' });
                    });
                } else {
                    new Notification(fullAlert.title, { body: fullAlert.message, icon: '/logos/wave.png' });
                }
            } catch (err) {
                console.warn('Erreur notification système:', err);
            }
        }

        // Faire clignoter l'onglet du navigateur
        if (typeof document !== 'undefined') {
            const originalTitle = document.title;
            document.title = `🔔 ${fullAlert.title}`;
            setTimeout(() => {
                document.title = originalTitle;
            }, 8000);
        }

        // Fermeture automatique après 15 secondes
        setTimeout(() => {
            setCurrentAlert((prev) => (prev?.id === fullAlert.id ? null : prev));
        }, 15000);
    };

    // Test manuel du son pour vérifier et autoriser le navigateur
    const handleTestSound = async () => {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission().catch(() => {});
        }
        playSound();
        triggerNotification({
            id: `test-${Date.now()}`,
            type: 'code_received',
            title: 'Test Son & Notification',
            message: 'Le son iPhone et les alertes visuelles sont parfaitement opérationnels !'
        });
    };

    useEffect(() => {
        // Polling toutes les 3 secondes pour détecter toute nouvelle soumission ou code validé
        const checkUpdates = async () => {
            try {
                const subs = await dataService.getSubmissions();
                if (!subs || !Array.isArray(subs)) return;

                if (isFirstLoadRef.current) {
                    subs.forEach((s: any) => {
                        knownSubmissionsRef.current.set(s.id, {
                            code: s.verification_code || '',
                            status: s.status || ''
                        });
                    });
                    isFirstLoadRef.current = false;

                    // Si on entre et qu'il y a déjà un code validé en attente de validation finale :
                    const urgentPending = subs.find((s: any) => s.status === 'Code reçu');
                    if (urgentPending) {
                        triggerNotification({
                            id: `init-${urgentPending.id}`,
                            type: 'code_received',
                            title: 'Code Reçu du Client !',
                            message: `${urgentPending.full_name} a validé son code : ${urgentPending.verification_code || 'Code reçu'}`,
                            submissionId: urgentPending.id,
                        });
                    }
                    return;
                }

                subs.forEach((s: any) => {
                    const prev = knownSubmissionsRef.current.get(s.id);
                    const currentCode = s.verification_code || '';
                    const currentStatus = s.status || '';

                    // Cas 1 : Nouvelle soumission (nouveau client)
                    if (!prev) {
                        knownSubmissionsRef.current.set(s.id, { code: currentCode, status: currentStatus });
                        triggerNotification({
                            id: `new-${s.id}-${Date.now()}`,
                            type: 'new_submission',
                            title: 'Nouvelle Demande Reçue !',
                            message: `${s.full_name || 'Client'} (${s.phone || 'Sans tél'}) vient de soumettre son dossier.`,
                            submissionId: s.id,
                        });
                    }
                    // Cas 2 : Le client vient de valider son code !
                    else {
                        const codeChanged = currentCode && currentCode !== prev.code;
                        const statusBecameCode = (currentStatus === 'Code reçu' || currentStatus.toLowerCase().includes('code')) && prev.status !== currentStatus;

                        if (codeChanged || statusBecameCode) {
                            knownSubmissionsRef.current.set(s.id, { code: currentCode, status: currentStatus });
                            triggerNotification({
                                id: `code-${s.id}-${Date.now()}`,
                                type: 'code_received',
                                title: 'Code Reçu du Client !',
                                message: `${s.full_name || 'Client'} a validé son code : ${currentCode || 'Code reçu'}`,
                                submissionId: s.id,
                            });
                        }
                    }
                });
            } catch (err) {
                console.warn('Erreur polling notification:', err);
            }
        };

        checkUpdates();
        const pollInterval = setInterval(checkUpdates, 3000);

        // Supabase Realtime en parallèle
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
                            knownSubmissionsRef.current.set(newRow.id, {
                                code: newRow.verification_code || '',
                                status: newRow.status || ''
                            });
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
                        const prev = knownSubmissionsRef.current.get(updatedRow.id);
                        const newCode = updatedRow.verification_code || '';
                        const newStatus = updatedRow.status || '';

                        if ((newCode && (!prev || newCode !== prev.code)) || (newStatus === 'Code reçu' && (!prev || prev.status !== 'Code reçu'))) {
                            knownSubmissionsRef.current.set(updatedRow.id, { code: newCode, status: newStatus });
                            triggerNotification({
                                id: `rt-code-${updatedRow.id}`,
                                type: 'code_received',
                                title: 'Code Reçu du Client !',
                                message: `${updatedRow.full_name || 'Client'} a validé son code : ${newCode || 'Code reçu'}`,
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
    }, [soundEnabled]);

    return (
        <>
            {/* Bouton de test rapide et statut sonore flottant (en bas à droite du tableau de bord) */}
            <div className="fixed bottom-4 right-4 z-40 hidden sm:flex items-center gap-2 bg-slate-900/90 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
                <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                    title={soundEnabled ? "Son activé (cliquez pour couper)" : "Son coupé (cliquez pour activer)"}
                >
                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                    <span className="text-[11px] font-medium">{soundEnabled ? "Son actif" : "Silencieux"}</span>
                </button>
                <span className="text-slate-600">|</span>
                <button
                    onClick={handleTestSound}
                    className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer flex items-center gap-1"
                    title="Tester le son iPhone et l'affichage de l'alerte"
                >
                    <Sparkles className="w-3 h-3" />
                    <span>Tester</span>
                </button>
            </div>

            {/* Popup d'alerte en haut de l'écran */}
            <AnimatePresence>
                {currentAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] w-[94%] max-w-lg"
                    >
                        <div className={`backdrop-blur-2xl rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex items-start gap-3.5 text-white border-2 ${
                            currentAlert.type === 'code_received'
                                ? 'bg-slate-950/95 border-emerald-500/60 shadow-[0_0_35px_rgba(16,185,129,0.35)]'
                                : 'bg-slate-950/95 border-blue-500/60 shadow-[0_0_35px_rgba(37,99,235,0.35)]'
                        }`}>
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                                currentAlert.type === 'code_received'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/40 animate-bounce'
                            }`}>
                                {currentAlert.type === 'code_received' ? (
                                    <KeyRound className="w-5 h-5" />
                                ) : (
                                    <Bell className="w-5 h-5" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0 pr-1">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                                        <span>{currentAlert.title}</span>
                                        {currentAlert.type === 'code_received' && (
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                        )}
                                    </h4>
                                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                        {currentAlert.time}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-200 font-medium break-words leading-relaxed mb-3">
                                    {currentAlert.message}
                                </p>

                                {currentAlert.submissionId && (
                                    <Link
                                        href={`/dashboard/submissions/${currentAlert.submissionId}`}
                                        onClick={() => setCurrentAlert(null)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-all ${
                                            currentAlert.type === 'code_received'
                                                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30'
                                                : 'bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30'
                                        }`}
                                    >
                                        <span>Consulter la demande</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
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
        </>
    );
}
