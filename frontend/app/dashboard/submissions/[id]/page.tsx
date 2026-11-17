'use client';

import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Trash2,
    Lock,
    Loader2,
    Mail,
    Phone,
    Shield,
    Eye,
    EyeOff,
    Download,
    CheckCircle2,
    Calendar,
    Globe,
    KeyRound,
    Check,
    X
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { dataService } from '@/lib/dataService';
import { generateSubmissionPDF } from '@/lib/pdfExport';

export default function SubmissionDetails() {
    const params = useParams();
    const router = useRouter();
    const [submission, setSubmission] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [showSensitive, setShowSensitive] = useState(false);
    const [status, setStatus] = useState('En attente');
    const [adminNotes, setAdminNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const data = await dataService.getSubmissionById(params.id as string);
                setSubmission(data);
                if (data) {
                    setStatus(data.status || 'En attente');
                    setAdminNotes(data.admin_notes || '');
                }
            } catch (error) {
                console.error('Erreur chargement soumission:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) fetchSubmission();
    }, [params.id]);

    const handleUpdateStatus = async (forcedStatus?: string) => {
        if (!submission) return;
        setIsSaving(true);
        const statusToApply = forcedStatus || status;
        try {
            await dataService.updateSubmissionStatus(submission.id, statusToApply, adminNotes);
            setStatus(statusToApply);
            setSubmission({ ...submission, status: statusToApply, admin_notes: adminNotes });
            alert('Statut mis à jour avec succès.');
        } catch (error: any) {
            alert(`Erreur: ${error.message || 'Mise à jour impossible'}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-24">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="text-center py-24">
                <p className="text-slate-400 text-sm mb-4">Cette demande est introuvable.</p>
                <Link href="/dashboard/submissions" className="btn-secondary py-2 px-4 text-xs">
                    Retour au registre
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <Link
                    href="/dashboard/submissions"
                    className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour aux demandes</span>
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => generateSubmissionPDF(submission)}
                        className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span>Exporter Fiche</span>
                    </button>
                </div>
            </div>

            {/* Fiche d'identité principale */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border-white/[0.06] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
                    <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                            ID Demande : {submission.id}
                        </span>
                        <h1 className="text-xl font-bold text-white">{submission.full_name}</h1>
                        <span className="text-xs text-slate-400 mt-1 block">
                            Reçue le {submission.created_at ? new Date(submission.created_at).toLocaleString('fr-FR') : '-'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {submission.status || 'En attente'}
                        </span>
                    </div>
                </div>

                {/* Section Spéciale : Code de confirmation reçu du client */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                            <KeyRound className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-white block">Code de Confirmation / Lien Soumis :</span>
                            <span className="text-sm font-mono font-bold text-blue-300">
                                {submission.verification_code || 'En attente de saisie par le client'}
                            </span>
                        </div>
                    </div>

                    {submission.status === 'En attente' && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleUpdateStatus('Approuvé (Attente code)')}
                                disabled={isSaving}
                                className="btn-premium py-1.5 px-4 text-xs font-semibold cursor-pointer"
                            >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approuver l'Examen</span>
                            </button>
                            <button
                                onClick={() => handleUpdateStatus('Rejeté')}
                                disabled={isSaving}
                                className="px-3 py-1.5 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30 text-xs font-semibold cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                                <span>Refuser</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Colonne 1 : Coordonnées */}
                    <div className="space-y-4">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Coordonnées du client</h2>
                        
                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Email :</span>
                                <span className="font-mono text-white">{submission.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Téléphone :</span>
                                <span className="font-mono text-white">{submission.phone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Pays :</span>
                                <span className="text-white">{submission.country_name || '-'} ({submission.country_code || '-'})</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Adresse IP :</span>
                                <span className="font-mono text-slate-300">{submission.ip_address || 'Non journalisée'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Colonne 2 : Compte NexusLink */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Compte NexusLink</h2>
                            <button
                                onClick={() => setShowSensitive(!showSensitive)}
                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                            >
                                {showSensitive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                <span>{showSensitive ? 'Masquer' : 'Révéler'}</span>
                            </button>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Identifiant de compte :</span>
                                <span className="font-mono text-white font-semibold">{submission.account_number}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Mot de passe :</span>
                                <span className="font-mono text-emerald-400 font-semibold">
                                    {showSensitive ? submission.password : '••••••••••••'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section modération & statut */}
                <div className="border-t border-white/[0.06] pt-6 space-y-4">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Décision & Statut</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">Modifier le statut</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="input-field text-xs py-2 px-3"
                            >
                                <option value="En attente">En attente d'examen</option>
                                <option value="Approuvé (Attente code)">Approuvé (Attente code)</option>
                                <option value="Code reçu">Code reçu</option>
                                <option value="Finalisé">Finalisé</option>
                                <option value="Rejeté">Rejeté</option>
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">Notes internes</label>
                            <input
                                type="text"
                                placeholder="ex: Client vérifié par téléphone, message transmis..."
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                className="input-field text-xs py-2"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            onClick={() => handleUpdateStatus()}
                            disabled={isSaving}
                            className="btn-premium py-2 px-5 text-xs font-semibold cursor-pointer disabled:opacity-50"
                        >
                            {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
