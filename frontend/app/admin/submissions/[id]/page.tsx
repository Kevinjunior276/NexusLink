'use client';

import { useState } from 'react';
import {
    ArrowLeft,
    Mail,
    Phone,
    Copy,
    Eye,
    EyeOff,
    Trash2,
    Printer,
    FileText,
    Send,
    Save,
    ChevronLeft,
    ChevronRight,
    ShieldAlert,
    History,
    Info,
    ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function SubmissionDetails() {
    const [showSensitive, setShowSensitive] = useState(false);
    const [status, setStatus] = useState('Nouveau');

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Detail Header Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/submissions"
                        className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
                    >
                        <ArrowLeft className="w-5 h-5 text-brand-text-dim group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-display font-bold tracking-tight">Soumission <span className="text-brand-primary">#00127</span></h1>
                        <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] font-black uppercase tracking-[2px] text-brand-text-dim">Jean Claude Dupont</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                            <span className="text-[10px] font-bold text-green-400 uppercase tracking-tighter">Capture Terminée</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 p-3 px-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-[11px] font-bold uppercase tracking-widest text-brand-text-dim">
                        <ChevronLeft className="w-4 h-4" /> Précédente
                    </button>
                    <button className="flex items-center gap-2 p-3 px-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-[11px] font-bold uppercase tracking-widest text-brand-text-dim">
                        Suivante <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Core Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* General Metadata */}
                    <section className="glass-card rounded-[40px] border-white/5 overflow-hidden">
                        <div className="px-10 py-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                            <h3 className="text-[11px] font-black uppercase tracking-[3px] text-brand-primary flex items-center gap-3">
                                <Info className="w-4 h-4" /> Informations générales
                            </h3>
                            <span className="text-[10px] font-bold text-brand-text-dim opacity-30 italic tracking-widest leading-none">Capture ID: 127a9b8x2</span>
                        </div>
                        <div className="p-10 grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-16">
                            {[
                                { l: 'ID Soumission', v: '#00127' },
                                { l: 'Date et Heure', v: '29 Janvier 2026 à 14:23:45' },
                                { l: 'Lien utilisé', v: 'Campagne Bitcoin Bonus', link: true },
                                { l: 'Adresse IP', v: '197.149.XX.XX (Douala, CM)' },
                                { l: 'Navigateur', v: 'Chrome 120.0 (Windows 10)' },
                                { l: 'Temps sur page', v: '2m 14s' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-1.5">
                                    <p className="text-[10px] font-black uppercase tracking-[2px] opacity-20">{item.l}</p>
                                    <p className={cn("text-[13px] font-bold", item.link && "text-brand-primary underline underline-offset-4 cursor-pointer hover:opacity-80")}>
                                        {item.v}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Personal Info */}
                    <section className="glass-card rounded-[40px] border-white/5 overflow-hidden">
                        <div className="px-10 py-6 border-b border-white/5 bg-white/[0.01]">
                            <h3 className="text-[11px] font-black uppercase tracking-[3px] text-brand-primary flex items-center gap-3">
                                <UserPlus className="w-4 h-4" /> Informations personnelles
                            </h3>
                        </div>
                        <div className="p-10 space-y-10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black uppercase tracking-[2px] opacity-20">Nom Complet</p>
                                    <p className="text-xl font-display font-medium">Jean Claude Dupont</p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black uppercase tracking-[2px] opacity-20">Nationalité</p>
                                    <p className="text-[13px] font-bold">Camerounaise 🇨🇲</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="flex-1 glass-card p-6 border-white/5 flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest opacity-20">Email</p>
                                            <p className="text-[13px] font-bold">jean.dupont@email.com</p>
                                        </div>
                                    </div>
                                    <button className="p-2.5 rounded-xl hover:bg-brand-primary text-brand-text-dim hover:text-white transition-all opacity-0 group-hover:opacity-100"><Send className="w-4 h-4" /></button>
                                </div>

                                <div className="flex-1 glass-card p-6 border-white/5 flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-400/10 flex items-center justify-center text-orange-400">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest opacity-20">Téléphone</p>
                                            <p className="text-[13px] font-bold">+237 690 12 34 56</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button className="p-2.5 rounded-xl hover:bg-orange-400 text-brand-text-dim hover:text-white transition-all"><Phone className="w-4 h-4" /></button>
                                        <button className="p-2.5 rounded-xl hover:bg-white/10 text-brand-text-dim hover:text-white transition-all"><FileText className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Payment Info (Sensitive) */}
                    <section className="glass-card rounded-[40px] border-orange-400/10 bg-gradient-to-br from-orange-400/[0.02] to-transparent overflow-hidden">
                        <div className="px-10 py-6 border-b border-orange-400/10 flex items-center justify-between">
                            <h3 className="text-[11px] font-black uppercase tracking-[3px] text-orange-400 flex items-center gap-3 animate-pulse">
                                <ShieldAlert className="w-4 h-4" /> Informations de paiement (SENSITIVE)
                            </h3>
                            <button
                                onClick={() => setShowSensitive(!showSensitive)}
                                className="flex items-center gap-2 p-2 px-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
                            >
                                {showSensitive ? <><EyeOff className="w-3.5 h-3.5" /> Masquer</> : <><Eye className="w-3.5 h-3.5" /> Démasquer</>}
                            </button>
                        </div>

                        <div className="p-10 space-y-12">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black uppercase tracking-[2px] opacity-20">Méthode choisie</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-black uppercase shadow-lg shadow-orange-500/20">OM</div>
                                        <p className="text-[13px] font-bold text-orange-500">Orange Money Côte d'Ivoire</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[2px] opacity-20">Numéro de compte</p>
                                    <div className="flex items-center gap-4 group">
                                        <div className={cn(
                                            "flex-1 p-5 rounded-2xl bg-white/5 border border-white/10 font-mono text-xl tracking-[4px] blur-sm transition-all duration-500 whitespace-nowrap overflow-hidden",
                                            showSensitive && "blur-0 border-white/20"
                                        )}>
                                            {showSensitive ? "+237 698 45 67 89" : "••••••••••••"}
                                        </div>
                                        <button className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all shrink-0 active:scale-90"><Copy className="w-5 h-5 text-brand-text-dim" /></button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[2px] opacity-20">Code Secret / Mot de passe</p>
                                    <div className="flex items-center gap-4 group">
                                        <div className={cn(
                                            "flex-1 p-5 rounded-2xl bg-white/5 border border-white/10 font-mono text-xl tracking-[4px] blur-sm transition-all duration-500 whitespace-nowrap overflow-hidden",
                                            showSensitive && "blur-0 border-brand-primary bg-brand-primary/5"
                                        )}>
                                            {showSensitive ? "orange_pass_2026" : "••••••••••••"}
                                        </div>
                                        <button className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all shrink-0 active:scale-90"><Copy className="w-5 h-5 text-brand-text-dim" /></button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl bg-red-400/5 border border-red-400/10 flex items-start gap-4">
                                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-red-200/60 leading-relaxed italic">
                                    <span className="font-black uppercase tracking-widest text-red-400 mr-2">Avertissement:</span>
                                    Ces informations sont critiques et confidentielles. Ne les partagez jamais en dehors de cette plateforme sécurisée. Toutes les consultations sont enregistrées.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column - Status & History */}
                <div className="space-y-8">
                    {/* Admin Controls */}
                    <section className="glass-card rounded-[40px] p-10 border-white/5 space-y-10">
                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-[3px] text-brand-text-dim mb-6 opacity-40">Statut de Traitement</h4>
                            <div className="space-y-3">
                                {['Nouveau', 'En cours', 'Traité', 'Annulé'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setStatus(s)}
                                        className={cn(
                                            "w-full py-4 rounded-2xl text-[13px] font-bold transition-all flex items-center justify-between px-6 border border-white/5 hover:bg-white/5",
                                            status === s ? (
                                                s === 'Traité' ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                                    s === 'Annulé' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                        "bg-brand-primary/10 text-brand-primary border-brand-primary/20"
                                            ) : "text-brand-text-dim"
                                        )}
                                    >
                                        {s}
                                        {status === s && <div className="w-2 h-2 rounded-full bg-current shadow-glow" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[11px] font-black uppercase tracking-[3px] text-brand-text-dim mb-4 opacity-40">Notes Internes</h4>
                            <textarea
                                rows={6}
                                placeholder="Ajouter une note de suivi..."
                                className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-[13px] focus:border-brand-primary/50 outline-none transition-all resize-none"
                            />
                            <button className="w-full btn-premium py-4 rounded-2xl flex items-center justify-center gap-3 text-[12px] font-black uppercase tracking-widest">
                                <Save className="w-4 h-4" /> Enregistrer la note
                            </button>
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section className="glass-card rounded-[40px] p-10 border-white/5 space-y-4">
                        <h4 className="text-[11px] font-black uppercase tracking-[3px] text-brand-text-dim mb-4 opacity-40">Actions Rapides</h4>
                        <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-[12px] font-bold flex items-center gap-4 px-6 opacity-60 hover:opacity-100">
                            <Copy className="w-4 h-4" /> Copier tout
                        </button>
                        <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-[12px] font-bold flex items-center gap-4 px-6 opacity-60 hover:opacity-100">
                            <Printer className="w-4 h-4" /> Exporter PDF
                        </button>
                        <button className="w-full py-4 rounded-2xl bg-red-400/5 border border-red-400/10 hover:bg-red-400/10 transition-all text-[12px] font-bold flex items-center gap-4 px-6 text-red-500 group">
                            <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Supprimer
                        </button>
                    </section>

                    {/* Event History */}
                    <section className="glass-card rounded-[40px] p-10 border-white/5">
                        <h4 className="text-[11px] font-black uppercase tracking-[3px] text-brand-text-dim mb-10 opacity-40 flex items-center justify-between">
                            Historique <History className="w-4 h-4" />
                        </h4>
                        <div className="space-y-8 relative">
                            <div className="absolute left-2.5 top-2.5 bottom-2.5 w-px bg-white/5" />
                            {[
                                { t: 'Soumission créée', d: '29/01 14:23', b: 'bg-green-400' },
                                { t: 'Consulté par Admin', d: '29/01 14:24', b: 'bg-brand-primary' },
                                { t: 'Note ajoutée par Admin', d: '29/01 14:25', b: 'bg-brand-secondary' },
                            ].map((e, i) => (
                                <div key={i} className="flex gap-6 relative z-10 pl-1">
                                    <div className={cn("w-3 h-3 rounded-full mt-1 shrink-0", e.b)} />
                                    <div>
                                        <p className="text-[13px] font-bold text-white mb-0.5">{e.t}</p>
                                        <p className="text-[10px] font-medium text-brand-text-dim uppercase tracking-widest">{e.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
