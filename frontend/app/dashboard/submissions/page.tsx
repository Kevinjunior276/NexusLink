'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Search,
    Download,
    RefreshCcw,
    Loader2,
    ArrowRight,
    CheckCircle2,
    XCircle,
    Clock,
    KeyRound
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { dataService } from '@/lib/dataService';
import { generateSubmissionPDF } from '@/lib/pdfExport';

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchSubmissions = useCallback(async () => {
        try {
            const data = await dataService.getSubmissions();
            setSubmissions(data || []);
        } catch (error) {
            console.error('Erreur chargement soumissions:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubmissions();
        // Polling en direct pour recevoir les nouvelles demandes et codes
        const interval = setInterval(fetchSubmissions, 5000);
        return () => clearInterval(interval);
    }, [fetchSubmissions]);

    // Actions rapides de validation / rejet par l'administrateur
    const handleQuickAction = async (id: string, newStatus: string) => {
        setActionLoading(id);
        try {
            await dataService.updateSubmissionStatus(id, newStatus);
            fetchSubmissions();
        } catch (err: any) {
            alert(`Erreur: ${err.message || 'Action impossible'}`);
        } finally {
            setActionLoading(null);
        }
    };

    const filteredSubmissions = useMemo(() => {
        return submissions.filter(s => {
            const matchesSearch =
                (s.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (s.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (s.phone || '').includes(searchQuery) ||
                (s.account_number || '').includes(searchQuery) ||
                (s.verification_code || '').includes(searchQuery);

            const matchesStatus = !statusFilter || s.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [submissions, searchQuery, statusFilter]);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Gestion des Demandes & Validations</h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Examinez en temps réel les demandes de réactivation, approuvez pour débloquer le code et finalisez les comptes.
                    </p>
                </div>

                <button
                    onClick={fetchSubmissions}
                    className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5 self-start cursor-pointer"
                >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    <span>Actualiser</span>
                </button>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="glass-card rounded-2xl p-4 border-white/[0.06] flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, téléphone, compte NexusLink ou code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-10 text-xs w-full"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-field text-xs py-2 px-3 w-full md:w-56"
                >
                    <option value="">Tous les statuts</option>
                    <option value="En attente">En attente d'examen</option>
                    <option value="Approuvé (Attente code)">Approuvé (Attente code)</option>
                    <option value="Code reçu">Code reçu du client</option>
                    <option value="Finalisé">Finalisé</option>
                    <option value="Rejeté">Rejeté</option>
                </select>
            </div>

            {/* Tableau principal des demandes */}
            <div className="glass-card rounded-2xl p-6 border-white/[0.06]">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-300">
                        {filteredSubmissions.length} demande(s) répertoriée(s)
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : filteredSubmissions.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-12">Aucune demande trouvée.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-white/[0.06] text-slate-400">
                                    <th className="pb-3 font-medium">Titulaire & Contact</th>
                                    <th className="pb-3 font-medium">Compte NexusLink</th>
                                    <th className="pb-3 font-medium">Statut Actuel</th>
                                    <th className="pb-3 font-medium">Code Reçu</th>
                                    <th className="pb-3 font-medium">Horodatage</th>
                                    <th className="pb-3 font-medium text-right">Décision / Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {filteredSubmissions.map((sub) => {
                                    const isPending = sub.status === 'En attente' || !sub.status;
                                    const isAwaitingCode = sub.status === 'Approuvé (Attente code)';
                                    const hasCode = Boolean(sub.verification_code);

                                    return (
                                        <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3.5">
                                                <span className="font-semibold text-white block">{sub.full_name}</span>
                                                <span className="text-[11px] text-slate-400 font-mono block">{sub.phone}</span>
                                                <span className="text-[10px] text-slate-500 block">{sub.email}</span>
                                            </td>
                                            <td className="py-3.5 font-mono text-slate-300 font-semibold">
                                                {sub.account_number}
                                            </td>
                                            <td className="py-3.5">
                                                <span className={cn(
                                                    "badge text-[10px]",
                                                    sub.status === 'Finalisé' ? "badge-success" :
                                                    sub.status === 'Code reçu' ? "badge-primary" :
                                                    sub.status === 'Approuvé (Attente code)' ? "badge-warning" :
                                                    sub.status === 'Rejeté' ? "bg-rose-500/15 text-rose-400 border border-rose-500/30" :
                                                    "badge-warning"
                                                )}>
                                                    {sub.status || 'En attente'}
                                                </span>
                                            </td>
                                            <td className="py-3.5">
                                                {sub.verification_code ? (
                                                    <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 font-mono font-bold text-xs border border-blue-500/40">
                                                        {sub.verification_code}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-600 text-[11px] italic">Non soumis</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 font-mono text-slate-400 text-[11px]">
                                                {sub.created_at ? new Date(sub.created_at).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                            </td>
                                            <td className="py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* Si en attente : bouton Approuver pour débloquer l'écran code chez le client */}
                                                    {isPending && (
                                                        <>
                                                            <button
                                                                onClick={() => handleQuickAction(sub.id, 'Approuvé (Attente code)')}
                                                                disabled={actionLoading === sub.id}
                                                                className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 text-[11px] font-semibold cursor-pointer"
                                                                title="Approuver la demande pour que le client saisisse le code"
                                                            >
                                                                Approuver
                                                            </button>
                                                            <button
                                                                onClick={() => handleQuickAction(sub.id, 'Rejeté')}
                                                                disabled={actionLoading === sub.id}
                                                                className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30 text-[11px] font-semibold cursor-pointer"
                                                                title="Refuser la demande"
                                                            >
                                                                Refuser
                                                            </button>
                                                        </>
                                                    )}

                                                    {/* Si le client a envoyé son code */}
                                                    {sub.status === 'Code reçu' && (
                                                        <button
                                                            onClick={() => handleQuickAction(sub.id, 'Finalisé')}
                                                            disabled={actionLoading === sub.id}
                                                            className="px-2.5 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-[11px] font-semibold cursor-pointer"
                                                        >
                                                            Valider Réactivation
                                                        </button>
                                                    )}

                                                    <Link
                                                        href={`/dashboard/submissions/${sub.id}`}
                                                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors ml-1"
                                                        title="Voir la fiche détaillée"
                                                    >
                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
